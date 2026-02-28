"use client"
import { useState, useEffect, useCallback } from "react";

// ─── DEMO DATA ───────────────────────────────────────────
const BOATS = [
  { id: 1, name: "Romar Bermuda 570", type: "Gommone", pax: 6, license: false, img: "🚤", color: "#0891B2" },
  { id: 2, name: "Salpa Soleil 20", type: "Open", pax: 8, license: false, img: "⛵", color: "#059669" },
  { id: 3, name: "Manò 24 Sport", type: "Cabinato", pax: 10, license: true, img: "🛥️", color: "#7C3AED" },
  { id: 4, name: "Clubman 26", type: "Gommone", pax: 12, license: true, img: "🚤", color: "#DC2626" },
  { id: 5, name: "Cranchi Endurance 35", type: "Yacht", pax: 12, license: true, img: "🛳️", color: "#D97706" },
  { id: 6, name: "Riva Aquarama 38", type: "Luxury", pax: 8, license: true, img: "✨", color: "#0B1D3A" },
];

const SERVICES = [
  { id: 1, name: "Locazione Self-Drive", type: "rental", icon: "🔑" },
  { id: 2, name: "Tour Amalfi Coast", type: "tour", icon: "🗺️" },
  { id: 3, name: "Tour Capri", type: "tour", icon: "🏝️" },
  { id: 4, name: "Taxi Positano", type: "taxi", icon: "🚕" },
  { id: 5, name: "Tour Collettivo Costiera", type: "collective", icon: "👥" },
];

const CUSTOMERS = [
  { id: 1, first: "Marco", last: "Rossi", email: "m.rossi@email.it", phone: "+39 333 1234567", country: "🇮🇹" },
  { id: 2, first: "John", last: "Smith", email: "j.smith@mail.com", phone: "+44 7700 900123", country: "🇬🇧" },
  { id: 3, first: "Sophie", last: "Müller", email: "s.muller@web.de", phone: "+49 151 1234567", country: "🇩🇪" },
  { id: 4, first: "Pierre", last: "Dubois", email: "p.dubois@free.fr", phone: "+33 6 12345678", country: "🇫🇷" },
  { id: 5, first: "Maria", last: "García", email: "m.garcia@correo.es", phone: "+34 612 345678", country: "🇪🇸" },
  { id: 6, first: "Emma", last: "Johnson", email: "emma.j@outlook.com", phone: "+1 555 234 5678", country: "🇺🇸" },
  { id: 7, first: "Luca", last: "Bianchi", email: "l.bianchi@pec.it", phone: "+39 347 9876543", country: "🇮🇹" },
  { id: 8, first: "Hans", last: "Weber", email: "h.weber@gmx.de", phone: "+49 170 9876543", country: "🇩🇪" },
];

const SKIPPERS = [
  { id: 1, name: "Antonio Esposito", phone: "+39 338 111 2222", license: "2027-09-15" },
  { id: 2, name: "Giuseppe Marino", phone: "+39 339 333 4444", license: "2026-12-01" },
  { id: 3, name: "Salvatore Conte", phone: "+39 340 555 6666", license: "2026-06-30" },
];

const STATUSES = [
  { code: "pending", name: "In Attesa", color: "#EAB308", bg: "#FEF9C3" },
  { code: "option", name: "Opzione", color: "#F97316", bg: "#FED7AA" },
  { code: "confirmed", name: "Confermata", color: "#059669", bg: "#D1FAE5" },
  { code: "cancelled", name: "Annullata", color: "#A855F7", bg: "#F3E8FF" },
  { code: "completed", name: "Completata", color: "#DC2626", bg: "#FEE2E2" },
];

function genDate(offset) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

