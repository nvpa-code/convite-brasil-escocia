# Brasil x Escócia - convite animado

Single-page app em React + TypeScript + Vite para enviar por link e confirmar presença no jogo Brasil x Escócia da Copa do Mundo FIFA 2026.

## Como instalar

```bash
npm install
```

Se preferir pnpm:

```bash
pnpm install
```

## Rodar localmente

```bash
npm run dev
```

Abra a URL mostrada no terminal, normalmente `http://localhost:5173`.

## Build de produção

```bash
npm run build
```

O build final fica na pasta `dist`.

## Deploy

### Vercel

1. Importe este repositório na Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.

### Netlify

1. Crie um novo site a partir do repositório.
2. Build command: `npm run build`.
3. Publish directory: `dist`.

## Assets personalizados

Os emojis usados nos botoes ficam em:

- `public/emojis/triste.png`
- `public/emojis/safado.png`

As bandeiras usadas no card ficam em:

- `public/flags/brasil.png`
- `public/flags/escocia.png`

Se quiser substituir algum arquivo, mantenha o mesmo nome para não precisar alterar o código.

## Dependências

O projeto usa apenas React, React DOM, Vite, TypeScript e o plugin oficial do React para Vite. As animações de fogos, bolas e microinterações foram feitas com CSS e canvas nativos, sem bibliotecas extras de confete ou animação.
