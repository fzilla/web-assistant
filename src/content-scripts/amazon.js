import AmazonPageHandler from "../js/page-handlers/amazon";

const handler = new AmazonPageHandler();
handler.init();

browser.runtime.sendMessage({ type: 'content-script-hello', script: 'amazon' }).then();
browser.runtime.onMessage.addListener(message => handler.handle(message));
