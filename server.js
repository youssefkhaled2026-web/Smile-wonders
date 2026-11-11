'use strict';
/* Smile Wonders store server. No dependencies, Node 16 or newer. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = +process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;
const PUB = path.join(ROOT, 'public');
const DATA = process.env.DATA_DIR || path.join(ROOT, 'data');
const UP = path.join(DATA, 'uploads');
fs.mkdirSync(UP, { recursive: true });

const STATUSES = ['new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
const CATS = ['paste', 'brush', 'baby', 'mouthwash'];
const TYPES = ['jar', 'bottle', 'brush'];

class HttpErr extends Error {
  constructor(status, msg, extra) { super(msg); this.status = status; this.extra = extra || {}; }
}

/* ---------- data ---------- */
function seed() {
  const P = (id, en, ar, price, cat, type, col, tag, best, out) => ({
    id, en, ar, price, discount: 0, cat, best: !!best, active: true, inStock: !out, type, col, tag, image: ''
  });
  return {
    settings: {
      shipFee: 60, freeShip: 600, saleAll: 0,
      wa: '201000000000', phone: '+20 100 000 0000',
      hours: { en: 'Daily, 10:00 to 22:00', ar: 'يومياً من 10 صباحاً حتى 10 مساءً' },
      address: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
      images: { hero: '', dentist: '', logo: '' }
    },
    coupons: [{ code: 'WELCOME10', type: 'percent', value: 10, min: 0, active: false }],
    products: [
      P('mint', 'Pro Whitening Toothpaste, Fresh Mint', 'معجون التبييض برو، نعناع منعش', 275, 'paste', 'jar', '#14A89B', 'MINT', 1),
      P('mango', 'Pro Whitening Toothpaste, Mango', 'معجون التبييض برو، مانجو', 275, 'paste', 'jar', '#E9801C', 'MANGO', 1),
      P('coco', 'Gentle Care Toothpaste, Coconut', 'معجون العناية اللطيفة، جوز الهند', 265, 'paste', 'jar', '#8A5B44', 'COCONUT'),
      P('char', 'Charcoal Detox Toothpaste', 'معجون الفحم للتنظيف العميق', 249, 'paste', 'jar', '#34474A', 'CHARCOAL', 1),
      P('kids', 'Kids Toothpaste, Strawberry', 'معجون الأطفال، فراولة', 199, 'baby', 'jar', '#E0456B', 'KIDS'),
      P('brush', 'Bamboo Toothbrush + Travel Bag', 'فرشاة خيزران + كيس سفر', 149, 'brush', 'brush', '#D6AE72', 'BAMBOO', 1),
      P('gel', 'Baby Teething Gel', 'جل التسنين للأطفال', 320, 'baby', 'jar', '#5E84E0', 'BABY'),
      P('wash', 'Whitening Mouthwash, Spearmint', 'غسول الفم للتبييض، سبيرمنت', 189, 'mouthwash', 'bottle', '#1E9DBA', 'SPEARMINT', 0, 1)
    ],
    orders: []
  };
}

const DBF = path.join(DATA, 'db.json');
let db;
try { db = JSON.parse(fs.readFileSync(DBF, 'utf8')); } catch (e) { db = seed(); }
{
  const d = seed();
  db.settings = Object.assign({}, d.settings, db.settings);
  db.settings.hours = Object.assign({}, d.settings.hours, db.settings.hours);
  db.settings.address = Object.assign({}, d.settings.address, db.settings.address);
  db.settings.images = Object.assign({}, d.settings.images, db.settings.images);
  db.coupons = Array.isArray(db.coupons) ? db.coupons : d.coupons;
  db.products = Array.isArray(db.products) ? db.products : d.products;
  db.orders = Array.isArray(db.orders) ? db.orders : [];
}
function save() {
  const tmp = DBF + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DBF);
}
save();

