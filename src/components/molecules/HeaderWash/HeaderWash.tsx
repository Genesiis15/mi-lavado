import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  CalendarIcon,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import { IFormData, RowDataId } from "../../../interface/interfaceWash";
interface Props {
  handleInputChange: (data: string) => void;
  filterByLavadores: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  search: string;
  open: boolean;
  handleOpen: () => void;
  isSearching: boolean;
  lavados: IFormData[] | RowDataId[] | null;
}

export const HeaderWash = ({
  handleInputChange,
  filterByLavadores,
  handleChange,
  search,
  handleOpen,
  isSearching,
  lavados,
}: Props) => {
  const mobileView = useMediaQuery("(max-width: 600px)");
  const buttonSize = mobileView ? "small" : "medium";
  const [openModalDate, setOpenModalDate] = useState(false);
  const handleClose = () => setOpenModalDate(false);
  const handleOpenModalDate = () => setOpenModalDate(true);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
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
    </>
  );
};
