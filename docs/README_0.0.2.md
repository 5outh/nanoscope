<a href="https://github.com/5outh/nanoscope"><img src="NanoscopeLogo.png" width="400px"></img></a>
## A Lens Library for Javascript

Installation is easy:

```
$ npm install nanoscope
```

### What is a Lens?

A `Lens` is a construct that allow you to peer into data structures and modify their contents. At base level, a `Lens`
consists of a getter and a mapping function over a specific sub-part of your data. `Lens`es allow you to modify data
in interesting ways with minimal code, and `nanoscope` contains many useful `Lens`es that you can plug into your existing
code and use right out of the box, that provide things like:

- Safe traversal of deeply nested data structures
- Easy access and modification of single array elements
- Access and modification of complete array slices, including modifications of size
- A wrapper for safe access and modification of data through any `Lens`

### The `Lens` Interface

`Lens`es support the following operations:

- `get`, which gets the value at the focus of the `Lens`
- `set`, which sets the value at the focus of the `Lens`
- `map`, which maps a function over the focus of the `Lens`
- `view`, which sets the view of the `Lens` to a new value
- `compose`, which composes the `Lens` with another lens, allowing sequencing of actions.
- `add`, which adds another `Lens` focus to the lens, allowing multiple focal points.

Assuming `headLens` is a `Lens` that focuses on the first element of an array, they can be used like this:

```js
headLens.get([1, 2, 3]); // => 1
// or
headLens.view([1, 2, 3]).get(); // =>  1

headLens.set([1, 2, 3], 99); // =>  [99, 2, 3]
// or
headLens.view([1, 2, 3]).set(99); // =>  [99, 2, 3]

headLens.map([1, 2, 3], function (elem) { return elem * 10; }); // =>  [10, 2, 3]
// or
headLens.view([1, 2, 3]).map(function (elem) { return elem * 10; }); // =>  [10, 2, 3]

headLens.compose(headLens).view([['what'], 2, 3]).get(); // =>  'what'

// Assume lastLens focuses on the last element
headLens.compose(lastLens).view([1, 2, 3]).get(); // => [1, 3]
```

Of particular interest is `compose`, which allows us to compose a `headLens` with a `headLens` to focus on an array's first
element *of it's first element*, and `add`, which allows us to focus on both the first and last elements of the array
in parallel.

### IndexedLens

`IndexedLenses` focus on a single element of an array, specified by its index. `headLens` as shown above can be built using an
`IndexedLens` like so:

```js
var headLens = new nanoscope.IndexedLens(0);
```

This means that we are focusing on the `0`-th element of an array. `IndexedLenses` are *safe* by default, which means
that they will not throw errors when you try to access elements out of range. For example, `headLens.view([]).get()`
will not throw an error. To make an *unsafe* `IndexedLens`, just use the `Unsafe` constructor:

```js
var unsafeHeadLens = new nanoscope.IndexedLens.Unsafe(0);
```

In an unsafe `IndexedLens`, the following operations will throw an error:

- `get()`, if the index is greater than or equal to the length of the array, and
- `set()`, if the index is strictly greater than the length of the array (you may tack on items to the end of an array)

### SliceLens

`SliceLenses` focus on a subarray within an array. They can be constructed in two ways:

1. By specifying `start` (inclusive) and `end` (exclusive) indices in the constructor, like so:

```js
var firstTwo = new nanoscope.SliceLens(0, 2);
```

2. By specifying a python-style slice as a string as a single argument:

```js
var firstTwo = new nanoscope.SliceLens('0:2');
```

By using the second syntax, you can use any of the python type variants using `:`. For example:

```js
// a `Lens` that focuses on everything but the first element
var tailLens = new nanoscope.SliceLens('1:');

// a `Lens` that focuses on everything but the last element
var initLens = new nanoscope.SliceLens(':-1');
```

Negative indices are accepted, which count backwards from the end of the list.

`SliceLenses` can be used not only to modify the elements in each slice, but it can also modify the length of the slice.
For example:

```js
initLens.view([1, 2, 3, 4]).map(
    function (arr) {
        return _.map(
            arr,
            function (elem) {
                return elem * 2;
            }
        )
    });
// => [1, 4, 6, 4]

// Assume `sum` sums the elements in a list
initLens.view([1, 2, 3, 4]).map(sum);
// => [6, 4]
```

