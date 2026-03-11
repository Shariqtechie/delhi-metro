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

const STATIONS = [
  {name:"Adarsh Nagar",line:"Yellow Line"},
  {name:"AIIMS",line:"Yellow Line"},
  {name:"Akshardham",line:"Blue Line"},
  {name:"Anand Vihar",line:"Blue Line"},
  {name:"Arjan Garh",line:"Yellow Line"},
  {name:"Arthala",line:"Red Line"},
  {name:"Ashok Park Main",line:"Green Line"},
  {name:"Ashram",line:"Pink Line"},
  {name:"Azadpur",line:"Yellow Line"},
  {name:"Badarpur Border",line:"Violet Line"},
  {name:"Badkhal Mor",line:"Violet Line"},
  {name:"Bahadurgarh City",line:"Green Line"},
  {name:"Barakhamba Road",line:"Blue Line"},
  {name:"Bata Chowk",line:"Violet Line"},
  {name:"Bhikaji Cama Place",line:"Pink Line"},
  {name:"Botanical Garden",line:"Blue Line"},
  {name:"Brigadier Hoshiyar Singh",line:"Green Line"},
  {name:"Central Secretariat",line:"Yellow Line"},
  {name:"Chandni Chowk",line:"Yellow Line"},
  {name:"Chawri Bazar",line:"Yellow Line"},
  {name:"Chhatarpur",line:"Yellow Line"},
  {name:"Chirag Delhi",line:"Magenta Line"},
  {name:"Civil Lines",line:"Yellow Line"},
  {name:"Dabri Mor - Janakpuri South",line:"Magenta Line"},
  {name:"Dashrath Puri",line:"Magenta Line"},
  {name:"Delhi Aerocity",line:"Airport Express"},
  {name:"Delhi Cantonment",line:"Pink Line"},
  {name:"Delhi Gate",line:"Violet Line"},
  {name:"Dhansa Bus Stand",line:"Grey Line"},
  {name:"Dhaula Kuan",line:"Airport Express"},
  {name:"Dilli Haat - INA",line:"Yellow Line"},
  {name:"Dilshad Garden",line:"Red Line"},
  {name:"Durgabai Deshmukh South Campus",line:"Pink Line"},
  {name:"Dwarka",line:"Blue Line"},
  {name:"Dwarka Mor",line:"Blue Line"},
  {name:"Dwarka Sector 8",line:"Blue Line"},
  {name:"Dwarka Sector 9",line:"Blue Line"},
  {name:"Dwarka Sector 10",line:"Blue Line"},
  {name:"Dwarka Sector 11",line:"Blue Line"},
  {name:"Dwarka Sector 12",line:"Blue Line"},
  {name:"Dwarka Sector 13",line:"Blue Line"},
  {name:"Dwarka Sector 14",line:"Blue Line"},
  {name:"Dwarka Sector 21",line:"Blue Line"},
  {name:"East Azad Nagar",line:"Pink Line"},
  {name:"East Vinod Nagar - Mayur Vihar-II",line:"Pink Line"},
  {name:"Escorts Mujesar",line:"Violet Line"},
  {name:"ESI - Basaidarapur",line:"Pink Line"},
  {name:"Ghevra Metro Station",line:"Green Line"},
  {name:"Ghitorni",line:"Yellow Line"},
  {name:"Gokulpuri",line:"Pink Line"},
  {name:"Golf Course",line:"Blue Line"},
  {name:"Govindpuri",line:"Violet Line"},
  {name:"Greater Kailash",line:"Magenta Line"},
  {name:"Green Park",line:"Yellow Line"},
  {name:"Guru Tegh Bahadur Nagar",line:"Yellow Line"},
  {name:"Guru Dronacharya",line:"Yellow Line"},
  {name:"Haiderpur Badli Mor",line:"Yellow Line"},
  {name:"Harkesh Nagar Okhla",line:"Violet Line"},
  {name:"Hauz Khas",line:"Yellow Line"},
  {name:"Hindon River",line:"Red Line"},
  {name:"IFFCO Chowk",line:"Yellow Line"},
  {name:"IIT",line:"Magenta Line"},
  {name:"Inderlok",line:"Red Line"},
  {name:"Indira Gandhi International Airport",line:"Airport Express"},
  {name:"Indraprastha",line:"Blue Line"},
  {name:"IP Extension",line:"Pink Line"},
  {name:"ITO",line:"Violet Line"},
  {name:"Jaffrabad",line:"Pink Line"},
  {name:"Jahangirpuri",line:"Yellow Line"},
  {name:"Jama Masjid",line:"Violet Line"},
  {name:"Jamia Millia Islamia",line:"Magenta Line"},
  {name:"Janakpuri East",line:"Blue Line"},
  {name:"Janakpuri West",line:"Blue Line"},
  {name:"Jangpura",line:"Violet Line"},
  {name:"Janpath",line:"Violet Line"},
  {name:"Jasola Apollo",line:"Violet Line"},
  {name:"Jasola Vihar Shaheen Bagh",line:"Magenta Line"},
  {name:"Jawaharlal Nehru Stadium",line:"Violet Line"},
  {name:"Jhandewalan",line:"Blue Line"},
  {name:"Jhilmil",line:"Red Line"},
  {name:"Johri Enclave",line:"Pink Line"},
  {name:"Jor Bagh",line:"Yellow Line"},
  {name:"Kailash Colony",line:"Violet Line"},
  {name:"Kalindi Kunj",line:"Magenta Line"},
  {name:"Kalkaji Mandir",line:"Violet Line"},
  {name:"Kanhaiya Nagar",line:"Red Line"},
  {name:"Karkarduma",line:"Blue Line"},
  {name:"Karkarduma Court",line:"Pink Line"},
  {name:"Karol Bagh",line:"Blue Line"},
  {name:"Kashmere Gate",line:"Red Line"},
  {name:"Kaushambi",line:"Blue Line"},
  {name:"Keshav Puram",line:"Red Line"},
  {name:"Khan Market",line:"Violet Line"},
  {name:"Kirti Nagar",line:"Blue Line"},
  {name:"Krishna Nagar",line:"Pink Line"},
  {name:"Kohat Enclave",line:"Red Line"},
  {name:"Krishna Park Extension",line:"Magenta Line"},
  {name:"Lajpat Nagar",line:"Violet Line"},
  {name:"Lal Qila",line:"Violet Line"},
  {name:"Laxmi Nagar",line:"Blue Line"},
  {name:"Lok Kalyan Marg",line:"Yellow Line"},
  {name:"Madipur",line:"Green Line"},
  {name:"Madhuban Chowk",line:"Red Line"},
  {name:"Maharaja Surajmal Stadium",line:"Green Line"},
  {name:"Majlis Park",line:"Pink Line"},
  {name:"Major Mohit Sharma Rajendra Nagar",line:"Red Line"},
  {name:"Malviya Nagar",line:"Yellow Line"},
  {name:"Mandawali - West Vinod Nagar",line:"Pink Line"},
  {name:"Mandi House",line:"Blue Line"},
  {name:"Mansarovar Park",line:"Red Line"},
  {name:"Maujpur - Babarpur",line:"Pink Line"},
  {name:"Mayapuri",line:"Pink Line"},
  {name:"Mayur Vihar-I",line:"Blue Line"},
  {name:"Mayur Vihar Extension",line:"Blue Line"},
  {name:"Mewla Maharajpur",line:"Violet Line"},
  {name:"MG Road",line:"Yellow Line"},
  {name:"Millennium City Centre Gurugram",line:"Yellow Line"},
  {name:"Model Town",line:"Yellow Line"},
  {name:"Mohan Estate",line:"Violet Line"},
  {name:"Mohan Nagar",line:"Red Line"},
  {name:"Moolchand",line:"Violet Line"},
  {name:"Moti Nagar",line:"Blue Line"},
  {name:"Mundka",line:"Green Line"},
  {name:"Mundka Industrial Area",line:"Green Line"},
  {name:"Munirka",line:"Magenta Line"},
  {name:"Najafgarh",line:"Grey Line"},
  {name:"Nangli",line:"Grey Line"},
  {name:"Nangloi",line:"Green Line"},
  {name:"Nangloi Railway Station",line:"Green Line"},
  {name:"Naraina Vihar",line:"Pink Line"},
  {name:"Nawada",line:"Blue Line"},
  {name:"Neelam Chowk Ajronda",line:"Violet Line"},
  {name:"Nehru Enclave",line:"Magenta Line"},
  {name:"Nehru Place",line:"Violet Line"},
  {name:"Netaji Subhash Place",line:"Red Line"},
  {name:"New Ashok Nagar",line:"Blue Line"},
  {name:"New Delhi",line:"Yellow Line"},
  {name:"NHPC Chowk",line:"Violet Line"},
  {name:"Nirman Vihar",line:"Blue Line"},
  {name:"Noida City Centre",line:"Blue Line"},
  {name:"Noida Electronic City",line:"Blue Line"},
  {name:"Noida Sector 15",line:"Blue Line"},
  {name:"Noida Sector 16",line:"Blue Line"},
  {name:"Noida Sector 18",line:"Blue Line"},
  {name:"Noida Sector 34",line:"Blue Line"},
  {name:"Noida Sector 52",line:"Blue Line"},
  {name:"Noida Sector 59",line:"Blue Line"},
  {name:"Noida Sector 61",line:"Blue Line"},
  {name:"Noida Sector 62",line:"Blue Line"},
  {name:"Okhla Bird Sanctuary",line:"Magenta Line"},
  {name:"Okhla NSIC",line:"Magenta Line"},
  {name:"Okhla Vihar",line:"Magenta Line"},
  {name:"Old Faridabad",line:"Violet Line"},
  {name:"Palam",line:"Magenta Line"},
  {name:"Panchsheel Park",line:"Magenta Line"},
  {name:"Pandit Shree Ram Sharma",line:"Green Line"},
  {name:"Paschim Vihar East",line:"Green Line"},
  {name:"Paschim Vihar West",line:"Green Line"},
  {name:"Patel Chowk",line:"Yellow Line"},
  {name:"Patel Nagar",line:"Blue Line"},
  {name:"Peeragarhi",line:"Green Line"},
  {name:"Pratap Nagar",line:"Red Line"},
  {name:"Preet Vihar",line:"Blue Line"},
  {name:"Pul Bangash",line:"Red Line"},
  {name:"Punjabi Bagh",line:"Green Line"},
  {name:"Punjabi Bagh West",line:"Pink Line"},
  {name:"Qutab Minar",line:"Yellow Line"},
  {name:"R. K. Puram",line:"Magenta Line"},
  {name:"Raja Nahar Singh (Ballabhgarh)",line:"Violet Line"},
  {name:"Raj Bagh",line:"Red Line"},
  {name:"Rajdhani Park",line:"Green Line"},
  {name:"Rajendra Place",line:"Blue Line"},
  {name:"Rajiv Chowk",line:"Yellow Line"},
  {name:"Rajouri Garden",line:"Blue Line"},
  {name:"Ramakrishna Ashram Marg",line:"Blue Line"},
  {name:"Ramesh Nagar",line:"Blue Line"},
  {name:"Rithala",line:"Red Line"},
  {name:"Rohini East",line:"Red Line"},
  {name:"Rohini Sector 18, 19",line:"Yellow Line"},
  {name:"Rohini West",line:"Red Line"},
  {name:"Sadar Bazaar Cantonment",line:"Magenta Line"},
  {name:"Saket",line:"Yellow Line"},
  {name:"Samaypur Badli",line:"Yellow Line"},
  {name:"Sant Surdas (Sihi)",line:"Violet Line"},
  {name:"Sarai",line:"Violet Line"},
  {name:"Sarai Kale Khan - Nizamuddin",line:"Pink Line"},
  {name:"Sarita Vihar",line:"Violet Line"},
  {name:"Sarojini Nagar",line:"Pink Line"},
  {name:"Satguru Ram Singh Marg",line:"Green Line"},
  {name:"Sector 28",line:"Violet Line"},
  {name:"Seelampur",line:"Red Line"},
  {name:"Seva Teerth",line:"Yellow Line"},
  {name:"Shadipur",line:"Blue Line"},
  {name:"Shahdara",line:"Red Line"},
  {name:"Shaheed Nagar",line:"Red Line"},
  {name:"Shaheed Sthal (New Bus Adda)",line:"Red Line"},
  {name:"Shakurpur",line:"Pink Line"},
  {name:"Shalimar Bagh",line:"Pink Line"},
  {name:"Shankar Vihar",line:"Magenta Line"},
  {name:"Shastri Nagar",line:"Red Line"},
  {name:"Shastri Park",line:"Red Line"},
  {name:"Shiv Vihar",line:"Pink Line"},
  {name:"Shivaji Park",line:"Green Line"},
  {name:"Shivaji Stadium",line:"Airport Express"},
  {name:"Shree Ram Mandir Mayur Vihar",line:"Pink Line"},
  {name:"Shyam Park",line:"Red Line"},
  {name:"Sikanderpur",line:"Yellow Line"},
  {name:"Sir M. Vishweshwaraiah Moti Bagh",line:"Pink Line"},
  {name:"South Extension",line:"Pink Line"},
  {name:"Subhash Nagar",line:"Blue Line"},
  {name:"Sukhdev Vihar",line:"Magenta Line"},
  {name:"Sultanpur",line:"Yellow Line"},
  {name:"Supreme Court",line:"Blue Line"},
  {name:"Tagore Garden",line:"Blue Line"},
  {name:"Terminal 1-IGI Airport",line:"Magenta Line"},
  {name:"Tikri Border",line:"Green Line"},
  {name:"Tikri Kalan",line:"Green Line"},
  {name:"Tilak Nagar",line:"Blue Line"},
  {name:"Tis Hazari",line:"Red Line"},
  {name:"Trilokpuri Sanjay Lake",line:"Pink Line"},
  {name:"Tughlakabad Station",line:"Violet Line"},
  {name:"Udyog Nagar",line:"Green Line"},
  {name:"Uttam Nagar East",line:"Blue Line"},
  {name:"Uttam Nagar West",line:"Blue Line"},
  {name:"Vaishali",line:"Blue Line"},
  {name:"Vasant Vihar",line:"Magenta Line"},
  {name:"Vidhan Sabha",line:"Yellow Line"},
  {name:"Vinobapuri",line:"Pink Line"},
  {name:"Vishwavidyalaya",line:"Yellow Line"},
  {name:"Welcome",line:"Red Line"},
  {name:"Yamuna Bank",line:"Blue Line"},
  {name:"Yashobhoomi Dwarka Sector - 25",line:"Airport Express"},
];

