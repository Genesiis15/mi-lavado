export interface IFormData {
    cliente: string;
    lavadores: string;
    tipoLavado: string;
    opcionAdicional: string;
    formaPago: string;
    timestamp: number;
    price: number;
  }

 export interface RowDataId {
    cliente: string;
    lavadores: string;
    tipoLavado: string;
    opcionAdicional: string;
    formaPago: string;
    timestamp: number;
    id: string;
    price: number;
  }
  
 export  interface TipoLavado {
    type: string;
    value: string;
  }