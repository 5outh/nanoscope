module.exports = {
    Lens: require('./src/Lens'),

    // Predefined Lenses
    IndexedLens: require('./src/array/IndexedLens'),
    SliceLens: require('./src/array/SliceLens'),
    PathLens: require('./src/object/PathLens'),
    IdLens: require('./lib/primitives/IdLens'),

    // Composite Lenses
    Compose: require('./src/combinator/Compose'),
    Optional: require('./src/combinator/Optional'),
    MultiLens: require('./src/combinator/MultiLens'),

    // Special Cases
    Getter: require('./src/Getter'),
    Setter: require('./src/Setter'),

    // Standard library

    // Standard IndexedLenses
    headLens: require('./lib/headLens'),
    lastLens: require('./lib/lastLens'),

    // Standard Primitives
    idLens: require('./lib/primitives/idLens'),

    // Standard SliceLenses
    initLens: require('./lib/slice/initLens'),
    tailLens: require('./lib/slice/tailLens')
};