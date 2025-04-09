# 🎮 ChatGPT Game Maker

**ChatGPT Game Maker** è un'estensione per Chrome che trasforma ChatGPT in una piattaforma per creare **giochi testuali interattivi**. Ogni elemento del gameplay è completamente personalizzabile: prompt, interfaccia, logica narrativa, scelte e aspetto visivo. Puoi progettare, condividere e giocare infinite esperienze, direttamente nel browser.

---

## ✨ Funzionalità principali

- ⚙️ **Editor integrato** per configurare ogni aspetto del gioco.
- 📄 **Importa/Esporta giochi completi** in formato Markdown.
- 📂 **Salvataggio locale** per modifiche sicure e sperimentali.
- 🧠 **Generazione dinamica** della storia con ChatGPT.
- ♻️ **Ciclo di gioco flessibile** con turni e scelte dinamiche.
- 🖼️ **Interfaccia HTML/CSS personalizzabile** con supporto per indicatori, testi dinamici e scelte multiple.
- 🧪 **Modding avanzato** per creare giochi fantasy, sci-fi, educativi, romantici, gestionali...

---

## 🚀 Come si installa

1. [Scarica](https://github.com/OrangeBaron/ChatGPT-GameMaker/archive/refs/heads/main.zip) o clona il repository:
   ```bash
   git clone https://github.com/OrangeBaron/ChatGPT-GameMaker.git
   ```
2. Apri Chrome e vai su `chrome://extensions/`
3. Attiva la **Modalità sviluppatore** in alto a destra
4. Clicca su **Carica estensione non pacchettizzata** e seleziona la cartella del progetto
5. Vai su [chatgpt.com](https://chatgpt.com) per iniziare a giocare o creare

---

## 🛠️ Crea o modifica il tuo gioco

La configurazione avviene nella pagina dell'estensione, cliccando su **"Opzioni"**. Qui puoi creare o modificare il tuo gioco interamente tramite un'interfaccia semplice basata su sezioni. Ecco tutto ciò che puoi personalizzare:

### Prompt
- **Prompt iniziale**: viene inviato a ChatGPT all'inizio del gioco per impostare il tono, le regole e la formattazione della risposta.
- **Prompt intermedio**: viene usato a ogni turno per far avanzare la storia.
- **Prompt finale**: chiude la storia al termine della partita.

Puoi usare le seguenti **variabili dinamiche** nei prompt:
- `%NUMERO%`: numero della scelta effettuata
- `%TESTO%`: testo della scelta selezionata
- `%TURNO%`: numero del turno attuale
- `%TURNI%`: numero totale di turni

Esempio:
```
Turno %TURNO% di %TURNI%: il giocatore ha scelto l'opzione %NUMERO%, ovvero "%TESTO%". Continua la storia...
```

### Meccaniche di gioco
- **Numero massimo di turni**: quanti cicli (turni) ha la partita.
- **Numero di scelte**: quante opzioni vengono mostrate ogni turno.
- **Scelte iniziali**: elenco delle ambientazioni o contesti tra cui scegliere all'inizio del gioco.

### Interfaccia HTML
Puoi modificare completamente l'interfaccia del gioco scrivendo HTML e CSS. Devi solo rispettare alcune **regole minime**:
- Le scelte devono trovarsi in:
```html
<section id="scelte">
  <button id="scelta1" class="scelta">Opzione A</button>
  <button id="scelta2" class="scelta">Opzione B</button>
</section>
```
- Gli ID degli elementi visivi (per esempio `indicatore1`) devono corrispondere a quelli definiti nella **Mappa ID-variabili** (vedi sotto).

### Mappa ID-variabili
Collega le variabili testuali restituite da ChatGPT ai rispettivi elementi HTML.

Esempio:
```
indicatore1=Salute
indicatore2=Zaino
testo-storia=Storia
scelta1=Scelta1
scelta2=Scelta2
```
Quando ChatGPT invia `Salute=90`, verrà aggiornato automaticamente l'elemento con ID `indicatore1`.
Inoltre, ChatGPT può terminare anticipatamente il gioco in qualsiasi momento impostando `GameOver=true`, ad esempio in caso di eventi drammatici o scelte disastrose.

### Importazione, Esportazione e Reset
- **Importa**: carica un file `.md` di configurazione personalizzata
- **Esporta**: salva la configurazione attuale in un file Markdown
- **Resetta**: ripristina i valori predefiniti originali

---

## 🎁 Gioco d’esempio incluso
**ChatGPT Game Maker** viene fornito con un gioco precaricato: [Il Leviatano](https://github.com/OrangeBaron/ChatGPT-GameMaker/blob/main/default.md).
Si tratta di una simulazione politica in cui il giocatore interpreta il Primo Ministro di una nazione, affrontando crisi, sfide economiche e dilemmi etici. Ogni scelta influisce sul debito pubblico, il consenso popolare, l’appoggio istituzionale e le relazioni internazionali.

È un esempio potente di come si possa usare la piattaforma per costruire esperienze complesse e coinvolgenti.

---

## ⚖️ Licenza

Distribuito sotto **GNU GPL v3**.  
Puoi usarlo, modificarlo e ridistribuirlo mantenendo la stessa licenza.