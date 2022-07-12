\c progettopa

DROP TABLE IF EXISTS consumers;
DROP TABLE IF EXISTS producers;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS storico_acquisti;
DROP TABLE IF EXISTS storico_vendite;


CREATE TABLE consumers (
  idConsumer SERIAL PRIMARY KEY,
  passwd VARCHAR(255) NOT NULL,
  mail VARCHAR(255),
  ruolo VARCHAR(50) NOT NULL,
  credito REAL NOT NULL,
   REAL NOT NULL
);

CREATE TABLE storico_acquisti (
  idProducer REAL NOT NULL,
  idConsumer REAL NOT NULL,
  idSlot REAL NOT NULL,
  data_acquisto TIMESTAMP NOT NULL,
  emissioni_co2 REAL NOT NULL
);

CREATE TABLE producers (
  idProducer SERIAL PRIMARY KEY,
  passwd VARCHAR(255) NOT NULL,
  mail VARCHAR(255),
  ruolo VARCHAR(50) NOT NULL,
  fonte VARCHAR(50) NOT NULL,
  costo_per_kwh REAL NOT NULL,
  emissioni_co2 REAL NOT NULL,
  credito REAL NOT NULL
);

CREATE TABLE storico_vendite (
  idProducer REAL NOT NULL,
  idConsumer REAL NOT NULL,
  idSlot REAL NOT NULL,
  data_vendita TIMESTAMP NOT NULL,
  fonte_produzione VARCHAR(50) NOT NULL,
  emissioni_co2 REAL NOT NULL
);

CREATE TABLE slots (
  idSlot SERIAL PRIMARY KEY,
  idProducer REAL NOT NULL,
  idConsumer REAL NOT NULL,
  tetto_massimo REAL NOT NULL,
  kwh REAL NOT NULL,
  costo REAL NOT NULL,
  credito REAL NOT NULL,
);


INSERT INTO consumers (passwd, mail, ruolo, credito, emissioni_co2)
VALUES 
    ('paolo95','$2a$12$zHLBzgjqH1xIDLI0Oasr6..4i0VYWlfWOLc1sIKl8tYPFXs1e.1s2', 'Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'admin', 'Viale Piane San Donato 33 - Corropoli (TE)', 7, CURRENT_TIMESTAMP),
    ('simone95','$2a$12$huCmEyw5m2thUh.2P6vEmeG/SPbGEN5TTOlEteDsbTkBbL0sLUvam', 'Onori', 'Simone', 'simoenonori@gmail.com', 'user', 'Via Napoli 2/A - Ascoli Piceno (AP)', 7, CURRENT_TIMESTAMP),
    ('faini98','$2a$12$Y8DXqFtpNeTzlBnm8cHZqupe1eG/EBOAySqkGs1REDhedtQmGjmKa', 'Faini', 'Aurora', 'aurorafaini@gmail.com', 'user', 'Via Giuseppe Mazzini 22 - Monteprandone (AP)', 7, CURRENT_TIMESTAMP),
    ('schiavi92','$2a$12$rccf3ddKBAtF00Uzz38xA.8q5yJ/swYqHWS9jT3Ze1U0gfhYemCS.', 'Schiavi', 'Elise', 'eliseschiavi@gmail.com', 'admin', 'Via dell Olmo 7 - San Benedetto del Tronto (AP)', 7, CURRENT_TIMESTAMP);

INSERT INTO producers (passwd, mail, ruolo, fonte, costo_per_kwh, emissioni_co2, credito)
VALUES 
    ('paolo95','$2a$12$zHLBzgjqH1xIDLI0Oasr6..4i0VYWlfWOLc1sIKl8tYPFXs1e.1s2', 'Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'admin', 'Viale Piane San Donato 33 - Corropoli (TE)', 7, CURRENT_TIMESTAMP),
    ('simone95','$2a$12$huCmEyw5m2thUh.2P6vEmeG/SPbGEN5TTOlEteDsbTkBbL0sLUvam', 'Onori', 'Simone', 'simoenonori@gmail.com', 'user', 'Via Napoli 2/A - Ascoli Piceno (AP)', 7, CURRENT_TIMESTAMP),
    ('faini98','$2a$12$Y8DXqFtpNeTzlBnm8cHZqupe1eG/EBOAySqkGs1REDhedtQmGjmKa', 'Faini', 'Aurora', 'aurorafaini@gmail.com', 'user', 'Via Giuseppe Mazzini 22 - Monteprandone (AP)', 7, CURRENT_TIMESTAMP),
    ('schiavi92','$2a$12$rccf3ddKBAtF00Uzz38xA.8q5yJ/swYqHWS9jT3Ze1U0gfhYemCS.', 'Schiavi', 'Elise', 'eliseschiavi@gmail.com', 'admin', 'Via dell Olmo 7 - San Benedetto del Tronto (AP)', 7, CURRENT_TIMESTAMP);

INSERT INTO slots (idSlot, idProducer, idConsumer, tetto_massimo, kwh, costo, credito)
VALUES 
    ('paolo95','$2a$12$zHLBzgjqH1xIDLI0Oasr6..4i0VYWlfWOLc1sIKl8tYPFXs1e.1s2', 'Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'admin', 'Viale Piane San Donato 33 - Corropoli (TE)', 7, CURRENT_TIMESTAMP),
    ('simone95','$2a$12$huCmEyw5m2thUh.2P6vEmeG/SPbGEN5TTOlEteDsbTkBbL0sLUvam', 'Onori', 'Simone', 'simoenonori@gmail.com', 'user', 'Via Napoli 2/A - Ascoli Piceno (AP)', 7, CURRENT_TIMESTAMP),
    ('faini98','$2a$12$Y8DXqFtpNeTzlBnm8cHZqupe1eG/EBOAySqkGs1REDhedtQmGjmKa', 'Faini', 'Aurora', 'aurorafaini@gmail.com', 'user', 'Via Giuseppe Mazzini 22 - Monteprandone (AP)', 7, CURRENT_TIMESTAMP),
    ('schiavi92','$2a$12$rccf3ddKBAtF00Uzz38xA.8q5yJ/swYqHWS9jT3Ze1U0gfhYemCS.', 'Schiavi', 'Elise', 'eliseschiavi@gmail.com', 'admin', 'Via dell Olmo 7 - San Benedetto del Tronto (AP)', 7, CURRENT_TIMESTAMP);