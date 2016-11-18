$(document).ready(function() {
	scorePersonLevel = $('#scorePersonLevel').combox('getJSONData');
    var posLevel=$('#posLevel').val();
    var staffingPostsRank=$('#staffingPostsRank').val();
	//设置审批页面中字段为可读写
	setEditable();
	var opinionV=$('#opinion').combox({onChange:function(o){
		changeSalaryOpinionTr(o.value);
	}}).val();
	if(posLevel<=4.2||staffingPostsRank>=2){
		//副经理级以上
		 initDetailGrid();
		 setTimeout(function(){
			reloadGrid();
		 },0);
	}else{
		$('#maingrid').hide();
	}
	function changeSalaryOpinionTr(value){
		var tr=$('#salaryOpinionTr');
		var div_beformal=$('#maingrid');
		if(value==2){
			$('#salaryOpinion').removeAttr('required');
			$('#speakPersonMemberName').removeAttr('required');
		    $('div,span',tr).add(tr).hide();
		    $('#maingrid').hide();
		}else{
			$('#salaryOpinion').attr('required',true);
			$('#speakPersonMemberName').attr('required',true);
			$('div,span',tr).add(tr).show();
			$('#maingrid').show();
		}
	}
	
	changeSalaryOpinionTr(opinionV);
	 var $al=$('#speakPersonMemberName');
	 $al.orgTree({
	  filter: 'psm',
	 	back:{
			text:$al,
			value:"#speakPersonMemberId",
			id:"#speakPersonMemberId",
			name:$al
	 	}
	 });
});
function setEditable(){
	if(isApproveProcUnit()){//是审核中
		setTimeout(function(){
			UICtrl.enable('#opinion');
			UICtrl.enable('#salaryOpinion');
			UICtrl.enable('#speakPersonMemberName');
		},0);
	
	    permissionAuthority['maingrid.saveHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.addHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.updateHandler']={authority:'readwrite',type:'2'};
		permissionAuthority['maingrid.deleteHandler']={authority:'readwrite',type:'2'};

		permissionAuthority['maingrid.scorePersonLevel']={authority:'readwrite',type:'1'};
		permissionAuthority['maingrid.sequence']={authority:'readwrite',type:'1'};
      
	}
}


function getId() {
	return $("#id").val() || 0;
}

function setId(value){
	$("#id").val(value);
}


function getExtendedData(){
    var posLevel=$('#posLevel').val();
    var staffingPostsRank=$('#staffingPostsRank').val();
    if(posLevel<=4.2||staffingPostsRank>=2){
	var detailData = DataUtil.getGridData({gridManager: detailGridManager,idFieldName:'assessPersonId'});
    if(!detailData){
		return false;
	 }
	 return {detailData:encodeURI($.toJSON(detailData))};
    }else{
    	return {};
    }
    
}



function afterSave(){
	reloadGrid();
}

function reloadGrid(){
	 var posLevel=$('#posLevel').val();
    var staffingPostsRank=$('#staffingPostsRank').val();
      if(posLevel<=4.2||staffingPostsRank>=2){
      	 detailGridManager.loadData();
      }
	
}
//批量保存评分人
function savePersonHandler(){
    var detailData = DataUtil.getGridData({gridManager: detailGridManager});
	var archivesId=$('#archivesId').val();
	var staffName=$('#staffName').val();
	if(!detailData|| detailData.length==0) {
		Public.tip('请选择评分人！');
		return;
	}
	Public.ajax(web_app.name + "/performassessAction!saveBeformalPerformAssessPerson.ajax",
			{detailData:encodeURI($.toJSON(detailData)),archivesId:archivesId,staffName:staffName},
			function(){
				$('#underAssessmentId').val(data);
				reloadGrid();	
			}
	);
}

function initDetailGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		//saveHandler:savePersonHandler,
		addHandler: addPersonHandler,
		updateHandler: updateAssessPersonHandler,
		deleteHandler:deletePersonHandler

	});
	detailGridManager = UICtrl.grid('#maingrid', {
		columns : [ 
		  {display : "评分人姓名",name : "scorePersonName",width : 120,minWidth : 60,type : "string",align : "left"},
		  {display : "评分人级别",name : "scorePersonLevel",width : 100,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'combobox',
				data : scorePersonLevel
			},
			render : function(item) {
				return scorePersonLevel[item.scorePersonLevel];
			}
		  }, 
		  {display : "序号",name : "sequence",width : 100,minWidth : 60,type : "string",align : "left",
			editor : {
				type : 'text',
				required : true,
				mask : 'nnn'
			}
		}],
		dataAction : 'server',
		url: web_app.name+'/beFormalAssessmentAduitAction!slicedQueryUnderAssessmentpesrson.ajax',
		parms:{archivesId:$('#archivesId').val()},
		pageSize : 20,
		width : '99%',
		height : 400,
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight :25,
		enabledEdit: true,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		delayLoad:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !($('#archivesId').val()=='');
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
		addRow["scorePersonName"] = o[name];
		addRow["scorePersonId"] = o[idName];
		addRow["scorePersonLevel"] = 'superior';
		addRow["sequence"] =i+1;
		addRows.push(addRow);
	});
	detailGridManager.addRows(addRows);
}
function updateAssessPersonHandler(){
	var data =detailGridManager.getSelectedRows();
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
    html.push("</form>");
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
				detailGridManager.updateRow(o,{
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
//删除评分名单
function deletePersonHandler(){
	DataUtil.delSelectedRows({action:'performassessAction!deletePerformAssessPerson.ajax',
		gridManager:detailGridManager,idFieldName:'assessPersonId',
		onSuccess:function(){
			reloadGrid();
		}
	});
}
