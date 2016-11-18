var owningObjectIdorg;setTimeout(function(){alert(2);},100);
function loadOrgTreeView() {
	$('#orgTree').commonTree(
			{
				loadTreesAction : operateCfg.queryOrgAction,
				manageType : 'taskBaseManage',
				parentId : 'orgRoot',
				isLeaf : function(data) {
					data.children = [];
					data.nodeIcon = OpmUtil.getOrgImgUrl(data.orgKindId,
							data.status, false);
					return parseInt(data.hasChildren) == 0;
				},
				getParam : function(record) {
					if (record) {
						return {
							showDisabledOrg : 0,
							displayableOrgKinds : "ogn,dpt"
						};
					}
					return {
						showDisabledOrg : 0
					};
				},
				onClick : function(data) {
					if (data && owningObjectIdorg != data.id) {
						materialTreeClickHandler(data);
					}
				},
				IsShowMenu : false
			});
	
	$('#specialList').commonTree(
			{
				loadTreesAction : web_app.name + '/planSetAction!queryPlanKindAssion.ajax',
				onClick : function(data) {
					if (data && owningObjectIdorg != data.id) {
						taskKindAssionClickHandler(data);
					}
				},
				IsShowMenu : false
			});
}

// 点击树节点时加载表格
function materialTreeClickHandler(data) {
	/*
	 * $('.l-layout-center .l-layout-header').html("<font
	 * style=\"color:Tomato;font-size:13px;\">[" + name+ "]</font>计划类型");
	 */
	var owningObjectId;
	var fullId = getAdministrativeOrgFullId(data);
	if (fullId) {
		owningObjectId = data.id;
		owningObjectIdorg = data.id;
	} else {
		return;
	}
	var params = $("#queryMainForm").formToJSON();
	params['queryKind'] = 99;
	params['dutyDeptId'] = data.id;
	params.owningObjectId = data.id;
//	$('#queryKind').val(99);
//	$('#owningObjectId').val(owningObjectId);
	/* params.queryKindId = 3; */
	var url = web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax';
	LoadJSONProject(project, url, params);
}


//点击树节点时加载表格
function taskKindAssionClickHandler(data) {
	/*
	 * $('.l-layout-center .l-layout-header').html("<font
	 * style=\"color:Tomato;font-size:13px;\">[" + name+ "]</font>计划类型");
	 */
	var params = $("#queryMainForm").formToJSON();
	params['queryKind'] = 99;
	params['taskKindId'] = data.id;
	var url = web_app.name + '/planTaskManagerPlanAction!queryPlanTask.ajax';
	LoadJSONProject(project, url, params);
}

