const LINE_COLORS = {
  'Red Line':             '#E63946',
  'Yellow Line':          '#FFB703',
  'Blue Line':            '#5BC0FF',
  'Blue Line (Branch)':   '#5BC0FF',
  'Violet Line':          '#B46EFF',
  'Green Line':           '#2DC653',
  'Green Line (Branch)':  '#2DC653',
  'Pink Line':            '#FF6EB8',
  'Magenta Line':         '#FF6090',
  'Airport Express':      '#7EB8FF',
  'Grey Line':            '#AAAAAA',
  'Aqua Line':            '#00BFA5',
  'Rapid Metro':          '#00BCD4',
};

let fromVal = '', toVal = '';

function setStation(field, name) {
  if (field === 'from') {
    fromVal = name;
    document.getElementById('from-input').value = name;
    document.getElementById('from-dropdown').classList.remove('open');
    // Auto-focus to field if to is empty
    if (!toVal) {
      setTimeout(() => document.getElementById('to-input').focus(), 50);
    }
  } else {
    toVal = name;
    document.getElementById('to-input').value = name;
    document.getElementById('to-dropdown').classList.remove('open');
    // Hide keyboard when second station is selected
    document.getElementById('to-input').blur();
  }
  // Update URL
  if (fromVal && toVal) {
    const fs = toSlug(fromVal), ts = toSlug(toVal);
    history.replaceState(null, '', `${location.pathname}?from=${fs}&to=${ts}`);
  }
  checkBtn();
}

function checkBtn() {
  const btn = document.getElementById('find-btn');
  btn.disabled = !(fromVal.trim() && toVal.trim());
  // Show/hide clear buttons based on input value
  const fc = document.getElementById('from-clear');
  const tc = document.getElementById('to-clear');
  const fv = document.getElementById('from-input').value;
  const tv = document.getElementById('to-input').value;
  if (fc) { fc.style.opacity = fv ? '1' : '0'; fc.style.pointerEvents = fv ? 'auto' : 'none'; }
  if (tc) { tc.style.opacity = tv ? '1' : '0'; tc.style.pointerEvents = tv ? 'auto' : 'none'; }
}

function clearField(field) {
  document.getElementById(field + '-input').value = '';
  if (field === 'from') fromVal = '';
  else toVal = '';
  checkBtn();
  document.getElementById(field + '-input').focus();
  // Clean URL if both fields empty
  if (!fromVal && !toVal) {
    const cleanUrl = location.origin + location.pathname.replace(/\?.*$/, '');
    history.replaceState(null, '', cleanUrl);
  }
}

function setupField(inputId, dropdownId, field) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  function renderDropdown() {
    const q = input.value.trim().toLowerCase();
    if (field === 'from') fromVal = '';
    else toVal = '';
    checkBtn();

    if (!q) { dropdown.classList.remove('open'); return; }

    // Fuzzy match — checks if query chars appear in order within name
    // e.g. "kashmiri" matches "Kashmere Gate" because k-a-s-h-m-r-i all appear in order
    function fuzzyMatch(name, query) {
      const n = name.toLowerCase();
      const q2 = query.toLowerCase();
      // First try: every word is a substring (fast, handles "raj chowk")
      const words = q2.split(/\s+/).filter(Boolean);
      if (words.every(w => n.includes(w))) return true;
      // Second try: all chars of query appear in order in name
      let qi = 0;
      for (let i = 0; i < n.length && qi < q2.length; i++) {
        if (n[i] === q2[qi]) qi++;
      }
      return qi === q2.length;
    }
    function fuzzyScore(name, query) {
      const n = name.toLowerCase();
      if (n === query) return 4;
      if (n.startsWith(query)) return 3;
      if (n.includes(query)) return 2;
      // word match
      if (query.split(/\s+/).every(w => n.includes(w))) return 1;
      return 0;
    }
    const matches = STATIONS
      .filter(s => fuzzyMatch(s.name, q))
      .sort((a, b) => fuzzyScore(b.name, q) - fuzzyScore(a.name, q))
      .slice(0, 12);
    dropdown.innerHTML = '';

    if (!matches.length) {
      const el = document.createElement('div');
      el.className = 'no-results';
      el.textContent = 'No station found';
      dropdown.appendChild(el);
    } else {
      matches.forEach(s => {
        const color = LINE_COLORS[s.line] || '#fff';
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        const dots = (s.lines || [s.line]).map(l => {
          const c = LINE_COLORS[l] || '#fff';
          return `<span class="item-line-dot" style="background:${c};box-shadow:0 0 6px ${c}88"></span>`;
        }).join('');
        const lineLabel = s.lines ? s.lines.map(l => l.replace(' Line','')).join(' · ') : s.line;
        item.innerHTML = `
          <span class="item-dots">${dots}</span>
          <span class="item-name">${highlight(s.name, q)}</span>
          <span class="item-line-name">${lineLabel}</span>`;
        // Use mousedown so it fires before input loses focus
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          setStation(field, s.name);
        });
        dropdown.appendChild(item);
      });
    }
    dropdown.classList.add('open');
  }

  input.addEventListener('input', renderDropdown);
  input.addEventListener('focus', renderDropdown);

  input.addEventListener('blur', () => {
    setTimeout(() => dropdown.classList.remove('open'), 150);
  });
}

