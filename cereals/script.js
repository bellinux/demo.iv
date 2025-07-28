const chart = document.getElementById("myDiv");
const newDiv = document.getElementById("newDiv");
const sugarDiv = document.getElementById("sugarBar");

newDiv.onclick = function () {
  newDiv.style.display = "none";
  chart.style.display = "block";
  sugarDiv.style.display = "none";
  document.getElementById("cerealname").style.display="none";
};

let counter = 0;

Protobject.Core.onReceived((data) => {
  if ("mov" in data) {
    
    
    
    if (data.mov > 1) {
      console.log("Mov: ", data.mov);
     
        counter=parseInt(counter+data.mov);
        azucarGraph(counter);
     
    } 
  }
  
  if ("chocapic" in data) {
     
    
    if (data.chocapic==true) {
      counter=0;
       azucarGraph(counter);
      fetchDataOf("Chocapic");
    } else {
      newDiv.click();
    }
    
    
  }
  
    if ("colacao" in data) {
     
    
    if (data.colacao==true) {
      counter=0;
       azucarGraph(counter);
      fetchDataOf("Cola Cao");
    } else {
      newDiv.click();
    }
    
    
  }
  
});

async function showGeneralGraph() {
  const response = await fetch("data/cereales.csv");
  const data = await response.text();

  const rows = data.split("\n").slice(1);

  const colors = ["#999", "#999", "#F63", "#36F", "#999"];

  const traces = [];
  const annotations = [];

  rows.forEach((row, index) => {
    const cols = row.split(";");
    const brand = cols[0];
    const year1 = parseFloat(cols[1]);
    const year2 = parseFloat(cols[2]);
    //const year3 = parseFloat(cols[3]);
    const year4 = parseFloat(cols[4]);

    if (!isNaN(year1) && !isNaN(year2) && !isNaN(year4) && brand) {
      traces.push({
        x: ["2010", "2015", "2024"],
        y: [year1, year2, year4],
        name: brand,
        type: "scatter",
        text: [
          ((year1 / 30) * 100).toFixed(0) + "%",
          ((year2 / 30) * 100).toFixed(0) + "%",
          ((year4 / 30) * 100).toFixed(0) + "%",
        ],
        textposition: ["left", "top", "right"],
        mode: "lines+markers+text",
        line: {
          shape: "linear",
          color: colors[index % colors.length],
          width: 3,
        },
        marker: { size: 8, symbol: ["circle", "circle", "circle"] },
        hovertemplate: "%{data.name}<extra></extra>",
      });

      annotations.push({
        x: "2010" - 0.9,
        y: year1 + 0.04,
        xref: "x",
        yref: "y",
        text: `<b>${brand}</b>`,
        showarrow: false,
        font: { color: colors[index % colors.length], size: 14 },
        xanchor: "right",
      });
    }
  });

  const layout = {
    title: "% de Azúcares en Cereales",
    xaxis: {
      tickvals: ["2010", "2012", "2015", "2016", "2024"],
      tickmode: "array",
      showgrid: false,
    },
    yaxis: {
      range: [0, 15],
      showticklabels: false,
      showgrid: false,
    },
    hoverdistance: 1000,
    hovermode: "closest",
    showlegend: false,
    margin: { l: 70, r: 100, t: 130 },
    annotations: [
      ...annotations,
      {
        x: "2016",
        y: 15,
        xref: "x",
        yref: "y",
        text: "Implementación sellos",
        showarrow: false,
        font: { color: "black", size: 13 },
        xanchor: "center",
        yanchor: "bottom",
      },
      {
        x: "2012",
        y: 15,
        xref: "x",
        yref: "y",
        text: "Aprobación ley",
        showarrow: false,
        font: { color: "black", size: 13 },
        xanchor: "center",
        yanchor: "bottom",
      },
      {
        x: "2024",
        y: 2,
        xref: "x",
        yref: "y",
        text: "El azúcar en <b>Chocapic</b> y <b>Trix</b>  <br> bajó notablemente tras la<br> introducción de los sellos.",
        showarrow: false,
        font: { color: "black", size: 15 },
        xanchor: "center",
        yanchor: "bottom",
      },
    ],
    shapes: [
      {
        type: "line",
        x0: "2016",
        y0: 0,
        x1: "2016",
        y1: 50,
        xref: "x",
        yref: "y",
        line: {
          color: "black",
          width: 2,
          dash: "dot",
        },
        layer: "below",
      },
      {
        type: "line",
        x0: "2012",
        y0: 0,
        x1: "2012",
        y1: 50,
        xref: "x",
        yref: "y",
        line: {
          color: "black",
          width: 2,
          dash: "dot",
        },
        layer: "below",
      },
    ],
  };

  Plotly.newPlot("myDiv", traces, layout);

  // Aggiungi un evento click
  chart.on("plotly_click", function (event) {
    //const point = event.points[0];
    console.log(event.points[0].data.name);

    let cereal = event.points[0].data.name;

    fetchDataOf(cereal);
  });

  // Aggiungi un evento click
  chart.on("plotly_hover", function (event) {
    //const point = event.points[0];
    console.log(parseInt(event.points[0].text));
    let valSound = parseInt(event.points[0].text);

    startDynamicPlayback(valSound);
  });

  chart.on("plotly_unhover", function (event) {
    stopDynamicPlayback();
  });
}

