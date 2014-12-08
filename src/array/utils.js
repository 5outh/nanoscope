var normalizeIndex, isValidIndex;

/**
 * Normalize a negative index to pull from the end of an array.
 *
 * @param arr
 * @param index
 * @returns {*}
 */
normalizeIndex = function (arr, index) {
    if (index < 0) {
        return arr.length + index;
    }
    return index;
};

/**
 * Checks if the index being accessed is allowed to be accessed
 *
 * @param arr
 * @param index
 * @returns {boolean}
 */
isValidIndex = function (arr, index) {
    return index >= 0 && index <= arr.length;
};

module.exports = {
    normalizeIndex: normalizeIndex,
    isValidIndex: isValidIndex
};