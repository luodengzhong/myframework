var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		addBatchHandler: function(){}, 
		addHandler: addHandler,
		deleteHandler: deleteHandler,
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		syncToMachines:{id:'syncToMachines',text:'添加到设备',img:'page_tree.gif',click:function(){}},
		delToMachines:{id:'delToMachines',text:'删除设备上人员',img:'page_user_light.gif',click:function(){}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "人员编号", name: "empNo", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人员名称", name: "empName", width: 100, minWidth: 60, type: "string", align: "left" },		 
		{ display: "身份证号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "报到日期", name: "checkindt", width: 100, minWidth: 60, type: "date", align: "left" },	
		{ display: "外部单位名称", name: "otherOrgName", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "备注", name: "remark", width: 300, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		parms:{otherOrgId:$('#mainOtherOrgId').val()},
		url: web_app.name+'/zkAttAction!slicedQueryHumEmployee.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'checkindt',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		checkbox:true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

function initializeUI(){
	$('#toolbar_menuAddBatch').comboDialog({type:'zk',name:'humEmployeeNoOther',
		dataIndex:'id',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [];
	    	$.each(rows, function(i, o){
	    		addRows.push(o['id']);
	    	});
	    	Public.ajax(web_app.name + "/zkAttAction!updateHumOtherOrgId.ajax",
	    		{otherOrgId:$('#mainOtherOrgId').val(),ids:$.toJSON(addRows)},
	    		function(){
	    			reloadGrid();
	    		}
	    	);
	    	return true;
    }});
    var options={
    	type:'zk',name:'chooseWebMachines',checkbox:true,
		dataIndex:'macSn',
		title:'考勤设备选择',
		onShow:function(){
			var data = gridManager.getSelectedRows();
			if (!data || data.length < 1) {
				Public.tip('请选择人员！');
				return false;
			}
			return true;
		},
		onChoose:function(){
			var rows=this.getSelectedRows();
			if (!rows || rows.length < 1) {
				Public.tip('请选择设备！');
				return false;
			}
			var machines=new Array();
			$.each(rows,function(i,o){
				machines.push(o['macSn']);
			});
		    var datas = gridManager.getSelectedRows();
		    var hums=new Array();
		    $.each(datas,function(i,o){
				hums.push(o['empNo']);
			});
			var url=web_app.name +this.options.dataUrl;
			UICtrl.confirm('您确定要执行该操作吗?', function() {
				Public.ajax(url,{machines:$.toJSON(machines),hums:$.toJSON(hums)});
			});
		    return true;
	   	}
    };
	$('#toolbar_menusyncToMachines').comboDialog($.extend({dataUrl:'/zkAttAction!syncToMachines.load'},options));
	$('#toolbar_menudelToMachines').comboDialog($.extend({dataUrl:'/zkAttAction!delToMachines.load'},options));
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
	UICtrl.showAjaxDialog({url: web_app.name + '/zkAttAction!showInsertHumEmployee.load', ok: save,width:300});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/zkAttAction!showUpdateHumEmployee.load', param:{id:id},width:300, ok: save});
}
//新增保存
function save() {
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/zkAttAction!saveHumEmployee.ajax',
		param:{otherOrgId:$('#mainOtherOrgId').val()},
		success : function(data) {
			_self.close();
			reloadGrid();
		}
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'zkAttAction!deleteHumEmployee.ajax',
		gridManager:gridManager,idFieldName:'id',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

