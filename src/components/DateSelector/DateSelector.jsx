import React, { useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function DateSelector({
  dateType,
  historyDate,
  enabledDates,
  setEnabledDates,
  cameraIndex,
  handleDataSelectorChange,
  historicDataIP,
  //enabledDates = ["2024-02-11","2024-02-12","2024-02-13"], // Array of dates to be enabled
}) {

  useEffect(() => {


    const getDatesForAvailableData = async () => {
      try {
        // Set timeout value in milliseconds (e.g., 5000 ms for 5 seconds)
        const fetchRequest = fetch(`${historicDataIP}/stream/get_dates`);

        const response = await Promise.race([fetchRequest]);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEnabledDates(data);


      } catch (error) {
        console.error('Error fetching data:', error);
      }

    };

    getDatesForAvailableData();
    // if (cameraIndex == 1 || cameraIndex == 2) {
    //   getDatesForAvailableData();
    // } else {
    //   console.log("in dateSelector cam index other than 1 and 2");
    // }
  }, [cameraIndex]); // Empty dependency array ensures the effect runs only once


  const shouldDisableDate = (date) => {
    // return !enabledDates.includes(date.format("YYYY-MM-DD"));
    return !enabledDates.includes(date.format("DD-MM-YYYY"));
  };

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ padding: 0 }}>
      <DemoContainer
        components={[
          "DatePicker",
          "MobileDatePicker",
          "DesktopDatePicker",
          "StaticDatePicker",
        ]}
        sx={{ padding: 0 }}
      >
        {/* <DemoItem label={label} sx={{ padding: 0 }}> */}
        <DatePicker
          defaultValue={dayjs(historyDate.startDate)}
          value={dayjs(historyDate[dateType])}
          onChange={handleDataSelectorChange}
          shouldDisableDate={shouldDisableDate}
          disableFuture={true}
        />
        {/* </DemoItem> */}
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default DateSelector;



