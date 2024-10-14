import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FaceIcon from '@mui/icons-material/Face';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import SearchIcon from '@mui/icons-material/Search';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { CircularProgress, InputAdornment, OutlinedInput, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase';


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
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CalendarIcon } from '@mui/x-date-pickers';

interface RowData {
  cliente: string;
  lavadores: string;
  tipoLavado: string;
  tipoVehiculo: string;
  timestamp: number;
}
interface RowDataId {
  cliente: string;
  lavadores: string;
  tipoLavado: string;
  tipoVehiculo: string;
  timestamp: number;
  id:string
}

interface TipoLavado {
  type: string;
  value: string
}

type tipoVehiculo = string

type lavadores = string


interface DatePickerInput extends HTMLElement {
  showPicker(): void;
}



function App() {
  // const mobileView = useMediaQuery('(max-width: 768px)');
  const mobileView = useMediaQuery('(max-width: 600px)');
  const buttonSize = mobileView ? 'small' : 'medium';
  const modalSize = mobileView ? '300px' : '500px';
  const [open, setOpen] = useState(false);
  const [tipoLavado, setTipoLavado] = useState<TipoLavado[]>([]);
  const [tipoVehiculo, setTipoVehiculo] = useState<tipoVehiculo[]>([]);
  const [lavadores, setLavadores] = useState<lavadores[]>([]);
  const [data, setData] = useState<RowData>({
    cliente: '',
    lavadores: '',
    tipoLavado: '',
    tipoVehiculo: '',
    timestamp: Date.now()
  });
  const [lavados, setLavados] = useState<RowData[] | RowDataId[] |null>(null);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
 
  const [loader, setLoader] = useState(false);



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
    setSearch(event.target.value)
    setIsSearching(true);
  };

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    borderRadius:'5px',
    boxShadow: 24,
    p: 4,
    width: modalSize, height: 'auto', maxWidth: 'none', maxHeight: 'none', overflow: 'hidden'
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },

    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function handleOpen() {
    setOpen(true);
  }
  const disabledHandle =()=>{
    if(data.cliente.length > 0 && data.lavadores.length > 0 && data.tipoLavado.length > 0 && data.tipoVehiculo.length > 0){
      return false
    }
    return true
  }



  const filterByDate = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    if (startDate !== null) {
      const endDateNew = new Date(startDate.getTime())
      endDateNew.setHours(23, 59, 59, 999)
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      // if (!startDate || !endDate) {
      //   console.log('No se han seleccionado fechas válidas');
      //   return;
      // }

      try {
        startDate.setHours(0, 0, 0, 0);
   
        setLoader(true)
        const q = query(
          collection(db, "lavado"),
          where("timestamp", ">=", startDate.getTime()),
          where("timestamp", "<=", endDateNew.getTime())
        );
        const querySnapshot = await getDocs(q);
        const filteredResults:RowDataId[] = [];
        querySnapshot.docs.map(doc => {
          console.log(doc.data());
          const dataL = doc.data() as RowData
          filteredResults.push({
            ...dataL,
            id: doc.id,
          });
        });
        setLavados(filteredResults);
        setIsSearching(false);
      } catch (error) {
        console.error('Error al filtrar por fecha:', error);
        alert('Ocurrió un error al buscar por fecha. Por favor, inténtelo nuevamente.');
      }finally{
        setLoader(false)
      }
    }

  };




  const createDoc = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
   
       if(data.cliente.length > 0 && data.lavadores.length > 0 && data.tipoLavado.length > 0 && data.tipoVehiculo.length > 0){
    console.log('entro',data);
        
        // const docRef = await addDoc(collection(db, "lavado"), {
        //   ...data,
        //   timestamp: Date.now(),
        // });
        // setLavados(prevLavados => [{ ...data, timestamp: Date.now() }, ...prevLavados]);
        // console.log("Document written with ID: ", docRef.id);
        // handleCloseModal();
      }
    try {
    
        const docRef = await addDoc(collection(db, "lavado"), {
          ...data,
          timestamp: Date.now(),
        });
        if(lavados){

          setLavados([{ ...data, timestamp: Date.now() },...lavados])
        }
        // setLavados(prevLavados => {
        //   if(prevLavados){
        //    return[{ ...data, timestamp: Date.now() }, ...prevLavados]
        //   }
        // });
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
      cliente: '',
      tipoVehiculo: '',
      tipoLavado: 'Basico',
      lavadores: '',
      timestamp: Date.now()
    });
  };

  const handleValueLavado = (value: string) => {
    if (value === 'basico') {
      return 10
    }
    if (value === 'fuerte') {
      return 20
    }
    if (value === 'medio') {
      return 15
    }
    return 0
  };
  const handleDateClick = () => {
    const input = document.getElementById('dateClick') as DatePickerInput;

    if (input) {
      // Simular un click en el input
      input.click();
  
      // Si el navegador soporta showPicker(), usarlo
      if ('showPicker' in input) {
        input.showPicker();
      }
    }
  };
  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    const date = new Date(new Date(e.target.value).getTime() + 86400000);
    console.log(date);

    setStartDate(date);
  };

  async function filterByLavadores() {

    try {

      const q = query(
        collection(db, "lavado"),
        where("cliente", "==", search)
      );
      setLoader(true)
      const querySnapshot = await getDocs(q);


      if (querySnapshot.empty) {
        setIsSearching(false);
        alert('No se encontró ningún cliente con ese nombre');
        return;
      }

      const filteredResults:RowDataId[] = [];

      querySnapshot.forEach((doc) => {
        console.log(doc.data() as RowData)
        const dataL = doc.data() as RowData
        filteredResults.push({
          ...dataL,
          id: doc.id,
        });
      });
      setLavados(filteredResults);
      setIsSearching(false);

    } catch (error) {
      console.error('Error al filtrar lavadores:', error);
      alert('Ocurrió un error al buscar clientes. Por favor, inténtelo nuevamente.');

    }finally{
      setLoader(false)
    }


    // return filteredResults.slice(0, limit);
  }
  const obtenerDatos = async () => {
   
    const querySnapshot = await getDocs(collection(db, "tipoLavado"));
    querySnapshot.forEach((doc) => {

      setTipoLavado(doc.data().lavados)

    });
  };

  const obtenerDatosVehiculo = async () => {
    const querySnapshot = await getDocs(collection(db, "tipoVehiculo"));
    querySnapshot.forEach((doc) => {

      setTipoVehiculo(doc.data().vehiculos)

    });

  };
  const obtenerDatosLabadores = async () => {
    const querySnapshot = await getDocs(collection(db, "lavadores"));
    querySnapshot.forEach((doc) => {

      setLavadores(doc.data().lavadores)

    });

  };
  const obtenerData = async () => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      setLoader(true)
      const q = query(
        collection(db, "lavado"),
        where("timestamp", ">=", startOfDay.getTime()),
  
      );
      const querySnapshot = await getDocs(q);
      const res: RowData[] = []
      querySnapshot.forEach((doc) => {
        console.log('datossssss', doc.data())
       
        res.push(doc.data() as RowData)
  
  
      });
      setLavados(res)
    } catch (error) {
      console.log(error)
    }finally{
      setLoader(false)
    }
  };
  useEffect(() => {
    filterByDate();
    obtenerDatos();
    obtenerDatosVehiculo();
    obtenerDatosLabadores();
    obtenerData();
  }, []);

  useEffect(() => {
    if (startDate) {
      filterByDate();
    }
  }, [startDate]);

  useEffect(() => {
    if (search == '') {
      obtenerData();
    }
  }, [search])
  const getDate = (date: number) => {
    return moment(date).format('MMMM D, YYYY h:mm A')
  }
  return (
    <>
    {
      loader ?<div style={{width:'90vh', height:'90vh', display:'flex',
        justifyContent:'center',
        alignItems:'center'
      }}>
        <CircularProgress color="primary" />
      </div>:     <div>
      <div className="App">
        <Box sx={{ flexGrow: 1 }}>

          <Grid container spacing={2}>

            <Grid  size={{ xs: 12, md: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocalCarWashIcon sx={{ fontSize: 30 }} color='info'/>
                <Typography variant="h6" fontWeight={'bold'} color='primary'>
                  Imperio Wash 777
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} >

              <Box


                sx={{ display: 'flex', alignItems: 'center' }}

              >
                
<OutlinedInput
    style={{marginBottom:15, marginRight:5}}
    onChange={handleChange}
    value={search}
    placeholder="Buscar..."
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        filterByLavadores();
      }
    }}
            id="outlined-adornment-password"
            type={'text'}
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

                  <CalendarIcon  onClick={handleDateClick} style={{color:'#5ea0ff', fontSize:35}}/>
                  <input type="date" name="dateClick" id="dateClick" onChange={handleInputChange} style={{ width:0, height:0, border:'none', position:'absolute', bottom:'60%', left:'40%'}} />
                </label>
              </Box>

            </Grid>



            {!mobileView && <Grid size={{ xs: 12, md: 4 }} >
              <Button sx={{ minWidth: 100, maxWidth: 280, marginBottom: 2, }}
                onClick={handleOpen}
                variant="outlined"
                fullWidth
                size={buttonSize}
              >Registrar Cliente</Button>

            </Grid>
            }
          </Grid>
        </Box>

      </div>

      {mobileView &&
      
      <Button sx={{ marginBottom: 2, position: 'fixed', bottom: 0, right: 0, borderRadius:30 }}
        onClick={handleOpen}
        variant='contained'

        size={buttonSize}
      >+</Button>}
      {!mobileView ?
        <TableContainer component={Paper} sx={{}}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell >Fecha </StyledTableCell>
                <StyledTableCell align="right">Cliente</StyledTableCell>
                <StyledTableCell align="right">Lavador</StyledTableCell>
                <StyledTableCell align="right">Servicio de Lavado</StyledTableCell>
                <StyledTableCell align="right">Precio</StyledTableCell>
                <StyledTableCell align="right">Vehiculo </StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {lavados && lavados.length > 0   ? (
                lavados.map((row) => (
                  <StyledTableRow key={row.cliente}>
                    <StyledTableCell >{moment(row.timestamp).format('MMMM D, YYYY  h:mm A') ?? 'Sin fecha'}</StyledTableCell>
                    <StyledTableCell align="right">{row.cliente}</StyledTableCell>
                    <StyledTableCell align="right">{row.lavadores}</StyledTableCell>
                    <StyledTableCell align="right">{row.tipoLavado.slice(0, 1).toLocaleUpperCase() + row.tipoLavado.substring(1)}</StyledTableCell>
                    <StyledTableCell align="right">${handleValueLavado(row.tipoLavado)}</StyledTableCell>

                    <StyledTableCell align="right">{row.tipoVehiculo}</StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2">Sin datos cargados</Typography>
                  </TableCell>
                </StyledTableRow>)}
            </TableBody>
          </Table>

        </TableContainer> : <>
          {lavados && lavados.map(row =>
            <Card sx={{ marginBottom: 2 }}>

              <CardHeader
                title={row.cliente}
                style={{
                  padding: 15,
                  background: 'black',
                  color: 'white'
                }}
                subheader={
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <Typography
                    variant="subtitle2"
                    color="inherit"
                    style={{ color: 'white' }}
                  >
                    {getDate(row.timestamp)}
                

                  </Typography>
                      <Chip 
                      sx={{backgroundColor:'white', color:'black', fontWeight:'bold'}}
                        variant="filled"
                        color={'success'}
                   
                      icon={<FaceIcon />} label={row.lavadores} />
                      </div>
                  //   <Typography variant="body2">
                  //   <Stack direction="row" spacing={1}>
    
                  //   </Stack>
    
                  // </Typography>
                }
               
              
                

              />
              <CardContent style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingTop: 0,
                marginTop: 10
              }}
              >
               
                <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                  <WaterDropIcon sx={{ fontSize: 14 }} color='primary'/>
                  <Typography variant="body2">Tipo de lavado:</Typography>
                  {tipoLavado && (
                    <Chip
                    size='small'
                      label={row.tipoLavado.slice(0, 1).toLocaleUpperCase() + row.tipoLavado.substring(1)}
                      color={row.tipoLavado === 'basico' ? 'primary' : row.tipoLavado === 'medio' ? 'secondary' : row.tipoLavado === 'fuerte' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  )}
                </Box>
                <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: 16 }} color='success'/>
                  <Typography variant="body2">Precio: $<b>{handleValueLavado(row.tipoLavado).toFixed(2)}</b>

                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
                  <LocalCarWashIcon sx={{ fontSize: 14 }} />
                  <Typography variant="body2">Tipo de vehículo: <b>{row.tipoVehiculo}</b></Typography>
                </Box>



              </CardContent>
            </Card>)}
        </>
      }

   
      <Typography variant="h6" gutterBottom>Total de precios: <b>${lavados && lavados.reduce((total, row) => total + handleValueLavado(row.tipoLavado), 0).toFixed(2)}</b></Typography>

      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box sx={style} >
          <Typography id="modal-modal-title" variant="h6" fontWeight={'bold'} component="h2">
            Nuevo Registro de Lavado!
          </Typography>
          <Typography id="modal-modal-description"  color='gray' sx={{ mt: 2 }}>
            Datos básicos
          </Typography>

          <form onSubmit={createDoc} >
            <Stack spacing={2} mb={2} >
              <TextField onChange={(e) => setData({ ...data, cliente: e.target.value })} label="Cliente" />
              <FormControl fullWidth>
                <InputLabel>Seleccione un vehículo</InputLabel>
                <Select onChange={(e: SelectChangeEvent) => setData({ ...data, tipoVehiculo: e.target.value })} placeholder='Tipo de vehiculo'>
                  {tipoVehiculo.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Seleccione un servicio</InputLabel>
                <Select onChange={(e: SelectChangeEvent) => setData({ ...data, tipoLavado: e.target.value })} placeholder='Tipo de lavado'>
                  {tipoLavado.map((item, index) => <MenuItem key={index} value={item.type}>{item.type}</MenuItem>)}
                </Select>
              </FormControl>


              <FormControl fullWidth>
                <InputLabel>Lavador</InputLabel>
                <Select onChange={(e: SelectChangeEvent) => setData({ ...data, lavadores: e.target.value })} placeholder='lavadores'>
                  {lavadores.map(item => <MenuItem value={item}>{item}</MenuItem>)}
                </Select>
              </FormControl>


            </Stack>
            <Button disabled={disabledHandle()} type="submit" variant="contained" color="primary" fullWidth>
              Guardar
            </Button>
          </form>

        </Box>
      </Modal>
    </div>
    }

    </>
  )
}

export default App