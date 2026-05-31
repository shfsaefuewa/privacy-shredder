/* ═══════════════════════════════════════
   Privacy Shredder - preview.js
   Apple-style vanilla JS
   ═══════════════════════════════════════ */

/* ── Data ── */

var browserItems = [
  { id: 'b1', name: '浏览历史', size: '128MB', desc: 'Chrome · Safari 访问记录', checked: true },
  { id: 'b2', name: 'Cookies', size: '45MB', desc: '跟踪器 · 会话数据', checked: true },
  { id: 'b3', name: '缓存文件', size: '520MB', desc: '图片 · JS · CSS 缓存', checked: true },
  { id: 'b4', name: '下载记录', size: '2.1GB', desc: '已完成 · 未完成下载', checked: true },
  { id: 'b5', name: '表单数据', size: '35MB', desc: '自动填充 · 密码记录', checked: true }
];

var systemItems = [
  { id: 's1', name: '剪贴板数据', size: '128MB', desc: '复制历史 · 截图缓存', checked: true },
  { id: 's2', name: 'DNS 缓存', size: '64MB', desc: '域名解析记录', checked: true },
  { id: 's3', name: 'WiFi 记录', size: '12MB', desc: '已保存网络密码', checked: false },
  { id: 's4', name: '系统日志', size: '256MB', desc: '诊断 · 崩溃日志', checked: true },
  { id: 's5', name: '临时文件', size: '820MB', desc: '/tmp · 缓存目录', checked: true }
];

var appItems = [
  { id: 'a1', name: '微信', size: '680MB', desc: '聊天缓存 · 朋友圈 · 视频号', checked: true },
  { id: 'a2', name: 'QQ', size: '420MB', desc: '消息记录 · 文件缓存', checked: true },
  { id: 'a3', name: '抖音', size: '1.2GB', desc: '视频缓存 · 直播回放', checked: true },
  { id: 'a4', name: '微博', size: '360MB', desc: '图片缓存 · 浏览记录', checked: true },
  { id: 'a5', name: '淘宝', size: '520MB', desc: '搜索历史 · 商品缓存', checked: true }
];

var riskData = [
  { type: 'danger', name: '浏览器痕迹', size: '2.3GB', files: 1240, desc: 'Cookie · 历史 · 缓存 · 表单 · 下载记录未清理，可被第三方追踪还原上网行为。' },
  { type: 'warn', name: '剪贴板数据', size: '128MB', files: 56, desc: '剪贴板历史含明文密码与银行卡号片段，多应用可静默读取。' },
  { type: 'warn', name: '应用缓存', size: '856MB', files: 302, desc: '微信 · QQ · 抖音等应用的残留缓存文件，含语音、图片、视频碎片。' }
];

var shredCats = [
  { id: 'sh1', name: '浏览器数据', size: '1.2GB', desc: '历史 · Cookie · 缓存 · 下载', checked: true },
  { id: 'sh2', name: '系统缓存', size: '1.1GB', desc: '临时文件 · 日志 · DNS', checked: true },
  { id: 'sh3', name: '媒体文件', size: '2.3GB', desc: '图片 · 视频缩略图', checked: true },
  { id: 'sh4', name: '下载目录', size: '0.8GB', desc: '已完成下载 · 碎片文件', checked: true },
  { id: 'sh5', name: '日志文件', size: '0.5GB', desc: '应用日志 · 崩溃报告', checked: true }
];

var anonApps = [
  { id: 'an1', name: '微信', icon: 'W', tunnel: true },
  { id: 'an2', name: 'QQ', icon: 'Q', tunnel: true },
  { id: 'an3', name: '浏览器', icon: 'B', tunnel: true },
  { id: 'an4', name: '抖音', icon: 'D', tunnel: true },
  { id: 'an5', name: '淘宝', icon: 'T', tunnel: false }
];

var anonState = {
  active: false,
  exitIp: null,
  latency: null,
  nodeCount: null,
  tunnelType: 'tor'
};

var settings = {
  autoClean: true,
  clipboard: true,
  disguise: false,
  antiScreen: true,
  logSuppress: true,
  erasureLevel: 'deep',
  cleanInterval: 24
};

var anonLogs = [];

/* ── State ── */

var currentTab = 'dashboard';
var currentCleanTab = 'browser';
var currentLevel = 'deep';
var isTransitioning = false;
var shredTimer = null;
var shredAborted = false;
var isShredCancelled = false;
var scoreValue = 70;
var cleanCount = 12;
var lastCleanTime = '2h前';
var totalSpace = '1.2GB';
var clockInterval = null;
var cleanItems = browserItems;

/* ── DOM Helpers ── */

function $(id) {
  return document.getElementById(id);
}

function el(tag) {
  return document.createElement(tag);
}

/* ── Toast ── */

function toast(msg) {
  var t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(function () {
    t.classList.remove('show');
  }, 2200);
}

/* ── Ripple ── */

function addRipple(e, elm) {
  var ripple = el('div');
  ripple.className = 'ripple';
  var rect = elm.getBoundingClientRect();
  var size = Math.max(rect.width, rect.height) * 1.2;
  ripple.style.width = size + 'px';
  ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  elm.appendChild(ripple);
  ripple.addEventListener('animationend', function () {
    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
  });
}

/* ── Init Ripple Effects ── */

