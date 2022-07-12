\c progettopa

DROP TABLE IF EXISTS consumer;
DROP TABLE IF EXISTS producer;
DROP TABLE IF EXISTS slot;
DROP TABLE IF EXISTS storico_slot;
DROP TABLE IF EXISTS storico_acquisti;
DROP TABLE IF EXISTS storico_vendite;


CREATE TABLE consumer (
  idConsumer SERIAL PRIMARY KEY,
  passwd VARCHAR(255) NOT NULL,
  mail VARCHAR(255),
  ruolo VARCHAR(50) NOT NULL,
  credito REAL NOT NULL
);

CREATE TABLE storico_acquisti (
  idProducer REAL NOT NULL,
  idConsumer REAL NOT NULL,
  idSlot REAL NOT NULL,
  data_acquisto TIMESTAMP NOT NULL,
  emissioni_co2 REAL NOT NULL
);

CREATE TABLE producer (
  idProducer SERIAL PRIMARY KEY,
  passwd VARCHAR(255) NOT NULL,
  mail VARCHAR(255) NOT NULL,
  ruolo VARCHAR(50) NOT NULL,
  fonte VARCHAR(50) NOT NULL,
  costo_per_kwh REAL NOT NULL,
  emissioni_co2 REAL NOT NULL
);

CREATE TABLE storico_vendite (
  idProducer REAL NOT NULL,
  idConsumer REAL NOT NULL,
  idSlot REAL NOT NULL,
  data_vendita TIMESTAMP NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  emissioni_co2 REAL NOT NULL
);

CREATE TABLE storico_slot (
  idSlot SERIAL PRIMARY KEY,
  idConsumer REAL NOT NULL,
  data_acquisto TIMESTAMP NOT NULL,
  kwh_richiesti_consumer REAL NOT NULL,
  emissioni_co2 REAL NOT NULL
);

CREATE TABLE slot (
  idSlot SERIAL PRIMARY KEY,
  idProducer REAL NOT NULL,
  --idConsumer REAL NOT NULL,
  tetto_massimo REAL NOT NULL,
  kwh REAL NOT NULL,
  costo REAL NOT NULL,
  credito REAL NOT NULL,
);


INSERT INTO consumer (passwd, mail, ruolo, credito, emissioni_co2)
VALUES 
    ('passwd', 'consumer@mail.it', 'consumer', 10, 0);


INSERT INTO producer (passwd, mail, ruolo, fonte)
VALUES 
    ('passwd', 'producer@mail.it', 'producer', 'eolico');


--INSERT INTO slot (sto, credito)
--VALUES 
    --();