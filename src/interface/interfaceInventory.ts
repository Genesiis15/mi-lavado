export interface ICategories {
    name: string
    idCategory: string
  }

  export interface IProducts {
    name: string
    idCategory?: string
    count: number
    price: number
    idProduct: string
    timestamp?: string
    formaPago?: string;

  }