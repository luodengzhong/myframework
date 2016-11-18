var projectId = 0, projectCategoryID, projectName, nodePhaseName, projectTypeName, status, operateCfg = {};
var categoryID = 0, phaseID = 0, viewProjectKind = "category", fullId = "";
$(function() {
	initializeOperateCfg();
	bindEvents();
	loadProjectChildren();
	buildPath();

	/**
	 * 初始化参数配置
	 */
	function initializeOperateCfg() {
		operateCfg.queryProjectClassificationAction = web_app.name
				+ "/projectClassificationAction!queryAllProjectClassification.ajax";
		operateCfg.queryAllProjectForArchive = web_app.name
				+ "/projectConfigAction!queryAllProjectForArchive.ajax";
		operateCfg.queryAllProjectNodePhase = web_app.name
				+ "/projectNodeAction!queryAllProjectNode.ajax";
		operateCfg.queryAllDocumentForArchive = web_app.name
				+ "/projectPreviewAction!queryAllDocumentForArchive.ajax";
	}

	function bindEvents() {
		// 设置html的样式
		$("html").attr("class", "layout-2");
		// 选项卡
		$("#tab_project").click(function() {
			$("#tab_archive").removeClass("no-bl").removeClass("selected");
			$("#tab_project").addClass("no-bl").addClass("selected");
			$("#projectbox").show();
			$("#archivebox").hide();
		});
		$("#tab_archive").click(function() {
			$("#tab_project").removeClass("no-bl").removeClass("selected");
			$("#tab_archive").addClass("no-bl").addClass("selected");
			$("#projectbox").hide();
			$("#archivebox").show();
		});
		// 项目回退
		$("#projectback").click(function() {
			if (!categoryID)
				return;
			categoryID = 0;
			buildPath();
			loadProjectChildren();
		});
		// 切换到项目分类模式
		$("#switchView-category").click(function() {
			viewProjectKind = "category";
			$("#switchView-category").addClass("list-selected");
			$("#switchView-headquarter").removeClass("icon-selected");
			categoryID = 0;
			loadProjectChildren();
		});
		// 切换到指挥部模式
		$("#switchView-headquarter").bind("click", function() {
			/*
			 * viewProjectKind = "headquarter";
			 * $("#switchView-category").removeClass("list-selected");
			 * $("#switchView-headquarter").addClass("icon-selected");
			 * categoryID = 0; loadProjectChildren();
			 */
		});

		// 项目列表路径
		$("#project-path a").live("click", function() {
			categoryID = $(this).attr("data-file-id");
			loadProjectChildren();
		});
		// 档案回退
		$("#archiveback").live("click", function() {
			if (!phaseID)
				return;
			phaseID = 0;
			archivesPath();
			loadArchiveChildren();
		});
		// 档案链接
		$("#archivebox .tbl td.name a").live("click", function() {
			phaseID = $(this).parents("tr").attr("id");
			var dataCategroy = $(this).attr("data-ca");
			if (dataCategroy == "listView-see-phase")
				loadArchiveChildren();
		});
		// 档案路径
		$("#archive-path a").live("click", function() {
			phaseID = $(this).attr("data-file-id");
			loadArchiveChildren();
		});
		// 查询焦点事件
		$(".txt").live("focus", function() {
			$(".placeholder").addClass("noDis");
		}).live("blur", function() {
			if (!$(this).val())
				$(".placeholder").removeClass("noDis");
		});
		// 查询项目
		$("#projectbox #project-search-bar .search-submit").live("click",
				function() {
					categoryID = 1;
					searchProject();
				});
		// 查询档案
		$("#archivebox #archive-search-bar .search-submit").live("click",
				function() {
					phaseID = 1;
					searchArchive();
				});
	}

	function getSearchProjectCondition() {
		return $("#projectbox #project-search-bar .txt").val();
	}

	function searchProject() {
		var projectName = $('#projectNameText').val();
		if (viewProjectKind == "category") {
			Public.ajax(operateCfg.queryAllProjectForArchive, {
				name : projectName
			}, function(data) {
				var projects = data.Rows;
				refreshProjectGrid(projects);
				$("#project-path").html("查询[" + projectName + "]的结果");
			});
		} else {
			/*
			 * new LG.AJAXFunction({ url:
			 * '../../service/BaseInfo/ProjectInfoWebService.asmx/SearchProjectInfoList',
			 * param: { status: -1, projectCategoryID: 0, buildNature: 0,
			 * areaID: 0, headquartersID: categoryID, shortCode: '', code: '',
			 * name: getSearchProjectCondition(), pageIndex: 1, pageSize: 2000 },
			 * loading: '加载数据中...', async: false, success: function (data) { var
			 * projects = data.d.Data; if (!projects || projects.length == 0)
			 * return; refreshProjectGrid(projects); } });
			 */
		}
	}

	function getSearchArchiveCondition() {
		return $("#archivebox #archive-search-bar .txt").val();
	}

	function searchArchive() {
		var fileName = $('#fileNameText').val();
		Public.ajax(operateCfg.queryAllDocumentForArchive, {
			fileName : fileName,
			projectId : projectId
		}, function(data) {
			var archives = data.Rows;
			refreshAchiveGrid(archives);
		});
	}
});

