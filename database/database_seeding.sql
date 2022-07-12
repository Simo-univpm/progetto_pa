-- mettere quello aggiornato di nicola

\c progettopa

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


INSERT INTO utente (username, passwd, cognome, nome, mail, ruolo, indirizzo, credito)
VALUES 
    ('paolo95','$2a$12$zHLBzgjqH1xIDLI0Oasr6..4i0VYWlfWOLc1sIKl8tYPFXs1e.1s2', 'Compagnoni', 'Paolo', 'compagnonipaolo95@gmail.com', 'admin', 'Viale Piane San Donato 33 - Corropoli (TE)', 7),
    ('simone95','$2a$12$huCmEyw5m2thUh.2P6vEmeG/SPbGEN5TTOlEteDsbTkBbL0sLUvam', 'Onori', 'Simone', 'simoenonori@gmail.com', 'user', 'Via Napoli 2/A - Ascoli Piceno (AP)', 7),
    ('faini98','$2a$12$Y8DXqFtpNeTzlBnm8cHZqupe1eG/EBOAySqkGs1REDhedtQmGjmKa', 'Faini', 'Aurora', 'aurorafaini@gmail.com', 'user', 'Via Giuseppe Mazzini 22 - Monteprandone (AP)', 7),
    ('schiavi92','$2a$12$rccf3ddKBAtF00Uzz38xA.8q5yJ/swYqHWS9jT3Ze1U0gfhYemCS.', 'Schiavi', 'Elise', 'eliseschiavi@gmail.com', 'admin', 'Via dell Olmo 7 - San Benedetto del Tronto (AP)', 7);