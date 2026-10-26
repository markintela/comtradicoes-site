# Com Tradições — site (Next.js)

Site da pastelaria **Com Tradições · Pastelaria · Refeições**, com:

- **Serviços**: o que a casa faz.
- **Catálogo**: filtros por Bolos, Pastelaria e Refeições. O botão "Adicionar" põe o produto no pedido, e o carrinho fica guardado no browser.
- **Lojas**: morada, horário, telefone e o link "Como chegar".
- **Fazer pedido**: resumo dos produtos, nome, telemóvel, loja, dia e hora de levantamento e notas. O pedido fica gravado no servidor.
- **Contacto**: formulário que grava as mensagens no servidor.
- **/pagar**: pagamento MB WAY (o mesmo ecrã da app).

## 1. Experimentar

É preciso ter o Node.js 18.17 ou mais recente.

```bash
npm install
cp .env.example .env.local      # no Windows: copy .env.example .env.local
npm run dev
```

- **No computador:** abra http://localhost:3000
- **No telemóvel (mesma rede Wi-Fi):** leia o QR code que aparece no terminal.

No modo de demonstração (`MBWAY_MOCK=true`), os pagamentos são simulados e aparecem como pagos ao fim de 8 segundos.

## 2. Onde mudar os conteúdos

| Ficheiro | O que tem |
|---|---|
| `src/config/loja.js` | Nome, número MB WAY, telefone, email, Instagram e lojas (morada, horário, mapa) |
| `src/config/catalogo.js` | Produtos: nome, categoria, **preço** (`null` = por definir) e **foto** |
| `src/components/Servicos.jsx` | Textos dos serviços |
| `src/components/Inicio.jsx` | Título e texto de abertura |
| `public/` | Logótipos (`logo-com-tradicoes.svg`, versão branca, logótipo com a menina) e favicon |

**Fotos dos produtos:** o catálogo inclui imagens ilustrativas gratuitas do Unsplash, guardadas em `public/fotos/` para funcionarem sem pedidos externos. Substitua-as pelas fotos reais dos produtos quando disponíveis; para isso, ponha as imagens em `public/fotos/` e indique o caminho no catálogo, por exemplo `foto: '/fotos/pao-de-lo.jpg'`.

**Preços:** os valores atuais são apenas de demonstração. Atualize-os em `src/config/catalogo.js` antes de aceitar encomendas ou pagamentos reais. Quando todos os produtos de um pedido tiverem preço, o site mostra o total; depois de o cliente enviar a encomenda, aparece também o botão "Pagar com MB WAY", já com o valor preenchido.

**Lojas e mapas:** as duas moradas e coordenadas atuais são localizações de demonstração em Lisboa. Substitua `loja.lojas` em `src/config/loja.js` por moradas reais e respetivas coordenadas antes de publicar; os mapas incorporados e os links "Como chegar" usam essas coordenadas.

## 3. Onde ficam os pedidos e as mensagens

Ficam em ficheiros JSON, na pasta `dados/` (pode mudá-la em `PASTA_DADOS`):

- `dados/pedidos.json`: encomendas
- `dados/mensagens.json`: mensagens de contacto
- `dados/pagamentos.json`: pagamentos confirmados pela ifthenpay (callback)

Cada pedido ou mensagem nova também aparece no terminal do servidor.

> Os ficheiros JSON servem num servidor próprio (VPS, Railway, Render…). Em plataformas *serverless* (Vercel, Netlify) o disco não é permanente. Aí, troque `guardarRegisto` em `src/lib/servidor.js` por uma base de dados (Supabase, Firebase…) ou por envio de email.

## 4. Ligar o MB WAY real

1. Peça a adesão MB WAY à ifthenpay e receba a **chave MB WAY**.
2. No `.env.local`, preencha `MBWAY_MOCK=false` e `MBWAY_KEY=A-SUA-CHAVE`.
3. Confirme com a ifthenpay os endereços `MBWAY_API_URL` e `MBWAY_STATUS_URL`.
4. Opcional: ative o callback da ifthenpay para `https://SEU-DOMINIO/api/mbway/callback`, com a chave em `MBWAY_CALLBACK_KEY`.

## 5. Publicar

```bash
npm run build
npm start
```

Use HTTPS no domínio final.

## Estrutura

```
src/app/page.js                     página principal (todas as secções)
src/app/pagar/page.js               pagamento MB WAY
src/app/api/pedidos/route.js        grava encomendas
src/app/api/contacto/route.js       grava mensagens
src/app/api/mbway/...               pedido, estado e callback MB WAY
src/components/                     secções do site, carrinho, ícones
src/config/                         dados da loja e catálogo
src/lib/                            validações, gravação e MB WAY
```
