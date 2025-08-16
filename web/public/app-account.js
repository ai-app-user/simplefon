// app-account.js — Account UI (Accordion + Firebase) — Option B: save only on explicit "Save"

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

const acctPhone = decode(getCookie('sf_phone'));
if (!acctPhone) location.replace('signup.html?next=account');

function flash(el, text='Saved'){ if (!el) return; el.textContent = text; setTimeout(()=>el.textContent='', 1400); }
function closeAllPanels(){ $$('.acc-panel').forEach(p=>p.classList.add('hidden')); $$('[data-acc-trigger]').forEach(t=>t.setAttribute('aria-expanded','false')); }
function openPanel(panel){ if(!panel) return; closeAllPanels(); panel.classList.remove('hidden'); const btn = panel.previousElementSibling?.querySelector('[data-acc-trigger]')||panel.parentElement.querySelector('[data-acc-trigger]'); if(btn) btn.setAttribute('aria-expanded','true'); panel.parentElement.scrollIntoView({block:'start',behavior:'smooth'}); }

// Track which agent should remain open between renders
let lastOpenId = null;

async function main(){
  // Ensure user doc
  await ensureUser(acctPhone, { phone: acctPhone });

  // Account fields
  const phoneEl = $('#acctPhone');
  const nameEl  = $('#acctName');
  const emailEl = $('#acctEmail');
  const acctSummary = $('#acctSummary');
  if (phoneEl) phoneEl.value = acctPhone;

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
    minutes: 20,   // starter credit
    number: '',    // assigned later
    status: 'active'
  });

  // Save account -> Firestore (explicit)
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

  // Wire Account header (accordion)
  $$('[data-acc-trigger][data-target]').forEach(btn=>{
    btn.addEventListener('click', ()=> openPanel(document.getElementById(btn.dataset.target)));
  });

  const list  = $('#agentsList');
  const addBtn = $('#addAgent');
  const tmpl = $('#agentTmpl');
  if (!list || !tmpl) return console.error('Missing #agentsList or #agentTmpl in HTML');

  function render(agents){
    // Remember currently open agent before teardown
    const prevOpenTrigger = list.querySelector('[data-acc-trigger][aria-expanded="true"]');
    const prevOpenItem = prevOpenTrigger && prevOpenTrigger.closest('[data-agent-id]');
    const prevOpenId = prevOpenItem?.dataset.agentId || lastOpenId;

    list.innerHTML = '';

    const hasDraft = agents.some(a => a.status === 'draft');
    if (addBtn){
      addBtn.disabled = hasDraft;
      addBtn.classList.toggle('opacity-50', hasDraft);
      addBtn.title = hasDraft ? 'Finish activating the current new agent before adding another.' : '';
    }

    agents.forEach((ag, idx)=>{
      const frag = document.importNode(tmpl.content, true);
      const root   = frag.firstElementChild;
      root.setAttribute('data-agent-id', ag.id);

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

      // Field name compatibility
      const phoneNumber      = ag.phoneNumber ?? ag.number ?? '';
      const remainingMinutes = ag.remainingMinutes ?? ag.minutes ?? '';
      const nextBilling      = ag.nextBilling ?? '';

      // Bind current values
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

      // Accordion open + remember open id
      if (trigger) {
        trigger.addEventListener('click', ()=>{
          lastOpenId = ag.id;
          openPanel(panel);
        });
      }

      // Update UI text live (NO backend writes)
      if (nameI) nameI.addEventListener('input', e => {
        const v = e.target.value;
        if (title) title.textContent = v || `Agent ${idx+1}`;
      });
      if (areaI) areaI.addEventListener('input', e => {
        const v = e.target.value.replace(/\D/g,'').slice(0,3);
        e.target.value = v;
      });
      if (pmSel) pmSel.addEventListener('change', () => {});
      if (aboutT) aboutT.addEventListener('input', () => {});
      planRadios.forEach(r => r.addEventListener('change', ev => {
        if (ev.target.checked && subtitle) {
          const planTxt = ev.target.value === 'intro' ? 'Intro' : 'Standard';
          subtitle.textContent = `${planTxt} • ${phoneNumber || 'No number yet'} • ${remainingMinutes===''?'—':remainingMinutes} min`;
        }
      }));

      // Save button — single write to Firestore
      if (saveBtn) saveBtn.addEventListener('click', async ()=>{
        const selectedPlan = panel.querySelector('input[data-field="plan"]:checked')?.value || ag.plan;
        const patch = {
          name: (nameI?.value || '').trim(),
          areaCode: (areaI?.value || '').replace(/\D/g,'').slice(0,3),
          paymentMethod: pmSel?.value || '',
          about: (aboutT?.value || '').trim(),
          plan: selectedPlan,
        };
        await updateAgent(acctPhone, ag.id, patch);
        lastOpenId = ag.id; // keep this panel open after snapshot re-render
        flash(msgEl, 'Saved');
      });

      // Activate draft (still immediate write)
      if (ag.status === 'draft'){
        if (actBtn) actBtn.classList.remove('hidden');
        if (cancelBtn) cancelBtn.classList.remove('hidden');
        if (statusBadge) statusBadge.textContent = 'draft';
      }
      if (actBtn) actBtn.addEventListener('click', async ()=>{
        await updateAgent(acctPhone, ag.id, { status: 'active' });
        lastOpenId = ag.id;
        flash(msgEl, 'Activated');
      });

      // Cancel draft (delete)
      if (cancelBtn) cancelBtn.addEventListener('click', async ()=>{
        await deleteAgent(acctPhone, ag.id);
      });

      // Delete
      if (delBtn) delBtn.addEventListener('click', async (e)=>{
        e.stopPropagation();
        if (!confirm('Delete this agent?')) return;
        await deleteAgent(acctPhone, ag.id);
      });

      // Duplicate
      if (dupBtn) {
        const draftExists = agents.some(a => a.status === 'draft');
        if (draftExists || ag.status === 'draft') {
          dupBtn.disabled = true;
          dupBtn.classList.add('opacity-50');
          dupBtn.title = 'Duplicate disabled until new agent is activated.';
        }
        dupBtn.addEventListener('click', async (e)=>{
          e.stopPropagation();
          if (agents.some(a=>a.status==='draft')) return;
          const newId = await duplicateAgent(acctPhone, ag.id);
          lastOpenId = newId || ag.id;
        });
      }

      list.appendChild(frag);
    });

    // Re-open previously open panel (or fallback to first if none)
    let targetPanel = null;
    if (prevOpenId) targetPanel = list.querySelector(`[data-agent-id="${prevOpenId}"] .acc-panel`);
    if (targetPanel) openPanel(targetPanel);
    else {
      const firstPanel = list.querySelector('.acc-panel');
      if (firstPanel) openPanel(firstPanel);
    }
  }

  // Live subscription; renders happen on:
  // - explicit Save (our update triggers snapshot),
  // - Activate/Cancel/Duplicate/Delete,
  // - external changes (other clients/servers).
  subscribeAgents(acctPhone, render);

  // Add agent -> open new draft automatically
  if (addBtn) addBtn.addEventListener('click', async ()=>{
    const newId = await addAgent(acctPhone, { status:'draft', name:'New Agent', plan:'standard', areaCode:'' });
    lastOpenId = newId || null;
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
