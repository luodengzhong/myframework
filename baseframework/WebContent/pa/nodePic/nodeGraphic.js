var operateCfg = {}, projectNodeId, projectId;
$(function() {
			getQueryParameters();
			initializeOperateCfg();
			initFlash();
		});

function getQueryParameters() {
	projectNodeId = Public.getQueryStringByName("projectNodeId") || 0;
	projectId = Public.getQueryStringByName("projectId") || 0;
}

function initializeOperateCfg() {
	var actionPath = web_app.name + "/projectNodeMainAction!";
	operateCfg.loadProjectNodeAction = actionPath + "loadProjectNode.ajax";
	operateCfg.showProjectNodeManageAction = web_app.name
			+ "/projectMainAction!showProjectNodeMainPage.do";
}

function initFlash() {
	var flashVars = {};
	var params = {
		wmode : "opaque"
	};
	swfobject.embedSWF(web_app.name + "/pa/nodePic/brcprocview.swf", 'mainflash',
			"100%", "100%", "9.0.0", "expressInstall.swf", flashVars, params);
}

function flash_callback_func(etype, data) {
	if (etype == 'initFlash') {
		Public.ajax(operateCfg.loadProjectNodeAction, {
					projectNodeId : projectNodeId,
					hasLoadGraphic : 1
				}, function(data) {
					if (data && data.graphicText && $('#mainflash')) {
						$('#mainflash')[0].loadImage($
								.parseJSON(data.graphicText));
					}
				});
	} else if (etype == 'doubleclick') {
		if (data != null) {
			run(data.projectNodeId, data.code, data.shortName || data.name);
		}
	}
}

function run(projectNodeId, code, name) {
	if (!PAUtil.checkProjectNodeOperateRight(projectNodeId,
			EProjectPermissionKind.Manage_Operate)) {
		parent.Public.tip("无权操作此节点，如有疑问，请联系管理员");
		return;
	}

	top.addTabItem({
				tabid : 'projectNode' + projectNodeId,
				text : "项目节点[" + name + "]导航",
				url : operateCfg.showProjectNodeManageAction + '?projectId='
						+ projectId + '&projectNodeId=' + projectNodeId
			});
}
