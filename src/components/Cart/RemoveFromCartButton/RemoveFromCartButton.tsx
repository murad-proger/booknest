import styles from "./RemoveFromCartButton.module.css";

import { useAppDispatch } from "@/lib/hooks";
import { removeFromCart } from "@/lib/features/cart/cartSlice";

export default function RemoveFromCartButton({title, id}: {title: string, id: number}) {
  const dispatch = useAppDispatch()

  return (
    <button
      type="button"
      className={styles.button}
      aria-label={`Remove ${title} from cart`}
      onClick={() => dispatch(removeFromCart(id))}
    >
      ×
    </button>
  )
}