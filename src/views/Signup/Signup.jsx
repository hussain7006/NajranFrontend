


import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


import { constants } from '../../constants/constants';
import { setToken } from '../../utils/functions';

import styles from "./signup.module.css"
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme({
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },

        },
    },
});

export default function Signup() {

    const navigate = useNavigate()
    // const isLoggedIn = useSelector(data => data.isLoggedIn);
    const dispatch = useDispatch();


    const [errors, setErrors] = useState([]);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleOpenBackdrop = () => {
        setOpenBackdrop(true);
    };

    function validateUserObject(user) {
        const errors = [];

        if (!user.username) errors.push('Username is required');
        if (!user.email) errors.push('Email is required');
        if (!user.password) errors.push('Password is required');
        if (!user.confirmPassword) errors.push('Confirm Password is required');
        if (user.password && user.confirmPassword && user.password !== user.confirmPassword) {
            errors.push('Password and Confirm Password do not match');
        }

        return errors;
    }


    const handleSignup = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        handleOpenBackdrop();


        const userObject = {
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
            confirmPassword: data.get('confirmPassword'),
        }

        console.log(userObject);

        const errors = validateUserObject(userObject);

        if (errors.length > 0) {
            console.error('Validation errors:', errors);
            setErrors(errors);
            // Handle errors (e.g., display to the user)
        } else {
            console.log('User object is valid:', userObject);
            // Proceed with further processing, such as form submission


            if (userObject.username.trim() && userObject.password.trim()) {
                try {
                    console.log(`${constants.nodeJsServer}/users/login`);
                    const response = await axios.post(`${constants.nodeJsServer}/users/register`, userObject)
                        .then(function (response) {
                            let res = response.data
                            if (res.success) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Successfully Registered",
                                    showDenyButton: false,
                                    showCancelButton: false,
                                    confirmButtonText: "Go to Login",
                                    // denyButtonText: `Don't save`
                                    allowOutsideClick: () => false
                                }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                        // Swal.fire("Saved!", "", "success");

                                        navigate("/login")

                                    } else if (result.isDenied) {
                                        Swal.fire("Changes are not saved", "", "info");
                                    }
                                });
                            } else {
                                // console.log("in user login success false");
                                // console.log(res);

                                Swal.fire({
                                    title: 'Error!',
                                    text: res.message,
                                    icon: 'error',
                                    confirmButtonText: 'Close',
                                    confirmButtonColor: "red"
                                    // showCancelButton: true,
                                })
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                            Swal.fire({
                                title: 'Error!',
                                text: "Something went wrong",
                                icon: 'error',
                                confirmButtonText: 'Close',
                                confirmButtonColor: "red"
                                // showCancelButton: true,
                            })
                        });
                } catch (error) {
                    console.error(error);
                }

            } else {
                Swal.fire({
                    title: 'Error!',
                    text: "Username and password required...",
                    icon: 'error',
                    confirmButtonText: 'Close',
                    confirmButtonColor: "red"
                    // showCancelButton: true,
                })
            }
        }







        handleCloseBackdrop();
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs"
                sx={{
                    // border: "1px solid",
                    minWidth: "100vw",
                    height: "90vh",
                    padding: "0px !important",
                    margin: "0px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <CssBaseline />


                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackdrop}
                // onClick={handleCloseBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>

                <Box
                    sx={{
                        marginTop: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',

                    }}
                >
                    <Avatar
                        alt="Logo"
                        src="/images/logo.png"
                        sx={{ width: 150, height: 150 }}
                    />
                    <Typography variant='h4' sx={{ fontWeight: 900, color: "gray", }}>
                        People Analytics
                    </Typography>

                    <Box component="form" onSubmit={handleSignup} noValidate sx={{
                        mt: 1, width: {
                            xs: '90vw', // width for extra-small screens
                            sm: '70vw', // width for small screens
                            md: '50vw', // width for medium screens
                            lg: '40vw', // width for large screens
                            xl: '40vw', // width for extra-large screens
                        },
                    }}>
                        <Box>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                className={errors.includes('Username is required') ? styles.error : ''}
                            />
                            {errors.includes('Username is required') && (
                                <Typography variant="p" className={styles["error-message"]}>Username is required</Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                            // autoComplete="email"
                            />
                            {errors.includes('Email is required') && (
                                <Typography variant="p" className={styles["error-message"]}>Email is required</Typography>
                            )}
                        </Box>

                        <Box>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                            // autoComplete="current-password"
                            />
                            {errors.includes('Password is required') && (
                                <Typography variant="p" className={styles["error-message"]}>Password is required</Typography>
                            )}

                        </Box>

                        <Box>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                            // autoComplete="current-password"
                            />
                            {errors.includes('Confirm Password is required') && (
                                <Typography variant="p" className={styles["error-message"]}>Confirm Password is required</Typography>
                            )}
                            {errors.includes('Password and Confirm Password do not match') && (
                                <Typography variant="p" className={styles["error-message"]}>Password and Confirm Password do not match</Typography>
                            )}

                        </Box>

                        <Box>
                            <Button
                                type="submit"
                                fullWidth
                                size='large'
                                variant="contained"
                                sx={{
                                    mt: 3, mb: 2, padding: "10px !important",
                                    bgcolor: "#952D98",
                                    '&:hover': {
                                        bgcolor: '#952D98',
                                        opacity: 0.9
                                    }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Typography onClick={() => navigate("/login")}
                            sx={{
                                textAlign: "end", color: "#2C6FBB", fontWeight: "bold", cursor: "pointer", transition: "all .2s ease",
                                '&:hover': {
                                    // opacity: 0.7,
                                    color: "#44C8F5",
                                    transition: "all .2s ease"
                                }
                            }}>Already have an account!</Typography>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider >
    );
}