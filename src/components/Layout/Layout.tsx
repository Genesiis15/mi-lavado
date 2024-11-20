import {  Drawer, Stack, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import { Sidebar } from "../molecules/Sidebar/Sidebar";
interface Props {
    children: ReactNode;
  }
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";

export const Layout = ({children}:Props) => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };
  return (
    <div>
            <Stack direction="row" alignItems="center" spacing={1} onClick={toggleDrawer(true)} sx={{cursor:'pointer'}}>
        
        <LocalCarWashIcon sx={{ fontSize: 30 }} color="info" />
        <Typography variant="h6" fontWeight={"bold"} color="primary">
          Imperio Wash 777
        </Typography>
      </Stack>
       
              <Drawer open={open} onClose={toggleDrawer(false)}>
                <Sidebar toggleDrawer={toggleDrawer(false)}/>
              </Drawer>
              <section>
                {children}
              </section>
    </div>
  )
}
