const http = require("http");
const fs = require("fs");
var requests = require("requests");
const { on } = require("process");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,orgVal) =>{
    let temprature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temprature = temprature.replace("{%tempmin%}",orgVal.main.temp_min);
    temprature = temprature.replace("{%tempmax%}",orgVal.main.temp_max);
    temprature = temprature.replace("{%location%}",orgVal.name);
    temprature = temprature.replace("{%country%}",orgVal.sys.country);
    temprature = temprature.replace("<%tempstatus%>",orgVal.weather[0].main);
    return temprature;
} 
const server = http.createServer((req,res) => {
    if (req.url =="/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Ghaziabad&appid=771eb712ce86cce5eb76b4b761667c26")
        .on("data",(chunk) => {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            // console.log(arrdata[0].main.temp);

            const realTimeData = arrdata
            .map((val) => replaceVal(homeFile,val))
            .join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on('end', (err) => {
            if(err) return console.log('connection closed due to errors',err);
            res.end();
        });
    }
});

server.listen(3000, "localhost");
