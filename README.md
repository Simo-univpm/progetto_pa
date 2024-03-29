# Progetto programmazione avanzata aa 21/22
## Sviluppo di un backend per la gestione della compravendita di energia

# Membri del gruppo
- Francalancia Simone, matricola s1102917
- Silveri Nicola, matricola s1101284

# Descrizione e obbiettivo del progetto
L'obbiettivo è quello di realizzare un sistema che consenta di gestire il processo di compravendita di energia “locale”. Esistono N produttori e M consumatori. Un produttore può mettere a disposizione di un acquirente in una fascia oraria di 1h un certo quantitativo di energia. Il processo di compravendita ha un orizzonte temporale di 1 giorno, ovvero si compra oggi uno o più “slot” per domani.
- I produttori mettono possono mettere a disposizione degli slot temporali della durata di 1h con un valore pari a x kWh.
- Ogni produttore ha una capacità massima di produzione oraria che non deve essere superata (questo valore è diverso per ogni produttore e per ogni fascia oraria).
- Ogni produttore specifica anche la fonte con la quale genera energia e si identificano le seguenti possibilità: Fossile; Eolico; Fotovoltaico.
- Per ogni fascia oraria il produttore indica il quantitativo che può erogare che deve essere minore o uguale al quantitativo che può fornire.
- Un compratore può acquistare energia da uno o più venditori per un giorno. Per una fascia oraria un compratore può comprare solo da un produttore.
- Un compratore non può comprare per una fascia oraria un quantitativo superiore a quello massimo erogabile da quel produttore.
- I consumatori possono opzionare gli slot entro le 24h. (es. slot 7 Luglio 2022 ore 15:00 è prenotabile fino alle ore 14:59 del 6 Luglio 2022).
- Se un produttore riceve per una fascia oraria più richieste, allora devono essere verificati i seguenti casi:
  -	Se la somma delle richieste è inferiore o uguale alla capacità erogabile per quella fascia oraria allora non vi sono particolari azioni da svolgere.
  - Se la somma delle richieste è superiore o uguale alla capacità erogabile per quella fascia oraria allora il produttore potrà decidere se accettare le richieste effettuando un taglio lineare a quanto richiesto dai vari consumatori. Il taglio è proporzionale al quantitativo richiesto.

## Diagramma use-case
Il seguente diagramma use case mostra le principali interazioni tra gli attori ed il sistema. Essendo una progettazione svolta all'inizio del progetto potrebbe essere leggermente inaccurata.
<p align="left">
    <img src="./images/diagramma use-case.png?raw=true" width="100%" height="auto">
</p>


