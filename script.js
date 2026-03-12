// ── DEBUG PANEL v7 (remove this block when done testing) ──
const _dbg = document.createElement('div');
_dbg.id = 'debug-panel';
_dbg.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:180px;overflow-y:auto;background:#0a0a0a;border-top:2px solid #E63946;font-family:monospace;font-size:11px;z-index:99999;padding:6px 10px;display:none';
document.body.appendChild(_dbg);

function dbg(msg, color) {
  _dbg.style.display = 'block';
  const line = document.createElement('div');
  line.style.color = color || '#4CAF50';
  line.style.borderBottom = '1px solid #222';
  line.style.padding = '2px 0';
  line.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  _dbg.appendChild(line);
  _dbg.scrollTop = _dbg.scrollHeight;
}

window.addEventListener('error', e => dbg('❌ ' + e.message + ' (line ' + e.lineno + ')', '#E63946'));
window.addEventListener('unhandledrejection', e => dbg('❌ Promise: ' + e.reason, '#E63946'));

const LINE_COLORS = {
  'Red Line': '#E63946',
  'Yellow Line': '#FFB703',
  'Blue Line': '#5BC0FF',
  'Green Line': '#2DC653',
  'Violet Line': '#B46EFF',
  'Pink Line': '#FF6EB8',
  'Magenta Line': '#FF6090',
  'Airport Express': '#7EB8FF',
  'Grey Line': '#AAAAAA',
};


const POPULAR = [
  {from:"Kashmere Gate", to:"Rajiv Chowk"},
  {from:"New Delhi", to:"Hauz Khas"},
  {from:"Dwarka Sector 21", to:"Noida City Center"},
  {from:"Jahangirpuri", to:"HUDA City Centre"},
  {from:"Inderlok", to:"Botanical Garden"},
  {from:"Dilshad Garden", to:"Rithala"},
];

let fromVal = '', toVal = '';

// Build quick picks
const picksGrid = document.getElementById('picks-grid');
POPULAR.forEach(p => {
  const chip = document.createElement('div');
  chip.className = 'pick-chip';
  chip.innerHTML = `<span>📍</span>${p.from} → ${p.to}`;
  chip.onclick = () => {
    setStation('from', p.from);
    setStation('to', p.to);
  };
  picksGrid.appendChild(chip);
});

