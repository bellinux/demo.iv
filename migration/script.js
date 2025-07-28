// Global

const synth = new Tone.Synth().toDestination();
let playingAnimation = false;
let defaultZoom = true;
window.onresize = function(){ location.reload(); }

// https://birdfact.com/articles/do-seagulls-migrate

const summerText = `En verano algunas especies de gaviota<br>deciden migrar, motivadas principalmente<br>por el frio y la escasez de comida.<br>`
const autumnText = `Algunas gaviotas eligen migrar<br>al oeste de Africa, donde hay<br>comida y aguas calidas.<br>`
const winterText = `Diferentes grupos de gaviotas se<br>detienen en distintos lugares, no<br>mantienen un lugar de descanso fijo.<br>`
const springText = `Cuando llega el momento, las<br>gaviotas vuelven donde partieron.<br>`

const traces = [];
const minLon = Math.min(...data.longitude);
const maxLon = Math.max(...data.longitude);
const minLat = Math.min(...data.latitude);
const maxLat = Math.max(...data.latitude);

for (let i = 0; i < data.latitude.length - 1; i++) {
  let dat = data.month[i];
  let season = seasonColorInfo(dat);
  let hoverText = "";

  if (season.name === "verano") {
    hoverText = summerText;
  }
  else if (season.name === "otoño") {
    hoverText = autumnText;
  } else if (season.name === "invierno") {
    hoverText = winterText;
  } else if (season.name === "primavera") {
    hoverText = springText;
  }

  let lineTrace = {
    type: "scattergeo",
    lon: [data.longitude[i], data.longitude[i + 1]],
    lat: [data.latitude[i], data.latitude[i + 1]],
    mode: "lines",
    hovertemplate: hoverText + `<br>Fecha: ${data.month[i]}-${data.year[i]}`,
    line: {
      width: 4,
      color: season.color
    },
    hoverlabel: {
      font: {
        size: 20,
      }
    },
  };

  if (i == 1) {
    let offsetLon = 1.5;
    let offsetLat = -0.5;
    let textTrace = {
      type: "scattergeo",
      mode: "markers+text",
      lon: [data.longitude[i] + offsetLon],
      lat: [data.latitude[i] + offsetLat],
      text: [" Punto de partida (verano)"],
      textposition: "middle right",
      marker: {
        color: season.color,
        size: 8,
      },
      textfont: {
        size: 17
      },
      hoverinfo: "skip",
    };
    traces.push(textTrace);
  }

  if (i == 10) {
    let offsetLon = -1.5;
    let offsetLat = 0;
    let textTrace = {
      type: "scattergeo",
      mode: "markers+text",
      lon: [data.longitude[i] + offsetLon],
      lat: [data.latitude[i] + offsetLat],
      text: ["Migración al sur (otoño) "],
      textposition: "middle left",
      marker: {
        color: season.color,
        size: 8,
      },
      textfont: {
        size: 17
      },
      hoverinfo: "skip",
    };
    traces.push(textTrace);
  }

  if (i == 45) {
    let offsetLon = 1.5;
    let offsetLat = 0;
    let textTrace = {
      type: "scattergeo",
      mode: "markers+text",
      lon: [data.longitude[i] + offsetLon],
      lat: [data.latitude[i] + offsetLat],
      text: [" Sector objetivo (invierno)"],
      textposition: "middle right",
      marker: {
        color: season.color,
        size: 8,
      },
      textfont: {
        size: 17
      },
      hoverinfo: "skip",
    };
    traces.push(textTrace);
  }

  if (i == 75) {
    let offsetLon = 1.5;
    let offsetLat = 0;
    let textTrace = {
      type: "scattergeo",
      mode: "markers+text",
      lon: [data.longitude[i] + offsetLon],
      lat: [data.latitude[i] + offsetLat],
      text: [" Migración al norte (primavera)"],
      textposition: "middle right",
      marker: {
        color: season.color,
        size: 8,
      },
      textfont: {
        size: 17
      },
      hoverinfo: "skip",
    };
    traces.push(textTrace);
  }

  traces.push(lineTrace);

}

