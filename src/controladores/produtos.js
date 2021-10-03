const conexao = require('../conexao');

function validarCamposDoCorpo({
  nome, quantidade, preco, descricao
}) {
  if (!nome) {
    return 'O nome do produto deve ser informado.';
  }

  if (!quantidade) {
    return 'A quantidade deve ser informado.';
  }

  if (!preco) {
    return 'O preço do produto deve ser informado.';
  }

  if (!descricao) {
    return 'A descricao do produto é obrigatório.';
  }

  return false;
}

const listarProdutosDeUsuario = async (req, res) => {
  const { usuario } = req;
  const { categoria } = req.query;

  try {
    const querySelect = categoria ? 'select * from produtos where usuario_id = $1 and categoria ilike $2'
      : 'select * from produtos where usuario_id = $1';
    const valor = categoria ? [usuario.id, categoria] : [usuario.id];

    const { rows: produtos } = await conexao.query(querySelect, valor);

    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const detalharProduto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  try {
    const { rowCount, rows } = await conexao.query('select * from produtos where id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}` });
    }

    const produto = rows[0];

    if (produto.usuario_id !== usuario.id) {
      return res.status(403).json({ mensagem: 'O usuário logado não tem permissão para acessar este produto.' });
    }

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const cadastrarProduto = async (req, res) => {
  const checarErro = validarCamposDoCorpo(req.body);

  if (checarErro) {
    return res.status(404).json({ mensagem: checarErro });
  }

  const {
    nome, quantidade, categoria, preco, descricao, imagem
  } = req.body;

  if (quantidade <= 0) {
    return res.status(404).json({ mensagem: 'A quantidade de produtos deve ser maior do que zero (0).' });
  }

  const { usuario } = req;

  try {
    const queryInsertProduto = `insert into 
      produtos (
          nome,
          quantidade,
          categoria,
          preco,
          descricao,
          imagem,
          usuario_id
        ) 
      values ($1, $2, $3, $4, $5, $6, $7)`;

    const { rowCount } = await conexao.query(queryInsertProduto,
      [nome, quantidade, categoria, preco, descricao, imagem, usuario.id]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível cadastrar produto.' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const atualizarProduto = async (req, res) => {
  const { id: idProduto } = req.params;

  const checarErro = validarCamposDoCorpo(req.body);

  if (checarErro) {
    return res.status(404).json({ mensagem: checarErro });
  }

  const {
    nome, quantidade, preco, descricao
  } = req.body;

  const { usuario } = req;
  let { categoria, imagem } = req.body;

  try {
    const buscarProduto = await conexao.query('select * from produtos where id = $1', [idProduto]);

    if (buscarProduto.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Produto informado não foi encontrado.' });
    }

    if (buscarProduto.rows[0].usuario_id !== usuario.id) {
      return res.status(403).json({ mensagem: 'O usuário autenticado não tem permissão para alterar este produto.' });
    }

    if (!categoria) {
      categoria = buscarProduto.rows[0].categoria;
    }

    if (!imagem) {
      imagem = buscarProduto.rows[0].imagem;
    }

    const queryUpdate = `update produtos 
      set
        nome = $1,
        quantidade = $2,
        preco = $3,
        descricao = $4,
        categoria = $5,
        imagem = $6
      where id = $7`;

    const { rowCount } = await conexao.query(queryUpdate,
      [
        nome, quantidade, preco, descricao, categoria, imagem, idProduto
      ]);

    if (rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível atualizar o produto.' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
}

const excluirProduto = async (req, res) => {
  const { id: idProduto } = req.params;
  const { usuario } = req;

  try {
    const { rowCount, rows } = await conexao.query('select * from produtos where id = $1', [idProduto]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: `Não existe produto para o id ${idProduto}.` });
    }

    const produtoBuscado = rows[0];

    if (produtoBuscado.usuario_id !== usuario.id) {
      return res.status(403).json({ mensagem: 'O usuário autenticado não tem permissão para excluir este produto.' });
    }

    const queryDelete = await conexao.query('delete from produtos where id = $1', [idProduto]);

    if (queryDelete.rowCount === 0) {
      return res.status(400).json({ mensagem: 'Não foi possível excluir o produto.' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ mensagemCatch: error.message });
  }
}

module.exports = {
  listarProdutosDeUsuario,
  detalharProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
}
