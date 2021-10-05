const jwt = require('jsonwebtoken');
const segredo = require('../segredo');
const conexao = require('../conexao');

const verificarAutenticacao = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({ mensagem: 'Token não foi envidado no header da requisição.' });
  }

  try {
    const token = authorization.replace('Bearer', '').trim();

    const { id } = jwt.verify(token, segredo);

    const querySelect = 'select * from usuarios where id = $1';
    const { rowCount, rows } = await conexao.query(querySelect, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: 'Usuário não foi encontrado.' });
    }

    // eslint-disable-next-line no-unused-vars
    const { senha, ...usuario } = rows[0];
    req.usuario = usuario;

    return next();
  } catch (error) {
    return res.status(403).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
  }
}

module.exports = verificarAutenticacao;
