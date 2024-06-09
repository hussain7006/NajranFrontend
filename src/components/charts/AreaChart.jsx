import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

function AreaChart({ data }) {
    const [state, setState] = useState({
        areaChartData: {
            options: {
                chart: {
                    id: 'basic-bar',
                    toolbar: {
                        show: false
                    }
                },
                xaxis: {
                    categories: [

                    ],
                    labels: {
                        formatter: function (value) {
                            const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
                            return new Date(value).toLocaleTimeString('en-US', options);
                        }
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100],
                        colorStops: [
                            {
                                offset: 0,
                                color: '#ff00ff', // Pink (filled color)
                                opacity: 1,
                            },
                            {
                                offset: 100,
                                color: 'white', // Pink (filled color)
                                opacity: 0.7,
                            },
                        ],
                    },
                },
                stroke: {
                    curve: 'smooth',
                    colors: ['#ff00ff'], // Magenta (outline color)
                    width: 4, // Outline width
                },
                dropShadow: {
                    enabled: true,
                    top: 5, // Set the top shadow distance
                    left: 0, // Set the left shadow distance
                    blur: 1, // Set the blur effect
                    opacity: 0.1, // Set the shadow opacity
                },
                responsive: [
                    {
                        breakpoint: 600, // controls the chart at screens <= 600px
                        options: {
                            chart: {
                                width: '100%',
                                height: "100%"
                            },
                        },
                    },
                ],
                tooltip: {
                    x: {
                        format: 'dd/MM/yyyy HH:mm', // Adjust tooltip date format as needed
                    }
                },
            },
            series: [
                {
                    name: 'series-1',
                    data: data.length > 0 ? data : [
                        {
                            "x": "2023-02-03T00:04:38.000Z",
                            "y": "19"
                        }
                    ],
                },
            ],
        },
    });

    useEffect(() => {
        setState(prevState => ({
            areaChartData: {
                ...prevState.areaChartData,
                series: [
                    {
                        ...prevState.areaChartData.series[0],
                        data: data.length > 0 ? data : [],
                    },
                ],
            },
        }));
    }, [data]);

    return (
        <Chart
            options={state.areaChartData.options}
            series={state.areaChartData.series}
            type="area"
            width="100%"
            height="100%"
            className="PAAreaChart"
        />
    );
}

export default AreaChart;
