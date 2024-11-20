import {
  Chip,
  CircularProgress,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import moment from "moment";
import { IProducts } from "../../../interface/interfaceInventory";
import { HeaderInventory } from "../HeaderInventory/HeaderInventory";
import { useEffect, useState } from "react";
import { dateWash } from "../../../services/serviceWash";

interface Props {
  sellInventory: IProducts[] | null;
}

export const ListClientInventory = ({ sellInventory }: Props) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [loader, setLoader] = useState(false);
  const handleInputChange = (e: string) => {
    const date = new Date(new Date(e).getTime());
    setStartDate(date);
  };

  const filterByDate = async () => {
    setLoader(true);
    const res = await dateWash(startDate);
    console.log(res);
    setLoader(false);
  };

  useEffect(() => {
    if (startDate !== null) {
      filterByDate();
    }
  }, [startDate]);

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

  return (
    <div>
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
            <HeaderInventory handleInputChange={handleInputChange} />
          </div>

          <TableContainer component={Paper} sx={{}}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Fecha </StyledTableCell>

                  <StyledTableCell align="right">Producto</StyledTableCell>
                  <StyledTableCell align="right">Cantidad</StyledTableCell>
                  <StyledTableCell align="right">
                    {" "}
                    Método de pago
                  </StyledTableCell>
                  <StyledTableCell align="right">Precio</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sellInventory && sellInventory.length > 0 ? (
                  sellInventory.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell>
                        {moment(row.timestamp).format("MMMM D, YYYY  h:mm A") ??
                          "Sin fecha"}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.count}
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <Chip
                          size="small"
                          label={row.formaPago}
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
                        <Typography variant="body2">
                          <b>${row.price}</b> /
                          <b>
                            {" "}
                            Bs.F
                            {/*  {row.priceBs} */}
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
        </div>
      )}
    </div>
  );
};
