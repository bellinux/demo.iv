function removeEmptyKeys(arr) {
  return arr.map((obj) => {
    const cleanedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] !== null && obj[key] !== "") {
          cleanedObj[key] = obj[key];
        }
      }
    }
    return cleanedObj;
  });
}

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Errore ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore durante il fetch del JSON:", error);
    throw error;
  }
}



// Esempio di utilizzo
fetchJSON("data.json")
  .then((stations) => {
    fetchJSON("regiones.json")
      .then((regions) => {
      
      
      //const nombreRegiones = regions.features.map((feature) => feature.properties.Region);

      //stations=removeEmptyKeys(stations)
      //console.log(stations)
      
// Calcola i valori per le regioni
const regionValues = dataForRegions(regions, stations);
console.log("Region Values:", regionValues);

// Ordina i colori basandosi su nombreRegiones
const nombreRegiones = regions.features.map((feature) => feature.properties.Region); // Estraggo i nomi delle regioni dal GeoJSON
const colors = nombreRegiones.map((regionName) => regionValues[regionName] || 0); // Associa i valori, usa 0 come fallback
console.log("Colors Array:", colors);

// Plotly
const myPlot = document.getElementById("myMap");

const lon = stations.map((item) => item.longitud);
const lat = stations.map((item) => item.latitud);
const code = stations.map((item) => item.codigo_estacion);

const data = [
  /*
  {
    type: "scattergeo",
    mode: "markers",
    lon: lon,
    lat: lat,
    text: code,
    hoverinfo: "none",
    name: "",
    marker: {
      size: 3,
    },
  }, */
  {
    type: "choropleth",
    geojson: regions,
    locations: nombreRegiones,
    z: colors, // Usa l'array di valori per colorare le regioni
    featureidkey: "properties.Region", // Mappatura con il GeoJSON
    colorscale: [
      [0, "rgba(230, 230, 230, 0.2)"], // Colore uniforme (es. blu trasparente)
      [1, "rgba(0, 120, 230, 0.8)"], // Lo stesso colore
    ],
    showscale: false, // Nasconde la barra dei colori
    marker: {
      line: {
        color: "#777", // Colore dei bordi
        width: 1, // Spessore dei bordi
      },
    },
    hoverinfo: "location", 
  },
];

        const layout = {
          
          hoverlabel: {
            namelength: -1,
    font: {
      size: 16,          // Impostiamo una dimensione del font più grande per leggibilità
    },
          },
          
          geo: {
            scope: "south america",
            resolution: 150,
            showland: true,
            landcolor: "rgb(255, 255, 255)",
            subunitwidth: 1,
            countrywidth: 1,
            subunitcolor: "rgb(255,255,255)",
            countrycolor: "rgb(255,255,255)",
            lonaxis: { range: [-60, -83] },
            lataxis: { range: [-21, -58] },
            projection: {
              type: "orthographic", // Tipo di proiezione per un effetto 3D
              rotation: {
                lon: -70, // Ruota verso una longitudine che posiziona il Cile orizzontalmente
                lat: -35, // Puoi regolare questa latitudine per centrarti meglio
                roll: -84, // Ruota attorno all'asse per migliorare l'orientamento
              },
            },
          },
          autosize: false,
          width: 1880,
          height: 1200,
          dragmode: false,
          margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
        };

        Plotly.newPlot("myMap", data, layout, {
          scrollZoom: false,
          displayModeBar: false,
        });
      
      document.getElementById('context').style.opacity = '1';

        const mapDiv = document.getElementById("myMap");
      
      /*
        mapDiv.on("plotly_selected", (eventData) => {
          if (eventData) {
            
            const selectedPoints = eventData.points.map((pt) => ({
              lat: pt.lat,
              lon: pt.lon,
              text: pt.text,
            }));
            //console.log("Punti selezionati:", selectedPoints);
            
            
            
            createRainGraph(selectedPoints, stations)
            
            
            
          }
        });
        */

mapDiv.on("plotly_click", (eventData) => {
  if (eventData) {
    // Ottieni l'informazione sull'evento
    const clickedLocation = eventData.points[0].location; // Nome della regione selezionata
    console.log("Regione selezionata:", clickedLocation);
    
    document.getElementById('additional').style.opacity = '1';
    document.getElementById('leggend').style.opacity = '1';
    document.getElementById('region').innerHTML = clickedLocation;

    // Trova la feature corrispondente nel GeoJSON
    const feature = regions.features.find(
      (f) => f.properties.Region === clickedLocation
    );

    if (!feature) {
      console.error("Feature non trovata per la regione:", clickedLocation);
      return;
    }

    // Filtra le stazioni in base alla regione selezionata
    const filteredData = filterRegion(feature, stations);
    console.log("Dati filtrati:", filteredData);
    
    document.getElementById('numeroestaciones').innerHTML = filteredData.length;

    // Crea i punti selezionati per il grafico
    const selectedPoints = filteredData.map((pt) => ({
      lat: pt.latitud, // Assumendo che la proprietà sia "latitud"
      lon: pt.longitud, // Assumendo che la proprietà sia "longitud"
      text: pt.codigo_estacion,
    }));

    console.log("Punti selezionati:", selectedPoints);

    // Chiamata per creare il grafico delle piogge
    createRainGraph(selectedPoints, stations);
  }
});

      
      
      
      
      
      })
      .catch((error) => console.error("Errore:", error));
  })
  .catch((error) => console.error("Errore:", error));



