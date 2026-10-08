# API de usuarios

API REST con Node.js, Express y Supabase (PostgreSQL). Proyecto final del curso de Node.js.

## Tecnologías

Node.js · Express · JavaScript · Supabase/PostgreSQL · Postman · Git/GitHub · Render

## Estructura

```text
api-final/
├── config/supabase.js          # conexión con Supabase
├── controllers/                # lógica y validaciones
├── middlewares/                # logger y manejo de errores
├── routes/                     # definición de rutas
├── server.js                   # arranque de Express
└── .env                        # variables de entorno (no se sube)
```

Flujo: Postman → Express → Middleware → Controllers → Supabase → PostgreSQL.

## Instalación

```bash
npm install
```

Crea un archivo `.env` en la raíz:

```text
PORT=3000
SUPABASE_URL=https://TU_PROJECT_ID.supabase.co
SUPABASE_KEY=tu_clave_secreta
```

Tabla en Supabase (SQL Editor):

```sql
create table usuarios (
  id bigint generated always as identity primary key,
  nombre text not null,
  email text not null unique,
  edad integer check (edad > 0),
  creado_en timestamptz default now()
);
```

Arrancar:

```bash
npm start
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/usuarios` | Lista todos los usuarios |
| GET | `/usuarios/:id` | Devuelve un usuario |
| POST | `/usuarios` | Crea un usuario |
| PUT | `/usuarios/:id` | Modifica un usuario (parcial) |
| DELETE | `/usuarios/:id` | Elimina un usuario |

Body para POST (`nombre` y `email` obligatorios, `edad` opcional):

```json
{ "nombre": "Antonio", "email": "antonio@email.com", "edad": 30 }
```

## Validaciones y errores

- `nombre`: texto no vacío.
- `email`: formato válido y único (409 si ya existe).
- `edad`: entero mayor que 0.
- `id`: entero positivo (400 si no).

Todos los errores tienen el formato:

```json
{ "success": false, "error": "Usuario no encontrado" }
```

Códigos usados: 200, 201, 400, 404, 409, 500.