function initRippleEffects() {
  var selectors = '.ios-row, .check-row, .setting-row, .app-route-row, .stat-cell';
  var els = document.querySelectorAll(selectors);
  for (var i = 0; i < els.length; i++) {
    (function (r) {
      r.addEventListener('click', function (e) {
        addRipple(e, r);
      });
    })(els[i]);
  }
}

/* ── Long Press ── */

function initLongPress() {
  var btn = $('btnShred');
  if (!btn) return;
  var pressTimer = null;
  var isPressing = false;

  function startPress() {
    isPressing = true;
    pressTimer = setTimeout(function () {
      if (!isPressing) return;
      toast('紧急粉碎已触发');
      selectLevel('military', document.querySelector('#levelSelect .level-card:last-child'));
      startShred();
    }, 2000);
  }

  function endPress() {
    isPressing = false;
    clearTimeout(pressTimer);
  }

  btn.addEventListener('mousedown', startPress);
  btn.addEventListener('mouseup', endPress);
  btn.addEventListener('mouseleave', endPress);
  btn.addEventListener('touchstart', startPress);
  btn.addEventListener('touchend', endPress);
  btn.addEventListener('touchcancel', endPress);
}

/* ── Clock ── */

function updateClock() {
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var str = (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
  var td = $('timeDisplay');
  if (td) td.textContent = str;
}

function startClock() {
  updateClock();
  clearInterval(clockInterval);
  clockInterval = setInterval(updateClock, 10000);
}

/* ── Spring Easing ── */

function springEase(t) {
  return 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 1.5);
}

/* ── Score ── */

function animateNumber(el, from, to, duration, callback) {
  var startTime = null;
  var range = to - from;
  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var val = range * springEase(progress) + from;
    el.textContent = Math.round(val);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = to;
      if (callback) callback();
    }
  }
  requestAnimationFrame(step);
}

function updateScoreColor(n) {
  var circle = $('progCircle');
  var numEl = $('scoreNumber');
  var labelEl = $('scoreLabel');
  if (!circle || !numEl || !labelEl) return;
  var color;
  if (n >= 80) { color = '#34C759'; labelEl.textContent = '安全'; }
  else if (n >= 50) { color = '#FF9500'; labelEl.textContent = '需关注'; }
  else { color = '#FF3B30'; labelEl.textContent = '有风险'; }
  circle.style.stroke = color;
  numEl.style.color = color;
  labelEl.style.color = color;
}

function updateStatusDot(n) {
  var dot = $('statusDot');
  var label = $('statusLabel');
  if (!dot || !label) return;
  dot.classList.remove('scanning', 'warning-pulse');
  if (n >= 80) {
    dot.style.background = '#34C759';
    label.textContent = '隐私安全';
  } else if (n >= 50) {
    dot.style.background = '#FF9500';
    dot.classList.add('warning-pulse');
    label.textContent = '需关注';
  } else {
    dot.style.background = '#FF3B30';
    dot.classList.add('scanning');
    label.textContent = '有风险';
  }
}

function updateScore(n) {
  scoreValue = n;
  var circle = $('progCircle');
  var numEl = $('scoreNumber');
  var circumference = 2 * Math.PI * 40;
  if (!circle || !numEl) return;

  var currentOffset = parseFloat(circle.getAttribute('stroke-dashoffset'));
  if (isNaN(currentOffset)) currentOffset = circumference;
  var currentScore = ((circumference - currentOffset) / circumference) * 100;
  if (currentScore < 0) currentScore = 0;

  var startTime = null;
  var duration = 800;
  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var eased = springEase(progress);
    var val = currentScore + (n - currentScore) * eased;
    var offset = circumference - (val / 100) * circumference;
    circle.setAttribute('stroke-dashoffset', offset.toFixed(2));
    numEl.textContent = Math.round(val);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      circle.setAttribute('stroke-dashoffset', (circumference - (n / 100) * circumference).toFixed(2));
      numEl.textContent = n;
    }
  }
  requestAnimationFrame(step);
  updateScoreColor(n);
  updateStatusDot(n);
}

function animateScoreEntrance() {
  var circle = $('progCircle');
  var numEl = $('scoreNumber');
  var circumference = 2 * Math.PI * 40;
  if (!circle || !numEl) return;

  var from = 0;
  var to = 70;
  var startTime = null;
  var duration = 1200;

  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var eased = springEase(progress);
    var val = from + (to - from) * eased;
    var offset = circumference - (val / 100) * circumference;
    circle.setAttribute('stroke-dashoffset', offset.toFixed(2));
    numEl.textContent = Math.round(val);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      circle.setAttribute('stroke-dashoffset', (circumference - (to / 100) * circumference).toFixed(2));
      numEl.textContent = to;
      updateScoreColor(to);
    }
  }
  requestAnimationFrame(step);
  updateScoreColor(to);
}

/* ── Risks ── */

function renderRisks() {
  var list = $('riskList');
  if (!list) return;
  list.innerHTML = '';

  for (var i = 0; i < riskData.length; i++) {
    (function (item) {
      var row = el('div');
      row.className = 'ios-row';
      row.onclick = function (e) { openTraceDetail(item); };

      var icon = el('div');
      icon.className = 'row-icon ' + (item.type === 'danger' ? 'danger' : 'warn');
      icon.textContent = item.type === 'danger' ? '!' : '\u26A0';

      var info = el('div');
      info.className = 'row-info';

      var title = el('div');
      title.className = 'ri-title';
      title.textContent = item.name;

      var desc = el('div');
      desc.className = 'ri-desc';
      desc.textContent = item.size + ' \u00B7 ' + item.files + ' \u4E2A\u6587\u4EF6';

      info.appendChild(title);
      info.appendChild(desc);

      var badge = el('div');
      badge.className = 'row-badge ' + (item.type === 'danger' ? 'badge-danger' : 'badge-warn');
      badge.textContent = item.type === 'danger' ? '\u9AD8\u98CE\u9669' : '\u4E2D\u98CE\u9669';

      var arrow = el('div');
      arrow.className = 'row-arrow';
      arrow.textContent = '\u203A';

      row.appendChild(icon);
      row.appendChild(info);
      row.appendChild(badge);
      row.appendChild(arrow);

      list.appendChild(row);
    })(riskData[i]);
  }
}

