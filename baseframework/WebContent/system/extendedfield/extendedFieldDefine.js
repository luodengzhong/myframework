var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		kindId : CommonTreeKind.ExtendedFieldDefine,
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
		copyHandler: copyHandler,
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		 columns: [
			{ display: "字段英文名称", name: "fieldEname", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "字段中文名称", name: "fieldCname", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "字段类型", name: "fieldType", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return getFieldType(item.fieldType); 
				}
			},
			{ display: "字段长度", name: "fieldLength", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "字段精度", name: "fieldPrecision", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "控件类型", name: "controlType", width: 100, minWidth: 60, type: "string", align: "left", 
				render: function (item) { 
					return getControlType(item.controlType); 
				} 
			},
			{ display: "是否允许为空", name: "nullable", width: 100, minWidth: 60, type: "string", align: "left", 
				render: function (item) { 
					return "<div class='"+(item.nullable?"Yes":"No")+"'/>";
				} 
			},
			{ display: "是否只读", name: "readOnly", width: 100, minWidth: 60, type: "string", align: "left", 
				render: function (item) {
					return "<div class='"+(item.readOnly?"Yes":"No")+"'/>";
				} 
			},
			{ display: "是否显示", name: "visible", width: 100, minWidth: 60, type: "string", align: "left", 
				render: function (item) {
					return "<div class='"+(item.visible?"Yes":"No")+"'/>";
				} 
			}
		],
		dataAction : 'server',
		url: web_app.name+'/extendedFieldAction!slicedQueryExtendedFieldDefine.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		checkbox: true,
		fixedCellHeight: true,
		selectRowButtonOnly: true, 
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.defineId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.ExtendedFieldDefine){
		parentId="";
		html.push('扩展字段列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>扩展字段列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}
}
//获取字段类型
function getFieldType(fieldType) {
    switch (parseInt(fieldType)) {
        case 1:
            return "string";
            break;
        case 2:
            return "number";
            break;
        case 3:
            return "date";
            break;
        case 4:
            return "datetime";
            break;
        case 5:
            return "bool";
            break;
        default:
            return "string";
            break;
    }
}
//获取控件类型
function getControlType(controlType) {
    switch (parseInt(controlType)) {
        case 1:
            return "textbox";
            break;
        case 2:
            return "combobox";
            break;
        case 3:
            return "spinner";
            break;
        case 4:
            return "date";
            break;
        case 5:
            return "datetime";
            break;
        case 6:
            return "radio";
            break;
        case 7:
            return "checkbox";
            break;
        case 8:
            return "select";
            break;
        case 9:
            return "lookUp";
            break;
        case 10:
            return "treebox";
            break;
        default:
            return "textbox";
            break;
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
	UICtrl.showAjaxDialog({title:'新增扩展字段',url: web_app.name + '/extendedFieldAction!appendExtendedFieldDefine.load',width:880, init:initDialog, ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(defineId){
	if(!defineId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		defineId=row.defineId;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({title:'编辑扩展字段',url: web_app.name + '/extendedFieldAction!loadExtendedFieldDefine.load',width:880, param:{defineId:defineId}, init:initDialog,ok: update, close: dialogClose});
}

function initDialog(doc){
	var controlType=$('#editControlType').val();
	if(controlType==2||controlType==6||controlType==7){
		$('#editDataSourceKind').combox('enable');
	}
	$('#editControlType').combox({onChange:function(v){
		if(v.value==2||v.value==6||v.value==7){
			$('#editDataSourceKind').combox('enable');
		}else{
			$('#editDataSourceKind').combox('setValue','1');
			$('#editDataSourceKind').combox('disable');
		}
		if(v.value==8||v.value==9||v.value==10){
			$('#editDataSourceKind').combox('setValue','4');
		}
	}});
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'extendedFieldAction!deleteExtendedFieldDefine.ajax',
		gridManager:gridManager,idFieldName:'defineId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var defineId=$('#defineId').val();
	if(defineId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/extendedFieldAction!insertExtendedFieldDefine.ajax',
		param:{parentId:$('#treeParentId').val()},
		success : function(data) {
			$('#defineId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/extendedFieldAction!updateExtendedFieldDefine.ajax',
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
//复制新增
function copyHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({
		title:'编辑扩展字段',url: web_app.name + '/extendedFieldAction!loadExtendedFieldDefine.load', 
		param:{defineId:row.defineId},
		init:function(doc){
			$('#defineId').val('');
			initDialog(doc);
		},
		ok: insert, 
		close: dialogClose
	});
}

//移动
function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动扩展字段',kindId:CommonTreeKind.ExtendedFieldDefine,
		save:function(parentId){
			DataUtil.updateById({action:'extendedFieldAction!moveExtendedFieldDefine.ajax',
				gridManager:gridManager,idFieldName:'defineId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
}
