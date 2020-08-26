import AbstractRequestHandler from "./abstract";
import {getLoadedContentScriptName} from "../utils";

class WikipediaRequestHandler extends AbstractRequestHandler {
    canHandle() {
		if (getLoadedContentScriptName(this.tab.id) !== 'wikipedia') {
			return false;
		}

        return (this.intent === 'search' && !this.entities.search_provider && !this.entities.url);
    }

    async handle() {
        if (this.intent === 'search') {
            return this.handleSearch('wikipedia');
        }
    }
}

export default WikipediaRequestHandler;
