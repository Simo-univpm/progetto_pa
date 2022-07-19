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
  --codice_fiscale VARCHAR(50) NOT NULL,
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
  kw_rimanenti FLOAT NOT NULL,
  kw_massimo FLOAT NOT NULL,
  slot_selezionato INTEGER NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  data_acquisto_transazione DATETIME NOT NULL,
  data_prenotazione_transazione DATETIME NOT NULL,
);

INSERT INTO db_consumer(nome, email, passwd, credito, privilegi, data_registrazione)
VALUES
--// id_cons,   nome,       email,                    passwd,                                                         credito,  privilegi, data_registrazione
    ("Mario",    "mario@mario.it",         "$2a$10$/h5GEcb3h5nuvH//VSysQeTMrPZO4zKILgNPwoo7wSLy10DVYwWAq", 0,        2,       "2022-07-19 13:55:35.493+00"),
    ("Giuseppe", "giuseppe@giuseppe.it",   "$2a$10$zFG6F6YgXszSltBFHtA2A.rf8evjFd.Klfwaf6tb2qykE5QrvM4FO", 970,      2,       "2022-07-19 14:01:06.448+00"),
    ("Luca",     "luca@luca.it",           "$2a$10$4Pn.z1fwqH8bJv1xkJWpdu4hibnQ2i5Gk3d3SfKmuS6sYDwrHy19i", 550,      2,       "2022-07-19 14:01:30.732+00"),
    ("Paolo",    "paolo@paolo.it",         "$2a$10$nCjbdvHSZ8gdLtGtWsPEV.osK1630ZNEJ5lyUK8h4trYeBoWTHeEG", 700,      2,       "2022-07-19 14:02:11.606+00"),
    ("Giovanni", "giovanni@giovanni.it",   "$2a$10$HtNoLx4oYmwoGGgpcRSkbuvRiF7EnZUIsbmahG4HIOTp1YWpLxeb.", 860,      2,       "2022-07-19 14:02:28.738+00");
    

