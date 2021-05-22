const express = require('express');
const { listarProdutos } = require('./controle/produtos');
const { retornarCarrinho, 
        addProduto, 
        editarQtdProdutos, 
        deletarProduto,
        deletarCarrinho,
        finalizarCompra } = require('./controle/carrinho');

const roteador = express();

roteador.get('/produtos', listarProdutos);

/*-----------------------------------------------------------------------------*/

roteador.get('/carrinho', retornarCarrinho);
roteador.post('/carrinho', addProduto);
roteador.patch('/carrinho/produtos/:id', editarQtdProdutos);
roteador.delete('/carrinho/', deletarCarrinho);
roteador.delete('/carrinho/produtos/:id', deletarProduto);
roteador.post('/finalizar-compra', finalizarCompra);

/*-----------------------------------------------------------------------------*/


module.exports = roteador;
