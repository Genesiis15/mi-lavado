import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { ICategories, IProducts } from "../interface/interfaceInventory";

export const sellInventory = async (data: IProducts[])=>{
 /*  await addDoc(collection(db, "sellInventory"), {
     ...data,
     timestamp: Date.now(),
   });
 */
 data.map(async(item) =>{
  await addDoc(collection(db, "sellInventory"), {
    ...item,
    timestamp: Date.now(),
  });
 })

}
export const addProduct = async (data: IProducts)=>{
  await addDoc(collection(db, "products"), {
     ...data,
   });

 

}
export const getCategory = async () => {
  try {
    const q = query(collection(db, "categories"));
    const querySnapshot = await getDocs(q);
    const res: ICategories[] = [];
    querySnapshot.forEach((doc) => {
      res.push({ ...doc.data(), idCategory: doc.id } as ICategories);
    });
    console.log(res);
    
    return res;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getProducts = async () => {
  try {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const res: IProducts[] = [];
    querySnapshot.forEach((doc) => {
      res.push({ ...doc.data(), idProduct: doc.id } as IProducts);
    });
    console.log(res);

    return res;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getSellProducts = async () => {
  try {
    const q = query(collection(db, "sellInventory"));
    const querySnapshot = await getDocs(q);
    const res: IProducts[] = [];
    querySnapshot.forEach((doc) => {
      res.push({ ...doc.data(), idProduct: doc.id } as IProducts);
    });
    console.log(res);

    return res;
  } catch (error) {
    throw new Error(error as string);
  }
};
