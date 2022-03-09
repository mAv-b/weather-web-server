const resquest = require('request');
// const API_key = 'a5fd8e715737979e5a80b514347866d1';
const API_key = '334389915dfb682eb1f1037ce751f995';

const request_conf = resquest.defaults({
    baseUrl:'http://api.weatherstack.com/',
    json: true
});

function module_weather(lat,lon,callback){
    const path = `/current?access_key=${API_key}&query=${lat+','+lon}`;
    request_conf(path,(error,{body})=>{
        if(error){
            callback('Falha ao conectar com a api',undefined);
        }else if(body.success === false){
            callback('Pesquisa invalida', undefined)
        }else{
            const {unit} = body.request;
            const {localtime,utc_offset} = body.location;
            const {
                observation_time,
                temperature,
                weather_descriptions,
                wind_speed,
                wind_degree,
                wind_dir,
                pressure,
                precip,
                humidity,
                cloudcover,
                feelslike,
                uv_index,
                visibility,
                is_day
            } = body.current;
            const data = {unit,localtime,utc_offset,observation_time,temperature,weather_descriptions,wind_speed,wind_degree,wind_dir,
            pressure,precip,humidity,cloudcover,feelslike,uv_index,visibility,is_day};
            callback(undefined, data);
        }
    });
}

module.exports = module_weather;