\c progettopa

DROP TABLE IF EXISTS db_consumer;
DROP TABLE IF EXISTS db_producer;
DROP TABLE IF EXISTS db_admin;
DROP TABLE IF EXISTS db_transazioni;

--DB consumer utilizzato per la registrazione dell'utente consumer
CREATE TABLE db_consumer(
  id_consumer SERIAL PRIMARY KEY NOT NULL,
  nome VARCHAR(50) NOT NULL,
  --cognome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  passwd VARCHAR(50) NOT NULL,
  credito FLOAT NOT NULL,
  privilegi INTEGER NOT NULL,
  data_registrazione DATETIME NOT NULL
);

--DB producer utilizzato per la registrazione dei producer
-- RIMETTERE GLI SLOT CON ALLOWNULL A FALSE
CREATE TABLE db_producer(
  id_producer INTEGER NOT NULL,
  nome VARCHAR(50) NOT NULL,
  codice_fiscale VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  passwd VARCHAR(50) NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  --costo_per_kwh INTEGER NOT NULL,
  emissioni_co2 FLOAT NOT NULL,
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
  data_registrazione DATETIME NOT NULL,
  accetta_taglio_richieste BOOLEAN NOT NULL
);

--DB utilizzato per la registrazione degli admin
CREATE TABLE db_admin(
  id_admin SERIAL PRIMARY KEY NOT NULL,
  nome VARCHAR(50) NOT NULL,
  --cognome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  passwd VARCHAR(50) NOT NULL,
  privilegi INTEGER NOT NULL,
  data_registrazione DATETIME NOT NULL
);

--DB utilizzato per le transazioni richiamabile sia dal consumer che dal producer
CREATE TABLE db_transazioni(
  id_transazione SERIAL PRIMARY KEY NOT NULL,
  id_consumer INTEGER NOT NULL,
  id_producer INTEGER NOT NULL,
  emissioni_co2_slot FLOAT NOT NULL,
  costo_slot FLOAT NOT NULL,
  kw_acquistati FLOAT NOT NULL,
  slot_selezionato INTEGER NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  data_acquisto_transazione DATETIME NOT NULL,
  data_prenotazione_transazione DATETIME NOT NULL,
);


INSERT INTO prodotto (nome_prodotto, tipologia, anno, prezzo, disponibile, link)
VALUES 
    ('U2 - One', 'Audio', 1992, 2, false, null),
    ('U2 - One (Official Music Video)', 'Video', 1992, 3, false, null),
    ('Mahmood, BLANCO - Brividi', 'Audio', 2022, 2, true, './files/Mahmood, BLANCO - Brividi.mp3'),
    ('Pinguini Tattici Nucleari - Irene', 'Audio', 2018, 2, true, './files/Pinguini Tattici Nucleari - Irene.mp3'),
    ('Radiohead - Creep (Official Music Video)', 'Video', 1992, 3, true, './files/Radiohead - Creep (Official Music Video).mp4');

INSERT INTO utente (username, passwd, cognome, nome, mail, ruolo, indirizzo, credito)
VALUES 
    ('paolo95','$2a$12$zHLBzgjqH1xIDLI0Oasr6..4i0VYWlfWOLc1sIKl8tYPFXs1e.1s2', 'Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'admin', 'Viale Piane San Donato 33 - Corropoli (TE)', 7),
    ('simone95','$2a$12$huCmEyw5m2thUh.2P6vEmeG/SPbGEN5TTOlEteDsbTkBbL0sLUvam', 'Onori', 'Simone', 'simoenonori@gmail.com', 'user', 'Via Napoli 2/A - Ascoli Piceno (AP)', 7),
    ('faini98','$2a$12$Y8DXqFtpNeTzlBnm8cHZqupe1eG/EBOAySqkGs1REDhedtQmGjmKa', 'Faini', 'Aurora', 'aurorafaini@gmail.com', 'user', 'Via Giuseppe Mazzini 22 - Monteprandone (AP)', 7),
    ('schiavi92','$2a$12$rccf3ddKBAtF00Uzz38xA.8q5yJ/swYqHWS9jT3Ze1U0gfhYemCS.', 'Schiavi', 'Elise', 'eliseschiavi@gmail.com', 'admin', 'Via dell Olmo 7 - San Benedetto del Tronto (AP)', 7);

INSERT INTO acquisto (utente, prodotto, data_acquisto, originale, mail_amico, download_amico)
VALUES 
    (1, 2, '2022-03-02', true, null, null),
    (1, 2, '2002-03-02', false, null, null),
    (1, 3, '2022-07-21', false, null, null),
    (2, 2, '2022-11-20', false, null, null),
    (1, 3, '2022-01-21', true, 'prova@prova.com', false),
    (2, 2, '2022-04-20', true, 'tizio@tizio.com', true),
    (2, 3, '2022-07-12', true, null, null),
    (3, 3, '2021-08-06', true, null, null);