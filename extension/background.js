chrome.commands.onCommand.addListener((command) => {
    if (command === "save_link" || command === "open_notes") {
        // Store mode matching user's expected shortcut mappings
        const mode = command === "open_notes" ? "notes" : "link";
        chrome.storage.local.set({ popupMode: mode }, () => {
            // requires "action" permission in manifest if using Manifest V3 
            // or "browser_action" for V2
            if (chrome.action && chrome.action.openPopup) {
                chrome.action.openPopup();
            } else if (chrome.browserAction && chrome.browserAction.openPopup) {
                chrome.browserAction.openPopup();
            }
        });
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    console.log("BACKGROUND RECEIVED:", msg);

    if (msg.type === "SAVE_AUTH") {
        chrome.storage.local.set({
            linkzzzz_auth: msg.payload
        });
    }
});