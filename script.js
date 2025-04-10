(function() {
  let gameConfig = null;
  let loadedParams = {};

  // Carica la configurazione di gioco dalla chrome.storage oppure dal file default.md
  async function loadGameConfig() {
    if (!gameConfig) {
      let configText = "";
      const localConfig = await getLocalItem("default.md");
      if (localConfig) {
        configText = localConfig;
      } else {
        const configUrl = chrome.runtime.getURL("default.md");
        const response = await fetch(configUrl);
        configText = await response.text();
      }
      gameConfig = parseConfig(configText);
    }
    return gameConfig;
  }

  // Mostra un overlay durante l'attesa della risposta
  function showOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "waitingOverlay";
    overlay.textContent = "In attesa di ChatGPT...";
    document.body.appendChild(overlay);
  }

  // Rimuove l'overlay
  function removeOverlay() {
    const overlay = document.getElementById("waitingOverlay");
    if (overlay) overlay.remove();
  }

  // Attende che il pulsante sia presente
  function waitForButton() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        const speechButton = document.querySelector('button[data-testid="composer-speech-button"]');
        const submitButton = document.querySelector('button[data-testid="composer-submit-button"]');
        if (speechButton || submitButton) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  // Converte la risposta dell'assistente in un oggetto (chiave = valore)
  function parseAssistantResponse(text) {
    const lines = text.split("\n");
    const data = {};
    lines.forEach(line => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        data[parts[0].trim()] = parts.slice(1).join("=").trim();
      }
    });
    return data;
  }

  // Converte il file mappings.txt in un oggetto
  function parseMappings(text) {
    const map = {};
    text.split(/\r?\n/).forEach(line => {
      if (line.trim() && line.includes("=")) {
        const [id, key] = line.split("=");
        map[id.trim()] = key.trim();
      }
    });
    return map;
  }

  // Aggiorna la UI sulla base della risposta dell'assistente
  async function updateUIFromAssistant(container) {
    const assistantDivs = document.querySelectorAll('div[data-message-author-role="assistant"]');
    if (assistantDivs.length === 0) return;
    const lastAssistantDiv = assistantDivs[assistantDivs.length - 1];
    const data = parseAssistantResponse(lastAssistantDiv.innerText);
    Object.keys(loadedParams.mappings).forEach(id => {
      const key = loadedParams.mappings[id];
      const el = container.querySelector("#" + id);
      if (el && data[key]) el.textContent = data[key];
    });
    if (data["GameOver"] === "true") {
      const scelteSection = container.querySelector("#scelte");
      if (scelteSection) {
        scelteSection.innerHTML = "";
        const nuovoBtn = document.createElement("button");
        nuovoBtn.textContent = "Nuova partita";
        nuovoBtn.className = "scelta";
        nuovoBtn.style.gridColumn = "1 / -1";
        nuovoBtn.addEventListener("click", () => {
          window.location.href = "https://chatgpt.com";
        });
        scelteSection.appendChild(nuovoBtn);
      }
    }
  }

  // Configura il container del gioco basandosi sul layout definito in Interfaccia utente
  function setupGameContainer(html) {
    const dismissLink = document.querySelector('a[data-testid="dismiss-welcome"]');
    if (dismissLink) { dismissLink.click(); }
    document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.remove());
    document.querySelectorAll("style").forEach(el => el.remove());
    document.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());
    Array.from(document.body.children).forEach(child => (child.style.display = "none"));

    const container = document.createElement("div");
    container.id = "gameContainer";
    container.innerHTML = html;
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "999",
      overflow: "auto"
    });
    document.body.appendChild(container);

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = chrome.runtime.getURL("icon.png");
    document.head.appendChild(link);

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    document.title = doc.querySelector("title").textContent;
    return container;
  }

  // Assegna le opzioni iniziali in modo casuale (usa direttamente loadedParams.numChoices)
  function assignRandomOptions(container) {
    const scelteSection = container.querySelector("#scelte");
    scelteSection.innerHTML = "";
    // Ordina in modo casuale e seleziona il numero di opzioni desiderato
    const selectedOptions = loadedParams.startingOptions.slice().sort(() => 0.5 - Math.random()).slice(0, loadedParams.numChoices);
    selectedOptions.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "scelta";
      button.id = "scelta" + (index + 1);
      button.textContent = option;
      scelteSection.appendChild(button);
    });
  }

  // Imposta i listener sui pulsanti delle scelte; usa direttamente loadedParams.maxTurns e loadedParams.numChoices
  function setupButtonListeners(container, currentTurnObj) {
    const buttons = [];
    for (let i = 1; i <= loadedParams.numChoices; i++) {
      const button = container.querySelector("#scelta" + i);
      if (button) {
        buttons.push(button);
      }
    }
    buttons.forEach((button, index) => {
      button.addEventListener("click", async () => {
        showOverlay();
        let finalCommand = "";
        if (currentTurnObj.current === 0) {
          finalCommand = loadedParams.prompt_start;
        } else if (currentTurnObj.current >= loadedParams.maxTurns) {
          finalCommand = loadedParams.prompt_end;
        } else {
          finalCommand = loadedParams.prompt_normal;
        }
        // Sostituisce le variabili segnaposto nel prompt
        finalCommand = finalCommand
          .replace("%TESTO%", button.textContent)
          .replace("%NUMERO%", (index + 1).toString())
          .replace("%TURNO%", currentTurnObj.current.toString())
          .replace("%TURNI%", loadedParams.maxTurns.toString());

        const chatInput = document.querySelector("#prompt-textarea");
        if (chatInput) {
          const lines = finalCommand.split("\n");
          chatInput.innerHTML = lines.map(line => `<p>${escapeHtml(line)}</p>`).join("");
          await delay(100);
          const sendButton = document.getElementById("composer-submit-button");
          if (sendButton) {
            sendButton.click();
            await waitForButton();
            updateUIFromAssistant(container);
            currentTurnObj.current++;
          }
        }
        removeOverlay();
      });
    });
  }

  // Al caricamento, carica la configurazione, prepara la UI e imposta i listener
  window.addEventListener("load", async () => {
    await delay(3000);
    const config = await loadGameConfig();
    loadedParams = {
      prompt_start: config["Prompt iniziale"],
      prompt_normal: config["Prompt intermedio"],
      prompt_end: config["Prompt finale"],
      maxTurns: parseInt(config["Numero massimo di turni"]),
      numChoices: parseInt(config["Numero di scelte"]),
      startingOptions: config["Scelte iniziali"].split(/\r?\n/).filter(l => l.trim() !== ""),
      mappings: parseMappings(config["Mappa ID-variabili"]),
      userInterface: config["Interfaccia utente"]
    };

    const initialTurnCount = document.querySelectorAll('div[data-message-author-role="assistant"]').length;
    let currentTurnObj = { current: initialTurnCount };
    const gameContainer = setupGameContainer(loadedParams.userInterface);

    if (currentTurnObj.current === 0) {
      assignRandomOptions(gameContainer);
    } else {
      updateUIFromAssistant(gameContainer);
    }
    setupButtonListeners(gameContainer, currentTurnObj);
  });
})();