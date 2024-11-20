import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  CalendarIcon,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
interface Props {
  handleInputChange: (data: string) => void;
}

export const HeaderInventory = ({ handleInputChange }: Props) => {
  const [openModalDate, setOpenModalDate] = useState(false);
  const handleClose = () => setOpenModalDate(false);
  const handleOpenModalDate = () => setOpenModalDate(true);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
        </Grid>
      </Box>
    </>
  );
};
