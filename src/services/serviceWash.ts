import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { IFormData, RowDataId, ITipoLavado } from "../interface/interfaceWash";

export const addWash = async (data: IFormData)=>{
     await addDoc(collection(db, "lavado"), {
        ...data,
        timestamp: Date.now(),
      });

    

}

export const getWashData = async ()=>{
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const q = query(
          collection(db, "lavado"),
          where("timestamp", ">=", startOfDay.getTime())
        );
        const querySnapshot = await getDocs(q);
        const res: IFormData[] = [];
        querySnapshot.forEach((doc) => {
          res.push(doc.data() as IFormData);
        });
        return res
      } catch (error) {
        throw new Error(error as string)
      }
    };

    export const getTypeWashes = async ()=>{
        const querySnapshot = await getDocs(collection(db, "tipoLavado"));
        let res: ITipoLavado[] = []
        querySnapshot.forEach((doc) => {
          res=(doc.data().lavados as ITipoLavado[]);
        });  
        return res
    };

    export const filterWash = async (search: string)=>{
         
           try{
            const q = query(collection(db, "lavado"), where("cliente", "==", search));
            // setLoader(true);
            const querySnapshot = await getDocs(q);
      
            if (querySnapshot.empty) {
            //   setIsSearching(false);
              alert("No se encontró ningún cliente con ese nombre");
            }
      
            const filteredResults: RowDataId[] = [];
      
            querySnapshot.forEach((doc) => {
              const dataL = doc.data() as IFormData;
              filteredResults.push({
                ...dataL,
                id: doc.id,
              });
            });
            return filteredResults
           }catch (error) {
            throw new Error(error as string)
          }
           
          
    }

    export const dateWash = async (startDate: Date | null)=>{
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      if (startDate !== null) {
        const endDateNew = new Date(startDate.getTime());
        endDateNew.setHours(23, 59, 59, 999);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
      try {
        startDate.setHours(0, 0, 0, 0);

        // setLoader(true);
        const q = query(
          collection(db, "lavado"),
          where("timestamp", ">=", startDate.getTime()),
          where("timestamp", "<=", endDateNew.getTime())
        );
        const querySnapshot = await getDocs(q);
        const filteredResults: IFormData[] | RowDataId[] | null = [];
        querySnapshot.docs.map((doc) => {
          console.log(doc.data());
          const dataL = doc.data() as IFormData;
          filteredResults.push({
            ...dataL,
            id: doc.id,
          });
        });
        return filteredResults
        // setLavados(filteredResults);
      } catch (error) {
        console.error("Error al filtrar por fecha:", error);
        alert(
          "Ocurrió un error al buscar por fecha. Por favor, inténtelo nuevamente."
        );
      } finally {
        // setLoader(false);
      }
    }
    return []
    }

