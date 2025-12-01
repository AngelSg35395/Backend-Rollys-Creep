# 1. Rolly's Creep Backend

## 1.1. Descripción General

API REST desarrollada con Node.js y Express que proporciona servicios de gestión para el establecimiento 'Roly's Crep'. La API permite administrar productos, acompañantes de productos, órdenes de pedidos y cuentas de administradores. Utiliza Supabase como base de datos y ofrece funcionalidades completas de CRUD (Create, Read, Update, Delete) para cada entidad. Además, integra notificaciones automáticas de WhatsApp mediante Twilio para alertar sobre nuevas órdenes.

## 1.2. Requisitos del Entorno

### 1.2.1. Prerrequisitos

- **Node.js**: Versión 18 o superior
- **npm**: Versión 9 o superior (incluido con Node.js)
- **Cuenta de Supabase**: Para la configuración de la base de datos
- **Variables de entorno**: Archivo `.env` con las credenciales de Supabase
- **Cuenta de Twilio**: Para la configuración de Twilio para notificaciones de WhatsApp en pedidos
- **Límite de tamaño**: El servidor acepta cuerpos de petición de hasta 3MB (JSON y URL-encoded)

### 1.2.2. Instalación

1. Clonar el repositorio o navegar al directorio del proyecto:
```bash
cd "Backend-Rollys-Creep"
```

2. Instalar las dependencias del proyecto:
```bash
npm install
```

3. Configurar las variables de entorno creando un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
PORT=puerto_api
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_de_supabase

ACCOUNT_SID=tu_sid_de_TWILIO
AUTH_TOKEN=tu_token_de_TWILIO
TWILIO_PHONE=tu_numero_de_TWILIO
COMPANY_PHONE=tu_numero_personal

JWT_SECRET=tu_secreto_jwt_para_autenticacion
ORDER_SECRET=tu_secreto_para_tokens_de_ordenes

ALLOWED_ORIGINS=tus_origines
```

**Nota sobre Twilio:** Las variables `TWILIO_PHONE` y `COMPANY_PHONE` son necesarias para el envío automático de notificaciones de WhatsApp cuando se crean nuevas órdenes. `TWILIO_PHONE` es el número de teléfono de Twilio (formato: whatsapp:+1234567890) y `COMPANY_PHONE` es el número de destino donde se recibirán las notificaciones (formato: whatsapp:+1234567890).

**Nota sobre tokens:** La variable `ORDER_SECRET` es necesaria para generar y validar tokens de órdenes. Este secreto debe ser diferente de `JWT_SECRET` y debe ser una cadena segura y aleatoria.

### 1.2.3. Ejecución del Servidor

Para ejecutar el servidor en modo desarrollo (con recarga automática):
```bash
npm run dev
```

Para ejecutar el servidor en modo producción:
```bash
npm start
```

Por defecto, el servidor se ejecutará en el puerto especificado en la variable de entorno `PORT` o en el puerto 3000 si no se ha configurado.

Una vez iniciado, el servidor estará disponible en:
```
http://localhost:3000
```

## 1.3. Estructura del Proyecto

```
Backend-Rollys-Creep/
│
├── src/
│   ├── config/
│   │   ├── supabase.js          # Configuración del cliente de Supabase
│   │   ├── twilio.js            # Configuración de Twilio para notificaciones en pedidos
│   │   └── uploadImage.js       # Utilidades para subida de imágenes
│   │   └── orderMessage.js      # Función para preparar mensaje de órdenes en WhatsApp y almacenamiento en la base de datos
│   │
│   ├── controllers/
│   │   ├── rootController.js           # Controlador de la ruta raíz
│   │   ├── productsController.js       # Controlador de productos
│   │   ├── companionsController.js     # Controlador de acompañantes
│   │   ├── ordersController.js         # Controlador de órdenes
│   │   ├── orderTokenController.js      # Controlador para generación de tokens de órdenes
│   │   └── administratorsController.js # Controlador de administradores
│   │
│   ├── middlewares/
│   │   ├── validationResult.js  # Middleware para manejo de errores de validación
│   │   ├── securityOrigin.js    # Middleware para control de origen seguro
│   │   ├── verifyToken.js       # Middleware para verificación de tokens JWT
│   │   └── checkOrderToken.js   # Middleware para verificación de tokens de órdenes
│   │
│   ├── routes/
│   │   ├── root.routes.js           # Rutas de la raíz
│   │   ├── products.routes.js       # Rutas de productos
│   │   ├── companions.routes.js     # Rutas de acompañantes
│   │   ├── orders.routes.js         # Rutas de órdenes
│   │   └── administrators.routes.js # Rutas de administradores
│   │
│   └── validators/
│       ├── productvalidator.js       # Validadores de productos
│       ├── companionvalidator.js     # Validadores de acompañantes
│       ├── ordervalidator.js         # Validadores de órdenes
│       └── adminValidators.js        # Validadores de administradores
│
├── .gitignore             # Archivos ignorados por Git
├── package.json           # Configuración y dependencias del proyecto
├── package-lock.json      # Lock file de dependencias
├── server.js              # Archivo principal del servidor
├── vercel.json            # Configuración para despliegue en Vercel
└── README.md              # Documentación del proyecto
```

### 1.3.1. Descripción de Carpetas

- **`src/config/`**: Contiene archivos de configuración para servicios externos (Supabase, Twilio) y utilidades auxiliares (carga de imágenes).
- **`src/controllers/`**: Contiene la lógica de negocio de cada entidad. Cada controlador maneja las peticiones HTTP relacionadas con su entidad correspondiente.
- **`src/middlewares/`**: Contiene middlewares personalizados, principalmente para el manejo de validaciones, errores, control de origen seguro y autenticación JWT.
- **`src/routes/`**: Define las rutas de la API y asocia cada ruta con su controlador correspondiente.
- **`src/validators/`**: Contiene esquemas de validación para los datos de entrada utilizando express-validator.

## 1.4. Endpoints de la API

La API está organizada en las siguientes categorías:

1. **Root** - Ruta principal
2. **Productos** - Gestión de productos del menú
3. **Acompañantes** - Gestión de acompañantes (extras) de productos
4. **Órdenes** - Gestión de pedidos
5. **Administradores** - Gestión de cuentas de administradores

### 1.4.1. Autenticación

La API utiliza dos sistemas de autenticación:

1. **Autenticación JWT para administradores**: Tokens JWT que expiran en 1 hora (o 3 horas si se refrescan) y se usan para proteger endpoints administrativos. El sistema incluye un mecanismo de refresh automático de tokens.
2. **Tokens de órdenes**: Tokens JWT de corta duración (10 segundos) requeridos para crear órdenes.

**Endpoints que requieren autenticación JWT de administrador:**
- Todos los endpoints POST, PUT y DELETE (crear, editar, eliminar), excepto `POST /orders/add`, `POST /orders/generateToken` y `POST /administrators/login`
- GET `/orders/:typePath` - Obtener órdenes
- GET `/administrators` - Obtener administradores
- POST `/administrators/logout` - Cerrar sesión

**Endpoints que requieren token de orden:**
- POST `/orders/add` - Agregar orden (requiere header `x-order-key`)

**Endpoints públicos (no requieren autenticación):**
- GET `/` - Mensaje de bienvenida
- GET `/products/:typePath` - Obtener productos
- GET `/products/searchSizes/:id` - Buscar tamaños de producto
- GET `/companions` - Obtener acompañantes
- POST `/orders/generateToken` - Generar token de orden
- POST `/administrators/login` - Iniciar sesión

**Cómo usar la autenticación JWT de administrador:**
Para acceder a endpoints protegidos, incluye el token JWT en el header `Authorization` con el formato:
```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene mediante el endpoint de login de administradores (ver sección 1.9.2). Los tokens expiran después de 1 hora por defecto.

