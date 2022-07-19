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
  slot_selezionato INTEGER NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  data_acquisto_transazione DATETIME NOT NULL,
  data_prenotazione_transazione DATETIME NOT NULL,
);


INSERT INTO db_consumer(nome, email, passwd, credito, privilegi, data_registrazione)
VALUES
--// id_cons, nome,       cognome,  email,                    passwd,     credito,  privilegi,    data_registrazione
    ('1',     'Mario',    'cogn',   'mario@mario.it',         'mario',    500,      2,            '2022-07-19 00:57:39.964+02');
    ('2',     'Giuseppe', 'cogn',   'giuseppe@giuseppe.it',   'giuseppe', 1000,     2,            '2022-07-19 00:57:39.964+02');
    ('3',     'Luca',     'cogn',   'luca@luca.it',           'luca',     600,      2,            '2022-07-19 00:57:39.964+02');
    ('4',     'Paolo',    'cogn',   'paolo@paolo.it',         'paolo',    700,      2,            '2022-07-19 00:57:39.964+02');
    ('5',     'Giovanni', 'cogn',   'giovanni@giovanni.it',   'giovanni', 900,      2,            '2022-07-19 00:57:39.964+02');
    

INSERT INTO db_producer (nome, codice_fiscale, email, passwd, fonte_produzione, emissioni_co2, privilegi, data_registrazione, accetta_taglio_richieste)
VALUES 
--// id_p, nome,              email,            passwd,             fonte_prod,     emis_co2, slot_0('costo slot', 'tetto_massimo', 'rimanente')           slot_1('costo slot', 'tetto_massimo', 'rimanente')           slot_2('costo slot', 'tetto_massimo', 'rimanente')            slot_3('costo slot', 'tetto_massimo', 'rimanente')          slot_4('costo slot', 'tetto_massimo', 'rimanente')            slot_5('costo slot', 'tetto_massimo', 'rimanente')          slot_6('costo slot', 'tetto_massimo', 'rimanente')           slot_7('costo slot', 'tetto_massimo', 'rimanente')           slot_8('costo slot', 'tetto_massimo', 'rimanente')           slot_9('costo slot', 'tetto_massimo', 'rimanente')           slot_10('costo slot', 'tetto_massimo', 'rimanente')          slot_11('costo slot', 'tetto_massimo', 'rimanente')          slot_12('costo slot', 'tetto_massimo', 'rimanente')          slot_13('costo slot', 'tetto_massimo', 'rimanente')          slot_14('costo slot', 'tetto_massimo', 'rimanente')          slot_15('costo slot', 'tetto_massimo', 'rimanente')          slot_16('costo slot', 'tetto_massimo', 'rimanente')          slot_17('costo slot', 'tetto_massimo', 'rimanente')          slot_18('costo slot', 'tetto_massimo', 'rimanente')          slot_19('costo slot', 'tetto_massimo', 'rimanente')           slot_20('costo slot', 'tetto_massimo', 'rimanente')          slot_21('costo slot', 'tetto_massimo', 'rimanente')          slot_22('costo slot', 'tetto_massimo', 'rimanente')          slot_23('costo slot', 'tetto_massimo', 'rimanente')          data_registrazione,          accetta_taglio_richieste)
    ('1',  'ENEL',            'enel@enel.it',   'enel',             'fossile',      0.5,      "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", '2022-07-19 00:57:39.964+02', true);
    ('2',  'EnergiaPulita',   'enpu@enpu.it',   'energiapulita',    'eolico',       0,        "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", '2022-07-19 00:57:39.964+02', false);
    ('3',  'SolarEnergyPower','solen@solen.it', 'solarenergypower', 'fotovoltaico', 0,        "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", "{"costo":"1.00","totale":"1000.00","rimanente":"1000.00"}", '2022-07-19 00:57:39.964+02', false);


    

INSERT INTO db_admin(nome, email, passwd, privilegi, data_registrazione)
VALUES
--  id_a, nome,      email,                passwd,    priv, data_registrazione
    ('1', 'admin_1', 'admin_1@admin_1.it', 'admin_1', 0,    '2022-07-19 00:57:39.964+02');


INSERT INTO db_transazioni(id_consumer, id_producer, emissioni_co2_slot, costo_slot, kw_acquistati, slot_selezionato, fonte_produzione, data_acquisto_transazione, data_prenotazione_transazione)
VALUES
  --id_tran, id_prod, id_cons, em_co2, $_slot, kw_acq, slot_n, fonte,          data_acq,                      data_slot_pren
    ('1',    '1',     '1',     '0.5',  '200',  '100',  '10',   'fossile',      '2022-07-19 00:57:39.964+02',  '2022-07-19 10:00:00.964+02');
    ('2',    '2',     '3',     '0',    '300',  '500',  '15',   'eolico',       '2022-07-19 00:57:39.964+02',  '2022-07-19 00:57:39.964+02');
    ('3',    '3',     '0.5',   '0.5',  '0.5',  '1',    '11',   'fotovoltaico', '2022-07-19 00:57:39.964+02',  '2022-07-19 00:57:39.964+02');
    ('4',    '1',     '0.5',   '0.5',  '0.5',  '1',    '11',   'fossile',      '2022-07-19 00:57:39.964+02',  '2022-07-19 00:57:39.964+02');
    ('5',    '2',     '0.5',   '0.5',  '0.5',  '1',    '20',   'eolico',       '2022-07-19 00:57:39.964+02',  '2022-07-19 00:57:39.964+02');
    ('6',    '3',     '0.5',   '0.5',  '0.5',  '1',    '18',   'fotovoltaico', '2022-07-19 00:57:39.964+02',  '2022-07-19 00:57:39.964+02');
    ('7',    '1',     '0.5',   '0.5',  '0.5',  '1',    '15',   'fossile',      '2022-07-19 00:57:39.964+02',  '2022-07-19 00:57:39.964+02');
