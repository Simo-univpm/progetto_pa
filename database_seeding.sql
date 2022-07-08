\c progettopa

DROP TABLE IF EXISTS prodotto;

CREATE TABLE prodotto (
  id_prodotto SERIAL PRIMARY KEY,
  nome_prodotto VARCHAR(100) NOT NULL,
  tipologia VARCHAR(255) NOT NULL,
  anno INT NOT NULL,
  prezzo INT NOT NULL,  
  disponibile BOOLEAN NOT NULL,
  link VARCHAR(255)
);

DROP TABLE IF EXISTS utente;

CREATE TABLE utente (
  id_utente SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  passwd VARCHAR(255) NOT NULL,
  cognome VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  mail VARCHAR(255),
  ruolo VARCHAR(50) NOT NULL,
  indirizzo VARCHAR(100),
  credito REAL NOT NULL
);

DROP TABLE IF EXISTS acquisto;

CREATE TABLE acquisto (
  id_acquisto SERIAL PRIMARY KEY,
  utente INT NOT NULL,
  CONSTRAINT utente_fk
    FOREIGN KEY(utente)
      REFERENCES utente(id_utente),
  prodotto INT NOT NULL,
  CONSTRAINT prodotto_fk
      FOREIGN KEY(prodotto)
        REFERENCES prodotto(id_prodotto),
  data_acquisto DATE NOT NULL,
  originale BOOLEAN NOT NULL,
  mail_amico VARCHAR(255),
  download_amico BOOLEAN
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