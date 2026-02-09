import { createContext, useCallback, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state , action) => {
    const {cart , itemsMap} = state;

    switch(action.type){
        case "ADD": {
         const {product, quantity} = action.payload
         const existing = itemsMap[product._id]
         if(existing){
            const updated = cart.map(item => item.product._id === product._id ? {...item, quantity:item.quantity + quantity} : item)
            return {cart: updated , itemsMap} 
         }
         const newItem =  {product, quantity}
         return{
            cart:[...cart , newItem],
            itemsMap:{...itemsMap , [product._id]:true}
         }
        }

        case "REMOVE" : {
            const {productId} = action.payload
            const updated = cart.filter(item => item.product._id  !== productId)
            const newMap = {...itemsMap}
            delete newMap[productId]
            return {cart:updated, itemsMap: newMap}
        }
        case "UPDATE" : {
            const {productId , quantity} = action.payload
            const updated = cart.map(item => item.product._id === productId ? {...item,quantity} : item)
            return {cart:updated, itemsMap}
        }
        case "CLEAR" : {
            return {cart:[], itemsMap: {}}
        }
        default:
            return state
    }
}

export const CartProvider = ({children}) => {
    const [state, dispatch] = useReducer(cartReducer , {cart:[],itemsMap:{}})

    const addToCart = useCallback((product, quantity = 1) => {
        dispatch({type: "ADD" , payload:{product , quantity}})
    }, [])

    const removeFromCart = useCallback((productId) => {
        dispatch({type: "REMOVE" , payload : {productId}}) , []
    })

    const updateQuantity = useCallback((productId , quantity) => {
        dispatch({type:"UPDATE" , payload : {productId , quantity}})
    } , [])

    const clearCart = useCallback(() => dispatch({type : "CLEAR"}) , [])

    const total = state.cart.reduce((sum , item) => sum += (item.product?.price || 0) * item.quantity , 0);

    const itemCount = state.cart.reduce((sum , item) => sum += item.quantity , 0)

    return (<CartContext.Provider value={{cart:state.cart, addToCart,removeFromCart,updateQuantity,clearCart,total,itemCount}}>{children}</CartContext.Provider>)
}
export const useCart = ()  => useContext(CartContext)
