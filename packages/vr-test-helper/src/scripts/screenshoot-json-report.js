const fs = require('fs');
const path = require('path');
const alVRTestHelper = require('../index.cjs');

function screenshootReport(opts) {
    options = opts;
    specResults = [];
    masterResults = Object.create(null);
    asyncFlow = null;

    this.jasmineStarted = () => {
        beforeEach(() => awaitAsyncFlow());
        afterAll(() => awaitAsyncFlow());
    }

    /**
     * https://github.com/Evilweed/protractor-beautiful-reporter/blob/master/app/reporter.js
     * @hack: `_awaitAsyncFlow` waits for `specDone` task to finish before running the next spec.
     */
    awaitAsyncFlow = async () => {
        await asyncFlow;
        asyncFlow = null;
    }

    addTaskToFlow = (callback) => {
        if (asyncFlow == null) {
           asyncFlow = callback();
        } else {
            asyncFlow = asyncFlow.then(callback);
        }
    }

    asyncSpecDone = async(spec) => {
        const page = jasmine.getEnv()['page'];
        const screenshot = await alVRTestHelper.takeScreenshotPuppetter(page, path.dirname(options.file)+'/e2e');
        spec['screenshot'] = screenshot.replace('./reports_e2e/','');
        specResults.push(spec);
    }

    asyncSuiteDone = (suite) => {
        suite.specs = specResults;
        masterResults[suite.id] = suite;
        specResults = [];
    }

    this.suiteDone = (suite) => {
        addTaskToFlow(async () => asyncSuiteDone(suite));
    }

    this.specDone = (spec) => {
        addTaskToFlow(async () => asyncSpecDone(spec));
    }

    this.jasmineDone = () => {
        const resultsOutput = JSON.stringify(masterResults, null, 4);
        alVRTestHelper.ensureDirectoryExistence(options.file);
        fs.writeFileSync(options.file, resultsOutput);
    }
}

module.exports = screenshootReport;
