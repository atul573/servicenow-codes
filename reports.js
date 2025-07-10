(function() {
    var threeMonthsAgo = new GlideDateTime();
    threeMonthsAgo.addMonthsUTC(-3);

    // 1. Reports not run in the last 3 months
    var staleReports = new GlideRecord('sys_report');
    staleReports.addQuery('last_run', '<', threeMonthsAgo);
    staleReports.query();
    while (staleReports.next()) {
        gs.print("Report not run in 3 months: " + staleReports.name);
        // You can also notify/report_owner or flag the report here
    }

    // 2. Reports assigned to a non-existent user or group
    var reports = new GlideRecord('sys_report');
    reports.query();
    while (reports.next()) {
        var assignedUser = reports.getValue('owner');  // Assuming 'owner' holds user reference
        var user = new GlideRecord('sys_user');
        if (!user.get(assignedUser)) {
            gs.print("Report assigned to non-existent user: " + reports.name);
        }

        var assignedGroup = reports.getValue('group'); // Assuming group field exists
        if (assignedGroup) {
            var group = new GlideRecord('sys_user_group');
            if (!group.get(assignedGroup)) {
                gs.print("Report assigned to non-existent group: " + reports.name);
            }
        }
    }

    // 3. Reports shared with a group which has no users
    var reportShare = new GlideRecord('sys_report_group'); // Replace with actual table if different
    reportShare.query();
    while (reportShare.next()) {
        var groupId = reportShare.getValue('group');
        var groupUser = new GlideRecord('sys_user_grmember');
        groupUser.addQuery('group', groupId);
        groupUser.query();

        if (!groupUser.hasNext()) {
            gs.print("Report shared with group having no users: Report=" +
                reportShare.report.name + ", Group=" + groupId);
        }
    }
})();