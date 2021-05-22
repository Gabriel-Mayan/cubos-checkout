const { lerArquivo,
        escreverArquivo } = require('../metodos/utilitarios');

const { atualizarInfoCarrinho,
        addProdutoCarrinho,
        incrementarQuantidade,
        carrinhoVazio,
        deletarUmItemCarrinho } = require('../metodos/mCarrinho');

const { validarExistenciaCliente,
        validarDadosUsuario } = require('../metodos/mCliente');

const caminhoCliente = '../src/dados/cliente.json';
const caminhoProdutos = '../src/dados/estoque.json';
const caminhoCarrinho = '../src/dados/carrinho.json';

async function retornarCarrinho(req, res) 
{
    let carrinho = await lerArquivo(caminhoCarrinho);

    if (!carrinho) 
    {
        carrinho = carrinhoVazio();
        carrinho = atualizarInfoCarrinho(carrinho);

        await escreverArquivo(caminhoCarrinho, carrinho);
        return res.status(200).json(carrinho);
    }
    else 
    {
        carrinho = atualizarInfoCarrinho(carrinho);

        return res.status(200).json(carrinho);
    }
}

async function addProduto(req, res) 
{
    const { id, quantidade } = req.body;

    let carrinho = await lerArquivo(caminhoCarrinho);
    const { produtos } = await lerArquivo(caminhoProdutos);

    const prodEncontrado = produtos.find(produtos => produtos.id === id);
    const IndiceProdCarrinho = carrinho.produtos.findIndex(carrinho => carrinho.id === id);

    if (!id || !quantidade)
        return res.status(400).json({ mensagem: "É necessário adcionar id e quantidade de produtos" });

    if (!prodEncontrado)
        return res.status(400).json({ mensagem: "Produto não existe" });

    if (quantidade < 1)
        return res.status(400).json({ mensagem: "É necessário informar uma quantidade positiva de itens" });

    if (IndiceProdCarrinho === -1) 
    {
        if (quantidade > prodEncontrado.estoque)
            return res.status(400).json({ mensagem: "A quantidade de produtos adcionados ao carrinho é superior a quantidade em estoque" });

        carrinho = addProdutoCarrinho(carrinho, prodEncontrado, quantidade);
        carrinho = atualizarInfoCarrinho(carrinho);
    }
    else {
        if ((quantidade + carrinho.produtos[IndiceProdCarrinho].quantidade) > prodEncontrado.estoque)
            return res.status(400).json({ mensagem: "A quantidade de produtos adcionados ao carrinho é superior a quantidade em estoque" });

        if ((quantidade + carrinho.produtos[IndiceProdCarrinho].quantidade) < 0)
            return res.status(400).json({ mensagem: "A quantidade de produtos retirados do carrinho é inferior a zero" });

        carrinho = incrementarQuantidade(carrinho, quantidade, IndiceProdCarrinho);
        carrinho = atualizarInfoCarrinho(carrinho);
    }

    await escreverArquivo(caminhoCarrinho, carrinho);
    return res.status(200).json({ mensagem: "Produto adcionado com sucesso" });
}

async function editarQtdProdutos(req, res) 
{
    const id = Number(req.params.id);
    const { quantidade } = req.body;

    let carrinho = await lerArquivo(caminhoCarrinho);
    const { produtos } = await lerArquivo(caminhoProdutos);

    const prodEncontrado = produtos.find(produtos => produtos.id === id);
    const prodEncontradoCarrinho = carrinho.produtos.find(produtos => produtos.id === id);
    const IndiceProdCarrinho = carrinho.produtos.findIndex(carrinho => carrinho.id === id);

    if (!id || !quantidade)
        return res.status(400).json({ mensagem: "É necessário adcionar id e quantidade de produtos" });

    if (!prodEncontradoCarrinho)
        return res.status(400).json({ mensagem: "Produto não existe no carrinho" });

    if ((quantidade + carrinho.produtos[IndiceProdCarrinho].quantidade) > prodEncontrado.estoque)
        return res.status(400).json({ mensagem: "A quantidade de produtos adcionados ao carrinho é superior a quantidade em estoque" });

    if ((quantidade + carrinho.produtos[IndiceProdCarrinho].quantidade) < 0)
        return res.status(400).json({ mensagem: "A quantidade de produtos retirados do carrinho é inferior a zero" });

    carrinho = incrementarQuantidade(carrinho, quantidade, IndiceProdCarrinho);
    carrinho = atualizarInfoCarrinho(carrinho);

    await escreverArquivo(caminhoCarrinho, carrinho);
    return res.status(200).json({ mensagem: "Produto atualizado com sucesso", carrinho });
}

async function deletarProduto(req, res)
{
    const id = Number(req.params.id);

    let carrinho = await lerArquivo(caminhoCarrinho);
    const IndiceProdCarrinho = carrinho.produtos.findIndex(carrinho => carrinho.id === id);

    if (IndiceProdCarrinho === -1) 
        return res.status(400).json({ mensagem: "Produto não se encontra no carrinho", carrinho });
    
    carrinho = deletarUmItemCarrinho(carrinho, IndiceProdCarrinho);
    carrinho = atualizarInfoCarrinho(carrinho);

    await escreverArquivo(caminhoCarrinho, carrinho);
    return res.status(200).json({ mensagem: "Produto deletado com sucesso", carrinho });
}

async function deletarCarrinho(req, res) 
{
    let carrinho = await lerArquivo(caminhoCarrinho);

    if (carrinho.produtos.length < 1) 
        return res.status(200).json({ mensagem: "Carrinho já se encontra vazio" });
    
    carrinho = carrinhoVazio();

    await escreverArquivo(caminhoCarrinho, carrinho);
    return res.status(200).json({ mensagem: "Carrinho esvaziado com sucesso" });
}

async function finalizarCompra(req, res) 
{
    let carrinho = await lerArquivo(caminhoCarrinho);
    const { produtos } = await lerArquivo(caminhoProdutos);
    const infoPagamento = await lerArquivo(caminhoCliente);

    let cliente = validarExistenciaCliente(infoPagamento);
    carrinho = atualizarInfoCarrinho(carrinho);
        
    if (!cliente) 
        return res.status(400).json({ mensagem: "Não existem dados do cliente " });    

    if (carrinho.produtos.length === 0) 
        return res.status(400).json({ mensagem: "O carrinho de compras está vazio" });    

    if (validarDadosUsuario(cliente)) 
    {
        return res.status(400).json(validarDadosUsuario(cliente));
    }
}

module.exports =
{
    retornarCarrinho,
    addProduto,
    editarQtdProdutos,
    deletarProduto,
    deletarCarrinho,
    finalizarCompra
}