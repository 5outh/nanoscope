var _ = require('lodash'),
    nanoscope = require('./src/nanoscope'),
    standard = require('./lib/standard'),
    lenses;

lenses = {
    Lens: require('./src/base/Lens'),

    // Predefined Lenses
    IndexedLens: require('./src/array/IndexedLens'),
    FilterLens: require('./src/array/FilterLens'),
    SliceLens: require('./src/array/SliceLens'),
    PathLens: require('./src/object/PathLens'),
    PluckLens: require('./src/object/PluckLens'),

    // Composite Lenses
    Compose: require('./src/combinator/Compose'),
    Optional: require('./src/combinator/Optional'),
    MultiLens: require('./src/combinator/MultiLens'),
    DisjunctiveLens: require('./src/combinator/DisjunctiveLens'),
    ConjunctiveLens: require('./src/combinator/ConjunctiveLens'),

    // Special Cases
    Getter: require('./src/base/Getter'),
    Setter: require('./src/base/Setter')
};

module.exports = _.extend(nanoscope, standard, lenses);