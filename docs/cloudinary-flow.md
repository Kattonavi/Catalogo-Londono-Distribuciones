# Flujo de Imágenes con Cloudinary — Catálogo Londoño Distribuciones

> Documenta cómo se gestionan las imágenes (subida, reemplazo, eliminación) usando Cloudinary desde el **backend**. El frontend nunca maneja credenciales de Cloudinary.

---

## 1. Principios

1. **Todo pasa por el backend.** El frontend envía el archivo al backend; el backend habla con Cloudinary usando el SDK de Java. Las credenciales (API secret) viven solo en el backend.
2. **La base de datos guarda dos datos por imagen:** `image_url` (URL pública servible) e `image_public_id` (identificador en Cloudinary, necesario para reemplazar/eliminar).
3. **Sin huérfanos.** Al reemplazar o eliminar, la imagen antigua se borra en Cloudinary.
4. **Consistencia.** La BD nunca queda apuntando a una imagen que no existe ni con una imagen subida sin referencia en BD.

---

## 2. Variables de entorno necesarias

Configuradas en el **backend** (en Railway y en local vía archivo no versionado):

| Variable | Descripción |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud de la cuenta Cloudinary |
| `CLOUDINARY_API_KEY` | API Key |
| `CLOUDINARY_API_SECRET` | API Secret (**secreto**, nunca en el repo ni en el frontend) |
| `CLOUDINARY_UPLOAD_FOLDER` | Carpeta base, ej. `londono/products` (opcional pero recomendado) |
| `CLOUDINARY_MAX_FILE_SIZE_MB` | Tamaño máximo permitido, ej. `5` (validación de negocio) |

> Alternativamente, el SDK acepta `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`. Si se usa, esa única variable reemplaza a las tres primeras.

**Reglas:**
- Estas variables **solo** existen en el backend. El frontend no las conoce.
- Nunca se commitean. Están en `.gitignore` (vía `.env` / `application-local.properties`).
- En Railway se configuran como variables de entorno del servicio backend.

---

## 3. Datos que se guardan en base de datos

Por cada entidad con imagen (producto, marca, categoría):

| Campo | Ejemplo | Uso |
|-------|---------|-----|
| `image_url` | `https://res.cloudinary.com/londono/image/upload/v1700000000/londono/products/abc123.jpg` | Mostrar la imagen en el frontend |
| `image_public_id` | `londono/products/abc123` | Reemplazar o eliminar en Cloudinary |

> Sin `image_public_id` no se puede borrar ni reemplazar de forma fiable. **Siempre** se almacenan los dos juntos, o ninguno (si no hay imagen, ambos `null`).

---

## 4. Validaciones de formato y tamaño

Validación **doble**: en frontend (UX rápida) y en backend (autoritativa, no se confía en el cliente).

**Formato permitido:**
- `image/jpeg`, `image/png`, `image/webp`.
- (Opcional) `image/avif`.
- Rechazar cualquier otro tipo MIME.

**Tamaño:**
- Máximo configurable (ej. **5 MB**) vía `CLOUDINARY_MAX_FILE_SIZE_MB`.
- Rechazar archivos vacíos (0 bytes).

**Dimensiones (opcional):**
- Validar mínimo razonable (ej. ≥ 400px de lado) para asegurar calidad.

**Backend además:**
- Verifica el tipo MIME real (no solo la extensión).
- Aplica límites de tamaño de request (multipart).
- Puede normalizar/transformar al subir (ej. limitar dimensión máxima, formato `auto`, calidad `auto`) usando las transformaciones de Cloudinary.

**Respuesta ante validación fallida:** `400 Bad Request` con mensaje claro, sin subir nada a Cloudinary.

---

## 5. Flujo de subida de imagen (primera vez)

```
1. Admin selecciona imagen en el panel.
2. Frontend valida formato/tamaño (UX) y muestra previsualización.
3. Frontend → POST /api/admin/products/{id}/image
   - Content-Type: multipart/form-data
   - field: file
   - Header: Authorization: Bearer <accessToken>
4. Backend:
   a. Verifica rol ADMIN.
   b. Verifica que el producto exista.
   c. Valida MIME real y tamaño (autoritativo).
   d. Sube el archivo a Cloudinary (carpeta CLOUDINARY_UPLOAD_FOLDER),
      con transformaciones opcionales (calidad/formato auto).
   e. Cloudinary devuelve { secure_url, public_id }.
   f. Guarda en BD: image_url = secure_url, image_public_id = public_id.
5. Backend responde 200 con { imageUrl, imagePublicId }.
6. Frontend actualiza la vista con la nueva imagen.
```

---

## 6. Flujo de reemplazo de imagen

El mismo endpoint de subida detecta que ya hay imagen y reemplaza.

