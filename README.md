# Site GridNode

Site em HTML, CSS e JavaScript puros, com GSAP (via CDN) para as animações. Publicado pelo GitHub Pages em gridnode.com.br.

## Páginas

| Endereço | Arquivo |
|---|---|
| gridnode.com.br | `index.html` |
| /criacao-de-sites/ | `criacao-de-sites/index.html` |
| /sistema-de-gestao/ | `sistema-de-gestao/index.html` |
| /cardapio-digital/ | `cardapio-digital/index.html` |
| /atendente-de-whatsapp/ | `atendente-de-whatsapp/index.html` |
| /orcamento/ | `orcamento/index.html` |
| /cliente/ | `cliente/index.html` |
| /projetos/forno-lume/, /sereno/, /raiz/ | `projetos/.../index.html` |
| página de erro | `404.html` |

## Outros arquivos

- `style.css`: cores, fontes e layout (vale para todas as páginas)
- `main.js`: transição com a aranha glitch, animações, processo e formulários
- `sitemap.xml` e `robots.txt`: ajudam o Google a encontrar as páginas
- `CNAME`: diz ao GitHub Pages que o domínio é gridnode.com.br (não apague)
- `favicon.svg`: ícone da aba

## Coisas para editar

- **WhatsApp e e-mail:** nas duas primeiras linhas do `main.js`. O rodapé de cada página também mostra os dois.
- **Topo e rodapé:** se mudar algo neles, mude em todas as páginas.
- **Projeto de cliente novo:** copie a pasta de um projeto conceito, troque o conteúdo, adicione a linha dele na seção de projetos do `index.html` e o endereço no `sitemap.xml`.
