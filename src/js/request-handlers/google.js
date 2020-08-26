import AbstractRequestHandler from "./abstract";
import {getLoadedContentScriptName} from "../utils";

class GoogleRequestHandler extends AbstractRequestHandler {
    canHandle() {
		if (getLoadedContentScriptName(this.tab.id) !== 'google') {
			return false;
		}

        if ((this.intent === 'search' && !this.entities.search_provider && !this.entities.url) || this.intent === 'page_open') {
            return true;
        }

        if (this.entities.operation === 'open' && this.entities.object_attribute === 'all' && this.entities.object !== 'tab') {
            return true;
        }

        return false;
    }

    async handle() {
        switch (this.intent) {
            case 'page_open':
                this.tab.sendMessage({
                    type: 'page_open',
                    entities: {
                        number: this.entities.number,
                        menu: this.entities.google_menu,
                        attribute: this.entities.object_attribute
                    }
                });
                break;

            case 'search':
                return this.handleSearch('google');

            default:
                if (this.entities.operation === 'open' && this.entities.object_attribute === 'all' && this.entities.object !== 'tab') {
                    this.tab.sendMessage({
                        type: 'page_open',
                        entities: {
                            number: this.entities.number,
                            menu: 'all',
                            attribute: null
                        }
                    });
                }
        }
    }
}

export default GoogleRequestHandler;
