import AbstractRequestHandler from "./abstract";
import { getLoadedContentScriptName } from "../utils";

class WebPageRequestHandler extends AbstractRequestHandler {
    canHandle() {
        if (!getLoadedContentScriptName(this.tab.id)) {
            return false;
        }

        return ['scroll', 'link_open', 'link_number'].includes(this.intent);
    }

    async handle() {
        if (this.intent === 'scroll') {
            this.tab.sendMessage({ type: 'scroll', direction: this.entities.direction });
            return;
        }

        if (this.intent === 'link_open') {
            this.tab.sendMessage({ type: 'link_open', number: this.entities.number });
        }

		if (this.intent === 'link_number') {
			this.tab.sendMessage({ type: 'link_number', operation: this.entities.operation });
		}
    }
}

export default WebPageRequestHandler;
