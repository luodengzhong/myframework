var gridManager = null, refreshFlag = false;
var infoFeedbackTemplateGridManager=null;
var dataTypeData={'text':'文本','number':'数值','date':'时间'};
var editStyleData={'text':'文本','number':'数值','date':'时间','radio':'单项选择','checkbox':'多项选择'};
var yesOrNo={'1':'是','0':'否'};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.initDefaulLayout();
	$('#maintree').commonTree({
		kindId : CommonTreeKind.InfoFeedbackTemplate,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.InfoFeedbackTemplate){
		parentId="";
		html.push('模板列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>模板列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{folderId:parentId});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		saveSortIDHandler: saveSortIDHandler,
		moveHandler:moveHandler,
		viewTemplate:{id:'viewTemplate',text:'预览',img:'page.gif',click:viewTemplate}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "模板编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   	   	   
		{ display: "模板名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },			   
		{ display: "备注", name: "remark", width: 350, minWidth: 60, type: "string", align: "left" },	   
		{ display: "序号", name: "sequence", width: 80, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.sequenceRender(item,'infoFeedbackTemplateId');
			}
		},		   
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/oaSetupAction!slicedQueryInfoFeedbackTemplate.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.infoFeedbackTemplateId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//添加按钮 
function addHandler() {
	var parentId=$('#treeParentId').val();
	if(parentId==''){
		Public.tip('请选择类别树！'); 
		return;
	}
	UICtrl.showAjaxDialog({
		title:'新增反馈模板',
		url: web_app.name + '/oaSetupAction!showInsertInfoFeedbackTemplate.load',
		width:750,
		init:initDetailPage,
		ok: save,
		close: dialogClose
	});
}

//编辑按钮
function updateHandler(infoFeedbackTemplateId){
	if(!infoFeedbackTemplateId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		infoFeedbackTemplateId=row.infoFeedbackTemplateId;
	}
	UICtrl.showAjaxDialog({
		title:'编辑反馈模板',
		url: web_app.name + '/oaSetupAction!showUpdateInfoFeedbackTemplate.load', 
		param:{infoFeedbackTemplateId:infoFeedbackTemplateId},
		width:750,
		init:initDetailPage,
		ok: save,
		close: dialogClose
	});
}
//预览
function viewTemplate(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var infoFeedbackTemplateId=row.infoFeedbackTemplateId;
	UICtrl.showAjaxDialog({
		title:'预览反馈模板',
		url: web_app.name + '/oaSetupAction!previewTemplate.load', 
		param:{infoFeedbackTemplateId:infoFeedbackTemplateId},
		width:350,
		height:300,
		init:function(){
			
		},
		ok: false
	});
}

function initDetailPage(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			UICtrl.addGridRow(infoFeedbackTemplateGridManager,{sequence:infoFeedbackTemplateGridManager.getData().length+1});
		}, 
		deleteHandler: function(){
			DataUtil.delSelectedRows({action:'oaSetupAction!deleteInfoFeedbackTemplateItem.ajax',
				gridManager:infoFeedbackTemplateGridManager,idFieldName:'infoTemplateItemId',
				onSuccess:function(){
					infoFeedbackTemplateGridManager.loadData();
				}
			});
		}
	});
	infoFeedbackTemplateGridManager = UICtrl.grid('#infoFeedbackTemplateItemGrid', {
		columns: [
		{ display: "名称", name: "itemName", width: 160, minWidth: 60, type: "string", align: "left",frozen: true,
			editor: { type: 'text',required:true,maxLength:100}
		},
		{ display: "排序号", name: "sequence", width: 40, minWidth: 40, type: "string", align: "left",
		     editor: { type:'spinner',min:1,max:100,mask:'nn',required: true}
		},
		{ display: "数据类型", name: "dataType", width:60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:dataTypeData,required: true},
			render: function (item) { 
				return dataTypeData[item.dataType];
			}
		},
		{ display: "显示类型", name: "editStyle", width:60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:editStyleData,required: true},
			render: function (item) { 
				return editStyleData[item.editStyle];
			}
		},
		{ display: "选择范围", name: "valueRange", width:190, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',maxLength:300}
		},
		{ display: "默认值", name: "defaultValue", width:60, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',maxLength:300}
		},
		{ display: "必填", name: "required", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:yesOrNo,required: true},
			render: function (item) { 
				return yesOrNo[item.required];
			}
		},
	    { display: "填写说明", name: "remark", width: 160, minWidth: 60, type: "string", align: "left",
			editor: { type: 'text',maxLength:100}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/oaSetupAction!slicedQueryInfoFeedbackTemplateItem.ajax',
		parms:{infoFeedbackTemplateId:$('#detailInfoFeedbackTemplateId').val(),pagesize:200},
		usePager: false,
		width :725,
		height : '100%',
		heightDiff : -60,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onLoadData :function(){
			return !($('#detailInfoFeedbackTemplateId').val()=='');
		}
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'oaSetupAction!deleteInfoFeedbackTemplate.ajax',
		gridManager:gridManager,idFieldName:'infoFeedbackTemplateId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//保存
function save() {
	var param={};
	if($('#detailInfoFeedbackTemplateId').val()==''){
		param['folderId']=$('#treeParentId').val();
	}
	var detailData = DataUtil.getGridData({gridManager: infoFeedbackTemplateGridManager});
	if(!detailData){
		return false;
	}
	param['detailData']=encodeURI($.toJSON(detailData))
	$('#submitForm').ajaxSubmit({url: web_app.name + '/oaSetupAction!saveInfoFeedbackTemplate.ajax',
		param:param,
		success : function(data) {
			$('#detailInfoFeedbackTemplateId').val(data);
			refreshFlag = true;
			infoFeedbackTemplateGridManager.options.parms['infoFeedbackTemplateId'] =data;
			infoFeedbackTemplateGridManager.loadData();
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "oaSetupAction!updateInfoFeedbackTemplateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'infoFeedbackTemplateId', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'oaSetupAction!updateInfoFeedbackTemplateStatus.ajax',
		gridManager: gridManager,idFieldName:'infoFeedbackTemplateId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'oaSetupAction!updateInfoFeedbackTemplateStatus.ajax',
		gridManager: gridManager,idFieldName:'infoFeedbackTemplateId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动类别',kindId:CommonTreeKind.InfoFeedbackTemplate,
		save:function(parentId){
			DataUtil.updateById({action:'oaSetupAction!updateInfoFeedbackTemplateFolderId.ajax',
				gridManager:gridManager,idFieldName:'infoFeedbackTemplateId',param:{folderId:parentId},
				onSuccess:function(){
					reloadGrid();	
				}
			});
		}
	});
}