/* ── Trace Detail ── */

function openTraceDetail(item) {
  var overlay = $('traceOverlay');
  var header = $('traceHeader');
  var body = $('traceBody');
  var actions = $('traceActions');
  if (!overlay || !header || !body || !actions) return;

  header.innerHTML = '';

  var hdrIcon = el('div');
  hdrIcon.className = 'trace-hdr-icon ' + (item.type === 'danger' ? 'danger' : 'warn');
  hdrIcon.textContent = item.type === 'danger' ? '!' : '\u26A0';

  var hdrRight = el('div');

  var hdrTitle = el('div');
  hdrTitle.className = 'trace-hdr-title';
  hdrTitle.textContent = item.name;

  var hdrSub = el('div');
  hdrSub.className = 'trace-hdr-sub';
  hdrSub.textContent = item.size + ' \u00B7 ' + item.files + ' \u4E2A\u6587\u4EF6';

  hdrRight.appendChild(hdrTitle);
  hdrRight.appendChild(hdrSub);
  header.appendChild(hdrIcon);
  header.appendChild(hdrRight);

  body.innerHTML = '';

  var summary = el('div');
  summary.className = 'trace-summary';
  var riskLabel = item.type === 'danger' ? '\u9AD8' : '\u4E2D';
  summary.innerHTML =
    '<div class="trace-s-item"><div class="ts-val">' + item.files + '</div><div class="ts-lbl">\u6587\u4EF6\u6570</div></div>' +
    '<div class="trace-s-item"><div class="ts-val">' + item.size + '</div><div class="ts-lbl">\u5360\u7528\u7A7A\u95F4</div></div>' +
    '<div class="trace-s-item"><div class="ts-val">' + riskLabel + '</div><div class="ts-lbl">\u98CE\u9669\u7B49\u7EA7</div></div>';
  body.appendChild(summary);

  var eTitle = el('div');
  eTitle.className = 'trace-e-title';
  eTitle.textContent = '\u63CF\u8FF0';
  body.appendChild(eTitle);

  var entry = el('div');
  entry.className = 'trace-entry';
  entry.style.fontSize = '13px';
  entry.style.lineHeight = '1.6';
  entry.textContent = item.desc;
  body.appendChild(entry);

  var samplesTitle = el('div');
  samplesTitle.className = 'trace-e-title';
  samplesTitle.textContent = '\u6837\u672C\u6761\u76EE';
  body.appendChild(samplesTitle);

  var sampleEntries = [
    { time: '12:03', path: '/data/browser/cookies.sqlite', size: '1.2GB' },
    { time: '12:01', path: '/data/browser/history.db', size: '0.8GB' },
    { time: '11:58', path: '/data/browser/cache/f_0003', size: '0.3GB' }
  ];

  for (var j = 0; j < sampleEntries.length; j++) {
    var se = el('div');
    se.className = 'trace-entry';
    se.innerHTML =
      '<span class="te-time">' + sampleEntries[j].time + '</span>' +
      '<span class="te-path">' + sampleEntries[j].path + '</span>' +
      '<span class="te-size">' + sampleEntries[j].size + '</span>';
    body.appendChild(se);
  }

  actions.innerHTML =
    '<button class="btn btn-secondary" onclick="closeTrace()">\u5173\u95ED</button>' +
    '<button class="btn btn-primary" onclick="toast(\'\u5DF2\u6DFB\u52A0\u81F3\u6E05\u7406\u961F\u5217\');closeTrace()">\u52A0\u5165\u6E05\u7406</button>';

  overlay.classList.add('show');
}

function closeTrace(e) {
  if (e && e.target !== $('traceOverlay')) return;
  $('traceOverlay').classList.remove('show');
}

/* ── Clean ── */

function switchCleanTab(tab, elm) {
  currentCleanTab = tab;

  var btns = document.querySelectorAll('#page-clean .seg-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active');
  }
  if (elm) elm.classList.add('active');

  if (tab === 'browser') cleanItems = browserItems;
  else if (tab === 'system') cleanItems = systemItems;
  else if (tab === 'app') cleanItems = appItems;

  renderClean();
}

function renderClean() {
  var list = $('cleanList');
  if (!list) return;
  list.innerHTML = '';

  var items = cleanItems;
  for (var i = 0; i < items.length; i++) {
    (function (item, idx) {
      var row = el('div');
      row.className = 'check-row';
      if (item.checked) row.classList.add('checked');
      row.onclick = function (e) { toggleClean(idx); };

      var check = el('div');
      check.className = 'ios-check';
      row.appendChild(check);

      var info = el('div');
      info.className = 'row-info';

      var title = el('div');
      title.className = 'ri-title';
      title.textContent = item.name;

      var desc = el('div');
      desc.className = 'ri-desc';
      desc.textContent = item.size + ' \u00B7 ' + item.desc;

      info.appendChild(title);
      info.appendChild(desc);
      row.appendChild(info);

      list.appendChild(row);
    })(items[i], i);
  }
}

