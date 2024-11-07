module.exports = function( config, name ) {
  config.set({

    frameworks: ["mocha", "karma-typescript"],

    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "test/**/*.ts" }
    ],

    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },

    reporters: ["dots", "karma-typescript"],

    browsers       : ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base : 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        acornOptions: {
          ecmaVersion: 2018,
        },
      },
      tsconfig: "tsconfig.spec.json",
      reports:
      {
        "html": {
          "directory": `../../coverage/${name}`
        },
        "text-summary": "",
        "json-summary": {
          "directory": `../../coverage/${name}`,
          "filename": "json-summary.json"
        }
      },
    },

    singleRun: true
  });
};
