(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function save(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function load(k){try{return localStorage.getItem(k)}catch(e){return null}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

var GOV=[['Cairo','القاهرة'],['Giza','الجيزة'],['Alexandria','الإسكندرية'],['Qalyubia','القليوبية'],['Dakahlia','الدقهلية'],['Sharqia','الشرقية'],['Gharbia','الغربية'],['Monufia','المنوفية'],['Beheira','البحيرة'],['Kafr El Sheikh','كفر الشيخ'],['Damietta','دمياط'],['Port Said','بورسعيد'],['Ismailia','الإسماعيلية'],['Suez','السويس'],['Fayoum','الفيوم'],['Beni Suef','بني سويف'],['Minya','المنيا'],['Assiut','أسيوط'],['Sohag','سوهاج'],['Qena','قنا'],['Luxor','الأقصر'],['Aswan','أسوان'],['Red Sea','البحر الأحمر'],['Matrouh','مطروح'],['North Sinai','شمال سيناء'],['South Sinai','جنوب سيناء'],['New Valley','الوادي الجديد']];

var T={
en:{menu:'Menu',search:'Search',cart:'Cart',close:'Close',searchph:'Search products',nav_home:'Home',nav_catalog:'Catalog',nav_contact:'Contact',nav_track:'Track order',nav_admin:'Admin',
 eyebrow:'New formula!',h1:'Meet our newest: Mango Pro Whitening',hsub:'Brightens, refreshes and protects. Made for every day.',shop:'Shop now',
 marq:'A smile worth showing off.',saleall:'{n}% off everything',best:'Shop bestsellers',viewall:'View all products',
 f1t:'SLS-free formula',f1s:'Cleaner ingredients, better for you',f2t:'Fresh & clean breath',f2s:'We are big on flavour',f3t:'24h stain protection*',f3s:'*when brushed twice daily',
 dent_t:'Developed by dentists',dent_p:'Every formula starts in the clinic, with the questions patients ask dentists every day: gentle on gums, great taste, visible results.',
 news_t:'Join the movement',news_p:'New flavours and offers, straight to your inbox.',email:'Email address',subscribe:'Subscribe',thanks:'Thank you for subscribing',e_email:'Enter a valid email address',
 shop_l:'Shop',search_l:'Search',rights:'© 2026 Smile Wonders Dental Care',
 products:'Products',c_all:'All',c_paste:'Toothpaste',c_brush:'Brushes',c_baby:'Kids & baby',c_wash:'Mouthwash',none:'No products match your search.',soldout:'Sold out',bestb:'Best seller',off:'Save {n}%',add:'Add to cart',added:'Added to cart',
 loading:'Loading products...',load_err:'We could not load the products.',retry:'Try again',
 cart_t:'Your cart',empty_t:'Your cart is empty',empty_p:'No account needed. Add something and check out as a guest.',cont:'Continue shopping',remove:'Remove',sub:'Subtotal',disc:'Discount',deliv:'Delivery',free:'Free',total:'Total',guest:'No account needed. You check out as a guest.',checkout:'Checkout',shipmore:'Add {n} more for free delivery.',shipok:'You get free delivery.',
 coupon_ph:'Discount code',apply:'Apply',coupon_bad:'This code is not valid.',coupon_min:'This code needs a higher order total.',coupon_ok:'Code applied. You save {n}.',
 co_t:'Your details',name:'Full name',phone:'Mobile number',gov:'Governorate',govph:'Choose governorate',addr:'Address',addrph:'Street, building, floor, area',notes:'Notes (optional)',pay:'Payment',cod:'Cash on delivery',place:'Place order',back:'Back to cart',
 e_req:'Required',e_phone:'Enter an Egyptian mobile number like 01012345678',e_addr:'Add street, building and area',
 done_t:'Order received',done_p:'We will call you to confirm it. Track it any time with your order number and phone.',ord:'Order',track_order:'Track order',wa_send:'Send details on WhatsApp',done_close:'Close',
 item_gone:'An item in your cart is no longer available. Please review your cart.',price_changed:'Prices changed. Please review your total.',e_rate:'Too many attempts. Try again in a few minutes.',e_server:'Something went wrong. Please try again.',
 track_t:'Track your order',track_p:'Enter your order number and the phone number you used.',order_no:'Order number',track_btn:'Track',track_nf:'No order found with these details.',
 st_new:'Order received',st_confirmed:'Confirmed',st_preparing:'Being prepared',st_shipped:'Out for delivery',st_delivered:'Delivered',st_cancelled:'This order was cancelled',
 ct_wa:'Chat on WhatsApp',ct_wa_p:'Ask us about products, orders or delivery.',ct_phone:'Phone',ct_hours:'Opening hours',ct_addr:'Address',ct_deliv:'Delivery',ct_deliv_v:'Delivery across Egypt. Free over {n}. Pay cash on delivery.',copy:'Copy number',copied:'Number copied'},
ar:{menu:'القائمة',search:'بحث',cart:'السلة',close:'إغلاق',searchph:'ابحث عن منتج',nav_home:'الرئيسية',nav_catalog:'المنتجات',nav_contact:'تواصل معنا',nav_track:'تتبع طلبك',nav_admin:'لوحة الإدارة',
 eyebrow:'تركيبة جديدة!',h1:'قابل الأحدث: معجون المانجو للتبييض',hsub:'يبيّض وينعش ويحمي. مصنوع لكل يوم.',shop:'تسوّق الآن',
 marq:'ابتسامة تستاهل تتشاف.',saleall:'خصم {n}% على كل المنتجات',best:'الأكثر مبيعاً',viewall:'شاهد كل المنتجات',
 f1t:'خالٍ من SLS',f1s:'مكونات أنظف وألطف عليك',f2t:'نَفَس منعش ونظيف',f2s:'اهتمامنا كبير بالنكهة',f3t:'حماية من التصبغات 24 ساعة*',f3s:'*عند التفريش مرتين يومياً',
 dent_t:'طوّرها أطباء أسنان',dent_p:'كل تركيبة تبدأ من العيادة، ومن أسئلة المرضى لأطبائهم كل يوم: لطيفة على اللثة، طعم مميز، ونتيجة تبان.',
 news_t:'انضم لنادي الابتسامة',news_p:'نكهات وعروض جديدة توصلك على الإيميل.',email:'البريد الإلكتروني',subscribe:'اشترك',thanks:'شكراً لاشتراكك',e_email:'اكتب بريداً إلكترونياً صحيحاً',
 shop_l:'تسوّق',search_l:'بحث',rights:'© 2026 سمايل ووندرز لعناية الأسنان',
 products:'المنتجات',c_all:'الكل',c_paste:'معاجين الأسنان',c_brush:'الفرش',c_baby:'الأطفال والرضّع',c_wash:'غسول الفم',none:'مفيش منتجات مطابقة للبحث.',soldout:'نفدت الكمية',bestb:'الأكثر مبيعاً',off:'خصم {n}%',add:'أضف للسلة',added:'تمت الإضافة للسلة',
 loading:'جاري تحميل المنتجات...',load_err:'مقدرناش نحمّل المنتجات.',retry:'حاول تاني',
 cart_t:'سلتك',empty_t:'سلتك فاضية',empty_p:'من غير حساب. ضيف منتجاتك واطلب كضيف.',cont:'كمّل التسوق',remove:'حذف',sub:'المجموع الفرعي',disc:'الخصم',deliv:'التوصيل',free:'مجاني',total:'الإجمالي',guest:'من غير حساب. هتطلب كضيف.',checkout:'إتمام الطلب',shipmore:'أضف {n} كمان واستمتع بتوصيل مجاني.',shipok:'التوصيل عليك مجاني.',
 coupon_ph:'كود الخصم',apply:'تطبيق',coupon_bad:'الكود غير صحيح.',coupon_min:'الكود يحتاج إجمالي طلب أعلى.',coupon_ok:'تم تطبيق الكود. وفّرت {n}.',
 co_t:'بياناتك',name:'الاسم بالكامل',phone:'رقم الموبايل',gov:'المحافظة',govph:'اختر المحافظة',addr:'العنوان',addrph:'الشارع، العمارة، الدور، المنطقة',notes:'ملاحظات (اختياري)',pay:'طريقة الدفع',cod:'الدفع عند الاستلام',place:'تأكيد الطلب',back:'الرجوع للسلة',
 e_req:'مطلوب',e_phone:'اكتب رقم موبايل مصري زي 01012345678',e_addr:'اكتب الشارع والعمارة والمنطقة',
 done_t:'تم استلام طلبك',done_p:'هنكلمك لتأكيد الطلب. تقدر تتابعه في أي وقت برقم الطلب ورقم موبايلك.',ord:'طلب رقم',track_order:'تتبع الطلب',wa_send:'ابعت التفاصيل على واتساب',done_close:'إغلاق',
 item_gone:'منتج في سلتك لم يعد متاحاً. راجع سلتك.',price_changed:'الأسعار اتغيرت. راجع الإجمالي.',e_rate:'محاولات كتير. جرّب بعد شوية.',e_server:'حصل خطأ. جرّب تاني.',
 track_t:'تتبع طلبك',track_p:'اكتب رقم الطلب ورقم الموبايل اللي طلبت بيه.',order_no:'رقم الطلب',track_btn:'تتبع',track_nf:'مفيش طلب بالبيانات دي.',
 st_new:'تم استلام الطلب',st_confirmed:'تم تأكيد الطلب',st_preparing:'جاري تجهيز الطلب',st_shipped:'خرج للتوصيل',st_delivered:'تم التسليم',st_cancelled:'تم إلغاء هذا الطلب',
 ct_wa:'كلمنا على واتساب',ct_wa_p:'اسألنا عن المنتجات أو الطلبات أو التوصيل.',ct_phone:'الهاتف',ct_hours:'مواعيد العمل',ct_addr:'العنوان',ct_deliv:'التوصيل',ct_deliv_v:'توصيل لكل المحافظات. مجاني فوق {n}. الدفع عند الاستلام.',copy:'انسخ الرقم',copied:'تم نسخ الرقم'}
};

var IC={
 menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
 search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
 bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
 close:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 flask:'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M4 4l16 16"/></svg>',
 breeze:'<svg viewBox="0 0 24 24"><path d="M3 9h10a3 3 0 1 0-3-3"/><path d="M3 14h14a3 3 0 1 1-3 3"/><path d="M3 19h6"/></svg>',
 shield:'<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
 spark:'<svg viewBox="-12 -12 24 24" width="18" height="18"><path d="M0-10L2.5-2.5 10 0 2.5 2.5 0 10-2.5 2.5-10 0-2.5-2.5Z" fill="currentColor" stroke="none"/></svg>'
};

/* ---- placeholder product art, used when a product has no photo ---- */
var FF='font-family="Bricolage Grotesque,Cairo,sans-serif"';
function jar(col,tag){
  var w=8+tag.length*4;
  return '<svg viewBox="0 0 120 200" direction="ltr" aria-hidden="true"><ellipse cx="60" cy="191" rx="38" ry="5" fill="#000" opacity=".12"/>'+
  '<rect x="50" y="2" width="30" height="9" rx="3" fill="#CFDAD8"/><rect x="56" y="10" width="8" height="26" fill="#CFDAD8"/>'+
  '<rect x="22" y="32" width="76" height="152" rx="14" fill="#FFFFFF" stroke="#D3DEDC"/><rect x="22" y="32" width="76" height="44" rx="14" fill="#E9F1F0"/>'+
  '<g transform="translate(48 174) rotate(-90)"><text '+FF+' font-weight="800" font-size="13" fill="'+col+'">smile wonders</text></g>'+
  '<rect x="54" y="84" width="'+w+'" height="13" rx="6.5" fill="'+col+'"/>'+
  '<text x="'+(54+w/2)+'" y="93.2" text-anchor="middle" '+FF+' font-weight="800" font-size="6" fill="#fff">'+esc(tag)+'</text>'+
  '<rect x="54" y="106" width="38" height="2" rx="1" fill="'+col+'" opacity=".35"/><rect x="54" y="112" width="30" height="2" rx="1" fill="'+col+'" opacity=".35"/><rect x="54" y="118" width="34" height="2" rx="1" fill="'+col+'" opacity=".35"/></svg>';
}
function bottle(col,tag){
  return '<svg viewBox="0 0 120 200" direction="ltr" aria-hidden="true"><ellipse cx="60" cy="191" rx="34" ry="5" fill="#000" opacity=".12"/>'+
  '<rect x="44" y="12" width="32" height="18" rx="4" fill="'+col+'"/><rect x="47" y="30" width="26" height="14" fill="#FFFFFF" stroke="#D3DEDC"/>'+
  '<rect x="30" y="44" width="60" height="140" rx="14" fill="#FFFFFF" stroke="#D3DEDC"/><rect x="30" y="112" width="60" height="72" rx="14" fill="'+col+'" opacity=".28"/>'+
  '<rect x="30" y="76" width="60" height="62" fill="#FFFFFF"/>'+
  '<text x="60" y="102" text-anchor="middle" '+FF+' font-weight="800" font-size="9" fill="'+col+'">smile wonders</text>'+
  '<text x="60" y="118" text-anchor="middle" '+FF+' font-weight="800" font-size="7" fill="'+col+'">'+esc(tag)+'</text></svg>';
}
function brush(){
  return '<svg viewBox="0 0 120 200" direction="ltr" aria-hidden="true"><ellipse cx="60" cy="191" rx="40" ry="5" fill="#000" opacity=".12"/>'+
  '<rect x="64" y="40" width="40" height="144" rx="6" fill="#EDE5D6"/><path d="M64 52h40" stroke="#CFC4AE" stroke-width="2"/><path d="M72 40c0-8 4-14 12-14s12 6 12 14" fill="none" stroke="#CFC4AE" stroke-width="2"/>'+
  '<g transform="translate(84 150) rotate(-90)"><text '+FF+' font-weight="800" font-size="10" fill="#C98B8B" text-anchor="middle">smile wonders</text></g>'+
  '<rect x="26" y="52" width="14" height="132" rx="7" fill="#D6AE72"/><rect x="23" y="16" width="20" height="44" rx="7" fill="#EFE4CF"/>'+
  '<g fill="#fff" stroke="#D9D2C3"><rect x="25" y="8" width="3.4" height="14" rx="1.5"/><rect x="29.5" y="6" width="3.4" height="16" rx="1.5"/><rect x="34" y="6" width="3.4" height="16" rx="1.5"/><rect x="38.5" y="8" width="3.4" height="14" rx="1.5"/></g></svg>';
}
function art(p){
  if(p.image)return '<img class="pimg" src="'+esc(p.image)+'" alt="" loading="lazy">';
  return p.type==='brush'?brush():p.type==='bottle'?bottle(p.col,p.tag):jar(p.col,p.tag);
}

/* ---- state ---- */
var DEF={shipFee:60,freeShip:600,saleAll:0,wa:'',phone:'',hours:{en:'',ar:''},address:{en:'',ar:''},images:{hero:'',dentist:'',logo:''}};
var lang=load('sw-lang')==='en'?'en':'ar';
var ST=null,stErr=false;
var cart=[];
try{cart=JSON.parse(load('sw-cart')||'[]')}catch(e){cart=[]}
cart=Array.isArray(cart)?cart.filter(function(l){return l&&typeof l.id==='string'&&l.q>=1&&l.q<=20}):[];
var coupon=load('sw-coupon')||'';
var q='',cat='all',step='cart',order=null,cust=null,busy=false,draft={},errs={},lastFocus=null,Q=null,TR=null;
var LOGO0=$('.logo').innerHTML;

function S(){return ST?ST.settings:DEF}
function P(){return ST?ST.products:[]}
function find(id){var a=P();for(var i=0;i<a.length;i++)if(a[i].id===id)return a[i];return null}
function t(k){return T[lang][k]}
function pname(p){return lang==='ar'?p.ar:p.en}
function money(n){return lang==='ar'?new Intl.NumberFormat('ar-EG').format(n)+' ج.م':'LE '+new Intl.NumberFormat('en-US',{minimumFractionDigits:2}).format(n)}
function persist(){save('sw-cart',JSON.stringify(cart))}
function sig(){return cart.map(function(l){return l.id+':'+l.q}).join(',')+'|'+coupon}
function calc(){
  var sub=0;cart.forEach(function(l){var p=find(l.id);if(p)sub+=p.unit*l.q});
  var off=(Q&&Q.sig===sig()&&!Q.couponErr)?Q.off:0;
  var goods=sub-off,ship=sub===0?0:(goods>=S().freeShip?0:S().shipFee);
  return {sub:sub,off:off,ship:ship,total:goods+ship};
}
function validCoupon(){return coupon&&Q&&Q.sig===sig()&&!Q.couponErr?coupon:''}

var toastT;
function toast(m){var el=$('#toast');el.textContent=m;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){el.classList.remove('show')},2600)}

function call(method,url,body){
  var o={method:method,headers:{'X-Requested-With':'sw'}};
  if(body!==undefined){o.headers['Content-Type']='application/json';o.body=JSON.stringify(body)}
  return fetch(url,o).then(function(r){
    return r.json().catch(function(){return {}}).then(function(d){return {ok:r.ok,status:r.status,data:d}});
  },function(){return {ok:false,status:0,data:{}}});
}

/* ---- data ---- */
function loadStore(){
  return call('GET','/api/store').then(function(r){
    if(r.ok&&r.data&&r.data.products){ST=r.data;stErr=false;prune()}else if(!ST){stErr=true}
  });
}
function prune(){
  var n=cart.length;
  cart=cart.filter(function(l){var p=find(l.id);return p&&p.inStock});
  if(cart.length!==n)persist();
}
function syncStore(){return loadStore().then(function(){renderAll();refreshQuote()})}
function refreshQuote(){
  if(!cart.length||!coupon){Q=null;return}
  var s=sig();
  call('POST','/api/quote',{items:cart,coupon:coupon}).then(function(r){
    if(sig()!==s)return;
    if(r.ok){Q=r.data;Q.sig=s}else{Q=null;if(r.status===409)syncStore()}
    renderCart();
  });
}

/* ---- rendering ---- */
function stateMsg(){
  return '<p class="none" style="grid-column:1/-1">'+(stErr?t('load_err')+' <button class="mini" data-act="retry">'+t('retry')+'</button>':t('loading'))+'</p>';
}
function cardHTML(p){
  var badges='';
  if(!p.inStock)badges='<span class="badge out">'+t('soldout')+'</span>';
  else if(p.best)badges='<span class="badge">'+t('bestb')+'</span>';
  if(p.disc>0&&p.inStock)badges+='<span class="badge off">'+t('off').replace('{n}',p.disc)+'</span>';
  var price=p.disc>0?'<span class="old">'+money(p.price)+'</span>'+money(p.unit):money(p.unit);
  return '<article class="card"><div class="tile">'+art(p)+badges+'</div><h3 class="name">'+esc(pname(p))+'</h3><div class="price">'+price+'</div>'+
  '<button class="add" data-add="'+esc(p.id)+'"'+(p.inStock?'':' disabled')+'>'+(p.inStock?t('add'):t('soldout'))+'</button></article>';
}
function renderHome(){
  $('#gridBest').innerHTML=ST?P().filter(function(p){return p.best}).slice(0,8).map(cardHTML).join(''):stateMsg();
  var h=S().images.hero;
  $('#heroArt').innerHTML=h?'<img class="hero-photo" src="'+esc(h)+'" alt="">':
   '<div class="disc"></div><span class="bub" style="width:22px;height:22px;left:6%;top:14%"></span><span class="bub" style="width:12px;height:12px;left:20%;top:4%"></span><span class="bub" style="width:30px;height:30px;right:6%;top:18%"></span><span class="bub" style="width:14px;height:14px;right:22%;top:6%"></span>'+
   '<div class="hj hj1">'+jar('#14A89B','MINT')+'</div><div class="hj hj2">'+jar('#E9801C','MANGO')+'</div><div class="hj hj3">'+jar('#8A5B44','COCONUT')+'</div>';
}
function renderImages(){
  var im=S().images;
  $('.logo').innerHTML=im.logo?'<img src="'+esc(im.logo)+'" alt="Smile Wonders">':LOGO0;
  var d=$('#dentImg');
  if(im.dentist){d.src=im.dentist;d.hidden=false;$('#dentSvg').hidden=true}else{d.hidden=true;$('#dentSvg').hidden=false}
}
function renderMarquee(){
  var items=[t('marq')];
  if(S().saleAll>0)items.unshift(t('saleall').replace('{n}',S().saleAll));
  var g='';for(var i=0;i<6;i++)g+='<span>'+esc(items[i%items.length])+'</span><i>'+IC.spark+'</i>';
  $('#track').innerHTML='<div class="grp">'+g+'</div><div class="grp" aria-hidden="true">'+g+'</div>';
}
var CATS=[['all','c_all'],['paste','c_paste'],['brush','c_brush'],['baby','c_baby'],['mouthwash','c_wash']];
function renderCatalog(){
  $('#chips').innerHTML=CATS.map(function(c){return '<button class="chip" data-cat="'+c[0]+'" aria-pressed="'+(cat===c[0])+'">'+t(c[1])+'</button>'}).join('');
  if(!ST){$('#gridAll').innerHTML=stateMsg();$('#noneMsg').hidden=true;return}
  var s=q.trim().toLowerCase();
  var list=P().filter(function(p){return (cat==='all'||p.cat===cat)&&(!s||p.en.toLowerCase().indexOf(s)>-1||p.ar.indexOf(s)>-1)});
  $('#gridAll').innerHTML=list.map(cardHTML).join('');
  $('#noneMsg').hidden=list.length>0;
}
function renderContact(){
  var s=S();
  $('#phoneTxt').textContent=s.phone||'';
  var wa=$('#waLink');wa.hidden=!s.wa;if(s.wa)wa.href='https://wa.me/'+s.wa;
  $('#ctHours').textContent=s.hours[lang]||'';
  $('#ctAddr').textContent=s.address[lang]||'';
  $('#ctDeliv').textContent=t('ct_deliv_v').replace('{n}',money(s.freeShip));
}

function norm(s){return String(s).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)})}
function fieldHTML(id,label,inner){
  return '<div class="field"><label for="f-'+id+'">'+label+'</label>'+inner+(errs[id]?'<span class="err" id="e-'+id+'" role="alert">'+errs[id]+'</span>':'')+'</div>';
}
function inp(id,type,extra){
  var bad=errs[id]?' aria-invalid="true" aria-describedby="e-'+id+'"':'';
  return '<input id="f-'+id+'" type="'+type+'" value="'+esc(draft[id]||'')+'"'+bad+' '+(extra||'')+'>';
}
function head(title){
  return '<div class="dhead dpad"><h2 class="dtitle">'+title+'</h2><button class="icon-btn ink" data-act="close" aria-label="'+t('close')+'">'+IC.close+'</button></div>';
}
function lineThumb(p){return p?art(p):''}
function couponMsg(){
  if(!coupon||!Q||Q.sig!==sig())return '';
  if(Q.couponErr==='min')return '<div class="cmsg bad">'+t('coupon_min')+'</div>';
  if(Q.couponErr)return '<div class="cmsg bad">'+t('coupon_bad')+'</div>';
  return '<div class="cmsg ok">'+t('coupon_ok').replace('{n}',money(Q.off))+'</div>';
}
function renderCart(){
  var n=cart.reduce(function(a,l){return a+l.q},0),c=$('#count');
  c.textContent=n;c.hidden=n===0;
  var tt=calc(),h='';
  if(step==='done'&&order){
    h=head(t('done_t'))+'<div class="dbody dpad"><div class="empty" style="justify-items:start;text-align:start;gap:14px"><div class="okdot">'+IC.check+'</div>'+
    '<h3>'+t('ord')+' <span dir="ltr">'+esc(order.id)+'</span></h3><p>'+t('done_p')+'</p></div>'+
    '<div class="sumbox" style="margin-top:18px">'+order.lines.map(function(l){return '<div><span>'+esc(lang==='ar'?l.ar:l.en)+' × '+l.q+'</span><span>'+money(l.unit*l.q)+'</span></div>'}).join('')+
    (order.off?'<div><span>'+t('disc')+'</span><span>-'+money(order.off)+'</span></div>':'')+
    '<div><span>'+t('deliv')+'</span><span>'+(order.ship?money(order.ship):t('free'))+'</span></div><div style="font-weight:800"><span>'+t('total')+'</span><span>'+money(order.total)+'</span></div></div></div>'+
    '<div class="dfoot dpad"><button class="btn btn-accent block" data-act="track">'+t('track_order')+'</button>'+
    (S().wa?'<a class="btn btn-line block" target="_blank" rel="noopener" href="'+esc(waLink())+'">'+t('wa_send')+'</a>':'')+
    '<button class="btn btn-line block" data-act="close">'+t('done_close')+'</button></div>';
  }else if(step==='checkout'&&cart.length){
    var opts='<option value="">'+t('govph')+'</option>'+GOV.map(function(g,i){return '<option value="'+i+'"'+(String(draft.gov)===String(i)?' selected':'')+'>'+(lang==='ar'?g[1]:g[0])+'</option>'}).join('');
    var bad=errs.gov?' aria-invalid="true" aria-describedby="e-gov"':'';
    h=head(t('co_t'))+'<div class="dbody dpad"><form class="form" id="co" novalidate>'+
    fieldHTML('name',t('name'),inp('name','text','autocomplete="name"'))+
    fieldHTML('phone',t('phone'),inp('phone','tel','inputmode="tel" autocomplete="tel" dir="ltr"'))+
    fieldHTML('gov',t('gov'),'<select id="f-gov"'+bad+'>'+opts+'</select>')+
    fieldHTML('addr',t('addr'),'<textarea id="f-addr" rows="3" placeholder="'+t('addrph')+'"'+(errs.addr?' aria-invalid="true" aria-describedby="e-addr"':'')+'>'+esc(draft.addr||'')+'</textarea>')+
    fieldHTML('notes',t('notes'),'<textarea id="f-notes" rows="2">'+esc(draft.notes||'')+'</textarea>')+
    '<div class="field"><span class="label" style="font:600 13px var(--font-body)">'+t('pay')+'</span><label class="pay"><input type="radio" name="pay" checked> <span>'+t('cod')+'</span></label></div></form></div>'+
    '<div class="dfoot dpad"><div class="tot"><div class="grand"><span>'+t('total')+'</span><span>'+money(tt.total)+'</span></div></div>'+
    '<button class="btn btn-accent block" type="submit" form="co"'+(busy?' disabled':'')+'>'+t('place')+'</button><button class="btn btn-line block" data-act="tocart">'+t('back')+'</button></div>';
  }else if(!cart.length){
    h=head(t('cart_t'))+'<div class="dbody dpad empty"><h3>'+t('empty_t')+'</h3><p style="color:var(--muted)">'+t('empty_p')+'</p><button class="btn btn-accent" data-act="shop">'+t('cont')+'</button></div>';
  }else{
    var pct=Math.min(100,Math.round(tt.sub/S().freeShip*100));
    var hint=tt.sub>=S().freeShip?t('shipok'):t('shipmore').replace('{n}',money(S().freeShip-tt.sub));
    h=head(t('cart_t'))+'<div class="dbody dpad"><div class="ship">'+hint+'<div class="prog"><i style="width:'+pct+'%"></i></div></div><ul class="lines">'+
    cart.map(function(l){var p=find(l.id);if(!p)return '';return '<li class="line"><div class="lt">'+lineThumb(p)+'</div><div><div class="ln">'+esc(pname(p))+'</div><div class="lp">'+(p.disc>0?'<span class="old">'+money(p.price*l.q)+'</span>':'')+money(p.unit*l.q)+'</div>'+
      '<div class="qrow"><div class="qty"><button data-act="dec" data-id="'+esc(p.id)+'" aria-label="−">−</button><span>'+l.q+'</span><button data-act="inc" data-id="'+esc(p.id)+'" aria-label="+">+</button></div><button class="rm" data-act="rm" data-id="'+esc(p.id)+'">'+t('remove')+'</button></div></div></li>'}).join('')+
    '</ul><div style="margin-top:22px"><div class="coupon"><input id="f-coupon" type="text" dir="ltr" autocomplete="off" placeholder="'+t('coupon_ph')+'" value="'+esc(draft.coupon!==undefined?draft.coupon:coupon)+'"><button class="btn btn-line" data-act="applyc">'+t('apply')+'</button></div>'+couponMsg()+'</div></div>'+
    '<div class="dfoot dpad"><div class="tot"><div><span>'+t('sub')+'</span><span>'+money(tt.sub)+'</span></div>'+
    (tt.off?'<div><span>'+t('disc')+'</span><span>-'+money(tt.off)+'</span></div>':'')+
    '<div><span>'+t('deliv')+'</span><span>'+(tt.ship?money(tt.ship):t('free'))+'</span></div><div class="grand"><span>'+t('total')+'</span><span>'+money(tt.total)+'</span></div></div>'+
    '<button class="btn btn-accent block" data-act="checkout">'+t('checkout')+'</button><p class="note">'+t('guest')+'</p></div>';
  }
  $('#cartInner').innerHTML=h;
}
function waLink(){
  var o=order,L=[];
  L.push((lang==='ar'?'طلب رقم ':'Order ')+o.id);
  o.lines.forEach(function(l){L.push('- '+(lang==='ar'?l.ar:l.en)+' × '+l.q+' = '+money(l.unit*l.q))});
  L.push((lang==='ar'?'التوصيل: ':'Delivery: ')+(o.ship?money(o.ship):t('free')));
  L.push((lang==='ar'?'الإجمالي: ':'Total: ')+money(o.total)+' ('+t('cod')+')');
  if(cust){L.push('');L.push(cust.name);L.push(cust.phone);L.push(cust.gov+' - '+cust.addr)}
  return 'https://wa.me/'+S().wa+'?text='+encodeURIComponent(L.join('\n'));
}

