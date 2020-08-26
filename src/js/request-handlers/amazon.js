import AbstractRequestHandler from "./abstract";
import {getLoadedContentScriptName} from "../utils";

class AmazonRequestHandler extends AbstractRequestHandler {
    canHandle() {
		if (getLoadedContentScriptName(this.tab.id) !== 'amazon') {
			return false;
		}

        if ((this.intent === 'search' && !this.entities.search_provider && !this.entities.url) || this.intent === 'page_open') {
            return true;
        }

        return ['shopping_qty', 'shopping_cart', 'shopping_checkout', 'shopping_buy'].includes(this.intent);
    }

    async handle() {
        switch (this.intent) {
            case 'search':
                return this.handleSearch('amazon');

            default:
                this.tab.sendMessage({ type: this.intent, entities: this.entities });
        }
    }
}

export default AmazonRequestHandler;
