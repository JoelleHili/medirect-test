import * as currencySymbols from "../data/currentySymbols.json"


const currencySymbolsList = currencySymbols as Record<string,string>

export const getCurrencySymbolFromCode = (code?: string) => {
  if (code) {
   return currencySymbolsList[code]; 
  } else {
    return ""
  }
}
