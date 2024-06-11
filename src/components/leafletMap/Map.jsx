import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import L from "leaflet";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Tooltip,
  CircleMarker,
  ImageOverlay,
  // Circle,
} from "react-leaflet";
import Swal from 'sweetalert2'
import "../../../node_modules/leaflet/dist/leaflet.css";
import "./map.css";
import paMap from "/images/paMap.png"
import najranMapView from "/images/najranMapView.png"
import najranMapView1 from "/images/najranMapView1.png"

import videoMarkerNavyBlue from "/images/images/video_camera_navy_blue.png"
import videoMarkerPink from "/images/images/video_camera_Pink.png"
import { getToken } from "../../utils/functions";
import axios from "axios";
import { constants } from "../../constants/backup_constants";
// import riyadh from "/images/riyadh.png"


function Map(props) {
  const user = useSelector(data => data.user);

  const [data, setData] = useState({
    zoom: 13.5,
    // position: [24.6402, 46.7118],
    position: [25.2514, 46.3837],
    mapImage: ""
  });


  useEffect(() => {
    setData({ ...data, mapImage: najranMapView1 });


    // let accessToken = getToken("accessToken")
    // const fetchImage = async () => {
    //   try {
    //     const res = await axios.post(`${constants.nodeJsServer}/users/getUserUploadedMapImage`, null, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}` // Include token in Authorization header
    //       }
    //     })
    //       .then(async function (response) {
    //         let res = response.data
    //         if (res.success) {
    //   console.log(res);
    //   const mapImage = res.data.mapImage;
    //   setData({ ...data, mapImage: mapImage })

    //   } else {

    //   Swal.fire({
    //     title: 'Error!',
    //     text: res.message,
    //     icon: 'error',
    //     confirmButtonText: 'Close',
    //     confirmButtonColor: "red"
    //     // showCancelButton: true,
    //   })
    //   }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     Swal.fire({
    //       title: 'Error!',
    //       text: "Something went wrong",
    //       icon: 'error',
    //       confirmButtonText: 'Close',
    //       confirmButtonColor: "red"
    //       // showCancelButton: true,
    //     })
    //   });

    //   } catch (error) {
    //     console.error('Error fetching image:', error);
    //   }
    // };

    // if (accessToken) {
    //   fetchImage()
    // }
  }, [])

  const [bounds, setBounds] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(0)

  useEffect(() => {
    // Fetch the image size to determine the bounds of the image overlay
    const fetchImageSize = async () => {
      try {
        const response = await fetch(data.mapImage);
        if (response.ok) {
          const blob = await response.blob();
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            // Adjust the bounds based on the aspect ratio of the image
            const southWest = [0, 0];
            const northEast = [aspectRatio, aspectRatio]; // Assume height is 1 for simplicity

            setBounds([southWest, northEast]);
            setAspectRatio(aspectRatio)
          };
          img.src = URL.createObjectURL(blob);
        } else {
          console.error('Failed to fetch image:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImageSize();
  }, [data.mapImage]);


  return (
    <div className="mapParentDiv" style={{
      opacity: 0.96,
      borderRadius: "0px"
    }}>
      <LeafletMap
        center={[aspectRatio / 2, aspectRatio / 2]} // Center of the map
        zoom={8.7} // Initial zoom level
        zoomSnap={0.1} // Set the zoom snap steps
        zoomDelta={0.1} // Set the zoom delta steps

        style={{ borderRadius: "0px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}
      >

        {
          props.markersPosition.map((item, index) => (
            <Marker
              key={item.name + "_" + index}
              title={item.name} // Set the title attribute for the marker
              position={item.position}
              icon={
                new L.Icon({
                  iconUrl: item.isActive ? videoMarkerPink : videoMarkerNavyBlue,
                  iconRetinaUrl: item.isActive ? videoMarkerPink : videoMarkerNavyBlue,
                  iconAnchor: null,
                  popupAnchor: item.name,
                  shadowUrl: null,
                  shadowSize: null,
                  shadowAnchor: null,
                  iconSize: new L.Point(20, 20),
                })
              }

              onClick={() => props.handleSelectSideBarItem(index, "map")}

            >
            </Marker>

          ))
        }
        {/* {bounds && (
          <ImageOverlay
            url={data.mapImage} // URL of the image
            bounds={bounds} // Bounds of the image overlay
          />
        )} */}
      </LeafletMap>
    </div >
  );
}

export default Map;