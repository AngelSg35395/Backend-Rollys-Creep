# 1. Rolly's Creep Backend

## 1.1. Descripción General

API REST desarrollada con Node.js y Express que proporciona servicios de gestión para el establecimiento 'Roly's Crep'. La API permite administrar productos, acompañantes de productos, órdenes de pedidos y cuentas de administradores. Utiliza Supabase como base de datos y ofrece funcionalidades completas de CRUD (Create, Read, Update, Delete) para cada entidad.

## 1.2. Requisitos del Entorno

### 1.2.1. Prerrequisitos

- **Node.js**: Versión 18 o superior
- **npm**: Versión 9 o superior (incluido con Node.js)
- **Cuenta de Supabase**: Para la configuración de la base de datos
- **Variables de entorno**: Archivo `.env` con las credenciales de Supabase
- **Cuenta de Twilio**: Para la configuración de Twilio para notificaciones en pedidos

### 1.2.2. Instalación

1. Clonar el repositorio o navegar al directorio del proyecto:
```bash
cd "Backend"
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
```

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
│   │   └── validationResult.js  # Middleware para manejo de errores de validación
│   │   └── securityOrigin.js    # Middleware para control de origen seguro
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
- **`src/middlewares/`**: Contiene middlewares personalizados, principalmente para el manejo de validaciones, errores y control de origen seguro.
- **`src/routes/`**: Define las rutas de la API y asocia cada ruta con su controlador correspondiente.
- **`src/validators/`**: Contiene esquemas de validación para los datos de entrada utilizando express-validator.

## 1.4. Endpoints de la API

La API está organizada en las siguientes categorías:

1. **Root** - Ruta principal
2. **Productos** - Gestión de productos del menú
3. **Acompañantes** - Gestión de acompañantes (extras) de productos
4. **Órdenes** - Gestión de pedidos
5. **Administradores** - Gestión de cuentas de administradores

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
GET http://localhost:3000/products/bebida
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

**Descripción:** Crea un nuevo producto en la base de datos. La imagen proporcionada será cargada automáticamente a Supabase Storage.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre del producto (mínimo 3 caracteres) |
| `description` | string | Sí | Descripción del producto (mínimo 3 caracteres) |
| `price` | number | Sí | Precio del producto en formato numérico |
| `product_type` | string | Sí | Tipo de producto (ej: "bebida", "comida", etc.) |
| `image_url` | string (URL) | Opcional | URL de la imagen del producto (debe ser una URL válida) |

**Ejemplo de petición:**
```json
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

**Ejemplo de petición:**
```json
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

**Descripción:** Elimina un producto de la base de datos permanentemente.

**Parámetros de URL:**
- `id` (number, requerido): ID del producto a eliminar

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
DELETE http://localhost:3000/products/delete/3
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Product deleted successfully"
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

**Descripción:** Actualiza el estado de destacado inicial de un producto. Permite marcar o desmarcar productos que se mostrarán inicialmente en la aplicación.

**Parámetros de URL:**
- `id` (number, requerido): ID del producto a actualizar

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `highlight` | boolean | Sí | Estado de destacado (true = mostrar inicialmente, false = no mostrar inicialmente) |

**Ejemplo de petición:**
```json
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

**Descripción:** Crea un nuevo acompañante que puede ser agregado a productos como extra.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Sí | Nombre del acompañante (mínimo 3 caracteres) |
| `extra_price` | number | Sí | Precio adicional del acompañante (puede ser 0) |

**Ejemplo de petición:**
```json
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

**Descripción:** Actualiza uno o varios campos de un acompañante existente.

**Parámetros de URL:**
- `id` (number, requerido): ID del acompañante a editar

**Cuerpo de la petición (JSON):**

Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | Opcional | Nombre del acompañante (mínimo 3 caracteres si se proporciona) |
| `extra_price` | number | Opcional | Precio adicional del acompañante (puede ser 0) |

