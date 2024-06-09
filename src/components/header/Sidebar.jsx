import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import CarCrashOutlinedIcon from '@mui/icons-material/CarCrashOutlined';
import './header.css'
import SocialDistanceOutlinedIcon from '@mui/icons-material/SocialDistanceOutlined';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function AppDrawer(props) {

  const navigate = useNavigate()

  // ------------------------------
  const selector = useSelector(data => data.headerHeight);
  const [heightOffset, setHeightOffset] = useState(`${selector}`)
  useEffect(() => {
    setHeightOffset(selector)
  }, [selector])
  // ------------------------------

  // console.log("props.pageName", props.pageName);

  const sidbarListItems = [
    {
      name: 'People Analytics',
      icon: <SocialDistanceOutlinedIcon style={{ color: 'rgb(128, 130, 133)' }} />,
      route: '/'
    }
  ]
  const handleClick = (route, pageName) => {
    navigate(route)
    props.setPageName(pageName)
  }
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={props.toggleDrawer(anchor, false)}
      onKeyDown={props.toggleDrawer(anchor, false)}
    >
      <List>
        {sidbarListItems.map((item, index) => (
          <ListItem key={index} disablePadding onClick={() => handleClick(item.route, item.name.replace(" ", ""))}>
            <ListItemButton>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon style={{ color: '#fff' }} /> : <MailIcon style={{ color: '#fff' }} />} */}
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name}
                sx={{ fontFamily: 'DINArabic_Medium' }}
                className={`drawerItemText ${(props.pageName == item.name.replace(" ", "")) && 'drawerItemActive'}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {["left", "right", "top", "bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          {/* <Button onClick={props.toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <Drawer
            anchor={anchor}
            open={props.state[anchor]}
            onClose={props.toggleDrawer(anchor, false)}
            PaperProps={{
              sx: {
                background: '#fff',
                color: 'rgb(128, 130, 133)',
                height: "calc(100%)",
                width: 'max-content',
                position: 'relative',
                top: `${heightOffset}px`,
                overflow: 'hidden',
                display: 'flex',
                paddingTop: '10px',
                transition: 'all .5s ease'
                // background: (props.theme === "default" ? `#063f45` : props.theme === 'light' ? '#dee1e6' : "#031f22"),
                // borderTopRightRadius: 5,
                // borderBottomRightRadius: 5,
              },
            }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
