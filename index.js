module.exports = {
    Lens: require('./src/Lens'),

    // Predefined Lenses
    IndexedLens: require('./src/IndexedLens'),
    SliceLens: require('./src/SliceLens'),
    PathLens: require('./src/PathLens'),
    IdLens: require('./lib/primitives/IdLens'),

    // Composite Lenses
    Compose: require('./src/Compose'),
    Optional: require('./src/Optional'),
    MultiLens: require('./src/MultiLens'),

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