const request = require('request');
const API_key = 'VvjhvSfOSJIEgMVEz4gQd9ZaGA5gzrlT';

const request_conf = request.defaults({
    baseUrl: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
    json:true
});

function module_day_news(location, callback){
    const date = new Date().toISOString().split('T')[0];
    request_conf(`?q=${encodeURIComponent(location)}&api-key=${API_key}&fq=pub_date:("${date}")`,(error,{body})=>{
        if(error){
            console.log('Falha ao conectar com a API');
        }else{
            const docs = body.response.docs;
            const arr = [];
            for(let item of docs){
                // ''console.log(typeof(item.multimedia[0]));''
                arr.push({
                    url: item.web_url,
                    title: item.headline.main,
                    media: item.multimedia[21]
                });
            };
            callback(arr);
        }
    });
}

module.exports = module_day_news;