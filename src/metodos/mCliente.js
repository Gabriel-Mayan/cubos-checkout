function validarExistenciaCliente(infoPagamento)
{
    const dadosCliente = infoPagamento.customer;

    if(!dadosCliente)
    {
        return false;
    }
    return dadosCliente;
}

function validarDadosUsuario(cliente)
{
    if(cliente.country.length != 2) 
        return {mensagem:"Campo country do cliente inválido"};
    
    if(cliente.name.trim().split(" ").length < 2)
        return {mensagem: "Campo nome precisa conter pelo menos um nome e um sobrenome"};
    
    if(!cliente.documents || cliente.documents.length === 0)
        return {mensagem: "cliente não informou os documentos"};
    
    const infoDoc = cliente.documents;

    if(infoDoc[0].type === "cpf")
    {
        if(infoDoc[0].number.length !== 11)
            return {mensagem: "cpf incorreto"}; 
    }
    else
    {
        return {mensagem: "cpf não cadastrado"};
    }
    return false;
}

module.exports = {
    validarExistenciaCliente,
    validarDadosUsuario
}