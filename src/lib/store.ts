import { configureStore } from '@reduxjs/toolkit'
import cardReducer from "./features/cart/cartSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cardReducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']