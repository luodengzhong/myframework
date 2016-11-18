var imp_log_query_manage_type = 'meterRedingTemplate';// 日志查询管理权限类型

// 导出模板
function exportExcel() {
	var _self = this;
	UICtrl.showAjaxDialog({
		url : web_app.name + '/meterRecordAction!forwoardBatchImportMeter.load',
		title : "导出模板",
		width : 400,
		okVal : "导  出",
		ok : function() {
			exportHandler(_self);
		},
		close : function() {
			_self.close();
		}
	});
}

function exportHandler(obj) {
	var params = $("#exportForm").formToJSON();
	if (!params) {
		return;
	}
	if (params.resourceIds) {
		params.resourceIds = "[" + params.resourceIds + "]";
	}
	// 下载模板
	var url = web_app.name + '/meterRecordAction!exportMeterTemaplate.ajax';
	var fileName = "三表导入模板";
	UICtrl.downFileByAjax(url, params, fileName);
}
