import CurrentWindow from "../current-window";
import {getSearchUrl} from "../search-providers";

class AbstractRequestHandler {
    constructor(intent, entities, tab = null) {
        this.intent  = intent.name
        this.entities = entities;
        this.tab = tab;
    }

    canHandle() {

    }

    async handle() {

    }

	async handleSearch(provider) {
		const tab = await CurrentWindow.getTabByUserRequest(this.entities.object_attribute, this.entities.number);
		const url = getSearchUrl(provider, this.entities.search_query)
		return tab.loadUrl(url);
	}
}

export default AbstractRequestHandler;
