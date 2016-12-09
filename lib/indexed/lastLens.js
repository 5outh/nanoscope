import _ from 'lodash';
import IndexedLens from 'array/IndexedLens';

// lastLens is just an IndexedLens that indexes on the last element.
export default lastLens = new IndexedLens(-1);
