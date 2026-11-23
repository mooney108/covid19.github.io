(() => {
  "use strict";

  const STORAGE_KEY = "covid-management-prototype-v1";
  const roles = {
    medical: "Medical Professional",
    patient: "Patient",
    admin: "Administrator",
    public: "General Public",
    shop: "Essential Shop Manager",
    corp: "Corporation Worker Head",
    worker: "Disinfection Worker"
  };
  const navItems = [
    ["dashboard", "Overview Dashboard", "▦", ["medical", "patient", "admin", "public", "shop", "corp", "worker"]],
    ["patients", "Patient Records", "▤", ["medical"]],
    ["health", "My Health Information", "♡", ["patient"]],
    ["statistics", "Geographic Statistics", "⌖", ["medical", "admin", "public", "corp"]],
    ["supplies", "Medical Supplies & Shops", "＋", ["medical", "patient", "admin", "public", "shop"]],
    ["disinfection", "Disinfection Management", "⌁", ["admin", "corp", "worker"]],
    ["users", "User & Access Management", "♙", ["admin"]],
    ["notifications", "Notifications", "◉", ["medical", "patient", "admin", "public", "shop", "corp", "worker"]],
    ["settings", "Settings / About", "⚙", ["medical", "patient", "admin", "public", "shop", "corp", "worker"]]
  ];

  const isoDate = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  const stamp = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString();
  };
  const defaultData = () => ({
    version: 1,
    config: { staleDays: 7, publicMinGroup: 5 },
    users: [
      { id: "USR-100", name: "Dr. Morgan Lee", role: "medical", status: "Active", lastActivity: stamp(-1) },
      { id: "USR-101", name: "Alex Morgan", role: "patient", patientId: "PAT-2401", status: "Active", lastActivity: stamp(-2) },
      { id: "USR-102", name: "Sam Taylor", role: "patient", patientId: "PAT-2402", status: "Active", lastActivity: stamp(-18) },
      { id: "USR-103", name: "System Administrator", role: "admin", status: "Active", lastActivity: stamp(0) },
      { id: "USR-104", name: "Riverside Supplies", role: "shop", shopId: "SHOP-02", status: "Active", lastActivity: stamp(-1) },
      { id: "USR-105", name: "Jordan Kim", role: "corp", status: "Active", lastActivity: stamp(-1) },
      { id: "USR-106", name: "Casey Rivera", role: "worker", status: "Active", verification: "Pending Verification", lastActivity: stamp(-2) }
    ],
    patients: [
      { id: "PAT-2401", name: "Alex Morgan", age: 34, gender: "Female", locality: "Riverside", area: "North block (fictional)", registration: isoDate(-24), screening: isoDate(-24), screeningResult: "Positive", status: "Recovered", quarantineStart: isoDate(-24), quarantineEnd: isoDate(-10), discharge: isoDate(-8), recovery: "Recovered", symptoms: "Fatigue, mild cough", notes: "Patient-reported symptoms improving; follow-up completed.", sharedNotes: [{ date: stamp(-1), author: "Dr. Morgan Lee", text: "Your sample follow-up is complete. Continue using your care team's instructions." }], lastUpdated: stamp(-1), monitoring: [{ date: isoDate(-8), oxygen: 98, pressure: "118/76", temperature: 36.8, symptoms: "Mild fatigue", medication: "As recorded by clinician", diet: "Regular fluids", notes: "Fictional follow-up; stable.", by: "Medical Professional" }], prescriptions: [{ medicine: "Example supportive medicine", dosage: "As directed", frequency: "As directed", duration: "5 days", instructions: "Fictional prescription for demonstration only.", prescriber: "Dr. Morgan Lee", date: isoDate(-10), shared: true }], history: [{ date: stamp(-1), by: "Medical Professional", text: "Recovery status reviewed." }] },
      { id: "PAT-2402", name: "Sam Taylor", age: 47, gender: "Male", locality: "Eastbank", area: "Central sector (fictional)", registration: isoDate(-19), screening: isoDate(-19), screeningResult: "Positive", status: "Active", quarantineStart: isoDate(-19), quarantineEnd: isoDate(-2), discharge: "", recovery: "Monitoring", symptoms: "Cough, elevated temperature", notes: "Fictional sample clinical note; review scheduled.", sharedNotes: [], lastUpdated: stamp(-18), monitoring: [{ date: isoDate(-18), oxygen: 96, pressure: "126/82", temperature: 37.8, symptoms: "Cough", medication: "Self-reported", diet: "Fluids encouraged", notes: "Demonstration check-in.", by: "Medical Professional" }], prescriptions: [], history: [{ date: stamp(-18), by: "Medical Professional", text: "Initial monitoring entry recorded." }] },
      { id: "PAT-2403", name: "Jamie Quinn", age: 29, gender: "Non-binary", locality: "Westfield", area: "South quarter (fictional)", registration: isoDate(-12), screening: isoDate(-12), screeningResult: "Negative", status: "Not infected", quarantineStart: "", quarantineEnd: "", discharge: "", recovery: "Not applicable", symptoms: "None reported", notes: "Fictional screening record.", sharedNotes: [], lastUpdated: stamp(-2), monitoring: [], prescriptions: [], history: [{ date: stamp(-2), by: "Medical Professional", text: "Screening result recorded." }] }
    ],
    areas: [
      { id: "AREA-01", locality: "Riverside", street: "Riverside sample zone", cases: 42, active: 8, recovered: 31, deaths: 3, distance: "500 m", date: isoDate(-1), cleanliness: "Needs attention", trend: [3, 5, 4, 8, 6, 9, 8] },
      { id: "AREA-02", locality: "Eastbank", street: "Eastbank sample zone", cases: 31, active: 12, recovered: 18, deaths: 1, distance: "1 km", date: isoDate(-3), cleanliness: "Scheduled", trend: [2, 3, 4, 3, 6, 8, 12] },
      { id: "AREA-03", locality: "Westfield", street: "Westfield sample zone", cases: 17, active: 2, recovered: 14, deaths: 1, distance: "5 km", date: isoDate(-1), cleanliness: "Clean", trend: [1, 2, 2, 3, 2, 2, 2] },
      { id: "AREA-04", locality: "Hillview", street: "Hillview sample zone", cases: 9, active: 3, recovered: 6, deaths: 0, distance: "10 km", date: isoDate(-9), cleanliness: "Needs attention", trend: [0, 1, 2, 1, 2, 2, 3] }
    ],
    shops: [
      { id: "SHOP-01", name: "Community Care Pharmacy", locality: "Riverside", distance: "0.8 km (sample)", address: "Market district (fictional)", contact: "555-0101", hours: "09:00–18:00", products: [{ name: "Masks", qty: 120 }, { name: "Gloves", qty: 45 }, { name: "Hand sanitizer", qty: 28 }, { name: "Disinfectant", qty: 12 }], threshold: 20, updated: stamp(-1), history: [] },
      { id: "SHOP-02", name: "Riverside Supplies", locality: "Riverside", distance: "1.4 km (sample)", address: "North avenue (fictional)", contact: "555-0102", hours: "08:00–20:00", products: [{ name: "Masks", qty: 18 }, { name: "Gloves", qty: 0 }, { name: "Hand sanitizer", qty: 34 }, { name: "Disinfectant", qty: 8 }], threshold: 20, updated: stamp(-2), history: [] },
      { id: "SHOP-03", name: "Eastbank Health Store", locality: "Eastbank", distance: "2.1 km (sample)", address: "Central plaza (fictional)", contact: "555-0103", hours: "10:00–19:00", products: [{ name: "Masks", qty: 64 }, { name: "Gloves", qty: 55 }, { name: "Hand sanitizer", qty: 16 }, { name: "Disinfectant", qty: 23 }], threshold: 20, updated: stamp(-1), history: [] }
    ],
    workers: [{ id: "WORK-01", name: "Casey Rivera", userId: "USR-106", verification: "Pending Verification" }, { id: "WORK-02", name: "Avery Chen", userId: "USR-107", verification: "Verified" }],
    tasks: [
      { id: "TASK-01", areaId: "AREA-01", reason: "Elevated sample active-case count", workerId: "WORK-02", assigned: isoDate(-2), scheduled: isoDate(0), priority: "High", status: "In Progress", verification: "Verified", notes: "Fictional field update: area perimeter started.", completion: "", history: [{ date: stamp(-2), text: "Assigned to Avery Chen" }] },
      { id: "TASK-02", areaId: "AREA-04", reason: "Cleanliness review requested", workerId: "", assigned: "", scheduled: isoDate(1), priority: "Normal", status: "Pending Assignment", verification: "Pending", notes: "", completion: "", history: [] }
    ],
    notifications: [
      { id: "NOT-01", title: "Patient record requires an update", detail: "A fictional patient record has not been updated recently.", category: "Patient record", page: "patients", date: stamp(-1), read: false, roles: ["medical"] },
      { id: "NOT-02", title: "Worker verification is pending", detail: "Casey Rivera requires administrator review.", category: "Access", page: "users", date: stamp(-1), read: false, roles: ["admin"] },
      { id: "NOT-03", title: "Low-stock products detected", detail: "Sample inventory has items below the configured threshold.", category: "Supplies", page: "supplies", date: stamp(-1), read: false, roles: ["shop", "admin", "public", "medical"] },
      { id: "NOT-04", title: "A sample area report may be outdated", detail: "Hillview data is more than seven days old.", category: "Statistics", page: "statistics", date: stamp(-1), read: true, roles: ["medical", "admin", "public", "corp"] }
    ],
    activity: [{ date: stamp(-1), role: "Administrator", text: "Demonstration dataset initialized." }]
  });

  let state = loadData();
  let currentUser = null;
  let currentPage = "dashboard";
  let selectedPatientId = "";
  let selectedSupplyId = "";
  let searchTerm = "";
  let filters = { geoLocality: "All localities", shopLocality: "All localities", distance: "All distances", product: "All products", patientStatus: "All statuses", caseStatus: "All statuses", stockStatus: "All statuses", dischargeStatus: "All discharge states", dateFrom: "", dateTo: "" };

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return defaultData();
      const parsed = JSON.parse(saved);
      if (parsed && parsed.version === 1 && Array.isArray(parsed.users) && Array.isArray(parsed.patients) && Array.isArray(parsed.areas)) {
        const defaults = defaultData();
        return { ...defaults, ...parsed, config: { ...defaults.config, ...(parsed.config || {}) } };
      }
      return defaultData();
    } catch (error) {
      console.error("Unable to load prototype data from localStorage.", error);
      return defaultData();
    }
  }
  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error("Unable to save prototype data to localStorage.", error);
      toast("Could not save changes. Browser storage may be unavailable or full.", true);
      return false;
    }
  }
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const fmtDate = value => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
  const fmtTime = value => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";
  const daysSince = value => value ? Math.floor((Date.now() - new Date(value).getTime()) / 86400000) : Infinity;
  const roleName = role => roles[role] || role;
  const personName = id => state.workers.find(w => w.id === id)?.name || "Unassigned";
  const areaFor = id => state.areas.find(a => a.id === id);
  const statusBadge = value => {
    const v = String(value || "");
    const type = /high|urgent|needs attention|unread|rejected|out of stock|deceased|disabled/i.test(v) ? "red" : /recovered|verified|completed|clean|in stock|active$/i.test(v) ? "green" : /pending|low|review|scheduled|monitoring|in progress/i.test(v) ? "amber" : "blue";
    return `<span class="badge ${type}">${esc(v || "Unknown")}</span>`;
  };
  const app = document.getElementById("app");
  function toast(message, error = false) {
    const region = document.getElementById("toast-region");
    const el = document.createElement("div");
    el.className = `toast${error ? " error" : ""}`;
    el.textContent = message;
    region.append(el);
    setTimeout(() => el.remove(), 3500);
  }
  function logActivity(text) {
    state.activity.unshift({ date: new Date().toISOString(), role: roleName(currentUser?.role || "public"), text });
    state.activity = state.activity.slice(0, 60);
  }
  function notify(title, detail, category, page, rolesList, userId = "") {
    state.notifications.unshift({ id: `NOT-${Date.now()}`, title, detail, category, page, date: new Date().toISOString(), read: false, roles: rolesList, userId });
  }
  function allowed(role, page) {
    const item = navItems.find(row => row[0] === page);
    return Boolean(item && item[3].includes(role));
  }
  function guard(role, message = "This action is not permitted for your demonstration role.") {
    if (!currentUser || currentUser.status === "Disabled" || currentUser.role !== role) {
      toast(message, true);
      return false;
    }
    return true;
  }
  function isVerifiedWorker() {
    return currentUser?.role === "worker" && state.workers.some(w => w.userId === currentUser.id && w.verification === "Verified");
  }
  function canSeeNotification(n) {
    return (!n.roles || n.roles.includes(currentUser?.role)) && (!n.userId || n.userId === currentUser?.id);
  }
  function enterRole(role, userId = "") {
    if (role === "public") {
      currentUser = { id: "PUBLIC", name: "Public visitor", role: "public", status: "Active" };
    } else {
      currentUser = state.users.find(u => u.role === role && u.status === "Active" && (!userId || u.id === userId));
      if (!currentUser) {
        toast(`No active demonstration account is available for ${roleName(role)}.`, true);
        return;
      }
      currentUser.lastActivity = new Date().toISOString();
      saveData();
    }
    if (role === "patient") ensurePatientReminder(currentUser);
    currentPage = role === "patient" ? "health" : role === "worker" ? "disinfection" : "dashboard";
    searchTerm = "";
    render();
  }
  function logout() {
    currentUser = null;
    currentPage = "dashboard";
    render();
  }
  function ensurePatientReminder(user) {
    const patient = state.patients.find(p => p.id === user.patientId);
    if (!patient || daysSince(patient.lastUpdated) <= state.config.staleDays) return;
    if (state.notifications.some(n => n.userId === user.id && n.category === "Patient record" && !n.read)) return;
    notify("Your sample record may need an update", `Your last submitted information is more than ${state.config.staleDays} days old. Please review it; this reminder does not guarantee your record is current.`, "Patient record", "health", ["patient"], user.id);
    saveData();
  }

  function renderLogin() {
    app.innerHTML = `<div class="login-wrap"><section class="login-card">
      <div class="login-intro">
        <div><div class="brand"><span class="brand-mark">+</span><span class="brand-name">COVID-19<br>Management System</span></div>
          <h1>One place for community health operations.</h1>
          <p>A connected demonstration for clinical records, local statistics, essential supplies, and disinfection workflows.</p>
          <div class="role-summary"><div class="role-chip">◈ Patient information</div><div class="role-chip">⌖ Locality statistics</div><div class="role-chip">＋ Supply availability</div><div class="role-chip">⌁ Cleanliness tasks</div></div>
        </div>
        <div class="prototype-note">Academic Prototype — Fictional Data Only. Simulated access is for demonstration and is not production security.</div>
      </div>
      <form id="login-form" class="login-form">
        <h2>Explore the prototype</h2><p>Choose a role to enter using a one-click demonstration account.</p>
        <div class="login-options">
          <div class="field"><label for="login-role">Demonstration role</label><select id="login-role" name="role">
            ${Object.entries(roles).map(([key, name]) => `<option value="${key}">${esc(name)}</option>`).join("")}
          </select></div>
          <div class="field"><label for="login-account">Sample account</label><select id="login-account" name="userId"></select></div>
          <button class="button" type="submit">Continue as selected role →</button>
          <button class="button secondary login-public" type="button" data-action="public-login">Browse public information without registering</button>
        </div>
        <p class="small-text" style="margin-top:22px">No passwords are collected or stored. Sample patient record access is limited to the matching fictional account.</p>
      </form>
    </section></div>`;
    updateLoginAccounts();
  }
  function updateLoginAccounts() {
    const role = document.getElementById("login-role")?.value;
    const select = document.getElementById("login-account");
    if (!select) return;
    const accounts = state.users.filter(u => u.role === role && u.status === "Active");
    select.innerHTML = accounts.length ? accounts.map(u => `<option value="${esc(u.id)}">${esc(u.name)}${u.patientId ? ` · ${esc(u.patientId)}` : ""}</option>`).join("") : `<option value="">No active account available</option>`;
    select.disabled = accounts.length <= 1;
  }
  function shell() {
    const items = navItems.filter(item => allowed(currentUser.role, item[0]));
    const count = state.notifications.filter(n => !n.read && canSeeNotification(n)).length;
    return `<div class="shell">
      <aside id="sidebar" class="sidebar"><div class="brand"><span class="brand-mark">+</span><span class="brand-name">COVID-19<br>Management System</span></div>
        <div><div class="nav-label">Workspace</div><nav class="nav-list" aria-label="Main navigation">${items.map(([id, label, icon]) => `<a class="nav-link${currentPage === id ? " active" : ""}" href="#${id}" data-page="${id}" ${currentPage === id ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon}</span><span>${esc(label)}</span>${id === "notifications" && count ? `<span class="badge red">${count}</span>` : ""}</a>`).join("")}</nav></div>
        <div class="sidebar-foot">Academic demonstration<br>All records and metrics are fictional.</div>
      </aside>
      <div class="main-column"><header class="topbar"><div class="topbar-left"><button class="icon-button mobile-menu" type="button" data-action="toggle-menu" aria-label="Toggle navigation">☰</button><div class="topbar-title">Workspace&nbsp; / &nbsp;<strong>${esc(navItems.find(i => i[0] === currentPage)?.[1] || "Overview")}</strong></div></div>
        <div class="topbar-right"><span class="role-pill">${esc(roleName(currentUser.role))}</span><button type="button" class="icon-button" data-page="notifications" aria-label="${count} unread notifications">♧${count ? ` ${count}` : ""}</button><details class="profile-menu"><summary class="profile"><span class="avatar">${esc(currentUser.name.split(/\s+/).map(w => w[0]).slice(0,2).join("").toUpperCase())}</span><span class="profile-name">${esc(currentUser.name)}</span></summary><div class="profile-dropdown"><strong>${esc(currentUser.name)}</strong><span class="small-text">${esc(roleName(currentUser.role))}</span><button type="button" class="button secondary small" data-action="logout">Log out</button></div></details></div>
      </header><main class="content">${renderPage()}<div class="footer-note">Fictional data • Local browser storage • No real medical advice</div></main></div>
    </div>`;
  }
  function heading(title, desc, action = "") {
    return `<div class="page-heading"><div><h1>${title}</h1><p>${desc}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ""}</div>`;
  }
  function metric(label, value, hint, icon) {
    return `<article class="card metric"><div><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-hint">${hint}</div></div><span class="metric-icon" aria-hidden="true">${icon}</span></article>`;
  }
  function lineChart(values) {
    const vals = values.length ? values : [0, 0, 0, 0, 0, 0, 0];
    const max = Math.max(...vals, 1), points = vals.map((v, i) => `${35 + i * 50},${180 - (v / max) * 135}`).join(" ");
    return `<svg class="chart" viewBox="0 0 370 215" role="img" aria-label="Demonstration cases trend over seven reporting periods"><line class="axis" x1="30" y1="180" x2="350" y2="180"/><line class="axis" x1="30" y1="40" x2="30" y2="180"/><polygon class="area" points="35,180 ${points} 335,180"/><polyline class="line" points="${points}"/>${vals.map((_, i) => `<text x="${30 + i * 50}" y="201">${i + 1}</text>`).join("")}<text x="34" y="23">Reported sample cases · last 7 periods</text></svg>`;
  }
  function barChart(areas) {
    const sums = areas.reduce((acc, a) => ({ active: acc.active + +a.active, recovered: acc.recovered + +a.recovered, deaths: acc.deaths + +a.deaths }), { active: 0, recovered: 0, deaths: 0 });
    const max = Math.max(sums.active, sums.recovered, sums.deaths, 1);
    return `<svg class="chart" viewBox="0 0 370 215" role="img" aria-label="Aggregated sample case status comparison"><line class="axis" x1="32" y1="180" x2="350" y2="180"/>${[["active","Active","bar-active"],["recovered","Recovered","bar-recovered"],["deaths","Reported deaths","bar-deceased"]].map(([k, label, cls], i) => { const h = sums[k] / max * 135, x = 68 + i * 98; return `<rect class="${cls}" x="${x}" y="${180-h}" width="48" height="${h}" rx="4"/><text x="${x}" y="199">${label}</text><text x="${x+13}" y="${170-h}">${sums[k]}</text>`; }).join("")}</svg>`;
  }
  const allCaseCounts = () => state.areas.reduce((a, x) => ({ cases: a.cases + +x.cases, active: a.active + +x.active, recovered: a.recovered + +x.recovered, deaths: a.deaths + +x.deaths }), { cases: 0, active: 0, recovered: 0, deaths: 0 });
  function dashboard() {
    const counts = allCaseCounts();
    const stockAlerts = state.shops.flatMap(s => s.products.filter(p => p.qty <= s.threshold));
    const taskOpen = state.tasks.filter(t => !["Completed"].includes(t.status)).length;
    const attention = state.areas.filter(a => a.cleanliness === "Needs attention" || daysSince(a.date) > state.config.staleDays);
    if (currentUser.role === "patient") return patientDashboard();
    if (currentUser.role === "public") return publicDashboard();
    if (currentUser.role === "shop") return shopDashboard();
    if (currentUser.role === "corp" || currentUser.role === "worker") return operationsDashboard();
    return `${heading("Overview Dashboard", "A live summary calculated from the fictional demonstration dataset.", `<button class="button secondary" data-page="statistics">View geographic statistics</button>`)}
      <div class="grid stats-grid">${metric("Registered demo patients", state.patients.length, "Fictional records", "♙")}${metric("Active cases", counts.active, `${counts.cases} total reported in sample areas`, "＋")}${metric("Recovered cases", counts.recovered, "Aggregated demonstration data", "✓")}${metric("Reported deaths", counts.deaths, "Fictional data only", "◇")}${metric("Areas requiring attention", attention.length, "Cleanliness / reporting review", "⌖")}${metric("Supply stock alerts", stockAlerts.length, "At or below shop thresholds", "▤")}${metric("Open disinfection tasks", taskOpen, "Pending, assigned, or in progress", "⌁")}${metric("Unread notifications", state.notifications.filter(n => !n.read && canSeeNotification(n)).length, "Relevant to this demonstration role", "◉")}</div>
      <div class="grid two-col"><section class="card"><div class="card-head"><div><h2>Case reporting trend</h2><p>Sample area reporting periods, synthetic values</p></div>${statusBadge("Demonstration")}</div><div class="card-body">${lineChart(sumTrends())}</div></section><section class="card"><div class="card-head"><div><h2>Case status</h2><p>Aggregated counts across all sample areas</p></div></div><div class="card-body">${barChart(state.areas)}</div></section></div>
      <div class="grid two-col"><section class="card"><div class="card-head"><div><h2>Areas requiring attention</h2><p>Based on synthetic status and reporting recency</p></div><button class="button secondary small" data-page="statistics">Review areas</button></div>${areasTable(attention, false)}</section><section class="card"><div class="card-head"><div><h2>Recent activity</h2><p>Latest demonstration system events</p></div></div><div class="card-body">${activityList(5)}</div></section></div>
      <div class="grid three-col"><section class="card"><div class="card-head"><h2>Medical supply availability</h2><button class="button secondary small" data-page="supplies">Directory</button></div><div class="card-body">${supplySummary()}</div></section><section class="card"><div class="card-head"><h2>Disinfection task summary</h2>${currentUser.role==="admin"?`<button class="button secondary small" data-page="disinfection">Task board</button>`:""}</div><div class="card-body">${taskSummary()}</div></section><section class="card"><div class="card-head"><h2>Recent notifications</h2><button class="button secondary small" data-page="notifications">All</button></div><div class="card-body">${notificationPreview()}</div></section></div>`;
  }
  function sumTrends() { return Array.from({ length: 7 }, (_, i) => state.areas.reduce((sum, a) => sum + (+a.trend?.[i] || 0), 0)); }
  function patientDashboard() {
    const patient = currentPatient();
    if (!patient) return `${heading("My Health Information", "No fictional health record is linked to this demonstration account.")}<div class="card card-pad empty-state">Ask the instructor to select an account linked to a sample record.</div>`;
    const stale = daysSince(patient.lastUpdated) > state.config.staleDays;
    return `${heading(`Welcome back, ${esc(patient.name)}`, "Your sample health summary and clinician-shared updates.")}${stale ? `<div class="notice warning">Your sample record has not been updated recently. A reminder does not guarantee information is current.</div>` : ""}
      <div class="grid stats-grid">${metric("COVID-19 status", esc(patient.status), `Last updated ${fmtDate(patient.lastUpdated)}`, "♡")}${metric("Screening result", esc(patient.screeningResult), `Screened ${fmtDate(patient.screening)}`, "⌕")}${metric("Quarantine", esc(patient.quarantineEnd ? `Until ${fmtDate(patient.quarantineEnd)}` : "Not recorded"), "See your care team for guidance", "⌂")}${metric("Recent monitoring", patient.monitoring.length, "Professional entries in this sample record", "◷")}</div>
      <div class="grid two-col"><section class="card"><div class="card-head"><h2>Latest monitoring</h2><button class="button secondary small" data-page="health">View my record</button></div><div class="card-body">${patient.monitoring.length ? monitoringTable(patient.monitoring.slice(-3).reverse(), true) : empty("No monitoring entries yet.")}</div></section><section class="card"><div class="card-head"><h2>Doctor-shared updates</h2></div><div class="card-body">${patient.prescriptions.filter(p => p.shared).map(p => `<div class="list-item"><div><strong>${esc(p.medicine)}</strong><p>${esc(p.instructions)} · ${fmtDate(p.date)}</p></div></div>`).join("") || `<p class="small-text">No shared prescription updates.</p>`}${(patient.sharedNotes || []).map(n=>`<div class="list-item"><div><strong>Note from ${esc(n.author)}</strong><p>${esc(n.text)} · ${fmtTime(n.date)}</p></div></div>`).join("")}</div></section></div>`;
  }
  function publicDashboard() {
    const counts = allCaseCounts();
    const publicValue = n => n < state.config.publicMinGroup ? "Suppressed" : n;
    return `${heading("Community Overview", "Public information from anonymized fictional sample data.", `<button class="button secondary" data-page="statistics">Explore statistics</button>`)}
      <div class="notice info">Aggregated demonstration statistics only. Locations, distances, and counts are simulated; this does not measure your location or indicate medical risk.</div>
      <div class="grid stats-grid">${metric("Reported cases", publicValue(counts.cases), "All fictional sample areas", "⌖")}${metric("Active cases", publicValue(counts.active), "Aggregated demonstration data", "＋")}${metric("Recovered", publicValue(counts.recovered), "No individual identities displayed", "✓")}${metric("Available shops", state.shops.length, "Sample shop directory", "▤")}</div>
      <div class="grid two-col"><section class="card"><div class="card-head"><h2>Locality case overview</h2><button class="button secondary small" data-page="statistics">Statistics</button></div>${areasTable(state.areas, false, true)}</section><section class="card"><div class="card-head"><h2>Medical supplies nearby</h2><button class="button secondary small" data-page="supplies">Open map</button></div><div class="card-body">${state.shops.map(s => `<div class="list-item"><div><strong>${esc(s.name)}</strong><p>${esc(s.locality)} · ${esc(s.distance)}</p></div>${statusBadge(s.products.some(p => p.qty <= s.threshold) ? "Stock alerts" : "Stock available")}</div>`).join("")}</div></section></div>`;
  }
  function shopDashboard() {
    const shop = myShop();
    if (!shop) return `${heading("Shop Overview", "No demonstration shop is linked to this account.")}`;
    const alerts = shop.products.filter(p => p.qty <= shop.threshold).length;
    return `${heading(`Welcome, ${esc(shop.name)}`, "Manage your fictional inventory and review low-stock indicators.", `<button class="button" data-page="supplies">Manage inventory</button>`)}
      <div class="grid stats-grid">${metric("Products tracked", shop.products.length, "Across this demonstration shop", "▤")}${metric("Low-stock alerts", alerts, `Threshold: ${shop.threshold} units`, "⚑")}${metric("Shop locality", esc(shop.locality), "Sample location", "⌖")}${metric("Inventory updated", fmtDate(shop.updated), "Local browser timestamp", "◷")}</div>
      <section class="card"><div class="card-head"><h2>Inventory snapshot</h2><span class="small-text">Demand estimate is illustrative only</span></div>${inventoryTable([shop], true)}</section>`;
  }
  function operationsDashboard() {
    const myTasks = state.tasks.filter(t => currentUser.role !== "worker" || state.workers.find(w => w.userId === currentUser.id)?.id === t.workerId);
    const pending = state.tasks.filter(t => t.status === "Pending Assignment").length;
    return `${heading(currentUser.role === "worker" ? "My Disinfection Work" : "Community Operations", currentUser.role === "worker" ? "Assigned tasks and progress for your verified worker account." : "Area cleanliness and disinfection assignments.", `<button class="button" data-page="disinfection">Open task board</button>`)}
      ${currentUser.role === "worker" && !isVerifiedWorker() ? `<div class="notice warning">Worker verification required. You can view this notice, but protected task actions remain unavailable until an administrator verifies your account.</div>` : ""}
      <div class="grid stats-grid">${metric("Areas in sample", state.areas.length, "Simulated reporting zones", "⌖")}${metric("Pending assignments", pending, "Awaiting corporation worker head", "◷")}${metric("Open tasks", myTasks.filter(t => t.status !== "Completed").length, "Visible to your role", "⌁")}${metric("Verified workers", state.workers.filter(w => w.verification === "Verified").length, "Independent admin verification", "✓")}</div>
      <section class="card"><div class="card-head"><h2>${currentUser.role === "worker" ? "My assigned tasks" : "Task status summary"}</h2></div>${taskTable(myTasks)}</section>`;
  }
  function currentPatient() {
    return state.patients.find(p => p.id === currentUser?.patientId);
  }
  function myShop() {
    return state.shops.find(s => s.id === currentUser?.shopId);
  }
  function renderPage() {
    if (!allowed(currentUser.role, currentPage)) {
      currentPage = currentUser.role === "patient" ? "health" : "dashboard";
    }
    if (currentUser.role === "worker" && currentPage === "disinfection" && !isVerifiedWorker()) return disinfectionPage(true);
    const views = { dashboard, patients: patientRecords, health: healthPage, statistics: statisticsPage, supplies: suppliesPage, disinfection: () => disinfectionPage(false), users: usersPage, notifications: notificationsPage, settings: settingsPage };
    return (views[currentPage] || dashboard)();
  }
  function empty(text) { return `<div class="empty-state"><strong>${esc(text)}</strong>Try changing your search or filters.</div>`; }
  function activityList(limit = 8) {
    return `<div class="list">${state.activity.slice(0,limit).map(a => `<div class="list-item"><div><strong>${esc(a.text)}</strong><p>${esc(a.role)} · ${fmtTime(a.date)}</p></div></div>`).join("") || `<p class="small-text">No recent activity.</p>`}</div>`;
  }
  function supplySummary() {
    const names=["Masks","Gloves","Hand sanitizer","Disinfectant"];
    return `<div class="list">${names.map(name=>{const total=state.shops.reduce((n,s)=>n+(s.products.find(p=>p.name===name)?.qty||0),0);const alerts=state.shops.filter(s=>{const p=s.products.find(x=>x.name===name);return p&&p.qty<=s.threshold;}).length;return `<div class="list-item"><div><strong>${name}</strong><p>${total} units across sample shops · ${alerts} low-stock locations</p></div></div>`;}).join("")}</div>`;
  }
  function taskSummary() {
    return `<div class="list">${["Pending Assignment","Assigned","In Progress","Requires Review","Completed"].map(status=>`<div class="list-item"><strong>${esc(status)}</strong>${statusBadge(state.tasks.filter(t=>t.status===status).length)}</div>`).join("")}</div>`;
  }
  function notificationPreview() {
    const items=state.notifications.filter(n=>canSeeNotification(n)).slice(0,3);
    return items.length?`<div class="list">${items.map(n=>`<div class="list-item"><div><strong>${esc(n.title)}</strong><p>${fmtTime(n.date)}</p></div>${statusBadge(n.read?"Read":"Unread")}</div>`).join("")}</div>`:`<p class="small-text">No notifications for this role.</p>`;
  }
  function areasTable(areas, adminEdit, publicView = false) {
    if (!areas.length) return empty("No areas match the current selection.");
    return `<div class="table-wrap"><table><thead><tr><th>Locality</th><th>Sample area</th><th>Cases</th><th>Active</th><th>Recovered</th><th>Deaths</th><th>Cleanliness</th><th>Reported</th>${adminEdit ? "<th>Update counts</th>" : ""}</tr></thead><tbody>${areas.map(a => { const privateGroup=publicView && a.cases < state.config.publicMinGroup; const display=n=>privateGroup?"Suppressed":n; return `<tr><td><strong>${esc(a.locality)}</strong></td><td>${esc(a.street)} <span class="small-text">(${esc(a.distance)})</span></td><td>${display(a.cases)}</td><td>${display(a.active)}</td><td>${display(a.recovered)}</td><td>${display(a.deaths)}</td><td>${statusBadge(a.cleanliness)}</td><td>${fmtDate(a.date)}${daysSince(a.date) > state.config.staleDays ? ` <span class="badge amber">Review</span>` : ""}</td>${adminEdit ? `<td><button class="button secondary small" data-action="edit-area" data-id="${esc(a.id)}">Edit</button></td>` : ""}</tr>`; }).join("")}</tbody></table></div>`;
  }
  function patientRecords() {
    const patients = state.patients.filter(p => {
      const q = searchTerm.toLowerCase();
      return !q || [p.id, p.name, p.locality, p.status, p.recovery].some(v => String(v).toLowerCase().includes(q));
    }).filter(p => filters.patientStatus === "All statuses" || p.status === filters.patientStatus)
      .filter(p => filters.dischargeStatus === "All discharge states" || (filters.dischargeStatus === "Discharged" ? Boolean(p.discharge) : !p.discharge));
    return `${heading("Patient Records", "Create and maintain fictional patient records and append-only clinical monitoring.", `<button class="button" data-action="toggle-patient-form">＋ Register patient</button>`)}
      <div class="notice info">Clinical information is fictional and available only to the Medical Professional demonstration role. Do not enter real patient data.</div>
      ${patientFormVisible ? patientForm() : ""}
      <section class="card"><div class="filters"><div class="field filter-field"><label for="patient-search">Search ID, name, locality, status</label><input id="patient-search" class="search-input" type="search" value="${esc(searchTerm)}" placeholder="Search patient records"></div><div class="field filter-field"><label for="status-filter">COVID-19 status</label><select id="status-filter" data-filter="patientStatus"><option>All statuses</option>${["Active","Recovered","Not infected","Monitoring"].map(s => `<option ${filters.patientStatus === s ? "selected" : ""}>${s}</option>`).join("")}</select></div><div class="field filter-field"><label for="discharge-filter">Discharge status</label><select id="discharge-filter" data-filter="dischargeStatus"><option>All discharge states</option>${["Discharged","Not discharged"].map(s => `<option ${filters.dischargeStatus === s ? "selected" : ""}>${s}</option>`).join("")}</select></div></div>
      ${patients.length ? `<div class="table-wrap"><table><thead><tr><th>Patient ID</th><th>Name</th><th>Locality</th><th>Status</th><th>Screening</th><th>Last updated</th><th>Discharge</th><th>Record</th></tr></thead><tbody>${patients.map(p => `<tr><td><strong>${esc(p.id)}</strong></td><td>${esc(p.name)}${daysSince(p.lastUpdated) > state.config.staleDays ? ` <span class="badge amber">Review</span>` : ""}</td><td>${esc(p.locality)}</td><td>${statusBadge(p.status)}</td><td>${esc(p.screeningResult)}</td><td>${fmtTime(p.lastUpdated)}</td><td>${fmtDate(p.discharge)}</td><td><button class="button secondary small" data-action="select-patient" data-id="${esc(p.id)}">Open</button></td></tr>`).join("")}</tbody></table></div>` : empty("No patient records found.")}</section>
      ${selectedPatientId && state.patients.some(p => p.id === selectedPatientId) ? patientDetail(state.patients.find(p => p.id === selectedPatientId)) : ""}`;
  }
  let patientFormVisible = false;
  let patientEditOpen = false;
  function patientForm() {
    return `<section class="card card-pad" style="margin-bottom:16px"><h2>Register fictional patient</h2><form id="patient-form">
      <div class="form-grid" style="margin-top:14px">
        <div class="field"><label for="p-name">Patient name *</label><input id="p-name" name="name" required maxlength="70"></div>
        <div class="field"><label for="p-age">Age *</label><input id="p-age" name="age" type="number" min="0" max="120" required></div>
        <div class="field"><label for="p-gender">Gender</label><select id="p-gender" name="gender"><option>Not specified</option><option>Female</option><option>Male</option><option>Non-binary</option></select></div>
        <div class="field"><label for="p-locality">Geographic locality *</label><input id="p-locality" name="locality" required maxlength="60"></div>
        <div class="field"><label for="p-area">Street / area description</label><input id="p-area" name="area" maxlength="100"></div>
        <div class="field"><label for="p-screening">Screening date *</label><input id="p-screening" name="screening" type="date" max="${isoDate(0)}" required></div>
        <div class="field"><label for="p-result">Screening result</label><select id="p-result" name="screeningResult"><option>Positive</option><option>Negative</option><option>Pending</option></select></div>
        <div class="field"><label for="p-status">COVID-19 status</label><select id="p-status" name="status"><option>Active</option><option>Monitoring</option><option>Recovered</option><option>Not infected</option></select></div>
        <div class="field"><label for="p-qstart">Quarantine start</label><input id="p-qstart" name="quarantineStart" type="date"></div>
        <div class="field"><label for="p-qend">Expected quarantine end</label><input id="p-qend" name="quarantineEnd" type="date"></div>
        <div class="field"><label for="p-discharge">Discharge date</label><input id="p-discharge" name="discharge" type="date"></div>
        <div class="field"><label for="p-recovery">Recovery status</label><input id="p-recovery" name="recovery" maxlength="60" value="Monitoring"></div>
        <div class="field span-2"><label for="p-symptoms">Current symptoms</label><textarea id="p-symptoms" name="symptoms" maxlength="500"></textarea></div>
        <div class="field span-2"><label for="p-notes">Clinical notes</label><textarea id="p-notes" name="notes" maxlength="1000"></textarea></div>
      </div><div class="form-actions"><button class="button secondary" type="button" data-action="toggle-patient-form">Cancel</button><button class="button" type="submit">Save patient record</button></div></form></section>`;
  }
  function patientDetail(p) {
    return `<section class="card" id="patient-detail" style="margin-top:18px"><div class="card-head"><div><h2>${esc(p.name)} · ${esc(p.id)}</h2><p>${esc(p.locality)} · fictional clinical record</p></div><div><button class="button secondary small" data-action="toggle-patient-edit">Edit record</button> <button class="icon-button" data-action="close-patient" aria-label="Close patient details">✕</button></div></div>${patientEditOpen ? patientEditForm(p) : ""}<div class="card-body">
      <div class="grid three-col"><div><span class="small-text">Screening</span><p><strong>${esc(p.screeningResult)}</strong> · ${fmtDate(p.screening)}</p></div><div><span class="small-text">COVID-19 status</span><p>${statusBadge(p.status)}</p></div><div><span class="small-text">Quarantine / discharge</span><p>${fmtDate(p.quarantineStart)} – ${fmtDate(p.quarantineEnd)} · Discharged ${fmtDate(p.discharge)}</p></div></div>
      <div class="grid two-col" style="margin-top:16px"><section><h2>Clinical monitoring</h2>${monitoringTable([...p.monitoring].reverse())}<form id="monitor-form" data-patient="${esc(p.id)}" class="card card-pad" style="margin-top:12px"><h2>Add monitoring entry</h2><div class="form-grid" style="margin-top:12px"><div class="field"><label>Monitoring date *</label><input name="date" type="date" max="${isoDate(0)}" value="${isoDate(0)}" required></div><div class="field"><label>Oxygen saturation (%)</label><input name="oxygen" type="number" min="50" max="100"></div><div class="field"><label>Blood pressure</label><input name="pressure" maxlength="20" placeholder="e.g. 120/80"></div><div class="field"><label>Temperature (°C)</label><input name="temperature" type="number" min="30" max="45" step=".1"></div><div class="field span-2"><label>Symptoms / clinical notes</label><textarea name="symptoms" maxlength="500"></textarea></div><div class="field"><label>Medication intake</label><input name="medication" maxlength="150"></div><div class="field"><label>Diet information</label><input name="diet" maxlength="150"></div>      <div class="field span-2"><label>Professional notes</label><textarea name="notes" maxlength="700"></textarea></div><div class="field span-2"><label><input type="checkbox" name="shareWithPatient"> Share this note with the matching patient account</label></div></div><div class="form-actions"><button class="button" type="submit">Add to monitoring timeline</button></div></form></section>
      <section><h2>Prescriptions</h2>${prescriptionList(p.prescriptions)}<form id="prescription-form" data-patient="${esc(p.id)}" class="card card-pad" style="margin-top:12px"><h2>Create prescription</h2><div class="form-grid" style="margin-top:12px"><div class="field"><label>Medicine name *</label><input name="medicine" required maxlength="100"></div><div class="field"><label>Dosage *</label><input name="dosage" required maxlength="60"></div><div class="field"><label>Frequency *</label><input name="frequency" required maxlength="60"></div><div class="field"><label>Duration *</label><input name="duration" required maxlength="60"></div><div class="field span-2"><label>Instructions</label><textarea name="instructions" maxlength="500"></textarea></div><div class="field span-2"><label class="small-text"><input type="checkbox" name="shared" checked> Share with matching patient account</label></div></div><div class="form-actions"><button class="button" type="submit">Save prescription</button></div></form></section></div>
      <div class="grid two-col" style="margin-top:18px"><section><h2>Record update history</h2><div class="timeline">${(p.history || []).map(h => `<div class="timeline-item"><strong>${esc(h.text)}</strong><div class="small-text">${esc(h.by)} · ${fmtTime(h.date)}</div></div>`).join("") || "No updates recorded."}</div></section><section><h2>Clinical notes</h2><p>${esc(p.notes || "No professional notes.")}</p><span class="small-text">Current symptoms: ${esc(p.symptoms || "Not recorded")}</span></section></div>
    </div></section>`;
  }
  function patientEditForm(p) {
    return `<div class="card-body"><form id="patient-edit-form" data-patient="${esc(p.id)}"><div class="form-grid"><div class="field"><label>Patient name</label><input name="name" required maxlength="70" value="${esc(p.name)}"></div><div class="field"><label>Age</label><input name="age" type="number" min="0" max="120" required value="${p.age}"></div><div class="field"><label>Gender</label><select name="gender">${["Female","Male","Non-binary","Not specified"].map(x=>`<option ${p.gender===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field"><label>Locality</label><input name="locality" required maxlength="60" value="${esc(p.locality)}"></div><div class="field"><label>Area description</label><input name="area" maxlength="100" value="${esc(p.area)}"></div><div class="field"><label>Screening date</label><input name="screening" type="date" required value="${esc(p.screening)}"></div><div class="field"><label>Screening result</label><select name="screeningResult">${["Positive","Negative","Pending"].map(x=>`<option ${p.screeningResult===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field"><label>COVID-19 status</label><select name="status">${["Active","Monitoring","Recovered","Not infected"].map(x=>`<option ${p.status===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field"><label>Recovery status</label><input name="recovery" value="${esc(p.recovery)}" maxlength="60"></div><div class="field"><label>Quarantine start</label><input name="quarantineStart" type="date" value="${esc(p.quarantineStart)}"></div><div class="field"><label>Expected quarantine end</label><input name="quarantineEnd" type="date" value="${esc(p.quarantineEnd)}"></div><div class="field"><label>Discharge date</label><input name="discharge" type="date" value="${esc(p.discharge)}"></div><div class="field span-2"><label>Current symptoms</label><textarea name="symptoms" maxlength="500">${esc(p.symptoms)}</textarea></div><div class="field span-2"><label>Professional clinical notes</label><textarea name="notes" maxlength="1000">${esc(p.notes)}</textarea></div></div><div class="form-actions"><button class="button secondary" type="button" data-action="toggle-patient-edit">Cancel</button><button class="button" type="submit">Save record changes</button></div></form></div>`;
  }
  function monitoringTable(entries, patientView = false) {
    if (!entries.length) return `<p class="small-text">No monitoring history recorded.</p>`;
    return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>O₂</th><th>Blood pressure</th><th>Temp °C</th><th>Symptoms${patientView ? "" : " / note"}</th><th>Submitted by</th></tr></thead><tbody>${entries.map(m => `<tr><td>${fmtDate(m.date)}</td><td>${m.oxygen ? `${esc(m.oxygen)}%` : "—"}</td><td>${esc(m.pressure || "—")}</td><td>${m.temperature ?? "—"}</td><td>${esc(m.symptoms || (patientView ? "—" : m.notes || "—"))}</td><td>${esc(m.by || "Medical Professional")}</td></tr>`).join("")}</tbody></table></div>`;
  }
  function prescriptionList(entries) {
    return entries.length ? `<div class="list">${[...entries].reverse().map(p => `<div class="list-item"><div><strong>${esc(p.medicine)}</strong><p>${esc(p.dosage)} · ${esc(p.frequency)} · ${esc(p.duration)}</p><p>${esc(p.instructions)} · prescribed by ${esc(p.prescriber)} · ${fmtDate(p.date)}</p></div>${p.shared ? statusBadge("Shared") : statusBadge("Professional only")}</div>`).join("")}</div>` : `<p class="small-text">No prescriptions recorded.</p>`;
  }
  function healthPage() {
    const p = currentPatient();
    if (!p) return `${heading("My Health Information", "Your private sample health record.")}<div class="notice warning">No patient record is linked to this demonstration account. You cannot view another patient's record.</div>`;
    const stale = daysSince(p.lastUpdated) > state.config.staleDays;
    return `${heading("My Health Information", "View your sample screening, monitoring, and clinician-shared updates.")}${stale ? `<div class="notice warning">Information may need review: your record is ${Math.max(0, daysSince(p.lastUpdated))} days old. This reminder does not guarantee your record is current.</div>` : `<div class="notice success">Record status: current in this demo · Last update ${fmtTime(p.lastUpdated)}</div>`}
      <div class="grid stats-grid">${metric("COVID-19 status", esc(p.status), `Recovery: ${esc(p.recovery)}`, "♡")}${metric("Screening result", esc(p.screeningResult), `Screened ${fmtDate(p.screening)}`, "⌕")}${metric("Quarantine dates", p.quarantineStart ? `${fmtDate(p.quarantineStart)} – ${fmtDate(p.quarantineEnd)}` : "Not recorded", `Discharge ${fmtDate(p.discharge)}`, "⌂")}${metric("Last updated", fmtDate(p.lastUpdated), `${daysSince(p.lastUpdated)} days ago`, "◷")}</div>
      <div class="grid two-col"><section class="card"><div class="card-head"><h2>Professional monitoring</h2></div><div class="card-body">${monitoringTable([...p.monitoring].reverse(), true)}</div></section><section class="card"><div class="card-head"><h2>Doctor-shared prescriptions & notes</h2></div><div class="card-body"><p><strong>Current symptoms reported:</strong> ${esc(p.symptoms || "None recorded")}</p>${prescriptionList(p.prescriptions.filter(x => x.shared))}${(p.sharedNotes || []).map(n=>`<div class="list-item"><div><strong>Note from ${esc(n.author)}</strong><p>${esc(n.text)} · ${fmtTime(n.date)}</p></div></div>`).join("") || `<p class="small-text">No doctor-shared notes.</p>`}</div></section></div>
      <div class="grid two-col"><section class="card card-pad"><h2>Submit a permitted health update</h2><p class="small-text">Patient updates are visibly identified and do not replace professional review.</p><form id="patient-update-form"><div class="form-grid" style="margin-top:13px"><div class="field span-2"><label>Current symptoms</label><textarea name="symptoms" maxlength="500">${esc(p.symptoms)}</textarea></div><div class="field"><label>Temperature (°C)</label><input name="temperature" type="number" min="30" max="45" step=".1"></div><div class="field"><label>Oxygen saturation (%)</label><input name="oxygen" type="number" min="50" max="100"></div><div class="field"><label>Recovery status</label><select name="recovery"><option>${esc(p.recovery)}</option><option>Monitoring</option><option>Improving</option><option>Recovered</option><option>Needs professional review</option></select></div><div class="field span-2"><label>Update note</label><textarea name="notes" maxlength="500"></textarea></div></div><div class="form-actions"><button class="button" type="submit">Submit my update</button></div></form></section>
      <section class="card"><div class="card-head"><h2>Update history</h2></div><div class="card-body"><div class="timeline">${[...(p.history || [])].reverse().map(h => `<div class="timeline-item"><strong>${esc(h.text)}</strong><div class="small-text">${esc(h.by)} · ${fmtTime(h.date)}</div></div>`).join("")}</div></div></section></div>`;
  }
  function statisticsPage() {
    let areas = state.areas.filter(a => filters.geoLocality === "All localities" || a.locality === filters.geoLocality)
      .filter(a => filters.distance === "All distances" || filters.distance === "Current sample area" || a.distance === filters.distance)
      .filter(a => (!filters.dateFrom || a.date >= filters.dateFrom) && (!filters.dateTo || a.date <= filters.dateTo))
      .filter(a => filters.caseStatus === "All statuses" || (filters.caseStatus === "Active" ? a.active > 0 : filters.caseStatus === "Recovered" ? a.recovered > 0 : a.deaths > 0));
    const counts = areas.reduce((sum, a) => ({ cases: sum.cases + +a.cases, active: sum.active + +a.active, recovered: sum.recovered + +a.recovered, deaths: sum.deaths + +a.deaths }), { cases: 0, active: 0, recovered: 0, deaths: 0 });
    const suppress = currentUser.role === "public" && counts.cases < state.config.publicMinGroup;
    return `${heading("Geographic COVID-19 Statistics", "Anonymized aggregate reporting for synthetic localities and simulated distance categories.")}
      <div class="notice info">Locations and distance labels (current sample area, 500 m, 1 km, 5 km, 10 km) are simulated. This does not use your location or calculate medically reliable transmission risk. Public counts below the configurable group threshold of ${state.config.publicMinGroup} are suppressed.</div>
      <section class="card"><div class="filters"><div class="field filter-field"><label for="locality-filter">Locality</label><select id="locality-filter" data-filter="geoLocality"><option>All localities</option>${state.areas.map(a => `<option ${filters.geoLocality === a.locality ? "selected" : ""}>${esc(a.locality)}</option>`).join("")}</select></div><div class="field filter-field"><label for="distance-filter">Distance category</label><select id="distance-filter" data-filter="distance"><option>All distances</option>${["Current sample area","500 m","1 km","5 km","10 km"].map(x => `<option ${filters.distance === x ? "selected" : ""}>${x}</option>`).join("")}</select></div><div class="field filter-field"><label for="case-filter">Case status</label><select id="case-filter" data-filter="caseStatus"><option>All statuses</option>${["Active","Recovered","Deaths"].map(x => `<option ${filters.caseStatus === x ? "selected" : ""}>${x}</option>`).join("")}</select></div><div class="field filter-field"><label for="date-from">Report from</label><input id="date-from" data-filter="dateFrom" type="date" max="${isoDate(0)}" value="${filters.dateFrom}"></div><div class="field filter-field"><label for="date-to">Report to</label><input id="date-to" data-filter="dateTo" type="date" max="${isoDate(0)}" value="${filters.dateTo}"></div><div class="small-text">Statistics last reported: ${fmtDate(areas.length ? areas.reduce((d,a) => a.date > d ? a.date : d, areas[0].date) : "")}</div></div>
      <div class="card-body"><div class="grid stats-grid">${metric("Total reported", suppress ? "Suppressed" : counts.cases, "Aggregated sample cases", "⌖")}${metric("Active", suppress ? "Suppressed" : counts.active, "Fictional", "＋")}${metric("Recovered", suppress ? "Suppressed" : counts.recovered, "Fictional", "✓")}${metric("Reported deaths", suppress ? "Suppressed" : counts.deaths, "Fictional", "◇")}</div></div>
      ${areas.length ? areasTable(suppress ? [] : areas, currentUser.role === "admin", currentUser.role === "public") : empty("No sample areas match these filters.")}</section>
      <div class="grid two-col" style="margin-top:18px"><section class="card"><div class="card-head"><div><h2>Filtered case trend</h2><p>Synthetic reporting periods; does not imply current transmission</p></div></div><div class="card-body">${suppress ? `<p class="small-text">Counts are suppressed because the selected group is below the configured minimum size.</p>` : lineChart(Array.from({length:7},(_,i)=>areas.reduce((n,a)=>n+(+a.trend?.[i]||0),0)))}</div></section><section class="card"><div class="card-head"><div><h2>Locality comparison</h2><p>Aggregated case status</p></div></div><div class="card-body">${suppress ? `<p class="small-text">Counts are suppressed because the selected group is below the configured minimum size.</p>` : barChart(areas)}</div></section></div>
      ${currentUser.role === "admin" ? areaEditForm() : ""}`;
  }
  function areaEditForm() {
    return `<section class="card card-pad" style="margin-top:18px"><h2>Administrator: update sample locality counts</h2><p class="small-text">Counts must be non-negative and internally consistent. Saved changes immediately update the public summary.</p><form id="area-form" class="inline-form" style="margin-top:12px"><div class="field"><label>Locality</label><select name="id" required>${state.areas.map(a => `<option value="${esc(a.id)}">${esc(a.locality)}</option>`).join("")}</select></div><div class="field"><label>Total cases</label><input name="cases" type="number" min="0" required></div><div class="field"><label>Active</label><input name="active" type="number" min="0" required></div><div class="field"><label>Recovered</label><input name="recovered" type="number" min="0" required></div><div class="field"><label>Deaths</label><input name="deaths" type="number" min="0" required></div><div class="field"><label>Reporting date</label><input name="date" type="date" max="${isoDate(0)}" required value="${isoDate(0)}"></div><button class="button" type="submit">Save counts</button></form></section>`;
  }
  function productStatus(product, shop) {
    return product.qty === 0 ? "Out of Stock" : product.qty <= shop.threshold ? "Low Stock" : "In Stock";
  }
  function inventoryTable(shops, managerView) {
    const rows = shops.flatMap(shop => shop.products.map(p => ({ shop, p })));
    if (!rows.length) return empty("No inventory matches your filters.");
    return `<div class="table-wrap"><table><thead><tr><th>Shop</th><th>Locality</th><th>Sample distance</th><th>Contact</th><th>Product</th><th>Quantity</th><th>Status</th><th>Last updated</th>${managerView ? "<th>Update quantity</th>" : ""}</tr></thead><tbody>${rows.map(({shop,p}) => `<tr><td><strong>${esc(shop.name)}</strong><div class="small-text">${esc(shop.address)} · ${esc(shop.hours)}</div></td><td>${esc(shop.locality)}</td><td>${esc(shop.distance || "Not recorded")}</td><td>${esc(shop.contact)}</td><td>${esc(p.name)}</td><td>${p.qty}</td><td>${statusBadge(productStatus(p,shop))}</td><td>${fmtDate(shop.updated)}</td>${managerView ? `<td><form class="stock-form inline-form" data-shop="${esc(shop.id)}" data-product="${esc(p.name)}"><input aria-label="Quantity for ${esc(p.name)}" name="qty" type="number" min="0" max="100000" value="${p.qty}" style="width:80px;padding:6px;border:1px solid #ccd6df;border-radius:5px"><button class="button secondary small" type="submit">Save</button></form></td>` : ""}</tr>`).join("")}</tbody></table></div>`;
  }
  function suppliesPage() {
    const myShopMode = currentUser.role === "shop";
    const visibleShops = myShopMode ? [myShop()].filter(Boolean) : state.shops;
    let shops = visibleShops.filter(s => filters.shopLocality === "All localities" || s.locality === filters.shopLocality);
    if (filters.product !== "All products") shops = shops.map(s => ({...s, products: s.products.filter(p => p.name === filters.product)})).filter(s => s.products.length);
    if (filters.stockStatus !== "All statuses") shops = shops.map(s => ({...s, products: s.products.filter(p => productStatus(p,s) === filters.stockStatus)})).filter(s => s.products.length);
    const isManager = myShopMode || currentUser.role === "admin";
    if (myShopMode) {
      return `${heading("My Shop Inventory", "Update stock, shop details, and review inventory history.")}
      <div class="notice info">Stock, shop details, and local demand are fictional demonstration values. Demand is an illustrative estimate, not a scientifically validated prediction.</div>
      <section class="card">${myShop() ? shopDetailsForm(myShop()) : ""}${visibleShops.length ? inventoryTable(visibleShops, true) : empty("No shop is linked to this account.")}</section>
      ${myShop() ? `<div class="grid two-col" style="margin-top:18px"><section class="card card-pad"><h2>Inventory history</h2>${myShop().history.length ? `<div class="list">${myShop().history.slice(0,8).map(h=>`<div class="list-item"><div><strong>${esc(h.product)}: ${h.from} → ${h.to}</strong><p>${esc(h.by)} · ${fmtTime(h.date)}</p></div></div>`).join("")}</div>` : `<p class="small-text">No inventory changes recorded yet.</p>`}</section><section class="card card-pad"><h2>Local demand indicator</h2><p>${esc(demandSignal(myShop().locality).label)} · ${demandSignal(myShop().locality).active} fictional active cases in ${esc(myShop().locality)}</p><p class="small-text">Illustrative rule: 10+ active cases = elevated, 5–9 = moderate, otherwise usual. This is not a scientifically validated prediction.</p></section></div>` : ""}`;
    }

    const filteredSearch = shops.filter(s => !searchTerm || `${s.name} ${s.locality} ${s.address}`.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filteredSearch.length && !filteredSearch.some(s => s.id === selectedSupplyId)) selectedSupplyId = filteredSearch[0].id;
    if (!filteredSearch.length) selectedSupplyId = "";
    const selected = filteredSearch.find(s => s.id === selectedSupplyId) || filteredSearch[0];
    const positions = { "SHOP-01": ["31","28"], "SHOP-02": ["44","42"], "SHOP-03": ["72","60"] };
    const mapMarkers = filteredSearch.map(shop => {
      const pos = positions[shop.id] || ["50","50"];
      const alert = shop.products.some(p => p.qty <= shop.threshold);
      return `<button type="button" class="map-marker${selected?.id === shop.id ? " selected" : ""}${alert ? " alert" : ""}" data-action="select-supply" data-id="${esc(shop.id)}" style="left:${pos[0]}%;top:${pos[1]}%" aria-label="${esc(shop.name)}, ${esc(shop.locality)}"><span>＋</span><b>${esc(shop.name)}</b></button>`;
    }).join("");
    return `${heading("Medical Supplies & Shops", "Explore fictional shop locations and sample inventory on the community map.", `<button class="button secondary" data-action="clear-supply-filters">Clear filters</button>`)}
      <div class="notice info">Locations and inventory are fictional. This map is a visual demonstration, not a live or validated supply directory.</div>
      <section class="card"><div class="filters"><div class="field filter-field"><label>Search shop or locality</label><input id="shop-search" class="search-input" type="search" value="${esc(searchTerm)}" placeholder="Search shops"></div><div class="field filter-field"><label>Locality</label><select data-filter="shopLocality"><option>All localities</option>${[...new Set(state.shops.map(s=>s.locality))].map(x=>`<option ${filters.shopLocality===x?"selected":""}>${esc(x)}</option>`).join("")}</select></div><div class="field filter-field"><label>Product</label><select data-filter="product"><option>All products</option>${["Masks","Gloves","Hand sanitizer","Disinfectant"].map(x=>`<option ${filters.product===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field filter-field"><label>Availability</label><select data-filter="stockStatus"><option>All statuses</option>${["In Stock","Low Stock","Out of Stock"].map(x=>`<option ${filters.stockStatus===x?"selected":""}>${x}</option>`).join("")}</select></div></div>
      ${filteredSearch.length ? `<div class="supply-map-layout"><div class="geographic-map" role="img" aria-label="Fictional geographic map showing medical supply shops">
        <svg viewBox="0 0 800 430" aria-hidden="true"><rect width="800" height="430" fill="#edf3ef"/><path d="M0 105 C170 70 220 150 390 110 S650 60 800 130 L800 430 L0 430 Z" fill="#dfeadf"/><path d="M70 430 C120 290 210 250 285 170 S430 60 540 0" fill="none" stroke="#cbd8d1" stroke-width="26"/><path d="M70 430 C120 290 210 250 285 170 S430 60 540 0" fill="none" stroke="#fafbf9" stroke-width="17"/><path d="M0 260 C190 220 300 310 470 260 S650 210 800 260" fill="none" stroke="#c8d7ce" stroke-width="18"/><path d="M0 260 C190 220 300 310 470 260 S650 210 800 260" fill="none" stroke="#fafbf9" stroke-width="10"/><path d="M610 0 C590 120 650 190 610 310 S590 390 620 430" fill="none" stroke="#b9d8df" stroke-width="20"/><text x="95" y="118" class="map-area-label">HILLVIEW</text><text x="205" y="238" class="map-area-label">RIVERSIDE</text><text x="520" y="160" class="map-area-label">EASTBANK</text><text x="610" y="340" class="map-area-label">WESTFIELD</text></svg>
        ${mapMarkers}
      </div><aside class="shop-detail"><div class="shop-detail-head"><div><span class="small-text">Selected location</span><h2>${esc(selected.name)}</h2></div>${statusBadge(selected.products.some(p => p.qty <= selected.threshold) ? "Stock alert" : "Available")}</div><p class="shop-address">${esc(selected.address)} · ${esc(selected.distance)}</p><p class="small-text">${esc(selected.locality)} · Open ${esc(selected.hours)} · ${esc(selected.contact)}</p><div class="shop-stock">${selected.products.map(p => `<div class="stock-row"><span>${esc(p.name)}</span><strong>${p.qty} units</strong>${statusBadge(productStatus(p,selected))}</div>`).join("")}</div></aside></div>` : empty("No shops match the current filters.")}</section>`;
  }
  function areaForLocality(locality) { return state.areas.find(a => a.locality === locality); }
  function demandSignal(locality) {
    const active = areaForLocality(locality)?.active ?? 0;
    return { active, label: active >= 10 ? "Elevated sample demand" : active >= 5 ? "Moderate sample demand" : "Usual sample demand" };
  }
  function shopDetailsForm(shop) {
    return `<div class="card-body"><form id="shop-form" data-shop="${esc(shop.id)}" class="inline-form"><div class="field"><label>Shop name</label><input name="name" value="${esc(shop.name)}" required maxlength="80"></div><div class="field"><label>Locality</label><input name="locality" value="${esc(shop.locality)}" required maxlength="60"></div><div class="field"><label>Area description</label><input name="address" value="${esc(shop.address)}" maxlength="100"></div><div class="field"><label>Contact (fictional)</label><input name="contact" value="${esc(shop.contact)}" maxlength="50"></div><div class="field"><label>Opening hours</label><input name="hours" value="${esc(shop.hours)}" maxlength="60"></div><div class="field"><label>Low-stock threshold</label><input name="threshold" type="number" min="0" max="10000" value="${shop.threshold}" required></div><button class="button" type="submit">Save shop details</button></form></div>`;
  }
  function taskTable(tasks) {
    if (!tasks.length) return empty("No tasks are available for this account.");
    return `<div class="table-wrap"><table><thead><tr><th>Task</th><th>Area</th><th>Reason</th><th>Assigned worker</th><th>Scheduled</th><th>Priority</th><th>Status</th><th>Verification</th><th>Progress</th></tr></thead><tbody>${tasks.map(t => `<tr><td><strong>${esc(t.id)}</strong></td><td>${esc(areaFor(t.areaId)?.locality || "Unknown")}</td><td>${esc(t.reason)}</td><td>${esc(personName(t.workerId))}</td><td>${fmtDate(t.scheduled)}</td><td>${statusBadge(t.priority)}</td><td>${statusBadge(t.status)}</td><td>${statusBadge(t.verification)}</td><td><button class="button secondary small" data-action="task-details" data-id="${esc(t.id)}">Details / update</button></td></tr>`).join("")}</tbody></table></div>`;
  }
  function disinfectionPage(verificationRequired) {
    if (verificationRequired) return `${heading("Worker Verification Required", "Restricted disinfection functions require independent administrator approval.")}<div class="notice warning"><strong>Access restricted.</strong> Your account has not been verified. You may not view or update assignments. Contact an administrator to request review.</div><section class="card card-pad"><h2>Verification status</h2><p>${statusBadge(state.workers.find(w => w.userId === currentUser.id)?.verification || "Pending Verification")}</p><p class="small-text">Your status will refresh when an administrator makes a decision.</p></section>`;
    const isAdmin = currentUser.role === "admin";
    const isCorp = currentUser.role === "corp";
    const ownWorker = state.workers.find(w => w.userId === currentUser.id);
    const tasks = currentUser.role === "worker" ? state.tasks.filter(t => t.workerId === ownWorker?.id) : state.tasks;
    return `${heading("Disinfection Management", isAdmin ? "Review verification and monitor the complete task lifecycle." : isCorp ? "Assign verified workers and review area cleanliness." : "View assigned work and submit progress updates.", isCorp ? `<button class="button" data-action="toggle-task-form">＋ Create assignment</button>` : "")}
      <div class="notice info">Disinfection tasks and locality status are fictional operational demonstrations and do not certify real-world cleanliness.</div>
      ${taskFormVisible && isCorp ? assignmentForm() : ""}
      <div class="grid stats-grid">${metric("Pending assignment", state.tasks.filter(t=>t.status==="Pending Assignment").length, "Awaiting worker assignment", "◷")}${metric("In progress", state.tasks.filter(t=>t.status==="In Progress").length, "Fictional field tasks", "⌁")}${metric("Awaiting review", state.tasks.filter(t=>t.status==="Requires Review").length, "Head review required", "⚑")}${metric("Completed", state.tasks.filter(t=>t.status==="Completed").length, "Completion reviewed", "✓")}</div>
      ${isAdmin ? verificationTable() : ""}
      <section class="card"><div class="card-head"><div><h2>${currentUser.role === "worker" ? "My assigned tasks" : "Disinfection task board"}</h2><p>Area counts are anonymized; worker identities are shown only to authorized operations roles.</p></div></div>${taskTable(tasks)}</section>
      ${selectedTaskId ? taskDetail(selectedTaskId, isCorp, isAdmin, currentUser.role === "worker") : ""}
      ${isCorp || isAdmin ? `<section class="card" style="margin-top:18px"><div class="card-head"><h2>Area cleanliness status</h2><p>An area is marked clean only after a task is completed and reviewed.</p></div>${areasTable(state.areas, false)}</section>` : ""}`;
  }
  let taskFormVisible = false;
  let selectedTaskId = "";
  function verificationTable() {
    const unverified = state.workers.filter(w => w.verification !== "Verified");
    return `<section class="card" style="margin-bottom:18px"><div class="card-head"><div><h2>Independent worker verification</h2><p>Administrator decision controls restricted worker access.</p></div></div>${unverified.length ? `<div class="table-wrap"><table><thead><tr><th>Worker</th><th>Verification</th><th>Account</th><th>Decision</th></tr></thead><tbody>${unverified.map(w => `<tr><td>${esc(w.name)}</td><td>${statusBadge(w.verification)}</td><td>${esc(state.users.find(u=>u.id===w.userId)?.status || "Account not linked")}</td><td><button class="button small" data-action="verify-worker" data-id="${esc(w.id)}" data-decision="Verified">Approve</button> <button class="button danger small" data-action="verify-worker" data-id="${esc(w.id)}" data-decision="Rejected">Reject</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="card-body small-text">All demonstration workers have been reviewed.</div>`}</section>`;
  }
  function assignmentForm() {
    const eligible = state.workers.filter(w => w.verification === "Verified" && state.users.some(u=>u.id===w.userId && u.role==="worker" && u.status==="Active"));
    return `<section class="card card-pad" style="margin-bottom:16px"><h2>Create disinfection assignment</h2><form id="assignment-form"><div class="form-grid" style="margin-top:13px"><div class="field"><label>Area *</label><select name="areaId" required>${state.areas.map(a=>`<option value="${esc(a.id)}">${esc(a.locality)} · ${esc(a.street)}</option>`).join("")}</select></div><div class="field"><label>Verified worker *</label><select name="workerId" required>${eligible.map(w=>`<option value="${esc(w.id)}">${esc(w.name)}</option>`).join("")}</select></div><div class="field"><label>Reason *</label><input name="reason" required maxlength="180" value="Area review requested"></div><div class="field"><label>Scheduled date *</label><input type="date" name="scheduled" min="${isoDate(0)}" required></div><div class="field"><label>Priority</label><select name="priority"><option>Normal</option><option>High</option><option>Urgent</option><option>Low</option></select></div></div><div class="form-actions"><button class="button secondary" type="button" data-action="toggle-task-form">Cancel</button><button class="button" type="submit" ${eligible.length ? "" : "disabled"}>Assign verified worker</button></div>${eligible.length ? "" : `<p class="form-error">No verified workers are available. An administrator must verify a worker first.</p>`}</form></section>`;
  }
  function taskDetail(id, canReview, admin, isWorker) {
    const t = state.tasks.find(x=>x.id===id);
    if (!t) return "";
    const area = areaFor(t.areaId);
    const workerCanAct = isWorker && isVerifiedWorker() && t.workerId === state.workers.find(w=>w.userId===currentUser.id)?.id;
    return `<section class="card card-pad" id="task-detail" style="margin-top:16px"><div class="page-heading"><div><h2>${esc(t.id)} · ${esc(area?.locality || "Area")}</h2><p>${esc(t.reason)} · ${esc(t.priority)} priority</p></div><button class="icon-button" data-action="close-task">✕</button></div><p>Assigned to ${esc(personName(t.workerId))} · Scheduled ${fmtDate(t.scheduled)} · ${statusBadge(t.status)} ${statusBadge(t.verification)}</p><p><strong>Related anonymized area statistics:</strong> ${area ? `${area.cases} total reported · ${area.active} active · ${area.recovered} recovered · ${area.deaths} reported deaths` : "Not available"}</p><p><strong>Progress notes:</strong> ${esc(t.notes || "No progress notes yet.")}</p><div class="timeline">${(t.history||[]).map(h=>`<div class="timeline-item"><strong>${esc(h.text)}</strong><div class="small-text">${fmtTime(h.date)}</div></div>`).join("")}</div>
      ${workerCanAct && ["Assigned","In Progress"].includes(t.status) ? `<form id="worker-progress-form" data-task="${esc(t.id)}" style="margin-top:14px"><div class="form-grid"><div class="field"><label>Progress status</label><select name="status"><option ${t.status==="Assigned"?"selected":""}>Assigned</option><option ${t.status==="In Progress"?"selected":""}>In Progress</option><option>Requires Review</option></select></div><div class="field"><label>Completion / progress notes *</label><textarea name="notes" required maxlength="700">${esc(t.notes)}</textarea></div></div><div class="form-actions"><button class="button" type="submit">Save progress / submit for review</button></div></form>` : ""}
      ${(canReview || admin) && t.status === "Requires Review" ? `<button class="button" data-action="complete-task" data-id="${esc(t.id)}">Approve completion and mark area clean</button> <button class="button secondary" data-action="return-task" data-id="${esc(t.id)}">Return for more work</button>` : ""}
      ${canReview && t.status === "Pending Assignment" ? `<span class="small-text">Assign a verified worker using Create assignment.</span>` : ""}
    </section>`;
  }
  function usersPage() {
    const users = state.users.filter(u => !searchTerm || `${u.id} ${u.name} ${roleName(u.role)}`.toLowerCase().includes(searchTerm.toLowerCase()));
    return `${heading("User & Access Management", "Manage fictional demo accounts and independently review disinfection workers.", `<button class="button" data-action="toggle-user-form">＋ Create demo account</button>`)}
      <div class="notice warning">Simulated roles are enforced in this browser prototype only. Do not use this application for real patient information or production access control.</div>
      ${userFormVisible ? `<section class="card card-pad" style="margin-bottom:16px"><h2>Create a demonstration account</h2><form id="user-form"><div class="form-grid" style="margin-top:13px"><div class="field"><label>Display name *</label><input name="name" required maxlength="70"></div><div class="field"><label>Role *</label><select name="role">${Object.entries(roles).filter(([r])=>r!=="public").map(([r,n])=>`<option value="${r}">${esc(n)}</option>`).join("")}</select></div><div class="field"><label>Link patient record (patient role)</label><select name="patientId"><option value="">No patient link</option>${state.patients.map(p=>`<option value="${esc(p.id)}">${esc(p.id)} · ${esc(p.name)}</option>`).join("")}</select></div><div class="field"><label>Link shop (shop manager role)</label><select name="shopId"><option value="">No shop link</option>${state.shops.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("")}</select></div></div><div class="form-actions"><button class="button secondary" type="button" data-action="toggle-user-form">Cancel</button><button class="button" type="submit">Create account</button></div></form></section>` : ""}
      <section class="card"><div class="filters"><div class="field filter-field"><label>Search demo accounts</label><input id="user-search" class="search-input" type="search" value="${esc(searchTerm)}" placeholder="Name, ID, role"></div></div><div class="table-wrap"><table><thead><tr><th>User ID</th><th>Display name</th><th>Assigned role</th><th>Account status</th><th>Verification</th><th>Last activity</th><th>Action</th></tr></thead><tbody>${users.map(u=>`<tr><td>${esc(u.id)}</td><td><strong>${esc(u.name)}</strong></td><td><select aria-label="Role for ${esc(u.name)}" data-user-role="${esc(u.id)}">${Object.entries(roles).filter(([r])=>r!=="public").map(([r,n])=>`<option value="${r}" ${u.role===r?"selected":""}>${esc(n)}</option>`).join("")}</select></td><td>${statusBadge(u.status)}</td><td>${statusBadge(u.verification || state.workers.find(w=>w.userId===u.id)?.verification || "Not applicable")}</td><td>${fmtTime(u.lastActivity)}</td><td><button class="button ${u.status==="Active"?"secondary":"small"} small" data-action="toggle-account" data-id="${esc(u.id)}">${u.status==="Active"?"Disable":"Enable"}</button></td></tr>`).join("")}</tbody></table></div></section>
      <section class="card" style="margin-top:18px"><div class="card-head"><h2>Recent account-related activity</h2></div><div class="card-body">${activityList(8)}</div></section>`;
  }
  let userFormVisible = false;
  function notificationsPage() {
    const notifications = state.notifications.filter(canSeeNotification);
    return `${heading("Notifications", "Updates relevant to this demonstration role.", `<button class="button secondary" data-action="mark-all-read">Mark all as read</button>`)}
      ${notifications.length ? notifications.map(n=>`<article class="notification${n.read?"":" unread"}"><div><strong>${esc(n.title)}</strong><p class="small-text">${esc(n.category)} · ${fmtTime(n.date)}</p><p>${esc(n.detail)}</p><button class="button secondary small" data-page="${esc(n.page)}">Open related section</button></div><div>${n.read?statusBadge("Read"):`${statusBadge("Unread")} <button class="button small" data-action="mark-read" data-id="${esc(n.id)}">Mark read</button>`}</div></article>`).join("") : empty("No notifications for this role.")}`;
  }
  function settingsPage() {
    return `${heading("Settings / About the Prototype", "Demonstration controls and implementation notes.")}
      <div class="grid two-col"><section class="card card-pad"><h2>Demonstration settings</h2><p>Current role: ${esc(roleName(currentUser.role))}</p><p>Patient record stale reminder threshold: <strong>${state.config.staleDays} days</strong>. Public minimum geographic group threshold: <strong>${state.config.publicMinGroup}</strong>.</p>${currentUser.role === "admin" ? `<form id="settings-form" style="margin:15px 0"><div class="form-grid"><div class="field"><label>Stale-record reminder (days)</label><input name="staleDays" type="number" min="1" max="90" value="${state.config.staleDays}" required></div><div class="field"><label>Public minimum group size</label><input name="publicMinGroup" type="number" min="2" max="1000" value="${state.config.publicMinGroup}" required></div></div><div class="form-actions"><button class="button" type="submit">Save thresholds</button></div></form>` : ""}
      <p>All data is stored in this browser using localStorage. Browser storage is not a secure database; simulated role checks can be bypassed by a user with browser access.</p><button class="button danger" data-action="reset-data">Reset demonstration data</button></section>
      <section class="card card-pad"><h2>About this academic prototype</h2><p>This interface demonstrates centralized sample records, locality summaries, supply stock, and disinfection task coordination.</p><ul><li>No diagnosis, treatment guidance, or validated infection-risk prediction.</li><li>No real patient data, passwords, paid APIs, or external authentication.</li><li>Production deployment requires a secure backend, real authentication, server-side authorization, encrypted storage and transmission, audit controls, and applicable healthcare privacy compliance.</li></ul></section></div>`;
  }
  function render() {
    if (!currentUser) renderLogin();
    else app.innerHTML = shell();
  }
  function validDate(value, allowFuture = false) {
    if (!value || Number.isNaN(new Date(value).getTime())) return false;
    return allowFuture || value <= isoDate(0);
  }
  function formData(form) { return Object.fromEntries(new FormData(form).entries()); }
  function formNumber(value, min, max, label, optional = false) {
    if (optional && (value === "" || value == null)) return null;
    const n = Number(value);
    if (!Number.isFinite(n) || n < min || n > max) throw new Error(`${label} must be between ${min} and ${max}.`);
    return n;
  }
  function handleSubmit(event) {
    const form = event.target.closest("form");
    if (!form) return;
    const id = form.id;
    if (!["login-form","patient-form","patient-edit-form","monitor-form","prescription-form","patient-update-form","area-form","stock-form","shop-form","assignment-form","worker-progress-form","user-form","settings-form"].includes(id) && !form.matches(".stock-form")) return;
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    if (submit?.disabled) return;
    if (submit) submit.disabled = true;
    try {
      if (id === "login-form") {
        const data = formData(form);
        if (!(data.role in roles)) throw new Error("Select a valid demonstration role.");
        if (data.role === "public") enterRole("public");
        else enterRole(data.role, data.userId);
        return;
      }
      if (id === "patient-form") {
        if (!guard("medical")) return;
        const d = formData(form);
        const age = formNumber(d.age, 0, 120, "Age");
        if (!validDate(d.screening)) throw new Error("Enter a valid screening date that is not in the future.");
        if (d.quarantineStart && !validDate(d.quarantineStart)) throw new Error("Quarantine start must be a valid date that is not in the future.");
        if (d.quarantineEnd && !validDate(d.quarantineEnd, true)) throw new Error("Enter a valid quarantine end date.");
        if (d.discharge && !validDate(d.discharge)) throw new Error("Discharge date must be valid and not in the future.");
        if (d.quarantineStart && d.quarantineEnd && d.quarantineEnd < d.quarantineStart) throw new Error("Quarantine end must be on or after its start.");
        const patient = { id: `PAT-${Date.now().toString().slice(-6)}`, name: d.name.trim(), age, gender: d.gender, locality: d.locality.trim(), area: d.area.trim(), registration: isoDate(0), screening: d.screening, screeningResult: d.screeningResult, status: d.status, quarantineStart: d.quarantineStart, quarantineEnd: d.quarantineEnd, discharge: d.discharge, recovery: d.recovery.trim(), symptoms: d.symptoms.trim(), notes: d.notes.trim(), lastUpdated: new Date().toISOString(), monitoring: [], prescriptions: [], history: [{ date: new Date().toISOString(), by: roleName(currentUser.role), text: "Fictional patient record created." }] };
        state.patients.unshift(patient);
        logActivity(`Created fictional patient record ${patient.id}.`);
        saveData(); patientFormVisible = false; selectedPatientId = patient.id; render(); toast("Fictional patient record created."); return;
      }
      if (id === "patient-edit-form") {
        if (!guard("medical")) return;
        const p=state.patients.find(x=>x.id===form.dataset.patient);
        if(!p) throw new Error("Patient record could not be found.");
        const d=formData(form);
        p.age=formNumber(d.age,0,120,"Age");
        if(!validDate(d.screening)) throw new Error("Enter a valid screening date that is not in the future.");
        if(d.quarantineStart && !validDate(d.quarantineStart)) throw new Error("Quarantine start must be valid and not in the future.");
        if(d.quarantineEnd && !validDate(d.quarantineEnd,true)) throw new Error("Enter a valid quarantine end date.");
        if(d.discharge && !validDate(d.discharge)) throw new Error("Discharge date must be valid and not in the future.");
        if(d.quarantineStart && d.quarantineEnd && d.quarantineEnd<d.quarantineStart) throw new Error("Quarantine end must be on or after its start.");
        Object.assign(p,{name:d.name.trim(),gender:d.gender,locality:d.locality.trim(),area:d.area.trim(),screening:d.screening,screeningResult:d.screeningResult,status:d.status,recovery:d.recovery.trim(),quarantineStart:d.quarantineStart,quarantineEnd:d.quarantineEnd,discharge:d.discharge,symptoms:d.symptoms.trim(),notes:d.notes.trim(),lastUpdated:new Date().toISOString()});
        p.history.unshift({date:p.lastUpdated,by:roleName(currentUser.role),text:"Patient record details updated."});
        logActivity(`Updated fictional patient record ${p.id}.`); saveData(); patientEditOpen=false; render(); toast("Patient record updated."); return;
      }
      if (id === "monitor-form") {
        if (!guard("medical")) return;
        const p = state.patients.find(x => x.id === form.dataset.patient);
        if (!p) throw new Error("Patient record could not be found.");
        const d = formData(form);
        if (!validDate(d.date)) throw new Error("Enter a valid monitoring date that is not in the future.");
        const entry = { date: d.date, oxygen: formNumber(d.oxygen, 50, 100, "Oxygen saturation", true), pressure: d.pressure.trim(), temperature: formNumber(d.temperature, 30, 45, "Temperature", true), symptoms: d.symptoms.trim(), medication: d.medication.trim(), diet: d.diet.trim(), notes: d.notes.trim(), by: roleName(currentUser.role) };
        p.monitoring.push(entry); p.lastUpdated = new Date().toISOString(); p.history.unshift({ date: p.lastUpdated, by: roleName(currentUser.role), text: "Clinical monitoring entry added." });
        if (form.querySelector('[name="shareWithPatient"]').checked && d.notes.trim()) {
          p.sharedNotes ||= [];
          p.sharedNotes.unshift({ date: p.lastUpdated, author: currentUser.name, text: d.notes.trim() });
          state.users.filter(u=>u.role==="patient" && u.patientId===p.id && u.status==="Active").forEach(u=>notify("A clinician shared a note", "A new note is available in your sample health information.", "Patient record", "health", ["patient"], u.id));
        }
        logActivity(`Added clinical monitoring entry to ${p.id}.`); saveData(); render(); toast("Monitoring entry added to the clinical timeline."); return;
      }
      if (id === "prescription-form") {
        if (!guard("medical")) return;
        const p = state.patients.find(x => x.id === form.dataset.patient);
        if (!p) throw new Error("Patient record could not be found.");
        const d = formData(form);
        const shared = form.querySelector('[name="shared"]').checked;
        p.prescriptions.push({ medicine: d.medicine.trim(), dosage: d.dosage.trim(), frequency: d.frequency.trim(), duration: d.duration.trim(), instructions: d.instructions.trim(), prescriber: currentUser.name, date: isoDate(0), shared });
        p.lastUpdated = new Date().toISOString(); p.history.unshift({ date: p.lastUpdated, by: roleName(currentUser.role), text: "Prescription recorded." });
        if (shared) state.users.filter(u=>u.role==="patient" && u.patientId===p.id && u.status==="Active").forEach(u=>notify("A clinician updated your sample record", "A prescription or note may be available in your health information.", "Patient record", "health", ["patient"], u.id));
        logActivity(`Added a prescription to ${p.id}.`); saveData(); render(); toast("Prescription saved."); return;
      }
      if (id === "patient-update-form") {
        if (!guard("patient")) return;
        const p = currentPatient();
        if (!p) throw new Error("This account has no linked patient record; access to other records is not allowed.");
        const d = formData(form);
        const oxygen = formNumber(d.oxygen, 50, 100, "Oxygen saturation", true);
        const temperature = formNumber(d.temperature, 30, 45, "Temperature", true);
        p.symptoms = d.symptoms.trim(); p.recovery = d.recovery;
        p.lastUpdated = new Date().toISOString();
        p.history.unshift({ date: p.lastUpdated, by: "Patient", text: d.notes.trim() || "Patient submitted a permitted health information update." });
        if (oxygen != null || temperature != null) p.monitoring.push({ date: isoDate(0), oxygen, temperature, pressure: "", symptoms: d.symptoms.trim(), medication: "", diet: "", notes: d.notes.trim(), by: "Patient" });
        state.notifications.filter(n=>n.userId===currentUser.id && n.category==="Patient record").forEach(n=>n.read=true);
        logActivity(`Patient ${p.id} submitted a health information update.`);
        saveData(); render(); toast("Your update was saved and marked as patient-submitted."); return;
      }
      if (id === "area-form") {
        if (!guard("admin")) return;
        const d = formData(form), area = state.areas.find(a => a.id === d.id);
        if (!area) throw new Error("Select a valid sample locality.");
        const cases = formNumber(d.cases, 0, 1000000, "Total cases");
        const active = formNumber(d.active, 0, 1000000, "Active cases");
        const recovered = formNumber(d.recovered, 0, 1000000, "Recovered cases");
        const deaths = formNumber(d.deaths, 0, 1000000, "Deaths");
        if (active + recovered + deaths !== cases) throw new Error("Total cases must equal active + recovered + reported deaths.");
        if (!validDate(d.date)) throw new Error("Enter a valid reporting date that is not in the future.");
        Object.assign(area, { cases, active, recovered, deaths, date: d.date, trend: [...(area.trend || [0,0,0,0,0,0]), active].slice(-7) });
        logActivity(`Updated sample geographic counts for ${area.locality}.`);
        notify("Sample locality statistics updated", `${area.locality} reporting counts have changed.`, "Statistics", "statistics", ["admin","medical","public","corp"]);
        saveData(); render(); toast("Geographic sample counts updated."); return;
      }
      if (form.matches(".stock-form")) {
        if (currentUser.role !== "shop" && currentUser.role !== "admin") return toast("Only a linked shop manager or administrator may update inventory.", true);
        if (currentUser.role === "shop" && !guard("shop")) return;
        if (currentUser.role === "admin" && !guard("admin")) return;
        const shop = state.shops.find(s => s.id === form.dataset.shop);
        if (!shop || (currentUser.role === "shop" && shop.id !== currentUser.shopId)) throw new Error("You may only update your linked shop inventory.");
        const product = shop.products.find(p => p.name === form.dataset.product);
        if (!product) throw new Error("Inventory product could not be found.");
        const d = formData(form), qty = formNumber(d.qty, 0, 100000, "Quantity");
        const previous = product.qty; product.qty = qty; shop.updated = new Date().toISOString();
        shop.history.unshift({ date: shop.updated, by: roleName(currentUser.role), product: product.name, from: previous, to: qty });
        logActivity(`Updated ${shop.name} inventory for ${product.name} (${previous} to ${qty}).`);
        if (qty <= shop.threshold) notify("Low-stock medical supply", `${shop.name}: ${product.name} is at or below the sample threshold.`, "Supplies", "supplies", ["shop","admin","public","medical"]);
        saveData(); render(); toast("Inventory updated."); return;
      }
      if (id === "shop-form") {
        if (!guard("shop")) return;
        const shop = state.shops.find(s => s.id === form.dataset.shop);
        if (!shop || shop.id !== currentUser.shopId) throw new Error("You may only edit your linked shop.");
        const d = formData(form); shop.name = d.name.trim(); shop.locality = d.locality.trim(); shop.address = d.address.trim(); shop.contact = d.contact.trim(); shop.hours=d.hours.trim();
        shop.threshold = formNumber(d.threshold, 0, 10000, "Low-stock threshold"); shop.updated = new Date().toISOString();
        logActivity(`Updated shop details for ${shop.name}.`); saveData(); render(); toast("Shop details saved."); return;
      }
      if (id === "assignment-form") {
        if (!guard("corp")) return;
        const d = formData(form), worker = state.workers.find(w => w.id === d.workerId);
        const workerUser=worker && state.users.find(u=>u.id===worker.userId && u.role==="worker" && u.status==="Active");
        if (!areaFor(d.areaId) || !worker || worker.verification !== "Verified" || !workerUser) throw new Error("Choose a valid area and independently verified worker with an active account.");
        if (!validDate(d.scheduled, true) || d.scheduled < isoDate(0)) throw new Error("Enter a valid scheduled date today or later.");
        const task = { id: `TASK-${Date.now().toString().slice(-6)}`, areaId: d.areaId, reason: d.reason.trim(), workerId: worker.id, assigned: isoDate(0), scheduled: d.scheduled, priority: d.priority, status: "Assigned", verification: worker.verification, notes: "", completion: "", history: [{ date: new Date().toISOString(), text: `Assigned to ${worker.name} by ${currentUser.name}.` }] };
        state.tasks.unshift(task); notify("New disinfection assignment", `You have an assignment for ${areaFor(d.areaId).locality}.`, "Disinfection", "disinfection", ["worker"], worker.userId);
        logActivity(`Assigned ${task.id} to ${worker.name}.`); saveData(); taskFormVisible = false; render(); toast("Disinfection assignment created."); return;
      }
      if (id === "worker-progress-form") {
        if (!guard("worker") || !isVerifiedWorker()) throw new Error("Administrator verification is required before worker actions.");
        const task = state.tasks.find(t => t.id === form.dataset.task);
        const worker = state.workers.find(w => w.userId === currentUser.id);
        if (!task || task.workerId !== worker?.id || !["Assigned","In Progress"].includes(task.status)) throw new Error("This task is not available for your account to update.");
        const d = formData(form);
        if (!d.notes.trim()) throw new Error("Add a progress or completion note.");
        if (!["Assigned","In Progress","Requires Review"].includes(d.status)) throw new Error("Select a permitted task status.");
        task.status = d.status; task.notes = d.notes.trim();
        task.history.unshift({ date: new Date().toISOString(), text: `${d.status}: ${d.notes.trim()}` });
        if (d.status === "Requires Review") {
          task.verification = "Pending Review";
          notify("Disinfection task awaiting review", `${task.id} was submitted by a worker.`, "Disinfection", "disinfection", ["corp","admin"]);
        }
        logActivity(`Worker updated ${task.id} status to ${task.status}.`); saveData(); render(); toast(d.status === "Requires Review" ? "Task submitted for review." : "Task progress saved."); return;
      }
      if (id === "user-form") {
        if (!guard("admin")) return;
        const d = formData(form);
        if (d.role === "public" || !(d.role in roles)) throw new Error("Choose an eligible demonstration role.");
        if (d.role === "patient" && d.patientId && !state.patients.some(p=>p.id===d.patientId)) throw new Error("Choose an existing patient record.");
        if (d.role === "shop" && d.shopId && !state.shops.some(s=>s.id===d.shopId)) throw new Error("Choose an existing shop.");
        const user = { id: `USR-${Date.now().toString().slice(-6)}`, name: d.name.trim(), role: d.role, status: "Active", lastActivity: new Date().toISOString() };
        if (d.role === "patient" && d.patientId) user.patientId = d.patientId;
        if (d.role === "shop" && d.shopId) user.shopId = d.shopId;
        state.users.unshift(user);
        if (d.role === "worker") {
          const worker = { id: `WORK-${Date.now().toString().slice(-6)}`, name: user.name, userId: user.id, verification: "Pending Verification" };
          state.workers.unshift(worker); user.verification = worker.verification;
          notify("Disinfection worker verification required", `${user.name} needs administrator approval.`, "Access", "users", ["admin"]);
        }
        logActivity(`Created demonstration ${roleName(d.role)} account for ${user.name}.`);
        saveData(); userFormVisible = false; render(); toast("Demonstration account created."); return;
      }
      if (id === "settings-form") {
        if (!guard("admin")) return;
        const d=formData(form);
        state.config.staleDays=formNumber(d.staleDays,1,90,"Stale-record threshold");
        state.config.publicMinGroup=formNumber(d.publicMinGroup,2,1000,"Public minimum group size");
        logActivity("Updated demonstration privacy and reminder thresholds.");
        saveData(); render(); toast("Demonstration thresholds updated."); return;
      }
    } catch (error) {
      toast(error.message || "The change could not be saved.", true);
    } finally {
      if (submit?.isConnected) submit.disabled = false;
    }
  }
  async function confirmAction(title, copy) {
    const dialog = document.getElementById("confirm-dialog");
    document.getElementById("confirm-title").textContent = title;
    document.getElementById("confirm-copy").textContent = copy;
    dialog.showModal();
    return new Promise(resolve => dialog.addEventListener("close", () => resolve(dialog.returnValue === "confirm"), { once: true }));
  }
  async function handleClick(event) {
    const pageControl = event.target.closest("[data-page]");
    if (pageControl) {
      event.preventDefault();
      const page = pageControl.dataset.page;
      if (!allowed(currentUser?.role, page)) {
        toast("This section is not available to your demonstration role.", true);
        return;
      }
      currentPage = page;
      searchTerm = "";
      if (window.innerWidth <= 760) document.getElementById("sidebar")?.classList.remove("open");
      render();
      return;
    }
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const action = control.dataset.action;
    if (action === "public-login") return enterRole("public");
    if (action === "logout") return logout();
    if (action === "toggle-menu") return document.getElementById("sidebar")?.classList.toggle("open");
    if (action === "toggle-patient-form") { if (!guard("medical")) return; patientFormVisible = !patientFormVisible; render(); return; }
    if (action === "select-patient") { if (!guard("medical")) return; selectedPatientId = control.dataset.id; render(); document.getElementById("patient-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (action === "close-patient") { selectedPatientId = ""; render(); return; }
    if (action === "toggle-patient-edit") { if (!guard("medical")) return; patientEditOpen = !patientEditOpen; render(); return; }
    if (action === "toggle-task-form") { if (!guard("corp")) return; taskFormVisible = !taskFormVisible; selectedTaskId = ""; render(); return; }
    if (action === "task-details") {
      const task = state.tasks.find(t => t.id === control.dataset.id);
      if (!task || !allowed(currentUser?.role, "disinfection")) return toast("Task not found or access denied.", true);
      if (currentUser.role === "worker" && (!isVerifiedWorker() || task.workerId !== state.workers.find(w=>w.userId===currentUser.id)?.id)) return toast("Verified workers may only access their assigned tasks.", true);
      selectedTaskId = task.id; render(); document.getElementById("task-detail")?.scrollIntoView({behavior:"smooth"}); return;
    }
    if (action === "close-task") { selectedTaskId = ""; render(); return; }
    if (action === "toggle-user-form") { if (!guard("admin")) return; userFormVisible = !userFormVisible; render(); return; }
    if (action === "mark-read" || action === "mark-all-read") {
      if (!allowed(currentUser?.role, "notifications")) return toast("Access denied.", true);
      if (action === "mark-all-read") state.notifications.filter(canSeeNotification).forEach(n=>n.read=true);
      else {
        const n = state.notifications.find(x=>x.id===control.dataset.id);
        if (n && canSeeNotification(n)) n.read = true;
      }
      saveData(); render(); return;
    }
    if (action === "select-supply") { selectedSupplyId = control.dataset.id; render(); return; }
    if (action === "clear-supply-filters") { filters.shopLocality="All localities"; filters.product="All products"; filters.stockStatus="All statuses"; searchTerm=""; selectedSupplyId=""; render(); return; }
    if (action === "edit-area") {
      if (!guard("admin")) return;
      const area = areaFor(control.dataset.id), form = document.getElementById("area-form");
      if (!area || !form) return;
      form.elements.id.value=area.id; form.elements.cases.value=area.cases; form.elements.active.value=area.active; form.elements.recovered.value=area.recovered; form.elements.deaths.value=area.deaths; form.elements.date.value=isoDate(0);
      form.scrollIntoView({behavior:"smooth",block:"center"}); return;
    }
    if (action === "verify-worker") {
      if (!guard("admin")) return;
      const worker = state.workers.find(w=>w.id===control.dataset.id);
      if (!worker || !["Verified","Rejected"].includes(control.dataset.decision)) return toast("Worker or decision is invalid.",true);
      const approved = control.dataset.decision === "Verified";
      if (!await confirmAction(`${approved?"Approve":"Reject"} worker verification`, `Confirm ${approved?"approval":"rejection"} of ${worker.name}'s demonstration worker verification?`)) return;
      worker.verification = control.dataset.decision;
      const user = state.users.find(u=>u.id===worker.userId);
      if (user) user.verification = worker.verification;
      state.tasks.filter(t=>t.workerId===worker.id).forEach(t=>t.verification=worker.verification);
      if (user) notify(`Worker verification ${approved?"approved":"rejected"}`, `An administrator reviewed your demonstration worker verification.`, "Access", "disinfection", ["worker"], user.id);
      logActivity(`${roleName("admin")} ${approved?"approved":"rejected"} worker verification for ${worker.name}.`);
      saveData(); render(); toast(`Worker verification ${approved?"approved":"rejected"}.`); return;
    }
    if (action === "complete-task" || action === "return-task") {
      if (currentUser?.role === "corp") { if (!guard("corp")) return; }
      else if (currentUser?.role === "admin") { if (!guard("admin")) return; }
      else return toast("Only a corporation worker head or administrator may review tasks.", true);
      const task = state.tasks.find(t=>t.id===control.dataset.id);
      if (!task || task.status !== "Requires Review") return toast("Only tasks awaiting review can be reviewed.",true);
      if (action === "complete-task") {
        task.status="Completed"; task.verification="Verified"; task.completion=isoDate(0);
        const area=areaFor(task.areaId); if(area) area.cleanliness=state.tasks.some(other=>other.id!==task.id && other.areaId===area.id && other.status!=="Completed")?"Needs attention":"Clean";
        task.history.unshift({date:new Date().toISOString(),text:`Completion reviewed and area marked clean by ${currentUser.name}.`});
        logActivity(`Reviewed ${task.id}; ${area?.locality || "area"} marked clean.`);
        notify("Disinfection task completed", `${task.id} was reviewed and its area status updated.`, "Disinfection", "disinfection", ["corp","admin"]);
        saveData(); render(); toast("Task completion verified; area marked clean."); return;
      }
      task.status="Assigned"; task.verification="Verified";
      task.history.unshift({date:new Date().toISOString(),text:`Returned for additional work by ${currentUser.name}.`});
      logActivity(`Returned ${task.id} for additional work.`); saveData(); render(); toast("Task returned for additional work."); return;
    }
    if (action === "toggle-account") {
      if (!guard("admin")) return;
      const user = state.users.find(u=>u.id===control.dataset.id);
      if (!user) return toast("Account not found.",true);
      if (user.id===currentUser.id && user.status==="Active") return toast("You cannot disable the account currently administering this session.",true);
      const next = user.status==="Active" ? "Disabled" : "Active";
      if (!await confirmAction(`${next} demonstration account`, `Change ${user.name}'s account status to ${next}?`)) return;
      user.status=next;
      logActivity(`${next} demonstration account ${user.id}.`); saveData(); render(); toast(`Account ${next.toLowerCase()}.`); return;
    }
    if (action === "reset-data") {
      if (!await confirmAction("Reset all demonstration data?", "This restores the original fictional dataset and removes local changes from this browser. This cannot be undone.")) return;
      const role=currentUser.role, id=currentUser.id;
      state=defaultData(); selectedPatientId=""; selectedTaskId=""; patientFormVisible=false; patientEditOpen=false; taskFormVisible=false; userFormVisible=false;
      saveData();
      currentUser=role==="public" ? {id:"PUBLIC",name:"Public visitor",role:"public",status:"Active"} : state.users.find(u=>u.id===id && u.status==="Active") || state.users.find(u=>u.role===role && u.status==="Active");
      currentPage=role==="patient"?"health":role==="worker"?"disinfection":"dashboard";
      render(); toast("Original demonstration data restored."); return;
    }
  }
  function handleChange(event) {
    const target = event.target;
    if (target.id === "login-role") { updateLoginAccounts(); return; }
    if (target.matches("[data-filter]")) {
      if (target.dataset.filter === "dateFrom" && filters.dateTo && target.value && target.value > filters.dateTo) return toast("Start date must not be after the end date.", true);
      if (target.dataset.filter === "dateTo" && filters.dateFrom && target.value && target.value < filters.dateFrom) return toast("End date must not be before the start date.", true);
      filters[target.dataset.filter] = target.value;
      render(); return;
    }
    if (target.matches("[data-user-role]")) {
      if (!guard("admin")) { render(); return; }
      const user=state.users.find(u=>u.id===target.dataset.userRole), newRole=target.value;
      if (!user || !(newRole in roles) || newRole==="public") return toast("Invalid role assignment.",true);
      if (newRole==="worker" && !state.workers.some(w=>w.userId===user.id)) {
        const worker={id:`WORK-${Date.now().toString().slice(-6)}`,name:user.name,userId:user.id,verification:"Pending Verification"};
        state.workers.unshift(worker); user.verification=worker.verification;
        notify("Disinfection worker verification required",`${user.name} needs administrator approval.`,"Access","users",["admin"]);
      }
      if (user.role==="worker" && newRole!=="worker") state.workers=state.workers.filter(w=>w.userId!==user.id);
      user.role=newRole;
      if (newRole==="patient" && !user.patientId && state.patients.length) user.patientId=state.patients[0].id;
      if (newRole==="shop" && !user.shopId && state.shops.length) user.shopId=state.shops[0].id;
      if (currentUser.id===user.id) currentUser=user;
      logActivity(`Changed demonstration account ${user.id} role to ${roleName(newRole)}.`);
      saveData(); render(); toast("Role assignment updated."); return;
    }
  }
  function handleInput(event) {
    const target = event.target;
    if (!["patient-search","shop-search","user-search"].includes(target.id)) return;
    searchTerm = target.value;
    const id=target.id, start=target.selectionStart;
    render();
    const updated=document.getElementById(id);
    if(updated){updated.focus();updated.setSelectionRange(start,start);}
  }
  app.addEventListener("submit", handleSubmit);
  app.addEventListener("click", handleClick);
  app.addEventListener("change", handleChange);
  app.addEventListener("input", handleInput);
  window.addEventListener("hashchange", () => {
    const page=location.hash.slice(1);
    if (page && allowed(currentUser?.role,page)) { currentPage=page; render(); }
  });
  render();
})();
