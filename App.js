import { useState } from "react";

const OWNER_WHATSAPP = "923275343399";

const branches = [
  { id: 1, name: "Satellite Town", phone: "0300-0201011" },
  { id: 2, name: "Noshehra Road", phone: "0339-0201011" },
  { id: 3, name: "Citi Housing", phone: "0328-1301011" },
];

const menuData = {
  categories: ["All", "Pizzas", "Burgers", "Deals", "Sides", "Drinks"],
  items: [
    { id: 1, category: "Pizzas", name: "Afghani Tikka Pizza", price: 899, desc: "Juicy afghani tikka chunks, BBQ sauce, mozzarella", emoji: "🍕", popular: true },
    { id: 2, category: "Pizzas", name: "Hawaiian Pizza", price: 799, desc: "Ham, pineapple, mozzarella, tomato base", emoji: "🍕", popular: false },
    { id: 3, category: "Pizzas", name: "Beef Tikka Pizza", price: 949, desc: "Spicy beef tikka, onions, peppers, cheese", emoji: "🍕", popular: true },
    { id: 4, category: "Pizzas", name: "Margherita Pizza", price: 699, desc: "Classic tomato sauce, fresh mozzarella, basil", emoji: "🍕", popular: false },
    { id: 5, category: "Pizzas", name: "Hot & Spicy Pizza", price: 849, desc: "Jalapeños, chilli flakes, pepperoni, mozzarella", emoji: "🍕", popular: true },
    { id: 6, category: "Pizzas", name: "Mushroom Lover", price: 799, desc: "Mixed mushrooms, garlic, olive oil, cheese", emoji: "🍕", popular: false },
    { id: 7, category: "Burgers", name: "Zinger Burger", price: 349, desc: "Crispy fried chicken, coleslaw, mayo", emoji: "🍔", popular: true },
    { id: 8, category: "Burgers", name: "Beef Smash Burger", price: 449, desc: "Double smash patty, cheese, pickles, special sauce", emoji: "🍔", popular: true },
    { id: 9, category: "Burgers", name: "Chicken Tikka Burger", price: 399, desc: "Tikka grilled chicken, lettuce, garlic sauce", emoji: "🍔", popular: false },
    { id: 10, category: "Deals", name: "Deal 1 - Family", price: 999, desc: "1 Large Pizza + 2 Burgers + 1.5L drink", emoji: "🎁", popular: true },
    { id: 11, category: "Deals", name: "Deal 2 - Couple", price: 699, desc: "1 Medium Pizza + 2 Burgers + 2 drinks", emoji: "🎁", popular: true },
    { id: 12, category: "Deals", name: "Deal 3 - Solo", price: 499, desc: "1 Small Pizza + 1 Burger + 1 drink", emoji: "🎁", popular: false },
    { id: 13, category: "Sides", name: "Garlic Bread", price: 199, desc: "Toasted bread, garlic butter, herbs", emoji: "🥖", popular: false },
    { id: 14, category: "Sides", name: "Crispy Fries", price: 149, desc: "Golden fries with ketchup & mayo", emoji: "🍟", popular: true },
    { id: 15, category: "Sides", name: "Chicken Wings (6pc)", price: 449, desc: "BBQ glazed crispy wings", emoji: "🍗", popular: true },
    { id: 16, category: "Drinks", name: "Pepsi 1.5L", price: 150, desc: "Chilled Pepsi bottle", emoji: "🥤", popular: false },
    { id: 17, category: "Drinks", name: "7UP 1.5L", price: 150, desc: "Chilled 7UP bottle", emoji: "🥤", popular: false },
    { id: 18, category: "Drinks", name: "Mojito", price: 249, desc: "Fresh lime, mint, soda — house special", emoji: "🧃", popular: true },
  ]
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [view, setView] = useState("menu");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(1);
  const [orderType, setOrderType] = useState("delivery");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = menuData.items.filter(item =>
    (activeCategory === "All" || item.category === activeCategory) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    ...menuData.items.find(i => i.id === parseInt(id)), qty
  }));

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0);
  const branch = branches.find(b => b.id === selectedBranch);

  const updateCart = (id, delta) => {
    setCart(prev => {
      const next = (prev[id] || 0) + delta;
      if (next <= 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: next };
    });
  };

  const sendWhatsAppOrder = () => {
    const itemsList = cartItems.map(i => `  • ${i.name} x${i.qty} = Rs.${(i.price * i.qty).toLocaleString()}`).join("\n");
    const msg = `🍕 *NEW ORDER - Mr. Pizza ${branch.name}*\n\n` +
      `👤 *Customer:* ${customerName}\n` +
      `📞 *Phone:* ${customerPhone}\n` +
      `🏠 *${orderType === "delivery" ? "Address" : "Branch"}:* ${orderType === "delivery" ? address : branch.name}\n` +
      `📦 *Order Type:* ${orderType === "delivery" ? "Delivery" : "Takeaway"}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `💰 *Total: Rs.${subtotal.toLocaleString()}*\n\n` +
      `_Order placed via Mr. Pizza App_`;
    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setOrderPlaced(true);
    setView("confirm");
    setCart({});
  };

  const canPlaceOrder = customerName && customerPhone && (orderType === "takeaway" || address);

  if (orderPlaced && view === "confirm") {
    return (
      <div style={s.page}>
        <div style={s.confirmWrap}>
          <div style={s.confirmCircle}>🍕</div>
          <h2 style={s.confirmTitle}>Order Sent!</h2>
          <p style={s.confirmSub}>Your order was sent to Mr. Pizza via WhatsApp</p>
          <div style={s.confirmInfo}>
            <p style={{ color: "#e8a020", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ESTIMATED TIME</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: 2 }}>30–45 MIN</p>
          </div>
          <p style={{ color: "#aaa", fontSize: 13, marginBottom: 28, textAlign: "center" }}>
            The restaurant will confirm your order on {customerPhone}
          </p>
          <button style={s.newOrderBtn} onClick={() => { setOrderPlaced(false); setView("menu"); setCustomerName(""); setCustomerPhone(""); setAddress(""); }}>
            Order Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card:hover { transform: translateY(-2px); }
        .add-btn:hover { background: #e8a020 !important; }
        input:focus { border-color: #e8a020 !important; outline: none; }
        input::placeholder { color: #555; }
      `}</style>

      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logo}>🍕</div>
          <div>
            <h1 style={s.brandName}>MR. PIZZA</h1>
            <p style={s.brandSub}>Gujranwala</p>
          </div>
        </div>
        <button style={s.cartBtn} onClick={() => setView(view === "cart" ? "menu" : "cart")}>
          <span style={{ fontSize: 18 }}>🛒</span>
          {totalItems > 0 && <span style={s.badge}>{totalItems}</span>}
        </button>
      </div>

      <div style={s.branchRow}>
        {branches.map(b => (
          <button key={b.id} style={{ ...s.branchBtn, ...(selectedBranch === b.id ? s.branchBtnActive : {}) }}
            onClick={() => setSelectedBranch(b.id)}>{b.name}</button>
        ))}
      </div>

      {view === "menu" && (
        <>
          <div style={s.hero}>
            <p style={s.heroTag}>🔥 HOT DEAL</p>
            <p style={s.heroTitle}>Family Deal</p>
            <p style={s.heroSub}>1 Large Pizza + 2 Burgers + Drink</p>
            <p style={s.heroPrice}>Rs. 999 only</p>
          </div>

          <div style={s.searchWrap}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            <input style={s.searchInput} placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div style={s.catRow}>
            {menuData.categories.map(cat => (
              <button key={cat} style={{ ...s.catBtn, ...(activeCategory === cat ? s.catActive : {}) }}
                onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>

          <div style={s.itemList}>
            {filtered.map(item => (
              <div key={item.id} className="card" style={s.card}>
                <div style={s.cardEmoji}>{item.emoji}</div>
                <div style={s.cardInfo}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <p style={s.itemName}>{item.name}</p>
                    {item.popular && <span style={s.hotTag}>🔥 Hot</span>}
                  </div>
                  <p style={s.itemDesc}>{item.desc}</p>
                  <div style={s.cardBottom}>
                    <p style={s.itemPrice}>Rs. {item.price.toLocaleString()}</p>
                    {cart[item.id] ? (
                      <div style={s.qtyBox}>
                        <button style={s.qBtn} onClick={() => updateCart(item.id, -1)}>−</button>
                        <span style={s.qNum}>{cart[item.id]}</span>
                        <button style={s.qBtn} onClick={() => updateCart(item.id, 1)}>+</button>
                      </div>
                    ) : (
                      <button className="add-btn" style={s.addBtn} onClick={() => updateCart(item.id, 1)}>+ Add</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalItems > 0 && (
            <button style={s.floatBtn} onClick={() => setView("cart")}>
              <span>🛒 View Cart · {totalItems} items</span>
              <span style={{ fontWeight: 800 }}>Rs. {subtotal.toLocaleString()}</span>
            </button>
          )}
        </>
      )}

      {view === "cart" && (
        <div style={s.cartView}>
          <button style={s.backBtn} onClick={() => setView("menu")}>← Back</button>
          <h2 style={s.sectionTitle}>Your Order</h2>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: 48 }}>🛒</p>
              <p style={{ color: "#aaa", marginTop: 12 }}>Cart is empty</p>
              <button style={{ ...s.addBtn, marginTop: 16, padding: "12px 28px" }} onClick={() => setView("menu")}>Browse Menu</button>
            </div>
          ) : (
            <>
              <div style={s.orderTypeRow}>
                <button style={{ ...s.typeBtn, ...(orderType === "delivery" ? s.typeBtnActive : {}) }} onClick={() => setOrderType("delivery")}>🏠 Delivery</button>
                <button style={{ ...s.typeBtn, ...(orderType === "takeaway" ? s.typeBtnActive : {}) }} onClick={() => setOrderType("takeaway")}>🏃 Takeaway</button>
              </div>
              {cartItems.map(item => (
                <div key={item.id} style={s.cartItem}>
                  <span style={{ fontSize: 26 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                    <p style={{ color: "#e8a020", fontSize: 13 }}>Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <div style={s.qtyBox}>
                    <button style={s.qBtn} onClick={() => updateCart(item.id, -1)}>−</button>
                    <span style={s.qNum}>{item.qty}</span>
                    <button style={s.qBtn} onClick={() => updateCart(item.id, 1)}>+</button>
                  </div>
                  <p style={{ color: "white", fontWeight: 800, minWidth: 70, textAlign: "right" }}>
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
              <div style={s.totalBox}>
                <span style={{ color: "#aaa" }}>Total</span>
                <span style={{ color: "#e8a020", fontSize: 20, fontWeight: 800 }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <p style={{ color: "#e8a020", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Your Details</p>
              <input style={s.input} placeholder="Your Name *" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              <input style={s.input} placeholder="Phone Number *" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} type="tel" />
              {orderType === "delivery" && (
                <input style={s.input} placeholder="Delivery Address *" value={address} onChange={e => setAddress(e.target.value)} />
              )}
              <button style={{ ...s.whatsappBtn, opacity: canPlaceOrder ? 1 : 0.4 }} disabled={!canPlaceOrder} onClick={sendWhatsAppOrder}>
                <span style={{ fontSize: 20 }}>📲</span>
                <span>Send Order via WhatsApp</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { fontFamily: "'Nunito', sans-serif", background: "#111", minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 100, color: "white" },
  header: { background: "#1a1a1a", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e8a020" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { fontSize: 32, background: "#e8a020", borderRadius: 12, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" },
  brandName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 3, color: "white", lineHeight: 1 },
  brandSub: { color: "#e8a020", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
  cartBtn: { background: "#222", border: "1px solid #333", borderRadius: 10, padding: "10px 14px", cursor: "pointer", position: "relative" },
  badge: { position: "absolute", top: -6, right: -6, background: "#e8a020", color: "#111", borderRadius: "50%", width: 20, height: 20, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  branchRow: { display: "flex", gap: 8, padding: "12px 16px", background: "#1a1a1a", overflowX: "auto" },
  branchBtn: { whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 20, border: "1.5px solid #333", background: "transparent", color: "#aaa", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  branchBtnActive: { background: "#e8a020", border: "1.5px solid #e8a020", color: "#111" },
  hero: { margin: "16px", borderRadius: 16, background: "linear-gradient(135deg, #e8a020 0%, #d4420a 100%)", padding: "20px 22px" },
  heroTag: { fontSize: 12, fontWeight: 800, letterSpacing: 1, marginBottom: 6 },
  heroTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 2, lineHeight: 1 },
  heroSub: { fontSize: 13, opacity: 0.9, margin: "4px 0 8px" },
  heroPrice: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1 },
  searchWrap: { padding: "0 16px 8px", position: "relative" },
  searchInput: { width: "100%", padding: "12px 16px 12px 40px", borderRadius: 10, border: "1.5px solid #333", background: "#1a1a1a", color: "white", fontSize: 14, fontFamily: "'Nunito', sans-serif" },
  catRow: { display: "flex", gap: 8, padding: "4px 16px 12px", overflowX: "auto" },
  catBtn: { whiteSpace: "nowrap", padding: "7px 16px", borderRadius: 20, border: "1.5px solid #333", background: "transparent", color: "#aaa", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  catActive: { background: "#e8a020", border: "1.5px solid #e8a020", color: "#111" },
  itemList: { padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 },
  card: { background: "#1a1a1a", borderRadius: 14, padding: 14, display: "flex", gap: 12, border: "1px solid #2a2a2a", transition: "transform 0.2s" },
  cardEmoji: { fontSize: 36, width: 52, height: 52, background: "#222", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardInfo: { flex: 1 },
  itemName: { fontWeight: 700, color: "white", fontSize: 14 },
  hotTag: { background: "#2a1a00", color: "#e8a020", fontSize: 10, padding: "2px 7px", borderRadius: 6, fontWeight: 700 },
  itemDesc: { color: "#666", fontSize: 12, marginTop: 3, lineHeight: 1.4 },
  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  itemPrice: { fontWeight: 800, color: "#e8a020", fontSize: 15 },
  addBtn: { background: "#e8a020", color: "#111", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  qtyBox: { display: "flex", alignItems: "center", gap: 8, background: "#222", borderRadius: 8, padding: "4px 8px" },
  qBtn: { background: "none", border: "none", color: "#e8a020", fontSize: 18, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: "0 2px" },
  qNum: { color: "white", fontWeight: 800, minWidth: 18, textAlign: "center" },
  floatBtn: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg, #e8a020, #d4420a)", color: "white", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", gap: 20, alignItems: "center", boxShadow: "0 8px 32px rgba(232,160,32,0.4)", fontFamily: "'Nunito', sans-serif", width: "calc(100% - 32px)", maxWidth: 448, justifyContent: "space-between" },
  cartView: { padding: "16px 20px" },
  backBtn: { background: "none", border: "none", color: "#e8a020", fontSize: 14, cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700, padding: "0 0 12px", display: "block" },
  sectionTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2, color: "white", marginBottom: 16 },
  orderTypeRow: { display: "flex", gap: 10, marginBottom: 16 },
  typeBtn: { flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #333", background: "transparent", color: "#aaa", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  typeBtnActive: { background: "#e8a020", border: "1.5px solid #e8a020", color: "#111" },
  cartItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #2a2a2a" },
  totalBox: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid #333", marginTop: 4 },
  input: { width: "100%", padding: "13px 16px", borderRadius: 10, border: "1.5px solid #333", background: "#1a1a1a", color: "white", fontSize: 14, fontFamily: "'Nunito', sans-serif", marginBottom: 10 },
  whatsappBtn: { width: "100%", padding: "16px", background: "#25D366", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8, fontFamily: "'Nunito', sans-serif" },
  confirmWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32 },
  confirmCircle: { fontSize: 64, background: "#e8a020", borderRadius: "50%", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  confirmTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: 3, color: "white", marginBottom: 8 },
  confirmSub: { color: "#aaa", fontSize: 14, marginBottom: 24, textAlign: "center" },
  confirmInfo: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 14, padding: "20px 40px", marginBottom: 16, textAlign: "center" },
  newOrderBtn: { background: "#e8a020", color: "#111", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
};
