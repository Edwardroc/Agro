import React, { useState } from "react";
import { CartItem as CartItemType } from "../../types";
import api from "../../services/api";

interface CartItemProps {
  item: CartItemType;
  onUpdate: () => void; // Callback para actualizar el carrito
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Actualizar cantidad
  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      setError("");
      
      // Actualizar el item en el carrito
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const currentCart = JSON.parse(
        localStorage.getItem(`cart_${userData.uid}`) || '{"items": []}'
      );

      const updatedItems = currentCart.items.map((cartItem: CartItemType) => {
        if (cartItem.producto_id === item.producto_id) {
          return { ...cartItem, cantidad: newQuantity };
        }
        return cartItem;
      });

      const total = updatedItems.reduce(
        (sum: number, cartItem: CartItemType) =>
          sum + cartItem.cantidad * cartItem.precio_unitario,
        0
      );

      const updatedCart = { ...currentCart, items: updatedItems, total };

      localStorage.setItem(
        `cart_${userData.uid}`,
        JSON.stringify(updatedCart)
      );

      onUpdate();
    } catch (err: any) {
      setError(err.message || "Error al actualizar cantidad");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar del carrito
  const handleRemove = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      setLoading(true);
      setError("");

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const currentCart = JSON.parse(
        localStorage.getItem(`cart_${userData.uid}`) || '{"items": []}'
      );

      const updatedItems = currentCart.items.filter(
        (cartItem: CartItemType) => cartItem.producto_id !== item.producto_id
      );

      const total = updatedItems.reduce(
        (sum: number, cartItem: CartItemType) =>
          sum + cartItem.cantidad * cartItem.precio_unitario,
        0
      );

      const updatedCart = { ...currentCart, items: updatedItems, total };

      localStorage.setItem(
        `cart_${userData.uid}`,
        JSON.stringify(updatedCart)
      );

      onUpdate();
    } catch (err: any) {
      setError(err.message || "Error al eliminar producto");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.productInfo}>
        <h3 style={styles.name}>{item.nombre}</h3>
        <p style={styles.price}>
          ${item.precio_unitario.toLocaleString("es-CO")}
        </p>
      </div>

      <div style={styles.quantityControl}>
        <button
          onClick={() => handleUpdateQuantity(item.cantidad - 1)}
          disabled={loading || item.cantidad <= 1}
          style={{
            ...styles.quantityButton,
            ...(loading || item.cantidad <= 1 ? styles.buttonDisabled : {}),
          }}
        >
          −
        </button>

        <input
          type="number"
          min="1"
          value={item.cantidad}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > 0) {
              handleUpdateQuantity(value);
            }
          }}
          disabled={loading}
          style={styles.quantityInput}
        />

        <button
          onClick={() => handleUpdateQuantity(item.cantidad + 1)}
          disabled={loading}
          style={{
            ...styles.quantityButton,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          +
        </button>
      </div>

      <div style={styles.subtotal}>
        <strong>${(item.cantidad * item.precio_unitario).toLocaleString("es-CO")}</strong>
      </div>

      <button
        onClick={handleRemove}
        disabled={loading}
        style={{
          ...styles.removeButton,
          ...(loading ? styles.buttonDisabled : {}),
        }}
      >
        🗑️
      </button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    gap: "1rem",
    flexWrap: "wrap" as const,
  },

  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "0.5rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
    width: "100%",
    marginBottom: "0.5rem",
  },

  productInfo: {
    flex: 1,
    minWidth: "200px",
  },

  name: {
    margin: "0 0 0.5rem 0",
    color: "#333",
    fontSize: "1rem",
  },

  price: {
    margin: 0,
    color: "#4CAF50",
    fontSize: "1.1rem",
    fontWeight: "bold" as const,
  },

  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "0.25rem",
  },

  quantityButton: {
    backgroundColor: "transparent",
    border: "none",
    padding: "0.5rem 0.75rem",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "bold" as const,
    color: "#4CAF50",
    transition: "background-color 0.2s",
    borderRadius: "4px",
  },

  quantityButtonHover: {
    backgroundColor: "#f0f8f0",
  },

  quantityInput: {
    width: "60px",
    padding: "0.5rem",
    border: "none",
    textAlign: "center" as const,
    fontSize: "1rem",
    fontWeight: "bold" as const,
  },

  subtotal: {
    minWidth: "100px",
    textAlign: "right" as const,
    color: "#4CAF50",
    fontSize: "1.1rem",
    fontWeight: "bold" as const,
  },

  removeButton: {
    padding: "0.5rem 0.75rem",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1.2rem",
    transition: "background-color 0.2s",
  },

  removeButtonHover: {
    backgroundColor: "#d32f2f",
  },

  buttonDisabled: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
};

export default CartItem;