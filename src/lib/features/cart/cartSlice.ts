import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  id: number;
  quantity: number;
}

type CartState = {
  items: CartItem[],
  hydrated: boolean
}

const initialState: CartState = {
  items: [],
  hydrated: false
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
    },

    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    },

    setHydrated: (state) => {
      state.hydrated = true
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  changeQuantity,
  clearCart,
  hydrateCart,
  setHydrated,
} = cartSlice.actions

export default cartSlice.reducer