function highlight(text, q) {
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  return text.slice(0, idx) + `<strong style="color:#fff">${text.slice(idx, idx+q.length)}</strong>` + text.slice(idx+q.length);
}

setupField('from-input', 'from-dropdown', 'from');
setupField('to-input', 'to-dropdown', 'to');

function swapStations() {
  const tmp = fromVal;
  fromVal = toVal;
  toVal = tmp;
  document.getElementById('from-input').value = fromVal;
  document.getElementById('to-input').value = toVal;
  checkBtn();
  // Update URL if both fields filled
  if (fromVal && toVal) {
    const fs = toSlug(fromVal);
    const ts = toSlug(toVal);
    history.replaceState(null, '', `${location.pathname}?from=${fs}&to=${ts}`);
  }
}

// ── IMPORTANT: Replace this with your Cloudflare Worker URL after deploying ──
const WORKER_URL = 'https://delhi-metro-worker.shariqahmad129.workers.dev';
const WORKER_KEY = 'dmrc_shariq_2025';

function openRouteView() {
  const view = document.getElementById('route-view');
  const wrapper = document.querySelector('.wrapper');
  view.classList.add('open');
  wrapper.classList.add('hidden');
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('.blob').forEach(b => b.style.display = 'none');
  history.pushState({ routeView: true }, '');
}

function closeRouteView() {
  const view = document.getElementById('route-view');
  const wrapper = document.querySelector('.wrapper');
  view.classList.remove('open');
  wrapper.classList.remove('hidden');
  document.body.style.overflow = '';
  document.querySelectorAll('.blob').forEach(b => b.style.display = '');
}

// Handle browser back button
window.addEventListener('popstate', function(e) {
  const view = document.getElementById('route-view');
  if (view.classList.contains('open')) {
    closeRouteView();
  }
});

