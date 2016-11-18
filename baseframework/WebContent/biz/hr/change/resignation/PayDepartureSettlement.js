$(document).ready(function() {
	$('#detailTabs').tab();
		/*
		 * var accountsType=$('#accountsType').val();
		 * if(accountsType=='performance'){
		 * $('#deleteProcessInstance,#deleteProcessInstance_line').hide(); }
		 */
});

function getId() {
	return $("#departureSettlementMainId").val() || 0;
}

function afterSave(data) {
	$.each(data, function(id, d) {
		var form = $('#settlementForm_' + id);
		$.each(d, function(p, v) {
			$('input[name="' + p + '"]', form).val(Public.currency(v));
		});
	});
}
// 打印功能
function print() {
	var noaccessFieldType = $('#NoaccessFieldDepartureSettlement').length;
	var departureSettlementMainId = $('#departureSettlementMainId').val();
	window
			.open(web_app.name
					+ '/resignationSettlementAction!createPdf.load?departureSettlementMainId='
					+ departureSettlementMainId + '&noaccessFieldType='
					+ noaccessFieldType);
}
function getExtendedData() {
	var param = [];
	$('form.settlementForm').each(function() {
				var data = $(this).formToJSON();
				param.push(data);
			});
	return {
		detailData : $.toJSON(param)
	};
}

function showAttInfo(attStatId) {
	UICtrl.showFrameDialog({
			title:'考勤详细',
			url: web_app.name + '/biz/hr/change/resignation/departureSettlementAttStatistics.jsp', 
			param:{attStatId:attStatId},
			height:300,
			width:getDefaultDialogWidth(),
			resize:true,
			ok:false,
			cancel:true
	});
}