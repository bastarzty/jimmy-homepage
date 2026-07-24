// ---------- 配置 ----------
// 去 Supabase 建好项目和表之后，把下面两个值换成你自己的（看 README 里的说明）
const SUPABASE_URL = 'REPLACE_WITH_YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'REPLACE_WITH_YOUR_SUPABASE_ANON_KEY';

const TOTAL_CARDS = 65; // 以后180张全的时候，把这个数字改成 180
const CARD_PREFIX = 'assets/archive/card-';

function cardId(n) {
  return String(n).padStart(3, '0');
}

function cardSrc(n) {
  return `${CARD_PREFIX}${cardId(n)}.png`;
}

// ---------- Supabase（点赞持久化） ----------
let supabaseClient = null;
if (window.supabase && !SUPABASE_URL.startsWith('REPLACE_WITH')) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const likeCache = {};

async function fetchAllLikes() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('likes').select('card_id, count');
    if (error) throw error;
    data.forEach(row => { likeCache[row.card_id] = row.count; });
  } catch (e) {
    console.error('读取点赞数失败', e);
  }
}

async function incrementLike(id) {
  if (!supabaseClient) {
    // 没接 Supabase 之前的本地兜底，仅本次浏览有效，刷新会重置
    likeCache[id] = (likeCache[id] || 0) + 1;
    return likeCache[id];
  }
  try {
    const { data, error } = await supabaseClient.rpc('increment_like', { p_card_id: id });
    if (error) throw error;
    likeCache[id] = data;
    return data;
  } catch (e) {
    console.error('点赞失败', e);
    return likeCache[id] || 0;
  }
}

// ---------- 洗牌 ----------
function shuffledOrder(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- DOM ----------
const wallGrid = document.getElementById('wallGrid');
const viewWall = document.getElementById('viewWall');
const viewDetail = document.getElementById('viewDetail');
const bigImage = document.getElementById('bigImage');
const likeCountEl = document.getElementById('likeCount');
const likeIcon = document.getElementById('likeIcon');
const likeBtn = document.getElementById('likeBtn');
const moreGrid = document.getElementById('moreGrid');
const backBtn = document.getElementById('backBtn');
const shareBtn = document.getElementById('shareBtn');
const shareMenu = document.getElementById('shareMenu');
const downloadOpt = document.getElementById('downloadOpt');
const shareLinkOpt = document.getElementById('shareLinkOpt');

let order = [];
let currentId = null;
const likedThisSession = new Set();

function renderWall() {
  wallGrid.innerHTML = '';
  order.forEach(n => {
    const img = document.createElement('img');
    img.src = cardSrc(n);
    img.loading = 'lazy';
    img.alt = '';
    img.className = 'a-wall-item';
    img.addEventListener('click', () => openDetail(n));
    wallGrid.appendChild(img);
  });
}

function renderMore() {
  moreGrid.innerHTML = '';
  const others = order.filter(n => n !== currentId);
  const picks = [];
  for (let i = 0; i < 8 && others.length > 0; i++) {
    const idx = Math.floor(Math.random() * others.length);
    picks.push(others.splice(idx, 1)[0]);
  }
  picks.forEach(n => {
    const img = document.createElement('img');
    img.src = cardSrc(n);
    img.loading = 'lazy';
    img.alt = '';
    img.addEventListener('click', () => openDetail(n));
    moreGrid.appendChild(img);
  });
}

async function openDetail(n) {
  currentId = n;
  viewWall.style.display = 'none';
  viewDetail.style.display = 'block';
  bigImage.src = cardSrc(n);

  const id = cardId(n);
  likeCountEl.textContent = likeCache[id] ?? 0;
  likeIcon.classList.toggle('liked', likedThisSession.has(id));

  renderMore();

  const url = new URL(window.location);
  url.searchParams.set('card', id);
  window.history.pushState({}, '', url);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeDetail() {
  viewDetail.style.display = 'none';
  viewWall.style.display = 'block';
  const url = new URL(window.location);
  url.searchParams.delete('card');
  window.history.pushState({}, '', url);
}

likeBtn.addEventListener('click', async () => {
  const id = cardId(currentId);
  if (likedThisSession.has(id)) return; // 防止连点狂加
  likedThisSession.add(id);
  likeIcon.classList.add('liked');
  const newCount = await incrementLike(id);
  likeCountEl.textContent = newCount;
});

backBtn.addEventListener('click', closeDetail);

shareBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  shareMenu.classList.toggle('active');
});

downloadOpt.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = cardSrc(currentId);
  a.download = `jimmy-birthday-card-${cardId(currentId)}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  shareMenu.classList.remove('active');
});

shareLinkOpt.addEventListener('click', async () => {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Jimmy's Page — 2025 Archive", url });
    } catch (e) {
      /* 用户取消分享面板，忽略 */
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch (e) {
      prompt('Copy this link:', url);
    }
  }
  shareMenu.classList.remove('active');
});

document.addEventListener('click', (e) => {
  if (shareMenu.classList.contains('active') && !shareMenu.contains(e.target) && e.target !== shareBtn) {
    shareMenu.classList.remove('active');
  }
});

window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  const cardParam = params.get('card');
  if (cardParam) {
    openDetail(parseInt(cardParam, 10));
  } else {
    closeDetail();
  }
});

async function init() {
  await fetchAllLikes();
  order = shuffledOrder(TOTAL_CARDS);
  renderWall();

  const params = new URLSearchParams(window.location.search);
  const cardParam = params.get('card');
  if (cardParam) {
    const n = parseInt(cardParam, 10);
    if (n >= 1 && n <= TOTAL_CARDS) openDetail(n);
  }
}

init();