function toggleClean(idx) {
  cleanItems[idx].checked = !cleanItems[idx].checked;
  renderClean();
}

function toggleAllClean() {
  var allChecked = true;
  for (var i = 0; i < cleanItems.length; i++) {
    if (!cleanItems[i].checked) { allChecked = false; break; }
  }
  for (var j = 0; j < cleanItems.length; j++) {
    cleanItems[j].checked = !allChecked;
  }
  renderClean();
}

function parseSizeMB(str) {
  var num = parseFloat(str);
  if (isNaN(num)) return 0;
  if (str.indexOf('GB') !== -1) return num * 1024;
  return num;
}

function formatSizeMB(mb) {
  if (mb >= 1024) return (mb / 1024).toFixed(1) + 'GB';
  else return Math.round(mb) + 'MB';
}

function performQuickClean() {
  var checkedCount = 0;
  var totalSize = 0;
  for (var i = 0; i < cleanItems.length; i++) {
    if (cleanItems[i].checked) {
      checkedCount++;
      totalSize += parseSizeMB(cleanItems[i].size);
    }
  }
  if (checkedCount === 0) {
    toast('\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u9879');
    return;
  }

  toast('\u6B63\u5728\u6E05\u7406 ' + checkedCount + ' \u9879...');

  celebParticles();
  shredLog('\u5FEB\u901F\u6E05\u7406 ' + checkedCount + ' \u9879');

  cleanCount++;
  lastCleanTime = '\u521A\u521A';

  var prevSpace = parseFloat(totalSpace);
  if (isNaN(prevSpace)) prevSpace = 0;
  var addSpace = totalSize / 1024;
  totalSpace = (prevSpace + addSpace).toFixed(1) + 'GB';

  $('statClean').textContent = cleanCount;
  $('statTime').textContent = lastCleanTime;
  $('statSpace').textContent = totalSpace;

  var newScore = Math.min(100, scoreValue + 5);
  updateScore(newScore);

  for (var j = 0; j < cleanItems.length; j++) {
    cleanItems[j].checked = false;
  }
  renderClean();
}

/* ── Shred ── */

var shredLevelNames = { standard: '\u6807\u51C6', deep: 'DoD', military: '\u519B\u4E8B\u7EA7' };

function selectLevel(level, elm) {
  currentLevel = level;
  var cards = document.querySelectorAll('.level-card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove('active');
  }
  if (elm) elm.classList.add('active');
}

function renderShredCats() {
  var list = $('shredCategories');
  if (!list) return;
  list.innerHTML = '';

  for (var i = 0; i < shredCats.length; i++) {
    (function (item, idx) {
      var row = el('div');
      row.className = 'check-row';
      if (item.checked) row.classList.add('checked');
      row.onclick = function () { toggleShredCat(idx); };

      var check = el('div');
      check.className = 'ios-check';
      row.appendChild(check);

      var info = el('div');
      info.className = 'row-info';

      var title = el('div');
      title.className = 'ri-title';
      title.textContent = item.name;

      var desc = el('div');
      desc.className = 'ri-desc';
      desc.textContent = item.size + ' \u00B7 ' + item.desc;

      info.appendChild(title);
      info.appendChild(desc);
      row.appendChild(info);

      list.appendChild(row);
    })(shredCats[i], i);
  }
  updateShredEstimate();
}

function toggleShredCat(idx) {
  shredCats[idx].checked = !shredCats[idx].checked;
  renderShredCats();
}

function updateShredEstimate() {
  var total = 0;
  for (var i = 0; i < shredCats.length; i++) {
    if (shredCats[i].checked) {
      total += parseSizeMB(shredCats[i].size);
    }
  }
  var str = '~' + formatSizeMB(total);
  $('estSpace').textContent = str;
}

var shredPhases = [
  { name: '\u626B\u63CF\u76EE\u6807...', hint: '\u8BC6\u522B\u5F85\u64E6\u9664\u6587\u4EF6', pct: 0, duration: 900 },
  { name: '\u8986\u5199\u4E2D (1/3)...', hint: '\u968F\u673A\u6570\u636E\u5199\u5165', pct: 33, duration: 1000 },
  { name: '\u8986\u5199\u4E2D (2/3)...', hint: '\u53CD\u7801\u8986\u5199', pct: 66, duration: 1000 },
  { name: '\u8986\u5199\u4E2D (3/3)...', hint: '\u96F6\u8986\u5199\u6821\u9A8C', pct: 100, duration: 1000 }
];

function startShred() {
  var checkedCount = 0;
  for (var i = 0; i < shredCats.length; i++) {
    if (shredCats[i].checked) checkedCount++;
  }
  if (checkedCount === 0) {
    toast('\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u9879\u6E05\u7406\u8303\u56F4');
    return;
  }

  shredAborted = false;
  isShredCancelled = false;

  var overlay = $('shredOverlay');
  overlay.classList.add('show');
  $('phaseText').textContent = '\u51C6\u5907\u626B\u63CF...';
  $('progBar').style.width = '0%';
  $('progPct').textContent = '0%';
  $('hintText').textContent = '\u6570\u636E\u8986\u5199\u4E2D';

  shredLog('\u5F00\u59CB\u7C89\u788E \u00B7 \u7EA7\u522B: ' + (shredLevelNames[currentLevel] || 'DoD'));
  runShredPhase(0);
}

