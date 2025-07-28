// Obtener la lista de países y contar las veces que han sido anfitriones
const countryCounts = {};

// Recorrer los datos del mundial y contar cuántas veces cada país ha sido sede
Object.keys(worldCupData).forEach((year) => {
  worldCupData[year].forEach((country) => {
    if (countryCounts[country]) {
      countryCounts[country] += 1;
    } else {
      countryCounts[country] = 1;
    }
  });
});

// Extraer los países únicos
const countries = Array.from(new Set(Object.values(worldCupData).flat()));
// Extraer el conteo correspondiente a cada país
const counts = countries.map((country) => countryCounts[country]);

// Configuración del mapa
const data = [
  {
    type: "choropleth",
    locationmode: "country names",
    locations: countries,
    z: counts, // Usamos el conteo de veces como valor para el color
    text: countries,
    colorscale: [
      [0, "rgba(255, 255, 255, 0.1)"], // Color para 0 veces (no sede)
      [0.33, "#f7e55e"], // Color para 1 vez
      [0.66, "#ffae42"], // Color para 2 veces
      [1, "#6a3d9a"], // Color para 3 veces o más
    ],
    zmin: 0,
    zmax: 3,
    autocolorscale: false, // Desactivamos el autoescalado de colores
    showscale: false, // Mostrar la escala de colores
    hoverinfo: "none", // Mostrar país y cantidad en hover
    hover: true,
    colorbar: {
      titleside: "right",
      ticksuffix: " veces",
      tickmode: "array",
      tickvals: [0, 1, 2, 3],
      ticktext: ["0", "1", "2", "3"],
      len: 0.5, // Longitud de la barra de colores
    },
  },
];

// Opciones del layout del mapa
const layout = {
  title: {
    text: "Países <b>Anfitriones</b> de los <b>Mundiales de Fútbol</b>",
    font: {
      family: "Helvetica, sans-serif",
      color: "rgb(0, 0, 0)",
      size: 24,
    },
  },
  geo: {
    projection: {
      type: "robinson",
    },
    showcoastlines: false,
    showland: true,
    landcolor: "#e6e6e6",
    border: false,
    showcountries: false,
    lataxis: {
      range: [-60, 90],
      showgrid: false,
    },
    lonaxis: {
      showgrid: false,
    },
    bgcolor: "rgba(0,0,0,0)",
    showframe: false,
  },
  dragmode: false,
  annotations: [
    {
      x: 0.22, // Posición relativa (25% en el eje X)
      y: 0.55, // Posición relativa (55% en el eje Y)
      xref: "paper",
      yref: "paper",
      text: '<span>México será el primer país en ser anfitrión de <br><em style="color:blue;">3 Mundiales de Fútbol</em> en el <em style="color:blue;">2026</em></span>', // Usamos span y em para estilos de color
      showarrow: true,
      arrowhead: 10,
      ax: 0.1,
      ay: 0.48,
      axref: "paper", // Usamos píxeles para referencia
      ayref: "paper", // Usamos píxeles para referencia
      font: {
        family: "Helvetica, sans-serif",
        size: 16, // Usamos HTML para controlar el tamaño del texto
        color: "#000",
      },
      arrowcolor: "black", // Cambia el color de la flecha
      arrowsize: 0.4, // Tamaño de la flecha (ajusta según el tamaño de la ventana)
    },
    {
      x: 0.23, // Ajusta la posición relativa para Canadá
      y: 0.75,
      xref: "paper",
      yref: "paper",
      text: '<span>Canadá será anfitrión de su <br><em style="color:blue;">primer Mundial de Fútbol</em> en el <em style="color:blue;">2026</em></span>', // Cambio de color con etiquetas HTML
      showarrow: true,
      arrowhead: 10,
      ax: 0.1, // Flecha relativa en porcentaje
      ay: 0.95, // Posición de la flecha
      axref: "paper", // Usamos píxeles para referencia
      ayref: "paper", // Usamos píxeles para referencia
      font: {
        family: "Helvetica, sans-serif",
        size: 16, // Usamos HTML para controlar el tamaño del texto
        color: "#000",
      },
      arrowcolor: "black", // Cambia el color de la flecha
      arrowsize: 0.4, // Tamaño de la flecha (ajusta según el tamaño de la ventana)
    },
    {
      x: -0.02, // Ajusta la posición relativa para el tercer texto
      y: 0.7,
      xref: "paper",
      yref: "paper",
      text: '<span>El <em style="color:#000000;">Mundial de 2026</em> será el<br> primero en la historia en ser<br> <em style="color:#000000;">organizado por tres países:</em><br> <em style="color:#000000;">Canadá, México y Estados Unidos</em>.</span>', // Responsivo con colores HTML
      showarrow: false,
      font: {
        family: "Helvetica, sans-serif",
        size: 16, // Usamos HTML para controlar el tamaño del texto
        color: "#000",
      },
    },
  ],
};

