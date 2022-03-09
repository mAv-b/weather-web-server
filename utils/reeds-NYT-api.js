const request = require('request');
const xml2js = require('xml-js');

function module_reeds(callback){
    request('https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml',{json:true},(error,{body})=>{
        if(error){
            callback('Falha ao conectar com a API', undefined);
        }else{
            let JSON_body = xml2js.xml2json(body, {compact:true, spaces:4});
            const JSON_send = new Array();
            JSON_body = JSON.parse(JSON_body);
            JSON_body.rss.channel.item.forEach(item=>{
                const title = item.title;
                const link = item.link;
                const media = item['media:content'];
                const obj = {
                    'title': title,
                    'link': link,
                    'media': media
                };
                JSON_send.push(obj);
            });
            callback(undefined, JSON_send);
        }
    });
};

module.exports = module_reeds;
