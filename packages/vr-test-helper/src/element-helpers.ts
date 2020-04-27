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
