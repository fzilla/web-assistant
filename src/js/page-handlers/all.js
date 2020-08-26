import {NumberingLinks, NumberingQueryBuilder} from "../link-number";

class AllPageHandler {
	constructor() {
		this.linkNo = 1;
		this.numLinks = new NumberingLinks();
		this.numLinks.init();
	}

    init() {
        this.numberLinks();
    }

    handle(message) {
        switch (message['type']) {
            case 'scroll':
                let top = 200, left = 0;

                switch (message['direction']) {
                    case 'top':
                        top = -document.body.scrollHeight;
                        left = 0;
                        break;

                    case 'bottom':
                        top = document.body.scrollHeight;
                        left = 0;
                        break;

                    case 'up':
                        top  = -200;
                        left = 0;
                        break;

                    case 'down':
                        top  = 200;
                        left = 0;
                        break;

                    case 'left':
                        top  = 0;
                        left = -200;
                        break;

                    case 'right':
                        top  = 0;
                        left = 200;
                        break;
                }

                window.scrollBy({ top: top, left: left, behavior: 'smooth'});
                break;

            case 'link_open':
                this.numLinks.openLink(message['number']);
                break;

			case 'link_number':
				if (message['operation'] === 'open') {
					this.numLinks.showLinkNumbers();
				}
				else {
					this.numLinks.hideLinkNumbers();
				}
				break;
        }
    }

    numberLinks() {
		let nb = new NumberingQueryBuilder();
		nb.select('a').generateLinkID().anchor().linkNo().append('simpleTagSpan');
		this.numLinks.setLinkNumbers(nb);
    }

    openLink(number) {
		this.numLinks.openLink(number)
	}
}

export default AllPageHandler;
