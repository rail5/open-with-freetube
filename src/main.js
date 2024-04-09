'use strict';

const itemId = "open-with-freetube";

let menuItemCurrentlyExists = false;

browser.menus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === itemId) {
		// Append 'freetube:' to the beginning of the link
		let freetubelink = "freetube:" + info.linkUrl;
		// Open the new link
		browser.tabs.update(tab.id, {
			url: freetubelink
		});
	}
});

function createMenuItem() {
	if (!menuItemCurrentlyExists) {
		browser.menus.create({
			id: itemId,
			title: "Open with FreeTube",
			contexts: ["link"]
		});
		browser.menus.refresh();
		menuItemCurrentlyExists = true;
	}
}

function destroyMenuItem() {
	if (menuItemCurrentlyExists) {
		browser.menus.remove(itemId);
		browser.menus.refresh();
		menuItemCurrentlyExists = false;
	}
}

browser.menus.onShown.addListener(info => {
	if (!info.linkUrl) {
		// Destroy if not a link
		destroyMenuItem();
		return;
	}
	
	if (!(info.linkUrl.includes("/watch?v="))) {
		// Destroy if not a YouTube watch link
		destroyMenuItem();
		return;
	}
	
	if (info.linkUrl.includes("freetube:/")) {
		// Destroy if already a FreeTube link
		destroyMenuItem();
		return;
	}
	// Add the menu item if we've passed the checks so far without returning
	createMenuItem();
	
	let linkElement = document.createElement("a");
	linkElement.href = info.linkUrl;
});