// Convert station name to URL slug — use precomputed slug from STATIONS array
function toSlug(name) {
  const station = STATIONS.find(s => s.name === name);
  if (station && station.slug) return station.slug;
  // Fallback for names not in array
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ── ROUTE CACHE (localStorage, 10 min expiry) ──
const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours

function cacheGet(key) {
  try {
    const item = JSON.parse(localStorage.getItem('rc_' + key));
    if (!item) return null;
    if (Date.now() - item.ts > CACHE_TTL) { localStorage.removeItem('rc_' + key); return null; }
    return item.data;
  } catch(e) { return null; }
}

function cacheSet(key, data) {
  try { localStorage.setItem('rc_' + key, JSON.stringify({ ts: Date.now(), data })); } catch(e) {}
}

async function findRoute() {
  const from = fromVal.trim() || document.getElementById('from-input').value.trim();
  const to   = toVal.trim()   || document.getElementById('to-input').value.trim();
  if (!from || !to) return;

  const fromSlug = toSlug(from);
  const toSlug2  = toSlug(to);
  const cacheKey = fromSlug + '|' + toSlug2;

  // Check cache first
  if (cacheGet(cacheKey)) {
    const routes = cacheGet(cacheKey);
    showPopup({ loading: false, from, to, data: routes[0], allRoutes: routes });
    return;
  }
  showPopup({ loading: true, from, to });

  try {
    const res  = await fetch(`${WORKER_URL}/?from=${fromSlug}&to=${toSlug2}`, { headers: { 'x-api-key': WORKER_KEY } });
    if (res.status === 429 || res.status === 503) { showPopup({ loading: false, from, to, error: true, status: res.status }); return; }
    const json = await res.json();
    if (json.error) throw new Error(json.error);

    const routes = json.routes || [];


    // Save to cache
    cacheSet(cacheKey, routes);

    // Update URL to reflect current search (so it's shareable)
    history.replaceState(null, '', `${location.pathname}?from=${fromSlug}&to=${toSlug2}`);

    // Save to recent routes
    saveRecentRoute(from, to, fromSlug, toSlug2);

    showPopup({ loading: false, from, to, data: routes[0], allRoutes: routes });
  } catch (e) {
    showPopup({ loading: false, from, to, error: true });
  }
}

function showPopup({ loading, from, to, data, error, allRoutes, activeTab = 0, status = 0 }) {
  const popup = document.getElementById('route-view');
  const fromSlug = toSlug(from);
  const toSlug2  = toSlug(to);
  const box   = document.getElementById('route-view-inner');

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(from + ' to ' + to + ' Delhi Metro route')}`;
  const mapsUrl   = `https://www.google.com/maps/dir/${encodeURIComponent(from + ' metro station delhi')}/${encodeURIComponent(to + ' metro station delhi')}/?travelmode=transit`;
  const dmrcUrl   = `https://delhimetrorail.info/${fromSlug}-delhi-metro-station-to-${toSlug2}-delhi-metro-station`;

  if (loading) {
    box.innerHTML = `
      <button class="popup-close" onclick="closePopup()">← Back</button>
      <div class="popup-title">FINDING ROUTE</div>
      <div class="popup-route"><strong>${from}</strong><br>↓<br><strong>${to}</strong></div>
      <div class="popup-loading">
        <div class="loading-spinner"></div>
        <p>Fetching live data...</p>
      </div>`;
    openRouteView();
    return;
  }

  if (error) {
    const overloadMsgs = [
      { title: "WORKER DOWN BAD 😵", body: "100,000 people asked for metro routes today. The backend went home early. Try again tomorrow or just walk lol." },
      { title: "TOO POPULAR 💀",      body: "The API hit its daily limit. Basically this app is too good. Developer is not rich enough to handle this." },
      { title: "FREE TIER VIBES 🪙",  body: "Cloudflare gave us 100k free requests and Delhi Metro users burned through them. Touch grass and come back tomorrow." },
      { title: "QUOTA: COOKED 🍳",    body: "Daily request limit reached. The backend is resting. It'll be back at midnight IST, refreshed and ready to suffer again." },
    ];
    const genericMsgs = [
      { title: "SIGNAL LOST 📡",      body: "Couldn't reach the backend. Either it's down, or the metro gods are testing you. Try again in a sec." },
      { title: "404: ROUTE VIBES 🚧", body: "Something broke on our end. Not the metro though — that's always on time (lol). Try again or use Google." },
      { title: "OOPS 🤌",             body: "Server threw hands and left. We don't know why either. Try again or blame DMRC, everyone does." },
    ];
    const isOverload = status === 429 || status === 503;
    const pool = isOverload ? overloadMsgs : genericMsgs;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    box.innerHTML = `
      <button class="popup-close" onclick="closePopup()">← Back</button>
      <div class="popup-title">${msg.title}</div>
      <div class="popup-route" style="margin-bottom:24px;font-size:14px;line-height:1.6;opacity:0.8">${msg.body}</div>
      <button class="popup-btn btn-dmrc" onclick="window.open('${dmrcUrl}','_blank');closePopup()">
        <div class="popup-btn-icon">🚇</div>
        <div class="popup-btn-text">Official DMRC Site<span>Data source — delhimetrorail.info</span></div>
      </button>
      <button class="popup-btn btn-google" onclick="window.open('${googleUrl}','_blank');closePopup()">
        <div class="popup-btn-icon">🔍</div>
        <div class="popup-btn-text">Google Search<span>Search this route online</span></div>
      </button>
      <button class="popup-btn btn-maps" onclick="window.open('${mapsUrl}','_blank');closePopup()">
        <div class="popup-btn-icon">🗺️</div>
        <div class="popup-btn-text">Google Maps<span>Live timings & other navigation</span></div>
      </button>`;
    return;
  }

  // ── Build visual route map
  let routeMapHtml = '';
  if (data.segments && data.segments.length > 0) {
    data.segments.forEach((seg, si) => {
      const color = seg.color || '#aaa';

      let stopsHtml = '';
      seg.stations.forEach((station, i) => {
        const isRouteFirst = si === 0 && i === 0;
        const isRouteLast  = si === data.segments.length - 1 && i === seg.stations.length - 1;
        const isSegFirst   = i === 0;
        const isSegLast    = i === seg.stations.length - 1;

        stopsHtml += `
          <div class="route-stop ${isSegFirst ? 'stop-first' : ''} ${isSegLast ? 'stop-last' : ''}">
            <div class="stop-line-wrap">
              <div class="stop-line top" style="background:${color}"></div>
              <div class="stop-circle ${isRouteFirst || isRouteLast ? 'stop-circle-big' : ''}" style="border-color:${color};${isRouteFirst || isRouteLast ? 'background:'+color : 'background:#1A1A26'}"></div>
              <div class="stop-line bottom" style="background:${color}"></div>
            </div>
            <div class="stop-label ${isRouteFirst || isRouteLast ? 'stop-label-bold' : ''}">${station}</div>
          </div>`;
      });

      routeMapHtml += `
        <div class="seg-row">
          <div class="seg-card" style="border-left:3px solid ${color}">
            <div class="seg-line-name" style="color:${color}">${seg.line}</div>
            <div class="seg-towards">→ ${seg.towards}</div>
            <div class="seg-platform">Platform ${seg.platform}</div>
          </div>
          <div class="seg-stations">${stopsHtml}</div>
        </div>`;

      // Interchange badge
      if (seg.hasInterchangeAtEnd && si < data.segments.length - 1) {
        const nextSeg   = data.segments[si + 1];
        const nextColor = nextSeg.color || '#aaa';
        const interchangeStation = seg.stations[seg.stations.length - 1];
        if (!nextSeg.stations.includes(interchangeStation)) {
          nextSeg.stations.unshift(interchangeStation);
        }
        routeMapHtml += `
          <div class="interchange-badge">
            <div class="interchange-icon">🔄</div>
            <div class="interchange-text">
              <strong>Change Train</strong>
              <span>at ${interchangeStation}</span>
            </div>
            <div class="interchange-arrow" style="color:${nextColor}">→ ${nextSeg.line}</div>
          </div>`;
      }
    });
  }
    // Build tabs if multiple routes
  const hasMultiple = allRoutes && allRoutes.length > 1;
  const tabsHtml = hasMultiple ? (() => {
    return '<div class="route-tabs">' + allRoutes.map((r, i) => {
      const changes = r.segments.length - 1;
      const label = changes === 0 ? 'Direct' : changes + ' change' + (changes > 1 ? 's' : '');
      const dots = r.segments.map(s => `<span class="tab-dot" style="background:${s.color}"></span>`).join('');
      return `<button class="route-tab ${i === activeTab ? 'active' : ''}" onclick="switchTab(${i})">
        <div class="tab-dots">${dots}</div>
        <div class="tab-label">Route ${i + 1}</div>
        <div class="tab-meta">${label} · ${r.stations.length} stops</div>
      </button>`;
    }).join('') + '</div>';
  })() : '';

  // Build gates HTML
  let gatesHtml = '';
  if (data.gates && data.gates.length > 0) {
    gatesHtml = `<div class="gates-section">` +
      data.gates.map(sg => `
        <div class="gates-station">
          <div class="gates-station-name">🚪 ${sg.station}</div>
          <div class="gates-list">
            ${sg.gates.map(g => `
              <div class="gate-row">
                <span class="gate-num">Gate ${g.gate}</span>
                <span class="gate-desc">${g.desc}</span>
              </div>`).join('')}
          </div>
        </div>`).join('') +
      `</div>`;
  }

  if (hasMultiple) window._tabRoutes = { from, to, allRoutes };

  box.innerHTML = `
    <div class="route-view-nav">
      <button class="popup-close" onclick="closePopup()">← Back</button>
      <div class="nav-right">
        <button id="save-route-btn" class="save-btn" onclick="toggleSaveRoute('${from}','${to}','${fromSlug}','${toSlug2}')">${isRouteSaved(from,to) ? '★ Saved' : '☆ Save'}</button>
        <button class="popup-share-icon" onclick="shareRoute('${fromSlug}','${toSlug2}','${from}','${to}')" title="Share Route">🔗</button>
      </div>
    </div>
    <div class="popup-title">YOUR ROUTE</div>
    <div class="popup-route"><strong>${from}</strong><span class="route-arrow">↓</span><strong>${to}</strong></div>

    ${tabsHtml}

    <div class="route-stats">
      ${data.fare       ? `<div class="route-stat"><div class="rs-val">${data.fare}</div><div class="rs-lbl">Fare</div></div>` : ''}
      ${data.time       ? `<div class="route-stat"><div class="rs-val">${data.time}</div><div class="rs-lbl">Time</div></div>` : ''}
      ${data.firstTrain ? `<div class="route-stat"><div class="rs-val">${data.firstTrain}</div><div class="rs-lbl">First</div></div>` : ''}
      ${data.lastTrain  ? `<div class="route-stat"><div class="rs-val">${data.lastTrain}</div><div class="rs-lbl">Last</div></div>` : ''}
    </div>

    <div class="route-body">
      <div class="route-map">${routeMapHtml}</div>
      ${gatesHtml ? `<div class="gates-side">${gatesHtml}</div>` : ''}
    </div>

    <div class="popup-actions">
      <button class="popup-btn btn-dmrc" onclick="window.open('${dmrcUrl}','_blank')">
        <div class="popup-btn-icon">🚇</div>
        <div class="popup-btn-text">Official DMRC Site<span>Data source — delhimetrorail.info</span></div>
      </button>
      <button class="popup-btn btn-whatsapp" onclick="window.open('https://wa.me/919650855800?text=Hi','_blank')">
        <div class="popup-btn-icon">🎟️</div>
        <div class="popup-btn-text">Buy Ticket via WhatsApp<span>DMRC official bot — pay by UPI & get QR ticket</span></div>
      </button>
      <button class="popup-btn btn-whatsapp" onclick="window.open('https://wa.me/919650855800?text=Hi','_blank')">
        <div class="popup-btn-icon">🎟️</div>
        <div class="popup-btn-text">Buy Ticket via WhatsApp<span>DMRC official bot — pay by UPI & get QR ticket</span></div>
      </button>
      <button class="popup-btn btn-google" onclick="window.open('${googleUrl}','_blank')">
        <div class="popup-btn-icon">🔍</div>
        <div class="popup-btn-text">Google Search<span>More details online</span></div>
      </button>
      <button class="popup-btn btn-maps" onclick="window.open('${mapsUrl}','_blank')">
        <div class="popup-btn-icon">🗺️</div>
        <div class="popup-btn-text">Google Maps<span>Live timings & other navigation</span></div>
      </button>
    </div>`;

  openRouteView();
}

