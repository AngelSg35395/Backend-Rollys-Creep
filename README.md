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
- **Límite de tamaño**: El servidor acepta cuerpos de petición de hasta 50MB (JSON y URL-encoded)

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
```

**Nota sobre Twilio:** Las variables `TWILIO_PHONE` y `COMPANY_PHONE` son necesarias para el envío automático de notificaciones de WhatsApp cuando se crean nuevas órdenes. `TWILIO_PHONE` es el número de teléfono de Twilio (formato: whatsapp:+1234567890) y `COMPANY_PHONE` es el número de destino donde se recibirán las notificaciones (formato: whatsapp:+1234567890).

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
api-prueba-xd/
│
├── src/
│   ├── config/
│   │   ├── supabase.js          # Configuración del cliente de Supabase
│   │   ├── twilio.js            # Configuración de Twilio para notificaciones en pedidos
│   │   └── uploadImage.js       # Utilidades para subida de imágenes
│   │
│   ├── controllers/
│   │   ├── rootController.js           # Controlador de la ruta raíz
│   │   ├── productsController.js       # Controlador de productos
│   │   ├── companionsController.js     # Controlador de acompañantes
│   │   ├── ordersController.js         # Controlador de órdenes
│   │   └── administratorsController.js # Controlador de administradores
│   │
│   ├── middlewares/
│   │   ├── validationResult.js  # Middleware para manejo de errores de validación
│   │   ├── securityOrigin.js    # Middleware para control de origen seguro
│   │   └── verifyToken.js       # Middleware para verificación de tokens JWT
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

La API utiliza autenticación basada en tokens JWT (JSON Web Tokens) para proteger los endpoints que requieren permisos de administrador. 

**Endpoints que requieren autenticación:**
- Todos los endpoints POST, PUT y DELETE (crear, editar, eliminar)
- GET `/orders/:typePath` - Obtener órdenes
- GET `/administrators` - Obtener administradores

**Endpoints públicos (no requieren autenticación):**
- GET `/` - Mensaje de bienvenida
- GET `/products/:typePath` - Obtener productos
- GET `/companions` - Obtener acompañantes
- POST `/administrators/login` - Iniciar sesión

**Cómo usar la autenticación:**
Para acceder a endpoints protegidos, incluye el token JWT en el header `Authorization` con el formato:
```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene mediante el endpoint de login de administradores (ver sección 1.9.2).

### 1.4.2. Rate Limiting

La API implementa rate limiting para prevenir abuso. Los límites son:
- **50 solicitudes por IP** cada **15 minutos**
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

### 1.8.2. Agregar Orden

**Método HTTP:** `POST`

**URL:** `/orders/add`

**Autenticación:** No requerida

**Descripción:** Crea una nueva orden en el sistema. Las órdenes se crean con estado incompleto por defecto. **Al crear una orden, automáticamente se envía una notificación de WhatsApp** al número configurado en `COMPANY_PHONE` con el contenido del mensaje de la orden.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `order_msg` | string | Sí | Mensaje o descripción de la orden (mínimo 3 caracteres) |

**Nota:** Otros campos como `order_state` y `created_at` son manejados automáticamente por la base de datos.

**Headers requeridos:**
```
Content-Type: application/json
```

**Ejemplo de petición:**
```bash
POST http://localhost:3000/orders/add
Content-Type: application/json

{
  "order_msg": "Café Americano grande con leche y azúcar"
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
      "msg": "El mensaje de la orden no puede estar vacío",
      "path": "order_msg",
      "location": "body"
    }
  ]
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Error adding order[detalles del error]"
}
```

**Error (500 Internal Server Error) - Error al enviar WhatsApp (orden guardada):**
```json
{
  "error": "Order saved but WhatsApp message failed: [detalles del error]"
}
```

**Validaciones y Reglas:**
- `order_msg`: Debe ser un string no vacío con al menos 3 caracteres. Se trima automáticamente.
- **Notificación automática**: Al crear una orden, se envía automáticamente un mensaje de WhatsApp con el contenido de `order_msg` al número configurado en `COMPANY_PHONE`. Si el envío del mensaje falla, la orden se guarda en la base de datos pero se retorna un error 500 indicando que el mensaje de WhatsApp no pudo ser enviado.

---

### 1.8.3. Editar Orden

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

**Descripción:** Autentica un administrador y devuelve un token JWT que debe ser usado para acceder a los endpoints protegidos.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `account_name` | string | Sí | Nombre de usuario del administrador (entre 5 y 15 caracteres) |
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

