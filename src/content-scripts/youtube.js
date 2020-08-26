import YoutubePageHandler from "../js/page-handlers/youtube";

const handler = new YoutubePageHandler();
handler.init();

browser.runtime.sendMessage({ type: 'content-script-hello', script: 'youtube' }).then();
browser.runtime.onMessage.addListener(message => handler.handle(message));
