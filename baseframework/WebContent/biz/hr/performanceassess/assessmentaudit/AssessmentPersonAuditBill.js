var gridManager = null, detailGridManager =null, refreshFlag = false;
var periodMap={},scorePersonLevel={};
$(document).ready(function() {
	periodMap=$('#periodMapQuery').combox('getJSONData');
	scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
	initializeGrid();
	initDetailGrid();
});

function businessJudgmentUnit(){
	return true;
}
//初始化表格
function initializeGrid() {
     var auditId=$('#auditId').val();
     var kind=$('#kind').val();
	gridManager = UICtrl.grid('#maingrid', {
		columns: [  
			{ display: "姓名", name: "personName", width: 60, minWidth: 60, type: "string", align: "left" },	
			{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "评分任务", name: "formName", width: 220, minWidth: 60, type: "string", align: "left" },
			{ display: "类别", name: "periodName", width: 60, minWidth: 60, type: "string", align: "left"},

			{ display: "考核表", name: "templetName", width: 160, minWidth: 60, type: "string", align: "left",
				render : function(item) {
					return '<a href="javascript:showForm('+item.evaluationId+',\''+item.templetName+'\');" class="GridStyle">'+item.templetName+'</a>';
				}}
		],
		dataAction : 'server',
		url: web_app.name+'/assessmentauditAction!queryList.ajax',
		parms:{auditId:auditId,kind:kind},
		pageSize : 20,
		title: "待审核被考核人列表",
		width : '62%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 'auto',
		sortName:'personName',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onAfterShowData:function(datas){
			if(datas&&datas['Rows']&&datas['Rows'].length>0){
				var data=datas['Rows'][0];
				refreshDeatilGrid(data.underAssessmentId);
			}
		},
		onSelectRow:function(data, rowindex, rowobj){
			refreshDeatilGrid(data.underAssessmentId);
		},
		onSuccess:function(){
			var v=$('#mainUnderAssessmentId').val();
			if(v!=''&&v!=-1){
				refreshDeatilGrid(-1);
			}
		}
	});
	UICtrl.createGridQueryBtn('#maingrid',function(param){
		UICtrl.gridSearch(gridManager, {personName:encodeURI(param)});
	});
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function showForm(evaluationId,name){
	UICtrl.showAjaxDialog({url: web_app.name + '/performassessAction!queryIndexForView.load', 
		param:{evaluationId:evaluationId}, 
		ok: false,
		init:function(doc){
			var div=$('#viewTempletIndexDiv').width(840);
			var height=div.height(),wh=getDefaultDialogHeight()-50;
			if(height>wh){
				div.height(wh);
			}
		},
		title:"考核表["+name+"]指标",
		width:850
	});
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
}
function refreshDeatilGrid(underAssessmentId){
	$('#mainUnderAssessmentId').val(underAssessmentId);
	detailGridManager.options.parms.underAssessmentId = underAssessmentId;
	detailGridManager.loadData();
}

function initDetailGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler:savePersonHandler,
		addHandler: addPersonHandler,
		deleteHandler:deletePersonHandler
	});
	detailGridManager = UICtrl.grid('#assessPersongrid', {
		columns : [ 
		  {display : "评分人姓名",name : "scorePersonName",width : 100,minWidth : 60,type : "string",align : "left"},
		  {display : "评分人级别",name : "scorePersonLevel",width : 100,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'combobox',
				data : scorePersonLevel
			},
			render : function(item) {
				return scorePersonLevel[item.scorePersonLevel];
			}
		  }, 
		  {display : "序号",name : "sequence",width : 60,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}
		}],
		dataAction : 'server',
		url: web_app.name+'/performassessAction!slicedQueryPerformAssessPerson.ajax',
		pageSize : 20,
		width : '35%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight :25,
		enabledEdit: true,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#mainUnderAssessmentId').val()=='');
		}
	});
}

function addPersonHandler(){
	var underAssessmentId=$('#mainUnderAssessmentId').val();
	if(underAssessmentId==''){
		Public.tip("请选择考核表!");
		return;
	}
	
   var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
  
	UICtrl.showFrameDialog({
		title : "选择评分名单",
		url : web_app.name + "/orgAction!showSelectOrgDialog.do",
		param : selectOrgParams,
		width : 700,
		height : 400,
		ok : function() {
			var _self=this,data = _self.iframe.contentWindow.selectedData;
			if (!data)
				return;
			addPersons(data,'id','name');
			_self.close();
		}
	});
}
function addPersons(data,idName,name){
	var addRows = [], addRow;
	$.each(data, function(i, o) {
		// 绩效考核全部默认为上级
		addRow = $.extend({}, o);
		addRow["assessPersonId"]='';
		addRow["underAssessmentId"]='';
		addRow["scorePersonId"] = o[idName];
		addRow["scorePersonName"] = o[name];
		addRow["proportion"] = 0;
		addRow["scorePersonLevel"] = 'superior';
		addRow["sequence"] =i+1;
		addRows.push(addRow);
	});
	detailGridManager.addRows(addRows);
}
function reLoaddetailGrid(){
	detailGridManager.loadData();
}

//删除评分人
function deletePersonHandler(){
	DataUtil.delSelectedRows({action:'performassessAction!deletePerformAssessPerson.ajax',
		gridManager:detailGridManager,idFieldName:'assessPersonId',
		param:{underAssessmentId:$('#mainUnderAssessmentId').val()},
		onSuccess:function(){
			reLoaddetailGrid();		  
		}
	});
}


//保存评分人
function savePersonHandler(){
	var detailData=DataUtil.getGridData({gridManager:detailGridManager,idFieldName:'assessPersonId'});
	if(!detailData) return false;
	if(detailData.length==0) return;
	Public.ajax(web_app.name + "/performassessAction!savePerformAssessPerson.ajax",
			{detailData:encodeURI($.toJSON(detailData)),underAssessmentId:$('#mainUnderAssessmentId').val()},
			function(){
				reLoaddetailGrid();		  
			}
	);
}



