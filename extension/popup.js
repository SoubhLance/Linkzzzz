document.addEventListener("DOMContentLoaded", () => {
    // 6. UPDATE popup.js LOGIN CHECK
    chrome.storage.local.get("linkzzzz_auth", (result) => {
        console.log("POPUP AUTH:", result);

        const auth = result.linkzzzz_auth
            ? JSON.parse(result.linkzzzz_auth)
            : null;

        if (!auth || !auth.token || Date.now() > auth.expiresAt) {
            document.body.innerHTML = `
                <div style="padding:20px; text-align:center;">
                    <p style="color:#ff7a00; font-weight:600;">Login required</p>
                    <p style="font-size:12px; color:#777;">
                        Please login on Linkzzzz website first
                    </p>
                </div>
            `;
            return;
        }

        // 4. CATEGORY FETCH (FROM BACKEND ONLY)
        async function loadCategories() {
            try {
                const res = await fetch("http://localhost:5000/categories", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.token}`
                    }
                });
                const data = await res.json();

                const select = document.getElementById("category");
                select.innerHTML = "";

                data.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = cat.name;
                    option.textContent = cat.name;
                    select.appendChild(option);
                });
            } catch (e) {
                console.error("Fetch error", e);
            }
        }

        loadCategories();

        // Populate title and link from current tab by default
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length > 0) {
                const currentTab = tabs[0];
                document.getElementById("title").value = currentTab.title || "";
                document.getElementById("link").value = currentTab.url || "";
            }
        });

        // 3. UX LOGIC (IMPORTANT) SHOW MODE BASED UI
        // Getting command state so Alt+Shift+L and Alt+Shift+M trigger the exact behavior
        chrome.storage.local.get(['popupMode'], function (result) {
            const data = {
                link: result.popupMode !== 'notes', // default to link
                openNotes: result.popupMode === 'notes'
            };

            if (data.link) {
                document.getElementById("notes").style.display = "none";
            }

            if (data.openNotes) {
                document.getElementById("link").style.display = "none";
                document.getElementById("notes").focus();
            }

            // Clear mode so regular extension icon click opens normally next time
            chrome.storage.local.remove('popupMode');
        });

        // 6. SAVE LOGIC
        document.getElementById("save").addEventListener("click", async () => {
            let title = document.getElementById("title").value;
            const link = document.getElementById("link").value;
            const notes = document.getElementById("notes").value;
            const category = document.getElementById("category").value;

            if (!title) title = link || "Quick Note";

            try {
                const res = await fetch("http://localhost:5000/add-item", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.token}`
                    },
                    body: JSON.stringify({
                        title,
                        content: link || notes,
                        category
                    })
                });

                if (res.ok) {
                    window.close();
                } else {
                    alert("Failed to save");
                }
            } catch (e) {
                alert("Failed to connect to backend");
            }
        });
    });
});