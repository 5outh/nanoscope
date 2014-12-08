/**
 * Top-level exports
 *
 * @type {{Lens: (Lens|exports), Compose: (Compose|exports), IndexedLens: (IndexedLens|exports), PathLens: (PathLens|exports)}}
 */
module.exports = {
    Lens: require('./src/Lens'),
    Compose: require('./src/compose/Compose'),
    IndexedLens: require('./src/array/IndexedLens'),
    PathLens: require('./src/object/PathLens')
};