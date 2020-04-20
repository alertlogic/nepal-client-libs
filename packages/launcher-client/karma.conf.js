module.exports = function (config) {
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

    browsers: ["ChromeHeadless"],

    karmaTypescriptConfig: {
      reports:
      {
        "html": {
          "directory": "coverage",
          "subdirectory": "report"
        },
        "text-summary": ""
      },
      compilerOptions: {
        lib: [
          "es2015",
          "dom"
        ]
      }
    },

    singleRun: true
  });
};
