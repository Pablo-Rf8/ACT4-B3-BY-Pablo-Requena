# ACT4-B3-BY-Pablo-Requena  # Actividad 4: Consumo de API Pública y Persistencia en JSON con Manejo Asíncrono de Errores

##1.Descripción de la API Utilizada
Para el desarrollo de esta actividad se seleccionó la API pública **JSONPlaceholder**, utilizando específicamente el endpoint de usuarios:
* **URL:** `https://jsonplaceholder.typicode.com/users`

Esta API simula un entorno REST seguro que devuelve un arreglo de objetos JSON con información detallada de usuarios (perfiles, direcciones, geolocalización, empresas, etc.).

---

##2.Flujo General de Consumo y Persistencia
El script fue desarrollado utilizando **Node.js** con soporte para módulos de ECMAScript (`import/export`) y se estructuró de la siguiente manera:

1. **Inicio de Ejecución:** Se inicializa una marca de tiempo de alta precisión utilizando `performance.now()`.
2. **Petición HTTP (Fetch):** Se ejecuta una llamada asíncrona mediante la Fetch API nativa de Node.js dentro de un bloque `try/catch`.
3. **Validación de Estado:** Se verifica la propiedad `respuesta.ok` para validar que el código de estado HTTP se encuentre en el rango 200-299.
4. **Procesamiento de Datos:** Se extrae el cuerpo de la respuesta en formato JSON y se aplica un mapeo (`.map()`) para realizar una limpieza de datos, filtrando únicamente los campos de interés:
   * `id` (Identificador único)
   * `nombreCompleto` (Mapeado desde `name`)
   * `nombreUsuario` (Mapeado desde `username`)
   * `correo` (Mapeado desde `email`)
   * `empresa` (Mapeado desde `company.name`)
5. **Persistencia de Datos:** Los datos filtrados se transforman a una cadena de texto JSON formateada (`JSON.stringify(..., null, 2)`) y se graban en el disco local de forma asíncrona sin bloquear el hilo principal, mediante el módulo `fs/promises`.
6. **Métricas y Cierre:** El bloque `finally` calcula el tiempo total transcurrido e imprime los resultados en la consola.

---

##3. Gestión Asíncrona de Errores
El manejo de excepciones se implementó de forma robusta utilizando bloques `try/catch`. El script no solo atrapa errores genéricos de JavaScript, sino que analiza activamente el mensaje del error para categorizar fallas comunes de red:

* **HTTP Error:** Si el servidor responde pero con un estado de error (ej. `404 Not Found` o `500 Internal Server Error`), se genera manualmente una excepción controlada evaluando `!respuesta.ok`.
* **Network Error:** Si la petición falla antes de conectar con el servidor (debido a problemas de DNS, desconexión del cable, fallas de Wi-Fi o firewalls estrictos), el script intercepta los patrones `fetch failed` o el código `ENOTFOUND` y construye un objeto estructurado de error indicando el tipo, un mensaje amigable y una marca de tiempo exacta (`toISOString()`).

##4. Análisis y Conclusiones de Tiempos de Ejecución
A través de las mediciones realizadas con `performance.now()`, se observaron los siguientes comportamientos en los tiempos del entorno asíncrono:

* **Latencia de Red / Simulación:** La resolución y descarga de datos desde la API toma una porción variable del tiempo (un promedio entre ~150 ms y ~300 ms), lo cual demuestra que los flujos de red son operaciones inherentemente costosas y dependientes del canal físico.
* **Escritura en Disco:** La operación de persistencia con `fs.writeFile` tarda desde un par de milisegundos hasta lapsos mayores (ej. ~1800 ms) dependiendo de la asignación inicial de recursos y operaciones en segundo plano del sistema operativo.
* **Conclusión Asíncrona:** Los resultados justifican plenamente el uso de `async/await`. Si estas llamadas de red y disco se realizaran de forma síncrona (bloqueante), todo el hilo de ejecución de la aplicación se congelaría por completo durante casi 2 segundos, degradando el rendimiento del sistema. Al usar promesas, Node.js delega estas tareas a nivel de sistema operativo y continúa operando de forma eficiente.

---


Caso 1: Flujo Exitoso con Persistencia Local
```text
=== Iniciando la ejecución del script (Modo Local) ===

1. Realizando petición HTTP a la API...
   ✓ Respuesta de la API recibida en: 158.91 ms
2. Procesando la respuesta de la API...
3. Guardando resultados estructurados en archivo JSON...
   ✓ Archivo persistido con éxito en: 1809.24 ms
--------------------------------------------------
=== Ejecución finalizada en: 1973.50 ms ===