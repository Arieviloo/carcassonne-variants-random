/* ===== Navegação por abas ===== */
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

/* ===== Menu hambúrguer ===== */
const hamburger = document.getElementById("hamburger");
const tabsNav = document.getElementById("tabs");

hamburger.addEventListener("click", () => {
  const open = tabsNav.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabsNav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ===== Renderizar lista de variações ===== */
const variantsList = document.getElementById("variants-list");

variantsList.innerHTML = VARIANTS.map((v, i) => `
  <details class="variant" id="variant-${v.id}">
    <summary>
      <span class="chevron">▸</span>
      <span class="v-name">${i + 1}. ${v.name}</span>
      <span class="v-author">${v.author}</span>
    </summary>
    <div class="v-body">
      <ol>
        ${v.rules.map((r) => `<li>${r}</li>`).join("")}
      </ol>
      ${v.note ? `<div class="note">${v.note}</div>` : ""}
    </div>
  </details>
`).join("");

/* ===== Persistência (localStorage) ===== */
const STORAGE_KEY = "carcassonne-state";

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      players,
      calcInputs,
      included: [...included],
      qty,
      lastDraw: lastDraw.map((v) => v.id),
    }));
  } catch (_) { /* storage indisponível */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
}
const savedState = loadState();

/* ===== Sorteio ===== */
const included = new Set(VARIANTS.map((v) => v.id));

const qtyOutput = document.getElementById("qty");
const qtyMinus = document.getElementById("qty-minus");
const qtyPlus = document.getElementById("qty-plus");
const drawBtn = document.getElementById("draw-btn");
const rollStage = document.getElementById("roll-stage");
const rollCards = document.getElementById("roll-cards");
const drawError = document.getElementById("draw-error");
const filterList = document.getElementById("filter-list");
const filterCount = document.getElementById("filter-count");
const redrawBtn = document.getElementById("redraw-btn");

let qty = savedState?.qty ?? 3;
let lastDraw = [];

function updateQty() {
  qtyOutput.textContent = qty;
  qtyMinus.disabled = qty <= 1;
  qtyPlus.disabled = qty >= included.size;
}

qtyMinus.addEventListener("click", () => { qty = Math.max(1, qty - 1); updateQty(); saveState(); });
qtyPlus.addEventListener("click", () => { qty = Math.min(included.size, qty + 1); updateQty(); saveState(); });

/* Filtros */
filterList.innerHTML = VARIANTS.map((v) => {
  const defaultOff = v.id === "prisioneiro" || v.id === "todos-devem";
  if (defaultOff) included.delete(v.id);
  return `
  <label>
    <input type="checkbox" ${defaultOff ? "" : "checked"} data-id="${v.id}" />
    <span>${v.name}</span>
  </label>
`.trim();
}).join("");
filterCount.textContent = included.size;

/* Restaura filtros salvos */
if (savedState?.included) {
  included.clear();
  filterList.querySelectorAll("input").forEach((i) => {
    const on = savedState.included.includes(i.dataset.id);
    i.checked = on;
    if (on) included.add(i.dataset.id);
  });
  filterCount.textContent = included.size;
}
updateQty();

filterList.addEventListener("change", (e) => {
  const id = e.target.dataset.id;
  if (e.target.checked) included.add(id);
  else included.delete(id);
  filterCount.textContent = included.size;
  qty = Math.min(qty, Math.max(included.size, 1));
  updateQty();
  saveState();
});

document.getElementById("filter-all").addEventListener("click", () => {
  VARIANTS.forEach((v) => {
    included.add(v.id);
    filterList.querySelector(`input[data-id="${v.id}"]`).checked = true;
  });
  filterCount.textContent = included.size;
  updateQty();
  saveState();
});

document.getElementById("filter-none").addEventListener("click", () => {
  included.clear();
  filterList.querySelectorAll("input").forEach((i) => (i.checked = false));
  filterCount.textContent = 0;
  updateQty();
  saveState();
});

