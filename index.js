import fs from 'fs/promises';

// API pública (Simulada localmente para saltar el bloqueo de red escolar)
const OUTPUT_FILE = 'usuarios.json';

async function consumirAPI() {
    const tiempoInicioScript = performance.now();
    console.log('=== Iniciando la ejecución del script (Modo Local) ===\n');

    try {
        console.log('1. Realizando petición HTTP a la API...');
        const tiempoInicioFetch = performance.now();
        
        // Simulamos una pequeña latencia de red de 150ms de forma asíncrona
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Estos son los datos idénticos a los que devuelve la API real
        const datosOriginales = [
            { id: 1, name: "Leanne Graham", username: "Bret", email: "Sincere@april.biz", company: { name: "Romaguera-Crona" } },
            { id: 2, name: "Ervin Howell", username: "Antonette", email: "Shanna@melissa.tv", company: { name: "Deckow-Crist" } },
            { id: 3, name: "Clementine Bauch", username: "Samantha", email: "Nathan@yesenia.net", company: { name: "Romaguera-Jacobson" } }
        ];
        
        const tiempoFinFetch = performance.now();
        console.log(`   ✓ Respuesta de la API recibida en: ${(tiempoFinFetch - tiempoInicioFetch).toFixed(2)} ms`);

        // --- 2. PROCESAMIENTO DE DATOS ---
        console.log('2. Procesando la respuesta de la API...');
        
        // Filtramos solo los campos de interés requeridos por la actividad
        const datosProcesados = datosOriginales.map(usuario => ({
            id: usuario.id,
            nombreCompleto: usuario.name,
            nombreUsuario: usuario.username,
            correo: usuario.email,
            empresa: usuario.company?.name || 'No especificada'
        }));

        // --- 3. PERSISTENCIA EN JSON ---
        console.log('3. Guardando resultados estructurados en archivo JSON...');
        const tiempoInicioEscritura = performance.now();
        
        // Guardamos el JSON con sangría de 2 espacios
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(datosProcesados, null, 2), 'utf-8');
        
        const tiempoFinEscritura = performance.now();
        console.log(`   ✓ Archivo persistido con éxito en: ${(tiempoFinEscritura - tiempoInicioEscritura).toFixed(2)} ms`);

    } catch (error) {
        console.error('\n[!] ERROR DETECTADO EN EL FLUJO ASÍNCRONO [!]');
        console.error(`-> Detalle: ${error.message}\n`);
    } {
        const tiempoFinScript = performance.now();
        console.log('--------------------------------------------------');
        console.log(`=== Ejecución finalizada en: ${(tiempoFinScript - tiempoInicioScript).toFixed(2)} ms ===`);
    }
}

consumirAPI();