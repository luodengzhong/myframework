var gridManager = null, refreshFlag = false,detailFieldDefineGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		kindId : CommonTreeKind.HRDetailDefine,
		onClick : onFolderTreeNodeClick
	});
}
function onFolderTreeNodeClick(data,folderId) {
	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.HRDetailDefine){
		parentId="";
		html.push('子集列表');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>子集列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#treeParentId').val(folderId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
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
		moveHandler:moveHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "子集名称", name: "name", width: 200, minWidth: 60, type: "string", align: "left" },		   
			{ display: "子集编码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "允许编辑", name: "isUpdate", width: 60, minWidth: 60, type: "string", align: "left", 
				render: function (item) { 
					return "<div class='"+(item.isUpdate?"Yes":"No")+"'/>";
				} 
			},		   
			{ display: "允许新增", name: "isInsert", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return "<div class='"+(item.isInsert?"Yes":"No")+"'/>";
				} 
			},		   
			{ display: "允许删除", name: "isDelete", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return "<div class='"+(item.isDelete?"Yes":"No")+"'/>";
				} 
			},
			{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				}
			},
			{ display: "排序号", name: "sequence", width: 60, minWidth: 60, type: "string", align: "left" ,
				render : function(item) {
					return "<input type='text' mask='nnn' id='txtSequence_" +item.id+ "' class='textbox' value='" + item.sequence + "' />";
				}  
			}
		],
		dataAction : 'server',
		url: web_app.name+'/hrSetupAction!slicedQueryDetailDefine.ajax',
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
		checkbox:true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
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
	var url=web_app.name + '/hrSetupAction!showInsertDetailDefine.do?parentId='+parentId;
	parent.addTabItem({ tabid: 'showInsertDetailDefine', text: '新增子集 ', url:url});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	var url=web_app.name + '/hrSetupAction!showUpdateDetailDefine.do?id='+id;
	parent.addTabItem({ tabid: 'showInsertDetailDefine'+id, text: '编辑子集 ', url:url});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'hrSetupAction!deleteDetailDefine.ajax',
		gridManager:gridManager,
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip(data.name+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//移动
function moveHandler(){
	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动子集定义',kindId:CommonTreeKind.HRDetailDefine,
		save:function(parentId){
			DataUtil.updateById({action:'hrSetupAction!updateDetailDefineParentId.ajax',
				gridManager:gridManager,param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});
}

//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "hrSetupAction!updateDetailDefineSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager, onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}
//启用
function enableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateDetailDefineStatus.ajax',
		gridManager: gridManager, param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'hrSetupAction!updateDetailDefineStatus.ajax',
		gridManager: gridManager, param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
