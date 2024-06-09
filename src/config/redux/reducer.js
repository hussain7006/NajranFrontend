const INITIAL_STATE = {
    // headerHeight: 10,
    // headerHeight: 92,
    headerHeight: 62,
    isLoggedIn: false,
    user: {
        id: null,
        isLoggedIn: false,
        username: null,
        email: null,
        mapImage: "",
        isMapUploadModal: false
    },
    isDownloadPdfTriggered: false
};


export default (state = INITIAL_STATE, action) => {

    if (action.type === "MINIMIZEHEADER") {
        return { ...state, headerHeight: action.value }
    }
    else if (action.type === "MAXIMIZEHEADER") {
        return { ...state, headerHeight: action.value }
    }
    else if (action.type === "USERAUTH") {
        return { ...state, user: { ...action.value } }
    }
    else if (action.type === "UPDATEMAPIMAGE") {

        return { ...state, user: { ...state.user, mapImage: action.value } }
    }
    else if (action.type === "DOWNLOADPDFTRIGGERED") {
        // console.log("in reducer DOWNLOADPDFTRIGGERED");
        // console.log(action);
        return { ...state, isDownloadPdfTriggered: !state.isDownloadPdfTriggered }
    }


    return state;
}