**Ejemplo de petición:**
```json
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

**Descripción:** Elimina un acompañante de la base de datos permanentemente.

**Parámetros de URL:**
- `id` (number, requerido): ID del acompañante a eliminar

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
DELETE http://localhost:3000/companions/delete/2
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Company deleted successfully"
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

**Descripción:** Obtiene una lista de órdenes filtradas por estado. Puede retornar todas las órdenes, solo las completadas, o solo las incompletas.

**Parámetros de URL:**
- `typePath` (string, requerido): Tipo de órdenes a obtener. Valores posibles:
  - `completed` - Retorna solo órdenes completadas (order_state = true)
  - `incomplete` - Retorna solo órdenes incompletas (order_state = false)
  - Cualquier otro valor - Retorna todas las órdenes sin filtrar por estado

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
GET http://localhost:3000/orders/all
GET http://localhost:3000/orders/completed
GET http://localhost:3000/orders/incomplete
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

**Descripción:** Crea una nueva orden en el sistema. Las órdenes se crean con estado incompleto por defecto.

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `order_msg` | string | Sí | Mensaje o descripción de la orden (mínimo 3 caracteres) |

**Nota:** Otros campos como `order_state` y `created_at` son manejados automáticamente por la base de datos.

**Ejemplo de petición:**
```json
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

**Validaciones y Reglas:**
- `order_msg`: Debe ser un string no vacío con al menos 3 caracteres. Se trima automáticamente.

---

### 1.8.3. Editar Orden

**Método HTTP:** `PUT`

**URL:** `/orders/edit/:id`

**Descripción:** Actualiza el estado de una orden. Usado para marcar órdenes como completadas o incompletas.

**Parámetros de URL:**
- `id` (number, requerido): ID de la orden a editar

**Cuerpo de la petición (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `order_state` | boolean | Sí | Estado de la orden (true = completada, false = incompleta) |

**Ejemplo de petición:**
```json
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

**Descripción:** Obtiene una lista de todos los administradores registrados en el sistema.

**Parámetros:** Ninguno

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
GET http://localhost:3000/administrators
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

**Error (500 Internal Server Error):**
```json
{
  "error": "Error fetching administrators[detalles del error]"
}
```

---

### 1.9.2. Eliminar Administrador

**Método HTTP:** `DELETE`

**URL:** `/administrators/delete/:admin_code`

**Descripción:** Elimina un administrador de la base de datos permanentemente utilizando su código de administrador.

**Parámetros de URL:**
- `admin_code` (string, requerido): Código único del administrador a eliminar

**Cuerpo de la petición:** No requiere

**Ejemplo de petición:**
```bash
DELETE http://localhost:3000/administrators/delete/ADM001
```

**Respuestas:**

**Success (200 OK):**
```json
{
  "message": "Administrator deleted successfully"
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

## 1.10. Resumen de Validaciones

### 1.10.1. Validaciones Comunes

- **Strings**: Todos los campos de tipo string son automáticamente recortados (trimmed) para eliminar espacios en blanco al inicio y al final.
- **Longitudes mínimas**: La mayoría de campos de texto requieren un mínimo de 3 caracteres después del trim.
- **Campos opcionales en edición**: Al editar recursos, todos los campos son opcionales. Solo se actualizarán los campos proporcionados en el cuerpo de la petición.

### 1.10.2. Validaciones Específicas por Entidad

#### 1.10.2.1. Productos
- `name`: Requerido al agregar, mínimo 3 caracteres
- `description`: Requerido al agregar, mínimo 3 caracteres
- `price`: Debe ser numérico, requerido al agregar
- `product_type`: String no vacío, requerido al agregar
- `image_url`: URL válida, opcional. Se carga automáticamente a Supabase Storage si se proporciona
- `highlight`: Booleano requerido para actualizar estado de destacado

#### 1.10.2.2. Acompañantes
- `name`: Requerido al agregar, mínimo 3 caracteres
- `extra_price`: Numérico, puede ser 0, requerido al agregar

#### 1.10.2.3. Órdenes
- `order_msg`: Requerido al agregar, mínimo 3 caracteres
- `order_state`: Booleano requerido para editar

---

**Versión del API:** 1.0.0