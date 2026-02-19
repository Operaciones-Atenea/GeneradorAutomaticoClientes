# Atenea Growth — Generador de Propuestas

Sistema de propuestas comerciales con IA. Recibe datos de un cliente, analiza su negocio y genera una landing page personalizada para presentar la propuesta.

## Stack

- **Next.js 14** (App Router)
- **Vercel KV** (Redis) para storage de propuestas
- **Claude API** (claude-opus-4-6) para análisis y generación
- **Tailwind CSS** con colores de Atenea Growth

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Completar ANTHROPIC_API_KEY y variables de KV

# 3. Correr en desarrollo
npm run dev
```

## Deploy en Vercel

1. Push el repo a GitHub
2. Importar en Vercel
3. En el dashboard de Vercel → Storage → Create KV Database → conectar al proyecto
4. Agregar variable de entorno: `ANTHROPIC_API_KEY`
5. Deploy 🚀

## URLs

- **Admin (generador):** `tu-dominio.com/`
- **Propuesta del cliente:** `tu-dominio.com/p/{id}`

## Flow

1. Accedé al admin en `/`
2. Completá los datos del cliente (nombre, URL, industria, pricing, etc.)
3. Click en "Generar Propuesta con IA"
4. La IA analiza el cliente (~15 segundos)
5. Se redirige automáticamente a la propuesta generada
6. Compartí el link con el cliente

## Variables de entorno

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | Tu API key de Anthropic |
| `KV_URL` | Auto-completado por Vercel KV |
| `KV_REST_API_URL` | Auto-completado por Vercel KV |
| `KV_REST_API_TOKEN` | Auto-completado por Vercel KV |
| `KV_REST_API_READ_ONLY_TOKEN` | Auto-completado por Vercel KV |
