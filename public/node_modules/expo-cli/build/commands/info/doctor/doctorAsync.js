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

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _xdl() {
  const data = require("xdl");

  _xdl = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = _interopRequireDefault(require("../../../log"));

  _log = function () {
    return data;
  };

  return data;
}

function _profileMethod() {
  const data = require("../../utils/profileMethod");

  _profileMethod = function () {
    return data;
  };

  return data;
}

function _validateDependenciesVersions() {
  const data = require("../../utils/validateDependenciesVersions");

  _validateDependenciesVersions = function () {
    return data;
  };

  return data;
}

function _windows() {
  const data = require("./windows");

  _windows = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function actionAsync(projectRoot) {
  await (0, _windows().warnUponCmdExe)();
  const {
    exp,
    pkg
  } = (0, _profileMethod().profileMethod)(_config().getConfig)(projectRoot);
  const areDepsValid = await (0, _profileMethod().profileMethod)(_validateDependenciesVersions().validateDependenciesVersionsAsync)(projectRoot, exp, pkg); // note: this currently only warns when something isn't right, it doesn't fail

  await _xdl().Doctor.validateExpoServersAsync(projectRoot);

  if ((await _xdl().Doctor.validateWithNetworkAsync(projectRoot)) === _xdl().Doctor.NO_ISSUES && areDepsValid) {
    _log().default.log(_chalk().default.green(`🎉 Didn't find any issues with the project!`));
  }
}
//# sourceMappingURL=doctorAsync.js.map