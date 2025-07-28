//Proyecto desarrollado por el Grupo 14 (InfoVis 2024-II). 
//Por solicitud del grupo, el proyecto se presenta de forma anónima y 
//el video original no está disponible por motivos de privacidad.

//Dirección del viento: Idea del Grupo 11 (InfoVis 2024-II) compuesto por 
//Nicolás Acevedo, Alan Saavedra y Pablo Utrera. 
//Se revisó implementación de la direcion del viento en Plotly.
//Video original disponible en: https://youtu.be/RkzHfKK-eow

const data = [
  { FECHA: "240107", velocidad: "43", angle: "15" },
  { FECHA: "240109", velocidad: "32", angle: "72" },
  { FECHA: "240116", velocidad: "29", angle: "188" },
  { FECHA: "240125", velocidad: "27", angle: "136" },
  { FECHA: "240203", velocidad: "34", angle: "212" },
  { FECHA: "240211", velocidad: "33", angle: "54" },
  { FECHA: "240216", velocidad: "30", angle: "290" },
  { FECHA: "240223", velocidad: "24", angle: "89" },
  { FECHA: "240303", velocidad: "23", angle: "178" },
  { FECHA: "240308", velocidad: "34", angle: "67" },
  { FECHA: "240313", velocidad: "31", angle: "150" },
  { FECHA: "240319", velocidad: "29", angle: "10" },
  { FECHA: "240325", velocidad: "26", angle: "330" },
  { FECHA: "240404", velocidad: "26", angle: "256" },
  { FECHA: "240414", velocidad: "23", angle: "5" },
  { FECHA: "240416", velocidad: "26", angle: "314" },
  { FECHA: "240426", velocidad: "30", angle: "220" },
  { FECHA: "240501", velocidad: "32", angle: "95" },
  { FECHA: "240507", velocidad: "34", angle: "78" },
  { FECHA: "240513", velocidad: "22", angle: "199" },
  { FECHA: "240522", velocidad: "25", angle: "58" },
  { FECHA: "240530", velocidad: "18", angle: "167" },
  { FECHA: "240608", velocidad: "42", angle: "36" },
  { FECHA: "240613", velocidad: "47", angle: "311" },
  { FECHA: "240618", velocidad: "32", angle: "254" },
  { FECHA: "240627", velocidad: "20", angle: "129" },
  { FECHA: "240703", velocidad: "20", angle: "72" },
  { FECHA: "240710", velocidad: "29", angle: "214" },
  { FECHA: "240721", velocidad: "24", angle: "87" },
  { FECHA: "240725", velocidad: "19", angle: "341" },
  { FECHA: "240802", velocidad: "46", angle: "153" },
  { FECHA: "240806", velocidad: "35", angle: "278" },
  { FECHA: "240816", velocidad: "20", angle: "199" },
  { FECHA: "240819", velocidad: "26", angle: "22" },
  { FECHA: "240826", velocidad: "24", angle: "182" },
  { FECHA: "240902", velocidad: "35", angle: "98" },
  { FECHA: "240913", velocidad: "25", angle: "160" },
  { FECHA: "240919", velocidad: "26", angle: "270" },
  { FECHA: "240924", velocidad: "29", angle: "119" },
  { FECHA: "241001", velocidad: "35", angle: "350" },
  { FECHA: "241009", velocidad: "24", angle: "42" },
];

const highAudio = document.getElementById("highWind");
const mediumAudio = document.getElementById("mediumWind");
const lowAudio = document.getElementById("lowWind");
const conteDegradado = document.querySelector(".conte-degradado");
const directionGraph = document.querySelector("#direction");

const dates = data.map((item) => {
  const year = parseInt(item.FECHA.slice(0, 2)) + 2000;
  const month = parseInt(item.FECHA.slice(2, 4)) - 1;
  const day = parseInt(item.FECHA.slice(4, 6));
  return new Date(year, month, day);
});

const velocities = data.map((item) => parseFloat(item.velocidad));

