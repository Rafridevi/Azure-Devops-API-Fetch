const Id = 602754
 
URL = `https://mrcooper.visualstudio.com/Data%20Services/_apis/wit/workitems/${Id}?$expand=all&api-version=6.0`
PAT_TOKEN = 'qlroa5iwdfxzijuroivqy24flu3lndnbboowslpmfpfuh7qwibna'
 
const btoa = require("btoa");
 
headers = {
    'Content-Type': 'application/json; charset=utf-8;',
    "Authorization": "Basic " + btoa('Basic' + ":" + PAT_TOKEN)
}
 
const fetch = require('node-fetch');
var express = require('express');
var app= express();
 
fetch(URL, {method:"GET", headers: headers}).then(res => res.json()).then(res=>{
    relations = res.relations;
    for (var key in relations){
        if (relations[key].rel ==="AttachedFile"){
            let url  = `${relations[key].url}?fileName=${relations[key].attributes.name}`;
            console.log(url);
            
            const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
 
const file = fs.createWriteStream(`${relations[key].attributes.name}`)
const request = http.get(`${relations[key].url}?fileName=${relations[key].attributes.name}`, function(response) {
  response.pipe(file);
});
 
        }
    }
}).catch(err => console.log(err));