**Mecanismo de Refresh de Tokens:**
Si inicias sesión con un token válido y no bloqueado en el header `Authorization`, el sistema automáticamente:
1. **Revoca el token anterior** (lo marca como inválido en la base de datos)
2. **Genera un nuevo token** con expiración de 6 horas en lugar de 1 hora

Esto permite mantener sesiones activas sin necesidad de volver a autenticarse constantemente, mientras se asegura que el token anterior no pueda ser usado nuevamente. El token debe:
- Ser válido (no expirado)
- No estar revocado en la base de datos
- Pertenecer al mismo administrador que está iniciando sesión

**Cómo usar tokens de orden:**
Para crear una orden, primero debes obtener un token de orden mediante `POST /orders/generateToken`, luego incluye el token en el header `x-order-key`:
```
x-order-key: <token_de_orden>
```

Los tokens de orden expiran después de 10 segundos, por lo que deben usarse inmediatamente después de generarse.

### 1.4.2. Rate Limiting

La API implementa rate limiting para prevenir abuso. Los límites son:
- **100 solicitudes por IP** cada **15 minutos**
- Si se excede el límite, se retorna un error 429 con el mensaje: "Too many requests from this IP, please try again after 15 minutes"

---

## 1.5. Root

### 1.5.1. Obtener Mensaje de Bienvenida

**Método HTTP:** `GET`

**URL:** `/`

**Descripción:** Endpoint básico que devuelve un mensaje de bienvenida para verificar que la API está funcionando correctamente.

**Parámetros:** Ninguno

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
GET http://localhost:3000/
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "¡Hello World!"
}
```

**Error:** Este endpoint no devuelve errores.

---

## 1.6. Productos

### 1.6.1. Obtener Productos

**Método HTTP:** `GET`

**URL:** `/products/:typePath`

**Descripción:** Obtiene una lista de productos filtrados por tipo o estado inicial. Puede retornar todos los productos, productos por tipo específico, o productos iniciales destacados.

**Parámetros de URL:**
- `typePath` (string, requerido): Tipo de productos a obtener. Valores posibles:
  - `all` - Retorna todos los productos
  - `initialProducts` - Retorna solo productos destacados inicialmente
  - Cualquier otro valor - Filtra por tipo de producto específico (ej: "Rolls", "Frappes", etc.)

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
GET http://localhost:3000/products/all
GET http://localhost:3000/products/initialProducts
```

---

### 1.6.1.1. Buscar Tamaños de Producto

**Método HTTP:** `GET`

**URL:** `/products/searchSizes/:id`

**Descripción:** Obtiene los tamaños disponibles para un producto específico.

