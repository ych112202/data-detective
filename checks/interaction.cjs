/* DOM-level interaction checks. Run `npm install` once, then `npm run check:interaction`. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "site/index.html"), "utf8");
const code = fs.readFileSync(path.join(root, "site/app.js"), "utf8");
function boot(saved) {
  const dom = new JSDOM(html, { url: "https://local.test/index.html", runScripts: "outside-only" });
  const w = dom.window;
  w.scrollTo = () => {};
  w.alert = () => {};
  w.confirm = () => true;
  if (saved) w.localStorage.setItem("data-detective-v1", saved);
  w.eval(code);
  return w;
}
function click(w, selector) {
  const el = w.document.querySelector(selector);
  assert.ok(el, selector);
  el.click();
  return el;
}
function state(w) { return JSON.parse(w.localStorage.getItem("data-detective-v1")); }

const w = boot();
const d = w.document;
assert.equal(d.querySelectorAll(".slide").length, 14);
assert.equal(d.querySelector('#case-nav button[data-slide="5"]').disabled, true);
console.log("PASS initial slide count and case lock");

click(w, "#axis-toggle");
assert.match(d.querySelector("#axis-caption").textContent, /從 0 萬/);
const salary = d.querySelector("#salary");
salary.value = "600";
salary.dispatchEvent(new w.Event("input", { bubbles: true }));
assert.equal(d.querySelector("#mean").textContent, "158");
assert.equal(d.querySelector("#median").textContent, "50");
console.log("PASS graph toggle and salary recalculation");

const sample = d.querySelector("#sample");
sample.value = "balanced";
sample.dispatchEvent(new w.Event("change", { bubbles: true }));
assert.match(d.querySelector("#sample-result").textContent, /56\/100/);
const factor = d.querySelector("#factor");
assert.match(d.querySelector("#correlation").textContent, /0.99/);
const iceSales = d.querySelector("#ice-sales");
iceSales.value = "110";
iceSales.dispatchEvent(new w.Event("input", { bubbles: true }));
assert.equal(d.querySelector("#ice-value").value, "110");
assert.doesNotMatch(d.querySelector("#correlation").textContent, /0.99/);
factor.value = "heat";
factor.dispatchEvent(new w.Event("change", { bubbles: true }));
assert.match(d.querySelector("#factor-result").textContent, /待查假說/);
assert.match(d.querySelector("#ice-table").textContent, /平均氣溫/);
click(w, "#group-toggle");
assert.match(d.querySelector("#simpson-table").textContent, /73.64%/);
console.log("PASS sampling, confounder, and grouped-rate controls");

for (let n = 1; n <= 5; n++) {
  click(w, `.quiz[data-case="${n}"] button[data-answer="correct"]`);
  assert.ok(state(w).completed.includes(n));
  if (n < 5) assert.equal(d.querySelector(`#case-nav button[data-slide="${n * 2 + 3}"]`).disabled, false);
}
assert.equal(state(w).badges.length, 5);
assert.equal(d.querySelector('#case-nav button[data-slide="14"]').disabled, false);
click(w, '#case-nav button[data-slide="3"]');
assert.equal(d.querySelector(".slide.active").id, "slide-03");
click(w, '#case-nav button[data-slide="14"]');
assert.equal(d.querySelector(".slide.active").id, "slide-14");
console.log("PASS sequential unlock and five badges");

const questions = [...d.querySelectorAll(".test-question")];
assert.equal(questions.length, 10);
const answers = [0, 1, 0, 1, 1, 1, 1, 1, 0, 1];
questions.forEach((q, i) => { q.querySelector(`input[value="${answers[i]}"]`).checked = true; });
click(w, "#submit-final");
assert.equal(state(w).lastScore, 100);
assert.equal(state(w).bestScore, 100);
assert.match(d.querySelector("#final-result").textContent, /首席數據偵探/);
console.log("PASS 10-question scoring and certification");

questions.forEach(q => { q.querySelector('input[value="2"]').checked = true; });
click(w, "#submit-final");
assert.equal(state(w).bestScore, 100);
assert.equal(state(w).lastScore, 0);
assert.equal(d.querySelectorAll(".answer-list li").length, 10);
console.log("PASS retake, best score, and answer explanations");

for (const [correctCount, expected] of [[5,"調查訓練生"],[6,"見習數據偵探"],[7,"資深數據調查員"],[9,"首席數據偵探"]]) {
  const probe = boot(JSON.stringify({ completed:[1,2,3,4,5], badges:["CASE-01","CASE-02","CASE-03","CASE-04","CASE-05"], lastScore:null, bestScore:null, certified:false }));
  [...probe.document.querySelectorAll(".test-question")].forEach((q, i) => {
    const chosen = i < correctCount ? answers[i] : (answers[i]+1)%3;
    q.querySelector(`input[value="${chosen}"]`).checked = true;
  });
  click(probe,"#submit-final");
  assert.equal(state(probe).lastScore,correctCount*10);
  assert.match(probe.document.querySelector("#final-result").textContent,new RegExp(expected));
}
console.log("PASS score-boundary levels and free review");

const w2 = boot(w.localStorage.getItem("data-detective-v1"));
assert.equal(state(w2).bestScore, 100);
assert.equal(w2.document.querySelector('#case-nav button[data-slide="14"]').disabled, false);
click(w2, "#reset");
assert.deepEqual(state(w2).completed, []);
assert.equal(state(w2).bestScore, null);
assert.equal(w2.document.querySelector('#case-nav button[data-slide="14"]').disabled, true);
console.log("PASS persistence and reset");
