var projectId = 0, projectName, status, updateProjectStatusAction, operateCfg = {}, tempStatus;

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	bindEvents();
	initializeUI();
	loadProject();
	loadProjectImplementation();

	function getQueryParameters() {
		projectId = Public.getQueryStringByName("projectId") || 0;
	}

	/**
	 * 初始化参数配置
	 */
	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectMainAction!";
		operateCfg.stopProjectAction = actionPath + "stopProject.ajax";
		operateCfg.reStartProjectAction = actionPath + "reStartProject.ajax";
		operateCfg.reSetProjectAction = actionPath + "resetProject.ajax";
		operateCfg.continueProjectAction = actionPath + "continueProject.ajax";
		operateCfg.pauseProjectAction = actionPath + "pauseProject.ajax";
		operateCfg.startProjectAction = actionPath + "startProject.ajax";
		operateCfg.showProjectDetail = web_app.name
				+ "/projectConfigAction!showReadonlyProjectDetailPage.ajax";
		operateCfg.showDescriptionAction = actionPath + "forwardDescription.do";
		operateCfg.checkNodePermissionAction = web_app
				+ "/nodePermissionAction!checkNodePermission.ajax";
		operateCfg.loadProjectAction = actionPath + "loadProject.ajax";
		operateCfg.queryAllProjectNodeAction = actionPath
				+ "queryAllProjectNode.ajax";

		operateCfg.showProjectNodeManageAction = actionPath
				+ "showProjectNodeMainPage.do";

		operateCfg.slicedQueryProjectImplementationAction = actionPath
				+ "slicedQueryProjectImplementation.ajax";

		operateCfg.showProjectImplemetationMorePage = actionPath
				+ "showProjectImplemetationMorePage.do";
	}

	function initializeUI() {

	}

	function bindEvents() {
		$('#btnStop').click(function() {
					stopProject();
				});
		$('#btnPause').click(function() {
					pauseProject();
				});
		$('#btnContinue').click(function() {
					continueProject();
				});
		$('#btnReset').click(function() {
					reSetProject();
				});
		$('#btnReStart').click(function() {
					reStartProject();
				});
		$('#btnShow').click(function() {
					showProjectDetailPage();
				});
	}
});

function stopProject() {
	tempStatus = EProjectStatus.Aborted;
	updateProjectStatusAction = operateCfg.stopProjectAction;
	updateProjectStatus('中止');

}

function pauseProject() {
	tempStatus = EProjectStatus.Paused;
	updateProjectStatusAction = operateCfg.pauseProjectAction;
	updateProjectStatus('暂停');
}

function continueProject() {
	tempStatus = EProjectStatus.Construction;
	updateProjectStatusAction = operateCfg.continueProjectAction;
	updateProjectStatus('恢复');
}

function reSetProject() {
	tempStatus = EProjectStatus.Reserve;
	updateProjectStatusAction = operateCfg.reSetProjectAction;
	updateProjectStatus('重置');
}

function reStartProject() {
	tempStatus = EProjectStatus.Construction;
	updateProjectStatusAction = operateCfg.reStartProjectAction;
	updateProjectStatus('重新开始');
}

function updateProjectStatus(oper) {
	// 弹出编辑框
	UICtrl.showFrameDialog({
				url : operateCfg.showDescriptionAction,
				param : {
					item : EBaseDataItem.EventDefine
				},
				width : 360,
				title : operateCfg.showMoveTitle,
				ok : sendProjectImplementation
			});
}

function sendProjectImplementation() {
	var description = this.iframe.contentWindow.getSelectedTreeNodeData();
	if (!description) {
		Public.tip('请输入备注.');
		return;
	}
	var params = {
		projectId : projectId,
		description : description
	};
	var _self = this;

	Public.ajax(updateProjectStatusAction, params, function(data) {
				if (updateProjectStatusAction == operateCfg.reSetProjectAction) {
					location.reload();
					return;
				}

				status = tempStatus;
				initControlsStatus();
				tempStatus = undefined;
				_self.close();
			});
}

function showProjectDetailPage() {
	UICtrl.showAjaxDialog({
				url : operateCfg.showProjectDetail,
				title : "项目详情",
				width : 800,
				param : {
					projectId : projectId
				},
				init : function() {
					$('#ok').hide();
				}
			});
}

