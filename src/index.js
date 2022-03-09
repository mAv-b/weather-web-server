const express = require('express');
const resquest = require('request');
const hbs = require('hbs');
const path = require('path');
const weather = require('../utils/weather-api.js');
const imagesFilter = require('../utils/is-day-api.js');
const localNews = require('../utils/day-news-NYT-api.js');
const reeds = require('../utils/reeds-NYT-api.js');
const {geocode,incremental_geocode} = require('../utils/geocode-api.js');
const { request } = require('http');
const { query } = require('express');

const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');
const servingFilesPath = path.join(__dirname,'../public');
const app = express();

app.use('/',(req, res, next)=>{
    const regexp = /pages/;
    if(req.url.match(regexp)){
        res.status(403).end('403 Forbidden');
    }else next();
});
app.use(express.static(servingFilesPath));
app.set('views',viewsPath);
app.set('view engine','hbs');
hbs.registerPartials(partialsPath);

app.get('',(req,res)=>{
    res.render('index',{
        teste:'oi'
    });
})

app.get('/map/',(req,res)=>{
    const search = req.query.query;
    incremental_geocode(search, (err,data)=>{
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.json(data);
        }
    })
});

app.get('/map/search/:query',(req,res)=>{
    const location = req.params.query;
    geocode(location, (err,data)=>{
        if(err){
            console.log(err+':(1)');
            res.send(err);
        }else{
            const {latitude,longitude} = data;
            weather(latitude,longitude,(err,response)=>{
                if(err){
                    console.log(err+':(2)');
                    res.send(err);
                }else{
                    let observationTime;
                    localNews(location, (news)=>{
                        reeds((err,reedsData)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                let reedsJSON = reedsData;
                                let local_news = news;
                                const img = imagesFilter(response);
                                const actualTime = `${response.localtime.split(' ')[1]} (UTC${response.utc_offset.split('.')[0]}:00)`;
                                const actualDate = response.localtime.split(' ')[0];
                                if(response.observation_time.includes('PM')){
                                    const query = response.observation_time.split(' ')[0];
                                    const item = query.split(':');
                                    const hours24 = (Number(item[0])+12 === 24)? '00':String(Number(item[0])+12);
                                    observationTime = hours24 +':'+ item[1];
                                }else{
                                    const query = response.observation_time.split(' ')[0];
                                    const item = query.split(':');
                                    if(Number(item[0])+12 === 24){
                                        const hours24 = '00';
                                        observationTime = hours24 + ':' + item[1];
                                    }else{
                                        observationTime = response.observation_time.split(' ')[0];
                                    }
                                };
                                delete response.observation_time;
                                delete response.localtime;
                                const arr1 = Object.entries(data);
                                const arr2 = Object.entries(response);
                                const obj_data = {
                                    img,
                                    actualTime,
                                    observationTime,
                                    actualDate,
                                    local_news,
                                    reedsJSON
                                };
                                arr1.forEach(k=>obj_data[k[0]] = k[1]);
                                arr2.forEach(k=>obj_data[k[0]] = k[1]);
                                res.json(obj_data);
                            }
                        });
                    });
                }
            });
        }
    });
});

app.get('/*',(req,res)=>{
    res.status(404).send('Not Exist')
});

app.listen('3000',()=>{
    console.log('rodando em 3000');
})