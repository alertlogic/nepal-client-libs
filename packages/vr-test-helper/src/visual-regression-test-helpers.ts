import * as fs from "fs";
import * as path from "path";
import pixelmatch from 'pixelmatch';
// @ts-ignore
import { PNG } from 'pngjs';
import { browser } from 'protractor';

import { connect, Page } from 'puppeteer';
import { takeScreenshot } from './element-helpers';

export class Browser {
    public static async openPageInNewTab(url: string) {
        const nums = await browser.getAllWindowHandles();
        await Browser.createNewBrowserTab();
        await Browser.switchToTabNumber(nums.length);
        await browser.get(url);
        return nums.length;
    }

    public static createNewBrowserTab() {
        return browser.executeScript('window.open()');
    }

    public static async switchToTabNumber(number: number) {
        const handles = await browser.getAllWindowHandles();
        // console.log(handles);
        const newWindowHandle = handles[number];
        return browser.switchTo().window(newWindowHandle);
    }

}

export const compareAndWrite = async (
    testName: string,
    urlEnd: string,
    doThis: (ss: (n: string) => Promise<unknown>) => Promise<unknown>,
) => {


    // do in pr

    const prefix = `./visual-regression/${testName.replace(/ /g, "-")}/`;

    const screenshots2: { [i: string]: { [jasmine: string]: string } } = {};

    const takeScreenShot = (page: Page, name: 'pr' | 'integration') => {
        return async (partName: string) => {

            const filename = await takeScreenshot(page, `${prefix}${partName.replace(/ /g, "-")}/${name}`);
            if (!screenshots2[name]) {
                screenshots2[name] = {};
            }
            if (screenshots2[name][partName]) {
                throw new Error(`duplicate screenshot name ${partName}`);
            }
            screenshots2[name][partName] = filename;
            return filename;
        };
    };
    const pBrowser = await connect({
        browserURL: 'http://localhost:21222'
    });
    const page = (await pBrowser.pages())[0];
    try {
        // console.log('pr part');
        // console.log((new URL(browser.params.baseUrl)).origin + urlEnd);

        await page.goto((new URL(browser.params.baseUrl)).origin + urlEnd);
        const prScreeennshotFn = takeScreenShot(page, 'pr');
        await doThis(prScreeennshotFn);
        await prScreeennshotFn('end');
    } catch (e) {
        console.error("Error with PR test", e);
    }


    try {
        // do in integration
        // console.log('integration part');(new URL(browser.params.integrationUrl)).origin + urlEndbrowser.params.integrationUrl + urlEnd);
        await page.goto((new URL(browser.params.integrationUrl)).origin + urlEnd);
        await page.waitFor(1000);

        const integrationScreenShotFn = takeScreenShot(page, 'integration');
        await doThis(integrationScreenShotFn);
        await page.waitFor(1000);
        await integrationScreenShotFn('end');
    } catch (e) {
        console.error("Error with integration test", e);
    }

    // compare screenshots
    pBrowser.close();

    // let screenshots write
    const areas: string[] = [];
    let partNames: string[] = [];
    Object.entries(screenshots2).forEach(([area, parts]) => {
        areas.push(area);
        partNames.push(...Object.keys(parts));
    });

    partNames = partNames.filter((value, index, self) => self.indexOf(value) === index); // uniques

    partNames.forEach(part => {
            const compareThese: string[] = [];
            areas.forEach(area => {
                compareThese.push(screenshots2[area][part]);
            });

            if (compareThese.length > 2) {
                console.error("only max 2 right now");
            }
            if (compareThese.length !== 2) {
                console.error("must have 2 to compare");
            }

            let img1;
            let img2;
            try {
                img1 = PNG.sync.read(fs.readFileSync(compareThese[0]));
                img2 = PNG.sync.read(fs.readFileSync(compareThese[1]));
            } catch (error) {
                console.error("error getting files to compare", compareThese, error);
                return;
            }
            const { width, height } = img1;
            const diff = new PNG({ width, height });

            pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

            const diffFile = `${path.dirname(compareThese[0]) + path.sep}diff-${new Date().getTime()}.png`;
            try {
                fs.writeFileSync(
                    diffFile,
                    PNG.sync.write(diff),
                );
            } catch
                (error) {
                console.error("error writing diff file", diffFile, error);
                return;

            }

        },
    );

};
