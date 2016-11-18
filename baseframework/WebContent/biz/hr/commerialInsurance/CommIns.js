var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "name", width: 100, minWidth: 60, type: "string", align: "left", frozen: true },		
		{ display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "性别", name: "sexTextView", width: 100, minWidth: 60, type: "string", align: "left"},
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "商业保险购买单位", name: "buyCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "保险公司", name: "insCompany", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "购买地点", name: "buyPlace", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "参保计划种类", name: "planType", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "家属姓名", name: "familyName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "参保金额标准", name: "ginsengStandard", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "保险生效日期", name: "effectiveDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "保险生效日期", name: "finishDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "参保状态", name: "insStatus", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "减少日期", name: "reduceTime", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "出险记录描述", name: "desption", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "备注", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" }
		 
		],
		dataAction : 'server',
		url: web_app.name+'/commInsAction!slicedQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'name',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.commInsId);
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
	UICtrl.showAjaxDialog({url: web_app.name + '/commInsAction!showInsert.load',
		title:"新增商业保险", 
		ok: insert, 
		init:initDialog,
		close: dialogClose});
}

function initDialog(){
	$('#name').searchbox({type:'hr',name:'personArchiveSelect',
		onChange:function(){
			var posId=$('#posId').val();
            if(posId!=''){
				var url=web_app.name+'/commInsAction!queryPosTier.ajax';
				Public.ajax(url,{posId:posId},function(data){
					$.each(data,function(p,o){
						if(p=='posTier'){
						$('#'+p).val(o).combox('setValue');
						}
					});
					
				});
				
			
            }
		},
		back:{archivesId:'#archivesId',staffName:'#name',posId:'#posId'}});
	var buyType=$('#buyType').val();
	$('#buyType').combox({onChange:function(){
		if(buyType==1){
			$('#familyName').hide();
		}else{
			$('#familyName').show();
		}
	}});
}

//编辑按钮
function updateHandler(commInsId){
	if(!commInsId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		commInsId=row.commInsId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/commInsAction!showUpdate.load', param:{commInsId:commInsId},
		title:"修改商业保险",
		ok: update, 
		close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/commInsAction!delete.ajax', {commInsId:row.commInsId}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'commInsAction!delete.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insert() {
	
	var id=$('#commInsId').val();
	if(id!='') return update();
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/commInsAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#commInsId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/commInsAction!update.ajax',
		success : function() {
			refreshFlag = true;
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
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "commInsAction!updateSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'commInsAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'commInsAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