const POPULAR = [
  {from:"Kashmere Gate", to:"Rajiv Chowk"},
  {from:"New Delhi", to:"Hauz Khas"},
  {from:"Dwarka Sector 21", to:"Noida City Centre"},
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

function handleOverlayClick(e) {
  if (e.target === document.getElementById('route-popup')) closePopup();
}

// Convert station name to URL slug e.g. "Kashmere Gate" → "kashmere-gate"
function toSlug(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function findRoute() {
  const from = document.getElementById('from-input').value.trim();
  const to   = document.getElementById('to-input').value.trim();
  if (!from || !to) return;

  // Show popup in loading state
  showPopup({ loading: true, from, to });

  const fromSlug = toSlug(from);
  const toSlug2  = toSlug(to);

  try {
    const res  = await fetch(`${WORKER_URL}/?from=${fromSlug}&to=${toSlug2}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    showPopup({ loading: false, from, to, data });
  } catch (e) {
    showPopup({ loading: false, from, to, error: true });
  }
}

function showPopup({ loading, from, to, data, error }) {
  const popup = document.getElementById('route-popup');
  const box   = popup.querySelector('.popup-box');

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(from + ' to ' + to + ' Delhi Metro route')}`;
  const mapsUrl   = `https://www.google.com/maps/dir/${encodeURIComponent(from + ' metro station delhi')}/${encodeURIComponent(to + ' metro station delhi')}/?travelmode=transit`;

  if (loading) {
    box.innerHTML = `
      <button class="popup-close" onclick="closePopup()">✕</button>
      <div class="popup-title">FINDING ROUTE</div>
      <div class="popup-route"><strong>${from}</strong><br>↓<br><strong>${to}</strong></div>
      <div class="popup-loading">
        <div class="loading-spinner"></div>
        <p>Fetching live data...</p>
      </div>`;
    popup.classList.add('open');
    return;
  }

  if (error) {
    box.innerHTML = `
      <button class="popup-close" onclick="closePopup()">✕</button>
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
      // Segment header card
      routeMapHtml += `
        <div class="seg-card" style="border-left:3px solid ${color}">
          <div class="seg-line" style="color:${color}">${seg.line}</div>
          <div class="seg-towards">Towards ${seg.towards}</div>
          <div class="seg-platform">Platform ${seg.platform}</div>
        </div>
        <div class="seg-stations">`;

      seg.stations.forEach((station, i) => {
        const isFirst = i === 0;
        const isLast  = i === seg.stations.length - 1;
        routeMapHtml += `
          <div class="route-stop ${isFirst ? 'stop-first' : ''} ${isLast ? 'stop-last' : ''}">
            <div class="stop-line-wrap">
              <div class="stop-line top" style="background:${color}"></div>
              <div class="stop-circle" style="background:${color};border-color:${color}"></div>
              <div class="stop-line bottom" style="background:${color}"></div>
            </div>
            <div class="stop-label">${station}</div>
          </div>`;
      });

      routeMapHtml += `</div>`;

      // Interchange badge between segments
      if (seg.hasInterchangeAtEnd && si < data.segments.length - 1) {
        const nextColor = data.segments[si + 1].color || '#aaa';
        const interchangeStation = seg.stations[seg.stations.length - 1];
        routeMapHtml += `
          <div class="interchange-badge">
            <div class="interchange-icon">🔄</div>
            <div class="interchange-text">
              <strong>Change Train</strong>
              <span>at ${interchangeStation}</span>
            </div>
            <div class="interchange-arrow" style="color:${nextColor}">→ ${data.segments[si+1].line}</div>
          </div>`;
      }
    });
  }

  box.innerHTML = `
    <button class="popup-close" onclick="closePopup()">✕</button>
    <div class="popup-title">YOUR ROUTE</div>
    <div class="popup-route"><strong>${from}</strong><span class="route-arrow">↓</span><strong>${to}</strong></div>

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

  popup.classList.add('open');


function closePopup() {
  document.getElementById('route-popup').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const btn = document.getElementById('find-btn');
    if (!btn.disabled) findRoute();
  }
});
