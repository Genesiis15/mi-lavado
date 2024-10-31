import React, { useState } from 'react'
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, FormControl, InputLabel, MenuItem, Stack, TextField } from '@mui/material';
interface DataLavado {
  cliente: string;
  lavadores: string;
  tipoLavado: string;
  tipoVehiculo: string;
  timestamp: number;
}
interface DataLavadoId {
  cliente: string;
  lavadores: string;
  tipoLavado: string;
  tipoVehiculo: string;
  timestamp: number;
  id: string;
}
interface TipoLavado {
  type: string;
  value: string;
}
interface Props {
  submit: () => void,
  tipoLavado: TipoLavado[]
  
}

export const FormWash = ({submit, tipoLavado}: Props) => {
  const [data, setData] = useState<DataLavado>({
    cliente: "",
    lavadores: "",
    tipoLavado: "",
    tipoVehiculo: "",
    timestamp: Date.now(),
  });
  const [lavados, setLavados] = useState<DataLavado[] | DataLavadoId[] | null>(null);

  // const createDoc = async (
  //   event: React.FormEvent<HTMLFormElement>
  // ): Promise<void> => {
  //   event.preventDefault();

  //   if (
  //     data.cliente.length > 0 &&
  //     data.lavadores.length > 0 &&
  //     data.tipoLavado.length > 0 &&
  //     data.tipoVehiculo.length > 0
  //   ) {
  //     console.log("entro", data);

  //     // const docRef = await addDoc(collection(db, "lavado"), {
  //     //   ...data,
  //     //   timestamp: Date.now(),
  //     // });
  //     // setLavados(prevLavados => [{ ...data, timestamp: Date.now() }, ...prevLavados]);
  //     // console.log("Document written with ID: ", docRef.id);
  //     // handleCloseModal();
  //   }
  //   try {
  //     const docRef = await addDoc(collection(db, "lavado"), {
  //       ...data,
  //       timestamp: Date.now(),
  //     });
  //     if (lavados) {
  //       setLavados([{ ...data, timestamp: Date.now() }, ...lavados]);
  //     }
  //     // setLavados(prevLavados => {
  //     //   if(prevLavados){
  //     //    return[{ ...data, timestamp: Date.now() }, ...prevLavados]
  //     //   }
  //     // });
  //     console.log("Document written with ID: ", docRef.id);
  //     handleCloseModal();
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error adding document: ", error.message);
  //     } else {
  //       console.error("An unknown error occurred");
  //     }
  //   }
  // };

  return (
    <form onSubmit={submit}>
    <Stack spacing={2} mb={2}>
      <TextField
        onChange={(e) =>
          setData({ ...data, cliente: e.target.value })
        }
        label="Cliente"
      />
      <FormControl fullWidth>
        <InputLabel>Seleccione un vehículo</InputLabel>
        <Select
          onChange={(e: SelectChangeEvent) =>
            setData({ ...data, tipoVehiculo: e.target.value })
          }
          placeholder="Tipo de vehiculo"
        >
          {tipoVehiculo.map((item) => (
            <MenuItem value={item}>{item}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Seleccione un servicio</InputLabel>
        <Select
          onChange={(e: SelectChangeEvent) =>
            setData({ ...data, tipoLavado: e.target.value })
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
  )
}
