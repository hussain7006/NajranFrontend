import React, { useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import axios from 'axios';

const PlotlyComponent = createPlotlyComponent(Plotly);

function PlotlyBarChart({ occupancyBarChart, title, titleFontSize }) {
    // const [chartState, setChartState] = useState(occupancyBarChart);

    useEffect(() => { }, [occupancyBarChart])

    const { series, options } = occupancyBarChart;

    const occupancyBarChartData = [{
        type: 'bar',
        x: options.xaxis.categories,
        y: series[0].data,
        text: series[0].data.map(String),
        textposition: 'inside',
        name: 'Occupancy Count',
        marker: {
            color: ['#808285', '#952D98', '#1E1656', '#44C8F5', '#2A6EBB', '#722EA5'],

        },
        textfont: {
            size: 14,
            color: 'white'
        },

        width: [0.7]

    }];


    const layout = {
        title: title,
        font: {
            family: 'DINArabic_Regular', // Change to your desired font family
            size: titleFontSize, // Change to your desired font size
            // color: 'blue' // Change to your desired font color
        },
        autosize: true,
        pad: 0,
        // height:400,
        xaxis: {
            // title: 'Date',

            type: 'category'
        },
        yaxis: {
            // title: 'Occupancy Count',
            zeroline: false,

            // fixedrange: true
        },
        margin: {
            autoexpand: false,
            b: 20,
            l: 30,
            r: 0,
            t: 50,
        }
    };

    const config = {
        showLink: false,
        displayModeBar: false,
        scrollZoom: true,
        responsive: true,
    };

    return (
        <div style={{ height: '100%' }}>
            <PlotlyComponent data={occupancyBarChartData} layout={layout} config={config} style={{ height: '100%' }} />
        </div>
    );
}

export default PlotlyBarChart;