(function executeScheduledJob() {
    // Define parameters
    var queueGroups = ['287ebd7da9fe198100f92cc8d1d2154e', 'Service Desk', 'Group3']; // Replace with your actual groups
    var thisMonthStart = gs.beginningOfThisMonth();

    // Fetch incidents for each group
    var incidentsByGroup = {};
    queueGroups.forEach(function(group) {
        var query = 'assignment_group=' + group + '^sys_created_on>=' + thisMonthStart;
        var incidentGR = new GlideRecord('incident');
        incidentGR.addEncodedQuery(query);
        incidentGR.query();

        var incidents = [];
        while (incidentGR.next()) {
            incidents.push({
                number: incidentGR.getValue('number'),
                short_description: incidentGR.getValue('short_description'),
                priority: incidentGR.getDisplayValue('priority'),
                sys_created_on: incidentGR.getDisplayValue('sys_created_on'),
                assignment_group: incidentGR.getDisplayValue('assignment_group')
            });
        }

        // Randomly select up to 10 incidents for this group
        incidents = shuffleArray(incidents).slice(0, 10);
        incidentsByGroup[group] = incidents;
    });

    // Create HTML table content for each group
    var htmlContent = '<h2>Monthly Random Incidents</h2>';
    queueGroups.forEach(function(group) {
        htmlContent += '<h3>Group: ' + group + '</h3>';
        htmlContent += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">';
        htmlContent += '<tr><th>Number</th><th>Short Description</th><th>Priority</th><th>Created On</th><th>Assignment Group</th></tr>';

        (incidentsByGroup[group] || []).forEach(function(incident) {
            htmlContent += '<tr>';
            htmlContent += '<td>' + incident.number + '</td>';
            htmlContent += '<td>' + incident.short_description + '</td>';
            htmlContent += '<td>' + incident.priority + '</td>';
            htmlContent += '<td>' + incident.sys_created_on + '</td>';
            htmlContent += '<td>' + incident.assignment_group + '</td>';
            htmlContent += '</tr>';
        });

        htmlContent += '</table>';
    });

    // Send email with the incident details in the body
    var email = new GlideEmailOutbound();
    email.setSubject('Monthly Random Incidents by Group');
    email.setBody(htmlContent);
    email.setContentType('text/html');
    email.addAddress('to', 'recipient@example.com'); // Replace with the target email address
    email.send();

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
})();