import { useEffect, useState } from "react";
import { IProducts } from "../../../interface/interfaceInventory";
import { ListClientInventory } from "../../molecules/ListClientInventory/ListClientInventory"
import { getSellProducts } from "../../../services/serviceInventory";


export const SellInventoryWash = () => {
    const [sell, setSell] = useState<IProducts[]>([]);

    const loadProducts = async () =>{
        const dataSell = await getSellProducts()
        setSell(dataSell)
    }

    useEffect(()=>{
     loadProducts()
    },[])

  return (
    <ListClientInventory sellInventory={sell}/>
  )
}