const BOOKINGS = [
  { id: "BK-2026-001", customer: 0, boat: 0, service: 0, date: genDate(0), endDate: null, slot: "full_day", pax: 4, price: 180, deposit: 54, balance: 126, status: 2, skipper: null, source: "online", notes: "" },
  { id: "BK-2026-002", customer: 1, boat: 4, service: 2, date: genDate(0), endDate: null, slot: "full_day", pax: 8, price: 650, deposit: 195, balance: 0, status: 2, skipper: 0, source: "online", notes: "Anniversary trip" },
  { id: "BK-2026-003", customer: 2, boat: 2, service: 1, date: genDate(1), endDate: null, slot: "morning", pax: 6, price: 450, deposit: 135, balance: 315, status: 0, skipper: 1, source: "in_person", notes: "" },
  { id: "BK-2026-004", customer: 3, boat: 1, service: 0, date: genDate(1), endDate: genDate(3), slot: "full_day", pax: 5, price: 450, deposit: 135, balance: 0, status: 2, skipper: null, source: "online", notes: "3 giorni - famiglia" },
  { id: "BK-2026-005", customer: 4, boat: 3, service: 3, date: genDate(2), endDate: null, slot: "morning", pax: 4, price: 280, deposit: 84, balance: 196, status: 1, skipper: 2, source: "supplier", notes: "" },
  { id: "BK-2026-006", customer: 5, boat: 5, service: 1, date: genDate(2), endDate: null, slot: "full_day", pax: 6, price: 900, deposit: 270, balance: 630, status: 0, skipper: 0, source: "online", notes: "VIP request" },
  { id: "BK-2026-007", customer: 6, boat: 0, service: 0, date: genDate(3), endDate: null, slot: "afternoon", pax: 3, price: 130, deposit: 39, balance: 91, status: 2, skipper: null, source: "in_person", notes: "" },
  { id: "BK-2026-008", customer: 7, boat: 2, service: 2, date: genDate(4), endDate: null, slot: "full_day", pax: 8, price: 520, deposit: 156, balance: 364, status: 0, skipper: 1, source: "online", notes: "" },
  { id: "BK-2026-009", customer: 0, boat: 4, service: 1, date: genDate(-1), endDate: null, slot: "full_day", pax: 10, price: 700, deposit: 210, balance: 490, status: 4, skipper: 0, source: "online", notes: "" },
  { id: "BK-2026-010", customer: 3, boat: 1, service: 4, date: genDate(5), endDate: null, slot: "morning", pax: 12, price: 35, deposit: 0, balance: 0, status: 2, skipper: 2, source: "online", notes: "€35/persona - collettivo" },
];

// ─── PALETTE ─────────────────────────────────────────────
const C = {
  navy: "#0B1D3A", deep: "#1E3A5F", teal: "#0891B2", tealL: "#22D3EE",
  gold: "#F59E0B", ice: "#E0F2FE", off: "#F0F9FF", body: "#334155",
  muted: "#64748B", white: "#FFF", green: "#059669", bg: "#F8FAFC",
};

const slotLabel = (s) => ({ morning: "🌅 Mattina", afternoon: "🌇 Pomeriggio", full_day: "☀️ Giornata", evening: "🌙 Sera" }[s] || s);
const fmtDate = (d) => { const p = d.split("-"); return `${p[2]}/${p[1]}`; };
const fmtPrice = (n) => `€${n.toLocaleString("it-IT")}`;