```
1. Admin sube una nueva imagen a un producto que YA tiene imagen.
2. Frontend → POST /api/admin/products/{id}/image (igual que subida).
3. Backend:
   a. Recuerda el image_public_id ANTERIOR (lo lee de BD).
   b. Sube la NUEVA imagen a Cloudinary → { new_secure_url, new_public_id }.
   c. Actualiza BD con los nuevos valores.
   d. SOLO si la subida y el guardado fueron exitosos, elimina en Cloudinary
      la imagen ANTERIOR usando el public_id viejo.
4. Backend responde 200 con la nueva { imageUrl, imagePublicId }.
```

**Orden importante:** primero subir la nueva y persistir, **después** borrar la vieja. Así, si algo falla a mitad, nunca se pierde la imagen actual sin tener reemplazo.

**Si la eliminación de la imagen vieja falla** (pero la nueva ya quedó bien): no se rompe el flujo principal. Se registra un log/advertencia para limpieza posterior (la imagen vieja queda huérfana temporalmente, pero la BD es consistente).

---

## 7. Flujo de eliminación de imagen

```
1. Admin pulsa "Eliminar imagen" (con confirmación).
2. Frontend → DELETE /api/admin/products/{id}/image (con JWT).
3. Backend:
   a. Verifica rol y existencia del producto/imagen.
   b. Lee image_public_id.
   c. Elimina en Cloudinary por public_id.
   d. Si la eliminación en Cloudinary fue exitosa (o el recurso ya no existía):
      limpia image_url e image_public_id en BD (los pone a null).
4. Backend responde 204.
```

**Eliminación de un producto completo:** al borrar un producto (`DELETE /api/admin/products/{id}`), el backend primero intenta eliminar su imagen en Cloudinary (si tiene `public_id`) y luego borra el registro (sus eventos se borran en cascada).

---

## 8. Reglas de seguridad

- **Credenciales solo en backend.** El API secret nunca llega al cliente.
- **Endpoints de imagen protegidos.** Subir/reemplazar/eliminar exige `ADMIN` autenticado.
- **Validación autoritativa en backend.** No se confía en la validación del frontend.
- **MIME real verificado**, no solo la extensión del archivo.
- **Límite de tamaño** aplicado en backend y en la config de multipart.
- **Carpeta acotada** (`CLOUDINARY_UPLOAD_FOLDER`) para organizar y poder limpiar.
- **Nombres/public_id controlados por el backend**, no por el cliente (evita colisiones y rutas maliciosas).
- **Entrega segura:** usar siempre `secure_url` (HTTPS).
- (Opcional) Firmar las URLs/transformaciones si se requiere control de acceso adicional.

---

## 9. Qué hacer si falla la subida o la eliminación

Objetivo: **nunca dejar la BD inconsistente** y dar feedback claro al admin.

### 9.1 Falla la subida a Cloudinary
- No se modifica la BD.
- Responder `502 Bad Gateway` (o `503`) con mensaje claro ("No se pudo subir la imagen, intenta de nuevo").
- El producto conserva su imagen anterior (si la tenía).
- Log del error para diagnóstico.

### 9.2 Sube a Cloudinary pero falla el guardado en BD
- Riesgo: imagen subida sin referencia (huérfana).
- Estrategia: si el guardado en BD falla tras una subida exitosa, el backend intenta **eliminar inmediatamente** la imagen recién subida en Cloudinary (rollback) y responde error.
- Si ese rollback también falla, se registra el `public_id` huérfano en logs para limpieza manual/programada.

### 9.3 Reemplazo: nueva OK, borrado de la vieja falla
- El flujo principal se considera **exitoso** (la nueva imagen quedó referenciada).
- La imagen vieja queda huérfana temporalmente; se registra para limpieza posterior.
- No se devuelve error al admin por esto.

### 9.4 Eliminación: falla el borrado en Cloudinary
- Si Cloudinary responde "not found" → tratar como éxito (ya no existe) y limpiar la BD.
- Si es otro error → no limpiar la BD, responder error y permitir reintento.

### 9.5 Limpieza de huérfanos (mantenimiento)
- Registrar siempre los `public_id` huérfanos en logs.
- (Futuro / opcional) tarea programada que concilie imágenes en Cloudinary contra referencias en BD y elimine huérfanos. Fuera del alcance inicial, pero el diseño lo permite.

---

## 10. Resumen

| Operación | Endpoint | Efecto en Cloudinary | Efecto en BD |
|-----------|----------|----------------------|--------------|
| Subir | `POST /api/admin/products/{id}/image` | Crea recurso | Guarda `image_url` + `image_public_id` |
| Reemplazar | `POST /api/admin/products/{id}/image` | Crea nuevo, borra viejo (tras persistir) | Actualiza `image_url` + `image_public_id` |
| Eliminar imagen | `DELETE /api/admin/products/{id}/image` | Borra recurso | Limpia `image_url` + `image_public_id` |
| Eliminar producto | `DELETE /api/admin/products/{id}` | Borra recurso (si existe) | Borra producto + eventos (cascada) |

> El mismo patrón aplica a logos de marca e imágenes de categoría, con sus respectivos `image_url`/`image_public_id` (o `logo_url`/`logo_public_id`).
