var gridManager = null, refreshFlag = false,extendedFieldGridManager=null;

var dialogButton = [{
	id : 'addExtendedField',
	name : '添加字段'
}, {
	id : 'deleteExtendedField',
	name : '删除字段',
	callback :deleteExtendedField
}, {
	id : 'updateExtendedFieldSequence',
	name : '保存排序号',
	callback : updateExtendedFieldSequence
},{
	id : 'previewGroup',
	name : '预览',
	callback : previewGroup
}];

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		kindId : CommonTreeKind.ExtendedFieldGroup,
		onClick : onFolderTreeNodeClick
	});
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		saveSortIDHandler: saveSortIDHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		 columns: [
			{ display: "分组编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "分组名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "业务编码", name: "businessCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "是否显示", name: "visible", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) {
					return "<div class='"+(item.visible?"Yes":"No")+"'/>";
				} 
			},
			{ display: "列数", name: "cols", width: 100, minWidth: 60, type: "string", align: "left" },		
			{ display: "显示模式", name: "showModel", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) {
					return item.showModel==1?'表格':'DIV';
				} 
			},
			{ display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left" ,
				render : function(item) {
					return "<input type='text' mask='nnn' id='txtSequence_" +item.groupId+ "' class='textbox' value='" + item.sequence + "' />";
				}  
			},
			{ display: "备注", name: "remark", width: 250, minWidth: 60, type: "string", align: "left" }	
		],
		dataAction : 'server',
		url: web_app.name+'/extendedFieldAction!slicedQueryExtendedFieldGroup.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'sequence',
		sortOrder:'asc',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		checkbox: true,
		fixedCellHeight: true,
		selectRowButtonOnly: true, 
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.groupId);
		},
		onAfterShowData:function(){
			UICtrl.autoInitializeGridUI('#maingrid');
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.ExtendedFieldGroup){
		parentId="";
		html.push('扩展属性分组');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>扩展属性分组');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
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
		title:'新增分组',
		url: web_app.name + '/extendedFieldAction!appendExtendedFieldGroup.load',
		width:900, 
		init:initDialog, 
		ok: insert,
		close: dialogClose,
		button:dialogButton.concat([])
	});
}

//编辑按钮
function updateHandler(groupId){
	if(!groupId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		groupId=row.groupId;
	}
	UICtrl.showAjaxDialog({
		title:'编辑分组',
		url: web_app.name + '/extendedFieldAction!loadExtendedFieldGroup.load', 
		param:{groupId:groupId},
		width:900, 
		init:initDialog,
		ok: update, 
		close: dialogClose,
		button:dialogButton.concat([])
	});
}

