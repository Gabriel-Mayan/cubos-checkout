const fs = require('fs/promises');

async function lerArquivo(caminho)
{
    try 
    {
        const arquivo = await fs.readFile(caminho, (err, data) =>
        {
            if(err)
            {
                return err;
            }
            return data;
        });
        
        if(arquivo.length > 0)
        {
            return JSON.parse(arquivo);
        }
    }
    catch (err) 
    {
        return err;    
    }
}

async function escreverArquivo(caminho, data){
    try 
    {
        fs.writeFile(caminho, JSON.stringify(data, null, 2));
        return true;
    } 
    catch (error) 
    {
        return false;
    }
}

module.exports = {
    lerArquivo,
    escreverArquivo
}