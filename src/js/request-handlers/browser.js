import AbstractRequestHandler from "./abstract";
import CurrentWindow from "../current-window";
import {  getSearchUrl } from "../search-providers";

class BrowserRequestHandler extends AbstractRequestHandler {
    canHandle() {
        return (this.entities.object === 'tab')
			|| (this.intent === 'search')
			|| (this.intent === 'navigate' &&  this.entities.nav_direction)
			|| (this.entities.operation === 'open' && (this.entities.url || this.entities.search_provider));
    }

    async handle() {
        let tab = await CurrentWindow.getTabByUserRequest(this.entities.object_attribute, this.entities.number);

        switch (this.intent) {
            case 'tab_open':
                if (this.entities.operation === 'open') {
                    if (this.entities.url) {
                        await tab.loadUrl(this.entities.url);
                    }
                    else if (this.entities.search_provider) {
                        await tab.loadUrl(`https://${this.entities.search_provider}.com`)
                    }

                    return tab.activate();
                }
                break;

            case 'tab_close':
                if (this.entities.operation === 'close') {
                    return tab.remove();
                }
                break;

            case 'tab_pin':
                if (this.entities.tab_operation === 'pin') {
                    return tab.pin();
                }
                break;

            case 'tab_unpin':
                if (this.entities.tab_operation === 'unpin') {
                    return tab.unpin();
                }
                break;

            case 'tab_duplicate':
                if (this.entities.tab_operation === 'duplicate') {
                    return tab.duplicate();
                }
                break;

            case 'tab_reload':
                if (this.entities.operation === 'reload') {
                    return tab.reload();
                }
                break;

            case 'navigate':
                if (this.entities.nav_direction === 'back') {
                    return tab.goBack();
                }
                else if (this.entities.nav_direction === 'forward') {
                    return tab.goForward();
                }
                break;

            case 'search':
                if (this.entities.operation === 'search') {
                    return this.handleSearch(tab);
                }
                break;
        }
    }

    async handleSearch(tab) {
        let search_query = this.entities.search_query;

        let url;

        if (this.entities.search_provider) {
        	url =  getSearchUrl(this.entities.search_provider, search_query);
        }
        else if (this.entities.url) {
            url = encodeURI(this.entities.url + '?q=' + search_query);
        }
        else {
			url =  getSearchUrl('google', search_query);
        }

        return tab.loadUrl(url);
    }
}

export default BrowserRequestHandler;