## Indice
- [librerie utilizzate](#librerie-utilizzate)
- [struttura directory progetto](#struttura-della-directory-del-progetto)
- [pattern utilizzati](#pattern-utilizzati)
- [sequence diagram](#sequence-diagrams)
- [diagramma entity relationship](#diagramma-entity-relationship)
- [autenticazione e JWT](#autenticazione-e-jwt)
- [chiamate API](#chiamate-api)
- [indice chiamate API](#indice-chiamate-api)
- [esecuzione del progetto](#esecuzione-del-progetto)
- [software ausiliari utilizzati](#software-ausiliari-utilizzati)

## Librerie utilizzate
- express, v4.16.1 per lo sviluppo del server 
- dotenv, 16.0.1 per sfruttare le variabili d'ambiente
- jsonwebtoken, v8.5.1 per l'autenticazione
- sequelize, v6.21.0 e sequelize-cli, v6.4.1 per l'interfacciamento con il databse
- pg, v8.7.3 e pg-hstore, v2.3.4 client per il database postgres
- bcryptjs, v2.4.3  per hashing delle password
- nodemon, v2.0.19 per facilitare lo sviluppo

## Struttura della directory del progetto
```
.
└── progetto_pa
    |
    ├── controllers
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── consumerController.js
    │   ├── producerController.js
    │   └── slotController.js
    |
    ├── middlewares
    │   ├── checkAdmin.js
    │   ├── checkConsumer.js
    │   ├── checkCredit.js
    │   ├── checkLogin.js
    │   └── checkProducer.js
    |
    ├── database
    │   └── database_seeding.sql
    |
    ├── model
    │   ├── admin.js
    │   ├── consumer.js
    │   ├── database.js
    │   ├── producer.js
    │   └── transazioni.js
    |
    ├── routes
    │   ├── admin.js
    │   ├── auth.js
    │   ├── consumers.js
    │   ├── producers.js
    │   └── slot.js
    |
    ├── index.js
    |
    ├── docker-compose.yml
    ├── dockerfile
    |
    ├── README.md
    |
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    └── test.js
```

## Pattern utilizzati

- ### Model View Controller (MVC)
Come pattern architetturale è stato scelto di utilizzare l'MVC; nel nostro caso tutte le entità rappresentanti il dominio interessato sono contenuti nella directory model, mentre i controller che offrono tutte le logiche di business per operare con le entità sono contenute nella directory controllers, permettendoci quindi di separare completamente le entità dai relativi metodi. Inoltre questo rende indipendente lo sviluppo del server backend rispetto allo sviluppo dell'interfaccia grafica, che appunto è stata simulata con Postman per ovviare alla sua mancanza.

- ### Singleton
Il singleton è un pattern che ci garantisce l'esistenza di una singola istanza di entità all'interno dell'applicazione. In particolare è stato usato il pattern per istanziare la connessione al database postgres che essendo costosa va limitata.
Il file che sfrutta questo pattern è "singleton.js" presente all'interno della directory model. All'interno di questo file è presente una classe con un metodo statico "genera_singleton" che ci permette di ottenere l'istanza di sequelize se è già stata creata, altrimenti ne genererà una al momento della richiesta tramite le variabili d'ambiente specificate nel file ".env".
Questo ci permette di andare ad effettuare le query sfruttando solamente l'unica connessione al database postgres esitente e quindi di risparmiare risorse.
Il metodo che ci permette di ottenere la connessione è esportato sotto il nome di "sequelize" (che corrisponde a "Singleton.genera_singleton.get_istanza()"), di conseguenza all'interno di ogni model sarà presente il comando "const sequelize = require('./singleton').sequelize;" per sfruttarla generando le query di cui il software ha bisogno.
<p align="left">
    <img src="./images/singleton class diagram.png?raw=true" width="100%" height="auto">
</p>

- ### Chain Of Responsibility (COR)
Il COR è un pattern comportamentale che permette di passare le richieste lungo una "catena" di gestori. Dopo aver ricevuto una richiesta, ogni gestore elabora la richiesta e decide se passarla al gestore successivo della catena o se sollevare un'eccezione.
Nel software sviluppato questo pattern è individuabile nel file principale "index.js" dove si proteggono le rotte per l'accesso alle risorse con una catena di middlewares. Ad esempio la rotta ".../api/consumers" è protetta da una COR di 3 middleware ovvero: checkLogin, checkConsumer e checkCredit. Il cor è implementato secondo questa istruzione "app.use('/api/consumers', [checkLogin, checkConsumer, checkCredit]);" che appunto "filtra" la richiesta secondo i 3 middlewares.
In particolar modo checkLogin si occupa di verificare se l'utente che genera la richiesta è autenticato o meno, se è autenticato la richiesta passa al middleware checkConsumer che si occupa di controllare se l'utente possiede i privilegi da consumer e se l'utente è un consumer allora si passa la richiesta all'ultimo middleware checkCredit che verifica se l'utente è in possesso di credito.
Se la richiesta non rispetta le specifiche allora verrà ritornato un errore in base al middleware.


## Sequence diagrams
Di seguito abbiamo riportato i principali casi d'interazione tra gli attori e il sistema realizzato sotto forma di sequence diagrams. I casi che abbiamo riportato sono:
### 1. registrazione di un producer
<p align="left">
    <img src="./images/registra producer.png?raw=true" width="100%" height="auto">
</p>

### 2. login di un qualsiasi utente
<p align="left">
    <img src="./images/login utente.png?raw=true" width="100%" height="auto">
</p>

### 3. prenotazione di uno slot per il giorno seguente
<p align="left">
    <img src="./images/prenotazione slot.png?raw=true" width="100%" height="auto">
</p>

### 4. chiamata admin per ricaricare il credito di un utente
<p align="left">
    <img src="./images/ricarica credito.png?raw=true" width="100%" height="auto">
</p>

## Diagramma entity relationship
Il seguente schema E-R mostra invece la struttura del database quindi delle entità e delle relazioni con i loro corrispettivi attributi:
<p align="left">
    <img src="./images/diagramma entity relationship.png?raw=true" width="100%" height="auto">
</p>

## Autenticazione e JWT
L'autenticazione serve per distinguere i vari utenti quando qualcuno effettua una chiamata ad una particolare rotta. Tutte le rotte ad eccezione di quelle per l'autenticazione hanno bisogno del Json Web Token per il funzionamento in quanto il token porta con se delle informazioni vitali per il server, il token si ottiene effettuando una chiamata POST alla rotta ".../auth/login" nella quale bisogna inserire i privilegi, la mail e la password. Una volta effettuata la chiamata verrà restituito una stringa cifrata tramite la libreria "jsonwebtoken" e l'utilizzo del token secret (TOKEN_SECRET) che è impostato nel file .env contenente le variabili d'ambiente.
Il token, se decifrato contiene le seguenti informazioni:
```
{ 
    id: id,
    privilegi: user.privilegi,
    nome: user.nome,
    email: user.email
}
```
dove:
- **id** (valore) contiene l'id dell'utente che ha effettuato il login
- **privilegi** (valore) è un numero intero che indica i privilegi dell'utente (0 se admin, 1 se producer, 2 se consumer)
- **nome** (stringa) contiene il nome dell'utente che ha effettuato il login
- **email** (stringa) contiene la mail dell'utente che ha effettuato il login

# Chiamate API
Le api esposte dal progetto sono state testate mediante l'utilizzo di Postman (https://www.postman.com/); tutte le chiamate eccetto quelle rispondenti all'endpoint .../api/auth necessitano del token "auth-token" nell'header della richiesta. Il token contiene le informazioni base degli utenti **necessarie** al funzionamento del programma.
Il token si ottiene al login e va impostato manualmente in postman nell'apposito campo "headers": nella campo **"key"** va inserito **"auth-token"** e nel campo **"valore"** va inserita **la stringa ricevuta dal server al momento del login**.
Di seguito sono indicate tutte le chiamate HTTP disponibili, le relative descrizioni e degli esempi di body usati per testare il software:

## Indice chiamate API
- [(POST)  ...:8080/api/auth/registerProducer](#post-registerproducer)
- [(POST)  ...:8080/api/auth/registerConsumer](#post-registerconsumer)
- [(POST)  ...:8080/api/auth/registerAdmin](#post-registeradmin)
- [(POST)  ...:8080/api/auth/login](#post-login)
- [(POST)  ...:8080/api/slot/](#post--)
- [(PATCH) ...:8080/api/slot/](#patch-)
- [(GET)   ...:8080/api/consumers/emissions](#get-emissions)
- [(GET)   ...:8080/api/consumers/transactions/producer](#get-transactionsproducer)
- [(GET)   ...:8080/api/consumers/transactions/periodo](#get-transactionsperiodo)
- [(GET)   ...:8080/api/consumers/transactions/fonte](#get-transactionsfonte)
- [(GET)   ...:8080/api/producers/checkReservations](#get-checkreservations)
- [(GET)   ...:8080/api/producers/checkEarnings](#get-checkearnings)
- [(GET)   ...:8080/api/producers/checkStats](#get-checkstats)
- [(PATCH) ...:8080/api/producers/kw](#patch-kw)
- [(PATCH) ...:8080/api/producers/costo](#patch-costo)
- [(POST)  ...:8080/api/admin/ricarica](#post-ricarica)

## Chiamate disponibili per tutti gli utenti all'endpoint **"...:8080/api/auth"**

- ### (POST) .../registerProducer
Rotta comune a tutti gli utenti, serve per effettuare la registrazione di un nuovo producer.
La richiesta necessita di un body con i seguenti dati:
```
{
    "nome": "nome produttore",
    "email": "email@produttore.it",
    "passwd": "password_produttore",
    "fonte_produzione": "fotovoltaico",
    "emissioni_co2": 2.3,
    "costo": 3.5,
    "tetto_max_kwh_init": 1000,
    "taglio": true
}
```
dove:
- **nome** (stringa) è il nome del produttore
- **email** (stringa) è la email del produttore
- **passwd** (stringa) è la password del produttore
-  **fonte_produzione** (stringa) rappresenta le 3 tipologie di fonte di produzione specificate dalla consegna, ovvero "eolico", "fossile", "fotovoltaico";
-  **emissioni_co2** (valore) rappresenta i grammi di co2 prodotti per kw di energia
-  **costo** (valore) rappresenta il costo di ogni kw di energia
-  **tetto_max_kwh_init** (valore) rappresenta la soglia massima di produzione con la quale inizializzare **tutti** gli slot del produttore al momento della creazione (soglia alterabile tramite le chiamate apposite disponibili all'endpoint .../producers)
- **taglio** (boolean) rappresenta la possibilità per il produttore di applicare o meno un taglio lineare sia alle transazioni già effettuate sia ad una nuova transazione in ingresso nel caso in cui quest'ultima richieda un quantitativo superiore alla disponibilità.

- ### (POST) .../registerConsumer
Rotta comune a tutti gli utenti, serve per effettuare la registrazione di un nuovo consumer.
La richiesta necessita di un body con i seguenti dati:
```
{
    "nome": "nome consumer",
    "email": "email@consumer.it",
    "passwd": "password_consumer",
    "credito": 100000
}
```
dove:
- **credito** (valore) corrisponde al credito con il quale si vuole inizializzare l'utente. Il credito è necessario per prenotare gli slot.

- ### (POST) .../registerAdmin
Rotta comune a tutti gli utenti, serve per effettuare la registrazione di un nuovo amministratore.
La richiesta necessita di un body con i seguenti dati:
```
{
    "nome": "nome admin",
    "email": "email_admin",
    "passwd": "password_admin"
}
```

- ### (POST) .../login
Rotta comune a tutti gli utenti, serve per effettuare il login per ottenere il Json Web Token (JWT) di autenticazione necessario per effettuare una qualsiasi altra chiamata ad eccezione di quelle disponibili sotto questo endpoint.
La richiesta necessita di un body con i seguenti dati:
```
{
    "privilegi": 2,
    "email": "utente@email.it",
    "passwd": "utentePassword"
}
```
dove il campo "privilegi" sono i privilegi dell'utente inseriti al momento della registrazione (0 se è admin, 1 se è producer, 2 se è consumer). Effettuare un login con i privilegi sbagliati e le credenziali corrette ritornerà un errore.

---

## Chiamate disponibili solamente per i consumers all'endpoint **"...:8080/api/slot"**

- ### (POST)  .../
Rotta utilizzabile solamente dagli utenti consumers; serve per prenotare una data quantità di energia per un determinato slot verso un determinato produttore.
La richiesta necessita di un body con i seguenti dati:
```
{
    "id": 2,
    "slot": 16,
    "kw": 200
}
```
dove:
- **id** (valore) è l'id del produttore (id_producer) verso il quale si vuole prenotare lo slot;
- **slot** (valore) è lo slot/fascia oraria che si vuole prenotare (ad esempio lo slot 16 corrisponde alla fascia oraria che va dalle 16:00 alle 16:59 del giorno successivo a quello attuale);
- **kw** (valore) è la quantità di energia in kw che si vuole prenotare;


- ### (PATCH) .../
Rotta utilizzabile solamente dagli utenti consumers; serve per modificare una prenotazione precedentemente effettuata.
La richiesta necessita di un body con i seguenti dati:
```
{
    "id": 2,
    "slot": 16,
    "kw": 300
}
```
Dove i campi sono gli stessi della precedente chiamata POST.
Il comportamento della api cambia in base alla quantità di kw richiesti in modifica: E' possibile specificare 0 nel campo "kw" per annullare una prenotazione precedentemente effettuata oppure un numero di kw maggiore di quello già prenotato per aumentare la richiesta energetica per lo slot e il producer specificati.

---

## Chiamate disponibili solamente per i consumers all'endpoint **"...:8080/api/consumers"**

- ### (GET) .../emissions
Rotta utilizzabile solamente dagli utenti consumers; serve per ottenere il totale delle emissioni in termini di gCO2/Kwh prodotte dai vari acquisti effettuati dal consumer loggato in un range temporale specificato dall'utente.
La richiesta necessita di un body con i seguenti dati:
```
{
    "inizio": "2022-07-19 02:00",
    "fine":   "2022-07-21 15:00"
}
```
dove:
- **inizio**(stringa) rappresenta l'inizio del range temporale che si vuole analizzare
- **fine**(stringa) rappresenta il limite del range temporale che si vuole analizzare
quindi nel json riportato in esempio il server ritornerà tutte le emissioni prodotte dal 2022-07-19 alle ore 02:00 fino al 2022-07-21 alle ore 15:00.


- ### (GET) .../transactions/producer
Rotta utilizzabile solamente dagli utenti consumers; filtra le transazioni effettuate da un utente: serve per ottenere la lista delle transazioni effettuate dal consumer attualmente loggato verso il producer specificato nel body.
La richiesta necessita di un body con i seguenti dati:
```
{
    "id": 1
}
```

- ### (GET) .../transactions/periodo
Rotta utilizzabile solamente dagli utenti consumers; filtra le transazioni effettuate da un utente: serve per ottenere la lista delle transazioni effettuate dal consumer attualmente loggato per il periodo temporale specificato.
La richiesta necessita di un body con i seguenti dati:
```
{
    "inizio": "2022-07-19 02:00",
    "fine":   "2022-07-21 15:00"
}
```


- ### (GET) .../transactions/fonte
Rotta utilizzabile solamente dagli utenti consumers; filtra le transazioni effettuate da un utente: serve per ottenere la lista delle transazioni con una specifica fonte effettuate dal consumer attualmente loggato.
La richiesta necessita di un body con i seguenti dati:
```
{
    "fonte": "eolico"
}
```
dove:
- **fonte**(stringa) è il tipo di energia tramite il quale si vogliono filtrare le transazioni effettuate (sono ammessi i filtraggi solamente per il tipo di fonte richiesto dalla consegna, ovvero "eolico", "fossile", "fotovoltaico").

---

## Chiamate disponibili solamente per i producers all'endpoint **"...:8080/api/producers"**

- ### (GET) .../checkReservations
Rotta utilizzabile solamente dai producers; serve per verificare le richieste per il giorno seguente per gli slot specificati nel corpo della richiesta.
La richiesta necessita di un body con i seguenti dati:
```
{
    "slot_inizio": 0,
    "slot_fine": 23
}
```
dove:
- **slot_inizio** (valore)
- **slot_fine** (valore)
Con slot_inizio e slot_fine viene indicato il range di ricerca degli slot occupati. Il server ritornerà la percentuale di occupazione di ogni slot compreso nell'intervallo temporale rispetto alla capacità erogabile.

- ### (GET) .../checkEarnings
Rotta utilizzabile solamente dai producers; serve per calcolare i ricavi del producer loggato per il periodo temporale specificato.
La richiesta necessita di un body con i seguenti dati:
```
{
    "inizio": "2022-07-21 00:00",
    "fine": "2022-07-21 23:00"
}
```

- ### (GET) .../checkStats
Rotta utilizzabile solamente dai producers; serve per calcolare la deviazione standard e le percentuali minime, massime e medie di energia venduta in un dato periodo temporale specificato.
La richiesta necessita di un body con i seguenti dati:
```
{
    "inizio": "2022-07-21 00:00",
    "fine": "2022-07-21 23:00"
}
```
Il server ritornerà un json contenente le statistiche per ogni slot compreso nella fascia temporale.
Tuttavia questa funzione è stata lasciata incompleta in quanto ritornerà 4 valori uguali poiché le equazioni matematiche implementate sono le stesse e devono essere modificate per garantire un corretto funzionamento della chiamata api.


- ### (PATCH) .../kw
Rotta utilizzabile solamente dai producers; serve per modificare la quantità massima di energia erogabile per un determinato slot o per tutti gli slot disponibili di un produttore.
La richiesta è quindi in grado di accettare due body diversi:
```
{
    "slot": 23,
    "kw": 1500
}
```
dove:
- **slot**(valore) è il singolo slot che si vuole modificare con i kw richiesti
- **kw**(valore) è il nuovo tetto massimo che si vuole assegnare allo slot.
in questo caso viene impostato il tetto massimo dello slot che va dalle 23:00 alle 23:59 con un valore pari a 1500 kw

oppure

```
{
    "slot": "all",
    "kw": 1500
}
```
dove:
- **slot**(stringa) è l'unico valore ammesso e rappresenta tutti gli slot del produttore che effettua la chiamata.
in questo caso vengono impostati tutti i tetti massimi del produttore a 1500 kw

- ### (PATCH) .../costo
Rotta utilizzabile solamente dai producers; serve per modificare la il costo dei kw per un determinato slot o per tutti gli slot disponibili di un produttore.
La richiesta è quindi in grado di accettare due body diversi:
```
{
    "slot": 23,
    "costo": 50
}
```
dove:
- **costo**(valore) è il nuovo costo per kw che si vuole assegnare allo slot.
in questo caso viene impostato il costo per kw dello slot che va dalle 23:00 alle 23:59 a 50

oppure

```
{
    "slot": "all",
    "kw": 50
}
```
in questo caso vengono i costi per kw di tutti gli slot del produttore a 50

---

## Chiamate disponibili solamente per gli admin all'endpoint **"...:8080/api/admin"**

- ### (POST) .../ricarica
Rotta utilizzabile solamente dagli admin; serve per ricaricare il credito di un determinato utente.
La richiesta necessita di un body con i seguenti dati:
```
{
    "id": 1,
    "credito": 8700
}
```
dove:
- **id** (valore) è l'id del cliente verso il quale effettuare la ricarica del credito
- **credito** (valore) è il nuovo credito che si vuole assegnare al consumer (attenzione, assegnare e non sommare)
In questo caso questa chiamata assegnerà 8700 crediti al consumer con id 1

---

# Esecuzione del progetto
Per eseguire il software basta aprire un terminale nella directory del progetto ed eseguire il comando 
```
docker compose -f docker-compose.yml up
```

## Dockerfile e docker compose
Il docker file si occupa di creare un'immagine docker con Node.js, il codice del progetto e tutte le relative dipendenze necessarie al suo funzionamento, questa immagine serve per generare un container dentro il quale sarà eseguito il progetto, tuttavia essendo necessario un database postgres è necessario creare ed eseguire un altro container che contenga una immagine postgres al suo interno; successivamente è necessario far comunicare assieme i due container.
Tutto questo è automatizzabile e possibile tramite docker compose. Le istruzioni per il comando docker compose sono specificate all'interno del file **docker-compose.yml** presente nella root directory del progetto.
In sostanza il docker compose si occupa di:
- creare due container
    - uno contenente l'immagine relativa al Database Postgres: postgres
    - uno contenente l'immagine di node ed il progetto: progettopa
- configurare il database all'avvio tramite lo script di seeding **database_seeding.sql** (presente nella directory database)
- avviare il server dopo l'avvio del database
- esporre le porte necessarie alla comunicazione tra macchina host e containers


# Software ausiliari utilizzati
Per portare a termine il progetto sono stati utilizzati alcuni software ausiliari che ci sono tornati utili in fase di test e sviluppo.

### Visual Studio Code e GitHub:
<p align="left">
    <img src="./images/Visual_Studio_Code_1.35_icon.png?raw=true" width="10%" height="auto">
    <img src="./images/GitHub-Mark-Light-120px-plus.png?raw=true" width="10%" height="auto">
</p>

```
Per sviluppare l'intero progetto è stato utilizzato Visual Studio Code con l'ausilio di GitHub 
che ci ha permesso di gestire il progetto in maniera semplificata e sincronizzata tra di noi.
```

### Docker:  
<p align="left">
    <img src="./images/docker.png?raw=true" width="10%" height="auto">
</p>

```
L'intero progetto è stato sviluppato su Docker così da rendere il progetto separato dal resto 
del sistema e facilmente recuperabile ed immediatamente fruibile in caso errori e problemi che 
sono stati riscontrati.
```

### Postman:
<p align="left">
    <img src="./images/postman.png?raw=true" width="10%" height="auto">
</p>

```
Per testare le varie chiamate ai servizi è stato utilizzato Postman che ci ha permesso di 
testare il sistema in maniera semplificata.
```

### PgAdmin:
<p align="left">
    <img src="./images/pgadmin.png?raw=true" width="10%" height="auto">
</p>

```
Al fine di controllare e verificare il corretto funzionamento dell'intero progetto è stato 
utilizzato PgAdmin3 che ci ha permesso di svolgere tutte le operazioni sui database in maniera 
semplificata e di applicare molto rapidamente le modifiche ai dati per poter testare il software 
nelle diverse condizioni in cui può trovarsi.
```


