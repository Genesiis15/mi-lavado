import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FaceIcon from "@mui/icons-material/Face";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import SearchIcon from "@mui/icons-material/Search";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import {
  CircularProgress,
  InputAdornment,
  OutlinedInput,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";

import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  CalendarIcon,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

interface RowData {
  cliente: string;
  lavadores: string;
  tipoLavado: string;
  opcionAdicional: string;
  formaPago: string;
  timestamp: number;
  price: number;
}

interface RowDataId extends RowData {
  id: string;
}
// interface RowDataId {
//   cliente: string;
//   lavadores: string;
//   tipoLavado: string;
//   opcionAdicional: string;
//   formaPago: string;
//   timestamp: number;
//   id: string;
//   price: number;
// }

interface TipoLavado {
  type: string;
  value: string;
}



type lavadores = string[];

function App() {
  const mobileView = useMediaQuery("(max-width: 600px)");
  const buttonSize = mobileView ? "small" : "medium";
  const modalSize = mobileView ? "300px" : "500px";
  const [open, setOpen] = useState(false);
  const [tipoLavado, setTipoLavado] = useState<TipoLavado[]>([]);
  const [lavadores, setLavadores] = useState<lavadores[]>([]);
  const [data, setData] = useState<RowData>({
    cliente: "",
    lavadores: "",
    tipoLavado: "",
    formaPago: "",
    timestamp: Date.now(),
    price: 0,
    opcionAdicional: "",
  });

  const [dolarRate, setDolarRate] = useState<{
    monitors: {
      bcv: {
        price: number;
      };
    };
  } | null>(null);
  
  // const [lavados, setLavados] = useState<RowData[] | RowDataId[] | null>(null);
  const [lavados, setLavados] = useState<RowData[] | RowDataId[] | null>(null);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const [loader, setLoader] = useState(false);

  const [openModalDate, setOpenModalDate] = useState(false);
  const handleOpenModalDate = () => setOpenModalDate(true);
  const handleClose = () => setOpenModalDate(false);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setIsSearching(true);
  };

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

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  function handleOpen() {
    setOpen(true);
  }
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

  const formatNumber = (num: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(num);
  };

  const filterByDate = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    if (startDate !== null) {
      const endDateNew = new Date(startDate.getTime());
      endDateNew.setHours(23, 59, 59, 999);
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      try {
        startDate.setHours(0, 0, 0, 0);

        setLoader(true);
        const q = query(
          collection(db, "lavado"),
          where("timestamp", ">=", startDate.getTime()),
          where("timestamp", "<=", endDateNew.getTime())
        );
        const querySnapshot = await getDocs(q);
        const filteredResults: RowDataId[] = [];
        querySnapshot.docs.map((doc) => {
          console.log(doc.data());
          const dataL = doc.data() as RowData;
          filteredResults.push({
            ...dataL,
            id: doc.id,
          });
        });
        setLavados(filteredResults);
        setIsSearching(false);
      } catch (error) {
        console.error("Error al filtrar por fecha:", error);
        alert(
          "Ocurrió un error al buscar por fecha. Por favor, inténtelo nuevamente."
        );
      } finally {
        setLoader(false);
      }
    }
  };

  const createDoc = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "lavado"), {
        ...data,
        timestamp: Date.now(),
      });
      if (lavados) {
        setLavados([{ ...data, timestamp: Date.now() }, ...lavados]);
      }
      console.log("Document written with ID: ", docRef.id);
      handleCloseModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error adding document: ", error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setData({
      cliente: "",
      tipoLavado: "",
      lavadores: "",
      formaPago: "",
      timestamp: Date.now(),
      price: 0,
      opcionAdicional: "",
    });
  };

  // const handleValueLavado = (value: string) => {
  //   if (value === "Carros") {
  //     return 10;
  //   }
  //   if (value === "Rust Peq") {
  //     return 11;
  //   }
  //   if (value === "Rust Grande") {
  //     return 12;
  //   }
  //   if (value === "Vans") {
  //     return 15;
  //   }
  //   if (value === "Motor") {
  //     return 10;
  //   }
  //   if (value === "Formula Marina") {
  //     return 5;
  //   }
  // };
  const handleValueLavadoModal = (value: string) => {
    console.log(value);
    if (value === "Formula Marina" || value === "Motor") {
      if (value === "Formula Marina") {
        if (data.tipoLavado === "Carros") {
          setData({ ...data, price: 15, opcionAdicional: value });
        }
        if (data.tipoLavado === "Vans") {
          setData({ ...data, price: 20, opcionAdicional: value });
        }
        if (data.tipoLavado === "Rust Peq") {
          setData({ ...data, price: 16, opcionAdicional: value });
        }
        if (data.tipoLavado === "Rust Grande") {
          setData({ ...data, price: 17, opcionAdicional: value });
        }
      }
      if (value === "Motor") {
        if (data.tipoLavado === "Carros") {
          setData({ ...data, price: 20, opcionAdicional: value });
        }
        if (data.tipoLavado === "Vans") {
          setData({ ...data, price: 25, opcionAdicional: value });
        }
        if (data.tipoLavado === "Rust Peq") {
          setData({ ...data, price: 21, opcionAdicional: value });
        }
        if (data.tipoLavado === "Rust Grande") {
          setData({ ...data, price: 22, opcionAdicional: value });
        }
      }
    } else {
      if (value === "Carros") {
        setData({ ...data, tipoLavado: value, price: 10, opcionAdicional: "" });
      }
      if (value === "Rust Peq") {
        setData({ ...data, tipoLavado: value, price: 11, opcionAdicional: "" });
      }
      if (value === "Rust Grande") {
        setData({ ...data, tipoLavado: value, price: 12, opcionAdicional: "" });
        return 12;
      }
      if (value === "Vans") {
        setData({ ...data, tipoLavado: value, price: 15, opcionAdicional: "" });
        return 15;
      }
    }
  };

  const handleInputChange = (e: string) => {
    console.log(e);

    const date = new Date(new Date(e).getTime());
    console.log(date);

    setStartDate(date);
    setOpenModalDate(false);
  };

  async function filterByLavadores() {
    try {
      const q = query(collection(db, "lavado"), where("cliente", "==", search));
      setLoader(true);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setIsSearching(false);
        alert("No se encontró ningún cliente con ese nombre");
        return;
      }

      const filteredResults: RowDataId[] = [];

      querySnapshot.forEach((doc) => {
        console.log(doc.data() as RowData);
        const dataL = doc.data() as RowData;
        filteredResults.push({
          ...dataL,
          id: doc.id,
        });
      });
      setLavados(filteredResults);
      setIsSearching(false);
    } catch (error) {
      console.error("Error al filtrar lavadores:", error);
      alert(
        "Ocurrió un error al buscar clientes. Por favor, inténtelo nuevamente."
      );
    } finally {
      setLoader(false);
    }
  }
  // const obtenerDatos = async () => {
  //   const querySnapshot = await getDocs(collection(db, "tipoLavado"));
  //   querySnapshot.forEach((doc) => {
  //     setTipoLavado(doc.data().lavados);
  //   });
  // };
  const obtenerDatos = async () => {
    const querySnapshot = await getDocs(collection(db, "tipoLavado"));
    querySnapshot.forEach((doc) => {
      setTipoLavado(doc.data().lavados as TipoLavado[]);
    });
  };
  // const obtenerDatosLabadores = async () => {
  //   const querySnapshot = await getDocs(collection(db, "lavadores"));
  //   querySnapshot.forEach((doc) => {
  //     setLavadores(doc.data().lavadores as Lavadores);
  //   });
  // };
  const obtenerDatosLabadores = async () => {
    const querySnapshot = await getDocs(collection(db, "lavadores"));
    querySnapshot.forEach((doc) => {
      setLavadores(doc.data().lavadores);
    });
  };
  const obtenerData = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      setLoader(true);
      const q = query(
        collection(db, "lavado"),
        where("timestamp", ">=", startOfDay.getTime())
      );
      const querySnapshot = await getDocs(q);
      const res: RowData[] = [];
      querySnapshot.forEach((doc) => {
        console.log("datossssss", doc.data());

        res.push(doc.data() as RowData);
      });
      setLavados(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    filterByDate();
    obtenerDatos();
    obtenerDatosLabadores();
    obtenerData();
  }, []);
  useEffect(() => {
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

  // useEffect(() => {
  //   if (startDate) {
  //     filterByDate();
  //   }
  // }, [startDate]);
  useEffect(() => {
    if (startDate !== null) {
      filterByDate();
    }
  }, [startDate]);

  useEffect(() => {
    if (search == "") {
      obtenerData();
    }
  }, [search]);
  // const getDate = (date: number) => {
  //   return moment(date).format("MMMM D, YYYY h:mm A");
  // };
  const getDate = (date: number) => {
    return moment(date).format("MMMM D, YYYY h:mm A");
  };
  
  return (
    <>
      {loader ? (
        <div
          style={{
            width: "90vh",
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div>
          <div className="App">
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocalCarWashIcon sx={{ fontSize: 30 }} color="info" />
                    <Typography
                      variant="h6"
                      fontWeight={"bold"}
                      color="primary"
                    >
                      Imperio Wash 777
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <OutlinedInput
                      style={{ marginBottom: 15, marginRight: 5 }}
                      onChange={handleChange}
                      value={search}
                      placeholder="Buscar..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          filterByLavadores();
                        }
                      }}
                      id="outlined-adornment-password"
                      type={"text"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={filterByLavadores}
                            aria-label="toggle password visibility"
                            edge="end"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      fullWidth
                    />

                    {isSearching && lavados && !lavados.length ? (
                      <Typography variant="caption" color="error">
                        No se encontró ningún cliente con ese nombre
                      </Typography>
                    ) : null}

                    <label htmlFor="dateClick">
                      <CalendarIcon
                        onClick={handleOpenModalDate}
                        style={{ color: "#5ea0ff", fontSize: 35 }}
                      />

                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          open={openModalDate}
                          // onOpenChange={(newOpen: boolean) => setOpenModalDate(newOpen)}
                          onClose={handleClose}
                          // eslint-disable-next-line
                          // @ts-ignore
                          onChange={(e: string) => handleInputChange(e)}
                          sx={{ display: "none" }}
                        />
                      </LocalizationProvider>
                    </label>
                  </Box>
                </Grid>

                {!mobileView && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Button
                      sx={{ minWidth: 100, maxWidth: 280, marginBottom: 2 }}
                      onClick={handleOpen}
                      variant="outlined"
                      fullWidth
                      size={buttonSize}
                    >
                      Registrar Cliente
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          </div>

          {mobileView && (
            <Button
              sx={{
                marginBottom: 2,
                position: "fixed",
                bottom: 0,
                right: 0,
                borderRadius: 30,
              }}
              onClick={handleOpen}
              variant="contained"
              size={buttonSize}
            >
              +
            </Button>
          )}
          <Typography variant="h6" gutterBottom sx={{ textAlign: "end" }}>
            BCV: <b>Bs.F {dolarRate && Number(dolarRate.monitors.bcv.price)}</b>
          </Typography>
          {!mobileView ? (
            <TableContainer component={Paper} sx={{}}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Fecha </StyledTableCell>
                    <StyledTableCell align="right">Cliente</StyledTableCell>
                    <StyledTableCell align="right">Lavador</StyledTableCell>
                    <StyledTableCell align="right">
                      Servicio de Lavado
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Método de pago
                    </StyledTableCell>
                    <StyledTableCell align="right">Precio</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lavados && lavados.length > 0 ? (
                    lavados.map((row) => (
                      <StyledTableRow key={row.cliente}>
                        <StyledTableCell>
                          {moment(row.timestamp).format(
                            "MMMM D, YYYY  h:mm A"
                          ) ?? "Sin fecha"}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.cliente}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.lavadores}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          {row.tipoLavado.slice(0, 1).toLocaleUpperCase() +
                            row.tipoLavado.substring(1) +
                            (row.opcionAdicional && " + ") +
                            row.opcionAdicional}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <Chip
                            size="small"
                            label={
                              row.formaPago.slice(0, 1).toLocaleUpperCase() +
                              row.formaPago.substring(1)
                            }
                            color={
                              row.formaPago === "Pago Móvil" ||
                              row.formaPago === "Bolívares" ||
                              row.formaPago === "Punto De Venta"
                                ? "primary"
                                : row.formaPago === "Divisa"
                                ? "success"
                                : "default"
                            }
                            variant="outlined"
                          />
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Typography variant="body2"
                          
                          >
                            <b>${row.price}</b> /
                            <b>
                              {" "}
                              Bs.F
                             
                              {dolarRate && row.price *  
                               // eslint-disable-next-line
                              // @ts-ignore
                              dolarRate.monitors.bcv.price.toFixed(0)}
                            </b>
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2">
                          Sin datos cargados
                        </Typography>
                      </TableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <>
              {lavados &&
                lavados.map((row) => (
                  <Card sx={{ marginBottom: 2 }}>
                    <CardHeader
                      title={row.cliente}
                      style={{
                        padding: 15,
                        background: "black",
                        color: "white",
                      }}
                      subheader={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="inherit"
                            style={{ color: "white" }}
                          >
                            {getDate(row.timestamp)}
                          </Typography>
                          <Chip
                            sx={{
                              backgroundColor: "white",
                              color: "black",
                              fontWeight: "bold",
                            }}
                            variant="filled"
                            color={"success"}
                            icon={<FaceIcon />}
                            label={row.lavadores}
                          />
                        </div>
                      }
                    />
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        paddingTop: 0,
                        marginTop: 10,
                      }}
                    >
                      <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                        <WaterDropIcon sx={{ fontSize: 14 }} color="primary" />
                        <Typography variant="body2">Tipo de lavado:</Typography>
                        {tipoLavado && (
                          <Chip
                            size="small"
                            label={
                              row.tipoLavado.slice(0, 1).toLocaleUpperCase() +
                              row.tipoLavado.substring(1) +
                              (row.opcionAdicional && " + ") +
                              row.opcionAdicional
                            }
                            color={
                              row.tipoLavado === "Rust Peq"
                                ? "primary"
                                : row.tipoLavado === "Rust Grande"
                                ? "primary"
                                : row.tipoLavado === "Vans"
                                ? "error"
                                : row.tipoLavado === "Motor"
                                ? "secondary"
                                : row.tipoLavado === "Formula Marina"
                                ? "error"
                                : row.tipoLavado === "Carros"
                                ? "warning"
                                : "default"
                            }
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                        <AttachMoneyIcon
                          sx={{ fontSize: 16 }}
                          color="success"
                        />

                        <Typography variant="body2">
                          <b>${row.price}</b> /
                          <b>
                            {" "}
                            Bs.F
                            {dolarRate && row.price * Number(dolarRate.monitors.bcv.price)}
                          </b>
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                        <LocalCarWashIcon sx={{ fontSize: 14 }} />
                        <Typography variant="body2">
                          Método de pago: <b>{row.formaPago}</b>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </>
          )}

         
          <Typography variant="h6" gutterBottom>
            Total de precios:{" "}
            <b>
              $
              {lavados !== null && formatNumber(
                lavados.reduce((total, row) => total + row.price, 0)
              )}
              <b style={{ marginRight: 5, marginLeft: 5 }}>/</b>
              <b style={{ marginRight: 2, marginLeft: 2 }}>Bs.F </b>
              {dolarRate !== null && lavados !== null ?
                formatNumber(
                  lavados.reduce((total, row) => total + row.price, 0) * dolarRate.monitors.bcv.price
                ): ''}
            </b>
          </Typography>

          <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
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

              <form onSubmit={createDoc}>
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
                      {dolarRate && data.price * dolarRate.monitors.bcv.price}
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
          </Modal>
        </div>
      )}
    </>
  );
}

export default App;
