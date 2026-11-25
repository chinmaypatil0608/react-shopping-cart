import React, { useMemo, useState } from "react";

const products = [
  { id: 1, name: "Wireless Headphones", category: "Audio", price: 1499, emoji: "🎧" },
  { id: 2, name: "Everyday Backpack", category: "Accessories", price: 999, emoji: "🎒" },
  { id: 3, name: "Smart Watch", category: "Wearables", price: 2499, emoji: "⌚" },
  { id: 4, name: "Desk Lamp", category: "Home", price: 699, emoji: "💡" },
  { id: 5, name: "Travel Bottle", category: "Accessories", price: 399, emoji: "🥤" },
  { id: 6, name: "Bluetooth Speaker", category: "Audio", price: 1199, emoji: "🔊" }
];

const format = amount => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(amount);

function ProductCard({ product, onAdd }) {
  return <article className="product">
    <div className="product-art">{product.emoji}</div>
    <p className="category">{product.category}</p>
    <h3>{product.name}</h3>
    <div className="product-bottom"><strong>{format(product.price)}</strong>
      <button onClick={() => onAdd(product)}>Add</button></div>
  </article>;
}

function Cart({ items, onQuantity, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <aside className="cart">
    <h2>Your cart <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></h2>
    {items.length === 0 ? <p className="muted">Your cart is empty. Add a product to begin.</p> :
      items.map(item => <div className="cart-row" key={item.id}>
        <div><b>{item.name}</b><small>{format(item.price)} each</small></div>
        <div className="quantity">
          <button aria-label="Decrease quantity" onClick={() => onQuantity(item.id, -1)}>−</button>
          <strong>{item.quantity}</strong>
          <button aria-label="Increase quantity" onClick={() => onQuantity(item.id, 1)}>+</button>
        </div>
        <button className="remove" onClick={() => onRemove(item.id)}>Remove</button>
      </div>)
    }
    <div className="total"><span>Total</span><strong>{format(total)}</strong></div>
    <button className="checkout" disabled={!items.length} onClick={() => alert("Demo checkout: no payment is processed.")}>Continue (demo)</button>
    <p className="note">Demo only. No real payment is collected.</p>
  </aside>;
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const visible = useMemo(() => products.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [category, search]);

  function add(product) {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      return found
        ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }];
    });
  }
  function changeQuantity(id, change) {
    setCart(current => current.map(item => item.id === id
      ? { ...item, quantity: item.quantity + change } : item
    ).filter(item => item.quantity > 0));
  }

  return <div className="page">
    <header className="header"><div><p className="eyebrow">REACT PRACTICE PROJECT</p><h1>Shop<span>Lite</span></h1></div><p className="tagline">A simple shopping cart demo</p></header>
    <div className="toolbar"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products"/>
      <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter category">
        {categories.map(c => <option key={c}>{c}</option>)}
      </select></div>
    <div className="columns"><main><h2>Products</h2><section className="products">
      {visible.length ? visible.map(p => <ProductCard key={p.id} product={p} onAdd={add}/>) : <p>No matching products.</p>}
    </section></main><Cart items={cart} onQuantity={changeQuantity} onRemove={id => setCart(c => c.filter(x => x.id !== id))}/></div>
  </div>;
}
