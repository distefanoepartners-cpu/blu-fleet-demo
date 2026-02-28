# Blu Fleet Demo

Demo interattiva del sistema di gestione noleggio nautico **Blu Fleet** powered by NS3000.

## Deploy su Vercel

### Prerequisiti
- Account GitHub (o GitLab/Bitbucket)
- Account Vercel (gratuito su vercel.com)

### Steps
1. Carica questo progetto su un repo GitHub
2. Vai su vercel.com → "Add New Project"
3. Importa il repository
4. Vercel rileva automaticamente Next.js — clicca "Deploy"
5. Configura il dominio personalizzato (es. demo.blufleet.it)

## Struttura
```
app/
  layout.tsx    → Metadata e SEO
  page.tsx      → Demo interattiva completa
```

## Sviluppo locale
```bash
npm install
npm run dev
# → http://localhost:3000
```
