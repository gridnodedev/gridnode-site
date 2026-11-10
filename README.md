# Site GridNode

Site em HTML, CSS e JavaScript puros, com GSAP (via CDN) para as animações.

## Arquivos

- `index.html`: todas as páginas (home, quero ser cliente, central do cliente e os 3 projetos conceito)
- `style.css`: cores, fontes e layout
- `main.js`: troca de páginas com a aranha glitch, animações, processo e formulários
- `favicon.svg`: ícone da aba

## Coisas para editar

- **WhatsApp e e-mail:** nas duas primeiras linhas do `main.js` e no rodapé do `index.html`.
- **FAQ "O que a manutenção mensal inclui?":** no `index.html` (procure por "manutenção do seu site").
- **Projetos de clientes:** quando fechar um cliente, copie um bloco `<main class="view" data-view="p-...">`, troque o conteúdo, adicione a rota no objeto `ROUTES` do `main.js` e uma linha `<a class="row">` na seção de projetos.

## Páginas (endereços)

- `/#/`: home
- `/#/orcamento`: quero ser cliente
- `/#/cliente`: central do cliente
- `/#/projetos/forno-lume`, `/#/projetos/sereno`, `/#/projetos/raiz`: projetos conceito

## Publicar na Vercel

1. Crie uma conta em vercel.com (pode entrar com o GitHub).
2. Opção rápida: **Add New › Project**, arraste a pasta do site e clique em **Deploy**.
3. Opção recomendada: suba a pasta para um repositório no GitHub e importe na Vercel. Cada alteração enviada ao GitHub atualiza o site sozinho.
4. Para usar um domínio próprio (ex.: gridnode.com.br): **Settings › Domains** no projeto da Vercel.
