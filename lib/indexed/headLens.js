import IndexedLens from 'array/IndexedLens';

// A headLens is just an `IndexedLens` with index 0.
export default headLens = new IndexedLens(0);
