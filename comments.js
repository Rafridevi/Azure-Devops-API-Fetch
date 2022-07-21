URL1='https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations?$expand=all&api-version=6.0'
PAT_TOKEN = 'oibxgbb4exgkrien52v76b565xecetwl34nmmllxg4g55x6tazwa'
 var name='SRVC_WH - Sprint 81';
 var Id;
 var ele;
const btoa = require("btoa");
 
headers = {
    'Content-Type': 'application/json; charset=utf-8;',
    "Authorization": "Basic " + btoa('Basic' + ":" + PAT_TOKEN)
}
const fetch = require('node-fetch');
var express = require('express');
var app= express();
fetch(URL1, {method:"GET", headers: headers}).then(res => res.json()).then(res=>{
    Name = res.value;
    for( var key in Name)
    {
        if(Name[key].name==name)
        {
             Id=Name[key].id;
           console.log(Name[key].name);
           URL2=`https://dev.azure.com/mrcooper/Data%20Services/Data%20Governance/_apis/work/teamsettings/iterations/${Id}/workitems?api-version=6.0-preview.1`
 
           fetch(URL2, {method:"GET", headers: headers}).then(res => res.json()).then(res=>{
           
           work=res.workItemRelations;
           var idArray=work.map((item)=>item.target.id)
           for (let elements of idArray) { 
            var ele=elements; 
            URL4=`https://mrcooper.visualstudio.com/Data%20Services/_apis/wit/workitems/${ele}/comments?api-version=6.0-preview.3`
            fetch(URL4, {method:"GET", headers: headers}).then(res => res.json()).then(res=>{
                comm=res.comments;
                const txt=comm.map((item)=>item.text)
                const { htmlToText } = require('html-to-text');
                 text = htmlToText(txt);
                 URL3=`https://mrcooper.visualstudio.com/Data%20Services/_apis/wit/workitems/${ele}?$expand=all&api-version=6.0`
                 fetch(URL3, {method:"GET", headers: headers}).then(res => res.json()).then(res=>{
                     //relations = res.relations
                   
                     field=res.fields['System.AssignedTo']
                     relations = res.relations;
                     
                     for (var key in relations){
                         if (relations[key].rel ==="AttachedFile"){
                             let url  = `${relations[key].url}?fileName=${relations[key].attributes.name}`;
                             console.log(url);
       
                             response=[res.id,res.fields['System.Title'],field['displayName'],res.fields['System.State'],url];
                             //console.log(response,text);
                             
                         
                       
                     
            
            
                    }
                }
            });
        });
          
          
         
              
       
    
        
  
        
    }
         
 }).catch(err => console.log(err));
 

        }
    }
        
}).catch(err => console.log(err));
 