function runShredPhase(index) {
  if (shredAborted || isShredCancelled) return;
  if (index >= shredPhases.length) {
    finishShred();
    return;
  }

  var phase = shredPhases[index];
  $('phaseText').textContent = phase.name;
  $('hintText').textContent = phase.hint;
  shredLog(phase.name + ' ' + phase.hint);

  var prevPct = index > 0 ? shredPhases[index - 1].pct : 0;
  var targetPct = phase.pct;
  var duration = phase.duration;
  var startTime = null;

  function anim(ts) {
    if (shredAborted || isShredCancelled) return;
    if (!startTime) startTime = ts;
    var elapsed = ts - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var current = prevPct + (targetPct - prevPct) * progress;
    $('progBar').style.width = current + '%';
    $('progPct').textContent = Math.round(current) + '%';
    if (progress < 1) {
      requestAnimationFrame(anim);
    } else {
      runShredPhase(index + 1);
    }
  }

  requestAnimationFrame(anim);
}

function finishShred() {
  $('progBar').style.width = '100%';
  $('progPct').textContent = '100%';
  $('phaseText').textContent = '\u64E6\u9664\u5B8C\u6210';
  $('hintText').textContent = '\u6240\u6709\u6570\u636E\u5DF2\u5B89\u5168\u8986\u5199';

  setTimeout(function () {
    $('shredOverlay').classList.remove('show');
  }, 600);

  celebParticles();
  shredLog('\u7C89\u788E\u5B8C\u6210');

  cleanCount++;
  lastCleanTime = '\u521A\u521A';

  var total = 0;
  for (var i = 0; i < shredCats.length; i++) {
    if (shredCats[i].checked) {
      total += parseSizeMB(shredCats[i].size);
    }
  }
  var prevSpace = parseFloat(totalSpace);
  if (isNaN(prevSpace)) prevSpace = 0;
  totalSpace = (prevSpace + total / 1024).toFixed(1) + 'GB';

  $('statClean').textContent = cleanCount;
  $('statTime').textContent = lastCleanTime;
  $('statSpace').textContent = totalSpace;

  var newScore = Math.min(100, scoreValue + 10);
  updateScore(newScore);

  showReport();
}

function cancelShred() {
  isShredCancelled = true;
  shredAborted = true;
  $('shredOverlay').classList.remove('show');
  shredLog('\u53D6\u6D88\u7C89\u788E');
  toast('\u5DF2\u53D6\u6D88\u7C89\u788E\u64CD\u4F5C');
}

function showReport() {
  var checkedFiles = 0;
  var checkedSpace = 0;
  for (var i = 0; i < shredCats.length; i++) {
    if (shredCats[i].checked) {
      checkedFiles += Math.floor(Math.random() * 30 + 10);
      checkedSpace += parseSizeMB(shredCats[i].size);
    }
  }

  $('repFiles').textContent = checkedFiles;
  $('repSpace').textContent = formatSizeMB(checkedSpace);
  $('repTime').textContent = '12s';
  $('repLevel').textContent = shredLevelNames[currentLevel] || 'DoD';

  $('reportOverlay').classList.add('show');
}

function closeReport() {
  $('reportOverlay').classList.remove('show');
  switchTab('dashboard');
}

/* ── Anonymous Access ── */

function randomIP() {
  return Math.floor(Math.random() * 256) + '.' +
         Math.floor(Math.random() * 256) + '.' +
         Math.floor(Math.random() * 256) + '.' +
         Math.floor(Math.random() * 256);
}

function formatTimeWithSec(d) {
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
}

function toggleAnonMaster() {
  if (anonState.active) {
    anonState.active = false;
    anonState.exitIp = null;
    anonState.latency = null;
    anonState.nodeCount = null;
    anonState.encrypt = null;
    $('anonMasterToggle').classList.remove('on');
    $('anonIndicator').classList.remove('on', 'tunnel-connecting');
    $('anonIndicator').classList.add('off');
    $('anonStatusText').textContent = '\u96A7\u9053\u5DF2\u65AD\u5F00';
    $('anonDetailText').textContent = '\u672A\u5EFA\u7ACB\u8FDE\u63A5';
    addAnonLog('disconnect', '\u96A7\u9053\u5DF2\u65AD\u5F00');
    updateAnonUI();
    toast('\u5DF2\u65AD\u5F00\u96A7\u9053\u8FDE\u63A5');
    shredLog('\u533F\u540D\u96A7\u9053\u5DF2\u65AD\u5F00');
  } else {
    $('anonMasterToggle').classList.add('on');
    $('anonIndicator').classList.add('tunnel-connecting');
    $('anonIndicator').classList.remove('off');
    $('anonStatusText').textContent = '\u8FDE\u63A5\u4E2D...';
    $('anonDetailText').textContent = '\u5EFA\u7ACB\u52A0\u5BC6\u96A7\u9053';
    shredLog('\u533F\u540D\u96A7\u9053\u8FDE\u63A5\u4E2D...');

    setTimeout(function () {
      anonState.active = true;
      anonState.exitIp = randomIP();
      anonState.latency = (Math.random() * 200 + 30).toFixed(0) + 'ms';
      anonState.nodeCount = Math.floor(Math.random() * 5 + 2);
      if (anonState.tunnelType === 'tor') anonState.encrypt = 'AES-256 + RSA';
      else if (anonState.tunnelType === 'vpn') anonState.encrypt = 'AES-256-GCM';
      else anonState.encrypt = 'ChaCha20';

      $('anonIndicator').classList.remove('tunnel-connecting');
      $('anonIndicator').classList.add('on');
      $('anonIndicator').classList.remove('off');
      $('anonStatusText').textContent = '\u5DF2\u8FDE\u63A5 \u00B7 \u533F\u540D\u4FDD\u62A4\u4E2D';
      $('anonDetailText').textContent = '\u51FA\u53E3 ' + anonState.exitIp + ' \u00B7 ' + anonState.latency;

      updateAnonUI();
      addAnonLog('connect', '\u96A7\u9053\u5DF2\u5EFA\u7ACB \u00B7 ' + anonState.exitIp);
      toast('\u96A7\u9053\u8FDE\u63A5\u6210\u529F');
      shredLog('\u533F\u540D\u96A7\u9053\u5DF2\u5EFA\u7ACB \u00B7 ' + anonState.exitIp);
    }, 1800);
  }
}