showGeneralGraph();

async function fetchDataOf(cereal) {
  const response = await fetch(`data/${cereal.replace(/\s/g, "")}.csv`);
  const data = await response.text();
  const rows = data.split("\n").slice(1, 8);
  
   document.getElementById("cerealname").style.display="block";

  document.getElementById("cerealname").innerHTML=cereal;
  //console.log(rows);

  const colors = ["#999", "#69b"];
  const traces = [];
  const annotations = [];
  let line = 0;
  rows.forEach((row, index) => {
    const cols = row.split(",");
    const brand = cols[0];
    const year1 = parseFloat(cols[1]);
    const year2 = parseFloat(cols[2]);
    const year4 = parseFloat(cols[4]);

    if (!isNaN(year1) && !isNaN(year2) && !isNaN(year4) && brand) {
      traces.push({
        x: ["2010", "2015", "2024"],
        y: [year1, year2, year4],
        name: brand,
        type: "scatter",
        text: [
          year1.toFixed(2) + "g",
          year2.toFixed(2) + "g",
          year4.toFixed(2) + "g",
        ],
        mode: "lines+markers+text",
        line: {
          shape: "linear",
          color: colors[index % colors.length],
          width: 3,
        },
        marker: { size: 8, symbol: ["circle", "circle", "circle"] },
        hovertemplate: "<extra></extra>",
      });
    }
  });

  //console.log(traces);

  const tracesfp = combineFatsAndProteins(traces);

 // console.log(tracesfp);

  tracesfp.forEach((row, index) => {
    line++;
    //console.log(line);
    let tPos = "";
    if (line % 2 == 1) {
      row.textposition = ["bottom", "bottom", "bottom"];
    } else {
      row.textposition = ["top", "top", "top"];
    }

    annotations.push({
      x: "2010" - 0.9,
      y: row.y[0],
      xref: "x",
      yref: "y",
      text: `<b>${row.name}</b>`,
      showarrow: false,
      font: { color: row.line.color, size: 13 },
      xanchor: "right",
    });
  });

  console.log(tracesfp);

  const layout = {
    title: `Datos Nutricionales`,
    xaxis: {
      tickvals: ["2010", "2012", "2015", "2016", "2024"],
      tickmode: "array",
      showgrid: false,
    },
    yaxis: { range: [0, 26], showticklabels: false, showgrid: false },
    margin: { l: 70, r: 100, t: 130 },
    showlegend: false,
    annotations: [
      ...annotations,
      {
        x: "2016",
        y: 26,
        xref: "x",
        yref: "y",
        text: "Implementación sellos",
        showarrow: false,
        font: { color: "black", size: 13 },
        xanchor: "center",
        yanchor: "bottom",
      },
      {
        x: "2012",
        y: 26,
        xref: "x",
        yref: "y",
        text: "Aprobación ley",
        showarrow: false,
        font: { color: "black", size: 13 },
        xanchor: "center",
        yanchor: "bottom",
      },
    ],
    shapes: [
      {
        type: "line",
        x0: "2016",
        y0: 0,
        x1: "2016",
        y1: 50,
        xref: "x",
        yref: "y",
        line: { color: "black", width: 2, dash: "dot" },
        layer: "below",
      },
      {
        type: "line",
        x0: "2012",
        y0: 0,
        x1: "2012",
        y1: 50,
        xref: "x",
        yref: "y",
        line: { color: "black", width: 2, dash: "dot" },
        layer: "below",
      },
    ],
  };
  Plotly.newPlot("newDiv", tracesfp, layout);

  newDiv.style.display = "block";
  chart.style.display = "none";

  sugarDiv.style.display = "block";

  // Aggiungi un evento click
  newDiv.on("plotly_hover", function (event) {
    //const point = event.points[0];
    console.log(parseInt(event.points[0].text));
    let valSound = parseInt(event.points[0].text);

    startDynamicPlayback(valSound);
  });

  newDiv.on("plotly_unhover", function (event) {
    stopDynamicPlayback();
  });
}

