/* Pull-out calibrated ruler widget */

(function () {
  const STORAGE_KEY = "mmiRulerPxPerMm";
  const DEFAULT_PX_PER_MM = 96 / 25.4; // browser CSS default, must be calibrated for real accuracy
  const CREDIT_CARD_MM = 85.6;
  const PRINT_MAX_MM = 150; // 15 cm printable ruler; fits common home printers with margins

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
            <button type="button" data-ruler-print>Print ruler</button>
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

            <div class="ruler-card">
              <p class="ruler-card-title">Print</p>
              <p>Print a paper ruler at <strong>100% / Actual size</strong>. Do not use Fit to page. Check the printed card box against a real card.</p>
            </div>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(dock);

    const printSheet = document.createElement("section");
    printSheet.className = "ruler-print-sheet";
    printSheet.setAttribute("aria-hidden", "true");
    printSheet.innerHTML = `
      <div class="ruler-print-header">
        <h1>Printable ruler</h1>
        <p>Print at <strong>100% / Actual size</strong>. Turn off Fit to page or Shrink to fit. After printing, check the dashed card box against a real credit/debit card.</p>
      </div>

      <div class="ruler-print-check">
        <div class="ruler-print-card">85.6 mm card check</div>
        <p>If this dashed box matches your card width, the printed ruler is accurate.</p>
      </div>

      <div class="ruler-print-rulers">
        <div>
          <p class="ruler-print-label">Horizontal ruler — 15 cm</p>
          <div class="ruler-print-horizontal" aria-label="Printable horizontal ruler"></div>
        </div>

        <div>
          <p class="ruler-print-label">Vertical ruler — 15 cm</p>
          <div class="ruler-print-vertical" aria-label="Printable vertical ruler"></div>
        </div>
      </div>
    `;
    document.body.appendChild(printSheet);

    const tab = dock.querySelector(".ruler-tab");
    const close = dock.querySelector(".ruler-close");
    const range = dock.querySelector("#rulerScale");
    const readout = dock.querySelector(".ruler-readout");
    const ruler = dock.querySelector(".ruler-vertical");
    const card = dock.querySelector(".ruler-credit-card");
    const printHorizontal = printSheet.querySelector(".ruler-print-horizontal");
    const printVertical = printSheet.querySelector(".ruler-print-vertical");

    function renderPrintRulers() {
      printHorizontal.innerHTML = "";
      printVertical.innerHTML = "";

      for (let mm = 0; mm <= PRINT_MAX_MM; mm++) {
        const horizontalTick = document.createElement("div");
        horizontalTick.className = "ruler-print-tick-h mm";
        if (mm % 10 === 0) horizontalTick.className = "ruler-print-tick-h cm";
        else if (mm % 5 === 0) horizontalTick.className = "ruler-print-tick-h half";
        horizontalTick.style.left = `${mm}mm`;
        printHorizontal.appendChild(horizontalTick);

        const verticalTick = document.createElement("div");
        verticalTick.className = "ruler-print-tick-v mm";
        if (mm % 10 === 0) verticalTick.className = "ruler-print-tick-v cm";
        else if (mm % 5 === 0) verticalTick.className = "ruler-print-tick-v half";
        verticalTick.style.top = `${mm}mm`;
        printVertical.appendChild(verticalTick);

        if (mm % 10 === 0) {
          const horizontalNumber = document.createElement("div");
          horizontalNumber.className = "ruler-print-number-h";
          horizontalNumber.style.left = `${mm}mm`;
          horizontalNumber.textContent = String(mm / 10);
          printHorizontal.appendChild(horizontalNumber);

          const verticalNumber = document.createElement("div");
          verticalNumber.className = "ruler-print-number-v";
          verticalNumber.style.top = `${mm}mm`;
          verticalNumber.textContent = String(mm / 10);
          printVertical.appendChild(verticalNumber);
        }
      }
    }

    function printPaperRuler() {
      renderPrintRulers();
      window.print();
    }

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

    dock.querySelector("[data-ruler-print]").addEventListener("click", printPaperRuler);

    renderRuler();
    renderPrintRulers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