function setStation(field, name) {
  if (field === 'from') {
    fromVal = name;
    document.getElementById('from-input').value = name;
    document.getElementById('from-dropdown').classList.remove('open');
  } else {
    toVal = name;
    document.getElementById('to-input').value = name;
    document.getElementById('to-dropdown').classList.remove('open');
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
}

function setupField(inputId, dropdownId, field) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  function renderDropdown() {
    const q = input.value.trim().toLowerCase();
    dbg('🔎 Search [' + field + ']: "' + q + '"', '#888');
    if (field === 'from') fromVal = '';
    else toVal = '';
    checkBtn();

    if (!q) { dropdown.classList.remove('open'); return; }

    const matches = STATIONS.filter(s => s.name.toLowerCase().includes(q)).slice(0, 12);
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
        item.innerHTML = `
          <span class="item-line-dot" style="background:${color};box-shadow:0 0 6px ${color}88"></span>
          <span class="item-name">${highlight(s.name, q)}</span>
          <span class="item-line-name">${s.line}</span>`;
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
}

// ── IMPORTANT: Replace this with your Cloudflare Worker URL after deploying ──
const WORKER_URL = 'https://delhi-metro-worker.shariqahmad129.workers.dev';

function openRouteView() {
  const view = document.getElementById('route-view');
  const wrapper = document.querySelector('.wrapper');
  view.classList.add('open');
  wrapper.classList.add('hidden');
  document.querySelector('.blob.blob-1') && document.querySelectorAll('.blob').forEach(b => b.style.display = 'none');
  // Push state so back button works
  history.pushState({ routeView: true }, '');
}

function closeRouteView() {
  const view = document.getElementById('route-view');
  const wrapper = document.querySelector('.wrapper');
  view.classList.remove('open');
  wrapper.classList.remove('hidden');
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
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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
  const from = document.getElementById('from-input').value.trim();
  const to   = document.getElementById('to-input').value.trim();
  if (!from || !to) return;

  const fromSlug = toSlug(from);
  const toSlug2  = toSlug(to);
  const cacheKey = fromSlug + '|' + toSlug2;

  // Check cache first
  if (cacheGet(cacheKey)) {
    dbg('⚡ Cache hit: ' + from + ' → ' + to, '#4CAF50');
    const routes = cacheGet(cacheKey);
    showPopup({ loading: false, from, to, data: routes[0], allRoutes: routes });
    return;
  }

  dbg('🔍 Finding route: ' + from + ' → ' + to, '#FFB703');
  showPopup({ loading: true, from, to });
  dbg('📡 Fetching: ' + WORKER_URL + '/?from=' + fromSlug + '&to=' + toSlug2, '#888');

  try {
    const res  = await fetch(`${WORKER_URL}/?from=${fromSlug}&to=${toSlug2}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);

    const routes = json.routes || [];
    dbg('✅ Got ' + routes.length + ' route(s)', '#4CAF50');
    if (routes[0]) dbg('route0 stations:' + routes[0].stations.length + ' segs:' + routes[0].segments.length, '#FFB703');

    // Save to cache
    cacheSet(cacheKey, routes);

    // Update URL to reflect current search (so it's shareable)
    history.replaceState(null, '', `${location.pathname}?from=${fromSlug}&to=${toSlug2}`);

    // Save to recent routes
    saveRecentRoute(from, to, fromSlug, toSlug2);

    showPopup({ loading: false, from, to, data: routes[0], allRoutes: routes });
  } catch (e) {
    dbg('❌ Error: ' + e.message, '#E63946');
    showPopup({ loading: false, from, to, error: true });
  }
}

function showPopup({ loading, from, to, data, error, allRoutes, activeTab = 0 }) {
  const popup = document.getElementById('route-view');
  const fromSlug = toSlug(from);
  const toSlug2  = toSlug(to);
  const box   = document.getElementById('route-view-inner');

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(from + ' to ' + to + ' Delhi Metro route')}`;
  const mapsUrl   = `https://www.google.com/maps/dir/${encodeURIComponent(from + ' metro station delhi')}/${encodeURIComponent(to + ' metro station delhi')}/?travelmode=transit`;

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
    box.innerHTML = `
      <button class="popup-close" onclick="closePopup()">← Back</button>
      <div class="popup-title">OOPS!</div>
      <div class="popup-route" style="margin-bottom:20px">Couldn't fetch route data. Try Google instead.</div>
      <button class="popup-btn btn-google" onclick="window.open('${googleUrl}','_blank');closePopup()">
        <div class="popup-btn-icon">🔍</div>
        <div class="popup-btn-text">Google Search<span>Search this route online</span></div>
      </button>
      <button class="popup-btn btn-maps" onclick="window.open('${mapsUrl}','_blank');closePopup()">
        <div class="popup-btn-icon">🗺️</div>
        <div class="popup-btn-text">Google Maps<span>Live timings & directions</span></div>
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

  if (hasMultiple) window._tabRoutes = { from, to, allRoutes };

  box.innerHTML = `
    <div class="route-view-nav">
      <button class="popup-close" onclick="closePopup()">← Back</button>
      <button class="popup-share-icon" onclick="shareRoute('${fromSlug}','${toSlug2}','${from}','${to}')" title="Share Route">🔗</button>
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

    <div class="route-map">${routeMapHtml}</div>

    <div class="popup-actions">
<button class="popup-btn btn-google" onclick="window.open('${googleUrl}','_blank')">
        <div class="popup-btn-icon">🔍</div>
        <div class="popup-btn-text">Google Search<span>More details online</span></div>
      </button>
      <button class="popup-btn btn-maps" onclick="window.open('${mapsUrl}','_blank')">
        <div class="popup-btn-icon">🗺️</div>
        <div class="popup-btn-text">Google Maps<span>Live timings & navigation</span></div>
      </button>
    </div>`;

  openRouteView();
}

function shareRoute(fromSlug, toSlug, fromName, toName) {
  const url = `${location.origin}${location.pathname}?from=${fromSlug}&to=${toSlug}`;
  navigator.clipboard.writeText(url).then(() => {
    dbg('🔗 Link copied: ' + url, '#4CAF50');
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

// ── RECENT ROUTES ──
function saveRecentRoute(from, to, fromSlug, toSlug) {
  try {
    let recent = JSON.parse(localStorage.getItem('dmrc_recent') || '[]');
    // Remove duplicate if exists
    recent = recent.filter(r => !(r.from === from && r.to === to));
    recent.unshift({ from, to, fromSlug, toSlug });
    recent = recent.slice(0, 5); // keep last 5
    localStorage.setItem('dmrc_recent', JSON.stringify(recent));
    renderRecentRoutes();
  } catch(e) {}
}

function renderRecentRoutes() {
  try {
    const recent = JSON.parse(localStorage.getItem('dmrc_recent') || '[]');
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

window.loadRecent = function(from, to) {
  document.getElementById('from-input').value = from;
  document.getElementById('to-input').value   = to;
  fromVal = from; toVal = to;
  checkBtn();
  findRoute();
};

// Init recent routes on load
document.addEventListener('DOMContentLoaded', renderRecentRoutes);

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const btn = document.getElementById('find-btn');
    if (!btn.disabled) findRoute();
  }
});
