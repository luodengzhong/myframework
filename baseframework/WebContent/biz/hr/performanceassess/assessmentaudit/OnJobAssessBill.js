var gridManager = null , refreshFlag = false,scorePersonLevel=null;
$(document).ready(function() {
	     UICtrl.autoSetWrapperDivHeight();
        scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
		 $('#onJobAssessApplyFileList').fileList();
		  initializeGrid();

});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addPersonHandler, 
		updateHandler: updateAssessPersonHandler,
		deleteHandler: deleteHandler	
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "测评人", name: "scorePersonName", width: 200, minWidth: 200, type: "string", align: "left",
		editor: { type: 'select',   required: true, data: { type:"sys", name: "orgSelect",
				getParam: function(){
				 return { a: 1, b: 1, searchQueryCondition: " org_kind_id ='psm' and instr(full_id, '.prj') = 0 " };
				}, back:{personMemberId: "scorePersonId", personMemberName: "scorePersonName" }
		}}	
		},
			
	  { display: "级别", name: "scorePersonLevel", width: 150, minWidth: 150, type: "String", align: "center",
			editor: { type:'combobox',data : scorePersonLevel, required: true},	
			render : function(item) {
				return scorePersonLevel[item.scorePersonLevel];
			}
		},		   
		
		 {display : "序号",name : "sequence",width : 100,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}},
			 {display : "权重",name : "proportion",width : 100,minWidth : 60,type : "string",align : "left"
			
			}
		],
		dataAction : 'server',
		url: web_app.name+'/reshuffleAction!slicedQueryPerformAssessPerson.ajax',
		parms:{personId:$('#personId').val(),underAssessmentId:$('#underAssessmentId').val(),periodCode:'lzcp'},
		pageSize : 20,
		width : '99%',
		height : 300,
		heightDiff : -5,
		usePager:false,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		autoAddRow:{scorePersonId:'',assessPersonId:'',underAssessmentId:''},
		onLoadData :function(){
			return true;
		}
	});
}


function addPersonHandler(){
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
	gridManager.addRows(addRows);
}

//修改评分人级别和权重
function updateAssessPersonHandler(){
	var data =gridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip('请选择需要编辑的评分人！');
		return false;
	}
	var html=['<div class="ui-form">','<form method="post" action="">'];
	html.push("<div class='row'><dl>");
    html.push("<dt style='width:80px'>评分人级别<font color='#FF0000'>*</font>&nbsp;:</dt>");
    html.push("<dd style='width:140px'>");
    html.push("<input type='text' class='text' id='choose_scorePersonLevel' required='true' maxlength='20' value=''/>");
    html.push("</dd>");
    html.push("</dl></div>");
    html.push("<dl></div>","</form>");
	UICtrl.showDialog( {
		width:280,
		top:150,
		title : '修改评分人级别',
		content:html.join(''),
		ok : function(){
			var scorePersonLevel=$('#choose_scorePersonLevel').val();
			if(scorePersonLevel==''){
				Public.tip('请选择评分人级别！');
			    return false;
			}
			$.each(data,function(i,o){
				gridManager.updateRow(o,{
	                scorePersonLevel: scorePersonLevel
	            });
			});
			return true;
		},
		init:function(){
			$('#choose_scorePersonLevel').combox({data:scorePersonLevel});
		}
	});
}

//删除评分人
function deleteHandler(){
	DataUtil.delSelectedRows({ action:'reshuffleAction!deletePerformAssessPerson.ajax',
		gridManager: gridManager,idFieldName:'assessPersonId',
		onSuccess:function(){
			reloadGrid();
		}
	});	
}


function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager,idFieldName:'assessPersonId'});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}

function getId() {
	return $("#auditId").val() || 0;
}

function setId(value){
	$("#auditId").val(value);
	gridManager.options.parms['auditId'] =value;
	$('#onJobAssessApplyFileList').fileList({bizId:value});

}
function afterSave(){
	reloadGrid();
}

function reloadGrid() {
} 