function dataForRegions(geoData, stations) {
  console.log(geoData.features, stations);

  let regionValues = {}; // Oggetto per associare regioni ai valori

  // Ciclo su ogni feature (regione)
  geoData.features.forEach((feature) => {
    const regionName = feature.properties.Region; // Nome della regione
    const filteredStations = filterRegion(feature, stations); // Filtra le stazioni per regione

    if (!filteredStations || filteredStations.length === 0) {
      console.log("Nessuna stazione trovata per la regione:", regionName);
      regionValues[regionName] = null; // Nessuna stazione trovata
      return;
    }

    const values = [];

    // Raccolgo i valori rilevanti da tutte le stazioni della regione
    filteredStations.forEach((station) => {
      const { inicio_automatica, ...resto } = station;

      Object.keys(resto).forEach((key) => {
        if (
          key !== "inicio_automatica" &&
          key !== "codigo_estacion" &&
          key !== "institucion" &&
          key !== "fuente" &&
          key !== "nombre" &&
          key !== "altura" &&
          key !== "latitud" &&
          key !== "longitud" &&
          key !== "codigo_cuenca" &&
          key !== "nombre_cuenca" &&
          key !== "codigo_sub_cuenca" &&
          key !== "nombre_sub_cuenca" &&
          key !== "inicio_observazioni" &&
          key !== "fin_observazioni" &&
          key !== "cantidad_observazioni"
        ) {
          let val = resto[key]; // Il valore associato alla chiave corrente

          if (val != null && val !== "") {
            values.push(parseFloat(val)); // Aggiungo il valore numerico se valido
          }
        }
      });
    });

    // Calcolo la media dei valori per la regione corrente
    if (values.length > 0) {
      const media = values.reduce((sum, value) => sum + value, 0) / values.length;
      regionValues[regionName] = media; // Associo la media al nome della regione
    } else {
      regionValues[regionName] = null; // Se non ci sono valori, aggiungo null
    }
  });

  return regionValues;
}

























