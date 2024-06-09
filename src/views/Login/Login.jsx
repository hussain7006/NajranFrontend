import * as React from 'react';
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

export default function SignIn() {

    // const isLoggedIn = useSelector(data => data.isLoggedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate()



    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleOpenBackdrop = () => {
        setOpenBackdrop(true);
    };




    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        handleOpenBackdrop();

        let userObject = {
            username: data.get('username'),
            password: data.get('password'),
        }

        if (userObject.username.trim() && userObject.password.trim()) {
            try {
                console.log(`${constants.nodeJsServer}/users/login`);
                const response = await axios.post(`${constants.nodeJsServer}/users/login`, userObject)
                    .then(function (response) {
                        let res = response.data
                        if (res.success) {
                            // console.log("in user login success true");
                            // console.log(res);


                            setToken("accessToken", res.data.accessToken, constants.ACCESS_TOKEN_EXPIRY); // Set accessToken cookie to expire in 1 days
                            setToken("refreshToken", res.data.refreshToken, constants.REFRESH_TOKEN_EXPIRY); // Set refreshToken cookie to expire in 1 days
                            let customObj = {
                                id: res.data.user._id,
                                isLoggedIn: res.success,
                                username: res.data.user.username,
                                email: res.data.user.email,
                                mapImage: res.data.user.mapImage
                            }
                            console.log("customObj:", customObj);
                            dispatch({
                                type: "USERAUTH",
                                value: customObj,
                            })

                            navigate("/")
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

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
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
                            Sign In
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}