// Require from the root of the project
global.requireFromRoot = function (path) {
    "use strict";
    return require(__dirname + '/' + path);
};

module.exports = {
    Lens: require('./src/base/Lens'),

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
    Getter: require('./src/base/Getter'),
    Setter: require('./src/base/Setter'),

    // Standard library

    // Standard IndexedLenses
    headLens: require('./lib/indexed/headLens'),
    lastLens: require('./lib/indexed/lastLens'),

    // Standard Primitives
    idLens: require('./lib/primitives/idLens'),

    // Standard SliceLenses
    initLens: require('./lib/slice/initLens'),
    tailLens: require('./lib/slice/tailLens')
};