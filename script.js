/* Premium JS: render projects, modal, filters, skills animation, cyber module (localStorage) */

// Full list of repos (all public repos you wanted linked)
const projects = [
  {name:'exam_rank_02', repo:'https://github.com/guigonza/exam_rank_02', desc:'Exam Rank 02 — evaluación y resolución de problemas.'},
  {name:'minishell_normi', repo:'https://github.com/guigonza/minishell_normi', desc:'Minishell (Norminette friendly).'},
  {name:'mini2', repo:'https://github.com/guigonza/mini2', desc:'Mini2 — mejoras experimentales.'},
  {name:'minishell', repo:'https://github.com/guigonza/minishell', desc:'Shell en C: parsing, pipes, redirecciones, manejo de señales.'},
  {name:'fractol', repo:'https://github.com/guigonza/fractol', desc:'Visualización de fractales con MiniLibX.'},
  {name:'push_swap', repo:'https://github.com/guigonza/push_swap', desc:'Algoritmo de ordenación con movimientos mínimos entre stacks.'},
  {name:'pipex', repo:'https://github.com/guigonza/pipex', desc:'Emulación de pipes, duplicado de descriptores y ejecución encadenada.'},
  {name:'ft_printf', repo:'https://github.com/guigonza/ft_printf', desc:'Implementación de printf (subconjunto).'},
  {name:'gnl', repo:'https://github.com/guigonza/gnl', desc:'get_next_line — lectura por línea y gestión de buffers.'},
  {name:'libft', repo:'https://github.com/guigonza/libft', desc:'Librería base con funciones reimplementadas de libc.'},
  {name:'42', repo:'https://github.com/guigonza/42', desc:'Ejercicios y prácticas de 42 School.'},
  // C++ modules
  {name:'cpp00', repo:'https://github.com/guigonza/cpp00', desc:'C++ Module 00 — fundamentos OOP (clases, encapsulación).', tags:['cpp']},
  {name:'cpp01', repo:'https://github.com/guigonza/cpp01', desc:'C++ Module 01 — gestión de memoria, constructores, operadores.', tags:['cpp']},
  {name:'cpp02', repo:'https://github.com/guigonza/cpp02', desc:'C++ Module 02 — polimorfismo y diseño orientado a objetos.', tags:['cpp']}
];

// Render project cards
const grid = document.getElementById('projects-grid');
projects.forEach(p=>{
  const el = document.createElement('div');
  el.className = 'project-card';
  el.dataset.tags = (p.tags||[]).join(' ');
  el.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p><div class="project-links">
    <a href="${p.repo}" target="_blank" rel="noopener">Ver repo</a>
    <button class="btn view" data-name="${p.name}">Detalles</button>
  </div>`;
  grid.appendChild(el);
});

// Filters
document.querySelectorAll('.filters button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card=>{
      if(f==='all') { card.style.display='block'; return; }
      const tags = card.dataset.tags || '';
      if(f==='c' && !tags.includes('cpp')) { card.style.display='block'; return; }
      if(f==='cpp' && tags.includes('cpp')) { card.style.display='block'; return; }
      if(f==='sys' && (card.innerText.toLowerCase().includes('shell') || card.innerText.toLowerCase().includes('pipe'))) { card.style.display='block'; return; }
      // default hide
      card.style.display='none';
    });
  });
});

// Modal behaviour
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalActions = document.getElementById('modalActions');
const modalRun = document.getElementById('modalRun');

document.body.addEventListener('click', (e)=>{
  if(e.target.matches('.btn.view')){
    const name = e.target.getAttribute('data-name');
    const p = projects.find(x=>x.name===name);
    openModal(p);
  }
});
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=> { if(e.target===modal) closeModal(); });

function openModal(p){
  modal.setAttribute('aria-hidden','false');
  modalTitle.textContent = p.name;
  modalDesc.textContent = p.desc;
  modalActions.innerHTML = `<a class="btn primary" href="${p.repo}" target="_blank" rel="noopener">Abrir repositorio</a>`;
  // run locally instructions (generic)
  modalRun.innerHTML = `<strong>Ejecutar local (sugerido):</strong>
    <pre>git clone ${p.repo}
cd ${p.name}
make
# ./nombre_binario o consulta README del repo</pre>`;
}

// close modal
function closeModal(){ modal.setAttribute('aria-hidden','true'); modalTitle.textContent=''; modalDesc.textContent=''; modalActions.innerHTML=''; modalRun.innerHTML=''; }

// animate skill meters
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.meter').forEach(m=>{
    const v = m.dataset.level || m.querySelector('span').style.width || '70';
    const span = m.querySelector('span');
    span.style.width = '0%';
    setTimeout(()=> span.style.width = v + '%', 200);
  });
});

// Cyber module (same logic as before) - localStorage
const s1 = document.getElementById('s1'), s2 = document.getElementById('s2'), s3 = document.getElementById('s3');
const s1v = document.getElementById('s1v'), s2v = document.getElementById('s2v'), s3v = document.getElementById('s3v');
const saveBtn = document.getElementById('saveLab'), resetBtn = document.getElementById('resetLab'), badgeArea = document.getElementById('labBadge');

function updateLabels(){ s1v.textContent = s1.value + '%'; s2v.textContent = s2.value + '%'; s3v.textContent = s3.value + '%'; }
[s1,s2,s3].forEach(el=>el.addEventListener('input', updateLabels));
updateLabels();

function renderBadge(){ badgeArea.innerHTML=''; const total=Math.round((+s1.value + +s2.value + +s3.value)/3); const div=document.createElement('div'); div.className='badge'; div.textContent=`Cyber Progress: ${total}%`; badgeArea.appendChild(div); }

saveBtn.addEventListener('click', ()=>{
  const state = {r1:+s1.value,r2:+s2.value,r3:+s3.value,ts:Date.now()};
  localStorage.setItem('cyberState', JSON.stringify(state));
  renderBadge();
  saveBtn.textContent='Guardado ✓';
  setTimeout(()=> saveBtn.textContent='Guardar progreso',1500);
});

resetBtn.addEventListener('click', ()=>{
  localStorage.removeItem('cyberState');
  s1.value=45; s2.value=20; s3.value=10;
  updateLabels(); badgeArea.innerHTML='';
});

(function loadState(){
  const raw = localStorage.getItem('cyberState');
  if(raw){ try{ const st=JSON.parse(raw); s1.value=st.r1; s2.value=st.r2; s3.value=st.r3; updateLabels(); renderBadge(); }catch(e){} }
})();

// Dark/light toggle (stores preference)
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('light');
  const isLight = document.documentElement.classList.contains('light');
  localStorage.setItem('theme',''+(isLight?'light':'dark'));
});
(function loadTheme(){
  const t = localStorage.getItem('theme');
  if(t==='light') document.documentElement.classList.add('light');
})();
  