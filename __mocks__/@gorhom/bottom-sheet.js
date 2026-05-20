// Use the package's bundled mock so the native sheet doesn't try to
// mount. Visibility, animations, and gestures are not unit-tested.
module.exports = require('@gorhom/bottom-sheet/mock');
