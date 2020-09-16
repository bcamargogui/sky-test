## Proposta

Crie um aplicativo backend que irá expor uma API RESTful de criação de sing up/sign
in.

Todos os endpoints devem somente aceitar e somente enviar JSONs.

O servidor deverá retornar JSON para os casos de endpoint não encontrado também.

O aplicativo deverá persistir os dados (ver detalhes em requisitos).


Todas as respostas de erro devem retornar o objeto:
```
{
  "mensagem": "mensagem de erro"
}
```

## Requisitos

- Persistência de dados
- Gestão de dependências via gerenciador de pacotes (npm)
- Utilização de Eslint
- API: Express, Hapi ou similares.
- Utilizar banco nosql

## Requisitos desejáveis

- JWT como token
- Testes unitários
- Criptografia não reversível (hash) na senha e no token
- Mongo
