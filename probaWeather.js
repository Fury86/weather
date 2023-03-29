'use strict';

const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const ejs = require('ejs');

//This code sets the view engine to EJS using app.set('view engine', 'ejs').
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
    res.write('<head>');
    res.write('<link rel="stylesheet" type="text/css" href="/styles/style.css">');
    res.write('</head>')
    //Create a route for your HTML page that renders the EJS template:
    // const name = 'John';
    // res.render('index', {
    //     name
    // });


    const url = axios.get("https://api.ipify.org/?format=json")

    url.then((response) => {
            const ip = response.data.ip;
            console.log(ip);
            res.write('<body>')
            res.write(`<h1 style="color: blue;">\nYour IP address is: ${ip}</h1>`);



            const url = axios.get(`https://tools.keycdn.com/geo?host=${ip}`);



            url

                .then((response) => {
                    const data = response.data;
                    const $ = cheerio.load(data);

                    const city = $("dl > dd").html();
                    const region = $("dl > dd").eq(1).html();
                    const postalCode = $("dl > dd").eq(2).html();
                    const country = $("dl > dd").eq(3).html();
                    const continent = $("dl > dd").eq(4).html();

                    res.write(`<h1 class='header'>\nCity: ${city}</h1>`);
                    res.write(`<h1>\nRegion: ${region}</h1>`);
                    res.write(`<h1>\nPostal code: ${postalCode}</h1>`);
                    res.write(`<h1>\nCountry: ${country}</h1>`);
                    res.write(`<h1>\nContinent: ${continent}</h1>`);
                    res.write('</body>');
                    res.send();

                })
                .catch((err) => {
                    console.error(err);
                })

        })
        .catch(err => {
            console.error(err);
        })

})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})