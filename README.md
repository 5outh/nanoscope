<img src="NanoscopeLogo.png" width="400px"></img>
## A Lens Library for Javascript

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

Assuming `headLens` is a `Lens` that focuses on the first element of an array, they can be used like this:

```js
headLens.get([1, 2, 3]); // 1
// or
headLens.view([1, 2, 3]).get(); // 1

headLens.set([1, 2, 3], 99); // [99, 2, 3]
// or
headLens.view([1, 2, 3]).set(99); // [99, 2, 3]

headLens.map([1, 2, 3], function (elem) { return elem * 10; }); // [10, 2, 3]
// or
headLens.view([1, 2, 3]).map(function (elem) { return elem * 10; }); // [10, 2, 3]

headLens.compose(headLens).view([['what'], 2, 3]).get() // 'what'
```

Of particular interest is `compose`, which allows us to compose a `headLens` with a `headLens` to focus on an array's first
element *of it's first element*.

### IndexedLens

`IndexedLenses` allow you to focus on a single element of an array. `headLens` as shown above can be built using an
`IndexedLens` like so:

```js
var headLens = new nanoscope.IndexedLens(0);
```

This means that we are focusing on the `0`-th element of an array. `IndexedLens`es are *safe* by default, which means
that they will not throw errors when you try to access elements out of range. For example, `headLens.view([]).get()`
will not throw an error. To make an *unsafe* `IndexedLens`, just use the `Unsafe` constructor:

```js
var unsafeHeadLens = new nanoscope.IndexedLens.Unsafe(0);
```

In an unsafe `IndexedLens`, the following operations will throw an error:

- `get()`, if the index is greater than or equal to the length of the array, and
- `set()`, if the index is strictly greater than the length of the array (you may tack on items to the end of an array)

### SliceLens

TODO

### PathLens

TODO

### Optional

TODO

### Compose

TODO

### MultiLens

TODO

### Getters and Setters

TODO

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

1. set-get (you get what you put in): `lens.get(a, lens.set(a, b)) = b`
2. get-set (putting what is there doesn't change anything): `lens.set(a, lens.get(a)) = a`
3. set-set (setting twice is the same as setting once): `lens.set(c, lens.set(b, a)) = lens.set(c, a)`

These laws ensure that `map`, `set` and `get` behave in the manner you'd expect. If you can convince yourself
that these laws are satisfied, you can rest easy knowing your `Lens` is well-behaved.

## TODO
- Documentation (incl. lens laws)!
- <s>Unsafe `PathLens`</s>
- <s>Use actual inheritance instead of making up my own</s>
- <s>Change 'options' to 'flags' and put flags in own sub-property instead of
top-level (i.e. `_flags: { _index: 0}` instead of just `_index: 0`)</s>
- <s>Identity Lens</s>
- <s>MultiLenses (View multiple things at once return them all)</s>
- <s>SliceLenses (View index ranges of arrays)</s>
- <s>Lens derivation from objects (`PathLens`es) and arrays (`IndexedLens`es)</s>