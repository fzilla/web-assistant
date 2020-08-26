import AllPageHandler from "../js/page-handlers/all";

const handler = new AllPageHandler();
handler.init();

browser.runtime.sendMessage({ type: 'content-script-hello', script: 'all' }).then();
browser.runtime.onMessage.addListener(message => handler.handle(message));

console.log('all');
