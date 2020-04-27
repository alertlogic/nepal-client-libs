import { waitForElementPresence, scrollToElement } from "./element-helpers";
import { ElementFinder, browser, by, element } from 'protractor';

export class NotificationHelper {
    list: ElementFinder = element(by.css('al-cardstack div.al-card-stack div.al-head-list div.al-list'));
    bottomSheet: ElementFinder = element(by.css('div.ui-shadow.ui-sidebar-bottom.ui-sidebar-full'));
    notificationForm: ElementFinder = this.bottomSheet.element(by.css('div.container'));

    getCardByIndex(index: number): ElementFinder {
        waitForElementPresence(this.list, 'The notification list is not present');
        const notification = this.list.all(by.css('al-base-card')).get(index);
        waitForElementPresence(notification, 'The notification list is not present');
        return notification;
    }

    toggleCardByIndex(index: number): void {
        const notification = this.getCardByIndex(index);
        const button = notification.element(by.css('p-header div.e2e-al-base-card-toggle'));
        waitForElementPresence(button, "The expand/collapse button is not present");
        button.click();
    }

    async executeFooterActionByIndexAndEvent(index: number, event: string): Promise<void> {
        const notification = this.getCardByIndex(index);
        const footerCard = notification.element(by.css('p-footer'));
        if (await footerCard.isDisplayed()) {
            scrollToElement(footerCard);
            const button = footerCard.element(by.css(`div.e2e-base-card-footer-action-${event}`));
            button.click().then(() => browser.sleep(1000));
            waitForElementPresence(button, `The action ${event} is not present`);
        } else {
            this.toggleCardByIndex(index);
            this.executeFooterActionByIndexAndEvent(index, event);
        }
    }

    async isbottomSheetShown(): Promise<boolean> {
        return await this.bottomSheet.isDisplayed();
    }

    async getBottomSheetTitle(): Promise<string> {
        return await this.bottomSheet.element(by.css('div.header p')).getText();
    }

    getNotificationFormSection(section: string): ElementFinder {
        const sectionElm = this.notificationForm.element(by.cssContainingText('h1.columnHeader', section));
        waitForElementPresence(sectionElm, `The notification form ${section} is not present`);
        return sectionElm;
    }

    getNotificationFormInputByName(name: string): ElementFinder {
        return this.notificationForm.element(by.css(`*[name="${name}"]`));
    }

    changeRecipientTypeByType(type: string) {
        const option = this.notificationForm.element(by.cssContainingText('al-menu-list ul li', type));
        option.click().then(() => browser.sleep(300));
    }

    async isPrimaryActionEnabled(): Promise<boolean> {
        return await this.bottomSheet.element(by.css('div.header button.primaryAction')).isEnabled();
    }

    closeNotificationForm(): void {
        this.bottomSheet.element(by.cssContainingText('div.header button span', 'Cancel')).click().then(() => browser.sleep(300));
    }

}
