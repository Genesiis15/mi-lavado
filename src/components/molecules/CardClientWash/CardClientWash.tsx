import { Box, Card, CardContent, CardHeader, Chip, Typography } from "@mui/material"
import FaceIcon from "@mui/icons-material/Face";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import moment from "moment";
import { IFormData } from "../../../interface/interfaceWash";

interface TipoLavado {
    type: string;
    value: string;
  }
interface Props {
    lavados: IFormData[] | RowDataId[] | null
    tipoLavado:TipoLavado[]
    dolarRate: {
        monitors: {
            bcv: {
                price: number;
            };
        };
    } | null
}

interface RowDataId {
    cliente: string;
    lavadores: string;
    tipoLavado: string;
    opcionAdicional: string;
    formaPago: string;
    timestamp: number;
    id: string;
    price: number;
  }

export const CardClientWash = ({lavados, dolarRate, tipoLavado}:Props)=>{
    const getDate = (date: number) => {
        return moment(date).format("MMMM D, YYYY h:mm A");
      };
    return <>
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
    </>
}