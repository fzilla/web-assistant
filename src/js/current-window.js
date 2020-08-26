import BrowserTab from "./browser-tab";

const CurrentWindow = {
	async createNewTab() {
		return await browser.tabs.create({});
	},

	async getCurrentTab() {
		const tabs = await browser.tabs.query({ currentWindow: true, active: true });

		if (!tabs.length)
			throw new Error("No Tab");

		return tabs[0];
	},

	async getAllTabs() {
		const tabs = await browser.tabs.query({ currentWindow: true });

		if (!tabs.length)
			throw new Error("No Tabs");

		return tabs;
	},

	async getNextTab() {
		const tab  = await this.getCurrentTab();
		return await this.getTabByIndex(tab.index + 1);
	},

	async getPreviousTab() {
		const tab  = await this.getCurrentTab();
		return await this.getTabByIndex(tab.index - 1);
	},

	async getLastTab() {
		const tabs  = await this.getAllTabs();

		if (!tabs.length)
			throw new Error("Previous tab not found");

		return tabs[tabs.length - 1];
	},

	async getTabByIndex(index) {
		const tabs  = await browser.tabs.query({ currentWindow: true, index: index });

		if (!tabs.length)
			throw new Error("Tab not found");

		return tabs[0];
	},

	async getTabByAttr(attr) {
		let tab;
		switch (attr) {
			case 'new':
				tab = await this.createNewTab();
				break;

			case 'last':
				tab = await this.getLastTab();
				break;

			case 'next':
				tab = await this.getNextTab();
				break;

			case 'previous':
				tab = await this.getPreviousTab();
				break;
		}

		return tab;
	},

	async getTabByUserRequest(attr, index) {
		let tab;

		if (attr) {
			tab = await this.getTabByAttr(attr);
		}
		else if (index) {
			tab = await this.getTabByIndex(index - 1);
		}
		else if (index) {
			tab = await this.getTabByIndex(index - 1);
		}
		else {
			tab = await this.getCurrentTab();
		}

		return new BrowserTab(tab);
	}
}

export default CurrentWindow;
