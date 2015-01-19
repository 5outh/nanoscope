<img src="NanoscopeLogo.png" width="400px"></img>

<img src="https://travis-ci.org/5outh/nanoscope.svg?branch=master"></img> [![Coverage Status](https://coveralls.io/repos/5outh/nanoscope/badge.svg?branch=pluck-extensions)](https://coveralls.io/r/5outh/nanoscope?branch=pluck-extensions)
[![NPM](https://nodei.co/npm/nanoscope.png?mini=true)](https://nodei.co/npm/nanoscope/)

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

That's a little confusing. Let's look at an example:

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

<Description>

##### Example

```js
```

#### `set`

##### Description

<Description>

##### Example

```js
```

#### `map`

##### Description

<Description>

##### Example

```js
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
after the end of an array.

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

<Description>

##### Example

```js
```

#### `unsafePath`

##### Description

<Description>

##### Example

```js
```

#### `pluck`

##### Description

<Description>

##### Example

```js
```

#### `recursivePluck`

##### Description

<Description>

##### Example

```js
```

### Other functions

#### `getter`

##### Description

<Description>

##### Example

```js
```

#### `setter`

##### Description

<Description>

##### Example

```js
```

## Contributing

TODO

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
