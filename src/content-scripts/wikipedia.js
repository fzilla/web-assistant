import WikipediaPageHandler from "../js/page-handlers/wikipedia";

const handler = new WikipediaPageHandler();
handler.init();

browser.runtime.sendMessage({ type: 'content-script-hello', script: 'wikipedia' }).then();
browser.runtime.onMessage.addListener(message => handler.handle(message));
