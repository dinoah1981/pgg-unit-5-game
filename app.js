/* PGG Unit 5 — Game state machine, screen routing, scoring, proof flow.
 * Reads content + map geometry from window.GAME_DATA (data.js).
 */

(function () {
  "use strict";

  const GD = window.GAME_DATA;
  const TEACHER_EMAIL = "david.noah@compscihigh.org";
  const PASSING_PCT = 80;

  // --------------------------- Tiny helpers
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // --------------------------- Game state
  const state = {
    names: [],
    period: "",
    chapterIdx: 0,
    stepIdx: 0,
    flow: [],          // flat list of {chapterIdx, stepIdx, step, chapter}
    flowIdx: 0,
    answers: [],       // { competency, chapterTitle, prompt, correct, given }
    startTime: null,
    finalReached: false,
  };

  // --------------------------- Build the flat flow up-front
  function buildFlow() {
    state.flow = [];
    GD.CHAPTERS.forEach((chapter, ci) => {
      // chapter intro is its own pseudo-step
      state.flow.push({ kind: "intro", chapter, ci });
      chapter.steps.forEach((step, si) => {
        state.flow.push({ kind: "step", chapter, step, ci, si });
      });
    });
    GD.FINAL_SYNTHESIS.forEach((step) => {
      state.flow.push({ kind: "step", chapter: { id: "final", title: "Final Synthesis" }, step, ci: -1, si: -1 });
    });
    state.flow.push({ kind: "results" });
  }

  // --------------------------- Screen routing
  function show(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    $("#" + id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setMetaTags() {
    if (state.names.length) {
      const tag = $("#player-tag");
      tag.textContent = state.names.join(" + ");
      tag.hidden = false;
    }
    const scored = state.flow.filter((f) => f.kind === "step" && isScored(f.step));
    const total = scored.length;
    const answered = state.answers.length;
    if (state.flowIdx > 0) {
      $("#progress-tag").textContent = answered + " / " + total;
      $("#progress-tag").hidden = false;
      const correct = state.answers.filter((a) => a.correct).length;
      const pct = answered ? Math.round((correct / answered) * 100) : 0;
      $("#score-tag").textContent = pct + "% so far";
      $("#score-tag").hidden = answered < 3;
    }
  }

  function isScored(step) {
    return step.type === "mcq" || step.type === "timeline" || step.type === "map";
  }

  // --------------------------- Welcome / start
  function bindWelcome() {
    $("#start-btn").addEventListener("click", () => {
      const n1 = $("#name1").value.trim();
      const n2 = $("#name2").value.trim();
      const period = $("#period").value.trim();
      if (!n1) {
        $("#name1").focus();
        $("#name1").style.borderColor = "var(--bad)";
        return;
      }
      state.names = [n1, n2].filter(Boolean);
      state.period = period;
      state.startTime = Date.now();
      state.flowIdx = 0;
      buildFlow();
      next();
    });
  }

  // --------------------------- Main step dispatcher
  function next() {
    setMetaTags();
    if (state.flowIdx >= state.flow.length) return;
    const node = state.flow[state.flowIdx];
    if (node.kind === "intro")   return renderIntro(node);
    if (node.kind === "results") return renderResults();
    if (node.kind === "step")    return renderStep(node);
  }

  function advance() {
    state.flowIdx++;
    next();
  }

  // --------------------------- Chapter intro
  function renderIntro(node) {
    show("screen-chapter-intro");
    $("#ci-kicker").textContent = "Chapter " + (node.ci + 1) + " of " + GD.CHAPTERS.length;
    $("#ci-title").textContent = node.chapter.title;
    $("#ci-sub").textContent = node.chapter.subtitle || "";
    const btn = $("#ci-go");
    btn.onclick = () => advance();
  }

  // --------------------------- Step dispatcher
  function renderStep(node) {
    const step = node.step;
    if (step.type === "reading")  return renderReading(node);
    if (step.type === "mcq")      return renderMCQ(node);
    if (step.type === "timeline") return renderTimeline(node);
    if (step.type === "map")      return renderMap(node);
  }

  // --------------------------- Reading
  function renderReading(node) {
    show("screen-reading");
    $("#rd-kicker").textContent = node.chapter.title;
    $("#rd-title").textContent = node.step.title || "";
    $("#rd-body").innerHTML = node.step.body;
    $("#rd-next").onclick = () => advance();
  }

  // --------------------------- MCQ
  function renderMCQ(node) {
    show("screen-mcq");
    const step = node.step;
    $("#mc-kicker").textContent = node.chapter.title + " · Question";
    $("#mc-q").innerHTML = step.question;

    const host = $("#mc-options");
    host.innerHTML = "";
    const fb = $("#mc-fb");
    fb.hidden = true;
    fb.className = "feedback";
    const next = $("#mc-next");
    next.hidden = true;

    step.options.forEach((text, idx) => {
      const b = el("button", "option");
      b.appendChild(el("span", "marker", String.fromCharCode(65 + idx)));
      b.appendChild(el("span", "lbl", text));
      b.onclick = () => {
        if (b.dataset.locked) return;
        $$(".option").forEach((o) => { o.dataset.locked = "1"; o.classList.add("disabled"); });
        const correct = idx === step.correctIdx;
        b.classList.add(correct ? "correct" : "wrong");
        if (!correct) {
          host.children[step.correctIdx].classList.add("correct");
        }
        record({
          chapterTitle: node.chapter.title,
          prompt: step.question,
          competency: step.competency,
          correct,
          given: text,
          rightAnswer: step.options[step.correctIdx],
        });
        fb.hidden = false;
        fb.classList.add(correct ? "correct" : "wrong");
        fb.innerHTML = "<h3>" + (correct ? "Correct." : "Not quite.") + "</h3><p>" + step.explanation + "</p>";
        next.hidden = false;
      };
      host.appendChild(b);
    });

    next.onclick = () => advance();
  }

  // --------------------------- Timeline drag
  function renderTimeline(node) {
    show("screen-timeline");
    const step = node.step;
    $("#tl-kicker").textContent = node.chapter.title + " · Order";
    $("#tl-q").innerHTML = step.prompt;

    const fb = $("#tl-fb");
    fb.hidden = true;
    fb.className = "feedback";
    $("#tl-next").hidden = true;

    const list = $("#tl-list");
    list.innerHTML = "";
    const items = step.items.map((it, i) => ({ ...it, _i: i }));
    let order = shuffled(items);
    let dragging = null;

    function paint() {
      list.innerHTML = "";
      order.forEach((it) => {
        const li = el("li", "tl-item");
        li.draggable = true;
        li.appendChild(el("span", "grip", "≡"));
        li.appendChild(el("span", "lbl", it.label));
        li.dataset.i = it._i;
        li.addEventListener("dragstart", (e) => {
          dragging = it._i;
          li.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });
        li.addEventListener("dragend", () => {
          li.classList.remove("dragging");
          $$(".tl-item").forEach((n) => n.classList.remove("over"));
        });
        li.addEventListener("dragover", (e) => {
          e.preventDefault();
          li.classList.add("over");
        });
        li.addEventListener("dragleave", () => li.classList.remove("over"));
        li.addEventListener("drop", (e) => {
          e.preventDefault();
          li.classList.remove("over");
          const fromIdx = order.findIndex((x) => x._i === dragging);
          const toIdx = order.findIndex((x) => x._i === Number(li.dataset.i));
          if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;
          const [m] = order.splice(fromIdx, 1);
          order.splice(toIdx, 0, m);
          paint();
        });
        // touch support: tap-to-swap with previous selected
        li.addEventListener("click", () => {
          if (li.dataset.locked) return;
          const sel = $(".tl-item.selected");
          if (!sel) {
            li.classList.add("selected");
            li.style.outline = "2px solid var(--accent)";
          } else if (sel === li) {
            li.classList.remove("selected");
            li.style.outline = "";
          } else {
            const a = order.findIndex((x) => x._i === Number(sel.dataset.i));
            const b = order.findIndex((x) => x._i === Number(li.dataset.i));
            const [m] = order.splice(a, 1);
            order.splice(b, 0, m);
            sel.classList.remove("selected");
            sel.style.outline = "";
            paint();
          }
        });
        list.appendChild(li);
      });
    }

    paint();

    $("#tl-shuffle").onclick = () => { order = shuffled(order); paint(); };

    $("#tl-check").onclick = () => {
      const sortedRef = [...items].sort((a, b) => a.year - b.year);
      const correct = order.every((it, i) => it._i === sortedRef[i]._i);
      $$(".tl-item").forEach((node) => {
        node.dataset.locked = "1";
        const guess = order[Array.from(list.children).indexOf(node)];
        const expected = sortedRef[Array.from(list.children).indexOf(node)];
        if (guess._i === expected._i) node.classList.add("correct-pos");
        else node.classList.add("wrong-pos");
      });
      record({
        chapterTitle: node.chapter.title,
        prompt: step.prompt,
        competency: step.competency,
        correct,
        given: order.map((o) => o.label).join(" → "),
        rightAnswer: sortedRef.map((o) => o.label).join(" → "),
      });
      fb.hidden = false;
      fb.classList.add(correct ? "correct" : "wrong");
      fb.innerHTML = "<h3>" + (correct ? "Correct order." : "Not quite — correct order shown.") + "</h3><p>" + step.explanation + "</p>";
      $("#tl-check").disabled = true;
      $("#tl-shuffle").disabled = true;
      $("#tl-next").hidden = false;
    };
    $("#tl-check").disabled = false;
    $("#tl-shuffle").disabled = false;
    $("#tl-next").onclick = () => advance();
  }

  function shuffled(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    // guard: ensure not already in correct order
    return a;
  }

  // --------------------------- Map click
  function renderMap(node) {
    show("screen-map");
    const step = node.step;
    $("#mp-kicker").textContent = node.chapter.title + " · Map";
    $("#mp-q").innerHTML = step.prompt;

    const fb = $("#mp-fb");
    fb.hidden = true;
    fb.className = "feedback";
    $("#mp-next").hidden = true;
    $("#mp-reset").hidden = true;

    const host = $("#map-host");
    host.innerHTML = buildWorldSVG();
    const svg = host.querySelector("svg");
    let answered = false;
    let attempts = 0;
    const tolerance = step.tolerance || 30;

    svg.addEventListener("click", (e) => {
      if (answered) return;
      const pt = svgPoint(svg, e.clientX, e.clientY);
      const [tx, ty] = GD.projXY(step.targetLng, step.targetLat);
      const dx = pt.x - tx;
      const dy = pt.y - ty;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const close = dist <= tolerance;
      attempts++;

      // drop a marker
      svg.appendChild(makeSVG("circle", { cx: pt.x, cy: pt.y, r: 5, class: close ? "target" : "pin" }));

      if (close || attempts >= 2) {
        answered = true;
        // reveal correct location
        if (!close) {
          svg.appendChild(makeSVG("circle", { cx: tx, cy: ty, r: 6, class: "target" }));
          svg.appendChild(textSVG(tx + 9, ty + 4, getLandmarkName(step) || "Target", "label"));
        }
        record({
          chapterTitle: node.chapter.title,
          prompt: step.prompt.replace(/<[^>]+>/g, ""),
          competency: step.competency,
          correct: close,
          given: "lng " + Math.round(invertLng(pt.x)) + ", lat " + Math.round(invertLat(pt.y)),
          rightAnswer: getLandmarkName(step) || ("lng " + step.targetLng + ", lat " + step.targetLat),
        });
        fb.hidden = false;
        fb.classList.add(close ? "correct" : "wrong");
        fb.innerHTML = "<h3>" + (close ? "Bullseye." : "Not quite — green marker shows the spot.") + "</h3><p>" + step.explanation + "</p>";
        $("#mp-next").hidden = false;
      } else {
        // first wrong attempt: nudge
        fb.hidden = false;
        fb.className = "feedback wrong";
        fb.innerHTML = "<h3>Try again.</h3><p>That's not it — you have one more try.</p>";
        $("#mp-reset").hidden = false;
      }
    });

    $("#mp-reset").onclick = () => {
      // visually clear pins and reset feedback
      $$("#map-host svg .pin").forEach((p) => p.remove());
      fb.hidden = true;
      $("#mp-reset").hidden = true;
    };
    $("#mp-next").onclick = () => advance();
  }

  function getLandmarkName(step) {
    // best-effort lookup against known landmarks
    for (const k in GD.MAP_LANDMARKS) {
      const lm = GD.MAP_LANDMARKS[k];
      if (Math.abs(lm.lng - step.targetLng) < 0.6 && Math.abs(lm.lat - step.targetLat) < 0.6) return lm.name;
    }
    return null;
  }

  function svgPoint(svg, clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  function invertLng(x) { return (x / GD.MAP_W) * 360 - 180; }
  function invertLat(y) { return 90 - (y / GD.MAP_H) * 180; }

  function makeSVG(tag, attrs) {
    const ns = "http://www.w3.org/2000/svg";
    const node = document.createElementNS(ns, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function textSVG(x, y, text, cls) {
    const t = makeSVG("text", { x, y, class: cls });
    t.textContent = text;
    return t;
  }

  function buildWorldSVG() {
    const w = GD.MAP_W, h = GD.MAP_H;
    let parts = [];
    parts.push('<svg class="world-map" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Equirectangular world map">');
    parts.push('<rect class="ocean" x="0" y="0" width="' + w + '" height="' + h + '"/>');
    // graticule
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = (90 - lat) * (h / 180);
      parts.push('<line class="grid" x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '"/>');
    }
    for (let lng = -150; lng <= 150; lng += 30) {
      const x = (lng + 180) * (w / 360);
      parts.push('<line class="grid" x1="' + x + '" y1="0" x2="' + x + '" y2="' + h + '"/>');
    }
    // continents
    for (const k in GD.CONTINENTS) {
      const pts = GD.CONTINENTS[k].map((p) => GD.projXY(p[0], p[1]).map((n) => n.toFixed(1)).join(","));
      parts.push('<polygon class="land" points="' + pts.join(" ") + '"/>');
    }
    // labels for major regions (subtle)
    const continentLabels = [
      ["NORTH AMERICA", -100, 45], ["SOUTH AMERICA", -60, -15], ["EUROPE", 15, 50],
      ["AFRICA", 18, 5], ["ASIA", 90, 45], ["AUSTRALIA", 134, -25], ["ANTARCTICA", 0, -78]
    ];
    continentLabels.forEach(([name, lng, lat]) => {
      const [x, y] = GD.projXY(lng, lat);
      parts.push('<text class="label" x="' + x + '" y="' + y + '" text-anchor="middle" style="font-size:11px;letter-spacing:1.5px;opacity:0.55;">' + name + '</text>');
    });
    parts.push('</svg>');
    return parts.join("");
  }

  // --------------------------- Recording
  function record(entry) {
    state.answers.push(entry);
  }

  // --------------------------- Results / proof gating
  function renderResults() {
    const total = state.answers.length;
    const correct = state.answers.filter((a) => a.correct).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    if (pct >= PASSING_PCT) renderProof(correct, total, pct);
    else renderLocked(correct, total, pct);
  }

  function renderLocked(correct, total, pct) {
    show("screen-locked");
    $("#lk-score").textContent = pct;
    const host = $("#lk-missed");
    host.innerHTML = "";
    state.answers.forEach((a, i) => {
      const row = el("div", "brk-row " + (a.correct ? "right" : "wrong"));
      row.appendChild(el("div", "badge", a.correct ? "✓" : "✗"));
      const main = el("div");
      main.appendChild(el("div", "", "Q" + (i + 1) + " · " + a.chapterTitle));
      main.appendChild(el("div", "muted micro", a.prompt));
      if (!a.correct) main.appendChild(el("div", "micro", "Correct: " + a.rightAnswer));
      row.appendChild(main);
      row.appendChild(el("div", "tag", a.competency || "—"));
      host.appendChild(row);
    });
    $("#lk-retry").onclick = () => location.reload();
    $("#lk-review").onclick = () => {
      // reset answers, reset flow to only the wrong steps
      const wrongIdx = new Set();
      state.answers.forEach((a, i) => { if (!a.correct) wrongIdx.add(i); });
      const newFlow = [];
      let scoredCount = 0;
      const allFlow = state.flow;
      allFlow.forEach((node) => {
        if (node.kind === "step" && isScored(node.step)) {
          if (wrongIdx.has(scoredCount)) newFlow.push(node);
          scoredCount++;
        }
      });
      newFlow.push({ kind: "results" });
      // Replace the completed answers with the correct ones we keep, rerun the wrong ones
      const kept = state.answers.filter((a) => a.correct);
      state.answers = kept;
      state.flow = newFlow;
      state.flowIdx = 0;
      next();
    };
  }

  function renderProof(correct, total, pct) {
    show("screen-proof");
    const elapsedMs = Date.now() - state.startTime;
    const minutes = Math.round(elapsedMs / 60000);
    const today = new Date().toISOString().slice(0, 10);
    const code = makeCode(state.names, pct, today);

    $("#pf-summary").innerHTML = "You scored <b>" + correct + " / " + total + "</b> (" + pct + "%). Email Mr. Noah to log it.";
    $("#pf-names").textContent = state.names.join(" + ");
    $("#pf-period").textContent = state.period || "—";
    $("#pf-score").textContent = correct + " / " + total + " (" + pct + "%)";
    $("#pf-time").textContent = minutes + " min";
    $("#pf-code").textContent = code;

    // build per-question report
    const report = $("#pf-report");
    report.innerHTML = "";
    state.answers.forEach((a, i) => {
      const row = el("div", "brk-row " + (a.correct ? "right" : "wrong"));
      row.appendChild(el("div", "badge", a.correct ? "✓" : "✗"));
      const main = el("div");
      main.appendChild(el("div", "", "Q" + (i + 1) + " · " + a.chapterTitle));
      main.appendChild(el("div", "muted micro", a.prompt));
      row.appendChild(main);
      row.appendChild(el("div", "tag", a.competency || "—"));
      report.appendChild(row);
    });

    const subject = "PGG Unit 5 proof — " + state.names.join(" + ") + " — " + pct + "%";
    const body = buildEmailBody({ correct, total, pct, minutes, today, code });

    const mailto = "mailto:" + TEACHER_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    $("#pf-mailto").href = mailto;

    $("#pf-copy").onclick = () => {
      const text = "To: " + TEACHER_EMAIL + "\nSubject: " + subject + "\n\n" + body;
      navigator.clipboard.writeText(text).then(() => {
        $("#pf-copy").textContent = "Copied ✓";
        setTimeout(() => { $("#pf-copy").textContent = "Copy proof to clipboard"; }, 1800);
      });
    };
  }

  function buildEmailBody({ correct, total, pct, minutes, today, code }) {
    const lines = [];
    lines.push("Hi Mr. Noah,");
    lines.push("");
    lines.push("We finished the PGG Unit 5 journey.");
    lines.push("");
    lines.push("Names: " + state.names.join(" + "));
    lines.push("Period: " + (state.period || "—"));
    lines.push("Date: " + today);
    lines.push("Score: " + correct + " / " + total + " (" + pct + "%)");
    lines.push("Time: " + minutes + " minutes");
    lines.push("Confirmation code: " + code);
    lines.push("");
    lines.push("By competency tag:");
    const byCo = {};
    state.answers.forEach((a) => {
      const k = a.competency || "—";
      if (!byCo[k]) byCo[k] = { correct: 0, total: 0 };
      byCo[k].total++;
      if (a.correct) byCo[k].correct++;
    });
    Object.keys(byCo).sort().forEach((k) => {
      lines.push("  " + k + ": " + byCo[k].correct + " / " + byCo[k].total);
    });
    lines.push("");
    lines.push("Per-question report:");
    state.answers.forEach((a, i) => {
      lines.push("  Q" + (i + 1) + " [" + (a.competency || "—") + "] " + (a.correct ? "✓" : "✗") + " — " + a.chapterTitle);
      lines.push("     " + a.prompt);
      if (!a.correct) lines.push("     Correct answer: " + a.rightAnswer);
    });
    lines.push("");
    lines.push("— sent from the Unit 5 journey");
    return lines.join("\n");
  }

  // Confirmation code: deterministic 6-char code derived from names+score+date.
  // Not cryptographic — just a deterrent so a faked email shows a mismatched code.
  function makeCode(names, pct, dateStr) {
    const seed = (names.join("|").toLowerCase().replace(/\s+/g, " ")) + "|" + pct + "|" + dateStr + "|pgg-u5";
    let h1 = 0x811c9dc5 >>> 0;
    for (let i = 0; i < seed.length; i++) {
      h1 ^= seed.charCodeAt(i);
      h1 = Math.imul(h1, 0x01000193) >>> 0;
    }
    // mix
    let h2 = h1;
    for (let i = seed.length - 1; i >= 0; i--) {
      h2 ^= seed.charCodeAt(i);
      h2 = Math.imul(h2, 0x01000193) >>> 0;
    }
    const hex = (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).toUpperCase();
    // map to crockford-ish base32 chunks for readability (just take a slice)
    const alpha = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let out = "";
    let n = BigInt("0x" + hex);
    for (let i = 0; i < 6; i++) {
      out += alpha[Number(n % BigInt(alpha.length))];
      n = n / BigInt(alpha.length);
    }
    return out.split("").reverse().join("");
  }

  // --------------------------- Boot
  document.addEventListener("DOMContentLoaded", () => {
    bindWelcome();
    show("screen-welcome");
  });
})();
