# purelas

Mapeamento de casos de abuso sexual

Projeto criado sob encomenda pela FilmaDelas

## WebApp

O WebApp do projeto pode ser acessado em
[https://purelas-190223.firebaseapp.com]

Pode ser que a versão online não esteja sincronizada
com o repositório no github.

## Compilando para App

Clone o repositório do projeto

    git clone https://github.com/rodrigonsh/purelas.git

Instale as dependências do node

    npm install

Execute o gulp para compilar os htmls, javascripts e sass

    gulp

Envie a versão de debug para seu android

    cordova run android

Nota: você deve ter um aparelho com modo de desenvolvedor ativado

## Não edite o index.html

O arquivo index.html é gerado gulp através da concatenação dos arquivos em
res/html/\*.html

Toda e qualquer modificação que for necessária no código html deve ser
feita no arquivo correspondente e em seguida deve-se deixar o gulp concatenar
os arquivos em um index.html
