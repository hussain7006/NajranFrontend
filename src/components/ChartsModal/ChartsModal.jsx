import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

import styles from "./ChartsModal.module.css"
import { constants } from '../../constants/constants';
import PlotlyPieChart from '../PlotlyCharts/PlotlyPieChart';
import PlotlyOccupancyPieChart from '../PlotlyCharts/PlotlyOccupancyPieChart';
import PlotlyHeatmapChart from '../PlotlyCharts/PlotlyHeatmapChart';

export default function ChartsModal({
    historyData,
    occupancyPieChartData,
    heatMapDirectionToggle,
    toggleHeatMap,
    baseUrl8000,
    cameraIndex,
    chartUpdateFlag,
    historyDate,

}) {
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xl');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMaxWidthChange = (event) => {
        setMaxWidth(
            // @ts-expect-error autofill of arbitrary value is not handled.
            event.target.value,
        );
    };

    const handleFullWidthChange = (event) => {
        setFullWidth(event.target.checked);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open max-width dialog
            </Button>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>People Analytics</DialogTitle>
                <DialogContent>
                    {/* <Box> */}
                    <div className={styles.mainBox}>


                        <div className={styles.chartDiv} >

                            {/* <BarChart /> */}
                            {/* <OccupancyBarChart /> */}
                            {/* <PlotlyBarChart
                                    occupancyBarChart={occupancyBarChart}
                                    title={constants.occupancyBarChartTitle}
                                    titleFontSize={constants.chartTitleFontSize}
                                    /> */
                            }
                            <span style={{ position: "absolute", right: 10, top: 14, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                                {occupancyPieChartData.selectedDate}
                            </span>
                            <PlotlyOccupancyPieChart
                                occupancyPieChartData={occupancyPieChartData}
                                title={constants.pieChartOccupancyTitle}
                                font_size={constants.piechartTitleFontSize}
                            />

                        </div>

                        <div className={styles.chartDiv}>

                            <span style={{ position: "absolute", right: 10, top: 5, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                                {occupancyPieChartData.selectedDate}
                            </span>
                            <div style={{ position: "absolute", left: 20, top: 5, zIndex: 1 }}>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={heatMapDirectionToggle === 1}
                                            onChange={toggleHeatMap}
                                            name="toggleSide"
                                            size="small"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        heatMapDirectionToggle === 1 ? (
                                            <span style={{ fontSize: 13 }}>{constants.side1Text}</span>
                                        ) : (
                                            <span style={{ fontSize: 13 }}>{constants.side2Text}</span>
                                        )
                                    }
                                />
                            </div>
                            {/* <Heatmap baseUrl8000={baseUrl8000} /> */}
                            <PlotlyHeatmapChart
                                baseUrl8000={baseUrl8000}
                                cameraIndex={cameraIndex}
                                chartUpdateFlag={chartUpdateFlag}
                                historyDate={historyDate}
                                heatMapDirectionToggle={heatMapDirectionToggle}
                                title={constants.heatMapChartTitle}
                                titleFontSize={constants.heatMapChartTitleFontSize}
                                side1Text={constants.side1Text}
                                side2Text={constants.side2Text}
                                historyData={historyData}
                            />
                        </div>

                        <div className={styles.chartDiv}>
                            <span style={{ position: "absolute", right: 10, top: 14, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                                {occupancyPieChartData.selectedDate}
                            </span>

                            <PlotlyPieChart
                                historyData={historyData}
                                title={constants.side1Text + " " + constants.pieChartTitle + " Females"}
                                // side_and_Gender="side_1_F"
                                side_and_Gender="approx_count_side_1_F"
                                directionText={constants.side1Text}
                                font_size={constants.piechartTitleFontSize}
                            />
                        </div>

                        <div className={styles.chartDiv}>
                            <span style={{ position: "absolute", right: 10, top: 14, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                                {occupancyPieChartData.selectedDate}
                            </span>
                            <PlotlyPieChart
                                historyData={historyData}
                                title={constants.side1Text + " " + constants.pieChartTitle + " Males"}
                                // side_and_Gender="side_1_M"
                                side_and_Gender="approx_count_side_1_M"
                                directionText={constants.side1Text}
                                font_size={constants.piechartTitleFontSize}
                            />
                        </div>

                        <div className={styles.chartDiv}>
                            <span style={{ position: "absolute", right: 10, top: 14, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                                {occupancyPieChartData.selectedDate}
                            </span>
                            <PlotlyPieChart
                                historyData={historyData}
                                title={constants.side2Text + " " + constants.pieChartTitle + " Females"}
                                // side_and_Gender="side_2_F"
                                side_and_Gender="approx_count_side_2_F"
                                directionText={constants.side2Text}
                                font_size={constants.piechartTitleFontSize}
                            />
                        </div>

                        <div
                            className={styles.chartDiv}
                        >
                            <span style={{ position: "absolute", right: 10, top: 14, zIndex: 1, color: "#1E1656", fontFamily: 'DINArabic_Regular', fontWeight: 600, fontSize: 18 }}>
                                {occupancyPieChartData.selectedDate}
                            </span>
                            <PlotlyPieChart
                                historyData={historyData}
                                title={constants.side2Text + " " + constants.pieChartTitle + " Males"}
                                // side_and_Gender="side_2_M"
                                side_and_Gender="approx_count_side_2_M"
                                directionText={constants.side2Text}
                                font_size={constants.piechartTitleFontSize}
                            />
                        </div>

                    </div>

                    {/* </Box> */}
                    {/* <DialogContentText>
                        You can set my maximum width and whether to adapt or not.
                    </DialogContentText>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'fit-content',
                        }}
                    >
                        <FormControl sx={{ mt: 2, minWidth: 120 }}>
                            <InputLabel htmlFor="max-width">maxWidth</InputLabel>
                            <Select
                                autoFocus
                                value={maxWidth}
                                onChange={handleMaxWidthChange}
                                label="maxWidth"
                                inputProps={{
                                    name: 'max-width',
                                    id: 'max-width',
                                }}
                            >
                                <MenuItem value={false}>false</MenuItem>
                                <MenuItem value="xs">xs</MenuItem>
                                <MenuItem value="sm">sm</MenuItem>
                                <MenuItem value="md">md</MenuItem>
                                <MenuItem value="lg">lg</MenuItem>
                                <MenuItem value="xl">xl</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Switch checked={fullWidth} onChange={handleFullWidthChange} />
                            }
                            label="Full width"
                        />
                    </Box> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}