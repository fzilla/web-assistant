import GooglePageHandler from "../js/page-handlers/google";

const handler = new GooglePageHandler();
handler.init();

browser.runtime.sendMessage({ type: 'content-script-hello', script: 'google' }).then();
browser.runtime.onMessage.addListener(message => handler.handle(message));

console.log('google')