/* ---- order tracking ---- */
var FLOW=['new','confirmed','preparing','shipped','delivered'];
function fdate(s){try{return new Date(s).toLocaleString(lang==='ar'?'ar-EG':'en-GB',{dateStyle:'medium',timeStyle:'short'})}catch(e){return s}}
function renderTrack(){
  if(!draft.tid&&!draft.tph){
    var last=null;try{last=JSON.parse(load('sw-last')||'null')}catch(e){}
    if(last){draft.tid=last.id;draft.tph=last.phone}
  }
  var a=$('#tid'),b=$('#tph');
  if(document.activeElement!==a)a.value=draft.tid||'';
  if(document.activeElement!==b)b.value=draft.tph||'';
  renderTrackOut();
}
function renderTrackOut(){
  var out=$('#trackOut');
  if(!TR){out.innerHTML='';return}
  if(TR.nf){out.innerHTML='<p class="cancelled">'+t('track_nf')+'</p>';return}
  var o=TR,h='';
  if(o.status==='cancelled'){h+='<div class="cancelled">'+t('st_cancelled')+'</div>'}
  else{
    var cur=FLOW.indexOf(o.status);
    h+='<ol class="tl">'+FLOW.map(function(s,i){
      var ev=null;o.history.forEach(function(x){if(x.status===s)ev=x});
      return '<li class="'+(i<=cur?'done':'')+(i===cur?' cur':'')+'"><span class="dot"></span><div><div class="lbl">'+t('st_'+s)+'</div>'+(ev&&i<=cur?'<div class="at">'+fdate(ev.at)+'</div>':'')+'</div></li>';
    }).join('')+'</ol>';
  }
  h+='<div class="tbox"><div><b>'+t('ord')+'</b><span dir="ltr">'+esc(o.id)+'</span></div>'+
    o.lines.map(function(l){return '<div><span>'+esc(lang==='ar'?l.ar:l.en)+' × '+l.q+'</span><span>'+money(l.unit*l.q)+'</span></div>'}).join('')+
    (o.off?'<div><span>'+t('disc')+'</span><span>-'+money(o.off)+'</span></div>':'')+
    '<div><span>'+t('deliv')+'</span><span>'+(o.ship?money(o.ship):t('free'))+'</span></div><div style="font-weight:800"><span>'+t('total')+'</span><span>'+money(o.total)+'</span></div></div>';
  out.innerHTML=h;
}

