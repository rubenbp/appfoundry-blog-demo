# Rebobina · archivo de videojuegos clásicos

Demo de un catálogo editorial de videojuegos retro, creado con Astro para servir de base al TFM. El sitio está en español y genera páginas estáticas desde 33 fichas Markdown tipadas. Sus siete géneros tienen contenido en las tres épocas del archivo.

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

Las pruebas unitarias cubren búsqueda sin tildes y combinación de filtros. Playwright recorre el catálogo generado: búsqueda, filtros, acceso por género, cobertura de las tres épocas, limpieza de filtros y lectura en móvil con movimiento reducido. Las E2E requieren Python 3 para servir el build. Utilizan Chrome de macOS si está disponible, admiten `CHROME_PATH` y, en su ausencia, usan Chromium de Playwright (`pnpm exec playwright install chromium`).

En entornos que impiden acceder a localhost, `PLAYWRIGHT_OFFLINE=1 pnpm test:e2e` hace que Playwright responda a las peticiones de la página con los archivos de `dist/`. El navegador ejecuta el mismo HTML, CSS y JavaScript; las fuentes remotas usan su respaldo local. `CAPTURE_DEMO=1` añade capturas de portada, catálogo y ficha móvil a los resultados ignorados por Git.

## Rutas

- `/`: portada editorial con una selección del archivo.
- `/catalogo/`: búsqueda por título, género y plataforma.
- `/juegos/<id>/`: ficha individual generada desde Markdown.
- `/sobre-rebobina/`: propósito y principios del archivo.

## Añadir una ficha

1. Crea un archivo Markdown en `src/content/juegos/` con un nombre corto para la URL.
2. Copia los campos de una ficha existente. `src/content.config.ts` valida los datos al generar el sitio.
3. Escribe un resumen y las secciones `Por qué volver` y `Una partida para...`.
4. Añade un SVG original en `public/art/`, registra su clave en `src/data/game-art.ts` y elige una paleta disponible.
5. Completa el resumen, la dificultad editorial, la duración de una sesión y las tres ideas clave. Sigue los criterios de [`docs/contenido-demo.md`](docs/contenido-demo.md).

Campos actuales: `title`, `summary`, `year`, `platform`, `generation`, `genre`, `developer`, `publisher`, `players`, `playtime`, `rating`, `featured`, `visual`, `palette`, `tags`, `difficulty`, `session` y `highlights`.

Las puntuaciones y duraciones son valores de demostración. No representan reseñas verificadas ni datos oficiales.

## Estructura

```text
src/
├── components/       # Navegación, tarjetas e ilustración vectorial
├── content/juegos/   # Fichas Markdown del catálogo
├── data/             # Géneros, épocas y claves de ilustración
├── layouts/          # Marco común de las páginas
├── pages/            # Portada, catálogo, fichas y página editorial
├── scripts/          # Interacción progresiva del catálogo
└── styles/           # Tokens de marca y estilos responsive
tests/
├── unit/              # Filtrado del catálogo
└── e2e/               # Flujos principales en navegador
docs/
└── guia-de-marca.md  # Identidad visual, voz y accesibilidad
public/art/           # Un SVG original por juego
```

## Marca

Rebobina combina una base de papel cálido con tinta oscura, acento lima y detalles coral. La guía completa está en [`docs/guia-de-marca.md`](docs/guia-de-marca.md). Los tokens viven al principio de `src/styles/global.css`. Cada juego tiene una ilustración vectorial propia y animación sutil que respeta movimiento reducido.
