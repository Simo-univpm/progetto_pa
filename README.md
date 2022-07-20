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

# Test
Le api esposte dal progetto sono state testate mediante l'utilizzo di Postman (https://www.postman.com/). Di seguito sono indicate tutte le chiamate HTTP disponibili e le relative descrizioni:

### Chiamate disponibili per tutti gli utenti all'endpoint ...:8080/api/auth

#### (POST) .../login
#### (POST) .../registerConsumer
#### (POST) .../registerProducer
#### (POST) .../registerAdmin

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

