var gridManager = null, refreshFlag = false,payStatus;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#year').spinner({countWidth:80}).mask('nnnn');
	payStatus=$('#status').combox('getJSONData');
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		var year=$('#year');
		if(year.length>0){
			var y=year.val();
			if(y!=''){
				return {paramValue:y};
			}
		}
	},back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		updateHandler: function(){
			updateHandler();
		},
		/*deleteHandler: deleteHandler*/
		viewHandler:function(){
			viewHandler();
		},
		isusePay:{id:'isusePay',text:'发放工资',img:'page_dynamic.gif',click:isusePay}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [	   
		    { display: "单据号码", name: "billCode", width: 150, minWidth: 60, type: "string", align: "left" },
			{ display: "工资主体", name: "orgUnitName", width: 200, minWidth: 60, type: "string", align: "left" },	
			{ display: "人员类别", name: "payStaffTypeTextView", width: 80, minWidth: 60, type: "string", align: "left" },
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "业务年", name: "year", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "业务期间", name: "periodName", width: 250, minWidth: 60, type: "string", align: "left" },	
			{ display: "人员类别", name: "payStaffTypeTextView", width: 80, minWidth: 60, type: "string", align: "left" },
			{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) {
					return payStatus[item.status];
				} 
			}
		],
		dataAction : 'server',
		url: web_app.name+'/paymasterAction!slicedQuery.ajax',
		manageType:'hRPayManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		sortName:'fillinDate',
		sortOrder:'desc',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data);
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
function updateHandler(){
	var data = gridManager.getSelectedRow();
	if (!data) {Public.tip('请选择数据！'); return; }
	var status=data.status;
	if(status!=0){
		Public.tip('数据已提交不能编辑！');
		return;
	}
	var url=web_app.name + '/paymasterAction!showUpdate.job?bizId='+data.id;
	parent.addTabItem({ tabid: 'HRPayMaster'+data.id, text: '编辑工资表', url:url});
}
//查看按钮
function viewHandler(data){
	if(!data){
		data = gridManager.getSelectedRow();
		if (!data) {Public.tip('请选择数据！'); return; }
	}
	var url=web_app.name + '/paymasterAction!showUpdatePaymaster.job?bizId='+data.id+'&isReadOnly=true';
	parent.addTabItem({ tabid: 'HRPayMaster'+data.id, text: '查看工资表', url:url});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=0){
		Public.tip('数据已提交不能删除');
		return;
	}
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/paymasterAction!delete.ajax',{id:row.id}, function(){
			reloadGrid();
		});
	});
}
//工资发放
function isusePay(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	if(parseInt(row.status,10)!=3){
		Public.tip('只能发放审核通过的工资单!');
		return;
	}
	UICtrl.confirm('您确定发放['+row['periodName']+']工资吗?',function(){
		Public.ajax(web_app.name + '/paymasterAction!isUsePay.ajax',{id:row.id}, function(){
			reloadGrid();
		});
	});
}
