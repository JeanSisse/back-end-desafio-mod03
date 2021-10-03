DROP DATABASE IF EXISTS "market_cubos";

CREATE DATABASE "market_cubos";

DROP TABLE IF EXISTS "usuarios";

CREATE TABLE "usuarios" (
  id serial primary key,
  nome text not null,
  nome_loja text not null,
  email text not null unique,
  senha text not null
);

DROP TABLE IF EXISTS "produtos";

CREATE TABLE "produtos"(
  id serial primary key,
  usuario_id int not null references usuarios(id),
  nome varchar(100) not null,
  quantidade int not null,
  categoria varchar (50),
  preco int not null,
  descricao text not null,
  imagem text
);


