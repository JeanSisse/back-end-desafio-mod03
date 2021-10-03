const express = require('express');
const usuario = require('./controladores/usuarios');
const login = require('./controladores/login');
const verificarLogin = require('./middleware/verificarLogin');
const produtos = require('./controladores/produtos');

const rotas = express();

// cadastrar usuario
rotas.post('/usuario', usuario.cadastrarUsuario);

// login
rotas.post('/login', login.login);

// verificar autenticação
rotas.use(verificarLogin);

// usuário
rotas.get('/usuario', usuario.detalharUsuario);
rotas.put('/usuario', usuario.atualizarUsuario);

// produtos
rotas.get('/produtos', produtos.listarProdutosDeUsuario);
rotas.get('/produtos/:id', produtos.detalharProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;
