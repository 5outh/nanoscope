<img src="NanoscopeLogo.png" width="400px"></img>

[![NPM](https://nodei.co/npm/nanoscope.png?mini=true)](https://nodei.co/npm/nanoscope/)

<img src="https://travis-ci.org/5outh/nanoscope.svg?branch=master"></img> [![Coverage Status](https://coveralls.io/repos/5outh/nanoscope/badge.svg?branch=master)](https://coveralls.io/r/5outh/nanoscope?branch=master)

## What is nanoscope?

`nanoscope` lets you wrangle your data like never before. It enables:

* Safe access of deeply-nested objects,
* Complex modifications of arbitrary data structures
* Immutable data transformations
* and more!

## What can I do with nanoscope?

The general flow of using `nanoscope` goes like this:

1. Provide the structure you want to get pieces from and/or transform to `nanoscope`,
2. Add lens rules to the `nanoscope` instance, which specify the pieces you want to look at, and finally
3. call `get()`, `set()` or `map()` to perform some action on your data.

Let's look at an example:

```js
var nanoscope = require('nanoscope'),
    lens = nanoscope({
        a: {
            b: [{c : 0, d: 0, D: 99}, 2, 3]
        }
    });

lens.path('a.b')
    .index(0)
    .pluck(/[a-z]*/)
    .set(100);
// => {
//      a: {
//          b: [{c : 100, d: 100, D: 99}, 2, 3]
//       }
//    }
```

This traverses the object following the path `a.b`, looks at the first element, plucks out only the lowercase
properties from this element, sets each of them to 100 and returns a modified structure.

All the way up to the `.set()` call, you're constructing pure data. You don't actually call any functions on the
original object until `.set()` is called. This means that you can keep a reference to the lens in question like this instead:

```js
lens = lens.path('a.b').index(0).pluck(/[a-z]*/);
```

And call `get()`, `set()` and `map()` on that lens directly whenever necessary. You can even specify further lens rules
later on, like so:

```js
lens.pluck(['c']).get();
// => { c: 0 }
```

This allows for quite a bit of flexibility.

## API

### Final functions

#### `get`

##### Description

Get the value(s) at the focus of the lens and return them.

##### Example

```js
var lens = nanoscope([1, 2, 3]).index(2);

lens.get();
// #=> 3
```

#### `set`

##### Description

Set the value(s) at the focus of the lens and return a modified structure.

##### Example

```js
var lens = nanoscope.index([1, 2, 3]).index(2);

lens.set(100);
// #=> [1, 2, 100]
```

#### `map`

##### Description

Transform the value(s) at the focus of the lens using a transformation function.

##### Example

```js
var lens = nanoscope.index([1, 2, 3]).index(2);

lens.map(function (num) {
    return (num * num);
});
// #=> [1, 2, 9]
```

### Top-level/chainable nanoscope functions

#### `filter`

##### Description

Focus on elements of an array filtered by a regular expression or function.

##### Example

```js
nanoscope([1, 2, 3]).filter(function (elem) {
    return (elem % 2 === 0);
}).set(100);
// #=> [1, 100, 3]

nanoscope(['a', 'B', 'C']).filter(/[a-z]/).get();
// #=> ['a']
```

#### `index`

##### Description

Focus on the element of an array at a given index. Returns `undefined` if the index is out of bounds.

##### Example

```js
nanoscope([1, 2, 3]).index(0).map(function (num) {
    return (num + 100);
});
// #=> [101, 2, 3]
```

#### `unsafeIndex`

##### Description

Same as `index`, but throws errors if trying to access an element outside of array bounds. Allows setting the element
directly after the end of an array (`arr[arr.length]`).

#### `slice`

##### Description

Focus on a slice of an array. A slice can be specified using either start and end bounds (negative bounds count from
the end of an array) or by a string in python-style syntax (i.e '1:10').

##### Example

```js
nanoscope([1, 2, 3]).slice('1:').get();
// #=> [2, 3]

nanoscope([1, 2, 3]).slice(0, -1).set([5, 4]);
// #=> [5, 4, 3]
```

#### `path`

##### Description

Focus on the value located at some path in an object. Paths are given by `.`-separated strings. If the value at a
path doesn't exist (i.e. accessing `{}.a.b`), `get()` will return `undefined`, even if it would otherwise throw
an error. `set()` will set the value, adding properties as necessary. `map()` will do the same, but if its output
returns `undefined`, the structure will be unmodified. Note that setting values that don't exist can
overwrite parent objects (see the final example below).

##### Example

```js
var obj = {
    a: {
        b: 'flintstones'
    }
}, lens = nanoscope(obj);

nanoscope.path('a.b').get();
// #=> 'flintstones'

nanoscope.path('a.b.c.d').get();
// #=> undefined

nanoscope.path('a.b.c.d').set('vitamins');
// #=> { a: { b: { c: { d: 'vitamins } } } }
```

#### `unsafePath`

##### Description

The same as `path`, but does not attempt to catch errors and will instead throw them.

##### Example

```js
nanoscope({}).path('a.b').get();
// #=> Error: Cannot read property 'b' of undefined
```

#### `pluck`

##### Description

Focus on a set of properties in an object matching one of:

* an array of properties (e.g. `['a', 'b']`),
* a regular expression (e.g `/[a-b]/`)
* or a function (e.g `function (prop) { return prop.match(/[a-b]/); }`

Note that this does not recurse into subobjects, and only operates on the top-level properties.

##### Example

```js
var lens = nanoscope({
    'abc' : 1,
    'def' : 2,
    'WAT' : null
});

lens.pluck(['abc']).get();
// #=> { 'abc': 1 }

lens.pluck(/[a-d]*/).get();
// #=> { 'abc': 1, 'def': 2 }

lens.pluck(function (prop) {
    return prop === 'WAT'
}).set('unknown');
// #=> { 'abc': 1, 'def': 2, 'WAT': 'unknown' }
```

#### `recursivePluck`

##### Description

The same as `pluck`, but recurses into subobjects.

##### Example

```js
var lens = nanoscope({
    a: { b: 100, C: 99 }
});

lens.pluck(/[a-z]/).get();
// #=> { a: { b: 100 } }
```

### Other functions

#### `catch`

##### Description

Catch any errors thrown during extraction/transformation of data and optionally handle them with an error handler.
Typically will be used with unsafe operations. Called at the end of a chain.

##### Example

```js
var lens = nanoscope([]).unsafeIndex(10000).catch(console.log);

lens.get();
// logs [Error: Attempt to access invalid index 10000]

```

#### `getter`

##### Description

Disallow `set()` and `map()` in a lens. Called at the end of a chain.

##### Example

```js
var lens = nanoscope([1]).index(0).getter();

lens.get();
// #=> 1

lens.set(100);
// #=> Error: map not permitted in a Getter
```

#### `setter`

##### Description

Disallow `get()` in a lens. Called at the end of a chain.

##### Example

```js
var lens = nanoscope({ a: 100 }).path('a').setter();

lens.set(30);
// #=> { a: 30 }

lens.get();
// #=>  Error: get not permitted in a Setter
```

## Contributing

Feature requests, pull requests, code reviews, comments and concerns are more than welcome. If you have an issue with
nanoscope, please file it [on github](https://github.com/5outh/nanoscope/issues). When submitting pull requests, please create a feature branch and explain in detail what
you've changed and why.

Before adding features, please submit a feature request through the issue tracker on github. I will not add features to nanoscope blindly, but would love to hear
your ideas! Once a feature request is approved (I'll just comment saying it's cool), anyone can work on it and submit a pull request for review.

When submitting pull requests, please:

1. Make sure that tests are passing (run `npm test` with mocha installed globally (`npm install -g mocha`)), and
2. Add at least one test that tests the feature you are adding or fixing.

All PRs will be run through Travis for automatic testing and Coveralls for code coverage information. If the code coverage percentage
has dropped, be prepared to explain why in your pull request.

Thanks your support of the project, and happy hacking!

## License

The MIT License (MIT)

Copyright (c) 2015 Benjamin Kovach

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
