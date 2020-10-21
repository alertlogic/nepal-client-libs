import fs from 'fs';
import path from 'path';
import { ensureDirectoryExistence, takeScreenshotPuppetter } from './element-helpers';

export class ScreenshootReport {
    private options;
    private specResults = [];
    private masterResults = Object.create(null);
    private asyncFlow = null;
    constructor(opts){
        this.options = opts;
    }

    jasmineStarted = () => {
        beforeEach(() => this.awaitAsyncFlow());
        afterAll(() => this.awaitAsyncFlow());
    }

    /**
     * https://github.com/Evilweed/protractor-beautiful-reporter/blob/master/app/reporter.js
     * @hack: `_awaitAsyncFlow` waits for `specDone` task to finish before running the next spec.
     */
    awaitAsyncFlow = async () => {
        await this.asyncFlow;
        this.asyncFlow = null;
    }

    addTaskToFlow = (callback) => {
        if (this.asyncFlow == null) {
           this.asyncFlow = callback();
        } else {
            this.asyncFlow = this.asyncFlow.then(callback);
        }
    }

    asyncSpecDone = async(spec) => {
        const page = jasmine.getEnv()['page'];
        const screenshot = await  takeScreenshotPuppetter(page, path.dirname(this.options.file)+'/e2e');
        spec['screenshot'] = screenshot.replace('./reports_e2e/','');
        this.specResults.push(spec);
    }

    asyncSuiteDone = (suite) => {
        suite.specs = this.specResults;
        this.masterResults[suite.id] = suite;
        this.specResults = [];
    }

    suiteDone = (suite) => {
        this.addTaskToFlow(async () => this.asyncSuiteDone(suite));
    }

    specDone = (spec) => {
        this.addTaskToFlow(async () => this.asyncSpecDone(spec));
    }

    jasmineDone = () => {
        const resultsOutput = JSON.stringify(this.masterResults, null, 4);
        ensureDirectoryExistence(this.options.file);
        fs.writeFileSync(this.options.file, resultsOutput);
    }
}
