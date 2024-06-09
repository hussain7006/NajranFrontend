import React, { useState, useEffect } from "react";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js/dist/plotly-cartesian";
import { constants } from "../../constants/constantsV3";

const PlotlyComponent = createPlotlyComponent(Plotly);

const PlotlyDonut = ({
  donutType,
  upwardMaleCount,
  upwardFemaleCount,
  downwardMaleCount,
  downwardFemaleCount,
  // headerHeight,
  doughnut1Title,
  doughnut2Title,
  labelFontSize

}) => {
  const data = [
    {
      labels: ["Male", "Female"],
      type: "pie",
      marker: {
        colors: ["#2A6EBB", "#ff00ff"],
      },

    },
  ];
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    if (donutType === "gender") {
      setChartData([
        {
          ...chartData[0],
          values: upwardMaleCount || upwardFemaleCount
            ? [upwardFemaleCount, upwardMaleCount]
            : [1],
          labels: upwardMaleCount || upwardFemaleCount
            ? ["Female", "Male"]
            : ["Null"],
          textinfo: upwardMaleCount || upwardFemaleCount ? "label+value" : "label",
          marker: {
            colors: upwardMaleCount || upwardFemaleCount
              ? ["#ff00ff", "#2A6EBB"]  // Swapped colors for "Male" and "Female"
              : ["#44c8f5"],
          },
          hole: constants.doughnutHole,
        },
      ]);
    } else if (donutType === "ethnicity") {
      setChartData([
        {
          ...chartData[0],
          values: downwardMaleCount || downwardFemaleCount
            ? [downwardFemaleCount, downwardMaleCount]
            : [1],
          labels: downwardMaleCount || downwardFemaleCount
            ? ["Female", "Male"]
            : ["Null"],
          textinfo: downwardMaleCount || downwardFemaleCount
            ? "label+value"
            : "label",
          marker: {
            colors: downwardMaleCount || downwardFemaleCount
              ? ["#ff00ff", "#2A6EBB"]  // Swapped colors for "Male" and "Female"
              : ["#44c8f5"],
          },
          hole: constants.doughnutHole,
        },
      ]);
    }
  }, [upwardMaleCount, upwardFemaleCount, downwardMaleCount, downwardFemaleCount]);

  const layout = {
    title: {
      text: '',
      font: {
        family: "DINArabic_Medium",
        size: 18,
        color: "#333",
      },
      x: 0.1,
      y: 0.9,
    },
    annotations: [
      {
        font: { size: labelFontSize, family: "DINArabic_Medium" },
        showarrow: false,
        text: donutType === "gender" ? doughnut1Title : doughnut2Title,
        x: 0.5,
        y: 0.5
      }],
    autosize: true,
    margin: { t: 5, b: 5, l: 0, r: 0 },
    legend: {
      x: 0,
      y: 0,
      font: {
        family: "DINArabic_Medium",
        size: 13,
      },
      itemwidth: 30
    },
  };

  const config = {
    showLink: false,
    displayModeBar: false,
    scrollZoom: true,
    responsive: true,
  };

  return (
    <PlotlyComponent
      config={config}
      data={chartData}
      layout={layout}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default PlotlyDonut;
