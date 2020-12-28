/*

    

*/

const axios =  require('axios');
const cheerio =  require('cheerio');
const fs =  require('fs');

const sitealvo = 'https://sc.olx.com.br/norte-de-santa-catarina/regiao-do-vale-do-itajai/blumenau?q=iphone';

const dados = []

const dadosbrutos = async() => {

    try {
        const res = await axios.get(sitealvo);
        //console.log(res.data);
        return res.data;
    } catch (error) {

        console.log('PROBLEMA AO EXTRAIR OS DADOS BRUTOS!' + error);
        
    }

};

const listalinks = async () => {

    const html = await dadosbrutos();
    const $ = await cheerio.load(html);
    $('.fnmrjs-0').each(function(i,link){

        dados[i] = $(link).attr('href');
    });
    //console.log(dados);
    return dados;
}
//const lnkfilho = 'https://sc.olx.com.br/norte-de-santa-catarina/celulares/iphone-se-826284515';

const coletadados = async (pg)=> {
    try {
        const res = await axios.get(pg);
        const html = res.data;
        const $ = await cheerio.load(html);
        let nomeproduto = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-5.bMEQVr > h1').text();

        const resultado = `
        
        <h1> Produto: ${nomeproduto} <h1>
        <h3> Link: <a href="${pg}"> Produto </a> </h3>
        <br>
        `
        //console.log(resultado);
        gravahtml(resultado);
        
        
    } catch (error) {
        console.log('Deu problema na coleta de dados '+ error);
    }
};

//coletadados(lnkfilho);

const gravahtml = async(result) => {
    fs.writeFileSync('./index.html', result,{flag: 'a+'}, function(err){
        if(err)
            console.log('Erro na geracao HTML' + err);
    })
};


const apresentadados = async() => {
    const todoslinks = await listalinks();
    todoslinks.map(function(linksfilhos){
        coletadados(linksfilhos)
    })
};

const main = async()=> {

    await apresentadados()
}

main();