function loadProjectChildren(fullId) {
	$("#projectbox .tbl tbody").html("");
	Public.ajax(operateCfg.queryAllProjectForArchive, {
		fullId : fullId,
		phaseStatus : '1,2,3,4'
	}, function(data) {
		var projects = data.Rows;
		if (!projects || projects.length == 0)
			return;
		refreshProjectGrid(projects);
	});

	return;
	// 加载项目分类
	if (categoryID == 0) {
		if (viewProjectKind == "category") {
			Public
					.ajax(
							operateCfg.queryProjectClassificationAction,
							null,
							function(data) {
								var rows = data.Rows, items = [];

								if (!rows || rows.length == 0)
									return;
								for (var i = 0; i < rows.length; i++) {
									items.push('<tr data-type="category" id='
											+ rows[i].projectClassificationId
											+ '>');
									items
											.push('<td>  <span class="checkbox"></span> </td>');
									items
											.push('<td class="name folder-icon"> <i class="i ifl i21"> </i> <a data-ca="listView-see-project" href="javascript:void(0)" onclick="showProjectList(\''
													+ rows[i].projectClassificationId
													+ '\',\''
													+ rows[i].name
													+ '\')"  class="name" title="'
													+ rows[i].name
													+ '">'
													+ rows[i].name
													+ '</a></td>');
									items.push('<td>项目类别</td>');
									items.push("</tr>");
								}
								$("#projectbox .tbl tbody")
										.html(items.join(""));
							});
		} else {
			/*
			 * new LG.AJAXFunction({ url:
			 * '../../service/Common/CommonWebservice.asmx/GetEnumMemberListByCode',
			 * param: { parentMemberId: 0, code: "Headquarters", oper: '',
			 * ipAddress: '' }, async: false, success: function (data) { var
			 * headquartersList = data.d.Data, items = []; if (!headquartersList ||
			 * headquartersList.length == 0) return; for (var i = 0; i <
			 * headquartersList.length; i++) { items.push('<tr data-type="category" id=' + headquartersList[i].MemberID + '>');
			 * items.push('<td> <span class="checkbox"></span> </td>');
			 * items.push('<td class="name folder-icon"> <i class="i ifl i21">
			 * </i> <a data-ca="listView-see-project" href="javascript:void(0)"
			 * class="name" title="' + headquartersList[i].Name + '">' +
			 * headquartersList[i].Name + '</a></td>'); items.push('<td>指挥部</td>');
			 * items.push("</tr>"); } $("#projectbox .tbl
			 * tbody").html(items.join("")); } });
			 */
		}
	} else {// 加载项目
		if (viewProjectKind == "category") {
			Public.ajax(operateCfg.queryAllProjectForArchive, {
				fullId : fullId
			}, function(data) {
				var projects = data.Rows;
				if (!projects || projects.length == 0)
					return;
				refreshProjectGrid(projects);
			});
		} else {
			/*
			 * new LG.AJAXFunction({ url:
			 * '../../service/BaseInfo/ProjectInfoWebService.asmx/SearchProjectInfoList',
			 * param: { status: -1, projectCategoryID: 0, buildNature: 0,
			 * areaID: 0, headquartersID: categoryID, shortCode: '', code: '',
			 * name: '', pageIndex: 1, pageSize: 2000 }, loading: '加载数据中...',
			 * async: false, success: function (data) { var projects =
			 * data.d.Data; if (!projects || projects.length == 0) return;
			 * refreshProjectGrid(projects); } });
			 */
		}
	}
}