function changeNodeStyle(el, status) {
	if (status == 0) {
		$(el).css('color', '#000000');
		$(el).css('font-weight', 'normal');
		$(el).css('font-size', '12px');
	} else {
		$(el).css('color', '#4304F9');
		$(el).css('font-weight', 'bold');
		$(el).css('font-size', '13px');
	}
}

function changeNodeTabHead(id, projectNodeId, length) {
	for (var i = 1; i <= length; i++) {
		if (i == id) {
			$('#tdNode_Head' + i).attr("class", "NodeTabHeadSelected");
			$('#tdNode_Content' + i).show();
		} else {
			$('#tdNode_Head' + i).attr("class", "NodeTabHead");
			$('#tdNode_Content' + i).hide();
		}
	}
}

function initControlsStatus() {
	if (status == EProjectStatus.Reserve) {
		$('#btnStop').hide();
		$('#btnContinue').hide();
		$('#btnPause').hide();
		$('#btnReset').hide();
		$('#btnReStart').hide();
	} else if (status == EProjectStatus.Construction) {
		$('#btnStop').show();
		$('#btnContinue').hide();
		$('#btnPause').show();
		$('#btnReset').show();
		$('#btnReStart').hide();
	} else if (status == EProjectStatus.Complated) {
		$('#btnStop').hide();
		$('#btnContinue').hide();
		$('#btnPause').hide();
		$('#btnReset').hide();
		$('#btnReStart').show();
	} else if (status == EProjectStatus.Paused) {
		$('#btnStop').hide();
		$('#btnContinue').show();
		$('#btnPause').hide();
		$('#btnReset').show();
		$('#btnReStart').hide();
	} else if (status == EProjectStatus.Aborted) {
		$('#btnStop').hide();
		$('#btnContinue').hide();
		$('#btnPause').hide();
		$('#btnReset').hide();
		$('#btnReStart').show();
	}
}

function loadProject() {
	Public.ajax(operateCfg.loadProjectAction, {
				projectId : projectId
			}, function(data) {
				if (data) {
					projectName = data.name;
					status = data.status;
					$('#divProjectTitle').html('项目名称：' + data.name);
					initControlsStatus(data.status);
					loadProjectNodeKind();
				}
			});
}

function loadProjectNodeKind() {
	Public.ajax(operateCfg.queryAllProjectNodeAction, {
				bizId : projectId,
				bizKindId : ENodeConfigBizKind.Project,
				nodeKindId : ENodeKind.Classification,
				parentId : projectId
			}, function(data) {
				if (data) {
					var html = new StringBuilder();
					var html2 = new StringBuilder();
					html
							.append('<table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;"><tbody><tr>');
					var length = data.Rows.length;
					for (var i = 0; i < data.Rows.length; i++) {
						if (i == 0) {
							html
									.append('<td onclick="changeNodeTabHead('
											+ (i + 1)
											+ ','
											+ data.Rows[i].projectNodeId
											+ ','
											+ length
											+ ')" id="tdNode_Head'
											+ (i + 1)
											+ '" class="NodeTabHeadSelected"><div class="tabTitle">'
											+ data.Rows[i].shortName
											+ '</div></td>');
							html2
									.append('<div style="width: 100%; padding: 0px 0px 0px 0px; min-height:100px;" id="tdNode_Content'
											+ (i + 1)
											+ '">'
											+ loadProjectNode(
													data.Rows[i].childProjectNodeList,
													data.Rows[i].projectNodeId,
													data.Rows[i].graphicText)
											+ '</div>');
						} else {
							html
									.append('<td onclick="changeNodeTabHead('
											+ (i + 1)
											+ ','
											+ data.Rows[i].projectNodeId
											+ ','
											+ length
											+ ')" id="tdNode_Head'
											+ (i + 1)
											+ '" class="NodeTabHead"><div class="tabTitle">'
											+ data.Rows[i].shortName
											+ '</div></td>');
							html2
									.append('<div style="width: 100%; padding: 0px 0px 0px 0px; display: none; min-height:100px;" id="tdNode_Content'
											+ (i + 1)
											+ '">'
											+ loadProjectNode(
													data.Rows[i].childProjectNodeList,
													data.Rows[i].projectNodeId,
													data.Rows[i].graphicText)
											+ '</div>');
						}
					}

					html.append('</tr>');
					html
							.append('<tr><td valign="top" class="NodeTabContent" colspan="'
									+ length + '">');
					html.append(html2);
					html.append('</td></tr></tbody></table>');

					$('#divProjectNode').html(html.toString());
				}
			});
}

