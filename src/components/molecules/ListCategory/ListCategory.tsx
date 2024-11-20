import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { ICategories } from "../../../interface/interfaceInventory";

interface Props {
    categories: ICategories[]
}

export const ListCategory =({categories}:Props)=>{
  
  return <>
 <List>
        {categories.map(({name, idCategory}, index) => (
          <ListItem key={idCategory} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
  </>
}