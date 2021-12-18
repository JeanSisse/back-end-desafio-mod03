![](https://i.imgur.com/xG74tOh.png)

# Desafio Módulo 3 - Back-end

Objetivo deste desafio é construir uma RESTful API que permita:

- Fazer Login
- Cadastrar Usuário
- Detalhar Usuário
- Editar Usuário
- Listar produtos
- Detalhar produtos
- Cadastrar produtos
- Editar produtos
- Remover produtos
- **EXTRA:** Filtrar produtos por categoria

**Cada usuário só pode ver e manipular seus próprios dados e seus próprios produtos. Não atender a este pré-requisito é uma falha de segurança gravíssima!**

**Sempre que a validação de uma requisição falhar, o usuário receberá uma responda com código de erro e mensagem adequada à situação.**

**Exemplo:**

```javascript
// Quando é informado um id de usuário que não existe:
// HTTP Status 404
{
  mensagem: "Usuário não encontrado!";
}
```

## **Banco de dados**

Foi criado um Banco de Dados PostgreSQL chamado `market_cubos` para este desafio contendo as seguintes tabelas e colunas:  
**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

- usuarios
  - id
  - nome
  - nome_loja (o nome da loja deste vendedor)
  - email (campo único)
  - senha
- produtos
  - id
  - usuario_id
  - nome
  - quantidade
  - categoria
  - preco
  - descricao
  - imagem (campo texto para URL da imagem na web)

**Na raiz deste projeto foi criado um arquivo SQL que é o script que cria as tabelas corretamente.**

## **Requisitos obrigatórios**

- A API a ser criada deverá acessar o banco de dados a ser criado "market_cubos" para persistir e manipular os dados de usuários e produtos utilizados pela aplicação.
- O campo `id` das tabelas no banco de dados deve ser auto incremento, chave primária e não deve permitir edição uma vez criado.
- Este projeto foi organizado, delimitando as responsabilidades de cada arquivo adequadamente. Ou seja, ele conta com organização mínima como segue:
  - Um arquivo index.js
  - Um arquivo servidor.js
  - Um arquivo conexao.js
  - Um arquivo de rotas
  - Um pasta com controladores  
    
- Qualquer valor monetário deverá ser representado em centavos (Ex.: R$ 10,00 reais = 1000)

## **Status Codes**

Abaixo, listamos os possíveis **_status codes_** esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
```

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha
  - nome_loja

- **Resposta**  
  Em caso de **sucesso**, nenhum conteúdo é enviado no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** contendo  como valor um texto explicando o motivo da falha.

- **REQUISITOS OBRIGATÓRIOS**
  - Validar os campos obrigatórios:
    - nome
    - email
    - senha
    - nome_loja
  - Validar se o e-mail informado já existe
  - Criptografar a senha antes de persistir no banco de dados
  - Cadastrar o usuário no banco de dados

#### **Exemplo de requisição**

```json
// POST /usuario
{
  "nome": "José",
  "email": "jose@lojadasflores.com.br",
  "senha": "j1234",
  "nome_loja": "Loja das Flores"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta retorna com um objeto com apenas uma propriedade **token** que possui como valor o token de autenticação gerado.  
  Em caso de **falha na validação**, a resposta retorna um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** contendo como valor um texto explicando o motivo da falha.

- **FUNCIONALIDADES**

  - Validação dos campos:
    - email
    - senha
  - Verifica se o e-mail existe
  - Valida e-mail e senha
  - Cria token de autenticação com id do usuário

#### **Exemplo de requisição**

```json
// POST /login
{
  "email": "jose@lojadasflores.com.br",
  "senha": "j1234"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, exigem o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, para cada funcionalidade a partir deste é realizado a validação do token informado.

---

### **Validações do token**

- **FUNCIONALIDADES**
  - Verifica se o token foi enviado no header da requisição (Bearer Token)
  - Verifica se o token é válido
  - Consulta o usuário no banco de dados pelo id contido no token informado

### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota chamada quando o usuario quiser obter os dados do seu próprio perfil.  
**Atenção!:** O usuário é identificado através do ID presente no token de autenticação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não deverá possuir conteúdo no corpo da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um objeto que representa o usuário encontrado, com todas as suas propriedades (exceto a senha), conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** possui como valor um texto explicando o motivo da falha.  
  
#### **Exemplo de requisição**

```json
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
{
  "id": 1,
  "nome": "José",
  "email": "jose@lojadasflores.com.br",
  "nome_loja": "Loja das Flores"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota chamada quando o usuário quiser realizar alterações no seu próprio usuário.  
**Atenção!:** O usuário é identificado através do ID presente no token de autenticação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha
  - nome_loja

- **Resposta**  
  Em caso de **sucesso**, não será retornado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.  

- **FUNCIONALIDADES**
  - Validação dos campos obrigatórios:
    - nome
    - email
    - senha
    - nome_loja
  - Valida se o novo e-mail já existe no banco de dados para outro usuário
    - Caso já exista o novo e-mail fornecido para outro usuário no banco de dados, a alteração não é permitida (o campo de email deve ser sempre único no banco de dados)
  - Criptografa a senha antes de salvar no banco de dados
  - Atualiza as informações do usuário no banco de dados

#### **Exemplo de requisição**

```json
// PUT /usuario
{
  "nome": "José de Abreu",
  "email": "jose_abreu@gmail.com",
  "senha": "j4321",
  "nome_loja": "Loja das Flores Cheirosas"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Listar produtos do usuário logado**

#### `GET` `/produtos`

Essa é a rota chamada quando o usuario logado quiser listar todos os seus produtos cadastrados.  
**Lembre-se:** será retornado **apenas** produtos associados ao usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um array dos objetos (produtos) encontrados.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** que  possui como valor um texto explicando o motivo da falha.

- **FUNCIONALIDADES: **
  - O usuário é identificado através do ID presente no token de validação
  - O endpoint responde com um array de todos os produtos associados ao usuário. Caso não exista nenhum produto associado ao usuário é retornado um array vazio.

#### **Exemplo de requisição**

```json
// GET /produtos
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
[
  {
    "id": 1,
    "usuario_id": 1,
    "nome": "Camisa preta",
    "quantidade": 12,
    "categoria": "Camisas",
    "preco": 4990,
    "descricao": "Camisa de malha com acabamento fino.",
    "imagem": "https://bit.ly/3ctikxq"
  },
  {
    "id": 2,
    "usuario_id": 1,
    "nome": "Calça jeans azul",
    "quantidade": 8,
    "categoria": "Calças",
    "preco": 4490,
    "descricao": "Calça jeans azul.",
    "imagem": "https://bit.ly/3ctikxq"
  }
]
```

```json
// HTTP Status 200 / 201 / 204
[]
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Detalhar um produto do usuário logado**

#### `GET` `/produtos/:id`

Essa é a rota é chamada quando o usuario logado quiser obter um dos seus produtos cadastrados.  
**Lembre-se:** será retornado **apenas** produto associado ao usuário logado, que será ser identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID do produto no parâmetro de rota do endpoint.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um objeto que representa o produto encontrado, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** que  possui como valor um texto explicando o motivo da falha.  

- **FUNCIONALIDADES:**
  - Valida se existe produto para o id enviado como parâmetro na rota e se este produto pertence ao usuário logado.

#### **Exemplo de requisição**

```json
// GET /produtos/44
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
{
  "id": 1,
  "usuario_id": 1,
  "nome": "Camisa preta",
  "quantidade": 8,
  "categoria": "Camisa",
  "preco": 4990,
  "descricao": "Camisa de malha com acabamento fino.",
  "imagem": "https://bit.ly/3ctikxq"
}
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Não existe produto cadastrado com ID 44."
}
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "O usuário logado não tem permissão para acessar este produto."
}
```

### **Cadastrar produto para o usuário logado**

#### `POST` `/produtos`

Essa é a rota utilizada para cadastrar um produto associado ao usuário logado.  
**Lembre-se:** possível cadastrar **apenas** produtos associados ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - quantidade
  - categoria
  - preco
  - descricao
  - imagem

- **Resposta**  
  Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **FUNCIONALIDADES:**
  - Validação os campos obrigatórios:
    - nome
    - quantidade
    - preco
    - descricao
  - Valida se a quantidade do produto é maior que zero.
  - Cadastra o produto associado ao usuário logado.

#### **Exemplo de requisição**

```json
// POST /produtos
{
  "nome": "Camisa preta",
  "quantidade": 8,
  "categoria": "Camisa",
  "preco": 4990,
  "descricao": "Camisa de malha com acabamento fino.",
  "imagem": "https://bit.ly/3ctikxq"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "O preço do produto deve ser informado."
}
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Para cadastrar um produto, o usuário deve estar autenticado."
}
```

### **Atualizar produto do usuário logado**

#### `PUT` `/produtos/:id`

Essa é a rota chamada quando o usuario logado quiser atualizar um dos seus produtos cadastrados.  
**Lembre-se:** será possível atualizar **apenas** produtos associados ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID do produto no parâmetro de rota do endpoint.  
  O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - quantidade
  - categoria
  - preco
  - descricao
  - imagem

- **Resposta**  
  Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **FUNCIONALIDADES:**
  - Valida se existe produto para o id enviado como parâmetro na rota e se este produto pertence ao usuário logado.
  - Validação dos campos obrigatórios:
    - nome
    - quantidade
    - preco
    - descricao
  - Atualiza o produto no banco de dados

#### **Exemplo de requisição**

```json
// PUT /produtos/2
{
  "nome": "Calça jeans preta",
  "quantidade": 22,
  "categoria": "Calças",
  "preco": 4490,
  "descricao": "Calça jeans preta.",
  "imagem": "https://bit.ly/3ctikxq"
}
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "O usuário autenticado não ter permissão para alterar este produto."
}
```

### **Excluir produto do usuário logado**

#### `DELETE` `/produtos/:id`

Essa é a rota chamada quando o usuario logado quiser excluir um dos seus produtos cadastrados.  
**Lembre-se:** será possível excluir **apenas** produtos associados ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID do produto no parâmetro de rota do endpoint.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **FUNCIONALIDADES:**:
  - Valida se existe produto para o id enviado como parâmetro na rota e se este produto pertence ao usuário logado.
  - Exclusão do produto no banco de dados.

#### **Exemplo de requisição**

```json
// DELETE /produtos/88
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Não existe produto para o ID 88."
}
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "O usuário autenticado não tem permissão para excluir este produto."
}
```

---

## **EXTRA**

**ATENÇÃO!:** Esta parte extra não era obrigatória, no entanto, também foi desenvolvida.

### **Filtrar produtos por categoria**

Na funcionalidade de listagem de produtos do usuário logado (**GET /produtos**), podemos incluir um parâmetro do tipo query **categoria** para poder consultar apenas produtos de uma categoria específica.  
**Lembre-se:** serão retornados **apenas** produtos associados ao usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Parâmetro opcional do tipo query **categoria**.  
  Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um array dos objetos (produtos) encontrados.  
  Em caso de **falha na validação**, a resposta possui um **_status code_** apropriado, e em seu corpo (body) um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **FUNCIONALIDADES:**
  - O usuário é identificado através do ID presente no token de validação
  - O endpoint responde com um array de todos os produtos associados ao usuário que sejam da categoria passada no parâmetro query. Caso não exista nenhum produto associado ao usuário sera retornado um array vazio.

#### **Exemplo de requisição**

```json
// GET /produtos?categoria=camisas
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```json
// HTTP Status 200 / 201 / 204
[
  {
    "id": 1,
    "usuario_id": 1,
    "nome": "Camisa preta",
    "quantidade": 12,
    "categoria": "Camisas",
    "preco": 4990,
    "descricao": "Camisa de malha com acabamento fino.",
    "imagem": "https://bit.ly/3ctikxq"
  },
  {
    "id": 2,
    "usuario_id": 1,
    "nome": "Calça jeans azul",
    "quantidade": 8,
    "categoria": "Calças",
    "preco": 4490,
    "descricao": "Calça jeans azul.",
    "imagem": "https://bit.ly/3ctikxq"
  }
]
```

```json
// HTTP Status 200 / 201 / 204
[]
```

```json
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

###### tags: `back-end` `módulo 3` `nodeJS` `PostgreSQL` `API REST` `desafio`
