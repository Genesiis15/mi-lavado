import { IDolarRate } from "../interface/interfaceWash"

export const convertPrice = (price:number, dolarRate:IDolarRate)=>{
    try {
        return Number((price * dolarRate.monitors.bcv.price).toFixed(0))
    } catch (error) {
        console.log(error)
       return 0 
    }
  }