var gridManager=null,personToolbar=null,selectOrgDialog=null;
$(document).ready(function() {
	initializeUI();
	initToolBar();
	initializePersonChooseGrid();
	//查询条件可用
	setTimeout(function(){UICtrl.setEditable($('#queryPersonDiv'));},0);
});
function initializeUI(){
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : function(data){
			var fullId=data.fullId;
			if (gridManager&&fullId!='') {
				UICtrl.gridSearch(gridManager,{fullId:fullId});
			}else{
				gridManager.options.parms['fullId']='';
			}
		}
	});
}

function canEidt(){
	var evaluateStartId=$('#evaluateStartId').val();
	return !(evaluateStartId=='');
}
function isApply(){
	var status=$('#status').val()+'';
	return status=='0'
}
function isApproving(){
	var status=$('#status').val()+'';
	return status=='1'
}
function isCompleted(){
	var status=$('#status').val()+'';
	return status=='3'||status=='-1'
}
function initToolBar(){
	$('#toolBar').toolBar('removeItem');
	$('#toolBar').toolBar('addItem',[
		{id:'save',name:'保存',icon:'save',event:doSave},
		{line:true},
		{id:'delete',name:'删除',icon:'deleteProcessInstance',event: doDelete},
		{line:true},
		{id:'turn',name:'发起评价',icon:'turn',event:saveDoStart},
		{line:true}
	]);
	if(!canEidt()){
		$("#toolBar").toolBar("disable", "delete");
	 	$("#toolBar").toolBar("disable", "turn");
	}
	if(Public.isReadOnly){
		$("#toolBar").toolBar("disable", "save");
	}
	if(!isApply()||Public.isReadOnly){//已发布的数据不能再发布
		$("#toolBar").toolBar("disable", "delete");
	 	$("#toolBar").toolBar("disable", "turn");
	}
}
//保存
function doSave(fn){
	var url= web_app.name +'/evaluateStartAction!saveEvaluateStart.ajax';
	$('#submitForm').ajaxSubmit({url: url,success : function(data) {
		if(!canEidt()){
			setId(data);
			reloadPersonGrid();
		}
		if($.isFunction(fn)){
			fn.call(window,data);
		}
	}});
}
//发起评价
function saveDoStart(){
	var evaluateStartId=$('#evaluateStartId').val();
	UICtrl.confirm('确定发起双向评价吗?',function(){
		doSave(function(){
			Public.ajax(web_app.name + '/evaluateStartAction!saveDoStartEvaluate.ajax', {evaluateStartId:evaluateStartId}, function(){
				UICtrl.closeAndReloadTabs("TaskCenter", null);
			});
		});
	});
}
function setId(id){
	$('#evaluateStartId').val(id);
	$("#toolBar").toolBar("enable", "delete");
	$("#toolBar").toolBar("enable", "turn");
	personToolbar.setEnabled("menuAdd");
    personToolbar.setEnabled("menuDelete");
    personToolbar.setEnabled("menuexportExcelHandler");
	gridManager.options.parms['evaluateStartId'] =id;
}
function getId(){
	$('#evaluateStartId').val();
}

//删除
function doDelete(){
	var evaluateStartId=$('#evaluateStartId').val();
	if(evaluateStartId==''){
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/evaluateStartAction!deleteEvaluateStart.ajax', {evaluateStartId:evaluateStartId}, function(){
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		});
	});
}

function initializePersonChooseGrid(){
	var toolbarOptions = false;
	if(isApply()){
		 toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			addHandler: showChooseOrgDialog, 
			deleteHandler: deletePersonChoose,
			exportExcelHandler: function(){
				UICtrl.gridExport(gridManager);
			}
		});
	}
	if(isApproving()){
		toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
			addHandler: showChooseOrgDialog, 
			deleteHandler: deletePersonChoose,
			exportExcelHandler: function(){
				UICtrl.gridExport(gridManager);
			},
			saveTurnHandler:{id:'turn',text:'发起评价',img:'page_next.gif',click:reStartEvaluate}
		});
	}
	var evaluateStartId=$('#evaluateStartId').length>0?$('#evaluateStartId').val():'';
	gridManager = UICtrl.grid('#personChooseGrid', {
		columns: [
		{ display: "状态", name: "orgStatus", width: 60, minWidth: 60, type: "string", align: "left",
			  render: function (item) {
				  var html=[];
				  html.push('<img src="',OpmUtil.getOrgImgUrl('psm',item['orgStatus']),'" width="16" height="16"/>');
				  return html.join('');
			  }
		},		  
		{ display: "姓名", name: "personMemberName", width: 80, minWidth: 60, type: "string", align: "left"},		   
		{ display: "路径", name: "fullName", width: 500, minWidth: 60, type: "string", align: "left"},
		{ display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "类型", name: "evaluateOrgKindTextView", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "行政级别", name: "posLevelTextView", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "职级", name: "staffingPostsRankTextView", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "已评价(个)", name: "countEvaluationOrg", width: 80, minWidth: 60, type: "number", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/evaluateStartAction!slicedQueryEvaluateStartPerson.ajax',
		parms:{evaluateStartId:evaluateStartId},
		pageSize:20,
		width : '99%',
		height : '450',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		autoAddRowByKeydown:false,
		checkbox: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return canEidt();
		}
	});
	personToolbar = gridManager.toolbarManager;
    if(!canEidt()){
    	personToolbar.setDisabled("menuAdd");
    	personToolbar.setDisabled("menuDelete");
    	personToolbar.setDisabled("menuexportExcelHandler");
    }
}
function deletePersonChoose(){
	var evaluateStartId=$('#evaluateStartId').val();
	DataUtil.delSelectedRows({action:'evaluateStartAction!deleteEvaluateStartPerson.ajax',
		gridManager: gridManager,idFieldName:'evaluateStartPersonId',param:{evaluateStartId:evaluateStartId},
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
//重复发起评价任务
function reStartEvaluate(){
	var evaluateStartId=$('#evaluateStartId').val();
	DataUtil.delSelectedRows({action:'evaluateStartAction!saveReStartPersonEvaluate.ajax',message:'您确定重新发起评价任务吗?',
		gridManager: gridManager,idFieldName:'evaluateStartPersonId',param:{evaluateStartId:evaluateStartId},
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
//打开机构选择对话框
function showChooseOrgDialog(){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "请选择人员",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if(!canEidt()){
			    Public.errorTip("主表未保存，不能添加人员!");
				return;
			}
			var ids=[],_self=this;
			$.each(data,function(i,o){
				ids.push(o['id']);
			});
			var evaluateStartId=$('#evaluateStartId').val();
			var url=web_app.name + '/evaluateStartAction!saveEvaluateStartPerson.ajax';
			Public.ajax(url, {evaluateStartId:evaluateStartId,ids:$.toJSON(ids)}, function(data){
				gridManager.loadData();
				//执行保存操作
				_self.close();
			});
		}
	};
	OpmUtil.showSelectOrgDialog(options);
}

function queryPerson(obj){
	var param = $(obj).formToJSON();
	param['evaluateStartId']=$('#evaluateStartId').val();
	UICtrl.gridSearch(gridManager, param);
}
function reQueryPerson(obj){
	$(obj).formClean();
	var param = $(obj).formToJSON();
	param['evaluateStartId']=$('#evaluateStartId').val();
	UICtrl.gridSearch(gridManager, param);
}
function reloadPersonGrid(){
	gridManager.loadData();
}