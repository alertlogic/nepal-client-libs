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
import { HTMLTable } from './html-table';
import glob from "glob";

export const WAIT_MAX_TIME = 35000;

interface Coordinates {
    x: number;
    y: number;
}

export function ensureDirectoryExistence(filePath: string): void {
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
export function hasClass(element: any, cls: string): void {
    return element.getAttribute('class').then((classes) => classes.split(' ').indexOf(cls) !== -1);
}

export function writeScreenShot(data: any, filename: string): string {
    console.log('writing file to ' + filename);
    ensureDirectoryExistence(filename);
    fs.writeFileSync(filename, data, { encoding: 'base64' });
    return filename;
}

export async function takeScreenshot(name: string): Promise<string> {
    const png = await browser.takeScreenshot();
    return writeScreenShot(png, `${name}-${new Date().getTime()}.png`);
}

/**
 * Wait until an element has a class Name
 * @param element
 * @param className
 */
export async function waitForClass(element: any, className: string): Promise<void> {
    await browser.wait(
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
export async function waitForElementPresence(element: ElementFinder, message?: string): Promise<void> {
    const until = ExpectedConditions;
    message = message ? message : `Not able to find element, taking more than ${WAIT_MAX_TIME}ms`;
    await browser.wait(
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
export async function scrollTo(coordinates: Coordinates): Promise<unknown> {
    const script = `window.scrollTo(${coordinates.x}, ${coordinates.y});`;
    return await browser.executeScript(script);
}

export async function scrollToElement(scrollToElement: any): Promise<unknown> {
    const wd = browser.driver;
    const loc = await scrollToElement.getLocation();
    return await wd.executeScript('window.scrollTo(0,arguments[0]);', loc.y);
}

/**
/**
 * Create a report related to the console, every time a console.error method is called (error ()).
 * this will create a report of only the calls of the console.error
 * @param logs is an array of logs
 * @return void - generates a folder with the report and the evidence called console_error
 */
export async function generateJSONConsoleReport(allLogs: any[], png: any, options: { blackList: RegExp[] } = {blackList: []}): Promise<void> {
    const defaultBlackList: RegExp[] = [
        /TypeError: Cannot read property/gi,
        /TypeError: .* is not a function/gi,
        /TypeError: Cannot set property/gi,
        /RangeError: Maximun call stack size exceeded/gi,
        /ReferenceError: .* is not defined/gi,
        /'undefined' is not an object/gi,
        /'null' is not an object/gi,
        /Unexpected token .* in JSON at position/gi,
    ];
    const blackList = options && options.blackList && options.blackList.length > 0 ? options.blackList.concat(defaultBlackList) : defaultBlackList;
    const regExpSources: string[] =  blackList.map((r) => r.source);
    const reportName = './console_error/report_console_error.json';
    if (allLogs && allLogs.length > 0) {
        let title = await browser.getTitle();
        title = title ? title.replace(/\|/g, "-") : 'URL';
        const url = await browser.getCurrentUrl();
        const imgName = `evidence/error-${new Date().getTime()}.png`;
        // log.level.value > 900 is an error
        allLogs = allLogs.filter((l) => l.level.value > 900);

        let blockLogs = allLogs.filter(l => blackList.some((expression) => expression.test(l.message)));
        let restLogs = allLogs.filter(l => blackList.some((expression) => !expression.test(l.message)));

        if (allLogs && allLogs.length > 0) {
            ensureDirectoryExistence(reportName);
            if (!fs.existsSync(reportName)) {
                fs.writeFileSync(reportName, '{"data": [], "errors": 0, "specs": 0, "block": [], "blackList": []}');
            }
            let contents = fs.readFileSync(reportName, 'utf8');
            let reportJson = JSON.parse(contents);
            reportJson['blackList'] = regExpSources;
            if(blockLogs && blockLogs.length > 0){
                reportJson['block'].push({ title, url, image: imgName, logs: blockLogs });
            }
            if(restLogs && restLogs.length > 0){
                reportJson['data'].push({ title, url, image: imgName, logs: restLogs});
            }
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

export async function generateConsoleHTMLReport(logs: any[], png: any): Promise<void> {
    await generateJSONConsoleReport(logs, png);
    const reportNameJson = './console_error/report_console_error.json';
    const reportNameHTML = './console_error/report_console_error.html';
    const reportNameBlockHTML = './console_error/report_console_error_block.html';

    if (fs.existsSync(reportNameJson)) {
        let contents = fs.readFileSync(reportNameJson, 'utf8');
        let jsonData = JSON.parse(contents) as {
            data: { logs: any[], title: string, url: string, image: string }[],
            block: { logs: any[], title: string, url: string, image: string }[],
            errors: number,
            specs: number
        };
        let report = jsonData.data;
        let block = jsonData.block;

        const aux = (r: {logs: any[], title:string, url: string, image: string}[]) => {
            return r.map(r => {
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
        };

        if(report && report.length > 0) {
            let data = aux(report);
            let blockHtml = block && block.length > 0 ? aux(block) : null;
            let header = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                                <h1>Console Report</h1>¡`;
            const table = (new HTMLTable([
                { key: 'col-1', value: 'Error', width: '50%' },
                { key: 'col-2', value: 'Url', width: '25%' },
                { key: 'col-3', value: 'Screenshot', width: '25%' }
            ], data)).getTable();
            let tableBlock = '';
            if(blockHtml != null) {
                tableBlock = (new HTMLTable([
                    { key: 'col-1', value: 'Error', width: '50%' },
                    { key: 'col-2', value: 'Url', width: '25%' },
                    { key: 'col-3', value: 'Screenshot', width: '25%' }
                ], blockHtml)).getTable();
                const pageBlock = header + tableBlock;
                fs.writeFileSync(reportNameBlockHTML, pageBlock);
            }
            const page = header + table;
            fs.writeFileSync(reportNameHTML, page);
        }
    }
}

/**
 * Create a report in JSON format of the e2e test
 */
export function generateJSONVR(): void {
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
export async function generateVRHTMLReport(): Promise<void> {
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

export function generateScreenshotReportHTML(): void {
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
