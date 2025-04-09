# Il Leviatano

## Prompt iniziale
```
Sei il game master de "Il Leviatano", un gioco di ruolo libertario in cui il giocatore impersona il Primo Ministro che deve amministrare una Nazione. La morale è che meno Stato e più libertà economiche e sociali comportano sfide impegnative ma premianti nel lungo termine, mentre l'espansione dello Stato genera pressione fiscale, burocrazia, corruzione, derive autoritarie.
Il mandato dura %TURNI% turni. Ogni turno propone una nuova sfida legata allo Stato scelto (ad esempio scioperi, scandali, accuse dell'opposizione, attentati, criminalità, guerre, tensioni sociali, andamento di occupazione, inflazione, approvvigionamento energetico e materie prime, scoperte tecnologiche, catastrofi naturali, etc). Il giocatore sceglie tra quattro opzioni, ciascuna ispirata a un quadrante del political compass, senza però specificarlo. Devono verificarsi conseguenze coerenti e presentarsi dilemmi inediti. Visioni estreme portano a instabilità.

Il giocatore ha scelto di iniziare la partita in %TESTO%, presenta la situazione del paese e la prima sfida.

Devi rispondere sempre e solo nel formato seguente, compilando e aggiornando i campi dopo il segno = e senza mai aggiungere altro:
GameOver=false ("true" in caso di deposizione del Primo Ministro)
DebitoPubblico=numero percentuale sul PIL (ad es. "135")
ApprovazionePopolare=numero da 0 a 100
AppoggioIstituzioni=una parola
RelazioniInternazionali=una parola
Giornale1=un titolo di giornale
Giornale2=un titolo di giornale
Giornale3=un titolo di giornale
Storia=il testo della storia con la nuova sfida da affrontare, senza mai andare a capo
Scelta1=una frase
Scelta2=una frase
Scelta3=una frase
Scelta4=una frase
```

## Prompt intermedio
```
Turno %TURNO% di %TURNI%: il giocatore ha fatto la scelta numero %NUMERO%, prosegui la storia e presenta la prossima sfida.
```

## Prompt finale
```
Turno %TURNO% di %TURNI%: il giocatore ha fatto la scelta numero %NUMERO%, il mandato si è concluso e la partita è finita, concludi la storia.

Rispondi nel formato seguente, compilando e aggiornando i campi dopo il segno = e senza aggiungere altro:
GameOver=true
DebitoPubblico=numero percentuale sul PIL (ad es. "135")
ApprovazionePopolare=numero da 0 a 100
AppoggioIstituzioni=una parola
RelazioniInternazionali=una parola
Giornale1=un titolo di giornale
Giornale2=un titolo di giornale
Giornale3=un titolo di giornale
Storia=il testo con la conclusione della storia, senza mai andare a capo
```

## Numero massimo di turni
```
12
```

## Numero di scelte
```
4
```

## Scelte iniziali
```
Italia
Francia
Germania
Spagna
Canada
Australia
Stati Uniti
Brasile
Argentina
Cile
Venezuela
Cuba
Russia
Cina
Corea del Nord
Giappone
India
Pakistan
Arabia Saudita
Iran
Israele
Turchia
Sudafrica
Nigeria
Etiopia
Egitto
Vietnam
Thailandia
Indonesia
Filippine
Svezia
Norvegia
Finlandia
Regno Unito
Polonia
Ungheria
Ucraina
Grecia
Serbia
Singapore
Nuova Zelanda
Messico
Colombia
Malesia
Kazakhstan
Emirati Arabi Uniti
Qatar
Sud Corea
Bangladesh
Afghanistan
Myanmar
```

## Mappa ID-variabili
```
indicatore1=DebitoPubblico
indicatore2=ApprovazionePopolare
indicatore3=AppoggioIstituzioni
indicatore4=RelazioniInternazionali
titolo1=Giornale1
titolo2=Giornale2
titolo3=Giornale3
testo-storia=Storia
scelta1=Scelta1
scelta2=Scelta2
scelta3=Scelta3
scelta4=Scelta4
```

## Interfaccia utente
```
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Il Leviatano</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      color: black;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #1a237e;
      color: white;
      padding: 0.45rem;
      text-align: center;
      border-bottom: 4px solid #c5cae9;
    }
    .container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 15px rgba(0,0,0,0.1);
    }
    #indicatori {
      display: flex;
      justify-content: space-around;
      margin-bottom: 2rem;
      gap: 1rem;
    }
    .indicatore {
      background: #e8eaf6;
      padding: 1rem;
      border-left: 6px solid #1a237e;
      border-radius: 6px;
      text-align: center;
      flex: 1;
      font-weight: bold;
    }
    #titoli-giornali {
      margin-bottom: 2rem;
      font-family: 'Times New Roman', Times, serif;
      background: #fffbe6;
      padding: 1rem;
      border-left: 5px solid #1a237e;
    }
    #titoli-giornali h2 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
    }
    #titoli-giornali ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
    #titoli-giornali li {
      font-size: 1.15rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      border-bottom: 1px dashed #999;
      padding-bottom: 0.3rem;
    }
    #storia {
      margin-bottom: 2rem;
      font-size: 1.15rem;
      line-height: 1.5;
    }
    #scelte {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .scelta {
      padding: 1rem;
      background-color: #3949ab;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .scelta:hover {
      background-color: #303f9f;
    }
    #waitingOverlay {
      position:fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background:rgba(0,0,0,0.5);
      display:flex;
      justify-content:center;
      align-items:center;
      color:#fff;
      font-size:2rem;
      z-index:1000;
    }
  </style>
</head>
<body>
  <header>
    <h1>Il Leviatano</h1>
    <p>Un gioco di Francesco Focher</p>
  </header>
  <div class="container">

    <section id="indicatori">
      <div class="indicatore">Debito Pubblico: <span id="indicatore1">-</span>% del PIL</div>
      <div class="indicatore">Approvazione Popolare: <span id="indicatore2">-</span>%</div>
      <div class="indicatore">Appoggio delle Istituzioni: <span id="indicatore3">-</span></div>
      <div class="indicatore">Relazioni Internazionali: <span id="indicatore4">-</span></div>
    </section>

    <section id="titoli-giornali">
      <h2>Giornali di oggi</h2>
      <ul>
        <li id="titolo1">Cambio al Vertice: Si Apre un Nuovo Capitolo per la Nazione</li>
        <li id="titolo2">Transizione Completata: Il Popolo Accoglie il Nuovo Leader</li>
        <li id="titolo3">Governo al Via: Attese Riforme e Decisioni Cruciali</li>
      </ul>
    </section>

    <section id="storia">
      <h2>Situazione attuale</h2>
      <p id="testo-storia">Benvenuto Primo Ministro!<br>Dopo una lunga e travagliata campagna elettorale, sei finalmente salito al potere. Le folle acclamano, i giornali titolano, le lobby si muovono nell’ombra. Ora tocca a te dimostrare se sei un visionario... o solo l’ennesimo disastro annunciato.<br>Ogni tua decisione plasmerà il futuro del Paese: bilancio, approvazione popolare, equilibri istituzionali e relazioni internazionali sono nelle tue mani. Scegli con astuzia. Sopravvivi al potere. Oppure affonda con stile.<br><br>Scegli in quale nazione vuoi iniziare la partita.</p>
    </section>

    <section id="scelte">
      <button class="scelta" id="scelta1">Italia</button>
      <button class="scelta" id="scelta2">Francia</button>
      <button class="scelta" id="scelta3">Germania</button>
      <button class="scelta" id="scelta4">Spagna</button>
    </section>

  </div>
</body>
</html>
```
