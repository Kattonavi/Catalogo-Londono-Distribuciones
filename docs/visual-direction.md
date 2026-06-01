# Dirección Visual — Catálogo Londoño Distribuciones

> Guía de diseño y experiencia. Define cómo debe **verse y sentirse** el producto. El frontend debe destacar: premium, comercial, fresco, moderno y cómodo, con las imágenes de producto como protagonistas. Mobile-first siempre.

---

## 1. Dirección visual

**Idea central:** un escaparate digital que se sienta como una tienda moderna y confiable, no como una hoja de cálculo de productos. La pantalla respira, las imágenes mandan, los precios y promociones se leen de un vistazo, y pedir por WhatsApp está a un toque.

**Principios rectores:**
1. **La imagen es la protagonista.** Todo el layout sirve para que la foto del producto luzca.
2. **Claridad comercial.** Precio, descuento y CTA siempre visibles y legibles.
3. **Mobile-first real.** Se diseña primero para el pulgar en un celular.
4. **Ligereza premium.** Mucho espacio en blanco, jerarquía clara, nada apretado.
5. **Movimiento sutil.** Animaciones suaves que guían, nunca que distraen ni ralentizan.
6. **Consistencia.** Un sistema de componentes coherente (shadcn/ui + Tailwind) en todo el sitio.

---

## 2. Personalidad de marca

Londoño Distribuciones debe percibirse como: **cercana, profesional, confiable y actual**.

| Atributo | Sí se siente | No se siente |
|----------|--------------|--------------|
| Confiable | Ordenado, consistente, sin errores visuales | Improvisado, caótico |
| Moderno | Tipografía actual, espaciado generoso, microinteracciones | Anticuado, recargado |
| Comercial | CTAs claros, promociones visibles, precios destacados | Frío, corporativo aburrido |
| Cercano | Lenguaje directo, WhatsApp a un toque | Distante, formal en exceso |
| Fresco | Color con acento vivo, imágenes grandes | Gris, plano, sin energía |

**Tono visual:** limpio y luminoso, con un color de acento vibrante para CTAs, promociones y badges. El blanco/neutro domina; el acento puntúa.

---

## 3. Sistema de UI (foundations)

> Valores de referencia; se afinan al implementar con Tailwind 4 y shadcn/ui.

### 3.1 Color
- **Base / neutros**: blancos y grises muy claros para fondos; gris oscuro/casi negro para texto.
- **Acento primario**: un color vivo y comercial (se define en la implementación — p. ej. un tono corporativo de la distribuidora). Usado en CTAs principales, links activos, foco.
- **WhatsApp**: verde WhatsApp (`#25D366`) reservado **exclusivamente** para botones de WhatsApp, para que sea inmediatamente reconocible.
- **Promoción / descuento**: color cálido y enérgico (rojo/naranja) para badges de promoción y porcentaje de descuento.
- **Nuevo**: color fresco (ej. azul/verde menta) para badge "nuevo".
- **Destacado**: color premium (ej. dorado/ámbar suave) para badge "destacado".
- **Estados**: éxito, error, advertencia con la paleta estándar de feedback.
- **Modo oscuro**: opcional/posterior. El sistema de tokens debe permitirlo sin rediseñar.

> Definir tokens de color como variables (CSS vars / theme de Tailwind) para mantener consistencia y permitir ajuste de marca.

### 3.2 Tipografía
- **Una tipografía sans-serif moderna y legible** (ej. Inter, Geist, o similar) para todo.
- Opcional: una tipografía display con más carácter para titulares del hero.
- Escala tipográfica clara: títulos grandes y contundentes; cuerpo cómodo (mínimo 16px en móvil).
- Pesos: usar contraste de pesos (regular para texto, semibold/bold para precios y títulos).

### 3.3 Espaciado y grid
- Escala de espaciado consistente (múltiplos de 4/8).
- Generoso aire entre secciones; las tarjetas no se tocan.
- Contenedores con `max-width` cómodo en escritorio; full-bleed en hero.

### 3.4 Radios, sombras y bordes
- **Bordes redondeados** medios-grandes en tarjetas, botones e imágenes (sensación amable y moderna).
- **Sombras suaves** y difusas para elevar tarjetas; nada de sombras duras.
- Bordes sutiles (gris muy claro) cuando se necesite separar sin sombra.

### 3.5 Iconografía
- **Lucide React** para todos los íconos: trazo consistente, moderno y ligero.
- Íconos a tamaño cómodo para tap en móvil (mínimo 24px de área táctil ~44px).

---

## 4. Mobile-first

El diseño parte del celular y escala hacia arriba.

- **Pulgar primero:** acciones clave (WhatsApp, filtros, búsqueda) alcanzables con una mano.
- **Una columna** de tarjetas en móvil pequeño; dos columnas en móvil grande/`sm`.
- **Sticky útil:** barra de búsqueda/filtros accesible; botón de WhatsApp flotante persistente.
- **Tap targets** grandes (mín. ~44×44px).
- **Texto legible** sin zoom (≥16px en cuerpo).
- **Imágenes responsivas** servidas por Cloudinary en el tamaño adecuado a cada breakpoint.
- **Filtros en hoja inferior (bottom sheet)** en móvil, no en sidebar apretado.
- **Carga progresiva:** skeletons mientras llegan datos; nada de pantallas en blanco.