**Parámetros de URL:**
- `id` (number, requerido): ID del producto

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
GET http://localhost:3000/products/searchSizes/1
```

**Respuestas:**

**Success (200 OK):**
```json
[
  {
    "product_sizes": {
      "small": 10.99,
      "medium": 15.99,
      "large": 20.99
    }
  }
]
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error fetching product[detalles del error]"
}
```

**Respuestas:**

**Success (200 OK):**
```json
[
  {
    "product_id": 1,
    "image_url": "https://example.com/image.jpg",
    "name": "Rollos de canela",
    "description": "Rollos de canela hechos de canela",
    "price": 56.14,
    "product_type": "Rolls",
    "initially_show": false
  },
  {
    "product_id": 2,
    "name": "Frappe de chocolate",
    "description": "Frappe de chocolate hecha con chocolate",
    "price": 8.99,
    "product_type": "Frappes",
    "image_url": "https://example.com/image2.jpg",
    "initially_show": true
  }
]
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error fetching products[detalles del error]"
}
```

---

### 1.6.2. Agregar Producto

**Método HTTP:** `POST`

**URL:** `/products/add`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Crea un nuevo producto en la base de datos. La imagen proporcionada será cargada automáticamente a Supabase Storage.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre del producto (mínimo 3 caracteres) |
| `description` | string | Sí | Descripción del producto (mínimo 3 caracteres) |
| `price` | number | Sí | Precio del producto en formato numérico |
| `product_type` | string | Sí | Tipo de producto (ej: "bebida", "comida", etc.) |
| `image_url` | string (URL) | Opcional | URL de la imagen del producto (debe ser una URL válida) |
| `product_sizes` | object | Opcional | Objeto con tamaños y precios del producto (ej: `{"small": 10.99, "medium": 15.99, "large": 20.99}`) |

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Ejemplo de petición:**
```bash
POST http://localhost:3000/products/add
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Frappe Latte",
  "description": "Frappe con leche espumada",
  "price": 18.99,
  "product_type": "Frappes",
  "image_url": "https://example.com/latte.jpg"
}
```

**Respuestas:**

**Success (201 Created):**
```json
{
  "message": "Product added successfully",
  "product": {
    "product_id": 3,
    "name": "Frappe Latte",
    "description": "Frappe con leche espumada",
    "price": 18.99,
    "product_type": "Frappes",
    "image_url": "https://supabase-storage-url/image.jpg",
    "initially_show": false
  }
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre del producto no puede estar vacío",
      "path": "name",
      "location": "body"
    }
  ]
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error uploading image"
}
```
```json
{
  "error": "Error adding product: [detalles del error]"
}
```

**Validaciones y Reglas:**
- `name`: Debe ser un string no vacío con al menos 3 caracteres. Se trima automáticamente.
- `description`: Debe ser un string no vacío con al menos 3 caracteres. Se trima automáticamente.
- `price`: Debe ser un número válido y no estar vacío.
- `product_type`: Debe ser un string no vacío. Se trima automáticamente.
- `image_url`: Opcional. Si se proporciona, debe ser una URL válida.

---

### 1.6.3. Editar Producto

**Método HTTP:** `PUT`

**URL:** `/products/edit/:id`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Actualiza uno o varios campos de un producto existente. Si se proporciona una nueva `image_url` diferente a la actual, se cargará automáticamente a Supabase Storage.

**Parámetros de URL:**
- `id` (number, requerido): ID del producto a editar

**Cuerpo de la petición (JSON):**

Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Opcional | Nombre del producto (mínimo 3 caracteres si se proporciona) |
| `description` | string | Opcional | Descripción del producto (mínimo 3 caracteres si se proporciona) |
| `price` | number | Opcional | Precio del producto en formato numérico |
| `product_type` | string | Opcional | Tipo de producto (no puede estar vacío si se proporciona) |
| `image_url` | string (URL) | Opcional | URL de la imagen del producto (debe ser una URL válida si se proporciona) |
| `product_sizes` | object | Opcional | Objeto con tamaños y precios del producto (ej: `{"small": 10.99, "medium": 15.99, "large": 20.99}`) |

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Ejemplo de petición:**
```bash
PUT http://localhost:3000/products/edit/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Café Latte Grande",
  "price": 20000,
  "image_url": "https://example.com/new-latte.jpg"
}
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Product updated successfully"
}
```

**Error (404 Not Found):**
```json
{
  "error": "Product not found"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre del producto debe tener al menos 3 caracteres",
      "path": "name",
      "location": "body"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error fetching product[detalles del error]"
}
```
```json
{
  "error": "Error uploading image"
}
```
```json
{
  "error": "Error updating product[detalles del error]"
}
```

**Validaciones y Reglas:**
- `name`: Opcional. Si se proporciona, debe ser un string con al menos 3 caracteres. Se trima automáticamente.
- `description`: Opcional. Si se proporciona, debe ser un string con al menos 3 caracteres. Se trima automáticamente.
- `price`: Opcional. Si se proporciona, debe ser un número válido.
- `product_type`: Opcional. Si se proporciona, debe ser un string no vacío. Se trima automáticamente.
- `image_url`: Opcional. Si se proporciona, debe ser una URL válida. Si es diferente a la actual, se cargará a Supabase Storage.

---

### 1.6.4. Eliminar Producto

**Método HTTP:** `DELETE`

**URL:** `/products/delete/:id`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Elimina un producto de la base de datos permanentemente.

**Parámetros de URL:**
- `id` (number, requerido): ID del producto a eliminar

**Cuerpo de la petición:** No requiere

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo de petición:**
```bash
DELETE http://localhost:3000/products/delete/3
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error deleting product[detalles del error]"
}
```

**Validaciones y Reglas:**
- El ID debe ser un número válido que corresponda a un producto existente en la base de datos.

---

### 1.6.5. Actualizar Destacado de Producto

**Método HTTP:** `PUT`

**URL:** `/products/highlight/:id`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Actualiza el estado de destacado inicial de un producto. Permite marcar o desmarcar productos que se mostrarán inicialmente en la aplicación, MAXIMO 5 productos destacados.

**Parámetros de URL:**
- `id` (number, requerido): ID del producto a actualizar

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `highlight` | boolean | Sí | Estado de destacado (true = mostrar inicialmente, false = no mostrar inicialmente) |

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Ejemplo de petición:**
```bash
PUT http://localhost:3000/products/highlight/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "highlight": true
}
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Product updated successfully"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El valor de highlight debe ser un booleano",
      "path": "highlight",
      "location": "body"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error updating product[detalles del error]"
}
```

**Error (400 Bad Request) - Máximo de destacados alcanzado:**
```json
{
  "error": "El máximo de productos destacados (5) ha sido alcanzado"
}
```

**Validaciones y Reglas:**
- `highlight`: Debe ser un valor booleano (true o false) y no puede estar vacío.

---

## 1.7. Acompañantes

### 1.7.1. Obtener Acompañantes

**Método HTTP:** `GET`

**URL:** `/companions`

**Descripción:** Obtiene una lista de todos los acompañantes disponibles para productos.

**Parámetros:** Ninguno

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
GET http://localhost:3000/companions
```

