import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  id: number;
  quantity: number;
}

type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

type ChangeQuantityPayload = {
  id: number;
  quantity: number;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      )

      if(existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          id: action.payload,
          quantity: 1
        })
      }
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        item => item.id !== action.payload
      )
    },

    changeQuantity: (state, action: PayloadAction<ChangeQuantityPayload>) => {
      const item = state.items.find(
        item => item.id === action.payload.id
      );

      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    clearCart: (state) => {
      state.items = []
    }
  }
})

export const { addToCart, removeFromCart, changeQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer