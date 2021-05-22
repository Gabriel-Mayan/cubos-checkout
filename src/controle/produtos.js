const { lerArquivo } = require('../metodos/utilitarios');

const caminhoProdutos = '../src/dados/estoque.json';

async function listarProdutos(req, res) 
{
    let { produtos } = await lerArquivo(caminhoProdutos);
    
    const { categoria, precoInicial, precoFinal } = req.query;

    if(!produtos)
    {
        res.status(200).json([])
    }

    produtos = produtos.filter(prod => prod.estoque > 0);

    if(categoria)
    {
        produtos = produtos.filter(produtos => produtos.categoria.toLowerCase() === categoria.toLowerCase());
    }

    if(precoInicial)
    {
        produtos = produtos.filter(produtos => produtos.preco >= Number(precoInicial));
    }

    if(precoFinal)
    {
        produtos = produtos.filter(produtos => produtos.preco <= Number(precoFinal));
    }

    return res.status(200).json(produtos);
}

module.exports = {
    listarProdutos
}