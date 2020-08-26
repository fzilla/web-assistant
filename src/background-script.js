import Entities from "./js/entities";
import BrowserTab from "./js/browser-tab";
import CurrentWindow from "./js/current-window";
import GoogleRequestHandler from "./js/request-handlers/google";
import WikipediaRequestHandler from "./js/request-handlers/wikipedia";
import YoutubeRequestHandler from "./js/request-handlers/youtube";
import AmazonRequestHandler from "./js/request-handlers/amazon";
import WebPageRequestHandler from "./js/request-handlers/web-page";
import BrowserRequestHandler from "./js/request-handlers/browser";
import {processText} from "./js/wit";

let assistantTab = null;
let rPort = null;
let bPort = null;
let pPorts = {};

let browserAction = {
    history: [],
    activeStatus: false,
    status: 'assistant-inactive',
    statusText: 'Inactive'
}

window.scriptLoaded = {};

browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    if (assistantTab && (assistantTab.id === tabId)) {
        assistantTab = null;
    }
    delete scriptLoaded[tabId];
});

browser.runtime.onMessage.addListener((message, sender) => {
    if (message['type'] === 'content-script-hello') {
        scriptLoaded[sender.tab.id] = message['script'];
    }
});

browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'assistant-tab') {
        rPort = port;

        port.onMessage.addListener(assistantTabOnMessage);
        port.onDisconnect.addListener(port => {
            rPort = null;

            if (assistantTab) {
                browser.tabs.remove(assistantTab.id).then();
            }

            setStatus('assistant-inactive', 'Inactive');
        });
    }
    else if (port.name === 'browser-action') {
        bPort = port;

        browserAction.activeStatus = rPort !== null;
        bPort.postMessage({ type: 'set-session', 'session': browserAction });
        bPort.onMessage.addListener(browserActionOnMessage);
        bPort.onDisconnect.addListener(p => bPort = null);
    }
    else if (port.name.startsWith('page-script:')) {
        pPorts[port.sender.tab.id] = { port: port, type: port.name.split(':')[1] };

        port.onDisconnect.addListener(port => {
            delete rPort[port.sender.tab];
        });
    }
});

async function processWit(wit) {
    // console.log(wit)

    if (wit['text']) {
        addCommand(wit['text']);
    }

    if (!(wit['intents'] && wit['intents'].length)) {
        return;
    }

    const intent = wit['intents'][0];

    if (intent['confidence'] < 0.5) {
        return;
    }

    const entities = new Entities(wit['entities']);
    const tab = new BrowserTab(await CurrentWindow.getCurrentTab());

    const handlers = [
		GoogleRequestHandler,
		WikipediaRequestHandler,
		YoutubeRequestHandler,
		AmazonRequestHandler,
		WebPageRequestHandler,
		BrowserRequestHandler
	];

	for (let i = 0; i < handlers.length; i++) {
		const handler = new handlers[i](intent, entities, tab);
		if (handler.canHandle()) {
			return handler.handle().catch(e => console.log(e))
		}
	}
}

async function createAssistantTab() {
    let page = browser.runtime.getURL("assistant/index.html");
    assistantTab = await browser.tabs.create({ url: page, pinned: true, index: 0 });
}

function browserActionOnMessage(message) {
    switch (message['type']) {
        case 'assistant-start':
            if (rPort && assistantTab) {
                browser.tabs.update(assistantTab.id, { active: true }).then();
                return;
            }

            createAssistantTab().then();
            break;

        case 'assistant-stop':
            if (assistantTab) {
                browser.tabs.remove(assistantTab.id).then();
            }
            break;

        case 'emulate-command':
            processText(message['command'])
				.then(data => processWit(data).then());
            break;
    }
}

function assistantTabOnMessage(message) {
    switch (message['type']) {
        case 'wit-nlp':
            processWit(message['content']).then();
            break;

        case 'recording-permission-denied':
            setStatus('recording-permission-denied', 'Audio Recording Permission Denied');
            break;

        case 'recording-started':
            setStatus('assistant-active', 'Active');
            break;

        case 'recording-stopped':
            setStatus('assistant-inactive', 'Inactive');
            break;
    }
}

function setStatus(status, statusText) {
    browserAction.status = status;
    browserAction.statusText = statusText;

    if (bPort) {
        bPort.postMessage({ type: 'assistant-status', status: status, statusText: statusText })
    }
}

function addCommand(command) {
    browserAction.history.push(command);
    if (browserAction.history.length > 5) {
        browserAction.history.shift();
    }

    if (bPort) {
        bPort.postMessage({ type: 'executed-command', command: command })
    }
}

window.emulate = (text) => {
	processText(text)
}
