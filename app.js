/***************************************************
 * Objetivo: API REST de Estados e Cidades do Brasil
 * Autor: Brayan (adaptado para API)
 * Versão: 1.0
 ***************************************************/

const express = require('express');
const cors = require('cors'); // ← LINHA 1: importar

const funcoes = require('../dados/funcao');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // ← LINHA 2: usar

// ============================================================
// ROTA 1 — Lista todas as siglas dos estados
// GET /estados
// Exemplo: http://localhost:3000/estados
// ============================================================
app.get('/estados', (req, res) => {
    const resultado = funcoes.getListaDeEstados();
    res.json(resultado);
});

// ============================================================
// ROTA 2 — Dados completos de um estado pela sigla
// GET /estados/:uf
// Exemplo: http://localhost:3000/estados/SP
// ============================================================
app.get('/estados/:uf', (req, res) => {
    const { uf } = req.params;
    const resultado = funcoes.getDadosEstado(uf);

    if (!resultado || Object.keys(resultado).length === 0) {
        return res.status(404).json({ erro: `Estado '${uf}' não encontrado.` });
    }

    res.json(resultado);
});

// ============================================================
// ROTA 3 — Capital de um estado pela sigla
// GET /estados/:uf/capital
// Exemplo: http://localhost:3000/estados/RN/capital
// ============================================================
app.get('/estados/:uf/capital', (req, res) => {
    const { uf } = req.params;
    const resultado = funcoes.getCapitalEstado(uf);

    if (!resultado || Object.keys(resultado).length === 0) {
        return res.status(404).json({ erro: `Estado '${uf}' não encontrado.` });
    }

    res.json(resultado);
});

// ============================================================
// ROTA 4 — Estados de uma região
// GET /regioes/:regiao
// Exemplo: http://localhost:3000/regioes/Sul
// ============================================================
app.get('/regioes/:regiao', (req, res) => {
    const { regiao } = req.params;
    const resultado = funcoes.getEstadosRegiao(regiao);

    if (!resultado.estados || resultado.estados.length === 0) {
        return res.status(404).json({ erro: `Região '${regiao}' não encontrada.` });
    }

    res.json(resultado);
});

// ============================================================
// ROTA 5 — Estados que já foram capital do Brasil
// GET /capital-pais
// Exemplo: http://localhost:3000/capital-pais
// ============================================================
app.get('/capital-pais', (req, res) => {
    const resultado = funcoes.getCapitalPais();
    res.json(resultado);
});

// ============================================================
// ROTA 6 — Cidades de um estado pela sigla
// GET /estados/:uf/cidades
// Exemplo: http://localhost:3000/estados/MS/cidades
// ============================================================
app.get('/estados/:uf/cidades', (req, res) => {
    const { uf } = req.params;
    const resultado = funcoes.getCidades(uf);

    if (!resultado || !resultado.cidades || resultado.cidades.length === 0) {
        return res.status(404).json({ erro: `Estado '${uf}' não encontrado.` });
    }

    res.json(resultado);
});

// ============================================================
// Iniciando o servidor
// ============================================================
app.listen(PORT, () => {
    console.log(`✅ API rodando em http://localhost:${PORT}`);
    console.log(`\n📌 Rotas disponíveis:`);
    console.log(`   GET /estados`);
    console.log(`   GET /estados/:uf`);
    console.log(`   GET /estados/:uf/capital`);
    console.log(`   GET /estados/:uf/cidades`);
    console.log(`   GET /regioes/:regiao`);
    console.log(`   GET /capital-pais`);
});
