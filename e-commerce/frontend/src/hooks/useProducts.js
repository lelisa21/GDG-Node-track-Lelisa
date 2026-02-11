import { ProductContext } from "../context/ProductContext";

export const useProductContext = () => {
const  context = ProductContext()
 if(!context){
    throw Error("Error happenedb in ProductContect fetching")
 }
 return context;
}
