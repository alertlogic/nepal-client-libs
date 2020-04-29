// i tried this as import, but ts-node or something on the app side didnt like that - jtarver
const {browser, by, protractor, element, sleep} = require('protractor');

describe(`SUITE for login in ${browser.params.app} app`, () => {
    const until = protractor.ExpectedConditions;
    describe(`WHEN going to ${browser.params.app} url in ${browser.params.environment} environment `, () =>  {
        it('SHOULD redirect to Auth0 page, login with a valid user and redirect back', () =>  {
            browser.waitForAngularEnabled(false);
            browser.get(browser.params.baseUrl)
                .then(_ => {
                    return browser.getCurrentUrl().then(url => {
                        return browser.wait(
                            until.presenceOf(element(by.name('email'))),
                            60000,
                            `Login Form is taking more than 1 minute to appear in DOM`
                        );
                    });
                })
                .then(_ => browser.driver.findElement(by.name('email')))
                .then(e => e.sendKeys(browser.params.login.email))
                .then(_ => browser.driver.findElement(by.name('password')))
                .then(e => e.sendKeys(browser.params.login.password))
                .then(_ => browser.driver.findElement(by.css('button')))
                .then(e => e.click())
                .then(_ => browser.driver.sleep(10000));
            browser.getCurrentUrl().then(url => {
                expect(url)
                    .toContain(browser.params.baseUrl);
            });
        });
        describe(`AND when the app is already loaded `, () => {
            beforeAll(() => {
                browser.sleep(1000);
                browser.waitForAngularEnabled(false).then(_ => {
                    const getEntitlements = async () => {
                        const navigation = await browser.executeScript(() => {
                            return window['al'].registry.AlSession.getEffectiveEntitlements();
                        });
                        browser.params.entitlements = navigation.collection;
                    };
                    getEntitlements();
                });
            });
            it('SHOULD validate that the users entitlements were already gotten in the param entitlements ', () => {
                expect(Object.keys(browser.params.entitlements).length).toBeGreaterThan(0);
            });
        });
    });
});
