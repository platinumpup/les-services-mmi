/* Pull-out calibrated ruler widget */

(function () {
  const STORAGE_KEY = "mmiRulerPxPerMm";
  const DEFAULT_PX_PER_MM = 96 / 25.4; // browser CSS default, must be calibrated for real accuracy
  const CREDIT_CARD_MM = 85.6;

  let pxPerMm = Number(localStorage.getItem(STORAGE_KEY)) || DEFAULT_PX_PER_MM;

  function createWidget() {
    if (document.querySelector(".ruler-dock")) return;
    const dock = document.createElement("aside");
    dock.className = "ruler-dock";
    dock.innerHTML = `
      <button class="ruler-tab" type="button" aria-expanded="false">Ruler</button>

      <section class="ruler-panel" aria-label="Calibrated ruler panel">
        <div class="ruler-header">
          <div>
            <strong>Pull-out ruler</strong>
            <span>Calibrate once, then use the side ruler for more accurate on-screen measuring.</span>
          </div>
          <button class="ruler-close" type="button" aria-label="Close ruler">×</button>
        </div>

        <div class="ruler-controls">
          <div class="ruler-control-row">
            <label for="rulerScale">Calibration scale</label>
            <input id="rulerScale" type="range" min="2.5" max="8" step="0.01" />
            <div class="ruler-readout"></div>
          </div>

          <div class="ruler-actions">
            <button type="button" data-ruler-reset>Reset</button>
            <button type="button" data-ruler-plus>+ Larger</button>
            <button type="button" data-ruler-minus>− Smaller</button>
          </div>
        </div>

        <div class="ruler-body">
          <div class="ruler-vertical-wrap">
            <div class="ruler-vertical"></div>
          </div>

          <div class="ruler-guide">
            <div class="ruler-card">
              <p class="ruler-card-title">Calibration</p>
              <p><strong>For real accuracy:</strong> place a credit/debit card on the dashed box below and adjust the slider until the box matches the card width.</p>
              <div class="ruler-credit-card">85.6 mm</div>
              <p class="ruler-note">Screens do not report true physical size consistently. Calibration is required for accurate real-world measurement.</p>
            </div>

            <div class="ruler-card">
              <p class="ruler-card-title">Use</p>
              <p>Use the left ruler like a physical ruler. The marks are millimetres, with longer marks at 5 mm and centimetres.</p>
            </div>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(dock);

    const tab = dock.querySelector(".ruler-tab");
    const close = dock.querySelector(".ruler-close");
    const range = dock.querySelector("#rulerScale");
    const readout = dock.querySelector(".ruler-readout");
    const ruler = dock.querySelector(".ruler-vertical");
    const card = dock.querySelector(".ruler-credit-card");

    function renderRuler() {
      const maxMm = 300; // 30 cm
      const height = Math.round(maxMm * pxPerMm);
      ruler.style.height = `${height}px`;
      ruler.innerHTML = "";

      for (let mm = 0; mm <= maxMm; mm++) {
        const tick = document.createElement("div");
        const top = Math.round(mm * pxPerMm);

        tick.className = "ruler-tick mm";
        if (mm % 10 === 0) tick.className = "ruler-tick cm";
        else if (mm % 5 === 0) tick.className = "ruler-tick half";

        tick.style.top = `${top}px`;
        ruler.appendChild(tick);

        if (mm % 10 === 0) {
          const num = document.createElement("div");
          num.className = "ruler-number";
          num.style.top = `${top}px`;
          num.textContent = String(mm / 10);
          ruler.appendChild(num);
        }
      }

      card.style.setProperty("--credit-card-width", `${CREDIT_CARD_MM * pxPerMm}px`);
      readout.textContent = `${pxPerMm.toFixed(2)} px/mm`;
      range.value = String(pxPerMm);
      localStorage.setItem(STORAGE_KEY, String(pxPerMm));
    }

    function toggle(open) {
      const next = typeof open === "boolean" ? open : !dock.classList.contains("open");
      dock.classList.toggle("open", next);
      tab.setAttribute("aria-expanded", String(next));
    }

    tab.addEventListener("click", () => toggle());
    close.addEventListener("click", () => toggle(false));

    range.addEventListener("input", () => {
      pxPerMm = Number(range.value);
      renderRuler();
    });

    dock.querySelector("[data-ruler-reset]").addEventListener("click", () => {
      pxPerMm = DEFAULT_PX_PER_MM;
      renderRuler();
    });

    dock.querySelector("[data-ruler-plus]").addEventListener("click", () => {
      pxPerMm = Math.min(8, pxPerMm + 0.05);
      renderRuler();
    });

    dock.querySelector("[data-ruler-minus]").addEventListener("click", () => {
      pxPerMm = Math.max(2.5, pxPerMm - 0.05);
      renderRuler();
    });

    renderRuler();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