function initDialog(doc){
	var groupId=$('#groupId').length>0?$('#groupId').val():'';
	if(groupId ==''){//新增隐藏明细操作按钮
		$.each(dialogButton,function(i,o){
			$('#'+o.id).hide();
		});
	}
	//添加字段增加事件
	$('#addExtendedField').comboDialog({type:'sys',name:'extendedFieldDefine',lock:false,checkbox:true,
		dataIndex:'defineId',
		columnRender:{
			readOnly:function (item) {return "<div class='"+(item.readOnly?"Yes":"No")+"'/>";},
			visible:function (item) {return "<div class='"+(item.visible?"Yes":"No")+"'/>";} 
		},
		onChoose:function(dialog){
	    	var rows=this.getSelectedRows(),defineIds=[];
	    	if(!rows.length){
	    		Public.tip('请选择扩展字段!');
	    		return;
	    	}
	    	$.each(rows,function(i,o){defineIds.push(o.defineId);});
	    	Public.ajax(web_app.name+'/extendedFieldAction!insertExtendedField.ajax',
	    		{groupId:$('#groupId').val(),defineIds:defineIds.join(',')},
	    		function(){
	    			extendedFieldGridManager.loadData();
	    			dialog.close();
	    		}
	    	);
	    	return false;
		}
	});
	extendedFieldGridManager=UICtrl.grid('#extendedFieldGrid', {
		 columns: [
			{ display: "字段英文名称", name: "fieldEname", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "字段中文名称", name: "fieldCname", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "是否只读", name: "readOnly", width: 100, minWidth: 60, type: "string", align: "left", 
				render: function (item) {
					return "<div class='"+(item.readOnly?"Yes":"No")+"'/>";
				} 
			},
			{ display: "是否显示", name: "visible", width: 100, minWidth: 60, type: "string", align: "left", 
				render: function (item) {
					return "<div class='"+(item.visible?"Yes":"No")+"'/>";
				} 
			},
			{ display: "排序号", name: "sequence", width: 100, minWidth: 60, type: "string", align: "left",
				render : function(item) {
					return "<input type='text' mask='nnn' id='txtSequence_" +item.extendedFieldId+ "' class='textbox' value='" + item.sequence + "' />";
				} 
			}
		],
		dataAction : 'server',
		url: web_app.name+'/extendedFieldAction!slicedQueryExtendedField.ajax',
		parms:{groupId:groupId},
		pageSize : 10,
		width : 856,
		sortName:'sequence',
		sortOrder:'asc',
		height : '100%',
		heightDiff : -50,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox: true,
		fixedCellHeight: true,
		selectRowButtonOnly: true,
		onAfterShowData:function(){
			UICtrl.autoInitializeGridUI('#extendedFieldGrid');
		},
		onLoadData :function(){
			return !($('#groupId').val()=='');
		}
	});
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'extendedFieldAction!deleteExtendedFieldGroup.ajax',
		gridManager:gridManager,idFieldName:'groupId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var groupId=$('#groupId').val();
	if(groupId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/extendedFieldAction!insertExtendedFieldGroup.ajax',
		param:{parentId:$('#treeParentId').val()},
		success : function(data) {
			$('#groupId').val(data);
			extendedFieldGridManager.options.parms['groupId']=data;
			$.each(dialogButton,function(i,o){
				$('#'+o.id).show();
			});
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/extendedFieldAction!updateExtendedFieldGroup.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag = false;
	}
}
//保存排序号
function saveSortIDHandler(){
	var action = "extendedFieldAction!updateExtendedFieldGroupSequence.ajax";
	DataUtil.updateSequence({action: action,idFieldName:'groupId',gridManager: gridManager, onSuccess: function(){
		reloadGrid();
	}});
}

//移动
function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动到...',kindId:CommonTreeKind.ExtendedFieldGroup,
		save:function(parentId){
			DataUtil.updateById({action:'extendedFieldAction!moveExtendedFieldGroup.ajax',
				gridManager:gridManager,idFieldName:'groupId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
}

//删除扩展字段
function deleteExtendedField(){
	DataUtil.del({action:'extendedFieldAction!deleteExtendedField.ajax',
		param:{groupId:$('#groupId').val()},
		gridManager:extendedFieldGridManager,idFieldName:'extendedFieldId',
		onSuccess:function(){
			extendedFieldGridManager.loadData();  
		}
	});
	return false;
}
//保存扩展字段排序号
function updateExtendedFieldSequence(){
	var action = "extendedFieldAction!updateExtendedFieldSequence.ajax";
	DataUtil.updateSequence({action: action,idFieldName:'extendedFieldId',gridManager: extendedFieldGridManager, onSuccess: function(){
		extendedFieldGridManager.loadData();  
	}});
	return false;
}
//预览
function previewGroup(){
	var businessCode=$('#detilBusinessCode').val();
	UICtrl.showDialog({title:'预览'+businessCode,width:600,
		content:'<div style="overflow:auto;width:580px;height:250px;position: relative;"><div id="previewGroupDiv"></div></div>',
		init:function(){
			$('#previewGroupDiv').extendedField({businessCode:businessCode});
		},
		lock:false,
		ok:function(){
			var values=$('#previewGroupDiv').extendedField('getExtendedFieldValue',false);
			alert($.toJSON(values));
		}
	});
	return false;
}