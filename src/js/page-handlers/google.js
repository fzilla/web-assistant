import AllPageHandler from "./all";
import { NumberingQueryBuilder } from "../link-number";

class GooglePageHandler extends AllPageHandler {
    handle(message) {
        if (message['type'] === 'page_open') {
        	this.openPage(message);
        	return;
        }

        super.handle(message);
    }

    openPage(message) {
        let table = document.getElementsByClassName('AaVjTc');
        if (!table.length) {
            this.tryOpenPageInImages(message);
            return;
        }

        table = table[0];

        if (message['entities']['number']) {
            let a = table.querySelector(`[aria-label='Page ${message['entities']['number']}']`);
            if (!a) return;

            a.click();
            return;
        }
        else if (message['entities']['attribute'] === 'previous') {
            let a = table.querySelector('#pnprev');
            if (!a) return;

            a.click();
            return;
        }
        else if (message['entities']['attribute'] === 'next') {
            let a = table.querySelector('#pnnext');
            if (!a) return;

            a.click();
            return;
        }
        else if (message['entities']['attribute'] === 'all') {
            message['entities']['menu'] = 'all';
        }

        if (message['entities']['menu']) {
            let nav = document.getElementById('hdtb-msb-vis');
            if (nav) {
                let letter = message['entities']['menu'].charAt(0).toUpperCase();

                let a = nav.querySelector(`.hdtb-mitem a[data-sc='${letter}']`);
                if (!a) return;

                a.click();
            }
        }
    }

    tryOpenPageInImages(message) {
        if (!message['entities']['menu']) {
            return;
        }

        let nav = document.getElementsByClassName('T47uwc');
        if (nav.length) {
            nav = nav[0];

            let as = nav.querySelectorAll(`[jsname='ONH4Gc']`);
            as.forEach(v => {
                if (v.innerText.toLowerCase() === message['entities']['menu']) {
                    v.click();
                }
            });
        }
    }

    numberLinks() {
		let nb = new NumberingQueryBuilder();

		nb
			.select('#rso')
			.success(/** @param {NumberingQueryBuilder} builder */ builder => {
				builder.select('.g .r > a').generateLinkID().anchor().select('.LC20lb.DKV0Md').linkNo().prepend('nonHiddenTextSpanPrepend')
			})
			.success(/** @param {NumberingQueryBuilder} builder */ builder => {
				builder.select('.dbsr > a').generateLinkID().anchor().select('.JheGif.jBgGLd').linkNo().prepend('nonHiddenTextSpanPrepend')
			});

		this.numLinks.setLinkNumbers(nb);
    }
}

export default GooglePageHandler;
