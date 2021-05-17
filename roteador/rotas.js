const express = require('express');
const
    {
        listarProdutos,
        filtrarCategoria,
        filtrarPreco,
        filtragemCruzada
    } = require('../controladores/getProdutos');

const roteador = express();

roteador.get('/produtos', listarProdutos);
roteador.get('/produtos/:categoria', filtrarCategoria);
roteador.get('/produtos/:precoInicial:precoFinal', filtrarPreco);
roteador.get('produtos/:precoInicial:precoFinal:categoria', filtragemCruzada);
