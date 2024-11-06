import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import {  useState, useEffect } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {  collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from 'axios';
import { IFormData, ITipoLavado, IDolarRate } from '../../../interface/interfaceWash';
import { convertPrice } from '../../../utils/convertPrice';

interface Props {
    onSubmit: (data:IFormData) => void
}

  type lavadores = string[];

const FormClientWash=({onSubmit}:Props)=>{
  const mobileView = useMediaQuery("(max-width: 600px)");
    const modalSize = mobileView ? "300px" : "500px";
    const [lavadores, setLavadores] = useState<lavadores[]>([]);
    const [dolarRate, setDolarRate] = useState<IDolarRate>({  monitors: {
      bcv: {
        price: 0
      }
    }});
    const [tipoLavado, setTipoLavado] = useState<ITipoLavado[]>([]);
    const [data, setData] = useState<IFormData>({
        cliente: "",
        lavadores: "",
        tipoLavado: "",
        formaPago: "",
        timestamp: Date.now(),
        price: 0,
        priceBs: 0,
        opcionAdicional: "",
      });

    const style = {
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        borderRadius: "5px",
        boxShadow: 24,
        p: 4,
        width: modalSize,
        height: "auto",
        maxWidth: "none",
        maxHeight: "none",
        overflow: "hidden",
      };
      const obtenerDatosLabadores = async () => {
        const querySnapshot = await getDocs(collection(db, "lavadores"));
        querySnapshot.forEach((doc) => {
          setLavadores(doc.data().lavadores);
        });
      };

      const disabledHandle = () => {
        if (
          data.cliente.length > 0 &&
          data.lavadores.length > 0 &&
          data.tipoLavado.length > 0
        ) {
          return false;
        }
        return true;
      };

  

      const handleValueLavadoModal = (value: string) => {
        console.log(value);
        if (value === "Formula Marina" || value === "Motor") {
          if (value === "Formula Marina") {
            if (data.tipoLavado === "Carros") {
              setData({ ...data, price: 15, priceBs: convertPrice(15, dolarRate), opcionAdicional: value });
            }
            if (data.tipoLavado === "Vans") {
              setData({ ...data, price: 20, priceBs:convertPrice(20, dolarRate), opcionAdicional: value });
            }
            if (data.tipoLavado === "Rust Peq") {
              setData({ ...data, price: 16, priceBs:convertPrice(16, dolarRate), opcionAdicional: value });
            }
            if (data.tipoLavado === "Rust Grande") {
              setData({ ...data, price: 17, priceBs:convertPrice(17, dolarRate), opcionAdicional: value });
            }
          }
          if (value === "Motor") {
            if (data.tipoLavado === "Carros") {
              setData({ ...data, price: 20, priceBs:convertPrice(20, dolarRate), opcionAdicional: value });
            }
            if (data.tipoLavado === "Vans") {
              setData({ ...data, price: 25, priceBs:convertPrice(25, dolarRate), opcionAdicional: value });
            }
            if (data.tipoLavado === "Rust Peq") {
              setData({ ...data, price: 21, priceBs:convertPrice(21, dolarRate), opcionAdicional: value });
            }
            if (data.tipoLavado === "Rust Grande") {
              setData({ ...data, price: 22, priceBs:convertPrice(22, dolarRate), opcionAdicional: value });
            }
          }
        } else {
          if (value === "Carros") {
            setData({ ...data, tipoLavado: value, price: 10, priceBs:convertPrice(10, dolarRate), opcionAdicional: "" });
          }
          if (value === "Rust Peq") {
            setData({ ...data, tipoLavado: value, price: 11, priceBs:convertPrice(11, dolarRate), opcionAdicional: "" });
          }
          if (value === "Rust Grande") {
            setData({ ...data, tipoLavado: value, price: 12, priceBs:convertPrice(12, dolarRate), opcionAdicional: "" });
            return 12;
          }
          if (value === "Vans") {
            setData({ ...data, tipoLavado: value, price: 15, priceBs:convertPrice(15, dolarRate), opcionAdicional: "" });
            return 15;
          }
        }
      };
      const obtenerDatos = async () => {
        const querySnapshot = await getDocs(collection(db, "tipoLavado"));
        querySnapshot.forEach((doc) => {
          setTipoLavado(doc.data().lavados as ITipoLavado[]);
        });
      };

      useEffect(() => {
        
        obtenerDatos();
        obtenerDatosLabadores();
        async function fetchDolarRate() {
            try {
              const response = await axios.get(
                "https://pydolarve.org/api/v1/dollar?page=dolartoday"
              );
      
              setDolarRate(response.data);
            } catch (error) {
              console.error("Error fetching dolar rate:", error);
            }
          }
          fetchDolarRate();
       
      }, []);

      
    return<>
     <Box sx={style}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                fontWeight={"bold"}
                component="h2"
              >
                Nuevo Registro de Lavado!
              </Typography>
              <Typography
                id="modal-modal-description"
                color="gray"
                sx={{ mt: 2 }}
              >
                Datos básicos
              </Typography>

              <form onSubmit={(e)=>{
                e.preventDefault()
                onSubmit(data)
              }}>
                <Stack spacing={2} mb={4}>
                  <TextField
                    onChange={(e) =>
                      setData({ ...data, cliente: e.target.value })
                    }
                    label="Cliente"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Seleccione un servicio</InputLabel>
                    <Select
                      onChange={(e: SelectChangeEvent) =>
                        handleValueLavadoModal(e.target.value)
                      }
                      placeholder="Tipo de lavado"
                    >
                      {tipoLavado.map((item, index) => (
                        <MenuItem key={index} value={item.type}>
                          {item.type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Opciones adicionales</InputLabel>
                    <Select
                      value={data.opcionAdicional}
                      onChange={(e) => handleValueLavadoModal(e.target.value)}
                      placeholder="Seleccione una opción adicional"
                    >
                      <MenuItem value="Motor">Motor</MenuItem>
                      <MenuItem value="Formula Marina">
                        {" "}
                        Formula Marina
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Método de pago</InputLabel>
                    <Select
                      onChange={(e: SelectChangeEvent) =>
                        setData({ ...data, formaPago: e.target.value })
                      }
                      placeholder="Método de pago"
                    >
                      <MenuItem value="Punto De Venta">Punto de venta</MenuItem>
                      <MenuItem value="Pago Móvil">Pago Móvil</MenuItem>
                      <MenuItem value="Bolívares">Bolívares</MenuItem>
                      <MenuItem value="Divisa">Divisa</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Lavador</InputLabel>
                    <Select
                      onChange={(e: SelectChangeEvent) =>
                        setData({ ...data, lavadores: e.target.value })
                      }
                      placeholder="lavadores"
                    >
                      {lavadores.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16 }} color="success" />
                  <Typography variant="body2">
                    Precio: $<b>{data.price}</b>
                    <b style={{ marginRight: 5, marginLeft: 5 }}>/</b>
                    Bs.F:{" "}
                    <b>
                      {dolarRate && (data.price * dolarRate.monitors.bcv.price).toFixed(0)}
                    </b>
                  </Typography>
                </Box>
                <Button
                  disabled={disabledHandle()}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Guardar
                </Button>
              </form>
            </Box>
    </>
}

  
  export default FormClientWash;