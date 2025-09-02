document.addEventListener("DOMContentLoaded", () => {
  // Valores para cada opcion de la calculadora.
  const FACTORES_EMISION = {
    coche: {
      "No uso vehículo": 0,
      "Menos de 50 km": 0.15,
      "50 – 100 km": 0.35,
      "Más de 100 km": 0.7,
    },
    calefaccion: {
      "Estufa a gas natural": 1.5,
      "Estufa eléctrica": 0.8,
      leña: 0.6,
      "Estufa a gas envasado": 1.2,
    },
    vivienda: {
      "casa independiente": 0.9,
      departamento: 0.5,
      compartida: 0.3,
    },
    dieta: {
      carne: {
        0: 0.2,
        "1-2": 0.8,
        "3-4": 1.2,
        "5-7": 1.8,
        "Más de 7": 2.5,
      },
      lacteos: {
        sí: 0.4,
        no: 0,
      },
      procesados: {
        nunca: 0.1,
        "a veces": 0.5,
        frecuentemente: 0.9,
      },
    },
  };

  const articulo = document.querySelector("article");
  const contenidoOriginal = articulo.innerHTML;

  function crearCalculadora() {
    // Inyectamos el HTML del formulario en la página.
    articulo.innerHTML = `
            <h2 class="font-bold text-xl text-purple-900 mb-3">Calcula tu huella de carbono</h2>
            <p class="text-gray-700 leading-relaxed mb-5">
                Responde las siguientes preguntas para estimar tu huella de carbono personal.
            </p>
            <div id="calculadora-form" class="space-y-6">
                <div><label class="block font-semibold mb-2">¿Cuántos km recorres en vehículo a la semana?</label><select id="coche" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(
                  FACTORES_EMISION.coche
                )
                  .map((key) => `<option value="${key}">${key}</option>`)
                  .join("")}</select></div>
                <div><label class="block font-semibold mb-2">Sistema de calefacción principal:</label><select id="calefaccion" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(
                  FACTORES_EMISION.calefaccion
                )
                  .map((key) => `<option value="${key}">${key}</option>`)
                  .join("")}</select></div>
                <div><label class="block font-semibold mb-2">¿Qué tipo de vivienda habitas?</label><select id="vivienda" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(
                  FACTORES_EMISION.vivienda
                )
                  .map(
                    (key) =>
                      `<option value="${key}">${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }</option>`
                  )
                  .join("")}</select></div>
                <div><label class="block font-semibold mb-2">¿Cuántas comidas con carne consumes a la semana?</label><select id="carne" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(
                  FACTORES_EMISION.dieta.carne
                )
                  .map((key) => `<option value="${key}">${key}</option>`)
                  .join("")}</select></div>
                <div><label class="block font-semibold mb-2">¿Consumes productos lácteos diariamente?</label><div class="flex gap-4">${Object.keys(
                  FACTORES_EMISION.dieta.lacteos
                )
                  .map(
                    (key) =>
                      `<label class="inline-flex items-center"><input type="radio" name="lacteos" value="${key}" class="form-radio text-green-500" ${
                        key === "sí" ? "checked" : ""
                      }><span class="ml-2">${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }</span></label>`
                  )
                  .join("")}</div></div>
                <div><label class="block font-semibold mb-2">¿Consumes alimentos procesados con frecuencia?</label><div class="flex gap-4">${Object.keys(
                  FACTORES_EMISION.dieta.procesados
                )
                  .map(
                    (key) =>
                      `<label class="inline-flex items-center"><input type="radio" name="procesados" value="${key}" class="form-radio text-green-500" ${
                        key === "nunca" ? "checked" : ""
                      }><span class="ml-2">${
                        key.charAt(0).toUpperCase() + key.slice(1)
                      }</span></label>`
                  )
                  .join("")}</div></div>
            </div>
            
            <div class="flex gap-4 mt-8">
                <button id="boton-calcular" class="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition shadow flex-grow">Calcular</button>
                <button id="boton-reiniciar" class="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition shadow flex-grow">Reiniciar</button>
            </div>
            <div id="resultado" class="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner text-center hidden">
                <p class="font-bold text-lg text-blue-800">Tu huella de carbono es de:</p>
                <p class="text-3xl font-extrabold text-blue-700 mt-2">
                    <span id="huella-total">0.00</span> 
                    <span class="text-xl">toneladas de Co2 por Año</span>
                </p>
            </div>
            <button id="boton-volver" class="mt-8 text-sm text-blue-600 hover:underline">Volver a la página principal</button>
        `;

    // Laógica para calcular el resultado
    document.getElementById("boton-calcular").addEventListener("click", () => {
      const cocheValor = document.getElementById("coche").value;
      const calefaccionValor = document.getElementById("calefaccion").value;
      const viviendaValor = document.getElementById("vivienda").value;
      const carneValor = document.getElementById("carne").value;
      const lacteosValor = document.querySelector(
        'input[name="lacteos"]:checked'
      ).value;
      const procesadosValor = document.querySelector(
        'input[name="procesados"]:checked'
      ).value;

      const huellaTotal = (
        FACTORES_EMISION.coche[cocheValor] +
        FACTORES_EMISION.calefaccion[calefaccionValor] +
        FACTORES_EMISION.vivienda[viviendaValor] +
        FACTORES_EMISION.dieta.carne[carneValor] +
        FACTORES_EMISION.dieta.lacteos[lacteosValor] +
        FACTORES_EMISION.dieta.procesados[procesadosValor]
      ).toFixed(2);

      document.getElementById("huella-total").textContent = huellaTotal;
      document.getElementById("resultado").classList.remove("hidden");
    });

    // Lógica para reiniciar el formulario
    document.getElementById("boton-reiniciar").addEventListener("click", () => {
      document.getElementById("coche").value = "No uso coche";
      document.getElementById("calefaccion").value = "Estufa a gas natural";
      document.getElementById("vivienda").value = "casa independiente";
      document.getElementById("carne").value = "0";
      document.querySelector(
        'input[name="lacteos"][value="sí"]'
      ).checked = true;
      document.querySelector(
        'input[name="procesados"][value="nunca"]'
      ).checked = true;

      document.getElementById("huella-total").textContent = "0.00";
      document.getElementById("resultado").classList.add("hidden");
    });

    // Lógica para volver al estado inicial
    document.getElementById("boton-volver").addEventListener("click", () => {
      articulo.innerHTML = contenidoOriginal;
      asignarEventoCalcular();
    });
  }

  // Esta función asigna el uso del botón Calcular huella.
  function asignarEventoCalcular() {
    const botones = document.querySelectorAll("button");
    const botonCalcularHuella = botones[1];
    if (botonCalcularHuella) {
      botonCalcularHuella.addEventListener("click", crearCalculadora);
    }
  }

  // Iniciamos el script llamando a la función por primera vez.
  asignarEventoCalcular();
});
