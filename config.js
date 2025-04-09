document.addEventListener("DOMContentLoaded", async function() {
  // Carica il file di configurazione usando getLocalItem di utils.js
  async function loadGameFile() {
    let config = await getLocalItem("default.md");
    if (config) {
      return config;
    } else {
      const url = chrome.runtime.getURL("default.md");
      const response = await fetch(url);
      const text = await response.text();
      return text;
    }
  }

  // Carica il contenuto e lo trasforma in un oggetto di configurazione usando parseConfig
  const gameFileContent = await loadGameFile();
  const configObj = parseConfig(gameFileContent);
  const container = document.getElementById("configContainer");
  container.innerHTML = "";

  // Crea una sezione per ogni chiave della configurazione
  for (const [key, content] of Object.entries(configObj)) {
    const section = document.createElement("div");
    section.className = "config-section";
    
    const label = document.createElement("label");
    label.textContent = key;
    
    const textarea = document.createElement("textarea");
    textarea.id = "txt-" + key;
    textarea.value = content;
    
    section.appendChild(label);
    section.appendChild(textarea);
    container.appendChild(section);
  }

  // Funzione per rigenerare la configurazione in formato Markdown
  function buildMarkdown() {
    let md = "# ChatGPT Game Maker - Configurazione Personalizzata\n";
    for (const key in configObj) {
      const textarea = document.getElementById("txt-" + key);
      const content = textarea ? textarea.value : "";
      md += `\n## ${key}\n\`\`\`\n${content}\n\`\`\`\n`;
    }
    return md;
  }

  // Salva la configurazione usando setLocalItem di utils.js
  const saveBtn = document.getElementById("saveConfigBtn");
  saveBtn.addEventListener("click", async () => {
    const md = buildMarkdown();
    try {
      await setLocalItem("default.md", md);
      alert("Configurazione salvata.");
    } catch (err) {
      console.error("Errore durante il salvataggio:", err);
      alert("Errore durante il salvataggio della configurazione.");
    }
  });

  // Esporta la configurazione in un file markdown (operazione locale, indipendente dallo storage)
  const exportBtn = document.getElementById("exportConfigBtn");
  exportBtn.addEventListener("click", async () => {
    const md = buildMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    
    if (window.showSaveFilePicker) {
      try {
        const options = {
          suggestedName: "configurazione_personalizzata.md",
          types: [
            {
              description: "Markdown Files",
              accept: { "text/markdown": [".md"] },
            },
          ],
        };
        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        alert("File salvato correttamente!");
      } catch (err) {
        console.error("Errore nel salvataggio del file:", err);
        alert("Errore nel salvataggio del file.");
      }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "configurazione_personalizzata.md";
      a.click();
      URL.revokeObjectURL(url);
    }
  });
  
  // Importa la configurazione da un file markdown e la salva usando setLocalItem
  const importBtn = document.getElementById("importConfigBtn");
  const importFileInput = document.getElementById("importFile");
  importBtn.addEventListener("click", () => {
    importFileInput.click();
  });
  importFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function(e) {
        const fileContent = e.target.result;
        const newConfig = parseConfig(fileContent);
        for (const key in configObj) {
          if (newConfig[key] !== undefined) {
            const textarea = document.getElementById("txt-" + key);
            if (textarea) {
              textarea.value = newConfig[key];
            }
          }
        }
        const md = buildMarkdown();
        try {
          await setLocalItem("default.md", md);
          alert("Configurazione importata e salvata automaticamente.");
        } catch (err) {
          console.error("Errore durante l'importazione della configurazione:", err);
          alert("Errore durante l'importazione.");
        }
      };
      reader.readAsText(file);
    }
  });
  
  // Ripristina la configurazione predefinita eliminando la chiave dallo storage con removeLocalItem
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", async () => {
    try {
      await removeLocalItem("default.md");
      alert("Configurazione ripristinata ai valori predefiniti. Ricarica la pagina per applicare i cambiamenti.");
      location.reload();
    } catch (err) {
      console.error("Errore nel reset della configurazione:", err);
      alert("Errore nel ripristinare la configurazione.");
    }
  });
});