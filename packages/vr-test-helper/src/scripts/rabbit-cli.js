
const Jasmine = require('jasmine');
const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');
const ScreenshootReport = require('./screenshoot-json-report');

const alVRTestHelper = require('../index.cjs');

// We read the specs of the arguments
const specs = (process.argv.slice(2));
const jasmine = new Jasmine();

/**
 * Jasmine
 */
jasmine.loadConfig({
  spec_files: specs,
  stopSpecOnExpectationFailure: true,
});

jasmine.onComplete(async () => {
  // We should close the browser after the tests finish
  const page = jasmine.env['page'];
  await page.close();
  process.exit();
});

jasmine.jasmine['DEFAULT_TIMEOUT_INTERVAL'] = 100000;

// Sometimes the visual regression tests are written in a single "it" so we must change the timeout for a higher one.
if (process.env.SUITE === 'visualRegression') {
  jasmine.jasmine['DEFAULT_TIMEOUT_INTERVAL'] = 600000;
}

/**
 * Reports
 */

// Report that we see in the console
const specReporter = new SpecReporter({
  spec: {
    displayStacktrace: true,
    displaySuccessesSummary: true,
    displayFailuresSummary: true
  }
});

jasmine.env.clearReporters();
jasmine.addReporter(specReporter);

const init = async () => {
  // We create the browser instance and save it in the jasmine environment variables to later use it in the specs
  const browser = await puppeteer.launch({
    headless: false,
    
  });
  let page = (await browser.pages())[0];
  // We save the page object that we will later use in the specs and reports
  jasmine.env['page'] = page;

  // We add the screenshot report after initializing the page
  if(process.env.SUITE !== 'visualRegression'){
    jasmine.addReporter(new ScreenshootReport({
      file: './reports_e2e/screenshot-report-' + new Date().getTime() + '.json'
    }));
  }
  // We add the console report
  alVRTestHelper.consoleJSONReport(page, ['error']);
  jasmine.execute();
};
// We initialize the tests
init();
