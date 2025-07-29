
// Lee el archivo datos-terremotos.json
fetch("datos-terremotos.json")
  .then((response) => response.json()) // Convierte la respuesta a formato JSON
  .then((datos) => {
    // Una vez leído, muestra los datos en la consola
    console.log(datos);
     // Luego los envía como parámetro a la función createGraph
    createGraph(datos);
  })
  .catch((error) => console.error("Errore nel caricamento:", error));

// La función createGraph, con los datos como parámetro (terremotos), crea la visualización
function createGraph(terremotos) {
  const myPlot = document.getElementById("myMap");

  const lon = terremotos.map((item) => item.Lon);
  const lat = terremotos.map((item) => item.Lat);
  // Se modifican las magnitudes para resaltar más las diferencias entre los terremotos. Es una decisión de diseño.
  const magnitud = terremotos.map((item) => item.Magnitud * 5 - 28);

  const data = [
    {
      //Trampa para visualizar solo Chile :)
      type: "choropleth",
      locations: ["CHL"],
      z: [0], // Valor de color para Chile utilizando la escala de colores definida a continuación. El valor puede ser 0 o 1, ya que la escala de colores solo contiene un color.
      colorscale: [
        [0, "#ddd"],
        [1, "#ddd"],
      ], // Parece que se requiere una escala de colores, pero solo necesitamos un color.
      showscale: false,
      hoverinfo: "skip",
    },
    {
      //Visualiza los puntos en la mapa de Chile
      type: "scattergeo",
      mode: "markers",
      lon: lon,
      lat: lat,
      hoverinfo: "none",
      marker: {
        color: magnitud,
        size: magnitud, // El tamaño y el color dependen de la magnitud. Hay dos señales visuales redundantes para representar la magnitud.
        colorscale: [
          [0, "#fff"],
          [1, "#000"],
        ],
        line: { color: "black" },
      },
    },
  ];

  const layout = {
    geo: {
      scope: "south america",
      showland: false,
      countrywidth: 0,
      lonaxis: { range: [-64, -76] },
      lataxis: { range: [-18, -59] },
    },
    width: 200,
    height: 800,
    margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
    dragmode: false,
  };

  Plotly.newPlot(myPlot, data, layout, {
    scrollZoom: false,
    displayModeBar: false,
  });

  // Evento que se activa cuando el mouse está sobre un círculo que indica un terremoto
  myPlot.on("plotly_hover", function (data) {
    // Extrae la información del terremoto en la posición del mouse desde el arreglo de terremotos
    const terremoto = terremotos[data.points[0].pointIndex];

    // Muestra el nombre del terremoto y las zonas afectadas
    document.getElementById("nombre").innerHTML = terremoto.Nombre;
    document.getElementById("regiones").innerHTML = terremoto.Zonas;

    // Si hubo tsunami, muestra la imagen correspondiente; si no, ocúltala
    if (terremoto.Tzunami) {
      document.getElementById("tzunami").style.display = "block";
    } else {
      document.getElementById("tzunami").style.display = "none";
    }

    // Si el número de muertos es cero, cambia el color del texto
    const muertosElement = document.getElementById("muertos");
    if (terremoto.Muertos == 0) {
      muertosElement.style.color = "#0f53ee"; // Cambia a un color específico
    } else {
      muertosElement.style.color = ""; // Restablece el color por defecto
    }

    // Muestra el número de muertos
    muertosElement.innerHTML = terremoto.Muertos;

    let magnitud = terremoto.Magnitud;
    const magnitudElement = document.getElementById("magnitud");

    // Muestra el valor de la magnitud del terremoto
    magnitudElement.innerHTML = magnitud;
    magnitud *= 10;

    // Ajusta el tamaño del div que muestra la magnitud según el valor de esta
    magnitudElement.style.width = magnitud + "px";
    magnitudElement.style.height = magnitud + "px";
    magnitudElement.style.lineHeight = magnitud + "px";

    // Ajusta también el tamaño del ícono de tsunami según la magnitud
    document.querySelector("#tzunami img").style.height = magnitud + "px";

    // Muestra los detalles del terremoto cuando el mouse está sobre el círculo
    document.getElementById("details").style.opacity = 1;
    // Elimina la visibilidad del contexto inicial
    document.getElementById("context").style.opacity = 0;
  });

  // Evento que se activa cuando el mouse sale del círculo que indica el terremoto
  myPlot.on("plotly_unhover", function (data) {
    // Oculta los detalles del terremoto
    document.getElementById("details").style.opacity = 0;
    // Vuelve a mostrar el contexto inicial
    document.getElementById("context").style.opacity = 1;
  });

  let timeout;
  // Se definen los audios para 3 niveles de intensidad de terremoto
  const highAudio = new Audio("high.mp3");
  const mediumAudio = new Audio("medium.mp3"));
  const lowAudio = new Audio("low.mp3");

  myPlot.on("plotly_click", function (data) {
    // Activa el efecto de terremoto visual en el gráfico (usando https://esqsoft.com/javascript_examples/earthquake)
    earthQuake({ el: myPlot, animationOption: "shaky" });

    // Extrae la magnitud del terremoto
    const magnitudSound = terremotos[data.points[0].pointIndex].Magnitud;

    // Ajusta el volumen de los audios en función de la magnitud del terremoto
    // Se ha jugado con los parámetros para establecer niveles de volumen adecuados
    const volumeHigh = Math.max(0, Math.min(1, magnitudSound - 7.9));
    const volumeMedium = Math.max(0, Math.min(1, magnitudSound - 6.9));
    const volumeLow = Math.max(0, Math.min(1, magnitudSound - 5.9));

    // Asigna los volúmenes a los audios correspondientes
    highAudio.volume = volumeHigh;
    mediumAudio.volume = volumeMedium;
    lowAudio.volume = volumeLow;

    // Reinicia los audios si ya fueron ejecutados previamente
    highAudio.currentTime = 0;
    mediumAudio.currentTime = 0;
    lowAudio.currentTime = 0;

    // Reproduce los audios
    highAudio.play();
    mediumAudio.play();
    lowAudio.play();

    // Detiene los audios después de 20 segundos
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      highAudio.pause();
      mediumAudio.pause();
      lowAudio.pause();
    }, 20000);
  });
}