function renderAll(){renderMarquee();renderHome();renderImages();renderCatalog();renderContact();renderCart();renderTrack()}
function applyLang(){
  var h=document.documentElement;h.lang=lang;h.dir=lang==='ar'?'rtl':'ltr';
  $$('[data-ic]').forEach(function(e){e.innerHTML=IC[e.dataset.ic]});
  $$('[data-t]').forEach(function(e){e.textContent=t(e.dataset.t)});
  $$('[data-tp]').forEach(function(e){e.placeholder=t(e.dataset.tp)});
  $$('[data-tl]').forEach(function(e){e.setAttribute('aria-label',t(e.dataset.tl))});
  $('#btnLang').textContent=lang==='ar'?'EN':'عربي';
  $('#btnLang').setAttribute('aria-label',lang==='ar'?'English':'العربية');
  $$('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===lang)});
  renderAll();
}
function setLang(l){lang=l;save('sw-lang',l);applyLang()}

/* ---- routing and drawers ---- */
var VIEWS=['home','catalog','contact','track'];
function route(){
  var h=(location.hash||'#home').slice(1);if(VIEWS.indexOf(h)<0)h='home';
  VIEWS.forEach(function(v){$('#v-'+v).hidden=v!==h});
  if(h==='track')renderTrack();
  window.scrollTo(0,0);
}
function openDrawer(id){
  closeAll(true);lastFocus=document.activeElement;
  $('#'+id).classList.add('open');$('#scrim').classList.add('open');document.documentElement.classList.add('lock');
  setTimeout(function(){var f=$('#'+id+' button, #'+id+' a');if(f)f.focus()},60);
}
function closeAll(quiet){
  $$('.drawer.open').forEach(function(d){d.classList.remove('open')});
  $('#scrim').classList.remove('open');document.documentElement.classList.remove('lock');
  if(step==='done'){step='cart';order=null;draft={};renderCart()}
  if(!quiet&&lastFocus&&lastFocus.focus)lastFocus.focus();
}

/* ---- cart ---- */
function cartChanged(){persist();renderCart();refreshQuote()}
function addToCart(id){
  var p=find(id);if(!p||!p.inStock)return;
  var l=cart.filter(function(x){return x.id===id})[0];
  if(l){l.q=Math.min(20,l.q+1)}else cart.push({id:id,q:1});
  cartChanged();toast(t('added'));
}
function submitOrder(){
  if(busy)return;
  var v=function(k){return String(draft[k]||'').trim()};
  errs={};
  if(v('name').length<3)errs.name=t('e_req');
  var ph=norm(v('phone')).replace(/[\s-]/g,'');
  if(!/^01[0125]\d{8}$/.test(ph))errs.phone=t('e_phone');
  if(draft.gov===undefined||draft.gov==='')errs.gov=t('e_req');
  if(v('addr').length<8)errs.addr=t('e_addr');
  var keys=Object.keys(errs);
  if(keys.length){renderCart();var el=$('#f-'+keys[0]);if(el)el.focus();return}
  var gv=GOV[+draft.gov];
  var payload={name:v('name'),phone:ph,gov:gv[1],addr:v('addr'),notes:v('notes'),items:cart.map(function(l){return {id:l.id,q:l.q}}),coupon:validCoupon(),expect:calc().total,lang:lang,website:''};
  busy=true;renderCart();
  call('POST','/api/orders',payload).then(function(r){
    busy=false;
    if(r.status===201){
      order=r.data;cust={name:payload.name,phone:ph,gov:gv[lang==='ar'?1:0],addr:payload.addr};
      save('sw-last',JSON.stringify({id:order.id,phone:ph}));
      draft.tid=order.id;draft.tph=ph;TR=null;
      cart=[];coupon='';Q=null;save('sw-coupon','');persist();step='done';renderCart();return;
    }
    var d=r.data||{};
    if(r.status===400&&d.fields){
      d.fields.forEach(function(f){errs[f]=f==='phone'?t('e_phone'):f==='addr'?t('e_addr'):t('e_req')});
    }else if(r.status===409&&d.error==='price_changed'){toast(t('price_changed'));step='cart';syncStore()}
    else if(r.status===409&&d.error==='coupon'){coupon='';Q=null;save('sw-coupon','');toast(t('coupon_bad'));step='cart'}
    else if(r.status===409){toast(t('item_gone'));step='cart';syncStore()}
    else if(r.status===429)toast(t('e_rate'));
    else toast(t('e_server'));
    renderCart();
  });
}

/* ---- events ---- */
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-add],[data-act],[data-cat],[data-lang]');if(!el)return;
  if(el.dataset.add){addToCart(el.dataset.add);return}
  if(el.dataset.cat){cat=el.dataset.cat;renderCatalog();return}
  if(el.dataset.lang){setLang(el.dataset.lang);return}
  var a=el.dataset.act,id=el.dataset.id,l=cart.filter(function(x){return x.id===id})[0];
  if(a==='close')closeAll();
  else if(a==='nav'){closeAll(true)}
  else if(a==='shop'){closeAll(true);location.hash='#catalog'}
  else if(a==='track'){closeAll(true);TR=null;location.hash='#track';renderTrack();$('#trackForm').requestSubmit()}
  else if(a==='retry'){loadStore().then(renderAll)}
  else if(a==='inc'&&l){l.q=Math.min(20,l.q+1);cartChanged()}
  else if(a==='dec'&&l){l.q=l.q-1;if(l.q<1)cart.splice(cart.indexOf(l),1);cartChanged()}
  else if(a==='rm'&&l){cart.splice(cart.indexOf(l),1);cartChanged()}
  else if(a==='applyc'){coupon=String(draft.coupon!==undefined?draft.coupon:coupon).trim().toUpperCase();draft.coupon=coupon;save('sw-coupon',coupon);Q=null;renderCart();refreshQuote()}
  else if(a==='checkout'){step='checkout';errs={};renderCart()}
  else if(a==='tocart'){step='cart';errs={};renderCart()}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&ST)syncStore()});
