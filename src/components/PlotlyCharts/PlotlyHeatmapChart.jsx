import React, { useEffect, useMemo, useState } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import { constants } from "../../constants/backup_constants.js"

const PlotlyComponent = createPlotlyComponent(Plotly);

function PlotlyHeatmapChart({
    chartUpdateFlag,
    historyDate,
    heatMapDirectionToggle,
    title,
    titleFontSize,
    side1Text,
    side2Text,
    historyData,
    isPdfDownloading
}) {
    const [heatmapData, setHeatmapData] = useState([{
        type: 'heatmap',
        x: [`${side1Text} Female`, `${side1Text} Male`],
        z: [[1, 20], [20, 1], [30, 60], [0, 6]],

        textposition: 'inside',
        name: 'Occupancy Count',
        marker: {
            color: ['#808285', '#952D98', '#1E1656', '#44C8F5', '#2A6EBB', '#722EA5'],
            colorscale: 'Viridis', // Choose your desired color scale
            zmin: 0, // Minimum value for the color scale
            zmax: 10, // Maximum value for the color scale
        },
        textfont: {
            size: 14,
            color: 'white'
        },
        width: [0.7],
        hoverongaps: false,
    }]);

    const layout = {
        title: isPdfDownloading ? "" : title,
        font: {
            family: 'DINArabic_Regular', // Change to your desired font family
            size: titleFontSize, // Change to your desired font size
            // color: 'blue' // Change to your desired font color
        },
        // autosize: true,
        autosize: false, // Set autosize to false
        width: 670, // Specify the desired width
        height: 400, // Specify the desired height
        pad: 0,
        xaxis: {
            type: 'Gender'
        },
        yaxis: {
            zeroline: false,
            // title: "Date",
            autorange: "reversed",
            // tickmode: 'array', // Set the tickmode to 'array'
            // tickmode: 'linear', // Set the tickmode to 'array'
            // tickmode: 'log',
            // tickmode: 'array',
            // tickmode: 'auto',
            dtick: 1,
            // height: 10
            automargin: true,
            fixedrange: true,
            // scaleanchor: "x",
            scaleratio: 1,
            tickfont: {
                size: 20
            },

        },
        margin: {
            autoexpand: true,
            b: 40,
            l: 35,
            r: 0,
            t: 60,
        }
    };

    const config = {
        showLink: false,
        displayModeBar: false,
        scrollZoom: true,
        responsive: true,
    };

    useEffect(() => {
        // console.log("in heatmap comp");
        // console.log(historyData);

        let heatmapValues = [];
        let hoursArray = [];

        if (historyData?.jsonData.length > 0) {

            historyData?.jsonData.forEach(item => {
                // let { date_, side_1_F, side_1_M, side_2_F, side_2_M } = item;
                let { date_, approx_count_side_1_F, approx_count_side_1_M, approx_count_side_2_F, approx_count_side_2_M } = item;
                let hour = date_.toString().split("-")[3];

                if (hour >= constants.chartDataStartDate && hour <= constants.chartDataEndDate) {

                    if (heatMapDirectionToggle == 1) {
                        hoursArray.push(hour);
                        heatmapValues.push([approx_count_side_1_F, approx_count_side_1_M]);
                    } else {
                        hoursArray.push(hour);
                        heatmapValues.push([approx_count_side_2_F, approx_count_side_2_M]);
                    }
                }
            });

            setHeatmapData(prevData => {
                const newData = [...prevData];
                newData[0].x = (heatMapDirectionToggle == 1) ? [`${side1Text} Female`, `${side1Text} Male`] : [`${side2Text}_Female`, `${side2Text}_Male`]
                newData[0].y = hoursArray
                newData[0].z = heatmapValues
                // newData[0].y = [
                //     "08",
                //     "09",
                //     "10",
                //     "11",
                //     "12",
                //     "19"
                // ];
                // newData[0].z = [
                //     [152, 538],
                //     [0, 48],
                //     [0, 1124],
                //     [0, 10553],
                //     [0, 11349],
                //     [0, 0]
                // ];
                return newData;
            });
        } else {
            setHeatmapData(prevData => {
                const newData = [...prevData];
                newData[0].x = (heatMapDirectionToggle == 1) ? [`${side1Text} Female`, `${side1Text} Male`] : [`${side2Text}_Female`, `${side2Text}_Male`]
                // newData[0].y = hoursArray
                // newData[0].z = heatmapValues
                newData[0].y = [
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "13"
                ];
                newData[0].z = [
                    [600, 20],
                    [900, 500],
                    [30, 1124],
                    [1600, 200],
                    [650, 350],
                    [800, 1200]
                ];
                return newData;
            });
        }

    }, [historyDate.selectedDate, heatMapDirectionToggle, chartUpdateFlag, historyData]);

    useEffect(() => {
    }, [heatmapData]);

    return (
        <>
            {
                (heatmapData.length > 0) ?
                    <div style={{ height: '100%', width: "100%" }}>

                        <PlotlyComponent
                            data={heatmapData}
                            layout={layout}
                            config={config}
                            style={{ height: '100%' }}
                        />

                    </div> :
                    <div style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <h5>No Data Found For Heatmap</h5>
                    </div>

            }
        </>

    );
}

export default PlotlyHeatmapChart;