**Respuestas:**

**Success (200 OK):**
```json
[
  {
    "companion_id": 1,
    "name": "Leche",
    "extra_price": 2000
  },
  {
    "companion_id": 2,
    "name": "Azúcar",
    "extra_price": 0
  }
]
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error fetching companions[detalles del error]"
}
```

---

### 1.7.2. Agregar Acompañante

**Método HTTP:** `POST`

**URL:** `/companions/add`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Crea un nuevo acompañante que puede ser agregado a productos como extra.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre del acompañante (mínimo 3 caracteres) |
| `extra_price` | number | Sí | Precio adicional del acompañante (puede ser 0) |

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Ejemplo de petición:**
```bash
POST http://localhost:3000/companions/add
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Crema Batida",
  "extra_price": 10.50
}
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Company added successfully"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre del acompañante no puede estar vacío",
      "path": "name",
      "location": "body"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error adding companion[detalles del error]"
}
```

**Validaciones y Reglas:**
- `name`: Debe ser un string no vacío con al menos 3 caracteres. Se trima automáticamente.
- `extra_price`: Debe ser un número válido. Puede ser 0 si el acompañante no tiene costo adicional.

---

### 1.7.3. Editar Acompañante

**Método HTTP:** `PUT`

**URL:** `/companions/edit/:id`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Actualiza uno o varios campos de un acompañante existente.

**Parámetros de URL:**
- `id` (number, requerido): ID del acompañante a editar

**Cuerpo de la petición (JSON):**

Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Opcional | Nombre del acompañante (mínimo 3 caracteres si se proporciona) |
| `extra_price` | number | Opcional | Precio adicional del acompañante (puede ser 0) |

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Ejemplo de petición:**
```bash
PUT http://localhost:3000/companions/edit/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Crema Batida Premium",
  "extra_price": 4.56
}
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Company updated successfully"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre del acompañante debe tener al menos 3 caracteres",
      "path": "name",
      "location": "body"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error updating companion[detalles del error]"
}
```

**Validaciones y Reglas:**
- `name`: Opcional. Si se proporciona, debe ser un string con al menos 3 caracteres. Se trima automáticamente.
- `extra_price`: Opcional. Si se proporciona, debe ser un número válido.

---

### 1.7.4. Eliminar Acompañante

**Método HTTP:** `DELETE`

**URL:** `/companions/delete/:id`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Elimina un acompañante de la base de datos permanentemente.

**Parámetros de URL:**
- `id` (number, requerido): ID del acompañante a eliminar

**Cuerpo de la petición:** No requiere

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo de petición:**
```bash
DELETE http://localhost:3000/companions/delete/2
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Company deleted successfully"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error deleting companion[detalles del error]"
}
```

**Validaciones y Reglas:**
- El ID debe ser un número válido que corresponda a un acompañante existente en la base de datos.

---

## 1.8. Órdenes

### 1.8.1. Obtener Órdenes

**Método HTTP:** `GET`

**URL:** `/orders/:typePath`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Obtiene una lista de órdenes filtradas por estado. Puede retornar todas las órdenes, solo las completadas, o solo las incompletas.

