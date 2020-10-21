/**
 * ElementHelpers
 * Class that provides utilities for e2e tests
 */
import * as fs from 'fs';
import * as path from 'path';
import {
    browser,
    ElementFinder,
    ExpectedConditions,
    promise
} from 'protractor';
import { ConsoleMessageType, Page } from 'puppeteer';
import { HTMLTable } from './html-table';
import glob from "glob";

export const WAIT_MAX_TIME = 35000;

interface Coordinates {
    x: number;
    y: number;
}

export function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}


/**
 * Verify if an element has an specific class
 * @param element
 * @param cls
 */
export function hasClass(element, cls) {
    return element.getAttribute('class').then((classes) => classes.split(' ').indexOf(cls) !== -1);
}

export function writeScreenShot(data, filename) {
    console.log('writing file to ' + filename);
    ensureDirectoryExistence(filename);
    fs.writeFileSync(filename, data, { encoding: 'base64' });
    return filename;
}

export async function takeScreenshotPuppetter(page: Page, name: string) {
    const filename = `${name}-${new Date().getTime()}.png`;
    const path = filename.substring(0, filename.lastIndexOf("/"));
    fs.mkdir(path, { recursive: true } ,(err) => {
        if(err){
            return console.error(err);
        }
    });
    await page.setViewport({ width: 1024, height: 768 });
    await page.screenshot({path: filename});
    return filename;
}

export function takeScreenshot(name: string) {
    return browser.takeScreenshot().then((png) => writeScreenShot(png, `${name}-${new Date().getTime()}.png`));
}

/**
 * Wait until an element has a class Name
 * @param element
 * @param className
 */
export function waitForClass(element, className) {
    browser.wait(
        () => hasClass(element, className),
        4000,
        `Not able to find ${className}`,
    );
}

/**
 * Wait for the presence of an element
 * @param element
 * @param message
 */
export function waitForElementPresence(element: ElementFinder, message?: string) {
    const until = ExpectedConditions;
    message = message ? message : `Not able to find element, taking more than ${WAIT_MAX_TIME}ms`;
    browser.wait(
        until.presenceOf(element),
        WAIT_MAX_TIME,
        message,
    );
}

/**
 * @param element
 * @return an object that contains element Coordinates (x,y)
 */
export async function getCoordinates(element: ElementFinder): Promise<Coordinates> {
    const elementPosition = await element.getLocation();
    const coordinates = {
        x: elementPosition.x,
        y: elementPosition.y,
    };
    return coordinates;
}

/**
 * Scrolls to specific 2D position (x,y)
 * @param x
 * @param y
 * @return a promise of a script that scrolls to specific coordinates
 */
export function scrollTo(coordinates: Coordinates): promise.Promise<any> {
    const script = `window.scrollTo(${coordinates.x}, ${coordinates.y});`;
    return browser.executeScript(script);
}

export function scrollToElement(scrollToElement): Promise<unknown> {
    const wd = browser.driver;
    return scrollToElement.getLocation().then(loc => wd.executeScript('window.scrollTo(0,arguments[0]);', loc.y));
}

export async function closeWelcomeDialog(page: Page) {
    try {
        await page.waitForSelector('al-welcome-dialog', { visible: true });
        await page.waitForSelector('al-welcome-dialog a.ui-dialog-titlebar-close', { visible: true });
        await page.waitFor(700);
        await page.click('al-welcome-dialog a.ui-dialog-titlebar-close');
    } catch (error) {
        console.log('Welcome Dialog not found');
    }
}

/**
/**
 * Create a report related to the console, every time a console.error method is called (error ()).
 * this will create a report of only the calls of the console.error
 * @param logs is an array of logs
 * @return void - generates a folder with the report and the evidence called console_error
 */
