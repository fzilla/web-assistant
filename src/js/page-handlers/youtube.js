import AllPageHandler from './all';

class YoutubePageHandler extends AllPageHandler {
    init() {
        this.numberedLink1 = false;
		this.numberedLink2 = false;
		this.numberedLink3 = false;

        this.numberLinks();

        let handler = setInterval(() => {
            this.numberLinks();

            if (this.numberedLink1 && this.numberedLink2) {
                clearInterval(handler);
            }
        }, 500);
    }

    handle(message) {
        switch (message['type']) {
            case 'media_play':
                this.handlePlay();
                return;

            case 'media_pause':
                this.handlePause();
                return;

            case 'media_volume':
                this.handleVolume(message['entities']);
                return;

            case 'link_open':
            case 'page_open':
                const entities = message['entities'];

                if (entities['youtube_menu']) {
                    this.handleMenu(entities);
                    return;
                }

                if (entities['operation'] === 'open' && entities['object_attribute'] === 'next') {
                    let button = document.querySelector('.ytp-next-button');
                    if (button)
                        button.click();

                    return;
                }

                if (entities['number']) {
                    super.openLink(entities['number']);
                    return;
                }
                break;
        }
    }

    numberLinks() {
        this.numberHomePage();
        this.numberVideoPage();
		this.numberResultsPage();
    }

    numberHomePage() {
        let contents = document.getElementById('contents');
        if (!contents || this.numberedLink1) {
            return false;
        }

        this.numberedLink1 = true;

        let fn = () => {
            let results = contents.querySelectorAll('ytd-browse[page-subtype="home"] ytd-rich-item-renderer:not([wa-alya-link-con])');
            results.forEach(v => {
                const id = (this.linkNo ++).toString();

                let det = v.querySelector('#details');
                det.setAttribute('wa-alya-link', id);
                v.setAttribute('wa-alya-link-con', id);

                const span = this.getSpan(id);
                v.appendChild(span)
                v.style.position = 'relative';
            })
        }

        this.setMutationObserver(contents, fn);
        fn();
    }

	numberVideoPage() {
		const contents = document.querySelector('ytd-watch-flexy ytd-watch-next-secondary-results-renderer #items');
		if (!contents || this.numberedLink2) {
			return false;
		}

		this.numberedLink2 = true;

		let fn = () => {
			const anchors = contents.querySelectorAll('ytd-compact-video-renderer:not([wa-alya-link-con])');
			anchors.forEach(v => {
				const id = (this.linkNo ++).toString();

				const det = v.querySelector('#thumbnail');
				det.setAttribute('wa-alya-link', id);
				v.setAttribute('wa-alya-link-con', id);

				const span = this.getSpan(id);
				v.appendChild(span)
				v.style.position = 'relative';
			})
		}

		this.setMutationObserver(contents, fn);
		fn();
	}

	numberResultsPage() {
		const contents = document.querySelector('ytd-search ytd-section-list-renderer #contents');
		if (!contents || this.numberedLink3) {
			return false;
		}
		this.numberedLink3 = true;

		let fn = () => {
			const anchors = contents.querySelectorAll('ytd-video-renderer:not([wa-alya-link-con])');
			anchors.forEach(v => {
				const id = (this.linkNo ++).toString();

				const det = v.querySelector('#thumbnail');
				det.setAttribute('wa-alya-link', id);
				v.setAttribute('wa-alya-link-con', id);

				const span = this.getSpan(id);
				span.style.top = '24px';
				v.appendChild(span)
				v.style.position = 'relative';
			})
		}

		this.setMutationObserver(contents, fn);
		fn();
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

    setMutationObserver(contents, callback) {
        const config = { childList: true };
        const observer = new MutationObserver((mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    callback();
                }
            }
        });
        observer.observe(contents, config);
    }

    handlePlay() {
        let video = document.querySelector('#ytd-player video');
        if (video) {
            video.play();
        }
    }

    handlePause() {
        let video = document.querySelector('#ytd-player video');
        if (video) {
            video.pause();
        }
    }

    handleMenu(entities) {
        if (entities['youtube_menu'] === 'mini player') {
            let button;
            switch (entities['operation']) {
                case 'open':
                    button = document.querySelector('button.ytp-miniplayer-button');
                    break;
                case 'close':
                    button = document.querySelector('button.ytp-miniplayer-close-button');
                    break;
                case 'expand':
                    button = document.querySelector('button.ytp-miniplayer-expand-watch-page-button');
                    break;
            }

            if (button) {
                button.click();
            }
        }
        else if (entities['youtube_menu'] === 'theater mode') {
            const button = document.querySelector('button.ytp-size-button');
            if (button) {
                button.click();
            }
        }
    }

    handleVolume(entities) {
        let video = document.querySelector('#ytd-player video');
        if (!video) {
            return;
        }

        let operation = entities.operation;
        let number  = entities.number;

        if (number) {
            number = entities.number / 100;
        }
        else {
            number = video.volume;
        }

        switch (operation) {
            case 'mute':
                video.muted = true;
                break;

            case 'unmute':
                video.muted = false;
                break;

            case 'increase':
                number = video.volume + number;
                if (number > 1) {
                    number = 1;
                }
                video.volume = number;
                break;

            case 'decrease':
                number = video.volume - number;
                if (number < 0) {
                    number = 0;
                }

                video.volume = number;
                break;

            default:
                video.volume = number;
                break;
        }
    }
}

export default YoutubePageHandler;
