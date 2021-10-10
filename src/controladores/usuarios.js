const bcrypt = require('bcrypt');
const conexao = require('../conexao');
const { validarCamposDoCorpo } = require('../validacoes/validarUsuario');

const cadastrarUsuario = async (req, res) => {
  const checarErro = validarCamposDoCorpo(req.body);

  if (checarErro) {
    return res.status(404).json({ mensagem: checarErro });
  }

  const {
    nome, email, senha, nome_loja: nomeLoja
  } = req.body;

  try {
    const emailExiste = await conexao.query('select * from usuarios where email = $1', [email]);

    if (emailExiste.rowCount > 0) {
      return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
    }

    const senhaCadastrada = await bcrypt.hash(senha, 10);

    const queryInsert = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
    const { rowCount } = await conexao.query(queryInsert, [nome, nomeLoja, email, senhaCadastrada]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível cadastrar o usuario.' });
    }

    return res.status(201).send();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const detalharUsuario = async (req, res) => {
  const { usuario } = req;

  try {
    const buscarUsuario = await conexao.query('select * from usuarios where id = $1', [usuario.id]);

    if (buscarUsuario.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Usuário informado não foi encontrado.' });
    }

    const { senha, ...usuarioEncontrado } = buscarUsuario.rows[0];

    return res.status(200).json(usuarioEncontrado);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const atualizarUsuario = async (req, res) => {
  const checarErro = validarCamposDoCorpo(req.body);

  if (checarErro) {
    return res.status(404).json({ mensagem: checarErro });
  }

  const { usuario } = req;

  const {
    nome, email, senha, nome_loja: nomeLoja
  } = req.body;

  try {
    const { rowCount } = await conexao.query('select * from usuarios where id = $1', [usuario.id]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: 'Usuário não foi encontrado.' });
    }

    const verificarEmail = await conexao.query('select * from usuarios where email = $1', [email]);

    if (verificarEmail.rowCount > 0) {
      if (verificarEmail.rows[0].id !== usuario.id) {
        return res.status(404).json({ mensagem: 'O e-mail informado já esta sendo utilizado por outro usuário.' });
      }
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryUpdate = 'update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5';
    const { rowCount: usuarioAtualizado } = await conexao.query(
      queryUpdate, [nome, email, senhaCriptografada, nomeLoja, usuario.id]
    );

    if (usuarioAtualizado === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível atualizar o usuário.' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  atualizarUsuario
}
