
let numberingStyles = {
	simpleTagSpan(id) {
		const span = document.createElement('span');
		span.classList.add(`wa-alya-link-no-${uid}`, `wa-alya-link-no-can-hide-${uid}`);
		span.style.cssText = `
			background: #ff0000;
			color: #ffffff;
			vertical-align: super;
			font-size: smaller;
			padding: 0px 2px 0 0;
			border-radius: 0 5px 5px 0;
		`;

		span.innerText = ' ' + id;
		return span;
	},

	nonHiddenTextSpanPrepend(id) {
		const span = document.createElement('span');
		span.classList.add(`wa-alya-link-no-${uid}`);
		span.style.cssText = `
			color: #ff0000;
		`;

		span.innerText = id + ' - ';
		return span;
	}
}

function executeSelect(obj, prev_res) {
	let result;

	if (typeof obj['selector'] === 'function') {
		result = obj['selector']();
	}
	else {
		if (obj['mode'] === 'single') {
			result = prev_res.querySelector(obj['selector']);
		}
		else {
			result = prev_res.querySelectorAll(obj['selector']);
		}
	}

	return result;
}

let linkId = 0;
let uid = (Math.random() * 1000 | 0);

function executeCommand(command, prev) {
	command.forEach(v => {
		switch (v['type']) {
			case "select":
				const result = executeSelect(v, prev);
				if (result) {
					if (v['success']) {
						if (result instanceof NodeList) {
							result.forEach(r => {
								executeCommand(v['success'], r);
							})
						}
						else {
							executeCommand(v['success'], result)
						}
					}
				}
				else {
					if (v['failure']) {
						executeCommand(v['failure'], result)
					}

					return false
				}
				break;

			case 'generate-link-id':
				linkId ++;
				break;

			case 'anchor':
				prev.setAttribute(`wa-alya-link-${uid}`, linkId.toString())
				break;

			case 'link-number':
				let style = numberingStyles[v['style']](linkId.toString());

				if (v['position'] === 'prepend') {
					prev.prepend(style);
				}
				else {
					prev.append(style);
				}
				break;

			case 'parent':

				break;
		}
	});
}

class NumberingQueryBuilder {
	constructor() {
		let current = [];

		this.query = current;
		this.current = current;
		this.currentObj = [];
		this.currentSubObj = [];
	}

	select(selector) {
		this.currentObj = {
			type: "select",
			selector: selector,
			success: [],
			failure: []
		};
		this.current.push(this.currentObj);
		this.current = this.currentObj['success'];
		return this;
	}

	watch() {
		this.currentObj['watch'] = true;
	}

	success(cb) {
		let builder = new NumberingQueryBuilder()
		cb(builder);
		this.currentObj['success'].push(builder.getQuery());
		return this;
	}

	failure(cb) {
		const nb = new NumberingQueryBuilder()
		cb(nb);
		this.currentObj['failure'].push(nb.getQuery());
		return this;
	}

	anchor() {
		this.current.push(this.currentSubObj = { type: "anchor" });
		return this;
	}

	generateLinkID() {
		this.current.push(this.currentSubObj = { type: "generate-link-id" });
		return this;
	}

	linkNo() {
		this.current.push(this.currentSubObj = { type: "link-number", position: "append", style: "simpleSpan" });
		return this;
	}

	append(style) {
		this.currentSubObj['position'] = 'append';
		this.currentSubObj['style'] = style;
		return this;
	}

	prepend(style) {
		this.currentSubObj['position'] = 'prepend';
		this.currentSubObj['style'] = style;
		return this;
	}

	getQuery() {
		return this.query[0];
	}
}

class NumberingLinks {
	constructor() {
	}

	init() {
		const style = document.createElement('style');
		style.classList.add('wa-alya-style-' + uid);
		style.appendChild(document.createTextNode(`
		.wa-alya-link-no-shown-${uid} .wa-alya-link-no-${uid}.wa-alya-link-no-can-hide-${uid} {
			display: inline;
		}

		.wa-alya-link-no-${uid}.wa-alya-link-no-can-hide-${uid} {
			display: none;
		}
		`));

		document.getElementsByTagName('body')[0].prepend(style);
	}

	showLinkNumbers() {
		document.getElementsByTagName('body')[0].classList.add('wa-alya-link-no-shown-' + uid)
	}

	hideLinkNumbers() {
		document.getElementsByTagName('body')[0].classList.remove('wa-alya-link-no-shown-' + uid)
	}

	setLinkNumbers(query) {
		executeCommand([query.getQuery()], document)
	}

	setNumberingStyle(name, style) {
		numberingStyles[name] = style;
	}

	removeNumberingStyle(name) {
		delete numberingStyles[name];
	}

	openLink(number) {
		const link = document.querySelector(`[wa-alya-link-${uid}='${number}']`);
		if (link) {
			link.click();
		}
		else {
			const link = document.querySelector(`[wa-alya-link='${number}']`);
			link.click();
		}
	}

	openPage(page) {
		const link = document.querySelector(`[wa-alya-page-${uid}='${page}']`);
		if (link) {
			link.click();
		}
	}
}

export { NumberingQueryBuilder, NumberingLinks };


