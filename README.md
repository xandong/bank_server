# Desafio BACKEND da NG CASH

Aplicação feita em Node com Typescript, atendendo aos tópicos abordados no desafio.

## Importante que esteja com as seguintes variáveis de ambiente no arquivo '.env':

- DATABASE_URL="postgresql://postgres:<password>@localhost:5432/ng?schema=public"
  (URL do banco de dados com usuário, senha, porta e nome do banco)

- KEY="Insira-a-string-que-quiser"
  (Chave secreta para a autenticação com JWT)

## Passo a passo

- Após baixar e descompactar, digite 'npm i' no terminal raiz do projeto, para instalar as dependências.

- Com tudo instalado, caso tenha o Docker, basta digitar o comando 'make' no terminal raiz do projeto. Caso queira executar um por um, abra o arquivo make, que contém todos os comandos necessários para rodar a aplicação. (caso o comando 'make' der erro, basta executar novamente. Pois as vezes o container demora pra subir o banco de dados). Por via das dúvidas, os comandos são:
-
- (PARA SUBIR O CONTAINER)
- docker compose up -d
-
- (PARA CRIAR O AS TABELAS E MIGRATIONS)
- npx prisma migrate dev
-
- (CASO QUEIRA CRIAR USUÁRIOS PRÉ DEFINIDOS, LISTADO MAIS ABAIXO)
- npx prisma db seed
-
- (PARA RODAR A APLICAÇÃO EM NODE)
- npm run dev

## SEEDs (caso tenha rodado npx prisma db seed)

Para facilitar, o banco vem com dois usuários pré cadastrados, tais são:

- username: user
- senha: User1234
-
- username: xandon
- senha: User1234
-

contato: https://www.linkedin.com/in/xandongurgel/
repositórios: https://github.com/xandong