function shareRoute(fromSlug, toSlug, fromName, toName) {
  const url = `${location.origin}${location.pathname}?from=${fromSlug}&to=${toSlug}`;
  navigator.clipboard.writeText(url).then(() => {
    // Show toast
    const toast = document.createElement('div');
    toast.textContent = '🔗 Link copied!';
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#4CAF50;color:#fff;padding:10px 20px;border-radius:20px;font-size:13px;z-index:99999;font-family:DM Sans,sans-serif;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  });
}

// Auto-fill from URL params — fill fields always, fetch only on fresh link visit
(function() {
  const params = new URLSearchParams(location.search);
  const fromSlug = params.get('from');
  const toSlug_param = params.get('to');
  if (fromSlug && toSlug_param) {
    const fromStation = STATIONS.find(s => s.slug === fromSlug);
    const toStation   = STATIONS.find(s => s.slug === toSlug_param);
    if (fromStation && toStation) {
      document.getElementById('from-input').value = fromStation.name;
      document.getElementById('to-input').value   = toStation.name;
      fromVal = fromStation.name;
      toVal   = toStation.name;
      checkBtn();

      // Only auto-fetch if this is a fresh link visit, not a reload
      // sessionStorage flag is set after first fetch — cleared on tab close
      const sessionKey = 'visited_' + fromSlug + '_' + toSlug_param;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        setTimeout(findRoute, 500);
      }
      // Keep URL as-is so fields stay filled on reload
    }
  }
})();

function closePopup() { closeRouteView(); }

window.switchTab = function(i) {
  const { from, to, allRoutes } = window._tabRoutes;
  showPopup({ loading: false, from, to, data: allRoutes[i], allRoutes, activeTab: i });
};

// ── SAVED ROUTES ──
// In-memory backup for saved/recent (survives localStorage wipes during session)
let _savedMem = null;
let _recentMem = null;

function getSaved() {
  try {
    const s = JSON.parse(localStorage.getItem('dmrc_saved') || '[]');
    _savedMem = s;
    return s;
  } catch(e) { return _savedMem || []; }
}
function setSaved(arr) {
  _savedMem = arr;
  try { localStorage.setItem('dmrc_saved', JSON.stringify(arr)); } catch(e) {}
}
function getRecent() {
  try {
    const s = JSON.parse(localStorage.getItem('dmrc_recent') || '[]');
    _recentMem = s;
    return s;
  } catch(e) { return _recentMem || []; }
}
function setRecent(arr) {
  _recentMem = arr;
  try { localStorage.setItem('dmrc_recent', JSON.stringify(arr)); } catch(e) {}
}


function toggleSaveRoute(from, to, fromSlug, toSlug) {
  try {
    let saved = getSaved();
    const exists = saved.findIndex(r => r.from === from && r.to === to);
    if (exists > -1) {
      saved.splice(exists, 1);
    } else {
      saved.unshift({ from, to, fromSlug, toSlug });
      saved = saved.slice(0, 10);
    }
    setSaved(saved);
    renderSavedRoutes();
    updateSaveBtn(from, to);
  } catch(e) {}
}

function isRouteSaved(from, to) {
  try {
    const saved = getSaved();
    return saved.some(r => r.from === from && r.to === to);
  } catch(e) { return false; }
}

function updateSaveBtn(from, to) {
  const btn = document.getElementById('save-route-btn');
  if (!btn) return;
  const saved = isRouteSaved(from, to);
  btn.textContent = saved ? '★ Saved' : '☆ Save';
  btn.classList.toggle('saved', saved);
}

function renderSavedRoutes() {
  try {
    const saved = getSaved();
    const container = document.getElementById('saved-routes');
    if (!container) return;
    if (saved.length === 0) { container.style.display = 'none'; return; }
    container.style.display = 'block';
    container.innerHTML = `
      <div class="recent-label">SAVED</div>
      <div class="recent-list">
        ${saved.map(r => `
          <button class="recent-chip saved-chip" onclick="loadRecent('${r.from}','${r.to}')">
            <span class="rc-star">★</span>
            <span class="rc-from">${r.from}</span>
            <span class="rc-arrow">→</span>
            <span class="rc-to">${r.to}</span>
          </button>`).join('')}
      </div>`;
  } catch(e) {}
}


function saveRecentRoute(from, to, fromSlug, toSlug) {
  try {
    let recent = getRecent();
    // Remove duplicate if exists
    recent = recent.filter(r => !(r.from === from && r.to === to));
    recent.unshift({ from, to, fromSlug, toSlug });
    recent = recent.slice(0, 5); // keep last 5
    setRecent(recent);
    renderRecentRoutes();
  } catch(e) {}
}

function renderRecentRoutes() {
  try {
    const recent = getRecent();
    const container = document.getElementById('recent-routes');
    if (!container) return;
    if (recent.length === 0) { container.style.display = 'none'; return; }
    container.style.display = 'block';
    container.innerHTML = `
      <div class="recent-label">RECENT</div>
      <div class="recent-list">
        ${recent.map(r => `
          <button class="recent-chip" onclick="loadRecent('${r.from}','${r.to}')">
            <span class="rc-from">${r.from}</span>
            <span class="rc-arrow">→</span>
            <span class="rc-to">${r.to}</span>
          </button>`).join('')}
      </div>`;
  } catch(e) {}
}

// ── POPULAR ROUTES ──
// ── POPULAR ROUTES ──
const POPULAR_ROUTES = [
  { from: 'Kashmere Gate',    to: 'Rajiv Chowk' },
  { from: 'New Delhi',        to: 'Airport' },
  { from: 'Huda City Centre', to: 'Samaypur Badli' },
  { from: 'Dwarka Sector 21', to: 'Noida Electronic City' },
  { from: 'Botanical Garden', to: 'Janakpuri West' },
  { from: 'Vaishali',         to: 'Dwarka' },
];

function renderPopularRoutes() {
  const grid = document.getElementById('picks-grid');
  if (!grid) return;
  grid.innerHTML = POPULAR_ROUTES.map(r => {
    const fromStation = STATIONS.find(s => s.name === r.from);
    const col = fromStation ? (LINE_COLORS[fromStation.line] || '#5BC0FF') : '#5BC0FF';
    return `<button class="pick-chip" onclick="loadRecent('${r.from}','${r.to}')" style="border-color:${col}33">
      <span class="pick-dot" style="background:${col}"></span>
      <span class="pick-from">${r.from}</span>
      <span class="pick-arrow">→</span>
      <span class="pick-to">${r.to}</span>
    </button>`;
  }).join('');
}

// ── GPS NEARBY STATIONS ──
let _nearbyUserLat = null, _nearbyUserLon = null;
let _nearbyOSMStations = null;
let _nearbyMode = 'walk';
let _nearbyCache = {};
let _nearbyAbort = null;    // foreground calc abort
let _prefetchAbort = null;  // background prefetch abort

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function fetchOSMStationCoords(lat, lon) {
  const query = `[out:json][timeout:15];node["railway"="station"]["network"="Delhi Metro"](around:10000,${lat},${lon});out;`;
  const mirrors = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
  ];
  for (const mirror of mirrors) {
    try {
      const res = await fetch(`${mirror}?data=${encodeURIComponent(query)}`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.elements) return data.elements
        .map(e => ({ name: e.tags.name || e.tags['name:en'] || '', lat: e.lat, lon: e.lon }))
        .filter(e => e.name);
    } catch(e) { continue; }
  }
  throw new Error('All Overpass mirrors failed');
}