// ─── RESPONSIVE HOOK ─────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── MAIN APP ────────────────────────────────────────────
export default function BluFleetDemo() {
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const isMobile = useIsMobile();

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const nav = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "bookings", icon: "📋", label: "Prenotazioni" },
    { id: "planning", icon: "🗓️", label: "Planning" },
    { id: "fleet", icon: "🚤", label: "Flotta" },
    { id: "customers", icon: "👥", label: "Clienti" },

  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: C.bg, overflow: "hidden" }}>

      {/* MOBILE OVERLAY */}
      {sideOpen && <div onClick={() => setSideOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 40 }} />}

      {/* SIDEBAR */}
      <aside style={{
        width: 220, minWidth: 220, background: `linear-gradient(180deg, ${C.navy} 0%, ${C.deep} 100%)`,
        display: "flex", flexDirection: "column", zIndex: 50, transition: "transform .25s",
        position: isMobile ? "fixed" : "relative",
        height: "100%",
        transform: isMobile && !sideOpen ? "translateX(-100%)" : "translateX(0)",
      }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.teal}, ${C.tealL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚓</div>
            <div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 16, letterSpacing: -.3 }}>Blu Fleet</div>
              <div style={{ color: C.tealL, fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Demo Mode</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setSideOpen(false); setDetail(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "11px 14px", marginBottom: 4, borderRadius: 10, border: "none", cursor: "pointer",
                background: page === n.id ? "rgba(8,145,178,.2)" : "transparent",
                color: page === n.id ? C.tealL : "rgba(255,255,255,.55)",
                fontSize: 14, fontWeight: page === n.id ? 600 : 400, transition: "all .15s",
                textAlign: "left",
              }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.3)", fontSize: 11 }}>
          <div>Powered by <span style={{ color: C.tealL }}>NS3000</span></div>
          <div style={{ marginTop: 4 }}>Versione Demo · 2026</div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
        {/* TOP BAR */}
        <header style={{ background: C.white, borderBottom: "1px solid #E2E8F0", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", display: isMobile ? "block" : "none" }}>☰</button>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>{nav.find(n => n.id === page)?.label}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <span style={{ fontSize: 20, cursor: "pointer" }} onClick={() => showToast("🔔 3 prenotazioni in attesa di conferma")}>🔔</span>
              <span style={{ position: "absolute", top: -4, right: -6, background: "#EF4444", color: C.white, fontSize: 10, fontWeight: 700, borderRadius: 99, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>DA</div>
          </div>
        </header>

        <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
          {page === "dashboard" && <DashboardPage bookings={BOOKINGS} showToast={showToast} setPage={setPage} />}
          {page === "bookings" && <BookingsPage bookings={BOOKINGS} detail={detail} setDetail={setDetail} showToast={showToast} />}
          {page === "planning" && <PlanningPage bookings={BOOKINGS} setDetail={setDetail} setPage={setPage} />}
          {page === "fleet" && <FleetPage />}
          {page === "customers" && <CustomersPage bookings={BOOKINGS} />}

        </div>
      </main>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: C.navy, color: C.white,
          padding: "14px 22px", borderRadius: 12, fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,.25)", zIndex: 99, maxWidth: 340,
          animation: "slideIn .3s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* DEMO BADGE */}
      <div style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
        background: "linear-gradient(135deg, #0B1D3A, #1E3A5F)",
        color: C.tealL, fontSize: 11, fontWeight: 700, letterSpacing: 1,
        padding: "8px 20px", borderRadius: 99, zIndex: 60,
        boxShadow: "0 4px 20px rgba(0,0,0,.3)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: C.tealL, animation: "pulse 2s infinite" }} />
        DEMO INTERATTIVA — Dati simulati
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────
function Stat({ icon, label, value, sub, accent = C.teal }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, padding: "20px 22px", border: "1px solid #E2E8F0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 28 }}>{icon}</div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────
function DashboardPage({ bookings, showToast, setPage }) {
  const today = genDate(0);
  const todayBookings = bookings.filter(b => b.date === today || (b.endDate && b.date <= today && b.endDate >= today));
  const confirmed = bookings.filter(b => b.status === 2).length;
  const totalRev = bookings.reduce((s, b) => s + b.price, 0);
  const collected = bookings.reduce((s, b) => s + b.deposit + (b.price - b.deposit - b.balance > 0 ? 0 : b.balance === 0 && b.status === 2 ? b.price - b.deposit : 0), 0);
  const pending = bookings.filter(b => b.status === 0).length;

  return (
    <div>
      {/* WELCOME */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.deep})`, borderRadius: 16, padding: "28px 30px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(8,145,178,.15)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>Buongiorno, Admin 👋</div>
          <div style={{ color: C.white, fontSize: 22, fontWeight: 700, marginTop: 4 }}>Panoramica della giornata</div>
          <div style={{ color: C.tealL, fontSize: 14, marginTop: 8 }}>
            <strong>{todayBookings.length}</strong> prenotazioni oggi · <strong>{pending}</strong> in attesa di conferma
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <Stat icon="📋" label="Prenotazioni" value={bookings.length} sub={`${confirmed} confermate`} />
        <Stat icon="💰" label="Fatturato" value={fmtPrice(totalRev)} sub="Periodo corrente" accent={C.green} />
        <Stat icon="🚤" label="Barche attive" value={BOATS.length} sub="Disponibilità 100%" accent={C.gold} />
        <Stat icon="⚓" label="Skipper" value={SKIPPERS.length} sub="Tutti operativi" accent="#7C3AED" />
      </div>

      {/* TODAY */}
      <div style={{ background: C.white, borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.navy }}>🗓️ Prenotazioni di Oggi</div>
          <button onClick={() => setPage("bookings")} style={{ background: "none", border: "none", color: C.teal, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Vedi tutte →</button>
        </div>
        {todayBookings.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: C.muted }}>Nessuna prenotazione per oggi</div>
        ) : todayBookings.map((b, i) => {
          const c = CUSTOMERS[b.customer]; const bt = BOATS[b.boat]; const st = STATUSES[b.status];
          return (
            <div key={i} style={{ padding: "14px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: bt.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{bt.img}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{c.first} {c.last} {c.country}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{bt.name} · {slotLabel(b.slot)} · {b.pax} pax</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: st.bg, color: st.color }}>{st.name}</span>
              <div style={{ fontWeight: 700, color: C.navy, fontSize: 15, minWidth: 70, textAlign: "right" }}>{fmtPrice(b.price)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BOOKINGS ────────────────────────────────────────────
function BookingsPage({ bookings, detail, setDetail, showToast }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? bookings : bookings.filter(b => STATUSES[b.status].code === filter);

  if (detail !== null) {
    const b = bookings[detail]; const c = CUSTOMERS[b.customer]; const bt = BOATS[b.boat];
    const sv = SERVICES[b.service]; const st = STATUSES[b.status]; const sk = b.skipper !== null ? SKIPPERS[b.skipper] : null;
    const due = Math.max(0, b.price - b.deposit - (b.status === 2 && b.balance === 0 ? b.price - b.deposit : b.balance));

    return (
      <div>
        <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", color: C.teal, fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 16 }}>← Torna alla lista</button>
        <div style={{ background: C.white, borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.deep})`, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ color: "rgba(255,255,255,.5)", fontSize: 12, letterSpacing: 1 }}>{b.id}</div>
              <div style={{ color: C.white, fontSize: 20, fontWeight: 700, marginTop: 4 }}>{c.first} {c.last} {c.country}</div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 8, background: st.bg, color: st.color }}>{st.name}</span>
          </div>
          <div style={{ padding: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            <InfoBlock title="Servizio" items={[
              ["Tipo", `${sv.icon} ${sv.name}`],
              ["Barca", `${bt.img} ${bt.name}`],
              ["Data", `${fmtDate(b.date)}${b.endDate ? ` → ${fmtDate(b.endDate)}` : ""}`],
              ["Fascia", slotLabel(b.slot)],
              ["Passeggeri", `${b.pax} pax`],
              ...(sk ? [["Skipper", `⚓ ${sk.name}`]] : []),
            ]} />
            <InfoBlock title="Pagamenti" items={[
              ["Totale", fmtPrice(b.price)],
              ["Acconto", fmtPrice(b.deposit)],
              ["Saldo", fmtPrice(b.balance)],
              ["Da ricevere", fmtPrice(due)],
              ["Fonte", b.source === "online" ? "🌐 Online" : b.source === "in_person" ? "🏢 Diretto" : "🤝 Fornitore"],
            ]} />
            <InfoBlock title="Cliente" items={[
              ["Nome", `${c.first} ${c.last}`],
              ["Email", c.email],
              ["Telefono", c.phone],
              ...(b.notes ? [["Note", b.notes]] : []),
            ]} />
          </div>
          <div style={{ padding: "16px 28px 24px", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <DemoBtn icon="📧" label="Invia Conferma" onClick={() => showToast(`📧 Email di conferma inviata a ${c.email}`)} />
            <DemoBtn icon="📱" label="Invia SMS" onClick={() => showToast(`📱 SMS inviato a ${c.phone}`)} />
            <DemoBtn icon="📄" label="Genera Contratto" onClick={() => showToast("📄 Contratto PDF generato!")} />
            <DemoBtn icon="✏️" label="Modifica" onClick={() => showToast("✏️ Modal modifica (funzione demo)")} accent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[{ v: "all", l: "Tutte" }, ...STATUSES.map(s => ({ v: s.code, l: s.name }))].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} style={{
            padding: "7px 16px", borderRadius: 8, border: "1px solid", fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: filter === f.v ? C.navy : C.white,
            color: filter === f.v ? C.white : C.body,
            borderColor: filter === f.v ? C.navy : "#E2E8F0",
          }}>{f.l}</button>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        {filtered.map((b, i) => {
          const c = CUSTOMERS[b.customer]; const bt = BOATS[b.boat]; const st = STATUSES[b.status];
          const due = Math.max(0, b.price - b.deposit - (b.status === 2 && b.balance === 0 ? b.price - b.deposit : b.balance));
          return (
            <div key={i} onClick={() => setDetail(i)} style={{ padding: "14px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: bt.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{bt.img}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{c.country} {c.first} {c.last}</div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {bt.name} · {fmtDate(b.date)}{b.endDate && b.endDate !== b.date ? ` → ${fmtDate(b.endDate)}` : ""} · {b.pax} pax
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: st.bg, color: st.color, whiteSpace: "nowrap" }}>{st.name}</span>
              <div style={{ textAlign: "right", minWidth: 80 }}>
                <div style={{ fontWeight: 700, color: C.navy, fontSize: 15 }}>{fmtPrice(b.price)}</div>
                {due > 0 && <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 600 }}>Da: {fmtPrice(due)}</div>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ padding: 32, textAlign: "center", color: C.muted }}>Nessuna prenotazione</div>}
      </div>
    </div>
  );
}

function InfoBlock({ title, items }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>{title}</div>
      {items.map(([k, v], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F1F5F9", fontSize: 14 }}>
          <span style={{ color: C.muted }}>{k}</span>
          <span style={{ color: C.navy, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function DemoBtn({ icon, label, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10,
      border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
      background: accent ? C.teal : C.ice, color: accent ? C.white : C.deep,
    }}>{icon} {label}</button>
  );
}

// ─── PLANNING ────────────────────────────────────────────
function PlanningPage({ bookings, setDetail, setPage }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], day: d.toLocaleDateString("it-IT", { weekday: "short" }), num: d.getDate() };
  });

  return (
    <div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Vista settimanale · Clicca una prenotazione per i dettagli</div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${days.length}, minmax(120px, 1fr))`, minWidth: 900, gap: 1, background: "#E2E8F0", borderRadius: 14, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: C.navy, padding: "12px 14px", color: "rgba(255,255,255,.5)", fontSize: 11, fontWeight: 600 }}>BARCA</div>
          {days.map((d, i) => (
            <div key={i} style={{ background: C.navy, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11, textTransform: "uppercase" }}>{d.day}</div>
              <div style={{ color: d.date === genDate(0) ? C.tealL : C.white, fontSize: 18, fontWeight: 700 }}>{d.num}</div>
            </div>
          ))}

          {/* Rows */}
          {BOATS.map((boat, bi) => (
            [
              <div key={`boat-${bi}`} style={{ background: C.white, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, borderRight: "2px solid #E2E8F0" }}>
                <span style={{ fontSize: 18 }}>{boat.img}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{boat.name.split(" ").slice(0, 2).join(" ")}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{boat.pax} pax</div>
                </div>
              </div>,
              ...days.map((day, di) => {
                const dayBookings = bookings.filter(b => {
                  if (b.boat !== bi) return false;
                  if (b.endDate) return b.date <= day.date && b.endDate >= day.date;
                  return b.date === day.date;
                });
                return (
                  <div key={`cell-${bi}-${di}`} style={{ background: day.date === genDate(0) ? "#F0F9FF" : C.white, padding: 4, minHeight: 56 }}>
                    {dayBookings.map((b, idx) => {
                      const st = STATUSES[b.status]; const c = CUSTOMERS[b.customer];
                      const bIdx = bookings.indexOf(b);
                      return (
                        <div key={idx} onClick={() => { setDetail(bIdx); setPage("bookings"); }}
                          style={{
                            background: st.bg, borderLeft: `3px solid ${st.color}`, borderRadius: 6,
                            padding: "4px 7px", marginBottom: 2, cursor: "pointer", transition: "transform .15s",
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: st.color, lineHeight: 1.3 }}>{c.last}</div>
                          <div style={{ fontSize: 9, color: C.muted }}>{slotLabel(b.slot).replace(/[^\w\s]/g, "").trim()}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ]
          )).flat()}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {STATUSES.slice(0, 4).map(s => (
          <div key={s.code} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} /> {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FLEET ───────────────────────────────────────────────
function FleetPage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
      {BOATS.map((b, i) => (
        <div key={i} style={{ background: C.white, borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", transition: "transform .2s, box-shadow .2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
          <div style={{ background: `linear-gradient(135deg, ${b.color}CC, ${b.color})`, padding: "28px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48 }}>{b.img}</div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 18, marginTop: 8 }}>{b.name}</div>
            <div style={{ color: "rgba(255,255,255,.65)", fontSize: 13, marginTop: 2 }}>{b.type}</div>
          </div>
          <div style={{ padding: "18px 22px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <MiniStat label="Posti" value={`${b.pax} pax`} />
              <MiniStat label="Patente" value={b.license ? "Richiesta" : "Non richiesta"} />
              <MiniStat label="Half Day" value={`€${80 + i * 40}`} />
              <MiniStat label="Full Day" value={`€${150 + i * 80}`} />
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#D1FAE5", color: "#059669" }}>✓ Disponibile</span>
              {b.license && <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#FEF3C7", color: "#D97706" }}>🪪 Patente</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "8px 12px" }}>
      <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{value}</div>
    </div>
  );
}

// ─── CUSTOMERS ───────────────────────────────────────────
function CustomersPage({ bookings }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
      {CUSTOMERS.map((c, i) => {
        const custBookings = bookings.filter(b => b.customer === i);
        const totalSpent = custBookings.reduce((s, b) => s + b.price, 0);
        return (
          <div key={i} style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `hsl(${i * 45}, 60%, 92%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: `hsl(${i * 45}, 50%, 40%)` }}>
              {c.first[0]}{c.last[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.navy }}>{c.country} {c.first} {c.last}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{c.email} · {c.phone}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: C.navy, fontSize: 15 }}>{custBookings.length} prenotazioni</div>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{fmtPrice(totalSpent)} totale</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
