import {
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IProducts } from "../../../interface/interfaceInventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { IDolarRate } from "../../../interface/interfaceWash";

interface Props {
  data: IProducts[];
  deleteItemCar: (item: IProducts) => void;
  sendSell: (data: { products: IProducts[]; formaPago: string }) => void;
}

export const DetailsCar = ({ data, deleteItemCar, sendSell }: Props) => {
  const [showCart, setShowCart] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [dataFinal, setDataFinal] = useState({ products: data, formaPago: "" });

  const [dolarRate, setDolarRate] = useState<IDolarRate>({
    monitors: {
      bcv: {
        price: 0,
      },
    },
  });

  const viewCart = () => {
    setShowCart(!showCart);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteItem = (item: IProducts) => {
    deleteItemCar(item);
    if (data.length === 1) {
      handleCloseModal();
    }
  };

  // Calcular el total en divisas
  const calculateTotalUSD = () => {
    return data.reduce((acc, item) => acc + item.price * item.count, 0);
  };

  // Calcular el total en bolívares
  const calculateTotalBs = () => {
    return calculateTotalUSD() * (dolarRate.monitors.bcv.price || 0);
  };

  useEffect(() => {
    fetch("https://pydolarve.org/api/v1/dollar?page=dolartoday")
      .then((res) => res.json())
      .then((data) => setDolarRate(data));
  }, []);

  return (
    <>
      <>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
          >
            <Button variant="contained" color="secondary" onClick={viewCart}>
              Ver Carrito ({data.length})
            </Button>
          </Box>
        </Box>

        {showCart && (
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            /*          BackdropComponent={Backdrop}
             */ BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  maxWidth: 600,
                  maxHeight: "90vh",
                  overflow: "auto",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Carrito de Compras
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Método de pago</InputLabel>
                  <Select
                    onChange={(e: SelectChangeEvent) =>
                      setDataFinal({
                        products: data,
                        formaPago: e.target.value,
                      })
                    }
                    placeholder="Método de pago"
                  >
                    <MenuItem value="Punto De Venta">Punto de venta</MenuItem>
                    <MenuItem value="Pago Móvil">Pago Móvil</MenuItem>
                    <MenuItem value="Bolívares">Bolívares</MenuItem>
                    <MenuItem value="Divisa">Divisa</MenuItem>
                  </Select>
                </FormControl>
                <List dense={false}>
                  {data.map((item) => (
                    <ListItem key={item.idProduct}>
                      <ListItemText
                        primary={`${item.name} (${item.count})`}
                        secondary={`Bs.F ${item.price}`}
                      />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Typography display="flex" alignItems="center">
                    <AttachMoneyIcon sx={{ fontSize: 20 }} color="success" />
                    Total en USD: ${calculateTotalUSD().toFixed(2)}
                  </Typography>
                  <Typography display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <AttachMoneyIcon sx={{ fontSize: 20 }} color="primary" />
                    Total en Bs.F: {calculateTotalBs().toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sendSell(dataFinal)}
                >
                  Procesar Orden
                </Button>
              </Box>
            </Fade>
          </Modal>
        )}
      </>
    </>
  );
};