function processEstacionData(data, codigoEstacion) {
  // Trova il JSON corrispondente al 'codigo_estacion'
  const estacion = data.find((item) => item.codigo_estacion === codigoEstacion);

  if (!estacion) {
    console.log("Estación no encontrada");
    return null;
  }

  // Elimina tutte le proprietà fino a 'inicio_automatica'
  const { inicio_automatica, ...resto } = estacion;

  const dates = [];
  const values = [];

  Object.keys(resto).forEach((key) => {
    if (
      key !== "inicio_automatica" &&
      key !== "codigo_estacion" &&
      key !== "institucion" &&
      key !== "fuente" &&
      key !== "nombre" &&
      key !== "altura" &&
      key !== "latitud" &&
      key !== "longitud" &&
      key !== "codigo_cuenca" &&
      key !== "nombre_cuenca" &&
      key !== "codigo_sub_cuenca" &&
      key !== "nombre_sub_cuenca" &&
      key !== "inicio_observaciones" &&
      key !== "fin_observaciones" &&
      key !== "cantidad_observaciones"
    ) {
      const date = key; // La chiave rappresenta la data
      let val = resto[key]; // Il valore associato alla data

      const convertedDate = new Date(date + "-01"); // Aggiungiamo "-01" per ottenere una data valida (primo giorno del mese)
      dates.push(convertedDate); // Ora la data è un oggetto Date valido
      //dates.push(date); // Aggiungi la data come array singolo
      //if (val<0.1) val = 0.1;
      values.push(val); // Aggiungi il valore come array singolo
    }
  });

  // Risultato finale
  const result = [dates.slice(-300), values.slice(-300)];

  return result;
}








function smooth(avgValues, window) {
  // Crea un array vuoto per i risultati
  const avgValueAveraged = [];

  // Verifica che la finestra sia positiva
  if (window <= 0) {
    throw new Error("La finestra deve essere maggiore di zero");
  }

  // Calcola la media mobile per ogni punto dell'array
  for (let i = 0; i < avgValues.length; i++) {
    // Definisce la finestra di valori che vanno dalla posizione max(0, i - window + 1) a i
    const windowStart = Math.max(0, i - window + 1);
    const windowValues = avgValues.slice(windowStart, i + 1);

    // Calcola la somma dei valori nella finestra e la divide per il numero di valori
    const sum = windowValues.reduce((acc, val) => acc + val, 0);
    const average = sum / windowValues.length;

    // Aggiungi la media calcolata all'array dei risultati
    avgValueAveraged.push(average);
  }

  return avgValueAveraged;
}



function filterRegion(geojsonFeature, dataToFilter) {
  // Verifica che il GeoJSON sia valido
  if (!geojsonFeature || !geojsonFeature.geometry) {
    throw new Error("GeoJSON non valido.");
  }



  // Filtra i dati basandoti sulla loro presenza nella regione
  const filteredData = dataToFilter.filter((dataPoint) => {
    const { latitud, longitud } = dataPoint;

    // Verifica che latitude e longitude esistano
    if (latitud == null || longitud == null) {
      return false;
    }

    // Crea un punto GeoJSON a partire dal dataPoint
    const point = turf.point([longitud, latitud]);

    // Verifica se il punto è dentro la feature
    return turf.booleanPointInPolygon(point, geojsonFeature);
  });

  return filteredData;
}


