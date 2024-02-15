(function executeRule(current, previous /*null when async*/) {

    var userRole = gs.getUser().getRoles();
    
    if(userRole.indexOf('initl_user') != -1){
        var incGr = new GlideRecord('incident');
        incGr.addQuery('state', '7'); // 7 is the value for 'Closed' state
        incGr.query();
        
        while(incGr.next()){
            incGr.setAbortAction(true);
        }
    }

})(current, previous);

// Code for Service Portal Widget
// This widget will show three HTML fields from an incident: 'overview', 'findings', and 'timeline'
// The fields will be editable and will update on click of a button

// Create a new widget in ServiceNow Service Portal
// Paste the following code in the HTML, Client Script and Server Script sections respectively

// HTML
<style>
.field-label {
    font-weight: bold; 
    font-size: 1.2em;
}
.field-input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
}
.update-button {
    margin-top: 10px; 
    background-color: #4CAF50; 
    color: white; 
    padding: 15px 32px; 
    text-align: center; 
    text-decoration: none; 
    display: inline-block; 
    font-size: 16px; 
    border: none; 
    border-radius: 4px;
}
</style>
<div>
    <label for="overviewField" class="field-label">Overview:</label>
    <textarea id="overviewField" ng-model="c.data.overviewField" class="field-input"></textarea>
    <label for="findingsField" class="field-label">Findings:</label>
    <textarea id="findingsField" ng-model="c.data.findingsField" class="field-input"></textarea>
    <label for="timelineField" class="field-label">Timeline:</label>
    <textarea id="timelineField" ng-model="c.data.timelineField" class="field-input"></textarea>
    <button ng-click="c.updateFields()" class="update-button">Update Fields</button>
</div>

// Client Script
function() {
    var c = this;
    c.updateFields = function() {
        c.server.update({
            newOverviewValue: c.data.overviewField,
            newFindingsValue: c.data.findingsField,
            newTimelineValue: c.data.timelineField
        }).then(function(response) {
            c.data.overviewField = response.data.overviewField;
            c.data.findingsField = response.data.findingsField;
            c.data.timelineField = response.data.timelineField;
            location.reload();
        });
    };
}

// Server Script
(function() {
    var gr = new GlideRecord('incident');
    gr.get('sys_id', input.sys_id);
    data.overviewField = gr.getValue('overview');
    data.findingsField = gr.getValue('findings');
    data.timelineField = gr.getValue('timeline');
    if(input) {
        gr.setValue('overview', input.newOverviewValue);
        gr.setValue('findings', input.newFindingsValue);
        gr.setValue('timeline', input.newTimelineField);
        gr.update();
    }
})();
// HTML
<div>
    <textarea ng-model="c.data.descriptionField"></textarea>
    <button ng-click="c.updateDescription()">Update Description</button>
</div>

// Client Script
function() {
    var c = this;
    c.updateDescription = function() {
        c.server.get({
            newDescriptionValue: c.data.descriptionField
        }).then(function(response) {
            c.data.descriptionField = response.data.descriptionField;
        });
    };
}

// Server Script
(function() {
    var gr = new GlideRecord('incident');
    gr.get('sys_id', input.sys_id);
    data.descriptionField = gr.getValue('description');
    if(input) {
        gr.setValue('description', input.newDescriptionValue);
        gr.update();
    }
})();


function($scope, $uibModalInstance) {
    var c = this;
    c.updateFields = function() {
        c.server.update({
            newOverviewValue: c.data.overviewField,
            newFindingsValue: c.data.findingsField,
            newTimelineValue: c.data.timelineField
        }).then(function(response) {
            c.data.overviewField = response.data.overviewField;
            c.data.findingsField = response.data.findingsField;
            c.data.timelineField = response.data.timelineField;
            $uibModalInstance.close(); // Close the widget
        });
    };
}



////test

function hasValue(jsonObj, keysToCheck) {
    for (const prop in jsonObj) {
      if (jsonObj.hasOwnProperty(prop)) {
        if (keysToCheck.includes(prop) && jsonObj[prop] !== undefined && jsonObj[prop] !== null) {
          console.log(`The key "${prop}" has a value: ${jsonObj[prop]}`);
        }
        if (typeof jsonObj[prop] === 'object') {
          hasValue(jsonObj[prop], keysToCheck);
        }
      }
    }
  }
  
  const nestedJSON = {
    "atul": {
      "address": "bhambla",
      "details": {
        "age": 25,
        "email": "atul@example.com"
      }
    }
  };
  
  const keysToCheck = ["address", "age", "email"];
  
  hasValue(nestedJSON, keysToCheck);


function getTransformMapsForDataSource(dataSourceName) {
    var transformMaps = [];
    
    // Query the sys_import_set_transform table to get transform maps
    var transformMap = new GlideRecord('sys_import_set_transform');
    transformMap.addQuery('source_table', dataSourceName);
    transformMap.query();
    
    while (transformMap.next()) {
        transformMaps.push(transformMap.name.toString());
    }
    
    return transformMaps;
}

// Example usage:
var dataSourceName = 'Your_Data_Source_Name';
var transformMaps = getTransformMapsForDataSource(dataSourceName);
gs.info('Transform Maps for Data Source (' + dataSourceName + '): ' + JSON.stringify(transformMaps));



//////


// Define the name of the transform map you want to run
var transformMapName = 'Your_Transform_Map_Name';

// Query all records from the import set table you want to transform
var importSetTable = 'x_your_import_set_table'; // Replace with the actual import set table name
var importSetRecords = new GlideRecord(importSetTable);
importSetRecords.query();

// Retrieve the transform map record
var transformMap = new GlideRecord('sys_import_set_transform');
transformMap.addQuery('name', transformMapName);
transformMap.query();

if (transformMap.next()) {
    // Loop through each record in the import set and transform it using the transform map
    while (importSetRecords.next()) {
        var importSetTransformer = new GlideImportSetTransformer();
        importSetTransformer.transformEntry(transformMap.sys_id, importSetRecords.sys_id);
        gs.info('Transformed record: ' + importSetRecords.sys_id);
    }
    gs.info('Transform Map (' + transformMapName + ') executed successfully.');
} else {
    gs.error('Transform Map (' + transformMapName + ') not found.');
}
