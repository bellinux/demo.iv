const geojsonUrl = "regiones.json";
const consumo_relativo = "ConsumoRelativo.csv";

const audio = new Audio("https://matilab.github.io/sound.mp3");
audio.playbackRate=3;
let audioInterval;

// Acá leo los nombres de las regiones y el consumo relativo
fetch(consumo_relativo)
  .then((response) => response.text())
  .then((data) => {
    const rows = data.split("\n").map((row) => row.split(";"));

    const nombres_regiones = rows.slice(1).map((row) => row[0]);
    console.log(nombres_regiones);
    const consumo_regiones = rows
      .slice(1)
      .map((row) => parseFloat(row[3].replace(",", ".")));
    console.log(consumo_regiones);

    // crear el array de información de las regiones
    const informacion_regiones = nombres_regiones.map((nombre, index) => {
      return {
        id: nombre,
        info: `Consumo: ${consumo_regiones[
          index
        ].toLocaleString()} kcal/persona.`,
        extrainfo: "lorem ipsum",
      };
    });

    // Máximo entre los datos para normalizar
    const max = Math.max(...consumo_regiones);

    // acá esta el layout para que se centre el mapa en Chile
    const layout = {
      geo: {
        scope: "chile",
        resolution: 50,
        lonaxis: { range: [-80, -65] },
        lataxis: { range: [-60, -17] },
        landcolor: "white",
        showcountries: false,
        countrycolor: "Black",
        visible: false,
      },
      dragmode: false,
      staticPlot: true,
      annotations: [],
    };

    // configuración de plotly
    const config = {
      displayModeBar: false, // sacar la barra de herramientas de plotly
    };

    // acá se muestra el mapa
    fetch(geojsonUrl)
      .then((response) => response.json())
      .then((geojson) => {
        const geoData = {
          type: "choropleth",
          geojson: geojson,
          locations: nombres_regiones,
          z: consumo_regiones,
          featureidkey: "properties.Region",
          //text: nombres_regiones, // Agregar esto para mostrar el nombre completo en el hover
          //hoverinfo: 'text+z',
          colorscale: "Reds", // escala, la podemos cambiar
          showscale: false,
          hoverinfo: "none",
        };

        Plotly.newPlot("mapa", [geoData], layout, config);

        // Instanciar el objeto de audio

        // acá se define la información que se quiere que muestre cada región
        informacion_regiones[0].extrainfo = "Población: 261.779 habitantes."; // Arica
        informacion_regiones[1].extrainfo = "Población: 406.287 habitantes."; // Tarapacá
        informacion_regiones[2].extrainfo = "Población: 718.232 habitantes."; // Antofagasta
        informacion_regiones[3].extrainfo = "Población: 319.992 habitantes."; // Atacama
        informacion_regiones[4].extrainfo = "Población: 879.267 habitantes."; // Coquimbo
        informacion_regiones[5].extrainfo = "Población: 2.010.849 habitantes."; // Valparaíso
        informacion_regiones[6].extrainfo = "Población: 8.420.729 habitantes."; // Región Metropolitana
        informacion_regiones[7].extrainfo = "Población: 1.017.701 habitantes."; // O'Higgins
        informacion_regiones[8].extrainfo = "Población: 1.162.641 habitantes."; // Maule
        informacion_regiones[9].extrainfo = "Población: 1.681.430 habitantes."; // Biobío
        informacion_regiones[10].extrainfo = "Población: 519.437 habitantes."; // Ñuble
        informacion_regiones[11].extrainfo = "Población: 1.028.201 habitantes."; // La Araucanía
        informacion_regiones[12].extrainfo = "Población: 411.205 habitantes."; // Los Ríos
        informacion_regiones[13].extrainfo = "Población: 907.429 habitantes."; // Los Lagos
        informacion_regiones[14].extrainfo = "Población: 108.306 habitantes."; // Aysén
        informacion_regiones[15].extrainfo = "Población: 183.235 habitantes."; // Magallanes y Antártica Chilena

        // aquí va el evento de hover para mostrar la información
        document.getElementById("mapa").on("plotly_hover", function (pdata) {
          console.log(pdata);
          const consumo = pdata.points[0].z; // consumo por región

          const regionId = pdata.points[0].location;
          const regionInfo = informacion_regiones.find(
            (region) => region.id === regionId
          );

          activateInfo(regionId, regionInfo, consumo);
        });

        // ocultar el bloque de información cuando se saca el mouse
        document.getElementById("mapa").on("plotly_unhover", function (pdata) {
          document.getElementById("info-box").style.display = "none";
          document.getElementById("info-box").classList.remove("visible");
          document.getElementById("contexto").style.opacity = 1;
          // reiniciar audio
          clearInterval(audioInterval);
          audio.pause();
          audio.currentTime = 0;
        });
      });
    let triangle = document.getElementById("triangle");

    const coloresRegiones = [
      "rgb(220, 220, 220)", // Arica y Parinacota
      "rgb(245, 187, 145)", // Tarapacá
      "rgb(179, 46, 37)", // Antofagasta
      "rgb(233, 134, 91)", // Atacama
      "rgb(227, 214, 206)", // Coquimbo
      "rgb(230, 211, 197)", // Valparaíso
      "rgb(220, 220, 219)", // Metropolitana
      "rgb(228, 212, 200)", // O'Higgins
      "rgb(233, 208, 190)", // Maule
      "rgb(228, 212, 199)", // Biobío
      "rgb(245, 183, 139)", // Ñuble
      "rgb(227, 213, 203)", // La Araucanía
      "rgb(243, 197, 162)", // Los Ríos
      "rgb(245, 194, 156)", // Los Lagos
      "rgb(245, 190, 149)", // Aysén
      "rgb(205, 71, 59)", // Magallanes
    ];

    function activateInfo(regionId, regionInfo, consumo) {
      document.getElementById("contexto").style.opacity = 0;

      if (regionInfo) {
        document.getElementById("region-name").innerText = regionInfo.id;
        document.getElementById("region-info").innerText = regionInfo.info;
        document.getElementById("extra-info").innerText = regionInfo.extrainfo;
        // document.getElementById('region-icon').src = regionInfo.iconRoute;
        document.getElementById("info-box").style.display = "block";
        setTimeout(function () {
          document.getElementById("info-box").classList.add("visible");
        }, 1000);

        // Calcular y establecer el ancho de la barra de consumo
        //const consumo = consumo_regiones[regionIndex];
        const widthPercentage = (consumo / max) * 100;
        document.getElementById("consumption-bar").style.width =
          widthPercentage + "%";

        const regionIndex = nombres_regiones.indexOf(regionId);
        // Asignar color específico en el orden de colores definido
        const regionColor = coloresRegiones[regionIndex];
        document.getElementById("consumption-bar").style.backgroundColor =
          regionColor;
      }

      audio.currentTime = 0; // Asegurarse de que empieza desde el inicio
      audio.volume = 1; // Ajustar el volumen (si es necesario)
      audio.play();

      // Calcular el intervalo de repetición del audio basado en el consumo
      const minInterval = 200; // Tiempo mínimo en ms entre repeticiones
      const maxInterval = 1200; // Tiempo máximo en ms entre repeticiones
      const interval =
        maxInterval - (consumo / max) * (maxInterval - minInterval);

      // Limpiar cualquier intervalo anterior para evitar superposición de audios
      clearInterval(audioInterval);

      // Iniciar el audio a intervalos específicos
      audioInterval = setInterval(() => {
        audio.currentTime = 0;
        audio.play();
      }, interval);
    }

    function mapValue(value, inMin, inMax, outMin, outMax) {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    let svgDuplicated = false;
    let svgCloneContainer = null;

    document.addEventListener("mousemove", function (event) {
      if (svgCloneContainer !== null) {
        //oculta el elemento svg duplicado si detecta movimientos del mouse, asi que plotly puede funcionar normalmente, ya que el mouse se posiciona arriba del elemento de plotly mismo
        svgCloneContainer.style.display = "none";
      }
    });

    // Listen for hand sensor data and map to screen coordinates
    Protobject.Core.onReceived((data) => {
      if (svgDuplicated == false) {
        svgDuplicated = true;

        // Seleziona l'elemento <svg> generato da Plotly
        const plotlyDiv = document.getElementById("mapa"); // ID del contenitore del grafico
        const svgElement = plotlyDiv.querySelector("svg");

        // Clona l'elemento SVG
        const clonedSvgElement = svgElement.cloneNode(true); // Il 'true' clona anche i figli dell'SVG

        // Ottieni le dimensioni e la posizione dell'elemento SVG originale
        const svgBoundingRect = svgElement.getBoundingClientRect();

        // Crea un contenitore per la copia dell'SVG
        svgCloneContainer = document.createElement("div");
        svgCloneContainer.style.position = "absolute"; // Posiziona sopra l'elemento originale
        svgCloneContainer.style.top = `${svgBoundingRect.top}px`; // Posizione top rispetto al viewport
        svgCloneContainer.style.left = `${svgBoundingRect.left}px`; // Posizione left rispetto al viewport
        svgCloneContainer.style.width = `${svgBoundingRect.width}px`; // Larghezza dell'originale
        svgCloneContainer.style.height = `${svgBoundingRect.height}px`; // Altezza dell'originale
        svgCloneContainer.style.zIndex = "100"; // Assicurati che si sovrapponga al grafico originale
        clonedSvgElement.style.backgroundColor = "transparent"; // Imposta trasparenza per il fondo dell'SVG

        // Aggiungi la copia nel DOM
        document.body.appendChild(svgCloneContainer);
        svgCloneContainer.appendChild(clonedSvgElement);

        // Seleziona tutti i path all'interno dell'SVG clonato
        const svgPaths = clonedSvgElement.querySelectorAll("path"); // Seleziona solo i path

        // Aggiungi un ID progressivo a ciascun path
        svgPaths.forEach(function (path, index) {
          // Assegna un ID progressivo come region-0, region-1, etc.
          path.setAttribute("id", `region-${index}`);

          // Aggiungi un evento hover su ogni path
          path.addEventListener("mouseover", function (event) {
            // Restituisci l'ID della regione (path) su cui si è passati con il mouse
            console.log("ID della regione:", event.target.id);
            // Puoi anche aggiungere altre modifiche stilistiche se necessario
          });
        });
      }
      //muestra el elemento svg duplicado si detecta evento de la mano
      svgCloneContainer.style.display = "block";

      const cursorTop = mapValue(data.y, 0.2, 0.8, 0, window.innerHeight);
      const cursorLeft = mapValue(data.x, 0.2, 0.8, 0, window.innerWidth);

      triangle.style.top = cursorTop + "px"; // Actualiza la posición vertical del triángulo
      triangle.style.left = cursorLeft + "px"; // Actualiza la posición horizontal del triángulo

      detectHoverRegion(cursorLeft, cursorTop);
    });

    var oldRegion = "";

    function detectHoverRegion(x, y) {
      if (document.elementFromPoint(x, y) !== null) {
        const detectedId = document.elementFromPoint(x, y).id;
        if (detectedId.startsWith("region-")) {
          const region = detectedId.split("-")[1];
          console.log("region: ", region);

          if (oldRegion != region) {
            displayRegionInfo(region);
            oldRegion = region;
          }
        } else {
          document.getElementById("info-box").style.display = "none";
          document.getElementById("info-box").classList.remove("visible");
          document.getElementById("contexto").style.opacity = 1;
          // reiniciar audio
          clearInterval(audioInterval);
          audio.pause();
          audio.currentTime = 0;
          oldRegion="";
        }
      }
    }

    function displayRegionInfo(regionId) {
      const regionInfo = informacion_regiones[regionId];
      const consumo = consumo_regiones[regionId];
      console.log(consumo, regionInfo);

      activateInfo(regionId, regionInfo, consumo);
    }
  });
