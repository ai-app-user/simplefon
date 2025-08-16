// app-account.js — UI for Account page (Accordion + Firebase)

// Import the Firebase backend helpers:
import {
  ensureUser,
  readAccount,
  saveAccount,
  subscribeAgents,
  addAgent,
  updateAgent,
  deleteAgent,
  duplicateAgent,
  ensureFirstAgentIfNone,
} from './backend.js';

// ---- DOM helpers
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const getCookie = (name) => (document.cookie.split('; ').find(r => r.startsWith(name+'='))||'').split('=')[1]||'';
const decode = (v) => decodeURIComponent(v || '');
const debounce = (fn, ms=300) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; };

// ---- Auth gate (we keep your cookie approach)
const acctPhone = decode(getCookie('sf_phone'));
if (!acctPhone) location.replace('signup.html?next=account');

// ---- Small UI helpers
function flash(el, text='Saved'){ if (!el) return; el.textContent = text; setTimeout(()=>el.textContent='', 1400); }
function closeAllPanels(){ $$('.acc-panel').forEach(p=>p.classList.add('hidden')); $$('[data-acc-trigger]').forEach(t=>t.setAttribute('aria-expanded','false')); }
function openPanel(panel){ if(!panel) return; closeAllPanels(); panel.classList.remove('hidden'); const btn = panel.previousElementSibling?.querySelector('[data-acc-trigger]')||panel.parentElement.querySelector('[data-acc-trigger]'); if(btn) btn.setAttribute('aria-expanded','true'); panel.parentElement.scrollIntoView({block:'start',behavior:'smooth'}); }

