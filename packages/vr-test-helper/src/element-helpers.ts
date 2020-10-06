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
    promise,
} from 'protractor';
import { ConsoleMessageType, Page } from 'puppeteer';

export const WAIT_MAX_TIME = 35000;

interface Coordinates {
    x: number;
    y: number;
}

function ensureDirectoryExistence(filePath: string) {
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

export async function takeScreenshot(page: Page, name: string) {
    const filename = `${name}-${new Date().getTime()}.png`;
    const path = filename.substring(0, filename.lastIndexOf("/"));
    fs.mkdir(path, { recursive: true } ,(err) => {
        if(err){
            return console.error(err);
        }
    });
    await page.setViewport({ width: 1280, height: 766 });
    await page.screenshot({path: filename});
    return filename;
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
export async function consoleReport(logs, png) {
    if (logs && logs.length > 0) {
        let title = await browser.getTitle();
        title = title ? title.replace(/\|/g, "-") : 'URL';
        const url = await browser.getCurrentUrl();
        const imgName = `./console_error/evidence/error-${new Date().getTime()}.png`;
        // log.level.value > 900 is an error
        const message = logs.filter((l) => l.level.value > 900).map((l, index) => `${index + 1}. ${l.message.replace(/(\r\n|\n|\r)/gm, "<br>")}`).replace(/\|/g, "-").join("<br>");
        const row = `| ${message} | [${title}](${url}) | ![PR](${"%VISUAL_REGRESSION_URL%" + imgName.replace('./', '')}) |\n`;
        try {
            writeScreenShot(png, imgName);
            fs.writeFile('./console_error/report_console_error.txt', row, { flag: 'a' }, (err) => {
                if (err) throw err;
                console.log('Adding information to the console report');
            });
        } catch(err) {
            console.error("Error taking the screenshot", err);
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
export function consoleReportPuppeter(page: Page, types: ConsoleMessageType[] = []) {
    page.on('console', async (msg) => {
        if (types === [] || types.includes(msg.type())) {
            const title = await page.title();
            const message = {
                page: title ? title.replace(/\|/g, "-") : 'URL',
                url: page.url(),
                text: msg.text() ? msg.text().replace(/(\r\n|\n|\r)/gm, "<br>").replace(/\|/g, "-") : ''
            };
            // Taking a screenshot when the error appears.
            try {
                await page.waitFor(1000);
                // saving report
                const imgName = await takeScreenshot(page, `./console_error/evidence/error`);
                const row = `| ${message.text} | [${message.page}](${message.url}) | ![PR](${"%VISUAL_REGRESSION_URL%" + imgName.replace('./', '')}) |\n`;
                fs.writeFile('./console_error/report_console_error.txt', row, { flag: 'a' }, (err) => {
                    if (err) throw err;
                    console.log('Adding information to the console report');
                });
            } catch (error) {
                console.error("Error taking the screenshot", error);
            }
        }
    });
}
