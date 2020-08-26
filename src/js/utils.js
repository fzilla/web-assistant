
function getLoadedContentScriptName(tabId) {
	return window.scriptLoaded[tabId];
}

export {
	getLoadedContentScriptName
};