/* ---------- secrets ---------- */
const secretFile = path.join(DATA, 'secret.key');
let SECRET = '';
try { SECRET = fs.readFileSync(secretFile, 'utf8').trim(); } catch (e) { /* first run */ }
if (SECRET.length < 32) {
  SECRET = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(secretFile, SECRET, { mode: 0o600 });
}
const pwFile = path.join(DATA, 'admin-password.txt');
let ADMIN_PW = process.env.ADMIN_PASSWORD || '';
let pwGenerated = false;
if (!ADMIN_PW) { try { ADMIN_PW = fs.readFileSync(pwFile, 'utf8').trim(); } catch (e) { /* none yet */ } }
if (!ADMIN_PW) {
  ADMIN_PW = crypto.randomBytes(9).toString('base64url');
  fs.writeFileSync(pwFile, ADMIN_PW + '\n', { mode: 0o600 });
  pwGenerated = true;
}
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
const pwOk = (s) => crypto.timingSafeEqual(sha(s), sha(ADMIN_PW));
const sign = (s) => crypto.createHmac('sha256', SECRET).update(s).digest('hex');
function makeToken() { const exp = String(Date.now() + 7 * 864e5); return exp + '.' + sign('s.' + exp); }
function isAdmin(req) {
  const m = /(?:^|;\s*)sw_admin=([^;]+)/.exec(req.headers.cookie || '');
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || +exp < Date.now()) return false;
  const want = sign('s.' + exp);
  return sig.length === want.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want));
}

/* ---------- helpers ---------- */
const hits = new Map();
function limited(key, max, win) {
  const now = Date.now();
  const a = (hits.get(key) || []).filter((t) => now - t < win);
  a.push(now);
  hits.set(key, a);
  return a.length > max;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, a] of hits) if (!a.length || now - a[a.length - 1] > 3600e3) hits.delete(k);
}, 600e3).unref();
const ipOf = (req) => (String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?');

function send(res, code, obj, headers) {
  const b = JSON.stringify(obj);
  res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers || {}));
  res.end(b);
}
function readBody(req, limit) {
  return new Promise((ok, no) => {
    let n = 0; const ch = [];
    req.on('data', (c) => {
      n += c.length;
      if (n > limit) { no(new HttpErr(413, 'too_large')); req.destroy(); return; }
      ch.push(c);
    });
    req.on('end', () => ok(Buffer.concat(ch)));
    req.on('error', no);
  });
}
async function jbody(req) {
  const b = await readBody(req, 200 * 1024);
  try { const j = JSON.parse(b.toString('utf8') || '{}'); return j && typeof j === 'object' ? j : {}; }
  catch (e) { throw new HttpErr(400, 'bad_json'); }
}
const str = (v, min, max) => {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s.length >= min && s.length <= max ? s : null;
};
function normPhone(v) {
  let s = String(v || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[^\d+]/g, '');
  if (s.startsWith('+20')) s = '0' + s.slice(3);
  else if (s.startsWith('0020')) s = '0' + s.slice(4);
  else if (/^20\d{10}$/.test(s)) s = '0' + s.slice(2);
  return /^01[0125]\d{8}$/.test(s) ? s : null;
}
function imgPath(v) {
  if (!v) return '';
  if (typeof v !== 'string') return null;
  const m = /^\/uploads\/([a-f0-9]{16}\.(?:png|jpg|webp|gif))$/.exec(v);
  if (!m || !fs.existsSync(path.join(UP, m[1]))) return null;
  return v;
}
function sniff(b) {
  if (b.length < 12) return null;
  if (b[0] === 0x89 && b.toString('latin1', 1, 4) === 'PNG') return 'png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.toString('latin1', 0, 4) === 'GIF8') return 'gif';
  if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return 'webp';
  return null;
}

/* ---------- pricing (the server decides every price) ---------- */
const effDiscount = (p) => (p.discount > 0 ? p.discount : (db.settings.saleAll || 0));
const unitPrice = (p) => Math.round(p.price * (100 - effDiscount(p)) / 100);

function quote(items, code) {
  if (!Array.isArray(items) || !items.length || items.length > 30) return { error: 'empty' };
  const merged = new Map();
  for (const it of items) {
    if (!it || typeof it.id !== 'string') return { error: 'item' };
    const q = Math.floor(+it.q);
    if (!(q >= 1 && q <= 20)) return { error: 'qty' };
    merged.set(it.id, Math.min(20, (merged.get(it.id) || 0) + q));
  }
  const lines = []; let sub = 0;
  for (const [id, q] of merged) {
    const p = db.products.find((x) => x.id === id);
    if (!p || !p.active || !p.inStock) return { error: 'item', id };
    const unit = unitPrice(p);
    lines.push({ id, en: p.en, ar: p.ar, price: p.price, unit, q, image: p.image || '' });
    sub += unit * q;
  }
  let off = 0, couponCode = null, couponErr = null;
  const c0 = String(code || '').trim().toUpperCase();
  if (c0) {
    const c = db.coupons.find((x) => x.active && x.code === c0);
    if (!c) couponErr = 'invalid';
    else if (sub < (c.min || 0)) couponErr = 'min';
    else { off = c.type === 'percent' ? Math.round(sub * c.value / 100) : Math.min(c.value, sub); couponCode = c.code; }
  }
  const goods = sub - off;
  const ship = goods >= db.settings.freeShip ? 0 : db.settings.shipFee;
  return { lines, sub, off, couponCode, couponErr, ship, total: goods + ship };
}

