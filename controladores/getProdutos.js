const fs = require("fs");

const produtos = JSON.parse(fs.readFileSync('../dados/data.json').toString());
const listaProdutos = produtos.produtos;

function listarProdutos(req, res) {
    res.json(listaProdutos)
}

function filtrarCategoria(req, res) {
    const categoriaProduto = req.params.categoriaProduto;

    const produtos = listaProdutos.filter(produtos => {
        if (produtos.categoria === categoriaProduto && produtos.estoque) {
            return true
        }
        else {
            return false
        }
    })

    res.json(produtos);
}

function filtrarPreco(req, res) {
    const precoInicial = Number(req.params.precoInicial);
    const precoFinal = Number(req.params.precoFinal);

    const produtos = listaProdutos.filter(produtos => {
        if (produtos.preco >= precoInicial && produtos.preco <= precoFinal && produtos.estoque) {
            return true
        }
        else {
            return false
        }
    });
    res.json(produtos);
}

function filtragemCruzada(req, res) {
    const categoriaProduto = req.params.categoriaProduto;
    const precoInicial = Number(req.params.precoInicial);
    const precoFinal = Number(req.params.precoFinal);

    const produtos = listaProdutos.filter(produtos => {
        if (produtos.preco >= precoInicial && produtos.preco <= precoFinal && produtos.categoria === categoriaProduto && produtos.estoque) {
            return true
        }
        else {
            return false
        }
    });
    res.json(produtos);
}

module.exports = {
    filtragemCruzada,
    filtrarPreco,
    filtrarCategoria,
    listarProdutos
}