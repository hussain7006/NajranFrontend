import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const Donut = ({
  donutType,
  upwardMaleCount,
  upwardFemaleCount,
  downwardMaleCount,
  downwardFemaleCount,
  headerHeight
}) => {
  const [chartData, setChartData] = useState({
    series: [1, 1],
    options: {
      labels: ["Male", "Female"],
      // colors: ['#0070b8', '#92278f'],
      colors: ["#2A6EBB", "#ff00ff"],
      title: {
        text: donutType === "upward" ? "Side 1" : "Side 2",
        align: "center",
        floating: true, // Position the title in the center
        offsetY: (headerHeight == 10) ? 85 : 60, // Adjust vertical offset if necessary
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          color: "#333",
        },
      },
      chart: {
        type: "donut",
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
      },
      toolbar: {
        show: false,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: [],
        },
      },
      dataLabels: {
        enabled: false,
        enabledOnSeries: undefined,
        formatter: function (val, opts) {
          return val;
        },
        textAnchor: "middle",
        distributed: false,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "14px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: "bold",
          colors: undefined,
        },
        background: {
          enabled: true,
          foreColor: "#fff",
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: "#fff",
          opacity: 0.9,
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: "#000",
            opacity: 0.45,
          },
        },
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.45,
        },
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        showForNullSeries: true,
        showForZeroSeries: true,
        position: "bottom",
        horizontalAlign: "center",
        floating: false,
        fontSize: "14px",
        fontFamily: "Helvetica, Arial",
        fontWeight: "bold",
        formatter: undefined,
        inverseOrder: true,
        width: undefined,
        height: undefined,
        tooltipHoverFormatter: undefined,
        customLegendItems: [],
        offsetX: -10,
        offsetY: 0,
        labels: {
          colors: undefined,
          useSeriesColors: false,
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: "#fff",
          fillColors: undefined,
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
        onItemClick: {
          toggleDataSeries: false,
        },
        onItemHover: {
          highlightDataSeries: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
              height: "100%",
              // width: 200
            },
            legend: {
              position: "bottom",
              show: false,
            },
          },
        },
      ],
    },
  });
  useEffect(() => {
    if (donutType == "upward") {
      setChartData({
        ...chartData,
        series:
          upwardMaleCount || upwardFemaleCount
            ? [upwardMaleCount, upwardFemaleCount]
            : [],
      });
    } else if (donutType == "downward") {
      setChartData({
        ...chartData,
        series:
          downwardMaleCount || downwardFemaleCount
            ? [downwardMaleCount, downwardFemaleCount]
            : [],
      });
    }
  }, [
    upwardMaleCount,
    upwardFemaleCount,
    downwardMaleCount,
    downwardFemaleCount,
  ]);



  return (
    <div style={{ height: "max-content", width: "100%" }}>
      {chartData.series.length > 0 ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          height="200em"
        />
      ) : (
        <div style={{
          height: "100%",
          width:"100%",
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}
        >No data available for the chart</div>
      )}
    </div>
    // <div style={{
    //   // border: "1px solid ",
    //   height: "max-content", width: "100%"
    // }}>
    //   <ReactApexChart
    //     options={chartData.options}
    //     series={chartData.series}
    //     type="donut"
    //     // width={"100%"}
    //     // height={"100%"}
    //     height={"200em"}
    //   />
    // </div>
  );
};

export default Donut;
