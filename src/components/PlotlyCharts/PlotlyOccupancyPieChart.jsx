import React, { useState, useEffect } from "react";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js/dist/plotly-cartesian";

const PlotlyComponent = createPlotlyComponent(Plotly);

const PlotlyOccupancyPieChart = ({
    title,
    font_size,
    occupancyPieChartData,
    isPdfDownloading
}) => {

    const data = [
        {
            labels: ["Male", "Female"],
            type: "pie",
            marker: {
                colors: ["#1E1656", "#2A6EBB", "#ff00ff", "#942C98"],
            },
            rotation: 90,
            textposition: "auto", // inside, outside, auto , none
            //   values:[1],
            // textinfo: "percent",
            // insidetextorientation: "horizontal",
        },
    ];
    const [chartData, setChartData] = useState(data);

    useEffect(() => {
        // console.log("in PlotlyOccupancyPieChart component");
        // console.log(occupancyPieChartData);

        if (occupancyPieChartData?.occupancyCounts.length > 0) {
            let occupancyCounts = occupancyPieChartData.occupancyCounts;
            let hours = occupancyPieChartData.hours
            setChartData([{
                ...chartData[0],
                values: occupancyCounts,
                labels: hours,
                textinfo: "percent+label",
                hoverinfo: "text",
                text: occupancyPieChartData?.occupancyCounts.map((count, index) => {
                    const percentage = (count / occupancyPieChartData?.occupancyCounts.reduce((total, count) => total + count, 0)) * 100;
                    return `Occupancy: ${count}<br>Time: ${occupancyPieChartData.hours[index]} hr<br>Percent: ${percentage.toFixed(2)}%`;
                }), // Custom text for hover with <br> tag
                textfont: {
                    size: 14, // Set the font size for the text in the pie pieces
                },
            }]);
        }
        else {
            setChartData([
                {
                    ...chartData[0],
                    values: [1],
                    labels: ["Null"],
                    marker: {
                        colors: ["#44C8F5"],
                    },
                    textinfo: "label",
                    hoverinfo: "text",
                    text: ""



                },
            ]);
        }


    }, [occupancyPieChartData])



    const layout = {
        title: {
            text: isPdfDownloading ? "" : title,
            font: {
                family: 'DINArabic_Regular',
                size: font_size,
                color: '#263238',
                weight: 'bold',
            },
            // x: 0.09,
            y: 0.95,
        },
        autosize: true,
        margin: { t: 100, b: 5, l: 0, r: 0 },
        showlegend: false,
        legend: {
            x: 0,
            y: 0,
        },
        hoverlabel: {
            align: 'left' // Align hover label text to the left
        },
        insidetextorientation: "radial",



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

export default PlotlyOccupancyPieChart;