const layout = {

  showlegend: false,
   paper_bgcolor: "black", // Sfondo del contenitore
  geo: {
    
        lonaxis: {
      range: [minLon - 28, maxLon + 28], // Imposta i limiti della longitudine
    },
    lataxis: {
      range: [minLat - 2, maxLat + 2], // Imposta i limiti della latitudine
    },
    
    
    bgcolor: "rgb(212 244 255)", // Sfondo del frame
    scope: "world",
    
    projection: {
      type: "mercator",
      scale: 1,
    },
    
    center: {
      lon: (minLon + maxLon)/2,
      lat: (minLat + maxLat)/2
    },
    showland: true,
    landcolor: 'rgb(255,255,255)',
    countrycolor: 'rgb(255, 255, 255)',
    showcountries: true,
    showcoastlines: true,
    showframe: false,

  },
      dragmode: false,

  margin: {
    l: 0, 
    r: 0,
    t: 0,
    b: 0
  },

};

const config = {
  displayModeBar: false,
  //modeBarButtonsToRemove: ["pan2d", "select2d", "lasso2d"],
};

Plotly.newPlot("map", traces, layout, config);

// Functions

function seasonColorInfo(monthNumber) {
    const winter = [12, 1, 2];
    const spring = [3, 4, 5];
    const summer = [6, 7, 8];
    const autumn = [9, 10, 11];

    let r = 0;
    let g = 0;
    let b = 0;
    let name = "";

    if (winter.includes(monthNumber)) {
        r = 25;
        g = 75;
        b = 61;
        name = "invierno";
    }
    else if (spring.includes(monthNumber)) {
        r = 245;
        g = 196;
        b = 23;
        name = "primavera";
    }
    else if (summer.includes(monthNumber)) {
        r = 203;
        g = 37;
        b = 98;
        name = "verano";
    }
    else if (autumn.includes(monthNumber)) {
        r = 73;
        g = 136;
        b = 229;
        name = "otoño";
    }
    else {
        console.log("Invalid month number");
    }

    let color = `rgb(${r}, ${g}, ${b})`;

    return {color, name};
}

function resetPlot() {
    Plotly.react("map", traces, layout);
  	defaultZoom = true;
}

function speak(text) {
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
}

let queue = [];

function disableBtn(id) {
    document.getElementById(id).disabled = true;
}

function enableBtn(id) {
    document.getElementById(id).disabled = false;
} 

document.getElementById("tone").addEventListener("click", () => {
    if (Tone.context.state !== "running") {
        Tone.start();
    }
    if (!playingAnimation) {
        playingAnimation = true;
        disableBtn("tone");
        enableBtn("stop");
        triggerTone();
    }
})

document.getElementById("stop").addEventListener("click", () => {
    queue = [];
})