$('#scrim').addEventListener('click',function(){closeAll()});
$('#btnMenu').addEventListener('click',function(){openDrawer('menu')});
$('#btnCart').addEventListener('click',function(){if(step==='done'&&!order)step='cart';openDrawer('cartDrawer')});
$('#btnLang').addEventListener('click',function(){setLang(lang==='ar'?'en':'ar')});
$('#btnSearch').addEventListener('click',function(){var b=$('#searchbar');b.hidden=!b.hidden;if(!b.hidden)$('#q').focus()});
$('#footSearch').addEventListener('click',function(){$('#searchbar').hidden=false;window.scrollTo(0,0);$('#q').focus()});
$('#q').addEventListener('input',function(e){q=e.target.value;if((location.hash||'#home')!=='#catalog')location.hash='#catalog';renderCatalog()});
$('#cartInner').addEventListener('input',function(e){if(e.target.id&&e.target.id.indexOf('f-')===0)draft[e.target.id.slice(2)]=e.target.value});
$('#cartInner').addEventListener('change',function(e){if(e.target.id&&e.target.id.indexOf('f-')===0)draft[e.target.id.slice(2)]=e.target.value});
$('#cartInner').addEventListener('submit',function(e){e.preventDefault();if(e.target.id==='co')submitOrder()});
$('#newsForm').addEventListener('submit',function(e){
  e.preventDefault();var el=$('#email');
  if(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())){toast(t('thanks'));el.value='';el.removeAttribute('aria-invalid')}
  else{el.setAttribute('aria-invalid','true');toast(t('e_email'));el.focus()}
});
$('#copyPhone').addEventListener('click',function(){
  var done=function(){toast(t('copied'))};
  var sel=function(){var r=document.createRange();r.selectNodeContents($('#phoneTxt'));var s=getSelection();s.removeAllRanges();s.addRange(r)};
  try{navigator.clipboard.writeText(S().phone).then(done,sel)}catch(err){sel()}
});
$('#tid').addEventListener('input',function(e){draft.tid=e.target.value});
$('#tph').addEventListener('input',function(e){draft.tph=e.target.value});
$('#trackForm').addEventListener('submit',function(e){
  e.preventDefault();
  var id=String(draft.tid||'').trim(),ph=norm(draft.tph||'').replace(/[\s-]/g,'');
  if(!id||!ph){TR={nf:true};renderTrackOut();return}
  call('GET','/api/track?id='+encodeURIComponent(id)+'&phone='+encodeURIComponent(ph)).then(function(r){
    if(r.ok)TR=r.data;
    else if(r.status===429){toast(t('e_rate'));return}
    else TR={nf:true};
    renderTrackOut();
  });
});
window.addEventListener('hashchange',route);

applyLang();route();
loadStore().then(function(){renderAll();refreshQuote()});
})();
