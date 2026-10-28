// Xcode's user script sandboxing blocks the "Bundle React Native code and images" phase from
// writing ip.txt into the .app on Debug device builds (deny file-write-create ... ip.txt).
const { withXcodeProject } = require("expo/config-plugins");

module.exports = (config) =>
  withXcodeProject(config, (c) => {
    for (const cfg of Object.values(c.modResults.pbxXCBuildConfigurationSection())) {
      if (cfg.buildSettings) cfg.buildSettings.ENABLE_USER_SCRIPT_SANDBOXING = "NO";
    }
    return c;
  });