**Success (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9jb2RlIjoiQURNMDAxIiwiaWF0IjoxNjEwMjM0NTY3fQ...",
  "message": "Login successful"
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

**Error (500 Internal Server Error):**
```json
{
  "error": "Error logging in administrator: [detalles del error]"
}
```

**Validaciones y Reglas:**
- `account_name`: Debe ser un string con entre 5 y 15 caracteres.
- `account_password`: Debe ser un string con entre 8 y 25 caracteres.
- Las contraseñas se comparan usando bcrypt con las contraseñas hasheadas almacenadas en la base de datos.

**Nota:** El token JWT devuelto debe ser incluido en el header `Authorization` como `Bearer <token>` para acceder a los endpoints protegidos. El token no expira por defecto, pero puede ser invalidado si el administrador es eliminado.

---

### 1.9.3. Eliminar Administrador

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

**Endpoints protegidos (requieren autenticación):**
- `POST /products/add` - Agregar producto
- `PUT /products/edit/:id` - Editar producto
- `DELETE /products/delete/:id` - Eliminar producto
- `PUT /products/highlight/:id` - Actualizar destacado
- `POST /companions/add` - Agregar acompañante
- `PUT /companions/edit/:id` - Editar acompañante
- `DELETE /companions/delete/:id` - Eliminar acompañante
- `GET /orders/:typePath` - Obtener órdenes
- `POST /orders/add` - Agregar orden
- `PUT /orders/edit/:id` - Editar orden
- `GET /administrators` - Obtener administradores
- `DELETE /administrators/delete/:admin_code` - Eliminar administrador

**Endpoints públicos (no requieren autenticación):**
- `GET /` - Mensaje de bienvenida
- `GET /products/:typePath` - Obtener productos
- `GET /companions` - Obtener acompañantes
- `POST /administrators/login` - Iniciar sesión

### 1.10.2. Rate Limiting

La API implementa rate limiting para prevenir abuso y ataques de fuerza bruta:

- **Límite**: 50 solicitudes por IP cada 15 minutos
- **Respuesta de error**: HTTP 429 (Too Many Requests)
- **Mensaje**: "Too many requests from this IP, please try again after 15 minutes"

El rate limiting se aplica globalmente a todos los endpoints de la API.

### 1.10.3. Variables de Entorno de Seguridad

Asegúrate de configurar las siguientes variables de entorno:

- `JWT_SECRET`: Secreto utilizado para firmar y verificar tokens JWT. Debe ser una cadena segura y aleatoria.
- `ACCOUNT_SID`: SID de tu cuenta de Twilio
- `AUTH_TOKEN`: Token de autenticación de Twilio
- `TWILIO_PHONE`: Número de teléfono de Twilio en formato WhatsApp (ej: `whatsapp:+1234567890`)
- `COMPANY_PHONE`: Número de destino para recibir notificaciones de WhatsApp (ej: `whatsapp:+1234567890`)

### 1.10.4. Notificaciones de WhatsApp

La API integra notificaciones automáticas de WhatsApp mediante Twilio. Cuando se crea una nueva orden mediante el endpoint `POST /orders/add`, se envía automáticamente un mensaje de WhatsApp al número configurado en `COMPANY_PHONE` con el contenido del mensaje de la orden (`order_msg`).

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
- `highlight`: Booleano requerido para actualizar estado de destacado

#### 1.11.2.2. Acompañantes
- `name`: Requerido al agregar, mínimo 3 caracteres
- `extra_price`: Numérico, puede ser 0, requerido al agregar

#### 1.11.2.3. Órdenes
- `order_msg`: Requerido al agregar, mínimo 3 caracteres
- `order_state`: Booleano requerido para editar

#### 1.11.2.4. Administradores
- `account_name`: Requerido para login, entre 5 y 15 caracteres
- `account_password`: Requerido para login, entre 8 y 25 caracteres

**Por motivos de seguridad, la creación de administradores se realiza exclusivamente desde la base de datos y no a través de la API. Para añadir un nuevo administrador, primero debes generar una contraseña cifrada (bcrypt).**

## Nota el archivo no se encuentra en el repositorio
---

## 1.12. Notas Adicionales

### 1.12.1. Límites de Tamaño

El servidor está configurado para aceptar cuerpos de petición de hasta **50MB** tanto para JSON como para datos URL-encoded. Esto es útil para la carga de imágenes grandes en productos.

---

**Versión del API:** 1.0.06