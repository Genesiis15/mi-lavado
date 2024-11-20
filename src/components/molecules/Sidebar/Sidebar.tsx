import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { menuSidebar } from "../../../utils/menuSidebar";

export const Sidebar = ({toggleDrawer}:{toggleDrawer: ()=>void}) =>{

    return (<>
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <List>
        {menuSidebar.map(({ title, url }, index) => (
          <Link to={url} key={index}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => Navigate({ to: url })}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{ color: "black", textDecoration: "none" }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {["Cerrar Sesión"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
    </>)
}
