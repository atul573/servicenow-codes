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
<div>
    <label for="overviewField" style="font-weight:bold; font-size:1.2em;">Overview:</label>
    <textarea id="overviewField" ng-model="c.data.overviewField"></textarea>
    <label for="findingsField" style="font-weight:bold; font-size:1.2em;">Findings:</label>
    <textarea id="findingsField" ng-model="c.data.findingsField"></textarea>
    <label for="timelineField" style="font-weight:bold; font-size:1.2em;">Timeline:</label>
    <textarea id="timelineField" ng-model="c.data.timelineField"></textarea>
    <button ng-click="c.updateFields()" style="margin-top: 10px; background-color: #4CAF50; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border: none; border-radius: 4px;">Update Fields</button>
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