**Parámetros de URL:**
- `typePath` (string, requerido): Tipo de órdenes a obtener. Valores posibles:
  - `completed` - Retorna solo órdenes completadas (order_state = true)
  - `incomplete` - Retorna solo órdenes incompletas (order_state = false)
  - Cualquier otro valor - Retorna todas las órdenes sin filtrar por estado

**Cuerpo de la petición:** No requiere

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo de petición:**
```bash
GET http://localhost:3000/orders/all
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

GET http://localhost:3000/orders/completed
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

GET http://localhost:3000/orders/incomplete
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuestas:**

**Success (200 OK):**
```json
[
  {
    "order_id": 1,
    "order_msg": "Café Americano con leche",
    "order_state": false,
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "order_id": 2,
    "order_msg": "Croissant y Café Latte",
    "order_state": true,
    "created_at": "2024-01-14T08:15:00Z"
  }
]
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error fetching orders[detalles del error]"
}
```

---

### 1.8.2. Generar Token de Orden

**Método HTTP:** `POST`

**URL:** `/orders/generateToken`

**Autenticación:** No requerida

**Descripción:** Genera un token JWT de corta duración (10 segundos) que es requerido para crear órdenes. Este token debe usarse inmediatamente después de generarse.

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
POST http://localhost:3000/orders/generateToken
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error al generar token"
}
```

**Nota:** El token generado debe incluirse en el header `x-order-key` al crear una orden. El token expira después de 10 segundos.

---

### 1.8.3. Agregar Orden

**Método HTTP:** `POST`

**URL:** `/orders/add`

**Autenticación:** Requerida (Token de orden en header `x-order-key`)

**Descripción:** Crea una nueva orden en el sistema. Las órdenes se crean con estado incompleto por defecto. **Al crear una orden, automáticamente se envía una notificación de WhatsApp** al número configurado en `COMPANY_PHONE` con un mensaje formateado que incluye los datos del cliente, información del pedido y detalles del carrito de compras.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `client_name` | string | Sí | Nombre del cliente (entre 3 y 20 caracteres) |
| `client_email` | string (email) | Sí | Email del cliente (entre 5 y 50 caracteres, debe ser un email válido) |
| `client_phone` | string | Sí | Teléfono del cliente (entre 3 y 20 caracteres) |
| `delivery_date` | string (fecha) | Sí | Fecha de entrega/recogida de la orden (formato de fecha válido) |
| `delivery_time` | string | Sí | Hora de entrega/recogida de la orden (entre 3 y 20 caracteres) |
| `payment_method` | string | Sí | Método de pago (entre 3 y 20 caracteres) |
| `cart_items` | array | Sí | Array de items del carrito de compras (no puede estar vacío) |

**Estructura de `cart_items`:**
Cada item del array debe tener la siguiente estructura:
```json
{
  "name": "string",           // Nombre del producto
  "quantity": number,         // Cantidad del producto
  "price": number,            // Precio unitario del producto
  "product_size": "string",   // Tamaño del producto (ej: "small", "medium", "large")
  "complements": "string"     // Opcional: Complementos o acompañantes del producto
}
```

**Nota:** El campo `order_msg` se genera automáticamente a partir de los datos proporcionados y se almacena en la base de datos. Otros campos como `order_state` y `created_at` son manejados automáticamente por la base de datos.

**Headers requeridos:**
```
Content-Type: application/json
x-order-key: <token_de_orden>
```

**Ejemplo de petición:**
```bash
POST http://localhost:3000/orders/add
Content-Type: application/json
x-order-key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "client_name": "Juan Pérez",
  "client_email": "juan.perez@example.com",
  "client_phone": "+1234567890",
  "delivery_date": "2024-01-20",
  "delivery_time": "14:30",
  "payment_method": "Efectivo",
  "cart_items": [
    {
      "name": "Frappe de Chocolate",
      "quantity": 2,
      "price": 8.99,
      "product_size": "medium",
      "complements": "Leche, Azúcar"
    },
    {
      "name": "Rollos de Canela",
      "quantity": 1,
      "price": 12.50,
      "product_size": "large"
    }
  ]
}
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Order added successfully"
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre del cliente no puede estar vacío",
      "path": "client_name",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "El email del cliente debe tener entre 5 y 50 caracteres",
      "path": "client_email",
      "location": "body"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error adding order: [detalles del error]"
}
```

**Error (401 Unauthorized) - Token de orden no proporcionado:**
```json
{
  "error": "Missing order token"
}
```

**Error (403 Forbidden) - Token de orden inválido o expirado:**
```json
{
  "error": "Invalid or expired token"
}
```

**Error (500 Internal Server Error) - Error al enviar WhatsApp (orden guardada):**
```json
{
  "error": "Order saved but WhatsApp message failed: [detalles del error]"
}
```

