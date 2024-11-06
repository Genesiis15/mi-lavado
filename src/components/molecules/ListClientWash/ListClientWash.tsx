import { Chip, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { IFormData, RowDataId } from "../../../interface/interfaceWash";

interface Props {
    lavados: IFormData[] | RowDataId[] | null
    dolarRate: {
        monitors: {
            bcv: {
                price: number;
            };
        };
    } | null
}

export const ListClientWash = ({lavados}:Props)=>{
    
   
    

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
    

      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.action.hover,
        },
    
        "&:last-child td, &:last-child th": {
          border: 0,
        },
      }));

      
      
        

     
    return <>


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
                             
                             {row.priceBs}
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
    </>
}