\c progettopa

DROP TABLE IF EXISTS db_consumer;
DROP TABLE IF EXISTS db_producer;
DROP TABLE IF EXISTS db_admin;
DROP TABLE IF EXISTS db_transazioni;
DROP TABLE IF EXISTS db_storico_produzione;

--DB consumer utilizzato per la registrazione dell'utente consumer
CREATE TABLE db_consumer(
  id_consumer SERIAL PRIMARY KEY NOT NULL,
  nome VARCHAR(50) NOT NULL,
  --cognome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  passwd VARCHAR(50) NOT NULL,
  credito INTEGER NOT NULL,
  privilegi INTEGER NOT NULL,
  data_registrazione VARCHAR(50)
);

--DB producer utilizzato per la registrazione dei producer
-- RIMETTERE GLI SLOT CON ALLOWNULL A FALSE
CREATE TABLE db_producer(
  id_producer SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  codice_fiscale VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  passwd VARCHAR(50) NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  costo_per_kwh INTEGER NOT NULL,
  emissioni_co2 INTEGER NOT NULL,
  privilegi INTEGER NOT NULL,
  slot_0  VARCHAR(50),
  slot_1  VARCHAR(50),
  slot_2  VARCHAR(50),
  slot_3  VARCHAR(50),
  slot_4  VARCHAR(50),
  slot_5  VARCHAR(50),
  slot_6  VARCHAR(50),
  slot_7  VARCHAR(50),
  slot_8  VARCHAR(50),
  slot_9  VARCHAR(50),
  slot_10 VARCHAR(50),
  slot_11 VARCHAR(50),
  slot_12 VARCHAR(50),
  slot_13 VARCHAR(50),
  slot_14 VARCHAR(50),
  slot_15 VARCHAR(50),
  slot_16 VARCHAR(50),
  slot_17 VARCHAR(50),
  slot_18 VARCHAR(50),
  slot_19 VARCHAR(50),
  slot_20 VARCHAR(50),
  slot_21 VARCHAR(50),
  slot_22 VARCHAR(50),
  slot_23 VARCHAR(50),
  data_registrazione VARCHAR(50) NOT NULL
);

--DB utilizzato per la registrazione degli admin
CREATE TABLE db_admin(
  id_admin SERIAL PRIMARY KEY NOT NULL,
  nome VARCHAR(50) NOT NULL,
  --cognome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  passwd VARCHAR(50) NOT NULL,
  privilegi INTEGER NOT NULL,
  data_registrazione VARCHAR(50) NOT NULL
);

--DB utilizzato per le transazioni richiamabile sia dal consumer che dal producer
CREATE TABLE db_transazioni(
  id_transazione SERIAL PRIMARY KEY NOT NULL,
  id_consumer INTEGER NOT NULL,
  id_producer INTEGER NOT NULL,
  emissioni_co2_slot INTEGER NOT NULL,
  costo_slot INTEGER NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  data_transazione VARCHAR(50) NOT NULL,
  costo INTEGER NOT NULL
);