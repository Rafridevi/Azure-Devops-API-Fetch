const allSprintsURL =
  "https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations?$expand=all&api-version=6.0";
const PAT_TOKEN = "";
//const name = "SRVC-ODS Changes";
const name = 'SRVC_WH - Sprint 92';
const Id =  92;
//const Id =  "Changes";
const btoa = require("btoa");
const headers = {
 "Content-Type": "application/json; charset=utf-8;",
  Authorization: "Basic " + btoa("Basic" + ":" + PAT_TOKEN),
 
};



const fetch = require("node-fetch");
var express = require("express");
const Blob = require("blob");
var app = express();
const { htmlToText } = require("html-to-text");
const { Console } = require("console");
const individualPbiURL = `https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations/${Id}/workitems?api-version=6.0-preview.1`;

function getCurrentSprint(URL, Name) {
    return fetch(URL, { method: "GET", headers: headers })
      .then((res) => res.json())
      .then((allSprints) => {
        //return allSprints
        return allSprints.value.filter((sprint) => sprint.name == Name);
      });
  }
  async function getworkitemsURL(url) {
    return fetch(url, { method: "GET", headers: headers })
      .then((res) => res.json())
      .then((data) => {
        return data._links.workitems.href;
      });
  }
  async function getallPbis(url) {
    return fetch(url, { method: "GET", headers: headers })
      .then((res) => res.json())
      .then((data) => {
        let link = "?$expand=all&api-version=6.0";
        let url = data.workItemRelations.map((item) => item.target.url + link);
        return url;
      });
  }
 
  async function getpbidetails(urls) {
    try {
        var data = await Promise.all(
            urls.map(
                url =>
                    fetch(url,{ method: "GET", headers: headers }).then(
                        (response) => response.json() )
                        .then ((data)=>{
                         let relations = data.relations;
                         return relations  })
));

        return (data)

    } catch (error) {
        console.log(error)

        throw (error)
    }
}

async function getAttachmentId(url){
let rel=url.filter(x=>x!==undefined)
let data=[].concat.apply([], rel);
let link=data.filter(x=>x.rel=="AttachedFile")
let res=link.map(a => a.url.slice(-36))
let resp=link.map(a=>a.attributes.name)

return {FileName:resp,  ID:res}

  }

async function getAttachmentURL(data){
 let NAMES  = data.FileName
 let IDS=data.ID
 
const URL= IDS.map((id)=>`https://dev.azure.com/mrcooper/Data%20Services/_apis/wit/attachments/${id}&download=true&api-version=6.0`)
//const Name=ID.map(()=>`${id}&download=true&api-version=6.0`)

//const file= `https://dev.azure.com/mrcooper/Data%20Services/_apis/wit/attachments/${IDS}?fileName=${NAMES}&download=true&api-version=6.0`
return URL;   
}





getCurrentSprint(allSprintsURL, name)
.then((Currentsprint) => getworkitemsURL(Currentsprint[0].url))
.then((WorkitemUrl) => getallPbis(WorkitemUrl))
.then((pbiurl) => getpbidetails(pbiurl))
.then ((relations)=>getAttachmentId(relations))
.then((data)=>getAttachmentURL(data))
.then((datas)=> {const http = require("https"); 
const fs = require("fs");

const file = fs.createWriteStream(  'a.sql')
const request = http.get(`https://dev.azure.com/mrcooper/Data%20Services/_apis/wit/attachments/a42569c1-2bb2-486d-8c52-94453163e338?api-version=6.0`,
function (response) {
return response.pipe(file);
  })})

        
