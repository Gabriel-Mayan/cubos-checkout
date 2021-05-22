const { addBusinessDays } = require('date-fns');

function carrinhoVazio()
{
    const carrinhoVazio =
    {
        "produtos": [],
        "subtotal": 0,
        "dataDeEntrega": null,
        "valorDoFrete": 0,
        "totalAPagar": 0
    }

    return carrinhoVazio;
}

function calcularDataEntrega()
{
    const dataDeEntrega = addBusinessDays(Date.now(), 15);
    return dataDeEntrega;
}

function calcularSubtotal(carrinho)
{
    let subTotal = 0;
    
    for(item of carrinho.produtos)
    {
        subTotal += item.quantidade * item.preco;
    }

    return subTotal;
}

function atualizarInfoCarrinho(carrinho)
{
    if(!carrinho)
    {
        return carrinhoVazio();
    }

    const subtotal = calcularSubtotal(carrinho);
    const frete = calcularFrete(calcularSubtotal(carrinho), carrinho.produtos.length);    

    carrinho = 
    {
        "produtos": carrinho.produtos,
        "subTotal": subtotal,
        "dataDeEntrega": calcularDataEntrega(),
        "valorDoFrete": frete,
        "totalAPagar": calcularTotal(subtotal,frete)
    }

    return carrinho;
}

function calcularTotal(subtotal,frete)
{
    return subtotal+frete;
}

function calcularFrete(subTotal, estadoCarrinho)
{
    const precoBaseFrete = 5000;
    const precoMinimoFreteGratis = 20000;
    
    let frete;

    subTotal > precoMinimoFreteGratis || estadoCarrinho < 1 ? frete = 0 : frete = precoBaseFrete;

    return frete;
}

function deletarUmItemCarrinho(carrinho, indice)
{
    carrinho.produtos.splice(indice,1);

    return carrinho;
}

function addProdutoCarrinho(carrinho, produto, quantidade)
{
    const {id, nome, preco, categoria} = produto;

    produto = 
    {
        id,
        nome,
        preco,
        categoria,
        quantidade
    }

    carrinho.produtos.push(produto);

    return carrinho;
}

function incrementarQuantidade(carrinho, quantidade, indice)
{
    carrinho.produtos[indice].quantidade += quantidade;

    if(carrinho.produtos[indice].quantidade <= 0)
    {
        deletarUmItemCarrinho(carrinho,indice)
    }

    return carrinho;
}

module.exports = {
    atualizarInfoCarrinho,
    addProdutoCarrinho,
    incrementarQuantidade,
    carrinhoVazio,
    deletarUmItemCarrinho
}