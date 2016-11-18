var projectId = 0, projectName, status, updateProjectStatusAction, operateCfg = {}, tempStatus;

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	//bindEvents();
	initializeUI();
	loadProject();
/*	loadProjectImplementation();*/

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
		operateCfg.startProjectAction = actionPath + "startProject.ajax"
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

	}

	function initializeUI() {

	}

});

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

					html.append('<table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;"><tbody><tr>');
					var length = data.Rows.length;
					for (var i = 0; i < data.Rows.length; i++) {
						if (i == 0) {
							html.append('<td onclick="changeNodeTabHead('
									+ (i + 1) + ','
									+ data.Rows[i].projectNodeId + ',' + length
									+ ')" id="tdNode_Head' + (i + 1)
									+ '" class="NodeTabHeadSelected"><div class="tabTitle">'
									+ data.Rows[i].shortName + '</div></td>');
							html2.append('<div style="width: 100%; padding: 20px 0px 20px 0px; min-height:100px;" id="tdNode_Content'
											+ (i + 1)
											+ '">'
											+ loadProjectNode(data.Rows[i].childProjectNodeList)
											+ '</div>');
						} else {
							html.append('<td onclick="changeNodeTabHead('
									+ (i + 1) + ','
									+ data.Rows[i].projectNodeId + ',' + length
									+ ')" id="tdNode_Head' + (i + 1)
									+ '" class="NodeTabHead"><div class="tabTitle">'
									+ data.Rows[i].shortName + '</div></td>');
							html2.append('<div style="width: 100%; padding: 20px 0px 20px 0px; display: none; min-height:100px;" id="tdNode_Content'
											+ (i + 1)
											+ '">'
											+ loadProjectNode(data.Rows[i].childProjectNodeList)
											+ '</div>');
						}
					}

					html.append('</tr>');
					html.append('<tr><td valign="top" class="NodeTabContent" colspan="' + length + '">');
					html.append(html2);
					html.append('</td></tr></tbody></table>');

					$('#divProjectNode').html(html.toString());
				}
			});
}

function loadProjectNode(data) {
	var html = new StringBuilder();
	if (!data)
		return;
	for (var i = 0; i < data.length; i++) {
        var title = getNodeTitle(data[i]);

		html.append('<div class="projectNav_');
		html.append(data[i].status + 1);
		html.append('" onmouseover="changeNodeStyle(this,1)" onmouseout="changeNodeStyle(this,0)" title="');
		html.append(title + '" ');
		html.append('>');

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
	}

	return html;
}

function getNodeTitle(item){
    var title = new StringBuilder();
    var status = item.status;
    title.append("节点状态：");
    title.append(EProjectNodeStatus.getStatusName(status) + "\n");
    if(item.timeOutStatus != EProjectNodeTimeOutStatus.None){
        title.append("节点超时状态：");
        title.append(EProjectNodeTimeOutStatus.getTimeOutName(item.timeOutStatus) + "\n");
    }
    if(status == EProjectNodeStatus.PROCESSING){
        title.append("开始时间：" + item.startTime + "\n");
    }
    if(status == EProjectNodeStatus.COMPLATED){
        title.append("开始时间：" + item.startTime + "\n");
        title.append("结束时间：" + item.endTime + "\n");
    }

    return title.toString();
}