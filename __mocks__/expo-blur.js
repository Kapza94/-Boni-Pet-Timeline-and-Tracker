// Replace BlurView with a plain View so component tests render without GPU.
const React = require('react');
const { View } = require('react-native');

const BlurView = (props) => React.createElement(View, props);

module.exports = { BlurView };
