(function executeRule(current, previous /*null when async*/) {
    // Check if Case already exists
    if (!current.u_case_sys_id) { 
        // Create a Case
        var caseSysId = createCaseFromIncident(current);
        if (caseSysId) {
            current.u_case_sys_id = caseSysId; // Store Case sys_id in Incident
        }
    } else {
        // Update the existing Case
        updateCaseFromIncident(current);
    }
})();

/**
 * Function to create a Case from Incident
 * @param {GlideRecord} incident - Incident record
 * @returns {string} - Sys ID of the created Case
 */
function createCaseFromIncident(incident) {
    var caseGr = new GlideRecord('sn_customerservice_case'); // Case table
    caseGr.initialize();

    // Map fields from Incident to Case
    caseGr.short_description = incident.short_description;
    caseGr.description = incident.description;
    caseGr.u_probable_cause = incident.u_probable_cause; // Custom field
    caseGr.additional_comments = incident.comments.getJournalEntry(1);
    caseGr.work_notes = incident.work_notes.getJournalEntry(1);
    caseGr.priority = incident.priority;
    caseGr.assignment_group = incident.assignment_group;
    caseGr.assigned_to = incident.assigned_to;
    caseGr.case_state = mapIncidentStateToCaseState(incident.state);
    caseGr.contact_channel = "Incident"; // Example channel; customize if needed

    // Set Domain from System Property
    var domainSysId = gs.getProperty('cas_domain_sys_id');
    if (domainSysId) {
        caseGr.setValue('sys_domain', domainSysId);
    }

    return caseGr.insert(); // Return sys_id of created case
}

/**
 * Function to update a Case from Incident
 * @param {GlideRecord} incident - Incident record
 */
function updateCaseFromIncident(incident) {
    var caseGr = new GlideRecord('sn_customerservice_case'); // Case table
    if (caseGr.get(incident.u_case_sys_id)) {
        // Update mapped fields
        caseGr.short_description = incident.short_description;
        caseGr.description = incident.description;
        caseGr.u_probable_cause = incident.u_probable_cause;
        caseGr.additional_comments = incident.comments.getJournalEntry(1);
        caseGr.work_notes = incident.work_notes.getJournalEntry(1);
        caseGr.priority = incident.priority;
        caseGr.assignment_group = incident.assignment_group;
        caseGr.assigned_to = incident.assigned_to;
        caseGr.case_state = mapIncidentStateToCaseState(incident.state);

        caseGr.update(); // Save the changes
    }
}

/**
 * Function to map Incident State to Case State
 * @param {string} incidentState - Incident state
 * @returns {string} - Corresponding Case state
 */
function mapIncidentStateToCaseState(incidentState) {
    // Define mappings between Incident and Case states
    var stateMap = {
        '1': 'New',
        '2': 'In Progress',
        '3': 'Resolved',
        '4': 'Closed'
    };
    return stateMap[incidentState] || 'New'; // Default to 'New' if no match
}