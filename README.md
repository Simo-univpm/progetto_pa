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

# Progettazione
- librerie e perché
- struttura directory progetto
- pattern mvc, singleton, cor
- due diagrammi uml
- due diagrammi use case
- nuovo schema er
- due righe sull'autenticazione e sul token
- due descrizioni delle principali funzioni dei controller tipo reserve slot e taglio poi bo

## Librerie utilizzate
- bcryptjs, v2.4.3
- cors, v2.8.5
- dotenv, 16.0.1
- express, v4.16.1
- jsonwebtoken, v8.5.1
- nodemon, v2.0.19
- pg, v8.7.3
- pg-hstore, v2.3.4
- sequelize, v6.21.0
- sequelize-cli, v6.4.1

da completare

## Struttura della directory del progetto
```
.
└── progetto_pa
    ├── README.md
    ├── controllers
    │   ├── adminController.js
    │   ├── authController.js
    │   ├── consumerController.js
    │   ├── producerController.js
    │   └── slotController.js
    ├── database
    │   └── database_seeding.sql
    ├── docker-compose.yml
    ├── dockerfile
    ├── documenti
    │   ├── consegna progetto.docx
    │   ├── documentazione api.txt
    │   ├── requisiti funzionali.docx
    │   ├── schema del 23.png
    │   └── todo list.docx
    ├── images
    │   ├── GitHub-Mark-Light-120px-plus.png
    │   ├── Visual_Studio_Code_1.35_icon.png
    │   ├── docker.png
    │   ├── pgadmin.png
    │   └── postman.png
    ├── index.js
    ├── middlewares
    │   ├── checkAdmin.js
    │   ├── checkConsumer.js
    │   ├── checkCredit.js
    │   ├── checkLogin.js
    │   └── checkProducer.js
    ├── model
    │   ├── admin.js
    │   ├── consumer.js
    │   ├── database.js
    │   ├── producer.js
    │   └── transazioni.js
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── admin.js
    │   ├── auth.js
    │   ├── consumers.js
    │   ├── producers.js
    │   └── slot.js
    └── test.js
```

## Pattern utilizzati

- ### Model View Controller (MVC)
Come pattern architetturale è stato scelto di utilizzare l'MVC per separare la logica di presentazione dei dati dalla logica di business

# Test del progetto
Le api esposte dal progetto sono state testate mediante l'utilizzo di Postman (https://www.postman.com/); tutte le chiamate eccetto quelle rispondenti all'endpoint .../api/auth necessitano del token "auth-token" nell'header della richiesta. Il token contiene le informazioni base degli utenti **necessarie** al funzionamento del programma.
Il token si ottiene al login e va impostato manualmente in postman nell'apposito campo "headers": nella campo **"key"** va inserito **"auth-token"** e nel campo **"valore"** va inserita **la stringa ricevuta dal server al momento del login**.
Di seguito sono indicate tutte le chiamate HTTP disponibili, le relative descrizioni e degli esempi di body usati per testare il software:

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


- ### (GET) .../transactions/producers
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
- **kw**(valore) è il nuovo tetto massimo che si vuole assegnare allo slot
in questo caso viene impostato il tetto massimo dello slot che va dalle 23:00 alle 23:59 con un valore pari a 1500 kw

oppure

```
{
    "slot": "all",
    "kw": 1500
}
```
dove:
- **slot**(stringa) è l'unico valore ammesso e rappresenta tutti gli slot del produttore che effettua la chiamata
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
- **costo**(valore) è il nuovo costo per kw che si vuole assegnare allo slot
in questo caso viene impostato il costo per kw dello slot che va dalle 23:00 alle 23:59 a 50

oppure

```
{
    "slot": "all",
    "kw": 50
}
```
dove:
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

# Esecuzione del software tramite docker compose
Per eseguire il software basta aprire un terminale nella directory del progetto ed eseguire il comando **"docker compose -f docker-compose.yml up"**.

# Software ausiliari utilizzati

Per portare a termine il progetto sono stati utilizzati alcuni software ausiliari che ci sono tornati utili in fase di test e sviluppo.

#Visual Studio Code e GitHub:
<p align="left">
    <img src="./images/Visual_Studio_Code_1.35_icon.png?raw=true" width="10%" height="auto">
    <img src="./images/GitHub-Mark-Light-120px-plus.png?raw=true" width="10%" height="auto">
</p>

```
Per sviluppare l'intero progetto è stato utilizzato Visual Studio Code con l'ausilio di GitHub 
che ci ha permesso di gestire il progetto in maniera semplificata e sincronizzata tra di noi.
```

#Docker:  
<p align="left">
    <img src="./images/docker.png?raw=true" width="10%" height="auto">
</p>

```
L'intero progetto è stato sviluppato su Docker così da rendere il progetto separato dal resto 
del sistema e facilmente recuperabile ed immediatamente fruibile in caso errori e problemi che 
sono stati riscontrati.
```

#Posman:
<p align="left">
    <img src="./images/postman.png?raw=true" width="10%" height="auto">
</p>

```
Per testare le varie chiamate ai servizi è stato utilizzato Postman che ci ha permesso di 
testare il sistema in maniera semplificata.
```

#PgAdmin:
<p align="left">
    <img src="./images/pgadmin.png?raw=true" width="10%" height="auto">
</p>

```
Al fine di controllare e verificare il corretto funzionamento dell'intero progetto è stato 
utilizzato PgAdmin3 che ci ha permesso di svolgere tutte le operazioni sui database in maniera 
semplificata e di applicare molto rapidamente le modifiche ai dati per poter testare il software 
nelle diverse condizioni in cui può trovarsi.
```


