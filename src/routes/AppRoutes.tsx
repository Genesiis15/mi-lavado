import {  Route, Routes } from "react-router-dom";
import {ClientWashPage, InventoryWashPage} from '../views'
import { SellInventoryPage } from "../views/SellInventoryPage/SellInventoryPage";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/">
                <Route index element={<ClientWashPage/>} />
                <Route path="/inventory" element={<InventoryWashPage/>} />
                <Route path="/clientes" element={<SellInventoryPage/>} />

               
            </Route>
          
        </Routes>
    );
};
export default AppRoutes;