export async function generateJSONConsoleReport(logs, png) {
    const reportName = './console_error/report_console_error.json';
    if (logs && logs.length > 0) {
        let title = await browser.getTitle();
        title = title ? title.replace(/\|/g, "-") : 'URL';
        const url = await browser.getCurrentUrl();
        const imgName = `evidence/error-${new Date().getTime()}.png`;
        // log.level.value > 900 is an error
        logs = logs.filter((l) => l.level.value > 900);
        if (logs && logs.length > 0) {
            ensureDirectoryExistence(reportName);
            if (!fs.existsSync(reportName)) {
                fs.writeFileSync(reportName, '{"data": [], "errors": 0, "specs": 0}');
            }
            let contents = fs.readFileSync(reportName, 'utf8');
            let reportJson = JSON.parse(contents);
            reportJson['data'].push({logs, title, url, image: imgName});
            let totalSpecs = reportJson['data'].length;
            let totalErrors = reportJson['data'].reduce((acc, r) => r.logs ? r.logs.length + acc : 0, 0);
            reportJson['specs'] = totalSpecs;
            reportJson['errors'] = totalErrors;
            try {
                writeScreenShot(png, `./console_error/${imgName}`);
                fs.writeFileSync(reportName, JSON.stringify(reportJson));
            } catch (err) {
                console.error("Error taking the screenshot", err);
            }
        }
    }
}

/**
 * Create a report related to the console, every time a console API method is called (log (), error (), ...).
 * With the types parameter you can filter which methods you want to report, example:
 *      consoleReport (page, ['error']);
 * this will create a report of only the calls of the console.error
 * If the second parameter is not sent or is an empty array, a report will be created when any console method
 * @param page Page from which you want the console reports
 * @param types list of console methods to filter. (see ConsoleMessageType of Puppeteer)
 * @return void - generates a folder with the report and the evidence called console_error
 */
export function consoleJSONReport(page: Page, types: ConsoleMessageType[] = []) {
    page.on('console', async (msg) => {
        if (types === [] || types.includes(msg.type())) {
            const reportName = './console_error/report-puppeteer.json';
            const title = await page.title();
            // Taking a screenshot when the error appears.
            try {
                await page.waitFor(1000);
                // saving report
                const imgName = await takeScreenshotPuppetter(page, `./console_error/evidence/error`);
                const data = {
                    title: title ? title : 'URL',
                    url: page.url(),
                    message: msg.text() ? msg.text() : '',
                    image: imgName.replace('./console_error/', '')
                };
                ensureDirectoryExistence(reportName);
                if (!fs.existsSync(reportName)) {
                    fs.writeFileSync(reportName, '{"data": [], "errors": 0, "specs": 0}');
                }
                let contents = fs.readFileSync(reportName, 'utf8');
                let reportJson = JSON.parse(contents);
                reportJson['data'].push(data);
                reportJson['errors'] = parseInt(reportJson['errors'], 10) + 1;
                try {
                    fs.writeFileSync(reportName, JSON.stringify(reportJson));
                } catch (err) {
                    console.error("Error taking the screenshot", err);
                }
            } catch (error) {
                console.error("Error taking the screenshot", error);
            }
        }
    });
}

