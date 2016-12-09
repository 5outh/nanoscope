import _ from 'lodash';

import nanoscope from 'nanoscope';
import standard from '../lib/standard';
import Lens from 'base/Lens';
import IndexedLens from 'array/IndexedLens';
import FilterLens from 'array/FilterLens';
import SliceLens from 'array/SliceLens';
import PathLens from 'object/PathLens';
import PluckLens from 'object/PluckLens';

import Compose from 'combinator/Compose';
import Optional from 'combinator/Optional';
import MultiLens from 'combinator/MultiLens';
import DisjunctiveLens from 'combinator/DisjunctiveLens';
import ConjunctiveLens from 'combinator/ConjunctiveLens';

import Getter from 'base/Getter';
import Setter from 'base/Setter';

lenses = {
    Lens,

    // Predefined Lenses
    IndexedLens,
    FilterLens,
    SliceLens,
    PathLens,
    PluckLens,

    // Composite Lenses
    Compose,
    Optional,
    MultiLens,
    DisjunctiveLens,
    ConjunctiveLens,

    // Special Cases
    Getter,
    Setter
};

module.exports = _.extend(nanoscope, standard, lenses);

