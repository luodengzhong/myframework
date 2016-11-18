var gridManager = null, refreshFlag = false;
var  dataSource={
		cooperateStatus:{'10':'合作中','11':'考察中','12':'终止合作'},
		suggestCoopWay:{'10':'继续合作','11':'继续考察','12':'终止合作'}
};

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	$('#maincoStatus').combox({data:dataSource.cooperateStatus});
	$('#mainsuggestStatus').combox({data:dataSource.suggestCoopWay});

});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		saveSortIDHandler : saveSortIDHandler
		//enableHandler: enableHandler,
		//disableHandler: disableHandler,
		//saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{
							display : "排序号",
							name : "sequence",
							width : 60,
							minWidth : 60,
							type : "string",
							align : "left",
							render : function(item) {
								return "<input type='text' mask='nnn' id='txtSequence_"
										+ item.hunterId
										+ "' class='textbox' value='"
										+ item.sequence + "' />";
		}},
		{ display: "名称", name: "name", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "验证码", name: "code", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "总部所在地", name: "palce", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "合作状态", name: "cooperateStatus", width: 100, minWidth: 60, type: "string", align: "left",
			render:function(item){
				return dataSource.cooperateStatus[item.cooperateStatus];
			}},		   
		{ display: "费用（%）", name: "cost", width: 100, minWidth: 60, type: "string", align: "left",
				render:function(item){
					if(Public.isBlank(item.cost)) return'';
	    		 	return item.cost+'%';
				}},		   
		{ display: "特点", name: "characteristic", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "公司情况汇总", name: "companyDetail", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "代表客户", name: "importantPerson", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "起始时间", name: "beginTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "终止时间", name: "endTime", width: 100, minWidth: 60, type: "date", align: "left" },		   
		{ display: "建议合作方式", name: "suggestCoopWay", width: 100, minWidth: 60, type: "string", align: "left",
			render:function(item){
				return dataSource.suggestCoopWay[item.suggestCoopWay];
			}},		   
		{ display: "联系人", name: "contactPerson", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "联系号码", name: "contactTelephone", width: 100, minWidth: 60, type: "string", align: "left" }		   
		],
		dataAction : 'server',
		url: web_app.name+'/headhunterAction!slicedQuery.ajax',
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
// 保存扩展字段排序号
function saveSortIDHandler() {
	var action = "headhunterAction!updateSequence.ajax";
	DataUtil.updateSequence({
				action : action,
				gridManager : gridManager,
				idFieldName : 'hunterId',
				onSuccess : function() {
					reloadGrid();
				}
			});
	return false;
}
//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/headhunterAction!showInsert.load',
		title:"新增猎头信息",
		width:750,
		init:initdetail,
		ok: insert, close: dialogClose});
}
function initdetail(){
	$('#detailCoopStatus').combox({data:dataSource.cooperateStatus});
	$('#detailSuggestStatus').combox({data:dataSource.suggestCoopWay});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		hunterId=row.hunterId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/headhunterAction!showUpdate.load', 
		param:{hunterId:hunterId},
		title:"修改猎头信息",
		width:750,
		init:initdetail,
		ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/headhunterAction!delete.ajax', {hunterId:row.hunterId}, 
				function(){
			reloadGrid();
		});
	});
	
}

//新增保存
function insert() {
	var hunterId=$('#hunterId').val();
	if(hunterId!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/headhunterAction!insert.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#hunterId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/headhunterAction!update.ajax',
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