### PathLens

`PathLenses` are used to access nested data inside dynamic objects. They are constructed by passing a string representation
of the path followed to get to the element to focus on, separated by `.`. They are safe by default; this is best illustrated
by an example.

```js
var testObject = {
    a : {
        b: {
            c : 100
        }
    }
};

new nanoscope.PathLens('a.b.c').view(testObject).get();
// => 100

new nanoscope.PathLens('a.b.c.d.e.f').view(testObject).get();
// => null

new nanoscope.PathLens('a.b.c').view(testObject).set('foo');
// => testObject.a.b.c == 'foo'

new nanoscope.PathLens('a.b.c.d.e.f').view(testObject).set('foo');
// => testObject.a.b.c.d.e.f == 'foo'
```

Note that in the last call we're overwriting `testObject.a.b.c`; this is by design, but something to be aware of.
If you prefer that your `PathLens` throw errors when keys in the path don't exist, you can use the `PathLens.Unsafe`
constructor instead; these are constructed in the same way:

```js
new nanoscope.PathLens.Unsafe('a.b.c.d.e.f').view(testObject).get();
// => TypeError: Cannot read property 'e' of undefined
```

One other thing to note is that when using `over` in any `PathLens`, if:

1. You are accessing a field that didn't originally exist, *and*
2. Your function returns `undefined` or `null`,

your structure will be unmodified. This prevents things like:

```js
new nanoscope.PathLens('a.b.c.e.f.g').view({}).over(function (elem) { return elem * 2; });
```

... from producing this:

```js
{ a: { b: { c: { d: { e: { f: { g: undefined } } } } } } }
```

Instead, it will not modify the object and, in this case, simply return `{}`.

### Optional

`Optional` `Lenses` wrap any `Lens` in a function that catches any errors that may happen along the way. They are
constructed with the `Optional` constructor, which takes any `Lens` as an argument, along with an optional `errorHandler`
function, This function will be called on any errors that may occur during the execution of any `Lens` operations,
and if omitted, these errors will cause `get` to silently return `null`, and `set`/`map` to silently
return the object passed in. `errorHandler` may also be a default value that you would prefer
to return upon any errors.

For example, we can take an `Unsafe IndexedLens` and wrap it in `Optional` in order to handle incoming errors as they
are thrown:

```js
var Optional = nanoscope.Optional,
    IndexedLens = nanoscope.IndexedLens,
    lens;

lens = new Optional( new IndexedLens.Unsafe(10) );
lens.view([]).get(); // => null
lens.view([]).set(0); // => []

lens = new Optional( new IndexedLens.Unsafe(10), 'FAIL!' );
lens.view([]).get(); // => 'FAIL!'
lens.view([]).set(0); // => 'FAIL!'

lens = new Optional( new IndexedLens.Unsafe(10), console.log);
lens.view([]).get(); // => logs 'Error: Array index 10 out of range', returns undefined
lens.view([]).set(0); // => logs 'Error: Array index 10 out of range', returns undefined
```

One major thing to note is that `Optional Lenses` do **not** catch errors from calls to unimplemented functions in
`Getters` and `Setters`. That is, calling `setter.get` and `getter.set` will still fail. This is by design, as these types
of errors are logical in nature and should be caught by the programmer in all cases.

### Compose

`Compose` is a wrapper (like `Optional`) that takes two `Lenses` and returns a new `Lens` that first focuses on the
focus of the first `Lens`, and then on the second, in sequence. The `compose()` method constructs a `Compose` `Lens` under
the hood, so the behavior is exactly the same. For a short example, consider an object with an array for one of the keys:

```js
var obj = {
    a: {
        anArray: [99, 2, 3, 4]
    }
}
```

And say that we want a `Lens` that focuses on the second object in `anArray`. We can easily accomplish this with
composite lenses:

```js
var lensA = new nanoscope.PathLens('a.anArray'),
    lensB = new nanoscope.IndexedLens(1),
    composite = new nanoscope.Compose(lensA, lensB)
    // or composite = lensA.compose(lensB);

composite.view(obj).get(); // => 2
composite.view(obj).set(1); // => { a: { anArray: [99, 1, 3, 4] } }
```

