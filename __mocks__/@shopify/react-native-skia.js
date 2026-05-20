// Stub Canvas + primitives to no-op views so AmbientCanvas + future
// Skia code can render in unit tests without a GPU.
const React = require('react');
const { View } = require('react-native');

const passthrough = (props) => React.createElement(View, props);

module.exports = new Proxy(
  { __esModule: true },
  {
    get: (target, key) => {
      if (key === '__esModule') return true;
      if (key in target) return target[key];
      return passthrough;
    },
  }
);
