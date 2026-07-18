# ImobiSheet - Site Imobiliário com Google Sheets

Este é um site imobiliário moderno e responsivo que carrega todos os dados dos imóveis diretamente de uma planilha do Google Sheets.

## 🚀 Como Usar

### 1. Preparar a Planilha
1. Crie uma nova planilha no Google Sheets.
2. Adicione as seguintes colunas na primeira linha (cabeçalho):
   - `titulo`
   - `descricao`
   - `preco` (Ex: 500000 ou 500.000,00)
   - `cidade`
   - `bairro`
   - `metragem` (Ex: 120)
   - `quartos` (Ex: 3)
   - `banheiros` (Ex: 2)
   - `garagem` (Ex: 2)
   - `url_imagem` (Link direto da imagem, separar múltiplas imagens com vírgula)
   - `url_maps` (Link de embed do Google Maps)
   - `categoria` (Venda, Aluguel, Temporada)
   - `destaque` (TRUE ou FALSE)

3. Preencha com os dados dos imóveis.
4. Vá em **Arquivo > Compartilhar > Publicar na Web**.
5. Em "Link", escolha "Página inteira" e "Valores separados por vírgula (.csv)".
6. Clique em **Publicar** e copie a URL completa gerada.

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione a URL da sua planilha:
```env
VITE_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/e/SEU_ID_AQUI/pub?output=csv
```

## 🛠 Instalação e Execução Local

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente (veja seção acima)

3. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse `http://localhost:5173`

## 📦 Como Publicar (Deploy)

### Vercel (Recomendado)
1. Faça push do código para GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Configure a variável de ambiente `VITE_GOOGLE_SHEET_URL` no painel da Vercel
4. Deploy automático!

**Ou via CLI:**
```bash
npm i -g vercel
vercel
```

### Netlify
1. Faça push do código para GitHub
2. Acesse [netlify.com](https://netlify.com) e importe o repositório
3. Configure a variável de ambiente `VITE_GOOGLE_SHEET_URL` no painel do Netlify
4. Deploy automático!

**Ou via CLI:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_GOOGLE_SHEET_URL` | URL completa da planilha publicada como CSV | Sim |
| `VITE_SITE_NAME` | Nome do site (opcional) | Não |
| `VITE_SITE_URL` | URL do site em produção (opcional) | Não |
| `VITE_WHATSAPP_NUMBER` | Número para contato (Ex: 5511999999999) | Sim (para botão funcionar) |

## 📱 Tecnologias
- React 19 + Vite
- Tailwind CSS
- React Router DOM
- PapaParse (para ler CSV)
- Lucide React (ícones)
- Framer Motion (animações)

## 🎨 Funcionalidades
- ✅ Carregamento dinâmico de imóveis do Google Sheets
- ✅ Filtros por cidade, categoria, preço e quartos
- ✅ Sistema de favoritos (localStorage)
- ✅ Galeria de imagens com lightbox
- ✅ Integração com WhatsApp
- ✅ Compartilhamento nativo
- ✅ Design responsivo
- ✅ SEO otimizado
- ✅ Performance otimizada

## 📄 Licença
MIT

# Site-imobiliaria