`composite` first looks at the focus of `lensA`, then at the focus of `lensB` starting at the focus of `lensA` and uses
this as its own focus.

### MultiLens

`MultiLenses` allow you to focus on many different things at once and return them all at once. `MultiLens` is a sort of
concurrent version of `Compose`. It takes either an Array of `Lenses` or an object with `Lenses` as values, and produces
a `Lens` whose focus is all of the focuses in this argument. If the argument is an object, `get` will name each of the outputs
in an object; if not, it will return an array of unnamed results. `set` and `map` will set *every* focus of the lens.

`MultiLenses` can also be constructed using the `add` method in any `Lens`, just like `compose` above.

Here is a simple example of a `MultiLens` in action:

```js
var arrayLenses = [
            new nanoscope.IndexedLens(0),
            new nanoscope.IndexedLens(1)
    ],
    objectLenses = {
        head: new nanoscope.IndexedLens(0),
        last: new nanoscope.IndexedLens(-1)
    },
    // A MultiLens built from an Array
    arrayMultiLens = new nanoscope.MultiLens(arrayLenses),
    // or arrayMultiLens = new nanoscope.IndexedLens(0).add(new nanoscope.IndexedLens(1));
    // A MultiLens built from an Object
    objectMultiLens = new nanoscope.MultiLens(objectLenses);

arrayMultiLens.view([1, 2]).get(); // => [1, 2]
arrayMultiLens.view([1, 2]).set('g'); // => ['g', 'g']

objectMultiLens.view([1, 2, 3]).get(); // => { head: 1, last: 3 }
objectMultiLens.view([1, 2, 3]).set('g'); // => ['g', 2, 'g']
```

### Getters and Setters

`Getters` are `Lenses` that only support `get()`, and `Setters` are `Lenses` that only support `over` and `set`.
`Getters` and `Setters` are constructed with `get` functions and `over` functions *only*, respectively. They can also be
constructed by using the `fromLens` static function in `Getter` and `Setter`, which simply replaces the old `over`/`get`
operations in the original `Lens`. Constructing your own `Lenses`, `Getters` and `Setters` is described below, but here is
an example of how `fromLens` works:

```js
var Getter = nanoscope.Getter,
    Setter = nanoscope.Setter,
    IndexedLens = nanoscope.IndexedLens;

Getter.fromLens(new IndexedLens(0)).view([1]).get(); // => 1
Getter.fromLens(new IndexedLens(0)).view([1]).set(10); // => Error: map not permitted in a Getter

Setter.fromLens(new IndexedLens(0)).view([1]).set(10); // => [10]
Setter.fromLens(new IndexedLens(0)).view([1]).get(); // => Error: get not permitted in a Setter
```

These are useful when you want to restrict access to certain parts of your structures, but still use any `Lenses`
to access data in one or more ways.

### Making your own `Lens`es
Consider a `Lens` that views an array and focuses on its first element.
The `get` function for this `Lens` might look like this:

```js
var get = function (arr) {
    return arr[0];
};
```

...and `map` might be defined like so:

```js
var map = function (arr, func) {
    var newArr = _.cloneDeep(arr);
    newArr[0] = func(newArr[0]);
    return newArr;
};
```

There are a couple of things to note here:

1. We use `_.cloneDeep` from `lodash` (or `underscore`) to clone the object, because `Lens`es should provide immutable
access to data.
2. `func` is a function that operates on the focus of the `Lens`, which in this case is `arr[0]`.
3. We return the full, modified structure at the end.

We can construct a `Lens` from these bindings like so:

```js
var nanoscope = require('nanoscope'),
    headLens = new nanoscope.Lens(get, map);
```

All valid `Lens`es must also satisfy the so-called "Lens Laws":

1. set-get (you get what you put in): `lens.get(lens.set(a, b)) = b`
2. get-set (putting what is there doesn't change anything): `lens.set(a, lens.get(a)) = a`
3. set-set (setting twice is the same as setting once): `lens.set(c, lens.set(b, a)) = lens.set(c, a)`

These laws ensure that `map`, `set` and `get` behave in the manner you'd expect. If you can convince yourself
that these laws are satisfied, you can rest easy knowing your `Lens` is well-behaved.