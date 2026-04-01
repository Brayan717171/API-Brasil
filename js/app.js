/* =====================================================
   Brasil — Explorador de Estados | js/app.js
   ===================================================== */

   const BASE = 'http://localhost:3000';

   // ── TABS ──────────────────────────────────────────────
   document.querySelectorAll('.nav-btn').forEach(btn => {
     btn.addEventListener('click', () => {
       const tab = btn.dataset.tab;
   
       document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
       document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
   
       btn.classList.add('active');
       document.getElementById('tab-' + tab).classList.add('active');
     });
   });
   
   // ── UTILS ─────────────────────────────────────────────
   async function fetchAPI(endpoint) {
     const res = await fetch(BASE + endpoint);
     if (!res.ok) throw new Error(`Erro ${res.status}`);
     return res.json();
   }
   
   function showError(containerId, msg) {
     document.getElementById(containerId).innerHTML =
       `<p class="error-msg">⚠ ${msg}</p>`;
   }
   
   function showLoading(containerId) {
     document.getElementById(containerId).innerHTML =
       `<p class="loading">Carregando...</p>`;
   }
   
   // ── TAB: TODOS OS ESTADOS ─────────────────────────────
   async function carregarEstados() {
     try {
       const data = await fetchAPI('/estados');
   
       // Atualiza contador no header
       const counter = document.getElementById('headerCounter');
       counter.innerHTML = `<strong>${data.quantidade}</strong> estados`;
   
       // Renderiza grid de siglas
       const grid = document.getElementById('siglasGrid');
       grid.innerHTML = data.uf.map(uf => `
         <div class="sigla-card" title="${uf}" onclick="irParaEstado('${uf}')">
           <span>${uf}</span>
         </div>
       `).join('');
     } catch (e) {
       showError('siglasGrid', 'Não foi possível carregar os estados. Verifique se a API está rodando.');
     }
   }
   
   function irParaEstado(uf) {
     document.querySelector('[data-tab="estado"]').click();
     document.getElementById('inputEstado').value = uf;
     buscarDadosEstado();
   }
   
   // ── TAB: DADOS DO ESTADO ──────────────────────────────
   async function buscarDadosEstado() {
     const uf = document.getElementById('inputEstado').value.trim().toUpperCase();
     if (!uf) return;
   
     showLoading('resultadoEstado');
     try {
       const d = await fetchAPI('/estados/' + uf);
       document.getElementById('resultadoEstado').innerHTML = `
         <div class="info-grid">
           <div class="info-item">
             <label>Sigla</label>
             <span>${d.uf}</span>
           </div>
           <div class="info-item">
             <label>Nome</label>
             <span class="normal">${d.descricao}</span>
           </div>
           <div class="info-item">
             <label>Capital</label>
             <span class="normal">${d.capital}</span>
           </div>
           <div class="info-item">
             <label>Região</label>
             <span class="normal">${d.regiao}</span>
           </div>
         </div>
       `;
     } catch {
       showError('resultadoEstado', `Estado "${uf}" não encontrado.`);
     }
   }
   
   document.getElementById('inputEstado').addEventListener('keydown', e => {
     if (e.key === 'Enter') buscarDadosEstado();
   });
   
   // ── TAB: CAPITAL ──────────────────────────────────────
   async function buscarCapital() {
     const uf = document.getElementById('inputCapital').value.trim().toUpperCase();
     if (!uf) return;
   
     showLoading('resultadoCapital');
     try {
       const d = await fetchAPI('/estados/' + uf + '/capital');
       document.getElementById('resultadoCapital').innerHTML = `
         <div class="info-grid">
           <div class="info-item">
             <label>Estado</label>
             <span>${d.uf}</span>
           </div>
           <div class="info-item">
             <label>Nome</label>
             <span class="normal">${d.descricao}</span>
           </div>
           <div class="info-item">
             <label>Capital</label>
             <span class="normal">${d.capital}</span>
           </div>
         </div>
       `;
     } catch {
       showError('resultadoCapital', `Estado "${uf}" não encontrado.`);
     }
   }
   
   document.getElementById('inputCapital').addEventListener('keydown', e => {
     if (e.key === 'Enter') buscarCapital();
   });
   
   // ── TAB: REGIÃO ───────────────────────────────────────
   async function buscarRegiao(regiao, btn) {
     document.querySelectorAll('.btn-regiao').forEach(b => b.classList.remove('active'));
     if (btn) btn.classList.add('active');
   
     showLoading('resultadoRegiao');
     try {
       const d = await fetchAPI('/regioes/' + encodeURIComponent(regiao));
       const lista = d.estados.map(e => `
         <div class="estado-chip">
           <span class="uf">${e.uf}</span>
           <span class="nome">${e.descricao}</span>
         </div>
       `).join('');
   
       document.getElementById('resultadoRegiao').innerHTML = `
         <div style="margin-bottom:20px">
           <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)">Região</p>
           <p style="font-family:var(--display);font-size:32px;color:var(--gold)">${d.regiao}</p>
         </div>
         <div class="estados-list">${lista}</div>
       `;
     } catch {
       showError('resultadoRegiao', `Região "${regiao}" não encontrada.`);
     }
   }
   
   // ── TAB: CIDADES ──────────────────────────────────────
   async function buscarCidades() {
     const uf = document.getElementById('inputCidades').value.trim().toUpperCase();
     if (!uf) return;
   
     showLoading('resultadoCidades');
     try {
       const d = await fetchAPI('/estados/' + uf + '/cidades');
       const itens = d.cidades.map(c => `<div class="cidade-item">${c}</div>`).join('');
   
       document.getElementById('resultadoCidades').innerHTML = `
         <div class="cidades-header">
           <h3>${d.descricao}</h3>
           <span class="count">${d.quantidade_cidades} cidades</span>
         </div>
         <div class="cidades-grid">${itens}</div>
       `;
     } catch {
       showError('resultadoCidades', `Estado "${uf}" não encontrado.`);
     }
   }
   
   document.getElementById('inputCidades').addEventListener('keydown', e => {
     if (e.key === 'Enter') buscarCidades();
   });
   
   // ── TAB: CAPITAIS HISTÓRICAS ──────────────────────────
   async function carregarCapitaisPais() {
     try {
       const data = await fetchAPI('/capital-pais');
       const cards = data.capitais.map((c, i) => `
         <div class="capital-card">
           <div class="capital-num">${String(i + 1).padStart(2, '0')}</div>
           <div class="capital-info">
             <h3>${c.capital}</h3>
             <p>${c.descricao} &mdash; ${c.regiao}</p>
           </div>
           <div class="capital-periodo">
             <span class="ano">${c.capital_pais_ano_inicio} – ${c.capitais_pais_ano_fim ?? 'atual'}</span>
             <span class="label">período</span>
           </div>
         </div>
       `).join('');
   
       document.getElementById('resultadoCapitaisPais').innerHTML =
         `<div class="capitais-list">${cards}</div>`;
     } catch {
       showError('resultadoCapitaisPais', 'Não foi possível carregar as capitais históricas.');
     }
   }
   
   // ── INIT ──────────────────────────────────────────────
   carregarEstados();
   carregarCapitaisPais();