// Función para formatear fechas en español
const mesesEspañol = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
function formatearFechaEnEspañol(date) {
  const day = date.getDate();
  const month = mesesEspañol[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

const datesInSpanish = dates.map(formatearFechaEnEspañol);

const trace = {
  x: dates,
  y: velocities,
  type: "scatter",
  mode: "lines",
  name: "Velocidad",
  line: { color: "rgba(0, 0, 0, 1)", width: 2 },
  marker: { color: "rgba(0, 0, 0, 1)", size: 8, symbol: "circle" },
  text: datesInSpanish.map(
    (date, index) => `${date}<br>Velocidad: ${velocities[index]} Km/h`
  ),
  hoverinfo: "text",
};

const layout = {
  hovermode: "closest",
  xaxis: {
    type: "date",
    tickformat: "%B",
    dtick: "M1", // Show tick every month
    tickangle: -45,
    ticktext: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    tickvals: dates.filter(
      (d, i, arr) => i === 0 || d.getMonth() !== arr[i - 1].getMonth()
    ),
    showgrid: false, // Remove background grid for x-axis
    range: [
      new Date(dates[0].getTime()) - 1 * 24 * 60 * 60 * 1000,
      new Date(dates[dates.length - 1].getTime() + 1 * 24 * 60 * 60 * 1000), // 1 semana después de la última fecha
    ],
  },
  yaxis: {
    title: "Velocidad (Km/h)",
    range: [0, 50], // Set y-axis range from 0 to 50
    showgrid: false, // Remove background grid for y-axis
  },
  shapes: [
    {
      type: "line",
      x0: dates[0],
      y0: 0,
      x1: dates[0],
      y1: 50,
      line: {
        color: "rgba(0, 0, 0, 1)",
        width: 1,
      },
    },
    {
      type: "line",
      x0: new Date(2024, 5, 13),
      y0: 0,
      x1: new Date(2024, 5, 13),
      y1: 47.1528,
      line: {
        color: "rgba(200, 0, 0, 1)",
        width: 2,
      },
    },
    {
      type: "line",
      x0: new Date(2024, 7, 2),
      y0: 0,
      x1: new Date(2024, 7, 2),
      y1: 46.24092,
      line: {
        color: "rgba(0, 0, 200, 1)",
        width: 2,
      },
    },
  ],
  annotations: [
    {
      x: new Date(2024, 5, 13),
      y: 48.1528,
      xref: "x",
      yref: "y",
      text: '<b style="color:rgba(130, 0, 0, 0.8);">47 Km/h',
      showarrow: false,
    },
    {
      x: new Date(2024, 7, 2),
      y: 47.24092,
      xref: "x",
      yref: "y",
      text: '<b style="color:rgba(0, 0, 130, 0.8);">46 Km/h',
      showarrow: false,
    },
    {
      x: new Date(2024, 3, 16),
      y: 10,
      xref: "x",
      yref: "y",
      text: '     <b>                      Velocidad máxima del viento alcanzada en 2024</b><br><b style="color:rgba(130, 0, 0, 0.8);">El 13 de junio </b>se registraron ráfagas de viento que alcanzaron los 47 Km/h.     <br> Este evento fue parte de un sistema frontal que provocó lluvias intensas y    <br>     condiciones climáticas adversas en gran parte del centro-sur del país.',
      showarrow: false,
      font: {
        color: "black",
      },
    },
    {
      x: new Date(2024, 7, 14), // August 2, 2024
      y: 10,
      xref: "x",
      yref: "y",
      text: '                                     El <b style="color:rgba(0, 0, 130, 0.8);">2 de agosto </b>se registraron fuertes <br>                               ráfagas de viento. Esto junto a la <br>                                intensa lluvia dejaron a gran parte<br>                                  de la poblacion sin servicio de agua <br>  y electricidad.',
      showarrow: false,
      font: {
        color: "black",
      },
    },
  ],
  autosize: true,
  height: 600,
  margin: { l: 50, r: 50, b: 100, t: 20, pad: 4 },
};

const config = {
  responsive: true,
  displayModeBar: true,
  staticPlot: true,
};

Plotly.newPlot("chart", [trace], layout, {displayModeBar: false});

document.getElementById("chart").on("plotly_hover", (event) => {
  
  
  const angulo=parseInt(data[event.points[0].pointNumber].angle)
  const velocidad = event.points[0].y;
  
  setAngle(angulo);
  directionGraph.style.opacity=1;
  
  Protobject.Core.send({ wind: velocidad, angle: angulo}).to("arduino.html");
  
  

  if (velocidad > 45) {
    conteDegradado.style.background = `radial-gradient(circle at ${event.event.clientX}px ${event.event.clientY}px, transparent 0%, rgba(0, 0, 0, 0.6) 500px)`;
  }



  let lowVolume = 0;
  let mediumVolume = 0;
  let highVolume = 0;


  if (velocidad <= 25) {
    lowVolume = (velocidad - 17) / (25 - 17);
    mediumVolume = 0;
    highVolume = 0;
  }

  else if (velocidad <= 35) {
    lowVolume = 1; 
    mediumVolume = (velocidad - 25) / (35 - 25);
    highVolume = 0;
  }

  else {
    lowVolume = 1;
    mediumVolume = 1;
    highVolume = (velocidad - 35) / (47 - 35);
  }


  lowAudio.volume = lowVolume;
  mediumAudio.volume = mediumVolume;
  highAudio.volume = highVolume;

  highAudio.currentTime = 0;
  mediumAudio.currentTime = 0;
  lowAudio.currentTime = 0;
  highAudio.play();
  mediumAudio.play();
  lowAudio.play();
});



document.getElementById("chart").on("plotly_unhover", () => {
  highAudio.pause();
  mediumAudio.pause();
  lowAudio.pause();
  conteDegradado.style.pointerEvents = "none";
  conteDegradado.style.background = "none";
  Protobject.Core.send({ wind: 0, angle: 0}).to("arduino.html");
  directionGraph.style.opacity=0;
});

var dirdata = [
  {
    r: [0, 0, 0, 0, 0, 0, 0, 0],
    theta: ["Norte", "N-E", "Este", "S-E", "Sur", "S-O", "Oeste", "N-O"],
    type: "scatterpolar",
    marker: {
      symbol: "circle",
      size: [10, 10, 10, 10, 10, 10, 10, 10],
      color: ["#333", "#333", "#333", "#333", "#333", "#333", "#333", "#333"],
    },
  },
];

var dirlayout = {
  showlegend: false,
  title: "Dirección del Viento",
  polar: {
    domain: {
      x: [0, 0],
      y: [0, 1],
    },
    radialaxis: {
      tickfont: {
        size: 8,
      },
      visible: true,
      ticksuffix: "",
      angle: 98,
      tickvals: [0],
      ticklen: 1,
      ticktext: [""],
      tickcolor: "#333",
      tickwidth: 3,
      showline: true,
      linecolor: "#333",
      linewidth: 4,
    },
    angularaxis: {
      tickfont: {
        size: 14,
      },
      showgrid: false,
      rotation: 90,
      direction: "counterclockwise",
    },
  },
};

Plotly.newPlot("direction", dirdata, dirlayout, {displayModeBar: false});

function setAngle(degree) {
  Plotly.relayout("direction", {
    "polar.radialaxis.angle": degree,
  });
}
