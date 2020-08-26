import AbstractRequestHandler from "./abstract";
import {getLoadedContentScriptName} from "../utils";

class YoutubeRequestHandler extends AbstractRequestHandler {
    canHandle() {
		if (getLoadedContentScriptName(this.tab.id) !== 'youtube') {
			return false;
		}

        if (!['media_play', 'media_pause', 'media_volume', 'link_open', 'search', 'page_open'].includes(this.intent)) {
            return false;
        }

        if (this.intent === 'search') {
            return !this.entities.search_provider && !this.entities.url;
        }

        if (this.intent === 'page_open') {
            return this.entities.object === 'video';
        }

        return true;
    }

    async handle() {
        switch (this.intent) {
            case 'search':
                return this.handleSearch('youtube');

            default:
                this.tab.sendMessage( { type: this.intent, entities: this.entities });
        }
    }
}

export default YoutubeRequestHandler;
