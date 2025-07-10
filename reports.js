(function() {
  var threeMonthsAgo = new GlideDateTime();
  threeMonthsAgo.addMonthsUTC(-3);

  // 1. Reports not run in last 3 months
  var statsGR = new GlideRecord('report_stats');
  statsGR.addQuery('sys_updated_on', '<', threeMonthsAgo);
  statsGR.query();
  var staleReportIds = [];
  while (statsGR.next()) {
    staleReportIds.push(statsGR.report.toString());
  }

  // Query report names
  if (staleReportIds.length) {
    var rpt = new GlideRecord('sys_report');
    rpt.addQuery('sys_id', 'IN', staleReportIds.join(','));
    rpt.query();
    while (rpt.next()) {
      gs.print('⚠️ Stale report (not run in 3 months): ' + rpt.name);
    }
  }

  // 2. Reports assigned to nonexistent user or group
  rpt = new GlideRecord('sys_report');
  rpt.query();
  while (rpt.next()) {
    var ownerId = rpt.getValue('owner');
    if (ownerId) {
      var usr = new GlideRecord('sys_user');
      if (!usr.get(ownerId)) {
        gs.print('❌ Report "' + rpt.name + '" assigned to missing user: ' + ownerId);
      }
    }
    var grpId = rpt.getValue('group');
    if (grpId) {
      var grp = new GlideRecord('sys_user_group');
      if (!grp.get(grpId)) {
        gs.print('❌ Report "' + rpt.name + '" assigned to missing group: ' + grpId);
      }
    }
  }

  // 3. Reports shared with a group that has no users
  var share = new GlideRecord('sys_report_group'); // adjust if table name differs
  share.query();
  while (share.next()) {
    var gId = share.getValue('group');
    var mem = new GlideRecord('sys_user_grmember');
    mem.addQuery('group', gId);
    mem.query();
    if (!mem.hasNext()) {
      var reportName = share.report.name + ' (' + share.report.sys_id + ')';
      gs.print('⚠️ Shared report with empty group: ' + reportName + ', group: ' + gId);
    }
  }
})();