import axios from "axios";

export const fetchDolarRate = async ()=> {
    try {
      const response = await axios.get(
        "https://pydolarve.org/api/v1/dollar?page=dolartoday"
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching dolar rate:", error);
    }
  }