function selectTunnel(type, elm) {
  anonState.tunnelType = type;
  var opts = document.querySelectorAll('#tunnelTypes .tunnel-opt');
  for (var i = 0; i < opts.length; i++) {
    opts[i].classList.remove('active');
  }
  if (elm) elm.classList.add('active');

  var names = { tor: 'Tor', vpn: 'VPN', socks5: 'SOCKS5' };
  toast('\u96A7\u9053\u7C7B\u578B: ' + (names[type] || type));

  if (anonState.active) {
    if (type === 'tor') anonState.encrypt = 'AES-256 + RSA';
    else if (type === 'vpn') anonState.encrypt = 'AES-256-GCM';
    else anonState.encrypt = 'ChaCha20';
    updateAnonUI();
  }
  shredLog('\u5207\u6362\u96A7\u9053\u7C7B\u578B: ' + (names[type] || type));
}

function renderAnonApps() {
  var list = $('anonAppList');
  if (!list) return;
  list.innerHTML = '';

  for (var i = 0; i < anonApps.length; i++) {
    (function (app, idx) {
      var row = el('div');
      row.className = 'app-route-row';
      row.onclick = function () { toggleAnonApp(idx); };

      var icon = el('div');
      icon.className = 'ar-icon';
      icon.textContent = app.icon;

      var info = el('div');
      info.className = 'ar-info';

      var name = el('div');
      name.className = 'ar-name';
      name.textContent = app.name;

      var sub = el('div');
      sub.className = 'ar-sub';
      sub.textContent = app.tunnel ? '\u96A7\u9053\u4EE3\u7406 \u00B7 \u52A0\u5BC6\u6D41\u91CF' : '\u76F4\u8FDE\u7F51\u7EDC \u00B7 \u672A\u52A0\u5BC6';

      info.appendChild(name);
      info.appendChild(sub);

      var badge = el('div');
      badge.className = 'ar-badge ' + (app.tunnel ? 'ar-tunnel' : 'ar-direct');
      badge.textContent = app.tunnel ? '\u96A7\u9053' : '\u76F4\u8FDE';

      row.appendChild(icon);
      row.appendChild(info);
      row.appendChild(badge);

      list.appendChild(row);
    })(anonApps[i], i);
  }
}

function toggleAnonApp(idx) {
  anonApps[idx].tunnel = !anonApps[idx].tunnel;
  renderAnonApps();
  var mode = anonApps[idx].tunnel ? '\u96A7\u9053\u4EE3\u7406' : '\u76F4\u8FDE';
  toast(anonApps[idx].name + ' \u2192 ' + mode);
  addAnonLog('route', anonApps[idx].name + ' \u2192 ' + mode);
}

function updateAnonUI() {
  $('aiIp').textContent = anonState.exitIp || '\u2014';
  $('aiLatency').textContent = anonState.latency || '\u2014';
  $('aiNode').textContent = anonState.nodeCount ? anonState.nodeCount + ' \u4E2A\u8282\u70B9' : '\u2014';
  $('aiEncrypt').textContent = anonState.encrypt || '\u2014';
}

function renderAnonLog() {
  var list = $('anonLogList');
  if (!list) return;
  list.innerHTML = '';

  if (anonLogs.length === 0) {
    var empty = el('div');
    empty.className = 'log-item';
    empty.style.justifyContent = 'center';
    empty.textContent = '\u6682\u65E0\u65E5\u5FD7';
    list.appendChild(empty);
    return;
  }

  for (var i = anonLogs.length - 1; i >= 0; i--) {
    var log = anonLogs[i];
    var item = el('div');
    item.className = 'log-item';

    var timeSpan = el('span');
    timeSpan.className = 'lg-time';
    timeSpan.textContent = log.time;

    var msgSpan = el('span');
    msgSpan.className = 'lg-msg';
    msgSpan.textContent = log.msg;

    var status = el('span');
    status.className = log.ok ? 'lg-ok' : 'lg-err';
    status.textContent = log.ok ? '\u2713' : '\u2717';

    item.appendChild(timeSpan);
    item.appendChild(msgSpan);
    item.appendChild(status);

    list.appendChild(item);
  }
}

function addAnonLog(type, msg) {
  var timeStr = formatTimeWithSec(new Date());
  anonLogs.push({
    time: timeStr,
    msg: msg,
    ok: true,
    type: type
  });
  renderAnonLog();
}

/* ── Settings ── */

