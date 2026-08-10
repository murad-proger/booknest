"use client"

export default function AddToCartButton({ id }: { id: number }) {
  const handleClick = (id: number) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    cart.push(id)

    console.log(cart)

    localStorage.setItem("cart", JSON.stringify(cart))
  }

  return (
    <button
      onClick={() => handleClick(id)}
      type="button"
    >
      Add to cart
    </button>
  )
}