INSERT INTO db_producer (nome, email, passwd, fonte_produzione, emissioni_co2, privilegi, data_registrazione, accetta_taglio_richieste)
VALUES 
-- id_p, nome,              email,                  passwd,                                                           fonte_prod,     emis_co2, privilegi,   slot_0('costo slot', 'tetto_massimo', 'rimanente')                       slot_1('costo slot', 'tetto_massimo', 'rimanente')                       slot_2('costo slot', 'tetto_massimo', 'rimanente')                       slot_3('costo slot', 'tetto_massimo', 'rimanente')                       slot_4('costo slot', 'tetto_massimo', 'rimanente')                       slot_5('costo slot', 'tetto_massimo', 'rimanente')                       slot_6('costo slot', 'tetto_massimo', 'rimanente')           slot_7('costo slot', 'tetto_massimo', 'rimanente')                                   slot_8('costo slot', 'tetto_massimo', 'rimanente')           slot_9('costo slot', 'tetto_massimo', 'rimanente')           slot_10('costo slot', 'tetto_massimo', 'rimanente')          slot_11('costo slot', 'tetto_massimo', 'rimanente')          slot_12('costo slot', 'tetto_massimo', 'rimanente')          slot_13('costo slot', 'tetto_massimo', 'rimanente')          slot_14('costo slot', 'tetto_massimo', 'rimanente')          slot_15('costo slot', 'tetto_massimo', 'rimanente')          slot_16('costo slot', 'tetto_massimo', 'rimanente')          slot_17('costo slot', 'tetto_massimo', 'rimanente')          slot_18('costo slot', 'tetto_massimo', 'rimanente')          slot_19('costo slot', 'tetto_massimo', 'rimanente')           slot_20('costo slot', 'tetto_massimo', 'rimanente')          slot_21('costo slot', 'tetto_massimo', 'rimanente')          slot_22('costo slot', 'tetto_massimo', 'rimanente')          slot_23('costo slot', 'tetto_massimo', 'rimanente')          data_registrazione,          accetta_taglio_richieste)
    ("ENEL",             "enel@enel.it",         "$2a$10$ApJLcRo/IQ01l7mFNsEHyeW7EHvXM8FviC08W/sgP3G.AXHCM0cRq",   "fossile",      0.5,      1,           "{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""888.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""10.00"",""totale"":""1000.00"",""rimanente"":""1000.00""}","2022-07-19 13:52:14.9+00",True),
    ("EnergiaPulita",    "enpu@enpu.it",         "$2a$10$B0ABr8RBpNWFSRVnCKxohuLjB28L4K/4mqJ7Zp8FSWjYzmrGhMtkW",   "eolico",       0,        1,           "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}",  "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""979.00""}",  "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""830.00""}",  "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""2.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "2022-07-19 13:54:10.939+00",False),
    ("SolarEnergyPower", "solen@solen.it",       "$2a$10$BFUAHwI8Emz1a2eoKTTrfuIilRen5kbyOWFsOksCpbxp6xCGhZS82",   "fotovoltaico", 0,        1,           "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}",  "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}","{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "{""costo"":""3.50"",""totale"":""1000.00"",""rimanente"":""1000.00""}", "2022-07-19 13:54:57.947+00",False),
    ("EnergyLowCost",    "lowcost@lowcost.it",   "$2a$10$/Lj.Ldf5jA9Hg.qcGqR3kuxsXCzAtpoJpVwwTHCu3ogyHGJrTXjP2",   "fossile",      2,        1,           "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",  "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",    "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",  "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""130.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "{""costo"":""0.50"",""totale"":""800.00"",""rimanente"":""800.00""}",   "2022-07-19 14:59:14.37+00",True);
INSERT INTO db_admin(nome, email, passwd, privilegi, data_registrazione)
VALUES
--     nome,      email,       passwd,    priv,     data_registrazione
    ('admin_1', 'admin_1@admin_1.it', 'asd', 0, '2022-07-19 14:49:54.247+00');
INSERT INTO db_transazioni(id_consumer, id_producer, emissioni_co2_slot, costo_slot, kw_acquistati, slot_selezionato, fonte_produzione, data_acquisto_transazione, data_prenotazione_transazione)
VALUES
      --id_tran, id_prod,     id_cons,   em_co2,      $_slot,       kw_acq,       slot_n,   fonte,      data_acq,                      data_slot_pren
      (4,       1,       50,        1000,       100,        17,     "fossile",  "2022-07-19 14:44:55.282+00",  "2022-07-20 17:00:00+00"),
      (6,       1,       2.5,       50,         5,          17,     "fossile",  "2022-07-19 14:52:19.109+00",  "2022-07-20 17:00:00+00"),
      (5,       1,       1.5,       30,         3,          17,     "fossile",  "2022-07-19 14:52:33.211+00",  "2022-07-20 17:00:00+00"),
      (8,       1,       2,         40,         4,          17,     "fossile",  "2022-07-19 14:52:51.806+00",  "2022-07-20 17:00:00+00"),
      (6,       2,       0,         25,         10,         18,     "eolico",   "2022-07-19 14:54:21.8+00",    "2022-07-20 18:00:00+00"),
      (5,       2,       0,         27.5,       11,         18,     "eolico",   "2022-07-19 14:54:39.751+00",  "2022-07-20 18:00:00+00"),
      (5,       2,       0,         50,         20,         19,     "eolico",   "2022-07-19 14:56:16.612+00",  "2022-07-20 19:00:00+00"),
      (6,       2,       0,         75,         30,         19,     "eolico",   "2022-07-19 14:56:26.288+00",  "2022-07-20 19:00:00+00"),
      (8,       2,       0,         125,        50,         19,     "eolico",   "2022-07-19 14:56:43.964+00",  "2022-07-20 19:00:00+00"),
      (7,       2,       0,         175,        70,         19,     "eolico",   "2022-07-19 14:56:53.934+00",  "2022-07-20 19:00:00+00"),
      (6,       4,       549.49,    137.37,     274.74,     20,     "fossile",  "2022-07-19 14:59:43.281+00",  "2022-07-20 20:00:00+00"),
      (5,       4,       646.46,    161.61,     323.23,     20,     "fossile",  "2022-07-19 14:59:57.932+00",  "2022-07-20 20:00:00+00"),
      (8,       4,       969.69,    242.42,     484.84,     20,     "fossile",  "2022-07-19 15:00:07.633+00",  "2022-07-20 20:00:00+00"),
      (7,       4,       517.17,    129.29,     258.58,     20,     "fossile",  "2022-07-19 15:00:42.185+00",  "2022-07-20 20:00:00+00");