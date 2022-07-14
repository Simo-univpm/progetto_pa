# progetto programmazione avanzata aa 21/22

Membri gruppo:
- Francalancia Simone
- Silveri Nicola

Comandi utili docker:
- docker build -t nomeapplicazione .
- docker run --rm -it -p 8080:8080 nomeapplicazione

Descrizione progetto:

Si realizzi un sistema che consenta di gestire il processo di compravendita di energia “locale”. Esistono N produttori e M consumatori. Un produttore può mettere a disposizione di un acquirente in una fascia oraria di 1h un certo quantitativo di energia. Il processo di compravendita ha un orizzonte temporale di 1 giorno, ovvero si compra oggi uno o più “slot” per domani.
I produttori mettono possono mettere a disposizione degli slot temporali della durata di 1h con un valore pari a x kWh.  Ogni produttore ha una capacità massima di produzione oraria che non deve essere superata (questo valore è diverso per ogni produttore e per ogni fascia oraria).
Ogni produttore specifica anche la fonte con la quale genera energia e si identificano le seguenti possibilità: Fossile; Eolico; Fotovoltaico. Per ogni fascia oraria il produttore indica il quantitativo che può erogare che deve essere minore o uguale al quantitativo che può fornire.
Un compratore può acquistare energia da uno o più venditori per un giorno. Per una fascia oraria un compratore può comprare solo da un produttore. Un compratore non può comprare per una fascia oraria un quantitativo superiore a quello massimo erogabile da quel produttore.
I consumatori possono opzionare gli slot entro le 24h. (es. slot 7 Luglio 2022 ore 15:00 è prenotabile fino alle ore 14:59 del 6 Luglio 2022).
Se un produttore riceve per una fascia oraria più richieste, allora devono essere verificati i seguenti casi:
•	Se la somma delle richieste è inferiore o uguale alla capacità erogabile per quella fascia oraria allora non vi sono particolari azioni da svolgere.
•	Se la somma delle richieste è superiore o uguale alla capacità erogabile per quella fascia oraria allora il produttore potrà decidere se accettare le richieste effettuando un taglio lineare a quanto richiesto dai vari consumatori. Il taglio è proporzionale al quantitativo richiesto.
