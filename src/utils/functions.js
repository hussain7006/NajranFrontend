// import { constants } from "../../constants/constants.js"
import Cookies from 'js-cookie';
import { constants } from "../constants/backup_constants.js"

function filterDataForGivenTime(hours, personCounts) {
    // console.log("-------------------------")
    // console.log("in functions");
    // console.log(constants.chartDataStartDate);
    // console.log(constants.chartDataEndDate);
    // console.log("-------------------------")
    const filteredHours = [];
    const filteredCounts = [];

    for (let i = 0; i < hours.length; i++) {
        const hour = parseInt(hours[i].split("-")[3]); // Extract hour from entry
        if (hour >= constants.chartDataStartDate && hour <= constants.chartDataEndDate) {
            let splittedTime = hours[i].split("-")
            let hr = (splittedTime.length > 0) && splittedTime[splittedTime.length - 1]
            // console.log(splittedTime);
            // console.log(hr);
            filteredHours.push(hr);
            filteredCounts.push(personCounts[i]);
        }
    }
    return { hours: filteredHours, counts: filteredCounts }
}

function getOccupancyDataFromLocalStorage() {
    const localStorageHistoryData = localStorage.getItem("occupancyData");
    if (localStorageHistoryData) {
        try {
            const { occupancyCounts, hours, selectedDate } = JSON.parse(localStorageHistoryData);

            // console.log("localStorageHistoryData");
            // console.log(localStorageHistoryData);
            return {
                occupancyCounts,
                hours,
                selectedDate
            }
        } catch (error) {
            console.error('Error parsing JSON from localStorage:', error);
        }
    } else {
        console.log('No data found in localStorage.');
    }
}

function setToken(name, value, days) {
    // var expires = "";
    // if (days) {
    //     var date = new Date();
    //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    //     expires = "; expires=" + date.toUTCString();
    // }
    // document.cookie = name + "=" + (value || "") + expires + "; path=/";

    Cookies.set(name, value, { expires: days, secure: true });
}

function getToken(name) {
    return Cookies.get(name);

}

function removeTokenFromCookies() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
}


export {
    filterDataForGivenTime,
    getOccupancyDataFromLocalStorage,
    setToken,
    getToken,
    removeTokenFromCookies
}