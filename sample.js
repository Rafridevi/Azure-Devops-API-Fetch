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
      var pbis = allPBIArr.workItemRelations.map((item) => item.target.id);
      return pbis.map(
        (id) =>
          `https://mrcooper.visualstudio.com/Data%20Services/_apis/wit/workitems/${id}?$expand=all&api-version=6.0`
      );
    });
}

function getAttachmentURL(attachmentsArray) {
  const attachmentIdArr = attachmentsArray.map((item) => item.url.slice(-36));
  return attachmentIdArr.map(
    (id) =>
      `https://dev.azure.com/mrcooper/Data%20Services/_apis/wit/attachments/${id}?api-version=6.0`
  );
}

async function getAllUrls(urls) {
  try {
    var data = await Promise.all(
      urls.map((url) =>
        fetch(url, { method: "GET", headers: headers })
          .then((response) => response.json())
          .then((pbiDetails) => {
            return {
              Pbi_No: pbiDetails.fields["System.Id"],
              WorkItem_name: pbiDetails.fields["System.Title"],
              AssignedTo: pbiDetails.fields["System.AssignedTo"].displayName,
              Status: pbiDetails.fields["System.State"],
              AttachmentURL: getAttachmentURL(pbiDetails.relations),
            };
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
  .then((currentSprint) => getCurrentSprintPBIs(currentSprint[0].id))
  .then((res) => getAllUrls(res))
  .then((resp) => {
    var fs = require("fs");

    file = fs.writeFile("Name.json", JSON.stringify(resp, null, 3), (err) => {
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