**Validaciones y Reglas:**
- `client_name`: Debe ser un string no vacío con entre 3 y 20 caracteres. Se trima automáticamente.
- `client_email`: Debe ser un email válido con entre 5 y 50 caracteres. Se trima automáticamente.
- `client_phone`: Debe ser un string no vacío con entre 3 y 20 caracteres. Se trima automáticamente.
- `delivery_date`: Debe ser una fecha válida y no puede estar vacía.
- `delivery_time`: Debe ser un string no vacío con entre 3 y 20 caracteres. Se trima automáticamente.
- `payment_method`: Debe ser un string no vacío con entre 3 y 20 caracteres. Se trima automáticamente.
- `cart_items`: Debe ser un array no vacío. Cada item debe contener `name`, `quantity`, `price` y `product_size`. El campo `complements` es opcional.
- **Token de orden requerido**: Este endpoint requiere un token de orden válido en el header `x-order-key`. El token debe obtenerse mediante `POST /orders/generateToken` y usarse dentro de 10 segundos.
- **Notificación automática**: Al crear una orden, se envía automáticamente un mensaje de WhatsApp formateado al número configurado en `COMPANY_PHONE`. El mensaje incluye los datos del cliente, fecha y hora de recogida, método de pago, detalles del carrito (con cantidades, precios, tamaños, subtotales) y el total de la orden. Si el envío del mensaje falla, la orden se guarda en la base de datos pero se retorna un error 500 indicando que el mensaje de WhatsApp no pudo ser enviado.

---

### 1.8.4. Editar Orden

**Método HTTP:** `PUT`

**URL:** `/orders/edit/:id`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Actualiza el estado de una orden. Usado para marcar órdenes como completadas o incompletas.

**Parámetros de URL:**
- `id` (number, requerido): ID de la orden a editar

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `order_state` | boolean | Sí | Estado de la orden (true = completada, false = incompleta) |

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json
```

**Ejemplo de petición:**
```bash
PUT http://localhost:3000/orders/edit/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "order_state": true
}
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Order updated successfully"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El estado de la orden debe ser un booleano",
      "path": "order_state",
      "location": "body"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error updating order[detalles del error]"
}
```

**Validaciones y Reglas:**
- `order_state`: Debe ser un valor booleano (true o false) y no puede estar vacío.

---

## 1.9. Administradores

### 1.9.1. Obtener Administradores

**Método HTTP:** `GET`

**URL:** `/administrators`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Obtiene una lista de todos los administradores registrados en el sistema.

**Parámetros:** Ninguno

**Cuerpo de la petición:** No requiere

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo de petición:**
```bash
GET http://localhost:3000/administrators
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuestas:**

**Success (200 OK):**
```json
[
  {
    "admin_code": "ADM001",
    "account_name": "admin1",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "admin_code": "ADM002",
    "account_name": "admin2",
    "created_at": "2024-01-10T00:00:00Z"
  }
]
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error fetching administrators[detalles del error]"
}
```

---

### 1.9.2. Iniciar Sesión de Administrador

**Método HTTP:** `POST`

**URL:** `/administrators/login`

**Autenticación:** No requerida (endpoint público)

**Descripción:** Autentica un administrador y devuelve un token JWT que debe ser usado para acceder a los endpoints protegidos. El sistema implementa protección contra fuerza bruta: después de 5 intentos fallidos, la cuenta se bloquea temporalmente por tiempo progresivo.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `account_name` | string | Sí | Nombre de usuario del administrador (entre 4 y 15 caracteres) |
| `account_password` | string | Sí | Contraseña del administrador (entre 8 y 25 caracteres) |

**Ejemplo de petición:**
```bash
POST http://localhost:3000/administrators/login
Content-Type: application/json

{
  "account_name": "admin1",
  "account_password": "mi_contraseña_segura"
}
```

**Respuestas:**

**Success (200 OK) - Login normal:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9jb2RlIjoiQURNMDAxIiwiaWF0IjoxNjEwMjM0NTY3fQ...",
  "message": "Login successful"
}
```

**Success (200 OK) - Token refrescado:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9jb2RlIjoiQURNMDAxIiwiaWF0IjoxNjEwMjM0NTY3fQ...",
  "message": "Token refreshed successfully"
}
```