function combineFatsAndProteins(data) {
  // Trova i dati di Grasas e Proteínas
  const grasas = data.find((item) => item.name === "Grasas");
  const proteinas = data.find((item) => item.name === "Proteínas");

  // Verifica che entrambi esistano
  if (!grasas || !proteinas) {
    throw new Error("Dati per 'Grasas' o 'Proteínas' non trovati.");
  }

  // Combina i valori di y (somma punto a punto)
  const combinedY = grasas.y.map((value, index) => value + proteinas.y[index]);

  // Crea una nuova traccia
  const combinedTrace = {
    x: grasas.x, // Supponiamo che gli anni siano gli stessi
    y: combinedY,
    name: "Grasas + Proteínas",
    type: "scatter",
    text: combinedY.map((value) => `${value.toFixed(2)}g`), // Testo con il valore sommato
    textposition: grasas.textposition, // Riutilizzo della posizione del testo
    mode: "lines+markers+text",
    line: {
      shape: "linear",
      color: "#999", // Colore arbitrario per il nuovo grafico
      width: 3,
    },
    marker: {
      size: 8,
      symbol: ["circle", "circle", "circle"],
    },
    hovertemplate: "<extra></extra>",
  };

  // Rimuovi Grasas e Proteínas dai dati originali e aggiungi la nuova traccia
  const updatedData = data.filter(
    (item) => item.name !== "Grasas" && item.name !== "Proteínas"
  );
  updatedData.push(combinedTrace);

  // Ritorna i dati aggiornati
  return updatedData;
}

function createRandomPlayer(baseUrl) {
  // Array per memorizzare i player attivi
  const activePlayers = [];

  // Funzione per riprodurre una nota casuale
  function playRandomSound() {
    // Scegli un file MP3 casuale tra 1 e 10
    const randomIndex = Math.floor(Math.random() * 10) + 1;
    const audioUrl = `${baseUrl}/${randomIndex}.mp3`;

    // Crea un nuovo player per il file selezionato
    const player = new Tone.Player({
      url: audioUrl,
      autostart: true,
      fadeOut: 1.0, // Sfuma quando si ferma
    }).toDestination();

    // Aggiungi il player all'elenco dei player attivi
    activePlayers.push(player);

    // Rimuovi il player dall'elenco una volta terminata la riproduzione
    player.onstop = () => {
      const index = activePlayers.indexOf(player);
      if (index > -1) {
        activePlayers.splice(index, 1);
      }
    };
  }

  // Restituisci la funzione per riprodurre suoni casuali
  return playRandomSound;
}

// Esempio di utilizzo
const baseUrl =
  "https://cdn.glitch.global/0ebfa722-bb51-4fcf-b245-c253b98775d3"; // Cambia con il tuo URL base
const playSound = createRandomPlayer(baseUrl);

let timeoutId = null; // Per salvare l'ID del timeout
let running = false; // Stato di riproduzione

function calculateInterval(value) {
  // Calcola l'intervallo proporzionale tra 900ms e 15ms
  const minVal = 2,
    maxVal = 42;
  const minInterval = 1200,
    maxInterval = 30;
  return (
    minInterval -
    ((value - minVal) / (maxVal - minVal)) * (minInterval - maxInterval)
  );
}

function startDynamicPlayback(speed) {
  if (running) return; // Evita duplicati
  running = true;

  function loop() {
    if (!running) return; // Ferma se necessario
    playSound();
    const interval = calculateInterval(speed);
    timeoutId = setTimeout(loop, interval);
  }

  loop();
}

function stopDynamicPlayback() {
  running = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function azucarGraph(val) {
  let col = "#69b";
  if (val > 80) col = "#e96";

  if (val > 130) col = "#e74";

  let rangeSup = 99;

  if (val > 90) rangeSup = val + 20;

  if (rangeSup > 400) rangeSup = 400;

  var data = [
    {
      x: [""],
      y: [val],
      type: "bar",
      marker: {
        color: col,
      },
    },
  ];

  var layout = {
    showlegend: false,
    xaxis: {},
    yaxis: {
      range: [0, rangeSup],
      showgrid: false,
      showline: true,
      ticksuffix: "g",
    },

    shapes: [
      {
        type: "line",
        x0: 0, // Inizio della linea orizzontale sull'asse X
        x1: 1, // Fine della linea orizzontale (in unità normalizzate)
        xref: "paper", // Usa l'intero spazio del grafico
        y0: 80, // Posizione iniziale sull'asse Y
        y1: 80, // Posizione finale (linea orizzontale)
        line: {
          color: "111", // Colore della linea
          width: 2, // Spessore della linea
          dash: "dash", // Tipo di linea: solid, dash, dot, ecc.
        },
      },
    ],
    annotations: [
      {
        x: 0.5, // Posizione orizzontale del testo (in unità normalizzate)
        y: 86, // Posizione verticale del testo
        xref: "paper", // Riferimento alla larghezza del grafico
        yref: "y", // Riferimento ai valori di Y
        text: "Límite de azúcar recomendado", // Testo dell'annotazione
        showarrow: false, // Nessuna freccia
        font: {
          size: 12,
          color: "#111",
        },
        align: "center", // Allineamento del testo
      },
      {
        x: 0, // Posizione orizzontale (coincide con la barra)
        y: 20, // Posizione verticale alla base della barra

        text: val + "g", // Il testo da mostrare
        showarrow: false, // Nessuna freccia
        font: {
          size: 40,
          color: "black",
        },
        align: "center",
        valign: "bottom", // Posiziona il testo sotto la barra
        xref: "x", // Riferimento all'asse X
        yref: "y", // Riferimento all'asse Y
      },
    ],
  };

  Plotly.newPlot("sugarBar", data, layout);
}

azucarGraph(0)