// ---- Main
async function main(){
  // Ensure user doc exists
  await ensureUser(acctPhone, { phone: acctPhone });

  // Account fields
  const phoneEl = $('#acctPhone');
  const nameEl  = $('#acctName');
  const emailEl = $('#acctEmail');
  const acctSummary = $('#acctSummary');

  if (phoneEl) phoneEl.value = acctPhone;

  // Load account from Firestore
  const acct = await readAccount(acctPhone);
  if (nameEl)  nameEl.value  = acct.name  || '';
  if (emailEl) emailEl.value = acct.email || '';
  if (acctSummary) acctSummary.textContent = acct.name ? `${acct.name} • ${acctPhone}` : acctPhone;

  // Seed first agent from signup local data if none exist
  const signup = JSON.parse(localStorage.getItem('sf_signup') || '{}');
  await ensureFirstAgentIfNone(acctPhone, {
    name: 'Main Line',
    areaCode: signup.areaCode || '',
    plan: 'intro',
    paymentMethod: signup?.payment?.provider || '',
    about: signup.bizDesc || '',
    // read-only fields, filled by backend later:
    minutes: 20,  // starter credit (if you prefer: remainingMinutes: 20)
    number: '',   // assigned later (if you prefer: phoneNumber: '')
    status: 'active'
  });

  // Save account -> Firestore
  const saveAccountBtn = $('#saveAccount');
  const saveAccountMsg = $('#saveAccountMsg');
  if (saveAccountBtn) saveAccountBtn.addEventListener('click', async ()=>{
    const payload = {
      name:  nameEl ? nameEl.value.trim() : '',
      email: emailEl ? emailEl.value.trim() : '',
      phone: acctPhone,
    };
    await saveAccount(acctPhone, payload);
    flash(saveAccountMsg);
    if (acctSummary) acctSummary.textContent = payload.name ? `${payload.name} • ${acctPhone}` : acctPhone;
  });

  // Wire Account header trigger (accordion)
  $$('[data-acc-trigger][data-target]').forEach(btn=>{
    btn.addEventListener('click', ()=> openPanel(document.getElementById(btn.dataset.target)));
  });

  // Agents live list from Firestore
  const list  = $('#agentsList');
  const addBtn = $('#addAgent');
  const tmpl = $('#agentTmpl');
  if (!list || !tmpl) return console.error('Missing #agentsList or #agentTmpl in HTML');

  function render(agents){
    list.innerHTML = '';

    // Allow only one draft at a time
    const hasDraft = agents.some(a => a.status === 'draft');
    if (addBtn){
      addBtn.disabled = hasDraft;
      addBtn.classList.toggle('opacity-50', hasDraft);
      addBtn.title = hasDraft ? 'Finish activating the current new agent before adding another.' : '';
    }

    agents.forEach((ag, idx)=>{
      const frag = document.importNode(tmpl.content, true);
      const root   = frag.firstElementChild;
      const trigger= root.querySelector('[data-acc-trigger]');
      const panel  = root.querySelector('.acc-panel');
      const title  = root.querySelector('[data-title]');
      const subtitle = root.querySelector('[data-subtitle]');
      const statusBadge = root.querySelector('[data-status]');

      // Buttons
      const dupBtn = root.querySelector('[data-duplicate]');
      const delBtn = root.querySelector('[data-delete]');
      const msgEl  = panel.querySelector('[data-msg]');
      const saveBtn= panel.querySelector('[data-save]');
      const actBtn = panel.querySelector('[data-activate]');
      const cancelBtn = panel.querySelector('[data-cancel]');

      // Inputs
      const nameI = panel.querySelector('[data-field="name"]');
      const areaI = panel.querySelector('[data-field="areaCode"]');
      const planRadios = panel.querySelectorAll('input[data-field="plan"]');
      const pmSel = panel.querySelector('[data-field="paymentMethod"]');
      const aboutT= panel.querySelector('[data-field="about"]');
      const phoneI= panel.querySelector('[data-field="phoneNumber"]');
      const minsI = panel.querySelector('[data-field="remainingMinutes"]');
      const nextI = panel.querySelector('[data-field="nextBilling"]'); // optional for later

      // Field name compatibility (UI may use phoneNumber/remainingMinutes; backend stores number/minutes)
      const phoneNumber      = ag.phoneNumber ?? ag.number ?? '';
      const remainingMinutes = ag.remainingMinutes ?? ag.minutes ?? '';
      const nextBilling      = ag.nextBilling ?? '';

      // Bind values
      if (title) title.textContent = ag.name || `Agent ${idx+1}`;
      if (subtitle) subtitle.textContent = `${ag.plan==='intro'?'Intro':'Standard'} • ${phoneNumber || 'No number yet'} • ${remainingMinutes===''?'—':remainingMinutes} min`;
      if (statusBadge) statusBadge.textContent = ag.status || 'active';

      if (nameI)  nameI.value  = ag.name || '';
      if (areaI)  areaI.value  = ag.areaCode || '';
      if (pmSel)  pmSel.value  = ag.paymentMethod || '';
      if (aboutT) aboutT.value = ag.about || '';
      if (phoneI) phoneI.value = phoneNumber;
      if (minsI)  minsI.value  = remainingMinutes;
      if (nextI)  nextI.value  = nextBilling;
      planRadios.forEach(r=> r.checked = (r.value === ag.plan));

      // Accordion open
      if (trigger) trigger.addEventListener('click', ()=> openPanel(panel));

      // Disable duplicate if any draft exists or this one is a draft
      const draftExists = agents.some(a => a.status === 'draft');
      if (draftExists || ag.status === 'draft'){
        if (dupBtn) { dupBtn.disabled = true; dupBtn.classList.add('opacity-50'); dupBtn.title = 'Duplicate disabled until new agent is activated.'; }
      }
      if (ag.status === 'draft'){ if (actBtn) actBtn.classList.remove('hidden'); if (cancelBtn) cancelBtn.classList.remove('hidden'); if (statusBadge) statusBadge.textContent = 'draft'; }

      // Debounced updates to Firestore
      const debName  = debounce(v => updateAgent(acctPhone, ag.id, { name: v }));
      if (nameI) nameI.addEventListener('input', e => { const v = e.target.value; if (title) title.textContent = v || `Agent ${idx+1}`; debName(v); });
      if (areaI) areaI.addEventListener('input', e => { const v = e.target.value.replace(/\D/g,'').slice(0,3); e.target.value=v; updateAgent(acctPhone, ag.id, { areaCode: v }); });
      const debAbout = debounce(v => updateAgent(acctPhone, ag.id, { about: v }));
      if (aboutT) aboutT.addEventListener('input', e => debAbout(e.target.value));
      if (pmSel) pmSel.addEventListener('change', e => updateAgent(acctPhone, ag.id, { paymentMethod: e.target.value }));
      planRadios.forEach(r => r.addEventListener('change', ev => { if (ev.target.checked) updateAgent(acctPhone, ag.id, { plan: ev.target.value }); }));

      if (saveBtn)  saveBtn.addEventListener('click', async ()=>{ await updateAgent(acctPhone, ag.id, {}); flash(msgEl); });
      if (actBtn)   actBtn.addEventListener('click',  async ()=>{ await updateAgent(acctPhone, ag.id, { status:'active' }); flash(msgEl,'Activated'); });
      if (cancelBtn)cancelBtn.addEventListener('click',async ()=>{ await deleteAgent(acctPhone, ag.id); });

      if (delBtn) delBtn.addEventListener('click', async (e)=>{ e.stopPropagation(); if (!confirm('Delete this agent?')) return; await deleteAgent(acctPhone, ag.id); });
      if (dupBtn) dupBtn.addEventListener('click', async (e)=>{ e.stopPropagation(); if (agents.some(a=>a.status==='draft')) return; await duplicateAgent(acctPhone, ag.id); });

      list.appendChild(frag);
    });

    // Open the first agent panel by default
    const firstPanel = list.querySelector('.acc-panel');
    if (firstPanel) openPanel(firstPanel);
  }

  // Subscribe live to Firestore agents
  subscribeAgents(acctPhone, render);

  // Add new agent (restrict to one draft)
  if (addBtn) addBtn.addEventListener('click', async ()=>{
    await addAgent(acctPhone, { status:'draft', name:'New Agent', plan:'standard', areaCode:'' });
  });

  // Sign out
  const signOut = $('#signOut');
  if (signOut) signOut.addEventListener('click', ()=>{
    document.cookie = `sf_phone=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    location.href = 'index.html';
  });
}

main().catch(err => {
  console.error('Account init failed', err);
  alert('Could not load your account UI. Please refresh.');
});
