import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ICategories, IProducts } from "../../../interface/interfaceInventory";

interface Props {
  onClose: () => void;
  onSubmit: (data: IProducts) => void;
  categories: ICategories[];
}

export const FormRegisterInventory = ({
  onClose,
  onSubmit,
  categories,
}: Props) => {
  const [newProduct, setNewProduct] = useState<IProducts>({
    count: 0,
    idCategory: "",
    name: "",
    price: 0,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(newProduct);
    onClose();
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

    height: "auto",
    maxWidth: "none",
    maxHeight: "none",
    overflow: "hidden",
  };

  return (
    <>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          fontWeight={"bold"}
          component="h2"
        >
          Nuevo Registro de Producto!
        </Typography>
        <Typography id="modal-modal-description" color="gray" sx={{ mt: 2 }}>
          Datos básicos
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2} mb={4}>
            <TextField
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              label="Nombre del Producto"
            />

            <FormControl fullWidth>
              <InputLabel>Seleccione una categoria</InputLabel>

              <Select
                onChange={(e: SelectChangeEvent) =>
                  setNewProduct({
                    ...newProduct,
                    idCategory: `/categories/${e.target.value}`,
                  })
                }
                placeholder="Categoria"
              >
                {categories.map(({ idCategory, name }) => (
                  <MenuItem value={idCategory}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel></InputLabel>
              <TextField
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    count: Number(e.target.value),
                  })
                }
                label="Unidades"
                variant="outlined"
                type="number"
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel></InputLabel>
              <TextField
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: Number(e.target.value),
                  })
                }
                label="Precio"
                variant="outlined"
                type="number"
              />
            </FormControl>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={onClose}
          >
            Guardar
          </Button>
        </form>
      </Box>
    </>
  );
};