// Configuración para desactivar el zoom y el arrastre, pero mantener hover
const config = {
  scrollZoom: true, // Desactivar el zoom por scroll
  displayModeBar: false, // Ocultar la barra de herramientas de Plotly
  doubleClick: true, // Desactivar el doble clic para zoom
  hover: true,
  dragmode: false,
  responsive: true,
};

// Renderizar el mapa
Plotly.newPlot("map", data, layout, config);

// Seleccionar los elementos HTML donde se mostrará la información
const countryName = document.getElementById("country-name");
const yearHosted = document.getElementById("year-hosted");

// Evento para cambiar la información al pasar el mouse sobre el país
document.getElementById("map").on("plotly_hover", function (eventData) {
  const hoveredCountry = eventData.points[0].location;
  hoverCountry(hoveredCountry);
});

function hoverCountry(hoveredCountry) {
  const years = Object.keys(worldCupData).filter((year) =>
    worldCupData[year].includes(hoveredCountry)
  );

  // Traducir el nombre del país al español
  const translatedCountry =
    countryTranslation[hoveredCountry] || hoveredCountry;

  // Actualizar la información mostrada en la zona izquierda
  countryName.textContent = translatedCountry;
  yearHosted.textContent = `Año(s) del mundial: ${years.join(", ")}`;

  // Llamar a la función para actualizar la gráfica de asistentes
  updateAttendanceChart(hoveredCountry);

  // Ajustar volumen y reproducir audio si el país tiene datos de asistentes
  if (hoveredCountry == "Canada") {
    No_encontrado.volumen = 0.5;
    No_encontrado.play();
  }

  if (asistentesPorPais[hoveredCountry]) {
    if (asistentesPorPais[hoveredCountry] == asistenciaMaxima) {
      cheerMaxAudio.volumen = 1;
      cheerMaxAudio.play();
    } else {
      const volumen = calcularVolumen(
        asistentesPorPais[hoveredCountry],
        asistenciaMaxima
      );

      cheerAudio.volume = volumen;
      cheerAudio.play();
    }
  }
}

// Evento para restablecer la información cuando no se está sobre un país
document.getElementById("map").on("plotly_unhover", function () {
  unhoverCountry();
});

function unhoverCountry() {
  countryName.textContent = "";
  yearHosted.textContent = "";

  // Limpiar la gráfica de asistentes
  Plotly.purge("attendance-chart");
  cheerAudio.pause();
  cheerAudio.currentTime = 0;
  cheerMaxAudio.pause();
  cheerMaxAudio.currentTime = 0;
  No_encontrado.pause();
  No_encontrado.currentTime = 0;
}

