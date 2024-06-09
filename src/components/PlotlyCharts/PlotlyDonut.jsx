import React, { useState, useEffect } from "react";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js/dist/plotly-cartesian";
import { constants } from "../../constants/constantsV3";

const PlotlyComponent = createPlotlyComponent(Plotly);

const PlotlyDonut = ({
  tags,
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
      labels: tags,
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
          hole: constants.doughnutHole,
          textposition: constants.doughnutTextPosition,
          insidetextfont: {
            family: "Arial, sans-serif",
            size: constants.insideDoughnutTextSize,
            color: "white",
            weight: "bold",
          },
          outsidetextfont: {
            family: "Arial, sans-serif",
            size: constants.insideDoughnutTextSize,
            color: constants.insidetextcolor,
            weight: "bold",
          },
          values: upwardMaleCount || upwardFemaleCount
            ? [upwardFemaleCount, upwardMaleCount]
            : constants.doughnutEmptyChart1Value,
          labels: upwardMaleCount || upwardFemaleCount
            ? tags
            : constants.doughnutEmptyChart1Tags,
          textinfo: upwardMaleCount || upwardFemaleCount ? "label+value" : "label",
          marker: {
            colors: upwardMaleCount || upwardFemaleCount
              ? constants.doughnutChart1TagsColor
              : constants.doughnutEmptyChart1TagsColor,
          },

        },
      ]);
    } else if (donutType === "ethnicity") {
      setChartData([
        {
          ...chartData[0],
          textposition: constants.doughnutTextPosition,
          insidetextfont: {
            family: "Arial, sans-serif",
            size: constants.insideDoughnutTextSize,
            color: "white",
            weight: "bold",
          },
          hole: constants.doughnutHole,
          outsidetextfont: {
            family: "Arial, sans-serif",
            size: constants.insideDoughnutTextSize,
            color: constants.insidetextcolor,
            weight: "bold",
          },
          values: downwardMaleCount || downwardFemaleCount
            ? [downwardFemaleCount, downwardMaleCount]
            : constants.doughnutEmptyChart2Value,
          labels: downwardMaleCount || downwardFemaleCount
            ? tags
            : constants.doughnutEmptyChart2Tags,
          textinfo: downwardMaleCount || downwardFemaleCount
            ? "label+value"
            : "label",
          marker: {
            colors: downwardMaleCount || downwardFemaleCount
              ? constants.doughnutChart2TagsColor
              : constants.doughnutEmptyChart2TagsColor,
          },

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
      display: false,
      x: 0,
      y: 0,
      font: {
        family: "DINArabic_Medium",
        size: 10,
      },
      bgcolor: 'transparent',
      // itemwidth: 30
    },
    showlegend: true
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
