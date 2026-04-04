function syncAuth() {
  const auth = localStorage.getItem("linkzzzz_auth");
  console.log("Content script auth:", auth);

  if (auth) {
    chrome.runtime.sendMessage({
      type: "SAVE_AUTH",
      payload: auth
    });
  }
}

syncAuth();

window.addEventListener("storage", (e) => {
  if (e.key === "linkzzzz_auth") {
    syncAuth();
  }
});
