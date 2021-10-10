function validarCamposDoCorpo({
  nome, email, senha, nome_loja: nomeLoja
}) {
  if (!nome) {
    return 'O campo nome é obrigatório.';
  }

  if (!email) {
    return 'O campo email é obrigatório.';
  }

  if (!senha) {
    return 'O campo senha é obrigatório.';
  }

  if (!nomeLoja) {
    return 'O campo nome_loja é obrigatório.';
  }

  return false;
}

module.exports = {
  validarCamposDoCorpo
}
