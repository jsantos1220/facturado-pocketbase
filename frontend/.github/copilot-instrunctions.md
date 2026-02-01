# GitHub Copilot Custom Instructions (React + Supabase)

## Contexto del Proyecto

-  El proyecto está construido con **React**, **React Router**, **Zustand**, **Material UI** y **TypeScript**.
-  Se utiliza **Supabase como backend-as-a-service**, lo que implica:
   -  Supabase gestiona la base de datos (PostgreSQL), autenticación y API REST/GraphQL.
   -  Las operaciones CRUD se hacen vía `supabase.from(...).select/insert/update/delete(...)`.
-  No se usa un backend propio ni Express.
-  La lógica del negocio está **directamente en el frontend**, y todo debe comunicarse con Supabase.
-  La estructura de carpetas incluye `src/components`, `src/pages`, `src/components/hooks`, `src/lib`, `src/styles`, `src/utils`, `src/context`.

## Preferencias y Funcionalidades

-  **No asumas un backend propio**: Todo debe gestionarse desde Supabase, usando sus APIs y helpers.
-  **No inventes endpoints**: Usa los métodos del cliente de Supabase (`supabase.from(...)`) para acceder a las tablas reales.
-  **Para relaciones muchos a muchos**, usa tablas intermedias y gestiona relaciones con `insert` y `delete` desde el frontend.
   -  Ejemplo: Si hay una tabla `seccion_categoria`, usa `.delete` para eliminar relaciones existentes, y `.insert` para insertar nuevas.
   -  Usa transacciones o lógica secuencial si Supabase no soporta múltiples operaciones atómicas.
-  **Usa manejo explícito de errores**:
   -  Verifica `.error` en cada llamada a Supabase.
   -  Muestra mensajes claros al usuario si falla la operación.
   -  Usa retornos tempranos (`if (error) return ...`) y evita `if` anidados.

## Lógica Frontend

-  Usar `react-router` para el enrutamiento.
-  Validar formularios con **react-hook-form** + **zod**.
-  Gestionar sesiones con el cliente de **Supabase Auth**.
-  Acceder al usuario autenticado con `supabase.auth.getUser()` y proteger rutas privadas.
-  Al guardar datos, esperar confirmación exitosa de Supabase antes de actualizar el estado.
-  Los datos deben mapearse a **tipos TypeScript definidos en `src/types`** (por ejemplo: `Categoria`, `Seccion`, `Usuario`, etc.).
-  Mantener la lógica de lectura/escritura de Supabase separada en `src/lib/supabase.ts` o `src/services/`.

## Estilo y Convenciones

-  Componentes funcionales usando `function`, no `const` ni arrow functions para componentes raíz.
-  Usa JSX declarativo y evita lógica compleja dentro del `return`.
-  Evita `useEffect` innecesarios; usa `react-query` o lógica controlada si es necesario.
-  **No inventes nombres de columnas o tablas**: Usa los nombres reales definidos en Supabase.
-  **No inventes estructura de datos**: Usa la estructura y relaciones que ya existen en la base de datos.

## Ejemplo: Actualizar categorías de una sección

-  Tabla intermedia: `seccion_categoria`
-  Acción esperada:
   1. Eliminar las relaciones actuales:
      ```ts
      await supabase.from('seccion_categoria').delete().eq('seccion_id', seccionId)
      ```
   2. Insertar las nuevas relaciones:
      ```ts
      const nuevasRelaciones = categorias.map(categoriaId => ({
      	seccion_id: seccionId,
      	categoria_id: categoriaId,
      }))
      await supabase.from('seccion_categoria').insert(nuevasRelaciones)
      ```

## Reglas para GitHub Copilot

-  No inventes rutas de backend ni archivos Express.
-  Usa solo Supabase para todo acceso a datos y autenticación.
-  Mantén separados los hooks, componentes y lógica de datos.
-  Prioriza claridad y manejo de errores.
-  Usa `function` para declarar componentes o utilidades.
-  Usa `react-hook-form` + `zod` para formularios.
-  Usa interfaces TypeScript con nombres reales.
-  Usa `react-router-dom` para navegación y rutas protegidas.
-  **Escribe siempre en español** y da ejemplos realistas con estructura existente.