async function fetchRouteDistance(mode, fromLat, fromLon, toLat, toLon) {
  const profile = mode === 'walk' ? 'routed-foot/route/v1/foot' : 'routed-car/route/v1/driving';
  const url = `https://routing.openstreetmap.de/${profile}/${fromLon},${fromLat};${toLon},${toLat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  if (data.routes?.[0]) {
    const km = data.routes[0].distance / 1000;
    return {
      km: km.toFixed(1),
      mins: mode === 'walk' ? Math.round((km / 5.5) * 60) : Math.round((km / 20) * 60)
    };
  }
  return null;
}

function openNearbyPopup() {
  document.getElementById('nearby-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.closeNearbyPopup = function(e) {
  if (e && e.target !== document.getElementById('nearby-overlay')) return;
  document.getElementById('nearby-overlay').classList.remove('open');
  document.body.style.overflow = '';
};

function displayNearbyResults(sorted, mode) {
  const el = document.getElementById('nearby-results');
  if (!sorted.length) { el.innerHTML = '<div class="nearby-empty">No stations found nearby</div>'; return; }
  const icon = mode === 'walk' ? '🚶' : '🚗';
  el.innerHTML = '<div class="nearby-stations">' +
    sorted.map((s, i) => {
      const col = LINE_COLORS[s.line] || '#888';
      const name = s.name.replace(/'/g, "\'");
      return '<button class="nearby-item ' + (i===0?'nearest':'') + '" onclick="pickNearby(\'' + name + '\')">' +
        '<span class="nearby-dot" style="background:' + col + '"></span>' +
        '<span class="nearby-name">' + s.name + '</span>' +
        '<span class="nearby-dist">' + icon + ' ' + s.route.km + ' km<span class="nearby-mins">' + s.route.mins + ' min</span></span>' +
        '</button>';
    }).join('') +
  '</div>';
}

window.setNearbyMode = function(mode) {
  _nearbyMode = mode;
  document.getElementById('tab-walk').classList.toggle('active', mode === 'walk');
  document.getElementById('tab-drive').classList.toggle('active', mode === 'drive');
  if (!_nearbyUserLat || !_nearbyOSMStations) return;
  if (_nearbyCache[mode]) {
    displayNearbyResults(_nearbyCache[mode], mode);
  } else {
    calcMode(mode);
  }
};

function getCandidates(lat, lon) {
  return _nearbyOSMStations
    .map(osm => {
      const match = STATIONS.find(s =>
        s.name.toLowerCase().replace(/[\s()-]/g,'') === osm.name.toLowerCase().replace(/[\s()-]/g,'') ||
        s.name.toLowerCase().includes(osm.name.toLowerCase().slice(0,8)) ||
        osm.name.toLowerCase().includes(s.name.toLowerCase().slice(0,8))
      );
      return match ? { ...match, osmLat: osm.lat, osmLon: osm.lon, straight: haversineKm(lat, lon, osm.lat, osm.lon) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.straight - b.straight)
    .slice(0, 7);
}

async function calcMode(mode) {
  const el = document.getElementById('nearby-results');
  el.innerHTML = `<div class="nearby-loading"><div class="nearby-spinner"></div>Calculating ${mode==='walk'?'walking':'driving'} distances...</div>`;
  const candidates = getCandidates(_nearbyUserLat, _nearbyUserLon);
  const results = await Promise.all(
    candidates.map(async s => {
      try {
        const route = await fetchRouteDistance(mode, _nearbyUserLat, _nearbyUserLon, s.osmLat, s.osmLon);
        return route ? { ...s, route } : null;
      } catch(e) {
        return null;
      }
    })
  );
  const sorted = results.filter(Boolean).sort((a,b) => parseFloat(a.route.km)-parseFloat(b.route.km)).slice(0,5);
  _nearbyCache[mode] = sorted;
  // Only show if this mode is still active
  if (_nearbyMode === mode) displayNearbyResults(sorted, mode);
  // Prefetch other mode
  const other = mode === 'walk' ? 'drive' : 'walk';
  if (!_nearbyCache[other]) prefetchMode(other);
}


async function prefetchMode(mode) {
  const candidates = getCandidates(_nearbyUserLat, _nearbyUserLon);
  const results = await Promise.all(
    candidates.map(async s => {
      try {
        const route = await fetchRouteDistance(mode, _nearbyUserLat, _nearbyUserLon, s.osmLat, s.osmLon);
        return route ? { ...s, route } : null;
      } catch(e) { return null; }
    })
  );
  _nearbyCache[mode] = results.filter(Boolean).sort((a,b) => parseFloat(a.route.km)-parseFloat(b.route.km)).slice(0,5);
  // If user is now on this tab, show results
  if (_nearbyMode === mode) displayNearbyResults(_nearbyCache[mode], mode);
}


function findNearbyStations() {
  openNearbyPopup();
  if (!navigator.geolocation) {
    document.getElementById('nearby-results').innerHTML = '<div class="nearby-empty">GPS not supported</div>';
    return;
  }
  if (_nearbyUserLat && _nearbyOSMStations) {
    if (_nearbyCache[_nearbyMode]) displayNearbyResults(_nearbyCache[_nearbyMode], _nearbyMode);
    else calcMode(_nearbyMode);
    return;
  }
  document.getElementById('nearby-results').innerHTML =
    `<div class="nearby-loading"><div class="nearby-spinner"></div>Getting your location...</div>`;
  navigator.geolocation.getCurrentPosition(
    async pos => {
      _nearbyUserLat = pos.coords.latitude;
      _nearbyUserLon = pos.coords.longitude;
      try {
        document.getElementById('nearby-results').innerHTML =
          `<div class="nearby-loading"><div class="nearby-spinner"></div>Finding nearby stations...</div>`;
        _nearbyOSMStations = await fetchOSMStationCoords(_nearbyUserLat, _nearbyUserLon);
        calcMode(_nearbyMode);
      } catch(e) {
        document.getElementById('nearby-results').innerHTML =
          '<div class="nearby-empty">⚠️ Could not fetch station data. Check connection.</div>';
      }
    },
    err => {
      const msg = err.code===1 ? 'Location permission denied' :
                  err.code===2 ? 'Location unavailable' : 'Location timed out';
      document.getElementById('nearby-results').innerHTML = `<div class="nearby-empty">⚠️ ${msg}</div>`;
    },
    { timeout: 15000, maximumAge: 120000, enableHighAccuracy: false }
  );
}

window.pickNearby = function(name) {
  document.getElementById('nearby-overlay').classList.remove('open');
  document.body.style.overflow = '';
  setStation('from', name);
};

window.loadRecent = function(from, to) {
  fromVal = from; toVal = to;
  findRoute();
};

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  renderSavedRoutes();
  renderRecentRoutes();
  renderPopularRoutes();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const btn = document.getElementById('find-btn');
    if (!btn.disabled) findRoute();
  }
});
// ── PWA SERVICE WORKER ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/delhi-metro/sw.js')
      .catch(err => console.log('SW registration failed:', err));
  });
}