export function generateConsoleHTMLReportPuppeteer() {
    const reportNameJson = './console_error/report-puppeteer.json';
    const reportNameHTML = './console_error/report-puppeteer.html';

    if (fs.existsSync(reportNameJson)) {
        let contents = fs.readFileSync(reportNameJson, 'utf8');
        let jsonData = JSON.parse(contents) as { data : {message: string, title:string, url: string, image: string}[], errors: number, specs: number };
        let report = jsonData.data;
        if(report && report.length > 0) {
            let data = report.map(r => {
                let message =
                    '<ol>'
                    + `<li><pre>${r.message.replace(/(\r\n|\n|\r)/gm, "<br>").replace(/\s/g, "&nbsp;")}</pre></li>`;
                + '</ol>';
                return {
                    'col-1': message,
                    'col-2': `<a href="${r.url}">${r.title}</a>`,
                    'col-3': `<a href="${r.image}" target="_blank"><img class="img-fluid img-thumbnail" src="${r.image}" /></a>`
                };
            });
            const styles = '<head>'
                + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">'
                + `<style>
                                pre {
                                    white-space: pre-wrap;       /* css-3 */
                                    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
                                    white-space: -pre-wrap;      /* Opera 4-6 */
                                    white-space: -o-pre-wrap;    /* Opera 7 */
                                    word-wrap: break-word;       /* Internet Explorer 5.5+ */
                                }
                            </style>`
                + '</head>';
            let header = '<h1>Console Report</h1>'
                + `<p><b>Total specs with errors in console: </b><span class="badge badge-pill badge-danger">${jsonData.specs}</span><br>`
                + `<b>Total errors in console:</b><span class="badge badge-pill badge-danger">${jsonData.errors}</span></p>`;
            const table = (new HTMLTable([
                { key: 'col-1', value: 'Error', width: '50%' },
                { key: 'col-2', value: 'Url', width: '25%' },
                { key: 'col-3', value: 'Screenshot', width: '25%' }
            ], data)).getTable();
            const page = styles + header + table;
            fs.writeFileSync(reportNameHTML, page);
        }
    }
}

export async function generateConsoleHTMLReport(logs, png) {
    await generateJSONConsoleReport(logs, png);
    const reportNameJson = './console_error/report_console_error.json';
    const reportNameHTML = './console_error/report_console_error.html';

    if (fs.existsSync(reportNameJson)) {
        let contents = fs.readFileSync(reportNameJson, 'utf8');
        let jsonData = JSON.parse(contents) as { data : {logs: any[], title:string, url: string, image: string}[], errors: number, specs: number };
        let report = jsonData.data;
        if(report && report.length > 0) {
            let data = report.map(r => {
                let message =
                    '<ol>'
                    + r.logs.map(l => `<li><pre>${l.message.replace(/(\r\n|\n|\r)/gm, "<br>").replace(/\s/g, "&nbsp;")}</pre></li>`).join('');
                + '</ol>';
                return {
                    'col-1': message,
                    'col-2': `<a href="${r.url}">${r.title}</a>`,
                    'col-3': `<a href="${r.image}" target="_blank"><img class="img-fluid img-thumbnail" src="${r.image}" /></a>`
                };
            });
            let header = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">'
                            + '<h1>Console Report</h1>'
                            + `<p><b>Total specs with errors in console: </b><span class="badge badge-pill badge-danger">${jsonData.specs}</span><br>`
                            + `<b>Total errors in console:</b><span class="badge badge-pill badge-danger">${jsonData.errors}</span></p>`;
            const table = (new HTMLTable([
                { key: 'col-1', value: 'Error', width: '50%' },
                { key: 'col-2', value: 'Url', width: '25%' },
                { key: 'col-3', value: 'Screenshot', width: '25%' }
            ], data)).getTable();
            const page = header + table;
            fs.writeFileSync(reportNameHTML, page);
        }
    }
}

/**
 * Create a report in JSON format of the e2e test
 */
export function generateJSONVR() {
    const reportName = './visual-regression/report.json';
    const getAllEvidences = (dir, acc = []) => {
        acc = acc || [];
        const files = fs.readdirSync(dir);
        for (let i in files){
            const name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                getAllEvidences(name, acc);
            } else {
                acc.push(name);
            }
        }
        return acc;
    };
    const evidences = getAllEvidences('./visual-regression');
    const report = {};
    evidences.forEach(e => {
        const name = path.dirname(e).replace('./visual-regression/', '');
        let type = '';
        if (e.includes('pr')) {
            type = 'pr';
        } else if (e.includes('integration')) {
            type = 'integration';
        } else if (e.includes('diff')) {
            type = 'diff';
        }
        if(type){
            if(!report.hasOwnProperty(name)){
                report[name] = {};
            }
            report[name][type] = e.replace('./visual-regression/','');
        }
    });
    ensureDirectoryExistence(reportName);
    fs.writeFileSync(reportName, JSON.stringify(report));
}