function publicProduct(p) {
  return { id: p.id, en: p.en, ar: p.ar, price: p.price, unit: unitPrice(p), disc: effDiscount(p), cat: p.cat, best: p.best, inStock: p.inStock, type: p.type, col: p.col, tag: p.tag, image: p.image };
}
function publicStore() {
  return { settings: db.settings, products: db.products.filter((p) => p.active).map(publicProduct) };
}

function cleanProduct(b, old) {
  const en = str(b.en, 1, 120), ar = str(b.ar, 1, 120);
  if (!en || !ar) return { bad: 'name' };
  const price = Math.round(+b.price);
  if (!(price >= 1 && price <= 100000)) return { bad: 'price' };
  const discount = Math.round(+b.discount || 0);
  if (!(discount >= 0 && discount <= 90)) return { bad: 'discount' };
  if (!CATS.includes(b.cat)) return { bad: 'cat' };
  const image = imgPath(b.image);
  if (image === null) return { bad: 'image' };
  const col = /^#[0-9a-fA-F]{6}$/.test(b.col || '') ? b.col : '#14A89B';
  const tag = String(b.tag || en.split(' ')[0]).replace(/[^A-Za-z0-9 ]/g, '').toUpperCase().slice(0, 8) || 'SW';
  const type = TYPES.includes(b.type) ? b.type : 'jar';
  return { ok: Object.assign({}, old || {}, { en, ar, price, discount, cat: b.cat, best: !!b.best, active: b.active !== false, inStock: b.inStock !== false, type, col, tag, image }) };
}
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'p'; }

function cleanConfig(b) {
  const s = b.settings || {}, out = {};
  const int = (v, lo, hi) => { const n = Math.round(+v); return n >= lo && n <= hi ? n : null; };
  out.shipFee = int(s.shipFee, 0, 5000);
  out.freeShip = int(s.freeShip, 0, 1000000);
  out.saleAll = int(s.saleAll, 0, 90);
  if ([out.shipFee, out.freeShip, out.saleAll].includes(null)) return { bad: 'numbers' };
  out.wa = String(s.wa || '').replace(/\D/g, '');
  if (out.wa && (out.wa.length < 8 || out.wa.length > 15)) return { bad: 'wa' };
  out.phone = String(s.phone || '').trim().slice(0, 30);
  const two = (o, n) => ({ en: String((o || {}).en || '').trim().slice(0, n), ar: String((o || {}).ar || '').trim().slice(0, n) });
  out.hours = two(s.hours, 80);
  out.address = two(s.address, 120);
  out.images = {};
  for (const k of ['hero', 'dentist', 'logo']) {
    const v = imgPath((s.images || {})[k]);
    if (v === null) return { bad: 'image' };
    out.images[k] = v;
  }
  const coupons = [];
  if (!Array.isArray(b.coupons) || b.coupons.length > 50) return { bad: 'coupons' };
  for (const c of b.coupons) {
    const code = String(c.code || '').trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,20}$/.test(code) || coupons.some((x) => x.code === code)) return { bad: 'coupon_code' };
    const type = c.type === 'fixed' ? 'fixed' : 'percent';
    const value = int(c.value, 1, type === 'percent' ? 90 : 100000);
    const min = int(c.min || 0, 0, 1000000);
    if (value === null || min === null) return { bad: 'coupon_value' };
    coupons.push({ code, type, value, min, active: !!c.active });
  }
  return { settings: out, coupons };
}

function newOrderId() {
  let id;
  do { id = 'SW-' + crypto.randomInt(100000, 1000000); } while (db.orders.some((o) => o.id === id));
  return id;
}

