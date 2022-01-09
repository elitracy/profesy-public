"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionAsync = actionAsync;

function _config() {
  const data = require("@expo/config");

  _config = function () {
    return data;
  };

  return data;
}

function _envinfo() {
  const data = _interopRequireDefault(require("envinfo"));

  _envinfo = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _ora() {
  const data = require("../../utils/ora");

  _ora = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const packageJSON = require('../../../package.json');

function getEnvironmentInfoAsync() {
  return _envinfo().default.run({
    System: ['OS', 'Shell'],
    Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
    IDEs: ['Xcode', 'Android Studio'],
    Managers: ['CocoaPods'],
    SDKs: ['iOS SDK', 'Android SDK'],
    npmPackages: ['expo', 'react', 'react-dom', 'react-native', 'react-native-web', 'react-navigation', '@expo/webpack-config', '@expo/metro-config', 'babel-preset-expo', 'metro'],
    npmGlobalPackages: ['expo-cli', 'eas-cli']
  }, {
    yaml: true,
    title: `Expo CLI ${packageJSON.version} environment info`
  });
}

async function actionAsync(projectRoot) {
  // Process takes a while so we show a spinner
  const spinner = (0, _ora().ora)(`🔍 Creating Diagnostics`).start();
  const info = await getEnvironmentInfoAsync();
  const workflow = (0, _config().getDefaultTarget)(projectRoot !== null && projectRoot !== void 0 ? projectRoot : process.cwd());
  const lines = info.split('\n');
  lines.pop();
  lines.push(`    Expo Workflow: ${workflow}`); // Stop and hide spinner

  spinner.stop();

  _log().default.log(lines.join('\n') + '\n');
}
//# sourceMappingURL=diagnosticsAsync.js.map