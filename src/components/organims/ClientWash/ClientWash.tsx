import { CircularProgress, useMediaQuery} from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { IFormData, RowDataId, ITipoLavado, IDolarRate } from "../../../interface/interfaceWash";
import FormClientWash from "../../molecules/FormClientWash/FormClientWash";
import { addWash, dateWash, filterWash, getTypeWashes, getWashData } from "../../../services/serviceWash";
import { ListClientWash } from "../../molecules/ListClientWash/ListClientWash";
import { CardClientWash } from "../../molecules/CardClientWash/CardClientWash";
import { HeaderWash } from "../../molecules/HeaderWash/HeaderWash";
import { fetchDolarRate } from "../../../services/serviceDolar";


function ClientWash() {
  const mobileView = useMediaQuery("(max-width: 600px)");
  const buttonSize = mobileView ? "small" : "medium";
  const [open, setOpen] = useState(false);
  const [tipoLavado, setTipoLavado] = useState<ITipoLavado[]>([]);
  const [dolarRate, setDolarRate] = useState<IDolarRate | null>(null);
  const [lavados, setLavados] = useState<IFormData[] | RowDataId[] | null>(null);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [loader, setLoader] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setIsSearching(true);
  };

  function handleOpen() {
    setOpen(true);
  }

  const formatNumber = (num: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(num);
  };

  const filterByDate = async () => {
            setLoader(true);
            const res = await dateWash(startDate)
            setLavados(res);          
            setLoader(false);
  };

  const createDoc = async (data: IFormData): Promise<void> => {
    try {
      await addWash(data);
      if (lavados) {
        setLavados([{ ...data, timestamp: Date.now() }, ...lavados]);
      }
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
  };

  const handleInputChange = (e: string) => {
    const date = new Date(new Date(e).getTime());
    setStartDate(date);
  };

  async function filterByLavadores() {
    try {
      setLoader(true);
      const res = await filterWash(search)
      setLavados(res);
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

  const obtenerDatos = async () => {
    const res = await getTypeWashes()
    setTipoLavado(res)

  };

  const obtenerData = async () => {
    try {
      setLoader(true);
      const res = await getWashData()
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
    obtenerData();
  }, []);
  useEffect(() => {
    fetchDolarRate().then((res)=>setDolarRate(res))
  }, []);

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
            <HeaderWash
              handleInputChange={handleInputChange}
              filterByLavadores={filterByLavadores}
              handleChange={handleChange}
              search={search}
              open={open}
              handleOpen={handleOpen}
              isSearching={isSearching}
              lavados={lavados}
            />
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
            <ListClientWash dolarRate={dolarRate} lavados={lavados} />
          ) : (
            <CardClientWash
              dolarRate={dolarRate}
              lavados={lavados}
              tipoLavado={tipoLavado}
            />
          )}

          <Typography variant="h6" gutterBottom>
            Total de precios:{" "}
            <b>
              $
              {lavados !== null &&
                formatNumber(
                  lavados.reduce((total, row) => total + row.price, 0)
                )}
              <b style={{ marginRight: 5, marginLeft: 5 }}>/</b>
              <b style={{ marginRight: 2, marginLeft: 2 }}>Bs.F </b>
              {dolarRate !== null && lavados !== null
                ? formatNumber(
                    lavados.reduce((total, row) => total + row.priceBs, 0) 
                  )
                : ""}
            </b>
          </Typography>

          <Modal open={open} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <FormClientWash onSubmit={(data) => createDoc(data)} />
          </Modal>
        </div>
      )}
    </>
  );
}

export default ClientWash;
