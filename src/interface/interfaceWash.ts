export interface IFormData {
    cliente: string;
    lavadores: string;
    tipoLavado: string;
    opcionAdicional: string;
    formaPago: string;
    timestamp: number;
    price: number;
    priceBs: number
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
    priceBs: number
  }
  
 export  interface ITipoLavado {
    type: string;
    value: string;
  }

  export interface RowDataId extends IFormData {
    id: string;
  }

  export interface IDolarRate {
    monitors: {
      bcv: {
        price: number;
      };
    };
  }