---

## 5. Hero section (Home)

El primer impacto. Debe comunicar identidad y dirigir a la acción.

**Contenido:**
- Titular potente y breve (qué es / propuesta de valor).
- Subtítulo corto de apoyo.
- CTA primario: "Ver catálogo".
- CTA secundario: "Escríbenos por WhatsApp".
- Visual de fondo o producto destacado de alto impacto (imagen grande / collage / gradiente de marca).

**Estilo:**
- Full-bleed en móvil, alto suficiente para impactar sin obligar a scroll infinito.
- Texto con excelente contraste sobre la imagen (overlay/gradiente si hace falta).
- Animación de entrada suave (fade + slight rise) al cargar.
- Posibilidad de mostrar un producto/promo destacada o un carrusel ligero.

**Debajo del hero (home):**
- Strip de **marcas** (logos en fila desplazable).
- Sección **Promociones** (las más atractivas).
- Sección **Destacados**.
- Sección **Nuevos**.
- Accesos a **categorías** (chips/tarjetas visuales).
- CTA final de WhatsApp.

---

## 6. Product cards (tarjetas de producto)

El componente más repetido y más importante visualmente.

**Anatomía:**
1. **Imagen** grande, relación de aspecto consistente (ej. 1:1 o 4:5), `object-fit: cover`, esquinas redondeadas.
2. **Badges** superpuestos en la esquina (promoción / nuevo / destacado) — ver prioridad abajo.
3. **Nombre** del producto (1–2 líneas, truncado con elegancia).
4. **Marca** (texto secundario discreto).
5. **Precio**:
   - Precio actual en grande y con peso fuerte.
   - Si hay promoción: precio anterior tachado + badge de **% de descuento**.
6. **Botón de WhatsApp** (verde, claro, con ícono) — acción primaria de la tarjeta.

**Prioridad de badges (cuando hay varios):**
`Promoción` > `Nuevo` > `Destacado`. Mostrar máximo 2 badges para no saturar; el de mayor prioridad siempre visible.

**Interacción:**
- Toda la tarjeta es tappable hacia la página de producto.
- El botón de WhatsApp es un área de tap independiente (no navega a la página, abre WhatsApp).
- Hover en escritorio: leve elevación (sombra + scale 1.02), imagen con ligero zoom.
- En móvil: feedback de tap (active state) sutil.

**Reglas de calidad:**
- Altura consistente entre tarjetas de una misma fila (alinear precios y CTAs).
- Nunca dejar la imagen deformada; usar fondo neutro si la imagen no llena.
- Skeleton card mientras carga.

---

## 7. Página de catálogo

Exploración cómoda y rápida.

**Layout:**
- **Encabezado** con título y contador de resultados.
- **Búsqueda** prominente (input con ícono, debounce).
- **Filtros**:
  - Móvil: botón "Filtros" que abre un **bottom sheet** con categorías, marcas y estados (promoción/nuevo/destacado).
  - Escritorio: sidebar izquierdo fijo + chips de filtros activos arriba.
- **Chips de filtros activos** removibles, con opción "Limpiar todo".
- **Ordenamiento** (más recientes, precio asc/desc).
- **Grid** de product cards:
  - 1–2 columnas en móvil, 3 en tablet, 4 en escritorio.
- **Paginación** o **scroll infinito** con botón "Cargar más" (mejor para móvil y SEO controlado).
- **Estado vacío** amable cuando no hay resultados (ilustración/ícono + CTA para limpiar filtros).
- **Skeletons** durante la carga.

**Sensación:** fluida, sin recargas bruscas; los filtros actualizan el grid con transición suave.

---

## 8. Página de producto

Donde se decide el contacto. La imagen y la acción de WhatsApp son protagonistas.

**Layout (móvil → escritorio):**
- **Galería/imagen** grande arriba (en escritorio, a la izquierda; texto a la derecha).
- **Badges** (promoción/nuevo/destacado) visibles sobre o junto a la imagen.
- **Nombre** grande.
- **Marca** y **categoría** (links a sus listados filtrados).
- **Precio**:
  - Actual destacado.
  - Anterior tachado + **% descuento** si aplica, resaltado.
- **Descripción** clara y legible.
- **Botón de WhatsApp** primario, grande, con mensaje prellenado del producto.
- **CTA secundario** (volver al catálogo / ver más de la marca).
- **Relacionados** (opcional, fase posterior): carrusel de productos de la misma categoría/marca.

**Comportamiento:**
- Registrar evento `VIEW` al entrar.
- Registrar evento `WHATSAPP_CLICK` al pulsar WhatsApp.
- Imagen con buena calidad servida por Cloudinary; posibilidad de zoom/lightbox.
- En móvil, botón de WhatsApp puede quedar **sticky** al fondo para acceso constante.

