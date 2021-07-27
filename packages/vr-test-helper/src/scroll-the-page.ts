/**
 * @author Jason Tarver <scottarver@gmail.com
 * @date 5/1/20 1:02 PM
 */

import { browser } from 'protractor';

export async function scrollThePage(
    pictureName: string,
    pictureFunction: (name: string) => Promise<unknown>,
    maxScrolls: number = 25,
): Promise<void> {


    let scrollHeight = parseInt(await browser.executeScript('return document.body.scrollHeight'), 10);
    const innerHeight = parseInt(await browser.executeScript('return window.innerHeight'), 10);


    // console.log(scrollHeight);
    // console.log(innerHeight);
    console.log(`${pictureName} will need this many screenshots:${Math.ceil(scrollHeight / innerHeight)}`);

    let counter = 0;
    let i = 0;
    while (counter <= scrollHeight && i < maxScrolls) {
        const thisMuch = Math.floor(i * innerHeight * .9);
        counter += thisMuch;

        await browser.executeScript(`window.scrollTo(0,${thisMuch})`);
        await browser.sleep(300);
        await pictureFunction(`${pictureName}_scrolledDown_${i}_${thisMuch}`);

        scrollHeight = await browser.executeScript('return document.body.scrollHeight');
        i++;
    }
}
