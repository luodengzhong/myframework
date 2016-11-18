function loadOrgTreeView() {
	// 空方法
}

function bindEventSelf() {
}
// 申请修改计划
function applyEdit() {
	var task = project.getSelected();
	applyEditByURl(web_app.name
			+ '/planAuditAction!showInsertAdjustTask.job?planTaskId='
			+ task.UID, task);
}

function backView() {
	backViewByURL(web_app.name + '/planTaskManagerAction!queryPlanTask.ajax');
}

// 加载数据
function load() {
	doQueryList();
}

// 执行查询
function doQueryList(keywords, flag) {
	var params = $("#queryMainForm").formToJSON();
	// var param = $(keywords).formToJSON();
	queryParams = $.extend(queryParams, params);
	var queryType = $('#queryType').getValue();
	if (queryType = 2) {
		var url = web_app.name
				+ '/planTaskManagerAction!getTaskByOperatorAndStatue.ajax';
		LoadJSONProject(project, url, queryParams);
	} else {
		var url = web_app.name
				+ '/planTaskManagerAction!getTaskByOperatorComputationTime.ajax';
		LoadJSONProject(project, url, queryParams);
	}
}

/** ********汇报任务进度********** */
function progressReporting() {
	progressReport(web_app.name + "/planTaskManagerAction!checkTaskReport.ajax")
}
