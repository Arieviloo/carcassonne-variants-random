/* ===== Navegação por abas ===== */
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
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

let qty = 3;

function updateQty() {
  qtyOutput.textContent = qty;
  qtyMinus.disabled = qty <= 1;
  qtyPlus.disabled = qty >= included.size;
}

qtyMinus.addEventListener("click", () => { qty = Math.max(1, qty - 1); updateQty(); });
qtyPlus.addEventListener("click", () => { qty = Math.min(included.size, qty + 1); updateQty(); });

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
updateQty();

filterList.addEventListener("change", (e) => {
  const id = e.target.dataset.id;
  if (e.target.checked) included.add(id);
  else included.delete(id);
  filterCount.textContent = included.size;
  qty = Math.min(qty, Math.max(included.size, 1));
  updateQty();
});

document.getElementById("filter-all").addEventListener("click", () => {
  VARIANTS.forEach((v) => {
    included.add(v.id);
    filterList.querySelector(`input[data-id="${v.id}"]`).checked = true;
  });
  filterCount.textContent = included.size;
  updateQty();
});

document.getElementById("filter-none").addEventListener("click", () => {
  included.clear();
  filterList.querySelectorAll("input").forEach((i) => (i.checked = false));
  filterCount.textContent = 0;
  updateQty();
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

drawBtn.addEventListener("click", runDraw);
redrawBtn.addEventListener("click", runDraw);

updateQty();
