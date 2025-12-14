const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withCustomNetworkConfig(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Ensure application tag exists
    if (!androidManifest.application) {
      androidManifest.application = [{}];
    }

    if (!androidManifest.application[0].$) {
      androidManifest.application[0].$ = {};
    }

    // Force add usesCleartextTraffic
    androidManifest.application[0].$["android:usesCleartextTraffic"] = "true";

    return config;
  });
};