**Error (400 Bad Request) - Validación fallida:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "El nombre de usuario debe tener entre 4 y 15 caracteres",
      "path": "account_name",
      "location": "body"
    }
  ]
}
```

**Error (401 Unauthorized) - Credenciales inválidas:**
```json
{
  "error": "Invalid account name or password"
}
```

**Error (403 Forbidden) - Cuenta bloqueada:**
```json
{
  "error": "Too many failed attempts. Try again in X minutes"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error logging in administrator: [detalles del error]"
}
```

**Validaciones y Reglas:**
- `account_name`: Debe ser un string con entre 4 y 15 caracteres.
- `account_password`: Debe ser un string con entre 8 y 25 caracteres.
- Las contraseñas se comparan usando bcrypt con las contraseñas hasheadas almacenadas en la base de datos.
- **Protección contra fuerza bruta**: Después de 5 intentos fallidos de inicio de sesión, la cuenta se bloquea temporalmente. El tiempo de bloqueo aumenta progresivamente: 5 minutos después del 5to intento, 10 minutos después del 6to, etc.
- Los intentos fallidos se reinician después de un inicio de sesión exitoso.

**Mecanismo de Refresh de Tokens:**
- Si incluyes un token válido en el header `Authorization` al iniciar sesión, y ese token:
  - No está revocado en la base de datos
  - Es válido (no expirado)
  - Pertenece al mismo administrador que está iniciando sesión
- El sistema **revocará automáticamente el token anterior** y generará un nuevo token con expiración de **6 horas** en lugar de 1 hora.
- Si no hay token o el token no cumple las condiciones, se genera un token normal con expiración de **1 hora**.

**Nota:** El token JWT devuelto debe ser incluido en el header `Authorization` como `Bearer <token>` para acceder a los endpoints protegidos. Los tokens expiran después de 1 hora (login normal) o 6 horas (si se refrescan), y pueden ser invalidados mediante el endpoint de logout, si se refresca la sesión (el token anterior se revoca automáticamente), o si el administrador es eliminado.

---

### 1.9.3. Cerrar Sesión de Administrador

**Método HTTP:** `POST`

**URL:** `/administrators/logout`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Invalida el token JWT del administrador actual, agregándolo a una lista de tokens revocados. El token no podrá ser usado nuevamente hasta que expire naturalmente.

**Cuerpo de la petición:** No requiere

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo de petición:**
```bash
POST http://localhost:3000/administrators/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Logout successful"
}
```

**Error (401 Unauthorized) - Token no proporcionado:**
```json
{
  "error": "No token provided"
}
```

**Error (400 Bad Request) - Token inválido:**
```json
{
  "error": "Invalid token"
}
```

**Validaciones y Reglas:**
- El token JWT debe ser válido y no expirado.
- El token se registra en la base de datos como revocado y no podrá ser usado nuevamente.

---

### 1.9.4. Eliminar Administrador

**Método HTTP:** `DELETE`

**URL:** `/administrators/delete/:admin_code`

**Autenticación:** Requerida (JWT Token)

**Descripción:** Elimina un administrador de la base de datos permanentemente utilizando su código de administrador.

**Parámetros de URL:**
- `admin_code` (string, requerido): Código único del administrador a eliminar

**Cuerpo de la petición:** No requiere

**Headers requeridos:**
```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo de petición:**
```bash
DELETE http://localhost:3000/administrators/delete/ADM001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Administrator deleted successfully"
}
```

**Error (401 Unauthorized) - Token no proporcionado o inválido:**
```json
{
  "error": "No token provided"
}
```
```json
{
  "error": "Invalid token"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error deleting administrator[detalles del error]"
}
```

**Validaciones y Reglas:**
- El `admin_code` debe ser un string válido que corresponda a un administrador existente en la base de datos.

---

## 1.10. Resumen de Seguridad y Autenticación

### 1.10.1. Autenticación JWT

La API utiliza JSON Web Tokens (JWT) para autenticación. El flujo de autenticación es:

1. **Obtener token**: Realizar POST a `/administrators/login` con credenciales válidas
2. **Usar token**: Incluir el token en el header `Authorization: Bearer <token>` en todas las peticiones a endpoints protegidos
3. **Validación**: El servidor valida el token en cada petición protegida
4. **Refresh de token**: Si inicias sesión con un token válido y no bloqueado, el sistema automáticamente revoca el token anterior y genera uno nuevo con expiración de 6 horas

**Mecanismo de Refresh de Tokens:**
- Los tokens JWT tienen una expiración de 1 hora por defecto
- Si al iniciar sesión incluyes un token válido en el header `Authorization`, el sistema verificará:
  - Que el token no esté revocado
  - Que el token sea válido (no expirado)
  - Que el token pertenezca al mismo administrador
- Si todas las condiciones se cumplen, el sistema **revoca automáticamente el token anterior** y genera un nuevo token con expiración de **6 horas**
- Si no se cumplen las condiciones, se genera un token normal con expiración de **1 hora**

**Endpoints protegidos (requieren autenticación JWT de administrador):**
- `POST /products/add` - Agregar producto
- `PUT /products/edit/:id` - Editar producto
- `DELETE /products/delete/:id` - Eliminar producto
- `PUT /products/highlight/:id` - Actualizar destacado
- `POST /companions/add` - Agregar acompañante
- `PUT /companions/edit/:id` - Editar acompañante
- `DELETE /companions/delete/:id` - Eliminar acompañante
- `GET /orders/:typePath` - Obtener órdenes
- `PUT /orders/edit/:id` - Editar orden
- `GET /administrators` - Obtener administradores
- `POST /administrators/logout` - Cerrar sesión
- `DELETE /administrators/delete/:admin_code` - Eliminar administrador

**Endpoints que requieren token de orden:**
- `POST /orders/add` - Agregar orden (requiere header `x-order-key`)

**Endpoints públicos (no requieren autenticación):**
- `GET /` - Mensaje de bienvenida
- `GET /products/:typePath` - Obtener productos
- `GET /products/searchSizes/:id` - Buscar tamaños de producto
- `GET /companions` - Obtener acompañantes
- `POST /orders/generateToken` - Generar token de orden
- `POST /administrators/login` - Iniciar sesión

### 1.10.2. Rate Limiting

La API implementa rate limiting para prevenir abuso y ataques de fuerza bruta:

- **Límite**: 100 solicitudes por IP cada 15 minutos
- **Respuesta de error**: HTTP 429 (Too Many Requests)
- **Mensaje**: "Too many requests from this IP, please try again after 15 minutes"

El rate limiting se aplica globalmente a todos los endpoints de la API.

### 1.10.3. Variables de Entorno de Seguridad

Asegúrate de configurar las siguientes variables de entorno:

- `JWT_SECRET`: Secreto utilizado para firmar y verificar tokens JWT de administradores. Debe ser una cadena segura y aleatoria.
- `ORDER_SECRET`: Secreto utilizado para firmar y verificar tokens JWT de órdenes. Debe ser diferente de `JWT_SECRET` y ser una cadena segura y aleatoria.
- `ACCOUNT_SID`: SID de tu cuenta de Twilio
- `AUTH_TOKEN`: Token de autenticación de Twilio
- `TWILIO_PHONE`: Número de teléfono de Twilio en formato WhatsApp (ej: `whatsapp:+1234567890`)
- `COMPANY_PHONE`: Número de destino para recibir notificaciones de WhatsApp (ej: `whatsapp:+1234567890`)

### 1.10.4. Notificaciones de WhatsApp

La API integra notificaciones automáticas de WhatsApp mediante Twilio. Cuando se crea una nueva orden mediante el endpoint `POST /orders/add`, se envía automáticamente un mensaje de WhatsApp al número configurado en `COMPANY_PHONE` con un mensaje formateado que incluye:

- **Datos del cliente**: Nombre, email y teléfono
- **Información del pedido**: Fecha y hora de recogida y método de pago
- **Detalles del carrito**: Lista de productos con cantidades, tamaños, precios unitarios, subtotales y complementos (si aplica)
- **Total de la orden**: Suma total de todos los items del carrito

El mensaje se genera automáticamente usando la función `prepareOrderMessage` y se almacena en el campo `order_msg` de la base de datos.

**Comportamiento:**
- Si el envío del mensaje de WhatsApp falla, la orden se guarda en la base de datos pero se retorna un error 500 indicando que el mensaje no pudo ser enviado.
- El mensaje se envía desde el número configurado en `TWILIO_PHONE` hacia el número configurado en `COMPANY_PHONE`.

---

## 1.11. Resumen de Validaciones

### 1.11.1. Validaciones Comunes

- **Strings**: Todos los campos de tipo string son automáticamente recortados (trimmed) para eliminar espacios en blanco al inicio y al final.
- **Longitudes mínimas**: La mayoría de campos de texto requieren un mínimo de 3 caracteres después del trim.
- **Campos opcionales en edición**: Al editar recursos, todos los campos son opcionales. Solo se actualizarán los campos proporcionados en el cuerpo de la petición.

### 1.11.2. Validaciones Específicas por Entidad

#### 1.11.2.1. Productos
- `name`: Requerido al agregar, mínimo 3 caracteres
- `description`: Requerido al agregar, mínimo 3 caracteres
- `price`: Debe ser numérico, requerido al agregar
- `product_type`: String no vacío, requerido al agregar
- `image_url`: URL válida, opcional. Se carga automáticamente a Supabase Storage si se proporciona
- `product_sizes`: Objeto opcional con tamaños y precios del producto (ej: `{"small": 10.99, "medium": 15.99, "large": 20.99}`)
- `highlight`: Booleano requerido para actualizar estado de destacado

#### 1.11.2.2. Acompañantes
- `name`: Requerido al agregar, mínimo 3 caracteres
- `extra_price`: Numérico, puede ser 0, requerido al agregar

#### 1.11.2.3. Órdenes
- `client_name`: Requerido al agregar, entre 3 y 20 caracteres
- `client_email`: Requerido al agregar, email válido entre 5 y 50 caracteres
- `client_phone`: Requerido al agregar, entre 3 y 20 caracteres
- `delivery_date`: Requerido al agregar, debe ser una fecha válida
- `delivery_time`: Requerido al agregar, entre 3 y 20 caracteres
- `payment_method`: Requerido al agregar, entre 3 y 20 caracteres
- `cart_items`: Requerido al agregar, array no vacío. Cada item debe contener `name`, `quantity`, `price` y `product_size`. El campo `complements` es opcional
- `order_state`: Booleano requerido para editar
- **Token de orden**: Requerido para crear órdenes. Debe obtenerse mediante `POST /orders/generateToken` y usarse dentro de 10 segundos
- **Nota**: El campo `order_msg` se genera automáticamente a partir de los datos del cliente y del carrito de compras

#### 1.11.2.4. Administradores
- `account_name`: Requerido para login, entre 4 y 15 caracteres
- `account_password`: Requerido para login, entre 8 y 25 caracteres
- **Protección contra fuerza bruta**: Después de 5 intentos fallidos, la cuenta se bloquea temporalmente con tiempo progresivo
- **Expiración de tokens**: Los tokens JWT expiran después de 1 hora por defecto, o 6 horas si se refrescan mediante el mecanismo de refresh
- **Mecanismo de refresh**: Si se inicia sesión con un token válido y no bloqueado, el tiempo de expiración se extiende a 6 horas
- **Revocación de tokens**: Los tokens pueden ser revocados mediante el endpoint de logout

**Por motivos de seguridad, la creación de administradores se realiza exclusivamente desde la base de datos y no a través de la API. Para añadir un nuevo administrador, primero debes generar una contraseña cifrada (bcrypt).**
---

## 1.12. Notas Adicionales

### 1.12.1. Límites de Tamaño

El servidor está configurado para aceptar cuerpos de petición de hasta **3MB** tanto para JSON como para datos URL-encoded. Esto es útil para la carga de imágenes en productos.

---

**Versión del API:** 1.0.0