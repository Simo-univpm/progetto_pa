# Progetto programmazione avanzata aa 21/22
## Sviluppo di un backend per la gestione della compravendita di energia

# Membri del gruppo
Francalancia Simone s1102917, Silveri Nicola s1101284

# Descrizione e obbioettivo del progetto
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

# Test del progetto
Le api esposte dal progetto sono state testate mediante l'utilizzo di Postman (https://www.postman.com/). Di seguito sono indicate tutte le chiamate HTTP disponibili, le relative descrizioni e degli esempi di body usati per testare il software:

### Chiamate disponibili per tutti gli utenti all'endpoint **...:8080/api/auth**

#### (POST) .../registerProducer
rotta comune a tutti gli utenti, serve per effettuare la registrazione di un nuovo producer.
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
-  **fonte_produzione** (stringa) rappresenta le 3 tipologie di fonte di produzione specificate dalla consegna, ovvero "Eolico", "Fossile", "Fotovoltaico";
-  **emissioni_co2** (valore) rappresenta i grammi di co2 prodotti per kw di energia
-  **costo** (valore) rappresenta il costo di ogni kw di energia
-  **tetto_max_kwh_init** (valore) rappresenta la soglia massima di produzione con la quale inizializzare **tutti** gli slot del produttore al momento della creazione (soglia alterabile tramite le chiamate apposite disponibili all'endpoint .../producers)
- **taglio** (boolean) rappresenta la possibilità per il produttore di applicare o meno un taglio lineare sia alle transazioni già effettuate sia ad una nuova transazione in ingresso nel caso in cui quest'ultima richieda un quantitativo superiore alla disponibilità.

#### (POST) .../registerConsumer
rotta comune a tutti gli utenti, serve per effettuare la registrazione di un nuovo consumer.
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

#### (POST) .../registerAdmin
rotta comune a tutti gli utenti, serve per effettuare la registrazione di un nuovo amministratore.
La richiesta necessita di un body con i seguenti dati:
```
{
    "nome": "nome admin",
    "email": "email_admin",
    "passwd": "password_admin"
}
```

#### (POST) .../login
rotta comune a tutti gli utenti, serve per effettuare il login per ottenere il Json Web Token (JWT) di autenticazione necessario per effettuare una qualsiasi altra chiamata ad eccezione di quelle disponibili sotto questo endpoint.
La richiesta necessita di un body con i seguenti dati:
```
{
    "privilegi": 2,
    "email": "utente@email.it",
    "passwd": "utentePassword"
}
```
dove il campo "privilegi" sono i privilegi dell'utente inseriti al momento della registrazione (0 se è admin, 1 se è producer, 2 se è consumer). Effettuare un login con i privilegi sbagliati e le credenziali corrette ritornerà un errore.

### Chiamate disponibili solamente per i producers all'endpoint ...:8080/api/producers

#### (GET) .../checkReservations

#### (GET) .../checkEarnings
#### (GET) .../checkStats
#### (PATCH) .../kw
#### (PATCH) .../costo

### Chiamate disponibili solamente per i consumers all'endpoint ...:8080/api/consumers

#### (GET) .../emissions
#### (GET) .../transactions/producers
#### (GET) .../transactions/periodo
#### (GET) .../transactions/fonte

### Chiamate disponibili solamente per i consumers all'endpoint ...:8080/api/slot

#### (POST)  .../
#### (PATCH) .../

## Chiamate disponibili solamente per gli admin all'endpoint ...:8080/api/admin

##(POST) .../ricarica




# Esecuzione del software tramite docker compose
Per eseguire il software basta aprire un terminale nella directory del progetto ed eseguire il comando **"docker compose -f docker-compose.yml up"**.

# Software ausiliari utilizzati

Per portare a termine il progetto sono stati utilizzati alcuni software ausiliari che ci sono tornati utili in fase di test e sviluppo.

#Visual Studio Code e GitHub:
![VSCode]([http://url/to/img.png](https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg))
![GitHub](http://url/to/img.png)
```
Per sviluppare l'intero progetto è stato utilizzato Visual Studio Code con l'ausilio di GitHub 
che ci ha permesso di gestire il progetto in maniera semplificata e sincronizzata tra di noi.
```

#Docker:  
![Docker](http://url/to/img.png)
```
L'intero progetto è stato sviluppato su Docker così da rendere il progetto separato dal resto 
del sistema e facilmente recuperabile ed immediatamente fruibile in caso errori e problemi che 
sono stati riscontrati.
```

#Posman:
![Posman](http://url/to/img.png)
```
Per testare le varie chiamate ai servizi è stato utilizzato Postman che ci ha permesso di 
testare il sistema in maniera semplificata.
```

#PgAdmin:
![PgAdmin](http://url/to/img.png)
```
Al fine di controllare e verificare il corretto funzionamento dell'intero progetto è stato 
utilizzato PgAdmin3 che ci ha permesso di svolgere tutte le operazioni sui database in maniera 
semplificata e di applicare molto rapidamente le modifiche ai dati per poter testare il software 
nelle diverse condizioni in cui può trovarsi.
```


