const fs = require('fs');
const path = require('path');

module.exports = function({weather_descriptions,is_day}){
    const path_public_images = path.join(__dirname,'../public/images');
    let images = fs.readdirSync(path_public_images);
    const boo = (is_day === 'yes');
    if(boo){
        images = images.filter(k=>k.includes('day'));
        switch(weather_descriptions[0]){
            case 'Partly cloudy':
                images = images.filter(item=>item.includes('partily-cloudy'));
                break;
            case 'Overcast':
                images = images.filter(item=>item.includes('cloudy')&&!item.includes('partily'));
                break;
            case 'Sunny':
                images = images.filter(item=>item.includes('clear-day'));
                break;
            case 'Heavy Rain, Mist':
                images = images.filter(item=>item.includes('storm'));
                break;
            case 'Patchy rain possible':
                images = images.filter(item=>item.includes('storm'));
                break;
            default:
                images = images.filter(item=>item.includes('storm'));
                break;

        }
    }else{
        images = images.filter(k=>k.includes('night'));
        switch(weather_descriptions[0]){
            case 'Partly cloudy':
                images = images.filter(item=>item.includes('cloudy-night'));
                break;
            case 'Overcast':
                images = images.filter(item=>item.includes('cloudy-night'));
                break;
            case 'Heavy Rain, Mist':
                images = images.filter(item=>item.includes('storm'));
                break;
            case 'Patchy rain possible':
                images = images.filter(item=>item.includes('storm'));
                break;
            default:
                images = images.filter(item=>item.includes('clear-night'));
                break;
        }
    }
    images = images.map(k=> 'images/'+k);
    return images;
}