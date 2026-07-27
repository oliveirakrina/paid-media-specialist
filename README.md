# Karina Oliveira — Site Pessoal (Paid Media & Growth Specialist)

Site estático (HTML/CSS/JS puro), pronto para hospedar gratuitamente no **GitHub Pages**.

## Estrutura

```
index.html                 → Página principal (EN / PT / ES)
orcamento.html              → Formulário geral de pedido de orçamento
briefing-midia-paga.html    → Formulário de briefing para clientes de mídia paga
css/style.css                → Todo o estilo (cores e fontes da identidade visual)
js/translations.js           → Textos em inglês, português e espanhol
js/main.js                   → Troca de idioma, menus, animações e envio dos formulários
assets/                       → Imagens (foto, cases, portfólio, capas de eBook)
```

## Como publicar no GitHub Pages (gratuito)

1. Crie um repositório novo no GitHub (ex: `karina-oliveira-site`).
2. Faça upload de **todos** os arquivos e pastas deste projeto para a raiz do repositório
   (mantendo a estrutura de pastas `css/`, `js/`, `assets/`).
3. No repositório, vá em **Settings → Pages**.
4. Em "Source", selecione a branch `main` e a pasta `/ (root)`. Salve.
5. Em alguns minutos, o GitHub vai te dar uma URL parecida com:
   `https://seu-usuario.github.io/karina-oliveira-site/`
6. (Opcional) Encurte essa URL com **is.gd** ou **tinyurl.com** para usar na bio do Instagram/WhatsApp.

## Formulários (Web3Forms)

Os dois formulários (`orcamento.html` e `briefing-midia-paga.html`) já estão configurados com a
sua chave de acesso do Web3Forms. As respostas chegam diretamente no e-mail cadastrado lá,
sem necessidade de nenhum backend ou banco de dados.

Se quiser trocar a chave no futuro, procure por `access_key` dentro de cada um dos dois arquivos HTML.

## WhatsApp

O número usado em todos os botões é `+353 83 105 5851`. Para trocar, edite a constante
`WHATSAPP_NUMBER` no início do arquivo `js/translations.js`.

## Idiomas

O idioma é detectado automaticamente pelo navegador do visitante (com inglês como padrão),
mas o visitante pode trocar a qualquer momento pelo seletor no menu — a escolha fica salva
para as próximas visitas.