// Función para actualizar la gráfica de asistentes
// Función para actualizar la gráfica de asistentes
function updateAttendanceChart(country) {
  // Filtrar todos los años, excluyendo 2026 si no tiene datos
  const allYears = Object.keys(assistanceFormatted).filter(
    (year) => year !== "2026" || assistanceFormatted["2026"].Attendance !== null
  );
  const allAttendance = allYears.map(
    (year) => assistanceFormatted[year].Attendance
  );

  // Identificar los años en los que el país seleccionado fue anfitrión
  const hostYears = allYears.map((year) =>
    assistanceFormatted[year].Host.includes(country)
      ? assistanceFormatted[year].Attendance
      : null
  );

  // Crear el trazado para todos los años (barras en gris)
  const traceAll = {
    x: allYears,
    y: allAttendance,
    type: "bar",
    marker: { color: "#d3d3d3" }, // Color gris para los años sin anfitrión seleccionado
    name: "Otros años",
  };

  // Crear el trazado para los años en los que fue anfitrión el país (barras resaltadas)
  const traceHost = {
    x: allYears,
    y: hostYears,
    type: "bar",
    marker: { color: "#479" }, // Color de resaltado
    name: `Años anfitrión: ${country}`,
  };

  const layout = {
    title: {
      text: `<b>Asistencia a los Mundiales de Fútbol</b>`,
      font: { family: "Helvetica, sans-serif", size: 14 }, // Tamaño del título más pequeño
    },
    xaxis: { title: "Año", fixedrange: true },
    yaxis: { title: "Asistentes", fixedrange: true },
    barmode: "overlay",
    margin: { t: 50, r: 20, l: 50, b: 50 }, // Márgenes para ajustarse al contenedor
    height: document.getElementById("attendance-chart").offsetHeight,
    width: document.getElementById("attendance-chart").offsetWidth,
    showlegend: false,
  };

  Plotly.newPlot("attendance-chart", [traceAll, traceHost], layout, {
    responsive: true,
  });
}

// Cargar el audio de hinchada
const cheerAudio = new Audio(
  "https://cdn.glitch.global/daa61ffb-a915-49a1-95a6-f9f5003bb14a/cheer.mp3"
);
const cheerMaxAudio = new Audio(
  "https://cdn.glitch.global/daa61ffb-a915-49a1-95a6-f9f5003bb14a/max_cheer.mp3"
);
const No_encontrado = new Audio(
  "https://cdn.glitch.global/daa61ffb-a915-49a1-95a6-f9f5003bb14a/no_hay_datos.m4a"
);

// Función para calcular el volumen basado en el número de asistentes
function calcularVolumen(asistencia, asistenciaMaxima) {
  return 0.01 + 0.3 * (asistencia / asistenciaMaxima);
}

const asistentesPorPais = {
  Uruguay: 590549,
  Italy: 2516215,
  France: 2903477,
  Brazil: 3429873,
  Switzerland: 768607,
  Sweden: 819810,
  Chile: 893172,
  "United Kingdom": 1563135,
  Mexico: 2394031,
  Germany: 3352605,
  Argentina: 1545791,
  Spain: 2109723,
  USA: 3587538,
  "South Korea": 2705337,
  Japan: 2705337,
  "South Africa": 3178856,
  Russia: 3031768,
  Qatar: 3404252,
};

const asistenciaMaxima = Math.max(...Object.values(asistentesPorPais));

Protobject.Core.onReceived((country) => {
  console.log(`País detectado: ${country}`);
  if (country==false) {
     unhoverCountry()
    Plotly.react('map', data, layout);
    
  } else {
     hoverCountry(country);
    
    
        // Actualiza los valores `z` para resaltar el país detectado
    const updatedCounts = countries.map((c, index) => (c === country ? counts[index] + 0.5 : counts[index]));

    // Datos actualizados para el mapa
    const updatedStaticData = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: countries,
        z: updatedCounts,
        colorscale: [
            [0, '#e6e6e6'],
            [0.33, '#f7e55e'],
            [0.66, '#ffae42'],
            [1, '#6a3d9a'],
        ],
        zmin: 0,
        zmax: 3.5, // Extendemos el rango para incluir el resaltado.
        autocolorscale: false,
        showscale: false,
        hoverinfo: 'location+z',
        marker: {
            line: {
                color: countries.map(c => (c === country ? '#FF0000' : '#FFFFFF')), // Borde rojo para el país detectado.
                width: countries.map(c => (c === country ? 3 : 1)), // Borde más ancho para el país detectado.
            },
        },
    }];



    // Actualiza el mapa con los datos modificados
    Plotly.react('map', updatedStaticData, layout);
    
    
    
    
    
  }
 
});