/* ---------- API ---------- */
async function api(req, res, u, p) {
  const m = req.method;
  if (m !== 'GET' && m !== 'HEAD' && req.headers['x-requested-with'] !== 'sw') throw new HttpErr(403, 'csrf');

  if (m === 'GET' && p === '/api/store') return send(res, 200, publicStore());

  if (m === 'POST' && p === '/api/quote') {
    const b = await jbody(req);
    const q = quote(b.items, b.coupon);
    if (q.error) return send(res, 409, { error: q.error });
    return send(res, 200, { sub: q.sub, off: q.off, couponErr: q.couponErr, ship: q.ship, total: q.total });
  }

  if (m === 'POST' && p === '/api/orders') {
    if (limited('ord:' + ipOf(req), 6, 3600e3)) throw new HttpErr(429, 'rate');
    const b = await jbody(req);
    if (b.website) return send(res, 200, { id: 'SW-000000' });
    const fields = [];
    const name = str(b.name, 3, 80); if (!name) fields.push('name');
    const phone = normPhone(b.phone); if (!phone) fields.push('phone');
    const gov = str(b.gov, 2, 40); if (!gov) fields.push('gov');
    const addr = str(b.addr, 8, 300); if (!addr) fields.push('addr');
    if (fields.length) return send(res, 400, { error: 'validation', fields });
    const q = quote(b.items, b.coupon);
    if (q.error) return send(res, 409, { error: q.error, id: q.id });
    if (q.couponErr) return send(res, 409, { error: 'coupon', reason: q.couponErr });
    if (b.expect !== undefined && Math.round(+b.expect) !== q.total) return send(res, 409, { error: 'price_changed' });
    const now = new Date().toISOString();
    const o = {
      id: newOrderId(), createdAt: now, status: 'new',
      history: [{ status: 'new', at: now, note: '' }],
      customer: { name, phone, gov, addr, notes: b.notes ? String(b.notes).trim().slice(0, 300) : '' },
      lines: q.lines, sub: q.sub, couponCode: q.couponCode, off: q.off, ship: q.ship, total: q.total,
      lang: b.lang === 'en' ? 'en' : 'ar', adminNote: ''
    };
    db.orders.push(o);
    save();
    return send(res, 201, { id: o.id, status: o.status, sub: o.sub, off: o.off, ship: o.ship, total: o.total, lines: o.lines });
  }

  if (m === 'GET' && p === '/api/track') {
    if (limited('trk:' + ipOf(req), 20, 600e3)) throw new HttpErr(429, 'rate');
    const id = String(u.searchParams.get('id') || '').trim().toUpperCase();
    const phone = normPhone(u.searchParams.get('phone'));
    const o = phone && db.orders.find((x) => x.id === id && x.customer.phone === phone);
    if (!o) throw new HttpErr(404, 'not_found');
    return send(res, 200, { id: o.id, status: o.status, history: o.history, createdAt: o.createdAt, lines: o.lines, sub: o.sub, off: o.off, ship: o.ship, total: o.total });
  }

  if (m === 'POST' && p === '/api/admin/login') {
    if (limited('login:' + ipOf(req), 10, 600e3)) throw new HttpErr(429, 'rate');
    const b = await jbody(req);
    if (typeof b.password !== 'string' || !pwOk(b.password)) throw new HttpErr(401, 'bad_password');
    const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'sw_admin=' + makeToken() + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800' + secure });
  }
  if (m === 'POST' && p === '/api/admin/logout') {
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'sw_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0' });
  }

  if (!p.startsWith('/api/admin/')) throw new HttpErr(404, 'not_found');
  if (!isAdmin(req)) throw new HttpErr(401, 'auth');

  if (m === 'GET' && p === '/api/admin/me') return send(res, 200, { ok: true });
  if (m === 'GET' && p === '/api/admin/orders') return send(res, 200, { orders: db.orders.slice().reverse() });

  let r = /^\/api\/admin\/orders\/(SW-\d{6})$/.exec(p);
  if (r) {
    const o = db.orders.find((x) => x.id === r[1]);
    if (!o) throw new HttpErr(404, 'not_found');
    if (m === 'PATCH') {
      const b = await jbody(req);
      if (b.status !== undefined) {
        if (!STATUSES.includes(b.status)) throw new HttpErr(400, 'bad_status');
        if (b.status !== o.status) {
          o.status = b.status;
          o.history.push({ status: b.status, at: new Date().toISOString(), note: str(b.note, 1, 300) || '' });
        }
      }
      if (b.adminNote !== undefined) o.adminNote = String(b.adminNote).slice(0, 1000);
      save();
      return send(res, 200, o);
    }
    if (m === 'DELETE') {
      if (o.status !== 'cancelled') throw new HttpErr(409, 'only_cancelled');
      db.orders = db.orders.filter((x) => x !== o);
      save();
      return send(res, 200, { ok: true });
    }
  }

  if (m === 'GET' && p === '/api/admin/products') return send(res, 200, { products: db.products });
  if (m === 'POST' && p === '/api/admin/products') {
    const c = cleanProduct(await jbody(req));
    if (c.bad) return send(res, 400, { error: 'validation', field: c.bad });
    c.ok.id = slug(c.ok.en) + '-' + crypto.randomBytes(2).toString('hex');
    db.products.push(c.ok);
    save();
    return send(res, 201, c.ok);
  }
  r = /^\/api\/admin\/products\/([a-z0-9-]+)$/.exec(p);
  if (r) {
    const old = db.products.find((x) => x.id === r[1]);
    if (!old) throw new HttpErr(404, 'not_found');
    if (m === 'PUT') {
      const c = cleanProduct(await jbody(req), old);
      if (c.bad) return send(res, 400, { error: 'validation', field: c.bad });
      db.products[db.products.indexOf(old)] = c.ok;
      save();
      return send(res, 200, c.ok);
    }
    if (m === 'DELETE') {
      db.products = db.products.filter((x) => x !== old);
      save();
      return send(res, 200, { ok: true });
    }
  }

  if (m === 'GET' && p === '/api/admin/config') return send(res, 200, { settings: db.settings, coupons: db.coupons });
  if (m === 'PUT' && p === '/api/admin/config') {
    const c = cleanConfig(await jbody(req));
    if (c.bad) return send(res, 400, { error: 'validation', field: c.bad });
    db.settings = c.settings;
    db.coupons = c.coupons;
    save();
    return send(res, 200, { settings: db.settings, coupons: db.coupons });
  }

  if (m === 'POST' && p === '/api/admin/upload') {
    const buf = await readBody(req, 6 * 1024 * 1024);
    const ext = sniff(buf);
    if (!ext) throw new HttpErr(415, 'unsupported_type');
    const name = crypto.randomBytes(8).toString('hex') + '.' + ext;
    fs.writeFileSync(path.join(UP, name), buf);
    return send(res, 201, { url: '/uploads/' + name });
  }

  throw new HttpErr(404, 'not_found');
}