/**
 * Create an HTML report of visual regression tests
 */
export async function generateVRHTMLReport() {
    await generateJSONVR();
    const reportNameJson = './visual-regression/report.json';
    const reportNameHTML = './visual-regression/report.html';

    if (fs.existsSync(reportNameJson)) {
        let contents = fs.readFileSync(reportNameJson, 'utf8');
        let jsonData = JSON.parse(contents) as { [name: string]: { pr: string, integration: string, diff: string } };
        if (Object.keys(jsonData).length > 0) {
            let data = Object.keys(jsonData).map((key) => {
                const imgTemplate = '<a href="{1}" target="_blank"><img class="img-fluid img-thumbnail" src="{1}" /></a>';
                return {
                    'col-1': key,
                    'col-2': jsonData[key].pr ? imgTemplate.replace(/\{1\}/g, jsonData[key].pr) : 'NO DATA',
                    'col-3': jsonData[key].integration ? imgTemplate.replace(/\{1\}/g, jsonData[key].integration) : 'NO DATA',
                    'col-4': jsonData[key].diff ? imgTemplate.replace(/\{1\}/g, jsonData[key].diff) : 'NO DATA',
                };
            });

            let header = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">'
                + '<h1>Visual Regression Test</h1>'
                + `<p><b>Total: </b><span class="badge badge-pill badge-danger">${data.length}</span><br>`;
            const table = (new HTMLTable([
                { key: 'col-1', value: 'Name', width: '10%' },
                { key: 'col-2', value: 'PR', width: '30%' },
                { key: 'col-3', value: 'Integration', width: '30%' },
                { key: 'col-4', value: 'Diff', width: '30%' }
            ], data)).getTable();
            const page = header + table;
            fs.writeFileSync(reportNameHTML, page);
        }
    }
}

export async function e2eLogin(page: Page, email: string, password: string, waitForLogin: number = 11000) {
    const emailSelector = 'input[name="email"]';
    const passwordSelector = 'input[name="password"]';
    try {
        await page.waitForSelector(emailSelector, { timeout: waitForLogin });
        await page.type(emailSelector, email);
        await page.type(passwordSelector, password);
        await page.click('.page-buttons button');
        // wait to redirect
        await page.waitFor(3000);
    } catch (e) {
        return Promise.reject(e);
    }
}

export function generateScreenshotReportHTML() {
    glob("./reports_e2e/screenshot-report-*.json", (er, files) => {
        let style = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                <style>
                    ul {
                        list-style: none;
                    }
                    li.passed:before {
                        color:green;
                        content: '✓ ';
                    }
                    li.failed:before {
                        color:red;
                        content: '✗ '
                    }
                    pre {
                        font-size: 10px;
                    }
                </style>`;
        let html = style;
        for (let i = 0; i < files.length; i++) {
            if (fs.existsSync(files[i])) {
                let list = '<ul>';
                let contents = fs.readFileSync(files[i], 'utf8');
                let jsonData = JSON.parse(contents);
                let specs = Object.keys(jsonData).sort();
                for (let i = 0; i < specs.length; i++) {
                    const spec = jsonData[specs[i]];
                    list += `<li><strong>${spec.description}</strong>`;
                    list += '<ul>';
                    list += spec.specs.map(s => {
                        let l = `<li class="${s.status}"><a href="${s.screenshot}" target="_blank">${s.description}</a>`;
                        if ('failedExpectations' in s && s.failedExpectations.length > 0) {
                            l += '<ul>';
                            l += s.failedExpectations.map(f => `<li >${f.message}</li><li><pre>${f.stack}</pre></li>`).join('');
                            l += '</ul>';
                        }
                        l += `</li>`;
                        return l;
                    }).join('');
                    list += `</ul></li>`;
                }
                list += '</ul>';
                html += list;
            }
        }
        fs.writeFileSync('./reports_e2e/report.html', html);
    });
}