function createRainGraph(selectedPoints, stations){
  // Creiamo le tracce (lines) per ogni punto selezionato
            const traces = selectedPoints.map((point) => {
              
              
              const result = processEstacionData(stations, point.text);
              //console.log("Result per il punto selezionato:", result);
              if (result == null) return {};
              // Le date e i valori originali
              const dates = result[0]; // Array di date
              const values = result[1]; // Array di valori

              // Selezioniamo ogni 100esima data per l'asse X
              const tickVals = dates.filter((date, index) => index % 100 === 0); // Ogni 100esima data
              const tickText = tickVals; // Le stesse date come etichette

              // Restituiamo una traccia per ogni punto selezionato
              return {
                x: dates, // Tutte le date
                y: values, // Tutti i valori
                mode: "lines", // Modalità linee
                name: point.text || "Unknown", // Nome per la traccia
                hoverinfo: "none",
                selectable: "false",
                line: {
                  color: "#fafafa", // Imposta il colore della linea
                  width: 1, // Imposta lo spessore della linea a 1px
                },
              };
            });

            //console.log(traces);

            const filteredTraces = traces.filter(
              (trace) => Object.keys(trace).length !== 0
            );

            // Calcoliamo la media dei valori per ogni data
            const numTraces = filteredTraces.length;
            if (numTraces > 0) {
              const dates = filteredTraces[0].x; // Le date sono le stesse per tutte le tracce
              const avgValues = dates.map((_, index) => {
                // Sommiamo solo i valori validi per questa data (index)
                const validValues = filteredTraces
                  .map((trace) => trace.y[index])
                  .filter((val) => val !== null && val !== undefined && val !== "");

                const sum = validValues.reduce((acc, val) => acc + val, 0);
                const count = validValues.length;

                // Se ci sono valori validi, calcoliamo la media, altrimenti ritorniamo null o 0
                return count > 0 ? sum / count : null; // Media dei valori validi
              });



              avgValueAveraged = smooth(avgValues, 12);
              
              traces.length = 0;

              traces.push({
                x: dates, // Le stesse date
                y: avgValueAveraged, // I valori medi
                mode: "lines", // Modalità linee
                name: "Tendencia", // Nome per la traccia della media
                hoverinfo: "none",
                selectable: "false",
                line: {
                  color: "#aaa", // Colore per la linea della media (puoi cambiarlo)
                  width: 3, // Impostiamo uno spessore maggiore per la traccia della media
                  shape: "spline",
                  smoothing: 0.4,
                },
              });
              
                            // Aggiungiamo la traccia della media
              traces.push({
                x: dates, // Le stesse date
                y: avgValues, // I valori medi
                mode: "lines+markers", // Modalità linee
                name: "Media", // Nome per la traccia della media
                selectable: true, // Rende questa traccia selezionabile
                //hoverinfo: "x+y", // Puoi anche specificare altre info di hover se necessario
                hovertemplate: '%{x|%b %Y}, %{y:.0f}mm<extra></extra>',  // Personalizza l'hover
                line: {
                  color: "#3357ff", // Colore per la linea della media (puoi cambiarlo)
                  width: 2, // Impostiamo uno spessore maggiore per la traccia della media
                  shape: "spline",
                  smoothing: 1.3,
                },
                marker: {
                  color: "#3357ff", // Colore per la linea della media (puoi cambiarlo)
                  size: 5, // Impostiamo uno spessore maggiore per la traccia della media
                },
              });
              
            }

            // Definiamo il layout del grafico
            const layout = {
              plot_bgcolor: "rgba(0, 0, 0, 0)",
              paper_bgcolor: "rgba(0, 0, 0, 0)",
              xaxis: {
              showgrid: false,
                tickvals: [1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992, 1993, 1994,1995, 1996,1997, 1998,1999, 2000, 2001,2002,2003, 2004, 2005,2006,2007, 2008,2009, 2010,2011 ,2012, 2013,2014,2015, 2016, 2017,2018], // Intervallo dal 1992 al 2018 a intervalli di 2 anni
                  tickformat: "%Y", // Visualizza solo l'anno
                range: ['1993-02-01', '2018-12-31']
              },
              yaxis: {
                title: "Cantidad de lluvia (mm)",
                //type: "log", // Imposta la scala logaritmica
                range: [0, 800], // Definisci il range (opzionale, dipende dai tuoi dati)
                //autorange: true,
                tickvals: [0, 100, 200, 300,400,500,600,700], // Tick personalizzati per la scala logaritmica
                showgrid: false,
              },

              //hovermode: "closest", // Rende l'interazione più fluida
              showlegend: false, // Mostra la legenda
            };

            // Crea il grafico con tutte le tracce (linee)
            Plotly.newPlot("myGraph", traces, layout, {
              scrollZoom: false,
              displayModeBar: false,
            });
  
  
  
document.getElementById("myGraph").on('plotly_click', function(eventdata) {
    // Ottieni l'indice del punto cliccato
    var pointIndex = eventdata.points[0].pointIndex;
    
    // Ottieni il valore y del punto cliccato
    var yValue = eventdata.points[0].y;

    // Mostra il valore y nel console log
    //console.log("Valore Y del punto cliccato: ", yValue);
  soundAndMove(parseInt(yValue))
});

  

  
// Funzione per gestire l'evento hover
document.getElementById("myGraph").on('plotly_hover', function(eventdata) {

  
    const hoveredPoint = eventdata.points[0];
    
    // Converte la data in un oggetto Date e ottiene il mese
    const hoveredDate = new Date(hoveredPoint.x);
    const hoveredMonth = hoveredDate.getMonth() + 1; // Mesi in JavaScript sono 0-indexed (0 = gennaio)

    console.log(`Mese selezionato: ${hoveredMonth}`);

    // Trova le posizioni (x) corrispondenti ai punti dello stesso mese
    const verticalBars = traces[traces.length - 1].x
        .map((date, index) => {
            const currentDate = new Date(date);
            const month = currentDate.getMonth() + 1;

            if (month === hoveredMonth) {
                return { 
                    x: currentDate, 
                    y: traces[traces.length - 1].y[index] 
                };
            }
            return null;
        })
        .filter(bar => bar !== null); // Rimuove gli elementi nulli

    // Crea le barre verticali come shapes
    const shapes = verticalBars.map(bar => ({
        type: 'line',
        x0: bar.x,
        x1: bar.x,
        y0: 0, // Inizio della barra
        y1: bar.y, // Altezza fino al punto
        line: {
            color: '#3357ff',
            width: 12,
        }
    }));
  


    // Aggiorna il layout di Plotly con barre e annotazioni
    Plotly.relayout('myGraph', { 
        shapes, 
    });

    // Rende semitrasparenti la linea di fondo e i marker
    Plotly.restyle('myGraph', {
        opacity: 0.5 // Imposta la trasparenza
    });
});

// Funzione per rimuovere le barre e ripristinare l'opacità quando il mouse esce
document.getElementById("myGraph").on('plotly_unhover', function() {
  
  stopAll();
    // Rimuove tutte le forme (shapes) e annotazioni
    Plotly.relayout('myGraph', { 
        shapes: [],
    });

    // Ripristina l'opacità originale
    Plotly.restyle('myGraph', {
        opacity: 1.0 // Ripristina la trasparenza originale
    });
});
  
}