function toggleSetting(key, elm) {
  settings[key] = !settings[key];

  if (settings[key]) {
    elm.classList.add('on');
  } else {
    elm.classList.remove('on');
  }

  var labels = {
    autoClean: '\u81EA\u52A8\u6E05\u7406',
    clipboard: '\u526A\u8D34\u677F\u76D1\u63A7',
    disguise: '\u4F2A\u88C5\u6A21\u5F0F',
    antiScreen: '\u9632\u622A\u5C4F',
    logSuppress: '\u65E5\u5FD7\u6291\u5236'
  };
  toast((labels[key] || key) + (settings[key] ? ' \u5DF2\u5F00\u542F' : ' \u5DF2\u5173\u95ED'));

  if (key === 'disguise') {
    if (settings.disguise) {
      $('headerTitle').textContent = '\u8BA1\u7B97\u5668';
      $('headerSub').textContent = 'Calculator';
    } else {
      updateNavTitle(currentTab);
    }
  }
}

var actionSheetType = '';

function openActionSheet(type) {
  actionSheetType = type;
  var overlay = $('actionOverlay');
  var title = $('actionTitle');
  var options = $('actionOptions');
  if (!overlay || !title || !options) return;

  if (type === 'level') {
    title.textContent = '\u9009\u62E9\u64E6\u9664\u7EA7\u522B';
    options.innerHTML = '';

    var levels = [
      { value: 'standard', label: '\u6807\u51C6\u64E6\u9664', desc: '\u5355\u6B21\u968F\u673A\u8986\u5199 \u00B7 1 pass' },
      { value: 'deep', label: '\u6DF1\u5EA6\u64E6\u9664', desc: 'DoD 5220.22-M \u00B7 3 passes' },
      { value: 'military', label: '\u519B\u4E8B\u7EA7\u64E6\u9664', desc: 'Gutmann \u7B97\u6CD5 \u00B7 35 passes' }
    ];

    for (var i = 0; i < levels.length; i++) {
      (function (lvl) {
        var opt = el('div');
        opt.className = 'action-opt';
        if (settings.erasureLevel === lvl.value) opt.classList.add('selected');
        opt.onclick = function () { selectActionOption(lvl.value, lvl.label); };

        var labelDiv = el('div');
        var aoLabel = el('div');
        aoLabel.className = 'ao-label';
        aoLabel.textContent = lvl.label;

        var aoDesc = el('div');
        aoDesc.className = 'ao-desc';
        aoDesc.textContent = lvl.desc;

        labelDiv.appendChild(aoLabel);
        labelDiv.appendChild(aoDesc);
        opt.appendChild(labelDiv);

        if (settings.erasureLevel === lvl.value) {
          var mark = el('span');
          mark.style.color = '#007AFF';
          mark.style.fontSize = '18px';
          mark.style.fontWeight = '600';
          mark.textContent = '\u2713';
          opt.appendChild(mark);
        }

        options.appendChild(opt);
      })(levels[i]);
    }
  } else if (type === 'interval') {
    title.textContent = '\u6E05\u7406\u95F4\u9694';
    options.innerHTML = '';

    var intervals = [
      { value: 6, label: '\u6BCF 6 \u5C0F\u65F6' },
      { value: 12, label: '\u6BCF 12 \u5C0F\u65F6' },
      { value: 24, label: '\u6BCF 24 \u5C0F\u65F6' },
      { value: 48, label: '\u6BCF 48 \u5C0F\u65F6' }
    ];

    for (var j = 0; j < intervals.length; j++) {
      (function (inter) {
        var opt = el('div');
        opt.className = 'action-opt';
        if (settings.cleanInterval === inter.value) opt.classList.add('selected');
        opt.onclick = function () { selectActionOption(inter.value, inter.label); };

        var aoLabel = el('div');
        aoLabel.className = 'ao-label';
        aoLabel.textContent = inter.label;
        opt.appendChild(aoLabel);

        if (settings.cleanInterval === inter.value) {
          var mark = el('span');
          mark.style.color = '#007AFF';
          mark.style.fontSize = '18px';
          mark.style.fontWeight = '600';
          mark.textContent = '\u2713';
          opt.appendChild(mark);
        }

        options.appendChild(opt);
      })(intervals[j]);
    }
  }

  overlay.classList.add('show');
}

function closeActionSheet() {
  $('actionOverlay').classList.remove('show');
}

function selectActionOption(value, label) {
  if (actionSheetType === 'level') {
    settings.erasureLevel = value;
    var descText = label;
    if (value === 'standard') descText = descText + ' \u00B7 1 pass';
    else if (value === 'deep') descText = descText + ' \u00B7 DoD \u6807\u51C6';
    else descText = descText + ' \u00B7 Gutmann \u7B97\u6CD5';
    $('setErasureLevel').textContent = descText;
  } else if (actionSheetType === 'interval') {
    settings.cleanInterval = value;
    $('setCleanInterval').textContent = label;
  }
  closeActionSheet();
  toast('\u5DF2\u8BBE\u7F6E: ' + label);
}

function showCleanHistory() {
  toast('\u5171 12 \u6761\u6E05\u7406\u8BB0\u5F55');
}

