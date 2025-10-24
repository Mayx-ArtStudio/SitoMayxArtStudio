
const state = {
  lang: localStorage.getItem('lang') || 'it',
  dict: {},
  artworks: [],
  theme: localStorage.getItem('theme') || 'dark'
};

document.documentElement.setAttribute('data-theme', state.theme);

async function loadI18n(lang){
  const res = await fetch(`i18n/${lang}.json`);
  state.dict = await res.json();
  applyI18n();
}
function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((o,k)=>o?.[k], state.dict);
    if(val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    const val = key.split('.').reduce((o,k)=>o?.[k], state.dict);
    if(val) el.setAttribute('placeholder', val);
  });
}

async function loadArtworks(){
  const res = await fetch('data/artworks.json');
  state.artworks = await res.json();
  renderGallery();
}
function renderGallery(){
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';
  state.artworks.forEach(item=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title[state.lang] || item.title.it}">
      <div class="p">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${item.title[state.lang] || item.title.it}</strong>
          <span class="badge">${state.dict.gallery.price}: ${item.price}</span>
        </div>
        <p style="opacity:.85">${item.description[state.lang] || item.description.it}</p>
        <div style="display:flex;gap:8px;margin-top:6px">
          <button class="btn secondary" data-id="${item.id}">Dettagli</button>
          <a class="btn" href="mailto:mayx.artstudio@outlook.com?subject=Richiesta%20opera%20${encodeURIComponent(item.title[state.lang] || item.title.it)}&body=Buongiorno%2C%20sono%20interessato%20all'opera%20%22${encodeURIComponent(item.title[state.lang] || item.title.it)}%22.%20Potete%20darmi%20informazioni%20su%20prezzo%2C%20pagamento%20e%20spedizione%3F" target="_blank">${state.dict.gallery.inquire}</a>
        </div>
      </div>
    `;
    // Attach modal open
    card.querySelector('button[data-id]').addEventListener('click', ()=>openModal(item));
    grid.appendChild(card);
  });
}

function openModal(item){
  const modal = document.getElementById('artModal');
  document.getElementById('modalImg').src = item.image;
  document.getElementById('modalTitle').textContent = item.title[state.lang] || item.title.it;
  document.getElementById('modalDesc').textContent = item.description[state.lang] || item.description.it;
  document.getElementById('modalPrice').textContent = item.price;
  const titleEnc = encodeURIComponent(item.title[state.lang] || item.title.it);
  document.getElementById('inquireBtn').href = `mailto:mayx.artstudio@outlook.com?subject=Richiesta%20opera%20${titleEnc}&body=Buongiorno%2C%20sono%20interessato%20all'opera%20%22${titleEnc}%22.%20Potete%20darmi%20informazioni%20su%20prezzo%2C%20pagamento%20e%20spedizione%3F`;
  modal.classList.add('open');
}
document.getElementById('closeModal').addEventListener('click', ()=>document.getElementById('artModal').classList.remove('open'));
document.getElementById('artModal').addEventListener('click', (e)=>{ if(e.target.id==='artModal') e.currentTarget.classList.remove('open'); });

// Events & Posts
async function loadEvents(){
  const res = await fetch('data/events.json');
  const events = await res.json();
  const list = document.getElementById('eventsList');
  const empty = document.getElementById('eventsEmpty');
  list.innerHTML = '';
  if(!events.length){ empty.style.display='inline-block'; return; }
  empty.style.display = 'none';
  events.forEach(ev=>{
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `<div class="p">
      <strong>${ev.title?.[state.lang] || ev.title?.it || ''}</strong>
      <p style="opacity:.8">${ev.date || ''} — ${ev.location || ''}</p>
      <p>${ev.description?.[state.lang] || ev.description?.it || ''}</p>
    </div>`;
    list.appendChild(c);
  });
}
async function loadPosts(){
  const res = await fetch('data/posts.json');
  const posts = await res.json();
  const list = document.getElementById('postsList');
  const empty = document.getElementById('postsEmpty');
  list.innerHTML = '';
  if(!posts.length){ empty.style.display='inline-block'; return; }
  empty.style.display = 'none';
  posts.forEach(p=>{
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `<div class="p">
      <strong>${p.title?.[state.lang] || p.title?.it || ''}</strong>
      <p style="opacity:.8">${p.date || ''}</p>
      <p>${p.body?.[state.lang] || p.body?.it || ''}</p>
    </div>`;
    list.appendChild(c);
  });
}

// Language controls
document.getElementById('itBtn').addEventListener('click', ()=>{state.lang='it'; localStorage.setItem('lang','it'); loadI18n('it'); renderGallery(); loadEvents(); loadPosts();});
document.getElementById('enBtn').addEventListener('click', ()=>{state.lang='en'; localStorage.setItem('lang','en'); loadI18n('en'); renderGallery(); loadEvents(); loadPosts();});

// Theme toggle
document.getElementById('themeBtn').addEventListener('click', ()=>{
  state.theme = (state.theme==='dark'?'light':(state.theme==='light'?'sand':'dark'));
  localStorage.setItem('theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
});

// Contact form using EmailJS (free tier). Replace placeholders in init (index.html) and below.
const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const status = document.getElementById('formStatus');
  status.style.display = 'inline-block';
  status.textContent = state.lang==='it' ? 'Invio in corso…' : 'Sending…';

  // Option A (recommended): EmailJS — requires your public key, service ID, template ID
  try{
    // Replace with your IDs:
    // const result = await emailjs.send('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',{
    //   from_name: form.name.value,
    //   reply_to: form.email.value,
    //   message: form.message.value
    // });
    // status.textContent = state.lang==='it' ? 'Messaggio inviato! Ti risponderò via email.' : 'Message sent! I will reply by email.';
    // form.reset();
    throw new Error('EmailJS not configured'); // fallback to mailto
  }catch(err){
    // Option B: Fallback mailto open (guaranteed, zero setup)
    const subject = encodeURIComponent(`[Contatto sito] ${form.name.value}`);
    const body = encodeURIComponent(`${form.message.value}\n\nEmail: ${form.email.value}\nNome: ${form.name.value}`);
    window.location.href = `mailto:YOUR_EMAIL_ADDRESS?subject=${subject}&body=${body}`;
    status.textContent = state.lang==='it' ? 'Aprendo il client di posta…' : 'Opening your mail client…';
  }
});

// Init
(async function(){
  await loadI18n(state.lang);
  await loadArtworks();
  await loadEvents();
  await loadPosts();
})();
