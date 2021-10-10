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

module.exports = {
  validarCamposDoCorpo
}
