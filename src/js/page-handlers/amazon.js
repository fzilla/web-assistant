import AllPageHandler from "./all";

class AmazonPageHandler extends AllPageHandler {

	handle(message) {
		if (message['type'] === 'page_open') {
			this.openPage(message);
			return;
		}
        else if (message['type'] === 'shopping_qty') {
            if (message['entities']['number']) {
                this.setQty(message['entities']['number']);
            }
        }
        else if (message['type'] === 'shopping_cart') {
            if (message['entities']['operation'] === 'add') {
                if (message['entities']['number']) {
                    this.setQty(message['entities']['number']);
                }

                const btn = document.getElementById('add-to-cart-button');
                btn.click();
            }
            else if (message['entities']['operation'] === 'open') {
                const btn = document.getElementById('nav-cart');
                btn.click();
            }
            else if (message['entities']['operation'] === 'remove') {
                let id = message['entities']['number'];
                if (!id) return;

                const btn = document.querySelector(`[wa-alya-prod='${id}'] input[data-action="delete"]`);
                btn.click();
            }
        }
        else if (message['type'] === 'shopping_buy') {
            const btn = document.getElementById('buy-now-button');
            btn.click();
        }
        else if (message['type'] === 'shopping_checkout') {
            let btn = document.getElementById('hlb-ptc-btn-native');
            if (!btn) {
                btn = document.querySelector('input[name=proceedToRetailCheckout]');
            }

            if (btn) {
                btn.click();
            }
        }

        super.handle(message);
    }

    setQty(qty) {
        qty --;
        document.getElementById('quantity').click();
        setTimeout(() => {
			let quantity = document.getElementById('quantity_' + qty);
			quantity.click();
		}, 800);
    }

    numberLinks() {
        this.linkNo = 1;
        this.numberCart();
        this.numberHomePageLinks();
        this.numberSearchResultLinks();
        this.numberProductDetailsPage();
    }

    numberHomePageLinks() {
        const widgets = document.querySelectorAll('.a-section.shogun-widget:not([wa-alya-link-con])');
        if (!widgets.length) {
            return;
        }

        widgets.forEach(v => {
            const id = (this.linkNo ++).toString();

            const link_1 = v.querySelector('.as-title-block-right .a-link-normal');
            const links = v.querySelectorAll('.a-list-item .a-link-normal');

            const span = document.createElement('span');
            span.style.color = '#ff0000';
            span.innerText = ' - ' + id;

            link_1.append(span);
            link_1.style.position = 'relative';
            link_1.setAttribute('wa-alya-link', id);

            v.setAttribute('wa-alya-link-con', id);

            links.forEach(v => {
                const id = (this.linkNo ++).toString();

                const span = this.getSpan(id);
                v.append(span);
                v.style.position = 'relative';
                v.setAttribute('wa-alya-link', id);
            });

        })
    }

    numberSearchResultLinks() {
        const widgets = document.querySelectorAll('.s-result-item:not([wa-alya-link-con])');
        if (!widgets.length) {
            return;
        }

        widgets.forEach(v => {

            let link = v.querySelector('.s-access-detail-page.a-link-normal');

            if (!link) {
                link = v.querySelector('.a-text-normal.a-link-normal');
            }

            if (!link) {
                return;
            }

            const id = (this.linkNo ++).toString();

            const span = document.createElement('span');
            span.style.color = '#ff0000';
            span.innerText = id + ' - ';

            link.prepend(span);
            link.style.position = 'relative';
            link.setAttribute('wa-alya-link', id);

            v.setAttribute('wa-alya-link-con', id);
        })
    }

    numberProductDetailsPage() {
        const widgets = document.querySelectorAll('.a-carousel-container:not([wa-alya-link-con])');
        if (!widgets.length) {
            return;
        }

        widgets.forEach(v => {
            const cards = v.querySelectorAll('.a-carousel-card');
            cards.forEach(card => {
                const link = card.querySelector('.a-link-normal');
                if (!link) {
                    return;
                }

                const id = (this.linkNo ++).toString();

                const span = document.createElement('span');
                span.style.color = '#ff0000';
                span.innerText = id + ' - ';

                link.prepend(span);
                link.style.position = 'relative';
                link.setAttribute('wa-alya-link', id);
            });
        })
    }

    numberCart() {
        let cart = document.getElementById('activeCartViewForm');
        if (!cart) {
            return;
        }

        const items = document.querySelectorAll('.sc-list-item');
        items.forEach(v => {
            const link = v.querySelector('.a-list-item .a-link-normal.sc-product-link:not([wa-alya-link])');

            if (!link) {
                return;
            }

            const id = (this.linkNo ++).toString();

            const span = document.createElement('span');
            span.style.color = '#ff0000';
            span.innerText = id + ' - ';

            link.prepend(span);
            link.setAttribute('wa-alya-link', id);
            v.setAttribute('wa-alya-prod', id)
        })
    }

    getSpan(id) {
        const span = document.createElement('span');
        span.setAttribute('style', `
                        position: absolute;
                        background-color: #ff0000;
                        color: #ffffff;
                        top: 0;
                        left: 0;
                        font-size: 15px;
                        padding: 3px;
                        border-radius: 0 5px 5px 0;
                `);

        span.innerText = id;
        return span;
    }

	openPage(message) {
		let addr = new URL(location.href);
		if (message['entities']['number']) {
			addr.searchParams.set('page', message['entities']['number']);
		}
		else if (message['entities']['object_attribute'] === 'previous') {
			let page = addr.searchParams.get('page');
			if (page > 1) {
				page --;
				addr.searchParams.set('page', page);
			}
		}
		else if (message['entities']['object_attribute'] === 'next') {
			let page = addr.searchParams.get('page');
			page ++;
			addr.searchParams.set('page', page);
		}

		location.href = addr.toString();
	}
}

export default AmazonPageHandler;
