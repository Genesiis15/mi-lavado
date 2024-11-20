import { useEffect, useState } from "react"
// import { ListCategory } from "../../molecules/ListCategory/ListCategory"
import {addProduct, getCategory, getProducts,  sellInventory} from '../../../services/serviceInventory'
import {ICategories, IProducts} from '../../../interface/interfaceInventory'
import { ListProducts } from "../../molecules/ListProducts/ListProducts"
import { DetailsCar } from "../../molecules/DetailsCar/DetailsCar"
import { FormRegisterInventory } from "../../molecules/FormRegisterInventory/FormRegisterInventory"
import { Box, Button, Fade, Modal } from "@mui/material"

export const InventoryWash =()=>{

    const [products, setProducts] = useState<IProducts[]>([])
    const [categories, setCategories] = useState<ICategories[]>([]);
    const [car, setCar] = useState<IProducts[]>([])
    const [data, setData] = useState<IProducts[]>([]);
    const [showModal, setShowModal] = useState(false);
    const loadProducts =async()=>{
   
     const data= await getProducts()
     setProducts(data) 

    }


    

    const addCar =(product: IProducts)=>{
        setProducts(updateItemById(product.idProduct));
        if(car.some(({idProduct})=> idProduct === product.idProduct )){
            const index = car.findIndex(item => item.idProduct === product.idProduct)
            if (index !== -1) {
                setCar(car.map((item, i) => 
                    i === index ? { ...item, count: item.count + 1 } : item
                  )) 
              }
              
        }else{
            setCar([...car, product]);
        }
    }
    const updateItemById = (id:string) => {
        const index = products.findIndex(item => item.idProduct === id);
        
        if (index !== -1) {
          return products.map((item, i) => 
            i === index ? { ...item, count: item.count - 1 } : item
          );
        }
        
        return products; 
      }
    const deleteItemCar = (item: IProducts) => {
        setCar(car.filter(i => i.idProduct !== item.idProduct));

        const updatedData = data.map(product => 
          product.idProduct === item.idProduct ? { ...product, count: product.count + 1 } : product
        );

        setData(updatedData);

      };
      const sellData = async (data: {products: IProducts[], formaPago: string} ) =>{
       const dataFinal =  data.products.map((item)=>{
          return {...item, formaPago: data.formaPago}
        })
        
        await sellInventory(dataFinal)
      };
    useEffect(()=>{
        loadProducts()
        getCategory().then(res=>setCategories(res))
    },[])
 
    return <div>
    
    <div style={{display:'flex', marginTop: 10, marginLeft:8}}>
    {/* <div style={{width:'20%'}}>
    <ListCategory categories={categories}/>
    </div> */}
    <ListProducts products={products} addCar={addCar}/>
    <DetailsCar data={car} deleteItemCar={deleteItemCar} sendSell={sellData}  />
    <Box sx={{ position: 'sticky', top: 0, right: 0, zIndex: 1000 }}>
        <Button 
          sx={{ minWidth: 100, maxWidth: 280, marginBottom: 2, }}
          variant="outlined"
          fullWidth
          onClick={()=> setShowModal(true)}
        >
          Nuevo producto
        </Button>
      </Box>
    <Modal open={showModal} onClose={()=> setShowModal(false)}>
                <Fade in={showModal}>
                    <Box>
                        <FormRegisterInventory onClose={()=> setShowModal(false)} categories={categories} onSubmit={async(data)=> {await addProduct(data)}} />
                    </Box>
                </Fade>
            </Modal>
    </div>

    
    </div>
}