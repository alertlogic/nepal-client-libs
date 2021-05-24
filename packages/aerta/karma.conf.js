module.exports = function (config) {
    config.set({

        frameworks: ["mocha", "karma-typescript"],

        files: [
            {pattern: "src/**/*.ts"},
            {pattern: "test/**/*.ts"}
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        reporters: ["dots", "karma-typescript"],

        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox'],
            },
        },

        karmaTypescriptConfig: {
            bundlerOptions: {
                acornOptions: {
                    ecmaVersion: 8,
                },
            },
            tsconfig: "tsconfig.spec.json",
            reports:
                {
                    "html": {
                        "directory": "./../../coverage/aerta-client",
                        "subdirectory": "report"
                    },
                    "text-summary": "",
                    "json-summary": {
                        "directory": "./../../coverage/aerta-client",
                        "subdirectory": "summary",
                        "filename": "json-summary.json"
                    }
                },
        },

        singleRun: true
    });
};