---

## 9. Promociones

Sección/página que debe sentirse como una oferta irresistible.

- **Encabezado enérgico** ("Promociones", con color cálido de promoción).
- Tarjetas con el **% de descuento muy visible** (badge grande).
- Precio anterior tachado y precio nuevo resaltado.
- Posible orden por mayor descuento.
- Mismo sistema de product cards, pero con énfasis visual en el ahorro.
- CTA de WhatsApp por producto, como siempre.

---

## 10. Admin visual

El panel es **liviano, funcional y limpio**. No necesita ser tan espectacular como el público, pero sí ordenado, claro y cómodo.

**Principios:**
- Layout de panel: barra lateral de navegación (Dashboard, Productos, Marcas, Categorías) + área de contenido.
- Componentes shadcn/ui: tablas, formularios, diálogos, toasts.
- **Dashboard** con tarjetas de métricas (números grandes + ícono + etiqueta) y dos listas (más vistos / más clicks WhatsApp).
- **Tablas** de gestión con búsqueda, filtros y acciones (editar/eliminar) claras.
- **Formularios** (React Hook Form + Zod) con validación en vivo, estados de carga y mensajes de error claros.
- **Subida de imagen** con previsualización, barra/indicador de progreso, y confirmación.
- **Confirmaciones** para acciones destructivas (eliminar producto/imagen).
- **Feedback** inmediato con toasts (éxito/error).
- Vista previa del badge de descuento calculado al editar precios (refleja la regla de negocio en vivo).

**Tono visual del admin:** neutro, profesional, con el mismo color de acento del público para coherencia de marca, pero más sobrio.

---

## 11. Animaciones

Con **Framer Motion / Motion**. Sutiles, con propósito, sin penalizar rendimiento.

**Dónde sí:**
- Entrada del hero (fade + rise).
- Aparición escalonada (stagger) de tarjetas al entrar en viewport.
- Hover/tap de tarjetas (elevación + leve zoom de imagen).
- Transiciones suaves al filtrar/reordenar el grid (layout animation).
- Apertura/cierre del bottom sheet de filtros y de diálogos.
- Skeletons con shimmer.
- Microfeedback en botones (especialmente WhatsApp).

**Reglas:**
- Duraciones cortas (≈150–300ms) y curvas suaves (ease-out).
- Respetar `prefers-reduced-motion` (desactivar/atenuar animaciones).
- Nunca animaciones que bloqueen interacción o retrasen el contenido.
- Priorizar transform/opacity (GPU-friendly), evitar animar layout costoso en exceso.
- El movimiento guía la atención; si distrae, sobra.

---

## 12. Responsive design

Breakpoints de referencia (Tailwind):

| Breakpoint | Ancho aprox. | Columnas de catálogo | Notas |
|------------|--------------|----------------------|-------|
| base (móvil) | < 640px | 1–2 | Filtros en bottom sheet, WhatsApp sticky |
| `sm` | ≥ 640px | 2 | |
| `md` (tablet) | ≥ 768px | 3 | Aparece sidebar de filtros |
| `lg` (escritorio) | ≥ 1024px | 4 | Layout a dos columnas en producto |
| `xl` | ≥ 1280px | 4 | Contenedor con max-width centrado |

**Reglas:**
- Probar siempre primero en móvil real.
- Imágenes con `srcset`/tamaños de Cloudinary por breakpoint.
- Nada de scroll horizontal accidental.
- Navegación adaptada: menú compacto/hamburguesa en móvil, barra completa en escritorio.

---

## 13. Reglas para verse premium, comercial y cómodo

Checklist de calidad visual que el frontend debe cumplir:

1. **Imágenes grandes y consistentes** — misma relación de aspecto, buena resolución (Cloudinary), nunca deformadas.
2. **Precios siempre legibles** — actual en grande; descuento evidente cuando aplica.
3. **WhatsApp inconfundible** — siempre verde, con ícono, a un toque, presente en cada producto.
4. **Aire y jerarquía** — espaciado generoso; el ojo sabe dónde mirar primero.
5. **Badges con criterio** — máximo 2 por tarjeta, con prioridad clara, sin saturar.
6. **Estados cuidados** — loading (skeletons), vacío (mensaje amable), error (claro y recuperable).
7. **Consistencia total** — mismos componentes, radios, sombras y colores en todo el sitio.
8. **Movimiento sutil** — animaciones que suman, respetando `reduced-motion`.
9. **Rendimiento** — carga rápida, imágenes optimizadas, sin jank al hacer scroll.
10. **Mobile-first cómodo** — todo alcanzable con el pulgar, texto legible sin zoom.
11. **CTA claros** — siempre se sabe cuál es la acción principal de cada pantalla.
12. **Confianza** — sin errores visuales, sin imágenes rotas, sin textos cortados feos.
13. **Identidad** — color de acento de marca presente y coherente; sensación de "tienda seria".

> Si una pantalla no cumple este checklist, no está lista. La vara es: que se sienta como un catálogo comercial premium, no como una tabla de productos.