/* ---------- static files ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml'
};
function serveStatic(req, res, p) {
  if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpErr(405, 'method');
  if (p === '/' || p === '') p = '/index.html';
  if (p === '/admin' || p === '/admin/') p = '/admin.html';
  let file, cache = 'no-cache';
  if (p.startsWith('/uploads/')) {
    const n = path.basename(p);
    if (!/^[a-f0-9]{16}\.(png|jpg|webp|gif)$/.test(n)) throw new HttpErr(404, 'not_found');
    file = path.join(UP, n);
    cache = 'public, max-age=31536000, immutable';
  } else {
    let dec;
    try { dec = decodeURIComponent(p); } catch (e) { throw new HttpErr(400, 'bad_path'); }
    file = path.normalize(path.join(PUB, dec));
    if (!file.startsWith(PUB + path.sep)) throw new HttpErr(404, 'not_found');
  }
  let st;
  try { st = fs.statSync(file); } catch (e) { throw new HttpErr(404, 'not_found'); }
  if (!st.isFile()) throw new HttpErr(404, 'not_found');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': cache });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    const u = new URL(req.url, 'http://localhost');
    if (u.pathname.startsWith('/api/')) return await api(req, res, u, u.pathname);
    return serveStatic(req, res, u.pathname);
  } catch (e) {
    const status = e instanceof HttpErr ? e.status : 500;
    if (status === 500) console.error(e);
    if (!res.headersSent) send(res, status, Object.assign({ error: status === 500 ? 'server' : e.message }, e.extra || {}));
    else res.end();
  }
});
server.listen(PORT, HOST, () => {
  console.log('\nSmile Wonders is running');
  console.log('  Store: http://localhost:' + PORT + '/');
  console.log('  Admin: http://localhost:' + PORT + '/admin');
  if (process.env.ADMIN_PASSWORD) console.log('  Admin password: taken from ADMIN_PASSWORD');
  else console.log('  Admin password: ' + ADMIN_PW + (pwGenerated ? '   (generated now, also saved in data/admin-password.txt)' : '   (from data/admin-password.txt)'));
  console.log('');
});
