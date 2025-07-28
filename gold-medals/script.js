fetch("medallistas.json")
  .then((response) => response.json())
  .then((data) => {
    const years = data.map((entry) => entry.Year);
    const city = data.map((entry) => entry.City);
    const menTimes = data.map((entry) => entry.Men);
    const womenTimes = data.map((entry) =>
      entry.Women === "-" ? null : entry.Women
    );
    const menWinners = data.map((entry) => entry.men_winner);
    const womenWinners = data.map((entry) => entry.women_winner);
    const menPhotos = data.map((entry) => entry.men_photo);
    const womenPhotos = data.map((entry) => entry.women_photo);
    const menCustomData = menTimes.map((time, index) => [
      menWinners[index],
      menPhotos[index],
      city[index],
    ]);
    const womenCustomData = womenTimes.map((time, index) => [
      womenWinners[index],
      womenPhotos[index],
      city[index],
    ]);

    const minTime = Math.min(
      ...menTimes,
      ...womenTimes.filter((time) => time !== null)
    );
    const maxTime = Math.max(
      ...menTimes,
      ...womenTimes.filter((time) => time !== null)
    );

    const minWomenTime = Math.min(
      ...womenTimes.filter((time) => time !== null)
    );
    const minMenTime = Math.min(...menTimes);

    const MenTextPosition = [
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "top",
      "top",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "bottom",
      "top",
      "bottom",
      "top",
    ];

    const WomenTextPosition = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "top",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
      "top",
      "bottom",
      "top",
      "top",
      "bottom",
      "top",
      "top",
      "bottom",
      "top",
      "bottom",
      "top",
    ];

    const womenMarkerAndTextColor = data.map((entry) => {
      const isRecord = entry.Women !== "-" && entry.Women === minWomenTime;
      const descalification = entry.Year === 2000 && entry.Women === 10.75;
      return descalification ? "gray" : isRecord ? "#DAA520" : "9f7f34";
    });

    const womenMarkerSymbols = data.map((entry) => {
      const isRecord = entry.Women !== "-" && entry.Women === minWomenTime;
      const descalification = entry.Year === 2000 && entry.Women === 10.75;
      return descalification ? "x" : isRecord ? "star" : "circle";
    });

    const womenMarkerSizes = data.map((entry) => {
      const isRecord = entry.Women !== "-" && entry.Women === minWomenTime;
      const descalification = entry.Year === 2000 && entry.Women === 10.75;
      return descalification ? 13 : isRecord ? 14 : 11;
    });

    const womenMarkerBorderWidths = data.map((entry) => {
      const isRecord = entry.Women !== "-" && entry.Women === minWomenTime;
      const descalification = entry.Year === 2000 && entry.Women === 10.75;
      return descalification ? 1 : isRecord ? 1 : 0;
    });

    const menMarkerAndTextColor = data.map((entry) => {
      const isRecord = entry.Men !== "-" && entry.Men === minMenTime;
      return isRecord ? "#DAA520" : "#1f77b4";
    });

    const menMarkerSymbols = data.map((entry) => {
      const isRecord = entry.Men !== "-" && entry.Men === minMenTime;
      return isRecord ? "star" : "circle";
    });

    const menMarkerSizes = data.map((entry) => {
      const isRecord = entry.Men !== "-" && entry.Men === minMenTime;
      return isRecord ? 14 : 12;
    });

    const menMarkerBorderWidths = data.map((entry) => {
      const isRecord = entry.Men !== "-" && entry.Men === minMenTime;
      return isRecord ? 1 : 0;
    });

    const extraMessageInfo = (year, time) => {
      const isRecord = time === minWomenTime || time === minMenTime;
      const descalification = year == 2000 && time == 10.75;

      if (isRecord) {
        return { message: "(Actual Récord Olímpico)", color: "#A67C00" };
      } else if (descalification) {
        return { message: "(Descalificada por Dopaje)", color: "red" };
      }
      return { message: "", color: "#000" };
    };

    var traceMen = {
      x: years,
      y: menTimes,
      text: menTimes.map((time) => (time === null ? "" : time)),
      textposition: MenTextPosition,
      textfont: {
        size: 14,
      },
      mode: "lines+markers",
      name: "Hombres",
      line: {
        color: "#1f77b4",
        width: 5,
      },
      marker: {
        color: menMarkerAndTextColor,
        size: menMarkerSizes,
        symbol: menMarkerSymbols,
        opacity: 1,
        line: {
          color: "#000",
          width: menMarkerBorderWidths,
        },
      },
      customdata: menCustomData,
      hoverinfo: "text",
    };

    var traceWomen = {
      x: years,
      y: womenTimes,
      text: womenTimes.map((time) => (time === null ? "" : time)),
      textposition: WomenTextPosition,
      textfont: {
        color: womenMarkerAndTextColor,
        size: 14,
      },
      mode: "lines+markers",
      name: "Mujeres",
      line: {
        color: "#9f7f34",
        width: 5,
      },
      marker: {
        size: womenMarkerSizes,
        color: womenMarkerAndTextColor,
        symbol: womenMarkerSymbols,
        opacity: 1,
        line: {
          color: "#000",
          width: womenMarkerBorderWidths,
        },
      },
      customdata: womenCustomData,
      hoverinfo: "text",
    };

    var layout = {
      showlegend: false,
      height: 650,
      width: 1350,
      xaxis: {
        title: {
          font: {
            family: "Arial",
            size: 24,
            color: "rgb(82, 82, 82)",
          },
        },
        showline: true,
        showgrid: false,
        showticklabels: true,
        linecolor: "rgb(204,204,204)",
        linewidth: 2,
        ticklen: 5,
        autotick: false,
        ticks: "outside",
        tickcolor: "rgb(204,204,204)",
        tickwidth: 4,
        ticklen: 7,
        tickfont: {
          family: "Arial",
          size: 20,
          color: "rgb(82, 82, 82)",
        },
        tickangle: -45,
        type: "category",
      },
      yaxis: {
        title: {
          text: "Tiempo",
          font: {
            family: "Arial",
            size: 24,
            color: "rgb(82, 82, 82)",
          },
        },
        showgrid: false,
        zeroline: false,
        showline: true,
        showticklabels: true,
        linecolor: "rgb(204,204,204)",
        linewidth: 2,
        ticklen: 5,
        autotick: true,
        ticks: "outside",
        tickcolor: "rgb(204,204,204)",
        tickwidth: 4,
        ticklen: 7,
        ticksuffix: "s",
        tickfont: {
          family: "Arial",
          size: 16,
          color: "rgb(82, 82, 82)",
        },
      },
      autosize: false,
      annotations: [
        {
          xref: "paper",
          yref: "paper",
          x: 0.16,
          y: 1.05,
          xanchor: "left",
          yanchor: "bottom",
          text: "<b>Evolución de los Ganadores de 100m planos en las Olimpiadas</b>",
          font: {
            family: "Arial",
            size: 30,
            color: "rgb(100,100,100)",
          },
          showarrow: false,
        },
        {
          xref: "paper",
          x: 1.03,
          y: 9.79,
          xanchor: "right",
          yanchor: "middle",
          text: "<b>Hombres</b>",
          showarrow: false,
          font: {
            family: "Arial",
            size: 20,
            color: "#1f77b4",
          },
        },
        {
          xref: "paper",
          x: 1.02,
          y: 10.72,
          xanchor: "right",
          yanchor: "middle",
          text: "<b>Mujeres</b>",
          showarrow: false,
          font: {
            family: "Arial",
            size: 20,
            color: "#9f7f34",
          },
        },
      ],
    };

    const myPlot = document.getElementById("myDiv");
    const runningSound = document.getElementById("running-sound");
  
    runningSound.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);

    function setPlaybackRate(time) {
      const speed = ((maxTime - time) / (maxTime - minTime)) * 0.8 + 0.8;
      runningSound.playbackRate = speed;
    }

    Plotly.newPlot(myPlot, [traceMen, traceWomen], layout,{
          scrollZoom: false,
          displayModeBar: false,
        });

    myPlot.on("plotly_hover", function (data) {
      const year = data.points[0].x;
      const city = data.points[0].customdata[2];
      console.log(data.points[0]);
      const winner = data.points[0].customdata[0];
      const photo = `./public/${data.points[0].customdata[1]}`;
      const time = data.points[0].y;
      const messageInfo = extraMessageInfo(year, time);
      //console.log(data);

      document.getElementById("hover-info").style.opacity = 1;
      document.getElementById("winner-name").innerText = winner;
      document.getElementById("year").innerText = `${city}, ${year}`;
      document.getElementById("time").innerText = time;
      document.getElementById("img").src = "https://lolenn10.github.io/E1-Infovis/"+photo;
      document.getElementById("img").alt = winner;
      document.getElementById("message-info").innerText = messageInfo.message;
      document.getElementById("message-info").style.color = messageInfo.color;

    });
  
    myPlot.on("plotly_click", function (data) {

      const time = data.points[0].y;
      setPlaybackRate(time);
      if (runningSound.paused) {
        runningSound.currentTime = 0;
        runningSound.play();
      }
      let arduinoSpeed = parseInt((Math.abs(time-12.2)*350)+300)
      //console.log(arduinoSpeed)
      Protobject.Core.send({speed: arduinoSpeed}).to("arduino.html")
    });

    myPlot.on("plotly_unhover", function (data) {
      document.getElementById("hover-info").style.opacity = 0;
      runningSound.pause();
      Protobject.Core.send({speed: 0}).to("arduino.html")
    });
  })
  .catch((error) => console.error("Error al cargar el archivo JSON:", error));