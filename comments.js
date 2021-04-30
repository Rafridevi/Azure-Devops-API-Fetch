const allSprintsURL =
  "https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations?$expand=all&api-version=6.0";
const PAT_TOKEN = "fknwcd7cuq5wfkw4yoe5ds2zbf5o42lvgk4akmh33x3rkpmc7leq";
const name = "SRVC_WH - Sprint 81";
const Id = 81;
var ele;
const btoa = require("btoa");
const headers = {
  "Content-Type": "application/json; charset=utf-8;",
  Authorization: "Basic " + btoa("Basic" + ":" + PAT_TOKEN),
};
const fetch = require("node-fetch");
var express = require("express");
const { text } = require("express");
var app = express();
const individualPbiURL = `https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations/${Id}/workitems?api-version=6.0-preview.1`;

function getCurrentSprint(URL, name) {
  return fetch(URL, { method: "GET", headers: headers })
    .then((res) => res.json())
    .then((allSprints) => {
      return allSprints.value.filter((sprint) => sprint.name == name);
    });
}

function getCurrentSprintPBIs(id) {
  const currentSprintURL = `https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations/${id}/workitems?api-version=6.0-preview.1`;
  return fetch(currentSprintURL, { method: "GET", headers: headers })
    .then((res) => res.json())
    .then((allPBIArr) => {
      var pbiIds = allPBIArr.workItemRelations.map((item) => item.target.id);
      return pbiIds;
    });
}

function getAttachmentURL(attachmentsArray) {
  const attachmentIdArr = attachmentsArray.map((item) => item.url.slice(-36));
  return attachmentIdArr.map(   (id) =>  `https://dev.azure.com/mrcooper/Data%20Services/_apis/wit/attachments/${id}?api-version=6.0`);
}

async function getAllUrls(ids) {
  try {
    var data = await Promise.all(
      ids.map((id) => fetch(`https://mrcooper.visualstudio.com/Data%20Services/_apis/wit/workitems/${id}?$expand=all&api-version=6.0`,{ method: "GET", headers: headers })
          .then((response) => response.json()) 
          .then((pbiDetails) => {
            return {
              Pbi_No: pbiDetails.fields["System.Id"],
              WorkItem_name: pbiDetails.fields["System.Title"],
              AssignedTo: pbiDetails.fields["System.AssignedTo"].displayName,
              Status: pbiDetails.fields["System.State"],
              AttachmentURL: getAttachmentURL(pbiDetails.relations) ,
              Comments: getcomments()
              
           }; })

           )
           
    );
    return data;
    } catch (error) {}
async function getcomments(ids){
    var comment = await Promise.all(
      ids.map((id) => fetch(`https://mrcooper.visualstudio.com/Data%20Services/_apis/wit/workitems/${id}/comments?api-version=6.0-preview.3`,{ method: "GET", headers: headers })
          .then((response) =>response.json()) 
          .then((res)=> {comm=res.comments;
              
            const txt=comm.map((item)=>item.text)
            const { htmlToText } = require('html-to-text');
            var text = htmlToText(txt);
             return (text);})
          ));
         return comment;
          }
}

getCurrentSprint(allSprintsURL, name)
  .then((currentSprint) => getCurrentSprintPBIs(currentSprint[0].id))
  .then((PBiids) => getAllUrls(PBiids))
.then((data) =>{ var fs = require("fs");

file = fs.writeFile("output.json", JSON.stringify(data, null, 3), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  var download = require("download-file");
  var url = "file";
  const files = download(url, function (err) {
    console.log("File Created");
  });
});
});  
   
