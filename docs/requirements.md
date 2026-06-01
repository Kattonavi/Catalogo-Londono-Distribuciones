# Requerimientos — Catálogo Londoño Distribuciones

> Documento de requerimientos funcionales y reglas de negocio. Define **qué** debe hacer el sistema, no **cómo** se implementa.

---

## 1. Objetivo general

Construir una aplicación web comercial que presente, de forma muy visual y profesional, el catálogo de productos de **Londoño Distribuciones**, permitiendo a los visitantes explorar productos, marcas y promociones, conocer precios y contactar/pedir por WhatsApp, mientras el administrador gestiona todo el contenido desde un panel liviano y seguro.

El proyecto prioriza la **experiencia visual** del frontend: mobile-first, moderna, fresca, comercial y confiable, con las imágenes de producto como elemento protagonista.

---

## 2. Problema que resuelve

Hoy Londoño Distribuciones no tiene una forma rápida, ordenada y profesional de mostrar su catálogo. Los clientes potenciales no pueden ver de un vistazo qué productos y marcas maneja, cuáles están en promoción, cuáles son nuevos, ni sus precios, y no tienen un canal directo y cómodo para pedir información.

La aplicación resuelve:

- **Visibilidad comercial**: un escaparate digital atractivo y siempre disponible.
- **Decisión rápida**: el visitante entiende en segundos qué se vende y a qué precio.
- **Contacto sin fricción**: pedidos/consultas por WhatsApp con mensaje prellenado.
- **Autonomía del negocio**: el administrador actualiza el catálogo sin depender de un desarrollador.
- **Imagen profesional**: percepción de marca seria y confiable.

---

## 3. Usuarios principales

### 3.1 Visitante / Cliente (público, sin autenticación)
- Llega desde redes sociales, WhatsApp, búsqueda o referidos.
- Mayoritariamente navega desde el **celular**.
- Quiere ver productos, precios, promociones y contactar rápido.
- No crea cuenta ni inicia sesión.

### 3.2 Administrador (autenticado)
- Personal de Londoño Distribuciones.
- Gestiona productos, marcas, categorías, imágenes y estados.
- Consulta métricas básicas del catálogo.
- Accede mediante login seguro.

> En el alcance inicial existe **un único rol administrativo** (`ADMIN`). No hay vendedores ni roles intermedios. El modelo se diseña para poder añadir roles después sin reescribir.

---

## 4. Funcionalidades públicas

### 4.1 Página de inicio (Home)
- Hero visual e impactante con identidad de la distribuidora.
- Accesos rápidos: catálogo, promociones, marcas.
- Secciones destacadas: productos destacados, nuevos y en promoción.
- Listado/strip de marcas.
- Llamados a la acción claros (ver catálogo, contactar por WhatsApp).

### 4.2 Catálogo
- Grid visual de tarjetas de producto.
- Búsqueda por texto (nombre de producto / marca).
- Filtros: por categoría, por marca, por estado (promoción, nuevo, destacado).
- Ordenamiento básico (ej. más recientes, precio).
- Paginación o scroll incremental.
- Solo muestra productos **visibles**.

### 4.3 Página individual de producto
- Imagen(es) protagonistas, en alta calidad.
- Nombre, marca, categoría, descripción.
- Precio actual y, si aplica, precio anterior con porcentaje de descuento.
- Badges: nuevo, destacado, promoción.
- Botón de WhatsApp con mensaje prellenado del producto.
- Sugerencias/relacionados (opcional, fase posterior).
- Registra eventos de vista y de click a WhatsApp.

### 4.4 Promociones
- Sección/página que agrupa productos en promoción.
- Resalta el descuento de forma visual y atractiva.
- Solo productos visibles y marcados como en promoción.

### 4.5 Contacto por WhatsApp
- Botón por producto con número de la distribuidora y mensaje prellenado (ej. *"Hola, estoy interesado en el producto: {nombre} ({precio}). ¿Está disponible?"*).
- Botón de WhatsApp general de la distribuidora.

---

## 5. Funcionalidades admin

### 5.1 Autenticación
- Login seguro con usuario/contraseña.
- JWT + Refresh Token.
- Cierre de sesión.
- Protección de todas las rutas administrativas.

### 5.2 Dashboard
Métricas simples:
- Total de productos.
- Productos visibles.
- Productos en promoción.
- Productos destacados.
- Productos nuevos.
- Productos más vistos.
- Productos con más clicks a WhatsApp.

### 5.3 Gestión de productos (CRUD)
- Crear, editar, eliminar y listar productos.
- Campos: nombre, descripción, marca, categoría, precio actual, precio anterior, imagen.
- Estados: nuevo, destacado, en promoción, visible/oculto.
- Cálculo automático de descuento a partir de precio actual y anterior.
- Subir, reemplazar y eliminar imagen (Cloudinary).

