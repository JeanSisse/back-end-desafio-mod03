const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conexao = require('../conexao');
const segredo = require('../segredo');

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const buscarEmail = 'select * from usuarios where email = $1';
    const { rowCount, rows } = await conexao.query(buscarEmail, [email]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: 'Usuáio não encontrado.' });
    }

    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    }

    const token = jwt.sign({ id: usuario.id }, segredo, {
      expiresIn: '12h'
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  login
}
