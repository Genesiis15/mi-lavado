import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IProducts } from "../../../interface/interfaceInventory";

interface Props {
  data: IProducts;
  onClick: (product: IProducts) => void;
}

type NameType = string;

function TruncatedTitle({ name }: { name: NameType }) {
  if (!name || typeof name !== "string") return null;

  const truncatedName = name.length > 10 ? `${name.slice(0, 12)}...` : name;

  return <span>{truncatedName}</span>;
}

export const CardInventory = ({ data, onClick }: Props) => {
  const [dolarRate, setDolarRate] = useState<number>(0);

  
  useEffect(() => {
    fetch("https://pydolarve.org/api/v1/dollar?page=dolartoday")
      .then((res) => res.json())
      .then((data) => {
        const rate = data?.monitors?.bcv?.price || 0;
        setDolarRate(rate);
      })
      .catch((error) => console.error("Error fetching dollar rate:", error));
  }, []);

  const { name, price, count, idProduct, formaPago } = data;

  
  const priceInBs = (price * dolarRate).toFixed(2);

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 200,
        height: 200,
        marginBottom: 2,
        
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardHeader
        title={<TruncatedTitle name={name} />}
        titleTypographyProps={{ 
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333333'
         }} 
        style={{
          padding: "10px 15px",
          background: "#f5f5f5",
          
          borderBottom: "1px solid #ccc",
        }}
        subheader={
          <Box sx={{ mt: 2 }}>
            <Typography display="flex" alignItems="center">
              <AttachMoneyIcon sx={{ fontSize: 16 }} color="success" />
              ${price.toFixed(2)}
            </Typography>
            <Typography display="flex" alignItems="center" sx={{ mt: 1 }}>
              <AttachMoneyIcon sx={{ fontSize: 16 }} color="primary" />
               Bs.F: {priceInBs}
            </Typography>
            <Typography display="flex" alignItems="center" sx={{ mt: 1 }}>
              <CorporateFareIcon sx={{ fontSize: 16 }} color="warning" />
               Cantidad: {count} U.
            </Typography>
          </Box>
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
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            onClick({ name, price, count: 1, idProduct, formaPago })
          }
          sx={{
            width: "100%",
            height: 28,
            fontSize: "14px",
            padding: "4px 8px",
            textTransform: "none",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#005CA7",
              
              boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)"
            },
          }}
        >
          Agregar
          <AddShoppingCartIcon
            sx={{ fontSize: "16px", marginLeft: "4px" }}
          />
        </Button>
      </CardContent>
    </Card>
  );
};
