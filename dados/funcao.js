/***************************************************
 * Objetivo: Manipular dados usando array e json
 * Data: 18/03/2026
 * Autor: Brayan
 * Versão: 1.0 (adaptado para API)
 ***************************************************/

const estadosCidades = require('./estados_cidades');

const getListaDeEstados = function(){
    let listaUf = [];
    estadosCidades.estados.forEach(function(estado) {
        listaUf.push(estado.sigla);
    });
    return { uf: listaUf, quantidade: listaUf.length };
};

const getDadosEstado = function(uf){
    let dadosEstado = {};
    estadosCidades.estados.forEach(function(estado){
        if(estado.sigla.toLocaleUpperCase() == uf.toLocaleUpperCase()){
            dadosEstado = {
                uf: estado.sigla,
                descricao: estado.nome,
                capital: estado.capital,
                regiao: estado.regiao,
            };
        }
    });
    return dadosEstado;
};

const getCapitalEstado = function(uf){
    let dadosCapital = {};
    estadosCidades.estados.forEach(function(estado){
        if(estado.sigla.toLocaleUpperCase() == uf.toLocaleUpperCase()){
            dadosCapital = {
                uf: estado.sigla,
                descricao: estado.nome,
                capital: estado.capital
            };
        }
    });
    return dadosCapital;
};

const getEstadosRegiao = function(regiao){
    let dadosRegiao = { regiao: '', estados: [] };
    estadosCidades.estados.forEach(function(estado){
        if(estado.regiao.toLocaleUpperCase() == regiao.toLocaleUpperCase()){
            dadosRegiao.regiao = estado.regiao;
            dadosRegiao.estados.push({ uf: estado.sigla, descricao: estado.nome });
        }
    });
    return dadosRegiao;
};

const getCapitalPais = function(){
    let dadosCapitalPais = { capitais: [] };
    estadosCidades.estados.forEach(function(estado){
        if(estado.capital_pais){
            dadosCapitalPais.capitais.push({
                capital_atual: estado.capital_pais.capital,
                uf: estado.sigla,
                descricao: estado.nome,
                capital: estado.capital,
                regiao: estado.regiao,
                capital_pais_ano_inicio: estado.capital_pais.ano_inicio,
                capitais_pais_ano_fim: estado.capital_pais.ano_fim
            });
        }
    });
    return dadosCapitalPais;
};

const getCidades = function(uf){
    let dadosCidades = { cidades: [] };
    estadosCidades.estados.forEach(function(estado){
        if(estado.sigla.toLocaleUpperCase() == uf.toLocaleUpperCase()){
            let listaNomes = [];
            estado.cidades.forEach(function(item) {
                listaNomes.push(item.nome);
            });
            dadosCidades = {
                uf: estado.sigla,
                descricao: estado.nome,
                quantidade_cidades: estado.cidades.length,
                cidades: listaNomes
            };
        }
    });
    return dadosCidades;
};

// Exportando todas as funções para o app.js usar
module.exports = {
    getListaDeEstados,
    getDadosEstado,
    getCapitalEstado,
    getEstadosRegiao,
    getCapitalPais,
    getCidades
};
