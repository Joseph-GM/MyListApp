module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin', // reanimated plugin보다 위/아래 상관없이 둘 다 필요
  ],
};