/* Sorteio sem repetição (Fisher-Yates) */
function draw(pool, n) {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

function renderResults(picked) {
  rollCards.innerHTML = picked.map((v, i) => `
    <div class="roll-card" style="animation-delay:${i * 0.12}s">
      <span class="rank">#${i + 1}</span>
      <h3>${v.name}</h3>
      <span class="v-author">por ${v.author}</span>
      <details open>
        <summary>Regras</summary>
        <ol>${v.rules.map((r) => `<li>${r}</li>`).join("")}</ol>
        ${v.note ? `<div class="note">${v.note}</div>` : ""}
      </details>
    </div>
  `).join("");
}

function runDraw() {
  drawError.classList.add("hidden");

  if (included.size === 0) {
    drawError.textContent = "Selecione ao menos uma variação para sortear!";
    drawError.classList.remove("hidden");
    return;
  }

  const n = Math.min(qty, included.size);
  if (n < qty) {
    drawError.textContent = `Você selecionou ${qty}, mas só há ${included.size} variações ativas — sorteando ${n}.`;
    drawError.classList.remove("hidden");
  }

  const picked = draw(VARIANTS.filter((v) => included.has(v.id)), n);
  lastDraw = picked;
  saveState();

  // Animação de "embaralhar" antes de revelar
  rollStage.classList.remove("hidden");
  rollCards.innerHTML = picked
    .map(() => `<div class="roll-card"><h3>🎲 &nbsp;🎲 &nbsp;🎲</h3></div>`)
    .join("");
  rollStage.classList.add("rolling");
  drawBtn.disabled = true;

  setTimeout(() => {
    rollStage.classList.remove("rolling");
    renderResults(picked);
    drawBtn.disabled = false;
    rollStage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 900);
}

/* Restaura o último sorteio salvo (sem animação) */
if (savedState?.lastDraw?.length) {
  const picked = savedState.lastDraw.map((id) => VARIANTS.find((v) => v.id === id)).filter(Boolean);
  if (picked.length) {
    lastDraw = picked;
    rollStage.classList.remove("hidden");
    renderResults(picked);
  }
}

drawBtn.addEventListener("click", runDraw);
redrawBtn.addEventListener("click", runDraw);

updateQty();

/* ===== Pontuação ===== */
const PLAYER_COLORS = ["#b4472f", "#2e5f8a", "#5a7d3a", "#d1a21f", "#3c2f1e"];
const DEFAULT_NAMES = ["Vermelho", "Azul", "Verde", "Amarelo", "Preto"];
const COLOR_NAMES = ["Vermelho", "Azul", "Verde", "Amarelo", "Preto"];

let players = [
  { name: DEFAULT_NAMES[0], score: 0, color: PLAYER_COLORS[0] },
  { name: DEFAULT_NAMES[1], score: 0, color: PLAYER_COLORS[1] }
];
let calcInputs = players.map(() => ({ plates: 0, shields: 0, roads: 0, monastery: 0, fields: 0 }));

/* Restaura jogadores e contagem salvos */
if (savedState?.players?.length) {
  players = savedState.players;
  calcInputs = players.map((_, i) => savedState.calcInputs?.[i] ?? { plates: 0, shields: 0, roads: 0, monastery: 0, fields: 0 });
}

const playersList = document.getElementById("players-list");
const calcList = document.getElementById("calc-list");
const playerPlus = document.getElementById("player-plus");
const playerMinus = document.getElementById("player-minus");

function renderPlayers() {
  playersList.innerHTML = players.map((p, i) => {
    const color = p.color ?? PLAYER_COLORS[i];
    return `
    <div class="player-row" style="--player-color:${color}" data-idx="${i}">
      <button type="button" class="player-dot-btn" data-color="${i}" title="Trocar cor" aria-label="Trocar cor do jogador ${i + 1}">
        <svg class="meeple" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="${color}" d="M12 2c-1.7 0-3 .9-3.5 2.3-.5 1.3-.2 2.7.6 3.7C7 9 5 10.6 5 13c0 1.6 1 2.9 2.4 3.6-.9.7-1.4 1.8-1.4 3 0 .8.2 1.6.7 2.4h10.6c.5-.8.7-1.6.7-2.4 0-1.2-.5-2.3-1.4-3C18 15.9 19 14.6 19 13c0-2.4-2-4-4.1-5 .8-1 1.1-2.4.6-3.7C15 2.9 13.7 2 12 2z"/>
        </svg>
      </button>
      <input type="text" value="${p.name}" data-idx="${i}" maxlength="14" aria-label="Nome do jogador ${i + 1}" />
      <div class="stepper mini player-score">
        <button type="button" data-score="-1" data-idx="${i}" aria-label="Diminuir pontos">−</button>
        <output id="score-${i}" class="score-value" title="Clique para adicionar pontos">${p.score}</output>
        <button type="button" data-score="1" data-idx="${i}" aria-label="Aumentar pontos">+</button>
      </div>
    </div>
  `;
  }).join("");
}

function calcSubtotal(c) {
  const cities = c.plates + c.shields; // metade: 1/placa + 1/escudo
  const roads = Math.floor(c.roads / 2); // metade: 1 a cada 2 placas
  const monastery = c.monastery; // 1 por espaço preenchido + a própria placa
  const fields = c.fields * 3;
  return cities + roads + monastery + fields;
}



function renderCalc() {
  calcList.innerHTML = players.map((p, i) => {
    const c = calcInputs[i];
    const sub = calcSubtotal(c);
    const color = p.color ?? PLAYER_COLORS[i];
    return `
    <div class="calc-row" style="--player-color:${color}">
      <div class="calc-name">
        <svg class="meeple" viewBox="0 0 24 24" aria-hidden="true"><path fill="${color}" d="M12 2c-1.7 0-3 .9-3.5 2.3-.5 1.3-.2 2.7.6 3.7C7 9 5 10.6 5 13c0 1.6 1 2.9 2.4 3.6-.9.7-1.4 1.8-1.4 3 0 .8.2 1.6.7 2.4h10.6c.5-.8.7-1.6.7-2.4 0-1.2-.5-2.3-1.4-3C18 15.9 19 14.6 19 13c0-2.4-2-4-4.1-5 .8-1 1.1-2.4.6-3.7C15 2.9 13.7 2 12 2z"/></svg>${p.name}
      </div>
      <div class="calc-fields">
        <div class="calc-field">
          <label>Placas de estrada incompleta</label>
          <input type="number" min="0" value="${c.roads}" data-idx="${i}" data-field="roads" />
        </div>
        <div class="calc-field">
          <label>Placas de cidade incompleta</label>
          <input type="number" min="0" value="${c.plates}" data-idx="${i}" data-field="plates" />
        </div>
        <div class="calc-field">
          <label>Escudos nas cidades incompletas</label>
          <input type="number" min="0" value="${c.shields}" data-idx="${i}" data-field="shields" />
        </div>
        <div class="calc-field">
          <label>Espaços preenchidos + monastério</label>
          <input type="number" min="0" max="9" value="${c.monastery}" data-idx="${i}" data-field="monastery" />
        </div>
        <div class="calc-field">
          <label>Cidades completas no campo</label>
          <input type="number" min="0" value="${c.fields}" data-idx="${i}" data-field="fields" />
        </div>
      </div>
      <div class="calc-footer">
        <span class="calc-subtotal">Subtotal: <output id="subtotal-${i}">${sub}</output></span>
        <div class="calc-footer-btns">
          <button class="btn small ghost" type="button" data-clear="${i}">Limpar</button>
          <button class="btn small primary" type="button" data-add="${i}">Somar ao placar</button>
        </div>
      </div>
    </div>
  `;
  }).join("");
}

playersList.addEventListener("input", (e) => {
  const idx = e.target.dataset.idx;
  if (idx !== undefined) {
    players[idx].name = e.target.value || `Jogador ${Number(idx) + 1}`;
    renderCalc();
    saveState();
  }
});

playersList.addEventListener("click", (e) => {
  const dot = e.target.closest(".player-dot-btn");
  if (dot) {
    const idx = Number(dot.dataset.color);
    const current = players[idx].color ?? PLAYER_COLORS[idx];
    // Apenas as cores ainda não usadas por outros jogadores estão disponíveis
    const taken = players.filter((_, i) => i !== idx).map((p) => p.color ?? PLAYER_COLORS[players.indexOf(p)]);
    const startIdx = (PLAYER_COLORS.indexOf(current) + 1) % PLAYER_COLORS.length;
    let nextIdx = -1;
    for (let k = 0; k < PLAYER_COLORS.length; k++) {
      const cand = (startIdx + k) % PLAYER_COLORS.length;
      if (!taken.includes(PLAYER_COLORS[cand])) { nextIdx = cand; break; }
    }
    if (nextIdx === -1) return; // todas as 5 cores já ocupadas
    players[idx].color = PLAYER_COLORS[nextIdx];
    // Só troca o nome se ele ainda for um nome padrão de cor (preserva nomes customizados)
    if (DEFAULT_NAMES.includes(players[idx].name)) {
      players[idx].name = COLOR_NAMES[nextIdx];
    }
    renderPlayers();
    renderCalc();
    saveState();
    return;
  }
  const btn = e.target.closest("button[data-score]");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  players[idx].score += Number(btn.dataset.score);
  document.getElementById(`score-${idx}`).textContent = players[idx].score;
  saveState();
});

/* ===== Modal de adicionar pontos (clique no card do placar) ===== */
const scoreModal = document.getElementById("add-score-modal");
const scoreForm = document.getElementById("add-score-form");
const scoreInput = document.getElementById("add-score-input");
const scoreSub = document.getElementById("add-score-sub");
let modalIdx = null;

playersList.addEventListener("click", (e) => {
  if (e.target.closest("button")) return; // botões (+/−, cor) têm comportamento próprio
  const value = e.target.closest(".score-value");
  if (!value) return;
  const row = value.closest(".player-row");
  if (!row) return;
  modalIdx = Number(row.dataset.idx);
  const color = players[modalIdx].color ?? PLAYER_COLORS[modalIdx];
  scoreModal.style.setProperty("--player-color", color);
  scoreModal.querySelector("h3").textContent = `Pontos para ${players[modalIdx].name}`;
  scoreSub.textContent = `Pontuação atual: ${players[modalIdx].score}`;
  scoreInput.value = "";
  scoreModal.showModal();
  scoreInput.focus();
});

scoreForm.addEventListener("submit", (e) => {
  if (e.submitter?.value !== "confirm" || modalIdx === null) return;
  const val = Number(scoreInput.value);
  if (!isNaN(val)) {
    players[modalIdx].score += val;
    document.getElementById(`score-${modalIdx}`).textContent = players[modalIdx].score;
    saveState();
  }
  modalIdx = null;
});

calcList.addEventListener("input", (e) => {
  const idx = e.target.dataset.idx;
  const field = e.target.dataset.field;
  if (idx !== undefined && field) {
    let v = parseInt(e.target.value, 10);
    if (isNaN(v) || v < 0) v = 0;
    if (field === "monastery" && v > 9) v = 9;
    calcInputs[idx][field] = v;
    document.getElementById(`subtotal-${idx}`).textContent = calcSubtotal(calcInputs[idx]);
    saveState();
  }
});

calcList.addEventListener("click", (e) => {
  const clearBtn = e.target.closest("button[data-clear]");
  if (clearBtn) {
    const idx = Number(clearBtn.dataset.clear);
    calcInputs[idx] = { plates: 0, shields: 0, roads: 0, monastery: 0, fields: 0 };
    renderCalc();
    return;
  }
  const btn = e.target.closest("button[data-add]");
  if (!btn) return;
  const idx = Number(btn.dataset.add);
  players[idx].score += calcSubtotal(calcInputs[idx]);
  document.getElementById(`score-${idx}`).textContent = players[idx].score;
  saveState();
  renderCalc();
});

document.getElementById("clear-all").addEventListener("click", () => {
  calcInputs = players.map(() => ({ plates: 0, shields: 0, roads: 0, monastery: 0, fields: 0 }));
  players.forEach((p) => (p.score = 0));
  renderPlayers();
  renderCalc();
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  saveState();
});

function updatePlayerButtons() {
  playerPlus.disabled = players.length >= 5;
  playerMinus.disabled = players.length <= 2;
}

playerPlus.addEventListener("click", () => {
  if (players.length >= 5) return;
  players.push({ name: DEFAULT_NAMES[players.length], score: 0, color: PLAYER_COLORS[players.length] });
  calcInputs.push({ plates: 0, shields: 0, roads: 0, monastery: 0, fields: 0 });
  renderPlayers();
  renderCalc();
  updatePlayerButtons();
  saveState();
});

playerMinus.addEventListener("click", () => {
  if (players.length <= 2) return;
  players.pop();
  calcInputs.pop();
  renderPlayers();
  renderCalc();
  updatePlayerButtons();
  saveState();
});

renderPlayers();
renderCalc();
updatePlayerButtons();
