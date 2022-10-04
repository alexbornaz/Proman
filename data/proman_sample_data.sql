--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS archive;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    board_id integer                NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    owner       text                NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

CREATE TABLE users (
    id          SERIAL PRIMARY KEY  NOT NULL,
    email       VARCHAR (200)       NOT NULL,
    username    VARCHAR (200)       NOT NULL,
    password    text                NOT NULL
);

CREATE TABLE archive (
    id          INTEGER PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

---
--- insert data
---

INSERT INTO statuses(title,board_id) VALUES ('new',1);
INSERT INTO statuses(title,board_id) VALUES ('new',2);
INSERT INTO statuses(title,board_id) VALUES ('in progress',1);
INSERT INTO statuses(title,board_id) VALUES ('in progress',2);
INSERT INTO statuses(title,board_id) VALUES ('testing',1);
INSERT INTO statuses(title,board_id) VALUES ('testing',2);
INSERT INTO statuses(title,board_id) VALUES ('done',1);
INSERT INTO statuses(title,board_id) VALUES ('done',2);


INSERT INTO boards(title,owner) VALUES ('Board 1','public');
INSERT INTO boards(title,owner) VALUES ('Board 2', 'public');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 5, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 7, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 7, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 2);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