function loadArchiveChildren() {
	// 加载项目阶段分类
	$("#archivebox .tbl tbody").html("");
	if (phaseID == 0) {
		Public
				.ajax(
						operateCfg.queryAllProjectNodePhase,
						{
							bizId : projectId,
							nodeKindId : 1
						},
						function(data) {
							var phases = data.Rows, items = [];
							if (!phases || phases.length == 0)
								return;
							for (var i = 0; i < phases.length; i++) {
								items.push('<tr data-type="phase" id='
										+ phases[i].projectNodeId + '>');
								items
										.push('<td>  <span class="checkbox"></span> </td>');
								items
										.push('<td class="name folder-icon"> <i class="i ifl i21"> </i> <a data-ca="listView-see-phase" href="javascript:void(0)" onclick="showDocumentList(\''
												+ phases[i].fullId
												+ '/'
												+ phases[i].projectNodeId
												+ '\',\''
												+ phases[i].name
												+ '\')"  class="name" title="'
												+ phases[i].name
												+ '">'
												+ phases[i].name + '</a></td>');
								items.push('<td></td>');
								items.push('<td>项目阶段</td>');
								items.push('<td></td>');
								items.push('<td></td>');
								items.push('<td></td>');
								items.push("</tr>");
							}
							$("#archivebox .tbl tbody").html(items.join(""));
						});
	} else {// 加载档案
		Public.ajax(operateCfg.queryAllDocumentForArchive, {
			fullId : projectId
		}, function(data) {
			var archives = data.Rows;
			refreshAchiveGrid(archives);
		});
	}
}

