document.addEventListener("DOMContentLoaded", () => {
    // Valores de cada opción de la calculadora.
    const FACTORES_EMISION = {
        hogarEnergia: {
            base: 0.5, 
            electricidad: {
                "0-100 kWh": 0.04,
                "101-300 kWh": 0.12,
                "301-500 kWh": 0.25,
                "Más de 500 kWh": 0.45,
            },
            energiasRenovables: {
                "Sí": -0.5, 
                "No": 0,
            },
            tipoVivienda: {
                "Apartamento o piso": 0.3,
                "Casa independiente": 0.8,
                "Casa adosada": 0.5,
            },
            fuenteCalefaccion: {
                "Gas natural": 0.5,
                "Electricidad": 0.7,
                "Propano o petróleo": 0.9,
                "No uso calefacción": 0,
            },
        },
        transporte: {
            base: 0.8, 
            tipoVehiculo: {
                "coche": 0.8,
                "moto": 0.5,
                "transporte público": 0.2,
                "bicicleta": 0,
                "eléctrico": 0.1,
                "no tengo": 0,
            },
            kmRecorridos: {
                "0-50 km": 0.1,
                "51-100 km": 0.4,
                "101-200 km": 0.8,
                "Más de 200 km": 1.5,
            },
            combustible: {
                "nafta": 0.7,
                "Diésel": 0.9,
                "Eléctrico o híbrido": 0.2,
                "No tengo vehículo personal": 0,
            },
            vuelos: {
                "Ninguno": 0,
                "1-2 vuelos cortos (menos de 3 horas)": 0.3,
                "3-5 vuelos (algunos largos)": 1.5,
                "Más de 5 vuelos (incluyendo largos)": 3.0,
            },
        },
        consumoHabitos: {
            base: 0.6, 
            carneRoja: {
                "varias veces a la semana": 1.5,
                "una vez a la semana": 0.8,
                "una vez al mes": 0.2,
                "Nunca": 0,
            },
            comerFuera: {
                "0-1 vez": 0.1,
                "2-4 veces": 0.4,
                "Más de 4 veces": 0.8,
            },
            reciclaje: {
                "siempre": -0.2, 
                "a veces": 0.1,
                "nunca": 0.3,
            },
            lacteos: {
                "Diario": 0.3,
                "3-4 veces a la semana": 0.1,
                "Rara vez": 0.05,
                "Nunca": 0,
            },
        },
        residuos: {
            base: 0.3, 
            reciclajeHogar: {
                "Siempre": -0.2,
                "A veces": 0.1,
                "Rara vez o nunca": 0.3,
            }
        }
    };

    const articulo = document.querySelector("article");
    const contenidoOriginal = articulo.innerHTML;
    let myChart; // Variable para almacenar la instancia del gráfico

    function crearCalculadora() {
        // Inyectamos el HTML del formulario en la página para las preguntas.
        articulo.innerHTML = `
            <h2 class="font-bold text-xl text-purple-900 mb-3">Calcula tu huella de carbono</h2>
            <p class="text-gray-700 leading-relaxed mb-5">
                Responde las siguientes preguntas para estimar tu huella de carbono personal.
            </p>
            <div id="calculadora-form" class="space-y-6">
                <div class="space-y-4 p-4 border rounded-md">
                    <h3 class="font-bold text-lg text-purple-700">Hogar y Energía</h3>
                    <div><label class="block font-semibold mb-2">¿Cuál es tu consumo de electricidad mensual promedio? (en kWh)</label><select id="electricidad" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.hogarEnergia.electricidad).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    
                    <div><label class="block font-semibold mb-2">¿Usas energías renovables, como paneles solares?</label><select id="energiasRenovables" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.hogarEnergia.energiasRenovables).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Cuál es tu tipo de vivienda?</label><select id="tipoVivienda" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.hogarEnergia.tipoVivienda).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Qué fuente de energía principal utilizas para la calefacción y el agua caliente?</label><select id="fuenteCalefaccion" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.hogarEnergia.fuenteCalefaccion).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                </div>

                <div class="space-y-4 p-4 border rounded-md">
                    <h3 class="font-bold text-lg text-purple-700">Transporte</h3>
                    <div><label class="block font-semibold mb-2">¿Qué tipo de vehículo utilizas con más frecuencia?</label><select id="tipoVehiculo" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.transporte.tipoVehiculo).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Cuántos km recorres en vehículo a la semana?</label><select id="kmRecorridos" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.transporte.kmRecorridos).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Qué tipo de combustible utiliza tu vehículo principal?</label><select id="combustible" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.transporte.combustible).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Cuántos vuelos de ida y vuelta tomas al año?</label><select id="vuelos" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.transporte.vuelos).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                </div>

                <div class="space-y-4 p-4 border rounded-md">
                    <h3 class="font-bold text-lg text-purple-700">Consumo y Hábitos</h3>
                    <div><label class="block font-semibold mb-2">¿Con qué frecuencia consumes carne roja (e.g., res, cerdo, cordero)?</label><select id="carneRoja" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.consumoHabitos.carneRoja).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Cuántas veces a la semana comes fuera de casa o pides comida a domicilio?</label><select id="comerFuera" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.consumoHabitos.comerFuera).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Con qué frecuencia reciclas papel, plástico, vidrio y metal?</label><select id="reciclaje" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.consumoHabitos.reciclaje).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                    <div><label class="block font-semibold mb-2">¿Con qué frecuencia consumes lácteos (leche, queso, yogur)?</label><select id="lacteos" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.consumoHabitos.lacteos).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                </div>

                <div class="space-y-4 p-4 border rounded-md">
                    <h3 class="font-bold text-lg text-purple-700">Residuos</h3>
                    <div><label class="block font-semibold mb-2">¿Con qué frecuencia reciclas en tu hogar?</label><select id="reciclajeHogar" class="w-full p-2 border rounded-md shadow-sm">${Object.keys(FACTORES_EMISION.residuos.reciclajeHogar).map(key => `<option value="${key}">${key}</option>`).join("")}</select></div>
                </div>
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
                <div class="mt-8">
                    <div class="flex justify-center">
                        <div class="max-w-xs"> 
                            <canvas id="huellaChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <button id="boton-volver" class="mt-8 text-sm text-blue-600 hover:underline">Volver a la página principal</button>
        `;

        // Lógica para calcular el resultado
        document.getElementById("boton-calcular").addEventListener("click", () => {
            const electricidadValor = document.getElementById("electricidad").value;
            const energiasRenovablesValor = document.getElementById("energiasRenovables").value;
            const tipoViviendaValor = document.getElementById("tipoVivienda").value;
            const fuenteCalefaccionValor = document.getElementById("fuenteCalefaccion").value;
            const tipoVehiculoValor = document.getElementById("tipoVehiculo").value;
            const kmRecorridosValor = document.getElementById("kmRecorridos").value;
            const combustibleValor = document.getElementById("combustible").value;
            const vuelosValor = document.getElementById("vuelos").value;
            const carneRojaValor = document.getElementById("carneRoja").value;
            const comerFueraValor = document.getElementById("comerFuera").value;
            const reciclajeValor = document.getElementById("reciclaje").value;
            const lacteosValor = document.getElementById("lacteos").value;
            const reciclajeHogarValor = document.getElementById("reciclajeHogar").value;

            // Calcular la huella por categoría
            let huellaHogarEnergia = FACTORES_EMISION.hogarEnergia.base +
                FACTORES_EMISION.hogarEnergia.electricidad[electricidadValor] +
                FACTORES_EMISION.hogarEnergia.energiasRenovables[energiasRenovablesValor] +
                FACTORES_EMISION.hogarEnergia.tipoVivienda[tipoViviendaValor] +
                FACTORES_EMISION.hogarEnergia.fuenteCalefaccion[fuenteCalefaccionValor];

            let huellaTransporte = FACTORES_EMISION.transporte.base +
                FACTORES_EMISION.transporte.tipoVehiculo[tipoVehiculoValor] +
                FACTORES_EMISION.transporte.kmRecorridos[kmRecorridosValor] +
                FACTORES_EMISION.transporte.combustible[combustibleValor] +
                FACTORES_EMISION.transporte.vuelos[vuelosValor];

            let huellaConsumoHabitos = FACTORES_EMISION.consumoHabitos.base +
                FACTORES_EMISION.consumoHabitos.carneRoja[carneRojaValor] +
                FACTORES_EMISION.consumoHabitos.comerFuera[comerFueraValor] +
                FACTORES_EMISION.consumoHabitos.reciclaje[reciclajeValor] +
                FACTORES_EMISION.consumoHabitos.lacteos[lacteosValor];

            let huellaResiduos = FACTORES_EMISION.residuos.base +
                FACTORES_EMISION.residuos.reciclajeHogar[reciclajeHogarValor];
            
            // Esto para que ninguna categoria se muestre negativa en el grafico
            huellaHogarEnergia = Math.max(0, huellaHogarEnergia);
            huellaTransporte = Math.max(0, huellaTransporte);
            huellaConsumoHabitos = Math.max(0, huellaConsumoHabitos);
            huellaResiduos = Math.max(0, huellaResiduos);

            huellaTotal = (huellaHogarEnergia + huellaTransporte + huellaConsumoHabitos + huellaResiduos).toFixed(2);
            
            console.log("--- Huella por Categoría (toneladas de Co2) ---");
            console.log("Hogar y Energía:", huellaHogarEnergia.toFixed(2));
            console.log("Transporte:", huellaTransporte.toFixed(2));
            console.log("Consumo y Hábitos:", huellaConsumoHabitos.toFixed(2));
            console.log("Residuos:", huellaResiduos.toFixed(2));
            console.log("--- Resultado Final ---");
            console.log("Huella de Carbono Total:", huellaTotal, "toneladas de Co2 por Año");
            console.log("-----------------------");

            document.getElementById("huella-total").textContent = huellaTotal;
            document.getElementById("resultado").classList.remove("hidden");

            // Crear el gráfico circular
            const ctx = document.getElementById('huellaChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Hogar y Energía', 'Transporte', 'Consumo y Hábitos', 'Residuos'],
                    datasets: [{
                        data: [
                            huellaHogarEnergia,
                            huellaTransporte,
                            huellaConsumoHabitos,
                            huellaResiduos
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)', // Rojo
                            'rgba(54, 162, 235, 0.8)', // Azul
                            'rgba(255, 206, 86, 0.8)', // Amarillo
                            'rgba(75, 192, 192, 0.8)'  // Verde azulado
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Permite que el tamaño sea controlado por el contenedor
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 10 
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        const value = parseFloat(context.parsed.toFixed(2));
                                        // Esto hace que huellaTotal sea un número para el cálculo del porcentaje
                                        const total = parseFloat(huellaTotal);
                                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                        label += value + ' tCO2e (' + percentage + '%)';
                                    }
                                    return label;
                                }
                            },
                            bodyFont: {
                                size: 10 // Tamaño de fuente para el tooltip
                            }
                        }
                    }
                }
            });
        });

        // Lógica para reiniciar el formulario
        document.getElementById("boton-reiniciar").addEventListener("click", () => {
            document.getElementById("electricidad").value = "0-100 kWh";
            document.getElementById("energiasRenovables").value = "No";
            document.getElementById("tipoVivienda").value = "Apartamento o piso";
            document.getElementById("fuenteCalefaccion").value = "Gas natural";
            document.getElementById("tipoVehiculo").value = "no tengo";
            document.getElementById("kmRecorridos").value = "0-50 km";
            document.getElementById("combustible").value = "No tengo vehículo personal";
            document.getElementById("vuelos").value = "Ninguno";
            document.getElementById("carneRoja").value = "una vez al mes";
            document.getElementById("comerFuera").value = "0-1 vez";
            document.getElementById("reciclaje").value = "siempre";
            document.getElementById("lacteos").value = "Rara vez";
            document.getElementById("reciclajeHogar").value = "Siempre";

            document.getElementById("huella-total").textContent = "0.00";
            document.getElementById("resultado").classList.add("hidden");

            // Logica para borrar el grafico para evitar duplicados
            if (myChart) {
                myChart.destroy();
            }
        });

        // Lógica para volver al estado inicial
        document.getElementById("boton-volver").addEventListener("click", () => {
            articulo.innerHTML = contenidoOriginal;
            asignarEventoCalcular();
        });
    }

    // Esto es para que reconozca cuando presiones el boton "calcular mi huella"
    function asignarEventoCalcular() {
        const botonCalcularHuella = document.getElementById("btnCalcularHuella");
        if (botonCalcularHuella) {
            botonCalcularHuella.addEventListener("click", crearCalculadora);
        }
    }

    
    const btnSolicitaInformacion = document.getElementById('btnSolicitaInformacion');
    const consejosModal = document.getElementById('consejosModal');
    const btnSi = document.getElementById('btnSi');
    const btnNo = document.getElementById('btnNo');

    // Función para mostrar el modal
    function mostrarConsejosModal() {
        if (consejosModal) {
            consejosModal.classList.remove('hidden');
            consejosModal.classList.add('flex');
        }
    }

    // Función para ocultar el modal
    function ocultarConsejosModal() {
        if (consejosModal) {
            consejosModal.classList.add('hidden');
            consejosModal.classList.remove('flex');
        }
    }

    // Event listener para el botón "Solicita información"
    if (btnSolicitaInformacion) {
        btnSolicitaInformacion.addEventListener('click', mostrarConsejosModal);
    }

    // Event listeners para los botones "Sí" y "No" dentro del modal
    if (btnSi) {
        btnSi.addEventListener('click', () => {
            alert('¡Gracias por tu valoración! Nos alegra que te haya sido útil.');
            ocultarConsejosModal();
        });
    }

    if (btnNo) {
        btnNo.addEventListener('click', () => {
            alert('¡Lamentamos que no te haya sido útil! Trabajaremos para mejorar.');
            ocultarConsejosModal();
        });
    }
    
    // Llamada inicial para asignar el evento al botón original al cargar la página
    asignarEventoCalcular();
});

