import { useState, useEffect } from "react";

const ADMIN_PIN = "1234";

const STATUS_CONFIG = {
  new: { label: "New", color: "#e8a020", bg: "#2a1f00", icon: "🔔" },
  confirmed: { label: "Confirmed", color: "#3b9eff", bg: "#001a2a", icon: "✅" },
  preparing: { label: "Preparing", color: "#a259ff", bg: "#1a0033", icon: "👨‍🍳" },
  ready: { label: "Ready", color: "#25D366", bg: "#002a14", icon: "🎉" },
  delivered: { label: "Delivered", color: "#555", bg: "#1a1a1a", icon: "✔️" },
};

const DEMO_ORDERS = [
  { id: "ORD-001", customerName: "Ali Hassan", phone: "0300-1234567", address: "House 5, Block B, Satellite Town", branch: "Satellite Town", orderType: "delivery", items: [{ name: "Afghani Tikka Pizza", qty: 1, price: 899 }, { name: "Crispy Fries", qty: 2, price: 149 }], total: 1197, status: "new", time: Date.now() - 3 * 60000 },
  { id: "ORD-002", customerName: "Sara Khan", phone: "0321-9876543", address: "", branch: "Noshehra Road", orderType: "takeaway", items: [{ name: "Deal 1 - Family", qty: 1, price: 999 }, { name: "Mojito", qty: 2, price: 249 }], total: 1497, status: "preparing", time: Date.now() - 15 * 60000 },
  { id: "ORD-003", customerName: "Usman Malik", phone: "0333-5551234", address: "Plot 22, Citi Housing Phase 2", branch: "Citi Housing", orderType: "delivery", items: [{ name: "Beef Tikka Pizza", qty: 1, price: 949 }, { name: "Zinger Burger", qty: 2, price: 349 }], total: 1647, status: "confirmed", time: Date.now() - 8 * 60000 },
];

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const newCount = orders.filter(o => o.status === "new").length;
  const todayRevenue = orders.reduce((s, o) => s + o.total, 0);
  const filtered = orders.filter(o => filterStatus === "all" || o.status === filterStatus);

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    if (selected?.id === orderId) setSelected({ ...selected, status: newStatus });
  };

  const handlePin = () => {
    if (pin === ADMIN_PIN) { setAuthed(true); setPinError(false); }
    else { setPinError(true); setPin(""); }
  };

  const next = { new: "confirmed", confirmed: "preparing", preparing: "ready", ready: "delivered" };

  if (!authed) {
    return (
      <div style={a.page}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } input:focus { outline: none; border-color: #e8a020 !important; }`}</style>
        <div style={a.pinWrap}>
          <div style={a.pinLogo}>🍕</div>
          <h1 style={a.pinTitle}>MR. PIZZA</h1>
          <p style={a.pinSub}>Admin Dashboard</p>
          <div style={a.pinBox}>
            <p style={{ color: "#aaa", fontSize: 13, marginBottom: 12 }}>Enter PIN to continue</p>
            <input style={{ ...a.pinInput, borderColor: pinError ? "#ff4444" : "#333" }} type="password" placeholder="• • • •" value={pin} maxLength={4} onChange={e => { setPin(e.target.value); setPinError(false); }} onKeyDown={e => e.key === "Enter" && handlePin()} />
            {pinError && <p style={{ color: "#ff4444", fontSize: 12, marginTop: 6 }}>Wrong PIN. Try 1234</p>}
            <button style={a.pinBtn} onClick={handlePin}>Login →</button>
            <p style={{ color: "#444", fontSize: 11, marginTop: 12 }}>Demo PIN: 1234</p>
          </div>
        </div>
      </div>
    );
  }

  if (selected) {
    const sc = STATUS_CONFIG[selected.status];
    return (
      <div style={a.page}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <div style={a.detailHeader}>
          <button style={a.backBtn} onClick={() => setSelected(null)}>← Back</button>
          <h2 style={a.detailId}>{selected.id}</h2>
          <span style={{ ...a.statusBadge, color: sc.color, background: sc.bg }}>{sc.icon} {sc.label}</span>
        </div>
        <div style={{ padding: "0 16px 100px" }}>
          <div style={a.detailCard}>
            <p style={a.detailSectionLabel}>CUSTOMER</p>
            <p style={a.detailValue}>👤 {selected.customerName}</p>
            <p style={a.detailValue}>📞 {selected.phone}</p>
            {selected.orderType === "delivery" && <p style={a.detailValue}>🏠 {selected.address}</p>}
            <p style={a.detailValue}>📍 {selected.branch} · {selected.orderType === "delivery" ? "Delivery" : "Takeaway"}</p>
            <p style={{ ...a.detailValue, color: "#555", fontSize: 12 }}>🕐 {timeAgo(selected.time)}</p>
          </div>
          <div style={a.detailCard}>
            <p style={a.detailSectionLabel}>ORDER ITEMS</p>
            {selected.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #222" }}>
                <span style={{ color: "white", fontSize: 14 }}>{item.name} <span style={{ color: "#555" }}>×{item.qty}</span></span>
                <span style={{ color: "#e8a020", fontWeight: 700 }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
              <span style={{ color: "#aaa", fontWeight: 700 }}>TOTAL</span>
              <span style={{ color: "#e8a020", fontSize: 20, fontWeight: 800 }}>Rs. {selected.total.toLocaleString()}</span>
            </div>
          </div>
          <div style={a.detailCard}>
            <p style={a.detailSectionLabel}>UPDATE STATUS</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} style={{ ...a.statusFlowBtn, background: selected.status === key ? cfg.bg : "transparent", border: `1.5px solid ${selected.status === key ? cfg.color : "#2a2a2a"}`, color: selected.status === key ? cfg.color : "#555" }} onClick={() => updateStatus(selected.id, key)}>
                  {cfg.icon} {cfg.label}
                  {selected.status === key && <span style={{ marginLeft: "auto", fontSize: 11 }}>← CURRENT</span>}
                </button>
              ))}
            </div>
          </div>
          {next[selected.status] && (
            <button style={a.nextStatusBtn} onClick={() => updateStatus(selected.id, next[selected.status])}>
              Mark as {STATUS_CONFIG[next[selected.status]].icon} {STATUS_CONFIG[next[selected.status]].label}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={a.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .ocard:hover { border-color: #e8a020 !important; }`}</style>
      <div style={a.header}>
        <div>
          <h1 style={a.headerTitle}>MR. PIZZA</h1>
          <p style={a.headerSub}>Admin Panel</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {newCount > 0 && <div style={a.alertBadge}>🔔 {newCount} New</div>}
          <button style={a.logoutBtn} onClick={() => setAuthed(false)}>Logout</button>
        </div>
      </div>
      <div style={a.statsBar}>
        <div style={a.statItem}><p style={a.statNum}>{orders.length}</p><p style={a.statLabel}>Total Orders</p></div>
        <div style={a.statDivider} />
        <div style={a.statItem}><p style={{ ...a.statNum, color: "#e8a020" }}>{newCount}</p><p style={a.statLabel}>Pending</p></div>
        <div style={a.statDivider} />
        <div style={a.statItem}><p style={{ ...a.statNum, color: "#25D366", fontSize: 16 }}>Rs. {todayRevenue.toLocaleString()}</p><p style={a.statLabel}>Revenue</p></div>
      </div>
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8, overflowX: "auto" }}>
        {["all", "new", "confirmed", "preparing", "ready", "delivered"].map(st => (
          <button key={st} style={{ ...a.filterBtn, ...(filterStatus === st ? a.filterActive : {}) }} onClick={() => setFilterStatus(st)}>
            {st === "all" ? "All" : STATUS_CONFIG[st].icon + " " + STATUS_CONFIG[st].label}
          </button>
        ))}
      </div>
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: "#444" }}><p style={{ fontSize: 40 }}>📋</p><p style={{ marginTop: 10 }}>No orders found</p></div>}
        {filtered.sort((x, y) => y.time - x.time).map(order => {
          const sc = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="ocard" style={{ ...a.orderCard, borderColor: order.status === "new" ? "#e8a020" : "#2a2a2a" }} onClick={() => setSelected(order)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1, color: "white" }}>{order.id}</p>
                  <p style={{ color: "#aaa", fontSize: 12 }}>{timeAgo(order.time)} · {order.branch}</p>
                </div>
                <span style={{ ...a.statusBadge, color: sc.color, background: sc.bg }}>{sc.icon} {sc.label}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{order.customerName}</p>
                  <p style={{ color: "#666", fontSize: 12 }}>{order.items.length} item{order.items.length > 1 ? "s" : ""} · {order.orderType === "delivery" ? "🏠 Delivery" : "🏃 Takeaway"}</p>
                </div>
                <p style={{ color: "#e8a020", fontWeight: 800, fontSize: 16, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>Rs. {order.total.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const a = {
  page: { fontFamily: "'Nunito', sans-serif", background: "#111", minHeight: "100vh", maxWidth: 480, margin: "0 auto", color: "white", paddingBottom: 40 },
  pinWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32 },
  pinLogo: { fontSize: 56, background: "#e8a020", borderRadius: "50%", width: 88, height: 88, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  pinTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 4, color: "white" },
  pinSub: { color: "#e8a020", fontSize: 13, letterSpacing: 2, marginBottom: 32 },
  pinBox: { background: "#1a1a1a", borderRadius: 16, padding: 24, width: "100%", maxWidth: 300, textAlign: "center", border: "1px solid #2a2a2a" },
  pinInput: { width: "100%", padding: "14px", borderRadius: 10, border: "1.5px solid #333", background: "#111", color: "white", fontSize: 20, textAlign: "center", fontFamily: "'Nunito', sans-serif", letterSpacing: 8 },
  pinBtn: { width: "100%", marginTop: 14, padding: "13px", background: "#e8a020", color: "#111", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  header: { background: "#1a1a1a", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e8a020" },
  headerTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 3, color: "white", lineHeight: 1 },
  headerSub: { color: "#e8a020", fontSize: 11, letterSpacing: 2 },
  alertBadge: { background: "#2a1f00", color: "#e8a020", border: "1px solid #e8a020", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 800 },
  logoutBtn: { background: "#222", border: "1px solid #333", borderRadius: 8, padding: "7px 14px", color: "#aaa", fontSize: 12, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  statsBar: { display: "flex", background: "#1a1a1a", padding: "16px 0", borderBottom: "1px solid #2a2a2a" },
  statItem: { flex: 1, textAlign: "center" },
  statNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, color: "white" },
  statLabel: { color: "#555", fontSize: 11, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 },
  statDivider: { width: 1, background: "#2a2a2a" },
  filterBtn: { whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 20, border: "1.5px solid #2a2a2a", background: "transparent", color: "#666", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  filterActive: { background: "#e8a020", border: "1.5px solid #e8a020", color: "#111" },
  orderCard: { background: "#1a1a1a", borderRadius: 14, padding: 16, border: "1.5px solid #2a2a2a", cursor: "pointer", transition: "border-color 0.2s" },
  statusBadge: { fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" },
  detailHeader: { background: "#1a1a1a", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #2a2a2a" },
  backBtn: { background: "none", border: "none", color: "#e8a020", fontSize: 14, cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700 },
  detailId: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2, flex: 1 },
  detailCard: { background: "#1a1a1a", borderRadius: 14, padding: 16, margin: "12px 0 0", border: "1px solid #2a2a2a" },
  detailSectionLabel: { color: "#555", fontSize: 11, letterSpacing: 2, fontWeight: 800, marginBottom: 10 },
  detailValue: { color: "#ccc", fontSize: 14, padding: "4px 0" },
  statusFlowBtn: { width: "100%", padding: "11px 16px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, textAlign: "left", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Nunito', sans-serif" },
  nextStatusBtn: { width: "100%", margin: "12px 0 0", padding: "15px", background: "#e8a020", color: "#111", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
};
