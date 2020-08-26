class BrowserTab {
	constructor(tab) {
		this.tab = tab;
		this.id = tab.id;
	}

	async loadUrl(url) {
		await browser.tabs.update(this.tab.id, { url: url });
	}

	async activate() {
		await browser.tabs.update(this.tab.id, { active: true });
	}

	async remove() {
		await browser.tabs.remove(this.tab.id);
	}

	async pin() {
		await browser.tabs.update(this.tab.id, { pinned: true });
	}

	async unpin() {
		await browser.tabs.update(this.tab.id, { pinned: false });
	}

	async duplicate() {
		await browser.tabs.duplicate(this.tab.id);
	}

	async reload() {
		await browser.tabs.reload(this.tab.id);
	}

	async goForward() {
		await browser.tabs.goForward(this.tab.id);
	}

	async goBack() {
		await browser.tabs.goBack(this.tab.id);
	}

	async sendMessage(message) {
		await browser.tabs.sendMessage(this.tab.id, message)
	}
}

export default BrowserTab;
