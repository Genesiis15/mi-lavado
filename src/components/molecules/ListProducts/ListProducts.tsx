import Grid from '@mui/material/Grid2';

import { IProducts } from "../../../interface/interfaceInventory"
import { CardInventory } from "../CardInventory/CardInventory"

interface Props {
    products: IProducts[]
    addCar: (product: IProducts)=> void
    
}


export const ListProducts = ({products, addCar}:Props) => {

 
  return (
    <div>

        <Grid container spacing={2}>
            {products.map((data)=>
               <Grid size={{ xs: 12, md: 2 }}>
                 <CardInventory data={data} onClick={addCar}/>
               </Grid>

            )}
        </Grid>
    </div>
  )
}
