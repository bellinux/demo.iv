// Grupo 29 - Matías Acuña, Gaspar Magna, Pablo Rabelo; InfoVis 2024-II
// Video originale: https://youtu.be/y31zW-MjGlM
// Este código se reescribió desde cero porque la implementación original utilizaba React.

async function readDataAndPlot() {
  try {
    const response = await fetch("cars.csv");
    const text = await response.text();
    const data = text.split("\n").map((row) => {
      let result = [];
      let currentCell = "";
      let insideQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"' && (i === 0 || row[i - 1] !== "\\")) {
          insideQuotes = !insideQuotes;
          continue;
        }

        if (char === "," && !insideQuotes) {
          result.push(currentCell);
          currentCell = "";
        } else {
          currentCell += char;
        }
      }
      result.push(currentCell);

      return result.map((cell) => cell.replace(/^"|"$/g, ""));
    });

    plotlyStart(data);
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

function plotlyStart(data) {
  const fechas = data.slice(1).map((row) => row[1]); // Fecha (x)
  const velocidades = data.slice(1).map((row) => parseFloat(row[5])); // Velocidad (y)
  const col = data.slice(1).map((row) => row[8]); // Color Puntos (y)
  console.log(col);

  const trace = {
    x: fechas,
    y: velocidades,
    mode: "lines+markers",
    type: "scatter",
    name: "Velocidad de autos",
    line: { color: "gray", width: 1 },
    marker: { color: col, size: 8 },
    hoverinfo: "none",
  };

  // Layout del grafico
  const layout = {
    xaxis: {
      showgrid: false,
      tickvals: [1900, 1920, 1940, 1960, 1980, 2000, 2020],
    },
    yaxis: {
      range: [0, 500],
      dtick: 100,
      tickvals: [100, 200, 300, 400, 500], // Excluir valor 0
      ticktext: ["100 km/h", "200 km/h", "300 km/h", "400 km/h", "500 km/h"],
    },
    showlegend: false,
    margin: { l: 80, r: 0, t: 0, b: 60 },

    annotations: [
      {
        x: 1902,
        y: 113,
        xref: "x",
        yref: "y",
        text: "<b>Mercedes (113 km/h)</b><br>Primer auto en superar los 100 km/h.",
        showarrow: true,
        arrowhead: 0,
        arrowcolor: "#FF0000",
        ax: 40,
        ay: 40,
        xanchor: "left",
        yanchor: "middle",
        font: {
          size: 11,
          color: "#000000",
        },
      },
      {
        x: 1949,
        y: 200.5,
        xref: "x",
        yref: "y",
        text: "<b>Jaguar (200.5 km/h)</b><br>Primer auto en superar los 200 km/h.",
        showarrow: true,
        arrowhead: 0,
        arrowcolor: "#FF0000",
        ax: 40,
        ay: 40,
        xanchor: "left",
        yanchor: "middle",
        font: {
          size: 11,
          color: "#000000",
        },
      },
      {
        x: 2005,
        y: 407,
        xref: "x",
        yref: "y",
        text: "<b>Bugatti (407 km/h)</b><br> Primer auto en superar los 400 km/h.",
        showarrow: true,
        arrowhead: 0,
        arrowcolor: "#FF0000",
        ax: 40,
        ay: 40,
        xanchor: "left",
        yanchor: "middle",
        font: {
          size: 11,
          color: "#000000",
        },
      },
      {
        x: 2017,
        y: 458,
        xref: "x",
        yref: "y",
        text: "<b>Koenigsegg (458 km/h)</b><br>El auto más rápido del mundo.",
        showarrow: true,
        arrowhead: 0,
        arrowcolor: "#FF0000",
        ax: 40,
        ay: 40,
        xanchor: "left",
        yanchor: "middle",
        font: {
          size: 11,
          color: "#000000",
        },
      },
      {
        id: "golden-age",
        x: 1989,
        y: 295,
        xref: "x",
        yref: "y",
        text: "<b>Epoca dorada</b><br>En menos de 6 años, 3 autos superaron los 300 km/h, <br>aumentando más de 40 km/h.",
        showarrow: true,
        arrowhead: 0,
        arrowcolor: "#FF0000",
        ax: 40,
        ay: 40,
        xanchor: "left",
        yanchor: "middle",
        font: {
          size: 11,
          color: "#000000",
        },
      },
    ],
    shapes: [
      {
        type: "rect",
        xref: "x",
        yref: "y",
        x0: 1984,
        x1: 1989,
        y0: 295,
        y1: 362,
        line: {
          color: "#FF0000",
          width: 2,
        },
      },
    ],
  };

  Plotly.newPlot("chart", [trace], layout, {displayModeBar: false});

  const chartDiv = document.getElementById("chart");
  chartDiv.on("plotly_hover", function (eventData) {
    document.getElementById("graphspeed").style.opacity = 1;
    document.getElementById("info").style.opacity = 1;
    const clicked = eventData.points[0].pointIndex + 1;
    console.log(data[clicked], clicked);
    changebg(
      "svg/" +
        data[clicked][0] +
        ".svg"
    );
    document.getElementById("title").innerHTML =
      "(" + data[clicked][1] + ") " + data[clicked][3] + " " + data[clicked][4];
    document.getElementById("txt1").innerHTML = data[clicked][6];
    document.getElementById("txt2").innerHTML = data[clicked][7];

    speedIndicator(data[clicked][5], data[clicked - 1][5]);
    Protobject.Core.send({ speedHaptic: data[clicked][5] }).to("car.html");
  });

  chartDiv.on("plotly_unhover", function (eventData) {
    document.getElementById("info").style.opacity = 0;
    document.getElementById("graphspeed").style.opacity = 0;
  });

  chartDiv.on("plotly_click", function (eventData) {
    const clicked = eventData.points[0].pointIndex + 1;

    generateTone(data[clicked][5] * 2);
    Protobject.Core.send({ speedServo: data[clicked][5] }).to("car.html");
  });
}

function changebg(url) {
  const pictureElement = document.getElementById("picture");
  pictureElement.style.backgroundImage = `url(${url})`; // Imposta lo sfondo come immagine
}

function speedIndicator(val, diff) {
  var dataspeed = [
    {
      type: "indicator",
      value: val,
      delta: { reference: diff },
      gauge: {
        axis: { visible: false, range: [0, 500] },
        bgcolor: "lightgrey",
      },
      domain: { row: 0, column: 0 },
    },
  ];

  var layoutspeed = {
    margin: { t: 0, b: 0, l: 0, r: 0 },
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    paper_bgcolor: "rgba(0, 0, 0, 0)",
    template: {
      data: {
        indicator: [
          {
            mode: "number+delta+gauge",
          },
        ],
      },
    },
  };

  Plotly.newPlot("graphspeed", dataspeed, layoutspeed, {displayModeBar: false});
}

function generateTone(highSpeed) {
  const osc = new Tone.Oscillator({
    frequency: 30,
    type: "square",
  }).toDestination();
  osc.start();
  osc.frequency.linearRampToValueAtTime(highSpeed, "+3"); // "+5" indica 5 secondi nel futuro

  Tone.Transport.scheduleOnce(() => {
    osc.stop();
  }, "+4");

  Tone.Transport.start();
}

readDataAndPlot();