const highAudio = document.getElementById("highRain");
const mediumAudio = document.getElementById("mediumRain");
const lowAudio = document.getElementById("lowRain");


function stopAll(){
  highAudio.pause();
  mediumAudio.pause();
  lowAudio.pause();
  Protobject.Core.send({ speed: 0 }).to("arduino.html");
}
function soundAndMove(val){
  
  val=val/13;
  
  console.log(val)
  Protobject.Core.send({ speed: val }).to("arduino.html");
  
  

  let lowVolume = 0;
  let mediumVolume = 0;
  let highVolume = 0;


  if (val <= 25) {
    lowVolume = (val - 0) / (25 - 0);
    mediumVolume = 0;
    highVolume = 0;
  }

  else if (val <= 35) {
    lowVolume = 1; 
    mediumVolume = (val - 25) / (35 - 25);
    highVolume = 0;
  }

  else {
    lowVolume = 1;
    mediumVolume = 1;
    highVolume = (val - 35) / (47 - 35);
  }


  lowAudio.volume = lowVolume;
  mediumAudio.volume = mediumVolume;
  highVolume = highVolume > 1 ? 1 : highVolume; 
  highAudio.volume = highVolume;

  highAudio.currentTime = 0;
  mediumAudio.currentTime = 0;
  lowAudio.currentTime = 0;
  highAudio.play();
  mediumAudio.play();
  lowAudio.play();

}