### 5.4 Gestión de marcas (CRUD)
- Crear, editar, eliminar y listar marcas.
- Campos: nombre, slug, (opcional) logo/imagen.

### 5.5 Gestión de categorías (CRUD)
- Crear, editar, eliminar y listar categorías.
- Campos: nombre, slug.

### 5.6 Gestión de imágenes
- Flujo de subida/reemplazo/eliminación vía backend hacia Cloudinary.
- Guardar `image_url` e `image_public_id`.
- Validaciones de formato y tamaño.

> Detalle del flujo en [cloudinary-flow.md](cloudinary-flow.md).

---

## 6. Reglas de negocio

### 6.1 Precios y descuento
- `precio_actual` es obligatorio y debe ser ≥ 0.
- `precio_anterior` es opcional.
- Si existe `precio_anterior` y `precio_anterior > precio_actual`, el producto puede mostrar descuento.
- **Descuento (%) = round((precio_anterior - precio_actual) / precio_anterior * 100)**.
- El descuento se calcula automáticamente; no se almacena como dato editable manual (se deriva).
- Si `precio_anterior <= precio_actual` o no existe, no se muestra descuento.

### 6.2 Estado "en promoción"
- Un producto se muestra como **en promoción** cuando está marcado con el flag `en_promocion`.
- Se recomienda que un producto en promoción tenga `precio_anterior > precio_actual` para mostrar descuento coherente, pero el flag manda para la sección de promociones.

### 6.3 Visibilidad
- Solo los productos con `visible = true` aparecen en el sitio público (home, catálogo, producto, promociones).
- Los productos ocultos siguen existiendo y son gestionables en el admin.

### 6.4 Badges
- **Nuevo**: flag `es_nuevo`.
- **Destacado**: flag `es_destacado`.
- **Promoción**: flag `en_promocion`.
- Un producto puede tener varios badges a la vez. Se define un orden de prioridad visual (ej. promoción > nuevo > destacado) en la dirección visual.

### 6.5 Relaciones
- Un producto pertenece a **una marca** y **una categoría**.
- No se permite eliminar una marca o categoría que tenga productos asociados sin antes reasignar o bloquear la operación (se decide estrategia: bloquear eliminación o exigir reasignación). Por defecto: **bloquear** y avisar al admin.
- Slugs de marca y categoría son únicos.

### 6.6 Eventos de producto
- Cada vista de página de producto registra un evento `VIEW`.
- Cada click al botón de WhatsApp registra un evento `WHATSAPP_CLICK`.
- Los eventos alimentan las métricas del dashboard (más vistos, más clicks).

### 6.7 Seguridad y acceso
- Las operaciones de escritura (crear/editar/eliminar) y la subida/eliminación de imágenes requieren autenticación de `ADMIN`.
- Los endpoints públicos son solo de lectura y solo exponen productos visibles.

### 6.8 Integridad de imágenes
- Al reemplazar una imagen, la anterior debe eliminarse de Cloudinary para no dejar huérfanos.
- Al eliminar un producto, su imagen en Cloudinary debe eliminarse.
- Si falla la operación en Cloudinary, la base de datos no debe quedar en estado inconsistente (ver [cloudinary-flow.md](cloudinary-flow.md)).

---

## 7. Fuera del alcance (inicial)

- Sistema de ventas.
- Carrito de compras.
- Pagos en línea.
- Gestión de clientes.
- Créditos.
- Vendedores / múltiples roles operativos.
- Inventario interno (stock, bodegas, movimientos).
- Facturación.
- Reportes empresariales avanzados.

> El sistema es un **catálogo comercial administrable**, no un ERP. Cualquier funcionalidad de la lista anterior queda explícitamente excluida del alcance inicial.

---

## 8. Requisitos no funcionales

- **Mobile-first**: la experiencia debe ser excelente en celular antes que en escritorio.
- **Rendimiento**: imágenes optimizadas (Cloudinary), carga rápida, animaciones suaves sin afectar fluidez.
- **Responsive**: adaptación correcta a móvil, tablet y escritorio.
- **Accesibilidad básica**: contraste adecuado, textos alternativos en imágenes, navegación por teclado en el admin.
- **Seguridad**: contraseñas hasheadas, JWT con expiración, refresh tokens, protección de rutas admin, validación de entradas.
- **Mantenibilidad**: separación clara frontend/backend, contrato de API documentado, migraciones versionadas con Flyway.
- **SEO básico** en páginas públicas (títulos, metadatos, slugs legibles).