function bindEventSelf() {

	// 初始隐藏div 更改title的图标，以及响应时间
	// $("#myselfTaskSearch").hide();
	$('#myselfTaskTitle a').addClass('togglebtn-down');
	$('#IndividualTaskTitle a').click(function() {
		$("#myselfTaskSearch").hide();
		$('#myselfTaskTitle a').addClass('togglebtn-down');

		$("#myManagerTaskSearch").hide();
		$('#myManagerTaskTitle a').addClass('togglebtn-down');

		$("#mySpecialTaskSearch").hide();
		$('#mySpecialTaskTitle a').addClass('togglebtn-down');
	});
	// 初始隐藏div 更改title的图标，以及响应时间
	$("#IndividualTaskSearch").hide();
	$('#IndividualTaskTitle a').addClass('togglebtn-down');
	$('#myselfTaskTitle a').click(function() {
		$("#IndividualTaskSearch").hide();
		$('#IndividualTaskTitle a').addClass('togglebtn-down');

		$("#myManagerTaskSearch").hide();
		$('#myManagerTaskTitle a').addClass('togglebtn-down');

		$("#mySpecialTaskSearch").hide();
		$('#mySpecialTaskTitle a').addClass('togglebtn-down');
	});
	$("#myManagerTaskSearch").hide();
	$('#myManagerTaskTitle a').addClass('togglebtn-down');
	$('#myManagerTaskTitle a').click(function() {
		$("#IndividualTaskSearch").hide();
		$('#IndividualTaskTitle a').addClass('togglebtn-down');

		$("#myselfTaskSearch").hide();
		$('#myselfTaskSearch a').addClass('togglebtn-down');
		
		$("#mySpecialTaskSearch").hide();
		$('#mySpecialTaskTitle a').addClass('togglebtn-down');
	});
	$("#mySpecialTaskSearch").hide();
	$('#mySpecialTaskTitle a').addClass('togglebtn-down');
	$('#mySpecialTaskTitle a').click(function() {
		$("#IndividualTaskSearch").hide();
		$('#IndividualTaskTitle a').addClass('togglebtn-down');

		$("#myselfTaskSearch").hide();
		$('#myselfTaskSearch a').addClass('togglebtn-down');

		$("#myManagerTaskSearch").hide();
		$('#myManagerTaskTitle a').addClass('togglebtn-down');
	});
	
	
	
	// 我的任务事件绑定
	$('#myselfTaskSearch')
			.bind(
					'click',
					function(e) {
						var $clicked = $(e.target || e.srcElement);
						$('div.taskCenterChoose').removeClass(
								'taskCenterChoose');
						if ($clicked.hasClass('taskCenterSearch')) {
							var schemeId = $clicked.attr('id');
							var queryKind = $clicked.attr('queryKind');
							if (schemeId && Public.isBlank(queryKind)) {// 自己定义的快捷查询
								var param = shortcutInfoSearchData[schemeId];
								if (param) {
									clearQueryInput();
									var tempParams = {};// 这里需要对中文编码
									$.each(param, function(p, o) {
										tempParams[p] = encodeURI(o);
									});
									var url = web_app.name
											+ '/planTaskManagerAction!queryPlanTask.ajax';
									LoadJSONProject(project, url, tempParams);
								}
							} else {// 系统级查询
								$clicked.addClass('taskCenterChoose');
								queryParams['queryKind'] = queryKind;
								queryParams['managerType'] = '';
								doQueryList();
							}
						} else if ($clicked.hasClass('ui-icon-trash')) {// 删除
							deleteQueryScheme($clicked.parent().attr('id'),
									$clicked.parent().text());
						} else if ($clicked.hasClass('ui-icon-edit')) {// 编辑
							var schemeId = $clicked.parent().attr('id');
							var param = shortcutInfoSearchData[schemeId];
							$('#queryMainForm').formSet(param);
							if ($('#divConditionArea').is(':hidden')) {
								$('#titleConditionArea').find('a.togglebtn')
										.trigger('click');
							}
							$('div.updateTaskQueryScheme').removeClass(
									'updateTaskQueryScheme');
							$("#customDataRange")[(param.dateRange == 10) ? 'show'
									: 'hide']();
							$clicked.parent().addClass('updateTaskQueryScheme');
						}
					});

	// 我的任务事件绑定
	$('#IndividualTaskSearch')
			.bind(
					'click',
					function(e) {
						var $clicked = $(e.target || e.srcElement);
						$('div.taskCenterChoose').removeClass(
								'taskCenterChoose');
						if ($clicked.hasClass('taskCenterSearch')) {
							var schemeId = $clicked.attr('id');
							var queryKind = $clicked.attr('queryKind');
							if (schemeId && Public.isBlank(queryKind)) {// 自己定义的快捷查询
								var param = shortcutInfoSearchData[schemeId];
								if (param) {
									clearQueryInput();
									var tempParams = {};// 这里需要对中文编码
									$.each(param, function(p, o) {
										tempParams[p] = encodeURI(o);
									});
									queryParams['managerType'] = '0';
									var url = web_app.name
											+ '/planTaskManagerAction!queryPlanTask.ajax';
									LoadJSONProject(project, url, tempParams);
								}
							} else {// 系统级查询
								$clicked.addClass('taskCenterChoose');
								queryParams['queryKind'] = queryKind;
								queryParams['managerType'] = '0';
								doQueryList();
							}
						} else if ($clicked.hasClass('ui-icon-trash')) {// 删除
							deleteQueryScheme($clicked.parent().attr('id'),
									$clicked.parent().text());
						} else if ($clicked.hasClass('ui-icon-edit')) {// 编辑
							var schemeId = $clicked.parent().attr('id');
							var param = shortcutInfoSearchData[schemeId];
							$('#queryMainForm').formSet(param);
							if ($('#divConditionArea').is(':hidden')) {
								$('#titleConditionArea').find('a.togglebtn')
										.trigger('click');
							}
							$('div.updateTaskQueryScheme').removeClass(
									'updateTaskQueryScheme');
							$("#customDataRange")[(param.dateRange == 10) ? 'show'
									: 'hide']();
							$clicked.parent().addClass('updateTaskQueryScheme');
						}
					});
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
	reloadGrid(web_app.name + '/planTaskManagerAction!queryPlanTask.ajax');
	/* loadByURL(web_app.name+'/planTaskManagerAction!queryPlanTask.ajax'); */
}

// 导出excel
function exportExcel() {
	var url = web_app.name + '/planTaskManagerAction!queryPlanTask.ajax';
	exportExcelByURL(url);
}

function doAddFun(parentTaskUID) {
	parentTaskUID = parentTaskUID ? parentTaskUID : '';
	var url = web_app.name
			+ '/planAuditAction!showInsertPlanAudit.job?relevanceTaskId='
			+ parentTaskUID;
	parent.addTabItem({
		tabid : 'addPlanTask',
		text : '新增任务计划',
		url : url
	});
}

// 执行查询
function doQueryList(keywords, flag) {
	if (typeof keywords == 'string') {
		queryParams['keywords'] = encodeURI(keywords);
	}
	var taskStatus = $('#taskStatus0').getValue();
	if ($('#queryDateRangeDiv').is(':visible')) {
		var dateRange = $('#queryDateRange6').getValue();
		queryParams['dateRange'] = dateRange;
	} else {
		queryParams['dateRange'] = '';
	}
	queryParams['taskStatus'] = taskStatus;
	if (flag) {// 是页面点击按钮
		dateRange = $('#selectDateRange').val();
		if (dateRange == 10 && (!getStartDate(true) || !getEndDate(true))) {
			Public.tip("请选择开始日期和结束日期！");
			return;
		}
		var endDateRange = $('#endDateRange').val();
		if (endDateRange == 10 && (!getStartDate(false) || !getEndDate(false))) {
			Public.tip("请选择开始日期和结束日期！");
			return;
		}
		clearQueryInput();
	}

	var params = $("#queryMainForm").formToJSON();
	// var param = $(keywords).formToJSON();
	queryParams = $.extend(queryParams, params);
	if (!queryParams['queryKind']) {
		queryParams['queryKind'] = '2';
	}
	var url = web_app.name + '/planTaskManagerAction!queryPlanTask.ajax';
	LoadJSONProject(project, url, queryParams);
}

/** ********汇报任务进度********** */
function progressReporting() {
	progressReport(web_app.name + "/planTaskManagerAction!checkTaskReport.ajax")
}
