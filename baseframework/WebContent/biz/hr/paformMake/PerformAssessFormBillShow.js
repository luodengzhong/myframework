var personGridManager = null, refreshFlag = false;
$(document).ready(function() {
	scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
	bindEvent();
	initializepersonManager();
	initUI();
});
function initUI(){
	$('#tabPage').tab();
}

function bindEvent(){
	/*$("#saveIndexDetailBtn").click(function() {
		var values=getScoreValue();
		alert($.toJSON(values));
		$('#submitForm').ajaxSubmit({
			url: web_app.name+'/paformMakeAction!saveFormIndex.ajax',
			param: {values:$.toJSON(values)}
		});
	});*/
	$('#paList').click(function(){
		personGridManager.loadData();
	});
}
function getExtendedData() {
	var extendedData=getScoreValue();
	var personExtendedData = DataUtil.getGridData({
		gridManager : personGridManager
	});
	
	if (!personExtendedData) {
		return false;
	}
	return {
		detailData : encodeURI($.toJSON(extendedData)),
		personDetailData : encodeURI($.toJSON(personExtendedData))
	};
}

function businessJudgmentUnit(){
	return true;
}

function getId() {
	return $("#formId").val() || 0;
}

function setId(value) {
	$("#formId").val(value);
	personGridManager.options.parms['formId'] = value;
}
function getScoreValue(){
	var formId = $('#formId').val();
	alert(formId);
	var values=[], indexDetailId,mainContent, sequence,partContent, desption,scoreNum;
	$('#performAssessScoreTbody').find('tr').each(function(){
		
		indexDetailId=$(this).find('input[name="indexDetailId"]').val();
		mainContent=$(this).find('input[name="mainContent"]').val();
		sequence=$(this).find('input[name="sequence"]').val();
		partContent=$(this).find('input[name="partContent"]').val();
		desption=$(this).find('input[name="desption"]').val();
		scoreNum=$(this).find('input[name="scoreNum"]').val();
		values.push({
			formId:formId,
			indexDetailId:indexDetailId,
			mainContent:mainContent,
			sequence:sequence, 
			partContent:partContent, 
			desption:desption, 
			scoreNum:scoreNum,
		});
	});
	return values;

}

function initializepersonManager(){
	var formId = $('#formId').val();
	personGridManager = UICtrl.grid('#personid', {
		columns : [ {
			display : "评分人姓名",
			name : "scorePersonName",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left"
		}, {
			display : "评分人级别",
			name : "scorePersonLevel",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'combobox',
				data : scorePersonLevel,
			},
			render : function(item) {
				return scorePersonLevel[item.scorePersonLevel];
			}
		}, {
			display : "所占权重(%)",
			name : "proportion",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				mask : 'nnn'
			}
		},
		{
			display : "序号",
			name : "sequence",
			width : 130,
			minWidth : 60,
			type : "string",
			align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}
		}],
		dataAction : 'server',
		url : web_app.name + '/paformMakeAction!slicePerson.ajax',
		pageSize : 20,
		parms : {
			formId : formId
		},
		width : '99%',
		height : 200,
		heightDiff : -5,
		usePager:false,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName : 'scorePersonLevel',
		sortOrder : 'desc',
		checkbox : true,
		enabledEdit : true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#formId').val() == '');
		}
	});
}