function refreshAchiveGrid(archives) {
	var items = [];
	if (!archives || archives.length == 0)
		return;
	for (var i = 0; i < archives.length; i++) {
		items.push('<tr data-type="archive" id=' + archives[i].id + '>');
		items.push('<td>  <span class="checkbox"></span> </td>');
		items
				.push('<td class="name folder-icon"> <i class="i ifl i20"> </i> <a data-ca="listView-see-archive" onclick="openFile(\''
						+ archives[i].projectNodeId
						+ "','"
						+ archives[i].documentClassificationId
						+ "','"
						+ archives[i].id
						+ "','"
						+ archives[i].bizCode
						+ "','"
						+ archives[i].bizId
						+ '\')" href="javascript:void(null);"  class="name" title="'
						+ archives[i].fileName
						+ '">'
						+ archives[i].fileName
						+ '</a></td>');
		items.push('<td>' + archives[i].nodeName + '</td>');
		items.push('<td>' + archives[i].fileKind + '</td>');
		items.push('<td>' + archives[i].fileSize + '</td>');
		items.push('<td>' + archives[i].creatorName + '</td>');
		items.push('<td>' + archives[i].createDate + '</td>');
		items.push("</tr>");
	}
	$("#archivebox .tbl tbody").html(items.join(""));
}
// 项目界面的路径固定
function projectPath() {
	var html = new StringBuilder();
	if (viewProjectKind == "category") { // 分类
		html
				.append("<a href='javascript:void(null);' onclick='showProjectType()'>所有项目</a>");
		if (categoryID) {
			html
					.append(' > '
							+ '<a href="javascript:void(0)" onclick="showProjectList(\''
							+ projectCategoryID + '\',\'' + '\')" >'
							+ projectTypeName + '</a>');
		}
	} else if (viewProjectKind == "headquarter") { // 指挥部

	}
	$('#project-path').html(html.toString());
}
// 档案界面的路径绑定
function archivesPath() {
	var html = new StringBuilder();
	if (viewProjectKind == "category") { // 分类
		if (projectId) {
			html
					.append('<a href="javascript:void(0)" onclick="showNodePhase(\''
							+ projectId
							+ '\',\''
							+ '\')" >'
							+ projectName
							+ '</a>');
			if (phaseID) {
				html
						.append(" > "
								+ '<a href="javascript:void(0)" onclick="showDocumentList(\''
								+ fullId + '\',\'' + '\')" >' + nodePhaseName
								+ '</a>');
			}
		}
	} else if (viewProjectKind == "headquarter") { // 指挥部

	}
	$('#archive-path').html(html.toString());
}

function refreshProjectGrid(projects) {
	$("#projectbox .tbl tbody").html("");
	if (!projects || projects.length == 0)
		return;
	var items = [];
	for (var i = 0; i < projects.length; i++) {
		items.push('<tr data-type="project" id=' + projects[i].projectId + '>');
		items.push('<td>  <span class="checkbox"></span> </td>');
		items
				.push('<td class="name folder-icon"> <i class="i ifl i20"> </i> <a data-ca="listView-see-archive" href="javascript:void(0)" onclick="showNodePhase(\''
						+ projects[i].projectId
						+ '\',\''
						+ projects[i].name
						+ '\')"  class="name" title="'
						+ projects[i].name
						+ '">' + projects[i].name + '</a></td>');
		items.push('<td>项目</td>');
		items.push("</tr>");
	}
	$("#projectbox .tbl tbody").html(items.join(""));
}

function showProjectType() {
	categoryID = 0;
	buildPath();
	loadProjectChildren();
}

function showProjectList(id, name) {
	if (name) {
		projectTypeName = name;
	}
	categoryID = 1;
	projectCategoryID = id;
	buildPath();
	var fullId = '/' + id;
	loadProjectChildren(fullId);
}

function showNodePhase(projectId, projectName) {
	$("#projectbox").hide();
	$("#archivebox").show();
	$("#tab_project").removeClass("no-bl").removeClass("selected");
	$("#tab_archive").addClass("no-bl").addClass("selected");
	phaseID = 0;
	if (projectName) {
		this.projectName = projectName;
	}
	this.projectId = projectId;
	archivesPath();
	loadArchiveChildren();
}

function showDocumentList(fullId, nodePhaseName) {
	this.fullId = fullId;
	$("#projectbox").hide();
	$("#archivebox").show();
	$("#tab_project").removeClass("no-bl").removeClass("selected");
	$("#tab_archive").addClass("no-bl").addClass("selected");
	if (nodePhaseName) {
		this.nodePhaseName = nodePhaseName;
	}
	phaseID = 1;
	buildPath();
	loadArchiveChildren();
}

function openFile(projectNodeId, documentClassificationId, id, bizCode, bizId) {
	if (!PAUtil.checkDocumentResourceRight(projectNodeId,
			documentClassificationId, EProjectPermissionKind.Resources)) {
		Public.tip("对不起，您无权查看此文件！");
		return;
	}
	AttachmentUtil.onOpenViewFile(id, bizCode, bizId);
}

function buildPath() {
	projectPath();
	archivesPath();
}