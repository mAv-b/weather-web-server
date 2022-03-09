const request = require('request');
const API_key = 'pk.eyJ1IjoibWFyay1sMDkiLCJhIjoiY2wwNng1Z2dyMWx0ZDNqbWpyYTJibDJnZCJ9.lYLSXCqKvJjpzTreoGWerQ';

const request_conf = request.defaults({
    baseUrl:'https://api.mapbox.com/geocoding/v5/',
    json:true
});

function module_search_geocoding(_location,callback){
    const location = (_location.includes(','))? _location:encodeURIComponent(_location);
    const path = `/mapbox.places/${location}.json?access_token=${API_key}`;
    request_conf(path,(error,{body})=>{
        if(error){
            callback('Erro ao conectar a api.',undefined);
        }else if(body.features.length === 0){
            callback('Pesquisa invalida',undefined);
        }else{
            const {center:coords, place_name:location} = body.features[0];
            const data = {
                coords,
                location,
                latitude : coords[1],
                longitude : coords[0]
            }
            callback(undefined,data);
        }
    })
}

function incremental_search_geocoding(search,callback){
    const path = `/mapbox.places/${encodeURIComponent(search)}.json?access_token=${API_key}`;
    request_conf(path,(error,{body})=>{
        console.log(body);
        if(error){
            callback('erro ao conectar com a api',undefined);
        }else if(body.features.length === 0){
            callback('nenhum resultado encontrado', undefined);
        }else{
            const {features:arr} = body;
            const data = new Array();
            arr.forEach(name => data.push(name.place_name));
            callback(undefined, data);
        }
    })
}

module.exports = {
    geocode: module_search_geocoding,
    incremental_geocode: incremental_search_geocoding
}