function loadProjectNode(data, parentId, graphicText) {
	var html = new StringBuilder();
	if (!data)
		return;
	/*for (var i = 0; i < data.length; i++) {
		html.append('<div class="projectNav_');
		if (data[i].status < 3) {
			html.append(data[i].status + 1);
		} else
			html.append(1);
		html
				.append('" onmouseover="changeNodeStyle(this,1)" onmouseout="changeNodeStyle(this,0)" title="');
		html.append(data[i].name + '" ');
		html.append('onclick="run(');
		html.append(data[i].projectNodeId);
		html.append(',\'' + data[i].code + '\'' + ',\'');
		html.append(data[i].name + '\')">');

		if (data[i].timeOutStatus == EProjectNodeTimeOutStatus.None) {
			html.append('<span style="color:black;">');
		} else if (data[i].timeOutStatus == EProjectNodeTimeOutStatus.Warning) {
			html.append('<span style="color:yellow;">');
		} else if (data[i].timeOutStatus == EProjectNodeTimeOutStatus.TimeOut) {
			html.append('<span style="color:red;">');
		}

		html.append(data[i].sequence + '.');
		html.append(data[i].shortName);
		html.append('</span>');
		html.append('</div>');
	}*/

	var url = web_app.name + '/pa/nodePic/nodeGraphic.jsp?projectId='
			+ projectId + '&projectNodeId=' + parentId;

	var gtData = $.parseJSON(graphicText);
	var height = 500;
	if (gtData && gtData.textTags && gtData.textTags.length > 0) {
		var maxY = 0;
		for (i = 0; i < gtData.textTags.length; i++) {
			if (parseInt(gtData.textTags[i].y) > maxY)
				maxY = parseInt(gtData.textTags[i].y);
		}
		height = maxY + 80;
	}

	html.append('<iframe id="mainiframe" scrolling="no" frameborder="0" src="'
			+ url + '" style="width: 100%; height: ' + height
			+ 'px; padding: 0px;"></iframe>');

	return html;
}

function run(projectNodeId, code, name) {
	if (!PAUtil.checkProjectNodeOperateRight(projectNodeId,
			EProjectPermissionKind.Manage_Operate)) {
		Public.tip("无权操作此节点，如有疑问，请联系管理员");
		return;
	}

	parent.addTabItem({
				tabid : 'projectNode' + projectNodeId,
				text : "项目节点[" + name + "]导航",
				url : operateCfg.showProjectNodeManageAction + '?projectId='
						+ projectId + '&projectNodeId=' + projectNodeId
			});
}

function loadProjectImplementation() {
	Public.ajax(operateCfg.slicedQueryProjectImplementationAction, {
				projectId : projectId,
				sortname : 'operTime',
				sortorder : 'desc',
				page : 1,
				pagesize : 10
			}, function(data) {
				if (data && data.Rows) {
					var html = new StringBuilder();
					html.append('<table cellpadding="0" cellspacing="0" ');
					html.append('class="l-table-edit">');
					html
							.append('<tr><td class="l-table-edit-title" style="width:60px;">序号</td>');
					html.append('<td class="l-table-edit-title">姓名</td>');
					html
							.append('<td class="l-table-edit-title" style="width:120px;">处理时间</td>');
					html.append('<td class="l-table-edit-title">内容</td>');
					html.append('<td class="l-table-edit-title">描述</td></tr>');
					for (var i = 0; i < data.Rows.length; i++) {
						var currData = data.Rows[i];
						html.append('<tr><td class="l-table-edit-td">');
						html.append(i + 1);
						html.append('</td>');

						html.append('<td class="l-table-edit-td">');
						html.append(currData.operName);
						html.append('</td>');

						html.append('<td class="l-table-edit-td">');
						html.append(currData.operTime);
						html.append('</td>');

						html.append('<td class="l-table-edit-td">');
						html.append(currData.content);
						html.append('</td>');

						html.append('<td class="l-table-edit-td">');
						html.append(currData.description);
						html.append('</td></tr>');
					}
					html.append('</table>');
					$('#divProjectImplementation').html(html.toString());
				}
			});
}

function showProjectImplemetationMore() {
	parent.addTabItem({
				tabid : 'projectImplementation' + projectId,
				text : "项目[" + projectName + "]执行进展",
				url : operateCfg.showProjectImplemetationMorePage
						+ '?projectId=' + projectId
			});
}