function resetMapPosition() {
    // Simula un clic en el botón de reseteo de Plotly usando su clase CSS
    const resetButton = document.querySelector('.modebar-btn[data-title="Reset"]');
    if (resetButton) {
        resetButton.click();
    }
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function proportion(value, min, max, offset) {
    return ((value - min) / (max - min)) + offset;
}

function latitudeToFreq(lat) {
    const minFreq = 300;
    const maxFreq = 500;
    const latProp = proportion(lat, minLat, maxLat, 0);
    const freqStep = (maxFreq - minFreq) * latProp;
    return minFreq + freqStep;
}

async function triggerTone() {

    // Workaround

    speak(""); // For some reason, the first speak never plays
    await sleep(100);

    // Global data

    const latitudes = data.latitude;
    const longitudes = data.longitude;
    const dates = data.month

    // Insert frequencies to play in queue

    for (let i = 0; i < 90; i+=2) {
        const freqToPlay = latitudeToFreq(latitudes[i]);
        const dataToQueue = {
            freq: freqToPlay,
            lat: latitudes[i],
            lon: longitudes[i],
            dat: dates[i],
        }
        queue.push(dataToQueue);
    }

    // Play frequencies in queue

    let currentSeason = null;

    while (queue.length != 0) {
        const datai = queue.shift();
        const freq = datai.freq;
        const lat = datai.lat;
        const lon = datai.lon;
        const dat = datai.dat;
        const seasonColor = seasonColorInfo(dat);
        const color = seasonColor.color;
        const seasonName = seasonColor.name;

        const movingTrace = {
            type: "scattergeo",
            mode: "markers",
            lon: [lon],
            lat: [lat],
            marker: {
                color: "white",
                size: 20,
                line: {
                    color: color,
                    width: 7,
                },
            },
            hoverinfo: "skip",
        };

        Plotly.react("map", [...traces ,movingTrace], layout);

        if (currentSeason != seasonName) {
            currentSeason = seasonName;
            speak(seasonName);
            await sleep(400);
        }
        else
        {
            synth.triggerAttackRelease(freq, "100n");
        }

        // synth.triggerAttackRelease(freq, "100n");
        await sleep(350);
    }

    resetPlot();
    playingAnimation = false;
    enableBtn("tone");
    disableBtn("stop");
}

// Protobject

const latCenter = (minLat + maxLat)/2;
const lonCenter = (minLon + maxLon)/2;
// lat ~ y
// lon ~ x
const latAdjustment = 50.5;
const lonAdjustment = 50;
let timeoutId = null;
const plotDiv = document.getElementById("map");
const fingerDataFrec = 3;
let fingerDataCounter = 0;
let fingerTouchedStart = false;
let summerSpeakDone = false;
let autumnSpeakDone = false;
let winterSpeakDone = false;
let springSpeakDone = false;

plotDiv.on("plotly_relayout", function (eventData) {
	defaultZoom = false;
});

function fingerToMapCoord(fingerCoord, center, adjustment) {
  return (fingerCoord - 0.5) * adjustment + center;
}

function drawFingerTrace(lat, lon) {
  const fingerTrace = {
    type: "scattergeo",
    mode: "markers",
    lon: [lon],
    lat: [lat],
    marker: {
      color: "white",
      size: 20,
      line: {
        color: "gray",
        width: 7,
      },
    },
    hoverinfo: "skip",
  };
  Plotly.react("map", [...traces ,fingerTrace], layout);
}

function inSelection(lat, lon) {
  // calibrated manually
  if (29 <= lat && lat <= 41) {
    if (-12 <= lon && lon <= -4) {
      return true;
    }
    else {
      return false;
    }
  }
  else if (41 < lat && lat <= 53) {
    const inf = (11/12)*(lat -53) -1;
    const sup = (3/4)*(lat - 53) + 6;
    if (inf <= lon && lon <= sup) {
      return true;
    }
    else {
      return false;
    }
  }
  return false;
}

function mDistance(x0, y0, x1, y1) {
	return Math.abs(x0 - x1) + Math.abs(y0 - y1);
}

function fingerSpeak(x, y) {
	if (mDistance(x, y, 1, 50) < 1.5 && !summerSpeakDone) {
      speak("Verano");
      summerSpeakDone = true;
    }
  	else if (mDistance(x, y, -3, 48.5) < 1.3 && !autumnSpeakDone) {
      speak("Otoño");
      autumnSpeakDone = true;
    }
    else if (mDistance(x, y, -8.5, 31) < 2 && !winterSpeakDone) {
      speak("Invierno");
      winterSpeakDone = true;
    }
  	else if (mDistance(x, y, -7, 38) < 1.5 && !springSpeakDone) {
      speak("Primavera");
      springSpeakDone = true;
  	}
}

function fingerTone(lat, lon) {
  //console.log(fingerDataCounter)
  if (fingerDataCounter % fingerDataFrec === 0 && inSelection(lat, lon)) {
    fingerSpeak(lon, lat);
	synth.triggerAttackRelease(latitudeToFreq(lat), "100n");
  }
  fingerDataCounter = (fingerDataCounter + 1) % fingerDataFrec;
}

Protobject.Core.onReceived((fingerData) => {
  // lat ~ y
  // lon ~ x
  // console.log(fingerData);
  clearTimeout(timeoutId);
  const xData = fingerData["x"];
  const yData = 1 - fingerData["y"];
  //console.log(`${Number(xData).toFixed(2)}-${Number(yData).toFixed(2)}`);
  const traceLon = fingerToMapCoord(xData, lonCenter, lonAdjustment);
  const traceLat = fingerToMapCoord(yData, latCenter, latAdjustment);
  console.log(`x=${Number(traceLon).toFixed(2)} y=${Number(traceLat).toFixed(2)}`);
  if (!defaultZoom) {resetMapPosition();}
  if (playingAnimation) {
    queue = [];
  	playingAnimation = false;
    enableBtn("tone");
    disableBtn("stop");
  }
  if (mDistance(traceLon, traceLat, 1, 50) < 1.3) {
  	fingerTouchedStart = true;
  }
  if (fingerTouchedStart) {
  	fingerTone(traceLat, traceLon);
  }
  drawFingerTrace(traceLat, traceLon);
  timeoutId = setTimeout(() => {
  	resetPlot();
    fingerTouchedStart = false;
    summerSpeakDone = false;
    autumnSpeakDone = false;
    winterSpeakDone = false;
    springSpeakDone = false;
  }, 1000);
});