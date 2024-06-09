import React, { useState, useEffect, useRef } from "react";
import createPlotlyComponent from "react-plotlyjs";
import Plotly from "plotly.js/dist/plotly-cartesian";

import { filterDataForGivenTime } from "../../utils/functions.js"

// import { constants } from "../../constants/constants.js"

const PlotlyComponent = createPlotlyComponent(Plotly);

const PlotlyPieChart = ({
    side_and_Gender,
    historyData,
    title,
    font_size,
    isPdfDownloading
}) => {

    // const chartRef = useRef(null); // Reference to Plotly chart

    const data = [
        {
            labels: ["Male", "Female"],
            type: "pie",
            marker: {
                colors: ["#1E1656", "#2A6EBB", "#ff00ff", "#942C98"],
            },
            //   values:[1],
            rotation: 90,
            textposition: "auto", // inside, outside, auto , none
            // textinfo: "percent",
            // insidetextorientation: "horizontal",
        },
    ];
    const [chartData, setChartData] = useState(data);

    useEffect(() => {

        if (historyData?.side_1_M.length > 0) {
            let dates = historyData.categories;
            let personCounts = historyData[side_and_Gender]
            let onlyHours = dates.map((item) => item.split("-")[3])

            let { hours, counts } = filterDataForGivenTime(dates, personCounts);

            if (hours.length > 0) {

                // console.log("-----------------");
                // console.log("side_and_Gender:", side_and_Gender);
                // console.log("hours:", hours);
                // console.log("counts:", counts);
                // console.log("-----------------");
                setChartData([
                    {
                        ...chartData[0],
                        values: counts.every(item => item === 0) ? [1] : counts,
                        labels: counts.every(item => item === 0) ? ["Null"] : hours,

                        text: historyData[side_and_Gender].map((count, index) => {
                            const percentage = (count / historyData[side_and_Gender].reduce((total, count) => total + count, 0)) * 100;
                            return `Count: ${count}<br>Time: ${onlyHours[index]} hr<br>Percent: ${percentage.toFixed(2)}%`;
                        }), // Custom text for hover with <br> tag
                        hoverlabel: {
                            align: 'left' // Align hover label text to the left
                        },
                        // textinfo: "label+value",
                        textinfo: "percent+label",
                        // textposition: "auto",
                        insidetextorientation: "radial",
                        hoverinfo: "text",
                        textfont: {
                            size: 14, // Set the font size for the text in the pie pieces
                        },


                    },
                ]);
            } else {
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
        } else {
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


    }, [historyData])



    const layout = {
        title: {
            text: isPdfDownloading ? "" : title,
            font: {
                family: 'DINArabic_Regular',
                size: font_size,
                color: '#263238',
                weight: 'bold',
            },
            // x: 0.02,
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
        // textinfo: "label+value",
        textinfo: "percent+label",
        // textposition: "auto",
        insidetextorientation: "radial",
        hoverinfo: "text",
    };

    const config = {
        showLink: false,
        displayModeBar: false,
        displaylogo: false,
        scrollZoom: true,
        responsive: true,
        // toImageButtonOptions: {
        //     format: 'svg', // one of png, svg, jpeg, webp
        //     filename: 'Chart',
        //     height: 500,
        //     width: 700,
        //     scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        // }
        // modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','zoomOut2d']
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
        // <div style={{ position: "relative" }}>
        //     <PlotlyComponent
        //         ref={chartRef} // Pass the ref to PlotlyComponent
        //         data={chartData}
        //         layout={layout}
        //         config={config}
        //         style={{
        //             width: "100%",
        //             height: "100%",
        //         }}
        //     />
        //     <button onClick={handleSaveAsPNG}
        //         style={{ position: "absolute", top: "10px", left: "10", zIndex: 111, background: "blue" }}
        //     >Save as PNG</button>
        // </div>
    );
};

export default PlotlyPieChart;