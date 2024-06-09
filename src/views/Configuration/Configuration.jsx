import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import Swal from 'sweetalert2'
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
// import { InputText } from "primereact/inputtext";
// import { TextField } from "@mui/material";
// import { Tag } from 'primereact/tag';


import { constants } from "../../constants/constants";

import styles from "./Configuration.module.css"
import "./primeReact.css"

function Configuration() {
    const selector = useSelector(data => data.headerHeight);
    const mapImage = useSelector(data => data.user.mapImage);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();

    const user = useSelector(data => data.user);
    const [headerHeight, setHeaderHeight] = useState(`${selector}`)

    useEffect(() => {
        setHeaderHeight(selector)
    }, [selector, headerHeight])


    useEffect(() => { console.log("mapImage:", mapImage) }, [mapImage])

    // const headerMinHeight = 10;
    // const headerMaxHeight = 92;

    const handleNavigate = (route) => {
        navigate(route)
    }



    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const onTemplateSelect = (e) => {
        console.log("onTemplateSelect");
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {

        console.log("in onTemplateUpload");
        // let _totalSize = 0;

        // e.files.forEach((file) => {
        //     _totalSize += file.size || 0;
        // });

        // setTotalSize(_totalSize);
        // toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });

        console.log(e.files);


    };

    const onTemplateRemove = (file, callback) => {
        // setTotalSize(totalSize - file.size);
        console.log("onTemplateRemove");
        setTotalSize(0)
        callback();
    };

    const onTemplateClear = () => {
        console.log("onTemplateClear");
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        // console.log(chooseButton);
        const value = totalSize / 20000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
                <div>

                    {chooseButton}
                    {uploadButton}
                    {cancelButton}
                </div>
                <div className="flex items-center gap-3 ml-auto">
                    <span>{formatedValue} / 2 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex items-center flex-wrap justify-center py-4" style={{ marginBottom: 10 }}>
                <div className="flex align-items-center flex-col justify-center" style={{ width: '40%', display: "flex", alignItems: "center" }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-col text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                {/* <Tag value={props.formatSize} severity="warning" className="px-3 py-2" /> */}
                <Button type="button" icon="pi pi-times"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                    // className="border border-red-500 rounded px-3 py-1 "
                    style={{
                        color: "red"
                    }}
                />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
                <i className="pi pi-image mt-3 p-5"
                    style={{
                        fontSize: '5em',
                        borderRadius: '50%',
                        marginTop: 3,
                        paddingTop: 3,
                        backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'
                    }}></i>
                <span style={{ fontSize: '1.2em', marginTop: 5, marginBottom: 5, color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const uploadHandler = (e) => {
        console.log("in upload handler");
        // console.log(e);
        console.log("user:",user);

        if (user.isLoggedIn) {
            const formData = new FormData();
            e.files.forEach((file) => {
                formData.append('mapImage', file);
                formData.append('id', user.id);
            });


            fetch(`${constants.nodeJsServer}/users/mapImageUpload`, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    // Handle API response as needed
                    toast.current.show({ severity: 'info', summary: 'Success', detail: 'API call after upload successful' });
                    console.log("data:", data);

                    if (data.success) {
                        dispatch({
                            type: "UPDATEMAPIMAGE",
                            value: data.mapImage,
                        })

                        if (location?.state?.pageName === "dashboard") {
                            navigate("/")
                        }
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: "Please login to continue...",
                            icon: 'error',
                            confirmButtonText: 'Close',
                            confirmButtonColor: "red"
                            // showCancelButton: true,
                        })
                    }
                })
                .catch(error => {
                    // Handle errors
                    console.error('Error:', error);
                });
        } else {
            Swal.fire({
                title: 'Error!',
                text: "Please login to continue...",
                icon: 'error',
                confirmButtonText: 'Close',
                confirmButtonColor: "red"
                // showCancelButton: true,
            })
        }
    }

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div className={styles.main} style={{ height: `calc(100vh - ${headerHeight}px + 30px)` }}>

            <h1 style={{ fontSize: 30, margin: "10px 0px" }}>Configuration</h1>

            <div className={styles.imageUploadDiv}>
                <div>
                    <span style={{ fontSize: 20, marginBottom: 10, display: "block" }}>Image Upload</span>
                </div>
                <div>

                    <Toast ref={toast}></Toast>

                    <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                    <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                    <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                    <FileUpload ref={fileUploadRef} name=""
                        // url="/api/upload"
                        // multiple
                        customUpload
                        uploadHandler={uploadHandler}
                        accept="image/*"
                        maxFileSize={2000000}

                        onUpload={onTemplateUpload}
                        onSelect={onTemplateSelect}
                        onError={onTemplateClear}
                        onClear={onTemplateClear}
                        headerTemplate={headerTemplate}
                        itemTemplate={itemTemplate}
                        emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions}
                        uploadOptions={uploadOptions}
                        cancelOptions={cancelOptions}

                    />
                </div>
            </div>


            {/* <div className={styles.imageUploadDiv}> */}
            {/* <div>
                    <span style={{ fontSize: 20, marginBottom: 10, display: "block" }}>Chart Settings</span>
                </div> */}
            <div className="flex flex-col gap1">

                {/* <TextField
                        margin="normal"
                        // required
                        // fullWidth
                        id="email"
                        label="Start Time"
                        name="startTime"
                        autoFocus
                        type="number"
                    />
                    <span style={{ color: "red", padding: "0px 10px" }}>
                        Note: Time range is 0 - 24
                    </span>
                    <TextField
                        margin="normal"
                        // required
                        // fullWidth
                        id="email"
                        label="End Time"
                        name="endTime"
                        autoFocus
                        type="number"
                    />
                    <span style={{ color: "red", padding: "0px 10px" }}>
                        Note: Time range is 0 - 24
                    </span> */}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>


                    {mapImage &&   // Check if mapImage is not null or undefined
                        <button className="submitButton"
                            style={{
                                background: "#952D98",
                                width: "max-content",
                                marginTop: 3,
                                marginBottom: 2,
                                color: "#fff"
                            }}
                            onClick={() => handleNavigate(-1)}
                        >
                            Go To Dashboard
                        </button>
                    }

                    {/* <button className="submitButton"
                        style={{
                            background: "#952D98",
                            width: "max-content",
                            marginTop: 3,
                            marginBottom: 2,

                            color: "#fff"
                        }}

                    >
                        {(mapImage !== "") ? "Update" : "Upload"}
                    </button> */}
                </div>
            </div>
        </div>

        // </div>
    )
}

export default Configuration