var EvaMapValue = [];
$(document).ready(function() {
			$('#print,#print_line').hide();
			$('#makeACopyFor,#makeACopyFor_line').hide();
			EvaMapValue = $('#levelMapValue').combox('getFormattedData');
			var selects = $('#trainingEvaluteContent').find('input[name="result"]');
			selects.each(function() {
				$(this).combox({data : EvaMapValue,dataSortFunction:function(a,b){
					return parseInt(a.value,10)>parseInt(b.value,10)?-1:1;
				}});
			});
			$('#receiving').searchbox({
						type : "hr",
						name : "evalTypeIndex",
						checkbox : true,
						valueIndex : '#receivingId',
						checkboxIndex : 'id',
						height : 400,
						callBackControls : {
							id : '#receivingId',
							content : '#receiving'
						}
					});
			var teacherType = $("#teacherType").val();
			if (teacherType == "inner") {
				$('#outerSuggest').hide();
			} else {
				$('#outerSuggest').show();
			}
	  $('#totalScore').on('blur',function(){
		var totalScore=$(this).val();
		if(totalScore>10){
		Public.tip('总评分不能大于10分');
		$('#totalScore').val(' ');
	    return;
		}
	});
	});

function save() {
	var extendedData = getScoreValues();
	$('#submitForm').ajaxSubmit({
				url : web_app.name + '/trainingEffectEvaAction!save.ajax',
				param : {
					extendedData : $.toJSON(extendedData)
				},
				success : function(data) {
					$("#evaluateId").val(data);
					refreshFlag = true;
				}
			});

}
function getScoreValues() {
	var values = [], evaluateDetailId, result, flag = true;
	$('#trainingEvaluteContent').find('tr').each(function() {
		result = $(this).find('input[name="result"]').val();
		evaluateDetailId = $(this).find('input[name="evaluateDetailId"]').val();
		values.push({
					evaluateDetailId : evaluateDetailId,
					result : result
				});
	});
	return flag ? values : false;
}

// 提交
function advance() {
	var extendedData = getScoreValues();
	$('#submitForm').ajaxSubmit({
				url : web_app.name + '/trainingEffectEvaAction!advance.ajax',
				param : {
					extendedData : $.toJSON(extendedData)
				},
				success : function(data) {
					UICtrl.closeAndReloadTabs("TaskCenter", null);
				}
			});
}

// 中止
function abort() {
	var evaluateId = getId();
	var taskId = $('#taskId').val();
	Public.ajax(web_app.name + '/trainingEffectEvaAction!abort.ajax', {
				evaluateId : evaluateId,
				taskId : taskId
			}, function() {
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			});
}

function getId() {
	return $("#evaluateId").val() || 0;
}

function setId(value) {
	$("#evaluateId").val(value);
	

}