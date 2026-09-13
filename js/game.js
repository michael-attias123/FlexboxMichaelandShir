/* ============================================================
   טיול במזרח — לוגיקת המשחק
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'east-flex-trip-v1';
  var MAX_PER_LEVEL = 100;
  var WRONG_COST = 15;
  var HINT_COST = 10;
  var TARGET_COST = 10;
  var MIN_PER_LEVEL = 20;

  var PLANE_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M2.4 13.2 22 3.6 15.6 13 22 20.4l-8.6-3.7L9.9 22l-.6-5.6z"/>' +
    '</svg>';

  /* ---------- אלמנטים ---------- */
  var el = {
    board: document.getElementById('board'),
    boardFrame: document.getElementById('boardFrame'),
    stage: document.getElementById('stage'),
    stageWrap: document.querySelector('.stage-wrap'),
    scene: document.getElementById('scene'),
    ghosts: document.getElementById('ghosts'),
    items: document.getElementById('items'),
    destTitle: document.getElementById('destTitle'),
    destPlace: document.getElementById('destPlace'),
    flightNo: document.getElementById('flightNo'),
    taskText: document.getElementById('taskText'),
    controls: document.getElementById('controls'),
    codeBox: document.getElementById('codeBox'),
    feedback: document.getElementById('feedback'),
    hintText: document.getElementById('hintText'),
    routeList: document.getElementById('routeList'),
    hudStage: document.getElementById('hudStage'),
    hudScore: document.getElementById('hudScore'),
    hudTries: document.getElementById('hudTries'),
    btnCheck: document.getElementById('btnCheck'),
    btnNext: document.getElementById('btnNext'),
    btnReset: document.getElementById('btnReset'),
    btnTarget: document.getElementById('btnTarget'),
    btnHint: document.getElementById('btnHint'),
    btnWipe: document.getElementById('btnWipe'),
    finale: document.getElementById('finale'),
    finaleScore: document.getElementById('finaleScore'),
    finaleMax: document.getElementById('finaleMax'),
    finaleStamps: document.getElementById('finaleStamps'),
    btnAgain: document.getElementById('btnAgain'),
    btnClose: document.getElementById('btnClose')
  };

  /* ---------- מצב המשחק ---------- */
  var state = {
    index: 0,          // השלב הנוכחי
    unlocked: 0,       // השלב הגבוה ביותר שנפתח
    values: {},        // הערכים שהשחקן בחר בשלב הנוכחי
    solved: {},        // אילו שלבים הושלמו
    scores: {},        // ניקוד לכל שלב
    tries: {},         // ניסיונות לכל שלב
    usedHint: {},      // האם נעשה שימוש ברמז
    usedTarget: {}     // האם הוצג היעד
  };

  /* ---------- שמירת התקדמות ---------- */

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        index: state.index,
        unlocked: state.unlocked,
        solved: state.solved,
        scores: state.scores,
        tries: state.tries,
        usedHint: state.usedHint,
        usedTarget: state.usedTarget
      }));
    } catch (e) {
      /* דפדפן שחוסם אחסון מקומי — המשחק פשוט לא יזכור התקדמות */
    }
  }

  function load() {
    var raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return;
    }
    if (!raw) { return; }
    try {
      var data = JSON.parse(raw);
      state.index = clamp(data.index || 0, 0, LEVELS.length - 1);
      state.unlocked = clamp(data.unlocked || 0, 0, LEVELS.length - 1);
      state.solved = data.solved || {};
      state.scores = data.scores || {};
      state.tries = data.tries || {};
      state.usedHint = data.usedHint || {};
      state.usedTarget = data.usedTarget || {};
    } catch (e) {
      /* נתונים פגומים — מתחילים מחדש */
    }
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function totalScore() {
    var sum = 0;
    for (var key in state.scores) {
      if (Object.prototype.hasOwnProperty.call(state.scores, key)) {
        sum += state.scores[key];
      }
    }
    return sum;
  }

  /* ---------- בניית שלב ---------- */

  function level() {
    return LEVELS[state.index];
  }

  function startValues(lv) {
    var v = {};
    lv.controls.forEach(function (prop) {
      v[prop] = lv.start[prop];
    });
    return v;
  }

  function renderLevel() {
    var lv = level();

    state.values = startValues(lv);

    el.destTitle.textContent = lv.country;
    el.destPlace.textContent = lv.place;
    el.flightNo.textContent = 'EF‑' + (state.index + 1 < 10 ? '0' : '') + (state.index + 1);
    el.taskText.textContent = lv.task;
    el.scene.innerHTML = lv.scene;

    el.board.style.setProperty('--tint', lv.tint);
    el.board.classList.remove('show-target', 'is-right', 'is-wrong');
    el.btnTarget.setAttribute('aria-pressed', 'false');
    el.btnTarget.textContent = 'הצגת היעד';

    el.hintText.hidden = true;
    el.hintText.textContent = lv.hint;
    el.btnCheck.hidden = false;

    /* בשלב שכבר הושלם אפשר להתאמן שוב, אבל גם להמשיך מיד הלאה */
    var done = !!state.solved[lv.id];
    el.btnNext.hidden = !done;
    el.btnNext.textContent = state.index === LEVELS.length - 1 ? 'סיום הטיול' : 'המשיכו ליעד הבא';
    setFeedback(done ? 'היעד הזה כבר הושלם. אפשר לתרגל אותו שוב או להמשיך הלאה.' : '', '');

    buildPlanes(lv);
    buildGhosts(lv);
    buildControls(lv);
    applyStyles();
    renderRoute();
    renderHud();
    fitBoard();
  }

  function buildPlanes(lv) {
    el.items.setAttribute('aria-label', 'לוח המשחק מעל ' + lv.place + ', ' + lv.planes + ' מטוסים');
    var html = '';
    for (var i = 1; i <= lv.planes; i++) {
      html += '<div class="plane"><span class="plane__num">' + i + '</span>' + PLANE_SVG + '</div>';
    }
    el.items.innerHTML = html;
  }

  /* שכבת היעד נבנית מאותם מידות בדיוק, עם סגנונות הפתרון */
  function buildGhosts(lv) {
    var html = '';
    for (var i = 0; i < lv.planes; i++) { html += '<div class="ghost"></div>'; }
    el.ghosts.innerHTML = html;

    var target = merge(lv.fixed, lv.solution);
    if (!target['display']) { target['display'] = 'flex'; }
    writeStyles(el.ghosts, target);
  }

  function merge(a, b) {
    var out = {};
    var k;
    for (k in a) { if (Object.prototype.hasOwnProperty.call(a, k)) { out[k] = a[k]; } }
    for (k in b) { if (Object.prototype.hasOwnProperty.call(b, k)) { out[k] = b[k]; } }
    return out;
  }

  /* מחיקת כל מאפייני ה‑Flexbox וכתיבת הערכים הנוכחיים */
  function writeStyles(node, styles) {
    ['display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'align-content']
      .forEach(function (prop) { node.style.removeProperty(prop); });
    for (var prop in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, prop)) {
        node.style.setProperty(prop, styles[prop]);
      }
    }
  }

  /* ---------- פקדים ---------- */

  function buildControls(lv) {
    el.controls.innerHTML = '';

    lv.controls.forEach(function (prop) {
      var box = document.createElement('div');
      box.className = 'ctrl';

      var head = document.createElement('div');
      head.className = 'ctrl__head';

      var name = document.createElement(CONTROL_KIND[prop] === 'segmented' ? 'span' : 'label');
      name.className = 'ctrl__name';
      name.textContent = prop;

      var note = document.createElement('span');
      note.className = 'ctrl__note';
      note.textContent = PROP_NOTE[prop] || '';

      head.appendChild(name);
      head.appendChild(note);
      box.appendChild(head);

      if (CONTROL_KIND[prop] === 'segmented') {
        box.setAttribute('role', 'group');
        box.setAttribute('aria-label', prop);
        box.appendChild(buildSegmented(prop));
      } else {
        var sel = buildSelect(prop);
        name.setAttribute('for', sel.id);
        box.appendChild(sel);
      }

      el.controls.appendChild(box);
    });
  }

  function buildSelect(prop) {
    var sel = document.createElement('select');
    sel.id = 'sel-' + prop;
    OPTIONS[prop].forEach(function (value) {
      var opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      if (value === state.values[prop]) { opt.selected = true; }
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function () {
      setValue(prop, sel.value);
    });
    return sel;
  }

  function buildSegmented(prop) {
    var wrap = document.createElement('div');
    wrap.className = 'seg';
    OPTIONS[prop].forEach(function (value, i) {
      var id = 'opt-' + prop + '-' + i;
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = prop;
      input.id = id;
      input.value = value;
      input.checked = (value === state.values[prop]);
      input.addEventListener('change', function () {
        if (input.checked) { setValue(prop, value); }
      });

      var label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = value;

      wrap.appendChild(input);
      wrap.appendChild(label);
    });
    return wrap;
  }

  function setValue(prop, value) {
    state.values[prop] = value;
    el.board.classList.remove('is-right', 'is-wrong');
    applyStyles();
    /* אחרי שינוי בפקדים תמיד אפשר לבדוק שוב, גם בשלב שכבר נפתר */
    el.btnCheck.hidden = false;
    if (el.feedback.classList.contains('is-bad')) { setFeedback('', ''); }
  }

  /* ---------- החלת הסגנונות על הלוח ---------- */

  function applyStyles() {
    var lv = level();
    var styles = merge(lv.fixed, state.values);
    writeStyles(el.items, styles);
    renderCode(lv, styles);
  }

  function renderCode(lv, styles) {
    var order = ['display', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content'];
    var lines = ['.board {'];

    order.forEach(function (prop) {
      if (!(prop in styles)) { return; }
      var editable = lv.controls.indexOf(prop) !== -1;
      var value = editable
        ? '<b>' + styles[prop] + '</b>'
        : '<i>' + styles[prop] + '</i>';
      lines.push('  ' + prop + ': ' + value + ';');
    });

    /* gap פועל רק כשהלוח הוא flex container */
    if (styles['display'] === 'flex') { lines.push('  gap: <i>12px</i>;'); }
    lines.push('}');
    el.codeBox.innerHTML = lines.join('\n');
  }

  /* ---------- בדיקת הפתרון ---------- */

  function check() {
    var lv = level();
    var wrong = [];

    for (var prop in lv.solution) {
      if (!Object.prototype.hasOwnProperty.call(lv.solution, prop)) { continue; }
      if (state.values[prop] !== lv.solution[prop]) { wrong.push(prop); }
    }

    if (wrong.length === 0) {
      win(lv);
    } else {
      lose(lv, wrong);
    }
  }

  function win(lv) {
    var alreadySolved = !!state.solved[lv.id];

    el.board.classList.remove('is-wrong');
    void el.board.offsetWidth;
    el.board.classList.add('is-right');

    if (!alreadySolved) {
      state.solved[lv.id] = true;
      state.scores[lv.id] = levelScore(lv);
      if (state.index + 1 > state.unlocked) {
        state.unlocked = Math.min(state.index + 1, LEVELS.length - 1);
      }
    }

    var last = state.index === LEVELS.length - 1;
    setFeedback(
      alreadySolved
        ? 'נכון. השלב הזה כבר הושלם, הניקוד שלו נשמר.'
        : 'נחיתה מושלמת. ' + state.scores[lv.id] + ' נקודות ביעד הזה.',
      'is-ok'
    );

    el.btnCheck.hidden = true;
    el.btnNext.hidden = false;
    el.btnNext.textContent = last ? 'סיום הטיול' : 'המשיכו ליעד הבא';

    save();
    renderRoute();
    renderHud();
  }

  function levelScore(lv) {
    var score = MAX_PER_LEVEL;
    score -= (state.tries[lv.id] || 0) * WRONG_COST;
    if (state.usedHint[lv.id]) { score -= HINT_COST; }
    if (state.usedTarget[lv.id]) { score -= TARGET_COST; }
    return Math.max(MIN_PER_LEVEL, score);
  }

  function lose(lv, wrong) {
    state.tries[lv.id] = (state.tries[lv.id] || 0) + 1;

    el.board.classList.remove('is-right');
    void el.board.offsetWidth;
    el.board.classList.add('is-wrong');

    var which = wrong.length === 1
      ? 'המאפיין ' + wrong[0] + ' עדיין לא במקום.'
      : 'עדיין לא במקום: ' + wrong.join(', ') + '.';

    setFeedback('המטוסים לא הגיעו ליעד. ' + which + ' נסו שוב.', 'is-bad');
    save();
    renderHud();
  }

  function setFeedback(text, cls) {
    el.feedback.textContent = text;
    el.feedback.className = 'feedback' + (cls ? ' ' + cls : '');
  }

  /* ---------- ניווט ---------- */

  function goTo(i) {
    state.index = clamp(i, 0, LEVELS.length - 1);
    save();
    renderLevel();
  }

  function next() {
    if (state.index === LEVELS.length - 1) {
      showFinale();
      return;
    }
    goTo(state.index + 1);
  }

  function renderRoute() {
    el.routeList.innerHTML = '';
    LEVELS.forEach(function (lv, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'stop';
      btn.textContent = String(i + 1);

      var open = i <= state.unlocked;
      var title = lv.country + ' — שלב ' + (i + 1);

      if (state.solved[lv.id]) { btn.classList.add('is-done'); title += ' (הושלם)'; }
      if (i === state.index) { btn.classList.add('is-current'); btn.setAttribute('aria-current', 'step'); }
      if (open) {
        btn.classList.add('is-open');
        btn.addEventListener('click', function () { goTo(i); });
      } else {
        btn.disabled = true;
        title += ' (נעול)';
      }

      btn.title = title;
      btn.setAttribute('aria-label', title);
      li.appendChild(btn);
      el.routeList.appendChild(li);
    });
  }

  function renderHud() {
    var lv = level();
    el.hudStage.textContent = (state.index + 1) + ' מתוך ' + LEVELS.length;
    el.hudScore.textContent = totalScore();
    el.hudTries.textContent = state.tries[lv.id] || 0;
  }

  /* ---------- מסך סיום ---------- */

  function showFinale() {
    el.finaleScore.textContent = totalScore();
    el.finaleMax.textContent = LEVELS.length * MAX_PER_LEVEL;
    el.finaleStamps.innerHTML = '';
    LEVELS.forEach(function (lv) {
      var li = document.createElement('li');
      li.innerHTML = lv.country + ' <b>' + (state.scores[lv.id] || 0) + '</b>';
      el.finaleStamps.appendChild(li);
    });
    el.finale.hidden = false;
    el.btnAgain.focus();
  }

  function wipe() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    state.index = 0;
    state.unlocked = 0;
    state.solved = {};
    state.scores = {};
    state.tries = {};
    state.usedHint = {};
    state.usedTarget = {};
    el.finale.hidden = true;
    renderLevel();
  }

  /* ---------- התאמת הלוח למסך ---------- */
  /* הלוח נשאר 480×400 בדיוק; במסך צר הוא רק מוקטן חזותית,
     כך שסידור ה‑Flexbox — ולכן הפתרון — זהה בכל רזולוציה. */
  var lastFitWidth = -1;

  function fitBoard() {
    var available = el.stage.clientWidth;
    if (!available || available === lastFitWidth) { return; }
    lastFitWidth = available;
    var fit = Math.min(1, available / 480);
    el.boardFrame.style.setProperty('--fit', fit);
    /* 16 פיקסלים נוספים כדי שהצל של הלוח לא ייחתך */
    el.stage.style.height = (Math.round(400 * fit) + 16) + 'px';
  }

  /* ---------- חיבור אירועים ---------- */

  /* הפקדים אינם נשלחים לשום מקום — מניעת רענון עמוד בטעות */
  el.controls.addEventListener('submit', function (e) { e.preventDefault(); });

  el.btnCheck.addEventListener('click', check);
  el.btnNext.addEventListener('click', next);

  el.btnReset.addEventListener('click', function () {
    var lv = level();
    state.values = startValues(lv);
    buildControls(lv);
    applyStyles();
    el.board.classList.remove('is-right', 'is-wrong');
    el.btnNext.hidden = true;
    el.btnCheck.hidden = false;
    setFeedback('השלב אופס לערכי ברירת המחדל.', '');
  });

  el.btnTarget.addEventListener('click', function () {
    var lv = level();
    var on = el.board.classList.toggle('show-target');
    el.btnTarget.setAttribute('aria-pressed', on ? 'true' : 'false');
    el.btnTarget.textContent = on ? 'הסתרת היעד' : 'הצגת היעד';
    if (on && !state.usedTarget[lv.id] && !state.solved[lv.id]) {
      state.usedTarget[lv.id] = true;
      save();
    }
  });

  el.btnHint.addEventListener('click', function () {
    var lv = level();
    el.hintText.hidden = !el.hintText.hidden;
    if (!el.hintText.hidden && !state.usedHint[lv.id] && !state.solved[lv.id]) {
      state.usedHint[lv.id] = true;
      save();
    }
  });

  el.btnWipe.addEventListener('click', function () {
    if (window.confirm('למחוק את ההתקדמות ולהתחיל את הטיול מההתחלה?')) { wipe(); }
  });

  el.btnAgain.addEventListener('click', wipe);
  el.btnClose.addEventListener('click', function () {
    el.finale.hidden = true;
    el.btnCheck.focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !el.finale.hidden) { el.finale.hidden = true; }
  });

  window.addEventListener('resize', fitBoard);
  if (window.ResizeObserver) {
    new ResizeObserver(fitBoard).observe(el.stageWrap);
  }

  /* ---------- הפעלה ---------- */
  load();
  renderLevel();
  window.addEventListener('load', fitBoard);
})();