function clearAllRecords() {
  var overlay = $('confirmOverlay');
  if (!overlay) return;

  $('confirmTitle').textContent = '\u6E05\u9664\u6240\u6709\u8BB0\u5F55';
  $('confirmMsg').textContent = '\u6B64\u64CD\u4F5C\u5C06\u6C38\u4E45\u5220\u9664\u6240\u6709\u6E05\u7406\u5386\u53F2\u8BB0\u5F55\u4E0E\u52A0\u5BC6\u6570\u636E\u5E93\uFF0C\u4E0D\u53EF\u6062\u590D\u3002';

  var oldBtn = $('confirmOkBtn');
  var newBtn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(newBtn, oldBtn);
  newBtn.textContent = '\u786E\u8BA4\u6E05\u9664';
  newBtn.onclick = function () {
    closeConfirm();
    toast('\u6240\u6709\u8BB0\u5F55\u5DF2\u6E05\u9664');
    $('setCleanHistory').textContent = '\u5171 0 \u6761\u8BB0\u5F55';
    shredLog('\u6E05\u9664\u6240\u6709\u8BB0\u5F55');
  };

  overlay.classList.add('show');
}

function closeConfirm() {
  $('confirmOverlay').classList.remove('show');
}

/* ── Navigation ── */

var tabNames = {
  dashboard: { title: '\u9690\u79C1\u7A7A\u95F4', sub: 'Privacy Space' },
  clean: { title: '\u6570\u636E\u6E05\u7406', sub: 'Quick Clean' },
  shred: { title: '\u6587\u4EF6\u7C89\u788E', sub: 'Secure Shredder' },
  anonymous: { title: '\u533F\u540D\u8BBF\u95EE', sub: 'Anonymous Access' },
  settings: { title: '\u8BBE\u7F6E', sub: 'Settings' }
};

var tabOrder = ['dashboard', 'clean', 'shred', 'anonymous', 'settings'];

function switchTab(tab) {
  if (isTransitioning) return;
  if (tab === currentTab) return;
  if ($('shredOverlay').classList.contains('show')) return;
  if ($('reportOverlay').classList.contains('show')) return;

  var oldIndex = tabOrder.indexOf(currentTab);
  var newIndex = tabOrder.indexOf(tab);

  if (oldIndex === -1 || newIndex === -1) return;

  var direction = newIndex > oldIndex ? 'right' : 'left';

  isTransitioning = true;

  var oldPage = $('page-' + currentTab);
  var newPage = $('page-' + tab);

  if (!oldPage || !newPage) {
    isTransitioning = false;
    return;
  }

  var allPages = document.querySelectorAll('.page');
  for (var i = 0; i < allPages.length; i++) {
    allPages[i].classList.remove('slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right', 'active');
  }

  if (direction === 'right') {
    oldPage.classList.add('slide-out-left');
    newPage.classList.add('slide-in-right');
  } else {
    oldPage.classList.add('slide-out-right');
    newPage.classList.add('slide-in-left');
  }

  var prevTab = currentTab;
  currentTab = tab;
  updateNavTitle(tab);

  var tabItems = document.querySelectorAll('.tab-item');
  for (var j = 0; j < tabItems.length; j++) {
    tabItems[j].classList.remove('active');
    if (tabItems[j].getAttribute('data-tab') === tab) {
      tabItems[j].classList.add('active');
    }
  }

  setTimeout(function () {
    oldPage.classList.remove('slide-out-left', 'slide-out-right', 'active');
    newPage.classList.remove('slide-in-right', 'slide-in-left');
    newPage.classList.add('active');
    isTransitioning = false;
    $('mainScroll').scrollTop = 0;

    shredLog('\u5207\u6362\u9875\u9762: ' + prevTab + ' \u2192 ' + tab);
  }, 360);
}

function updateNavTitle(tab) {
  if (settings.disguise && tab === 'dashboard') {
    $('headerTitle').textContent = '\u8BA1\u7B97\u5668';
    $('headerSub').textContent = 'Calculator';
  } else if (tabNames[tab]) {
    $('headerTitle').textContent = tabNames[tab].title;
    $('headerSub').textContent = tabNames[tab].sub;
  }
}

/* ── Celebration Particles ── */

function celebParticles() {
  var container = $('particleContainer');
  if (!container) return;

  var colors = [
    '#007AFF', '#34C759', '#FF9500', '#FF3B30',
    '#AF52DE', '#FF2D55', '#5856D6', '#00C7BE',
    '#FFD60A', '#BF5AF2'
  ];

  for (var i = 0; i < 30; i++) {
    (function () {
      var particle = el('div');
      particle.className = 'particle';
      var size = Math.random() * 8 + 4;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = (Math.random() * 40 + 30) + '%';

      var px = (Math.random() - 0.5) * 200;
      var py = (Math.random() - 0.5) * 200 - 40;
      particle.style.setProperty('--px', px + 'px');
      particle.style.setProperty('--py', py + 'px');

      container.appendChild(particle);

      particle.addEventListener('animationend', function () {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      });
    })();
  }
}

/* ── Shred Log ── */

function shredLog(msg) {
  var prefixes = ['[\u7C89\u788E\u5F15\u64CE]', '[\u64E6\u9664]', '[\u8986\u5199]', '[\u6821\u9A8C]'];
  var prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  if (window.console) console.log(prefix + ' ' + msg);
}

/* ── Init ── */

function init() {
  updateClock();
  startClock();
  animateScoreEntrance();

  renderRisks();
  renderClean();
  renderShredCats();
  renderAnonApps();
  renderAnonLog();

  initRippleEffects();
  initLongPress();

  updateScoreColor(scoreValue);
  updateStatusDot(scoreValue);
}

/* ── Document Ready ── */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}