# Rebobina · archivo de videojuegos clásicos

Demo de un catálogo editorial de videojuegos retro, creado con Astro para servir de base al TFM. El sitio está en español y genera páginas estáticas desde fichas Markdown tipadas.

## Empezar

Requiere Node.js 22.12 o posterior y pnpm.

```sh
pnpm install
pnpm dev
```

Abre `http://localhost:4321`. Para generar el sitio estático:

```sh
pnpm build
pnpm preview
```

## Comprobaciones

```sh
pnpm test:unit
pnpm test:e2e
```

Las pruebas unitarias cubren búsqueda sin tildes y combinación de filtros. Playwright recorre el catálogo generado: búsqueda, filtros y apertura de fichas. La primera ejecución puede requerir `pnpm exec playwright install chromium` si Chromium no está instalado.

## Rutas

- `/`: portada editorial con una selección del archivo.
- `/catalogo/`: búsqueda por título, género y plataforma.
- `/juegos/<id>/`: ficha individual generada desde Markdown.
- `/sobre-rebobina/`: propósito y principios del archivo.

## Añadir una ficha

1. Crea un archivo Markdown en `src/content/juegos/` con un nombre corto para la URL.
2. Copia los campos de una ficha existente. `src/content.config.ts` valida los datos al generar el sitio.
3. Escribe un resumen y las secciones `Por qué volver` y `Una partida para...`.
4. Usa un valor visual y una paleta disponibles en el esquema.

Campos actuales: `title`, `year`, `platform`, `generation`, `genre`, `developer`, `publisher`, `players`, `playtime`, `rating`, `featured`, `visual`, `palette` y `tags`.

Las puntuaciones y duraciones son valores de demostración. No representan reseñas verificadas ni datos oficiales.

## Estructura

```text
src/
├── components/       # Navegación, tarjetas e ilustración vectorial
├── content/juegos/   # Fichas Markdown del catálogo
├── layouts/          # Marco común de las páginas
├── pages/            # Portada, catálogo, fichas y página editorial
└── styles/           # Tokens de marca y estilos responsive
tests/
├── unit/              # Filtrado del catálogo
└── e2e/               # Flujos principales en navegador
docs/
└── guia-de-marca.md  # Identidad visual, voz y accesibilidad
```

## Marca

Rebobina combina una base de papel cálido con tinta oscura, acento lima y detalles coral. La guía completa está en [`docs/guia-de-marca.md`](docs/guia-de-marca.md). Los tokens viven al principio de `src/styles/global.css`. Cada juego tiene una ilustración vectorial propia y animación sutil que respeta movimiento reducido.
