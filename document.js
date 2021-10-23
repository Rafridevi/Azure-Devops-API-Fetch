const allSprintsURL =
  "https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations?$expand=all&api-version=6.0";
const PAT_TOKEN = "";
//const name = "SRVC-ODS Changes";
const name = "SRVC_WH - Sprint 92";
const Id = 92;
//const Id =  "Changes";
const btoa = require("btoa");
const headers = {
  "Content-Type": "application/json; charset=utf-8;",
  Authorization: "Basic " + btoa("Basic" + ":" + PAT_TOKEN),
};
const fetch = require("node-fetch");
var express = require("express");
var convert = require('xml-js');
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
      urls.map((url) =>
        fetch(url, { method: "GET", headers: headers })
          .then((response) => response.json())
          .then((data) => {
            let relations = data.relations;
            for (var key in relations) {
              if (relations[key].rel === "AttachedFile") {
                let url = `${relations[key].url}?fileName=${relations[key].attributes.name}&download={download}&api-version=6.0`;
                const http = require("https"); // or 'https' for https:// URLs
                const fs = require("fs");
                 //console.log(url)
                const file = fs.createWriteStream(
                  `${relations[key].attributes.name}`)
                const request = http.get(
                  `${relations[key].url}?fileName=${relations[key].attributes.name}&download={download}&api-version=6.0`,
                  function (response) {
       return response.pipe(file);
                  
                  }
                );
              }
            }
          })
      )
    );

    return data;
  } catch (error) {
    console.log(error);

    throw error;
  }
}
getCurrentSprint(allSprintsURL, name)
  .then((Currentsprint) => getworkitemsURL(Currentsprint[0].url))
  .then((WorkitemUrl) => getallPbis(WorkitemUrl))
  .then((pbiurl) => getpbidetails(pbiurl))
  .then((data) => console.log("Done"));
