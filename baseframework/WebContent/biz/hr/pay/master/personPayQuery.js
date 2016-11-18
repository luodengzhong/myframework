var gridManager = null, refreshFlag = false;
var totalFields=[];
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	//浏览需要验证访问密码
	PersonalPasswordAuth.showScreenOver();
	PersonalPasswordAuth.showDialog({
		okFun:function(){
			this.close();
			PersonalPasswordAuth.hideScreenOver();
		}
	});
});

function initializeUI(){
	var columns=[
	    { display: "姓名", name: "archivesName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true,totalSummary:{
	    	render: function (suminf, column, data){
        		return '合 计:';
			},
			align: 'center'
	    }},
	    { display: "工资类别", name: "wageKindTextView", width: 120, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "发放期间", name: "periodName", width: 180, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "工资费用归属", name: "wageAffiliationTextView", width: 80, minWidth: 60, type: "string", align: "left",frozen: true }
	];
	Public.ajax(web_app.name + '/paymasterAction!queryPayItems.ajax', {}, function(data) {
		var totalSummary=null,payItemKind=null,render=null;
		var currCol = 0;
		$.each(data,function(i,o){
			totalSummary=null;
			if(parseInt(o.isTotal,10)==1){
				totalFields.push(o.name);
				totalSummary=UICtrl.getTotalSummary();
			}
			render=null;
			payItemKind=parseInt(o.payItemKind,10);
			if(payItemKind<5){
				render=function(item){
						return '<a href="javascript:showPayDetail('+item.periodId+','+item.archivesId+','+item.serialId+',\''+o.name+'\',\''+o.display+'\');" class="GridStyle">' + Public.currency(item[o.name]) + '</a>';
				};
			}
			columns.push({ 
				display: o.display, name: o.name,
				width: 100, minWidth: 60,
				type: "money", align: "right",
				render:render,totalSummary:totalSummary
			});
		});
		initializeGrid(columns);
	});
	$('#mainOrgName').orgTree({
		filter: 'ogn,dpt',
		manageType:'hRPayManage',
		param: {searchQueryCondition: "org_kind_id in('ogn','dpt')"},
		back:{
			text:'#mainOrgName',
			value:'#mainFullId',
			id:'#mainFullId',
			name:'#mainOrgName'
		}
	});
	$('#year').spinner({countWidth:80}).mask('nnnn');
}


//初始化表格
function initializeGrid(columns) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/paymasterAction!slicedQueryPaymasterPerson.ajax',
		parms:{passStatus:1,totalFields:totalFields.join(',')},
		manageType:'hRPayManage',
		delayLoad:true,
		pageSize : 20,
		width : '99.8%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		sortName:'sequence,archivesName,fillinDate',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	query($('#queryGridForm'));
}

//查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}
//重置表单
function resetForm(obj) {
	$(obj).formClean();
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//查看工资明细
function showPayDetail(periodId,archivesId,serialId,operationCode,display){
	UICtrl.showFrameDialog({
		title:'['+display+']详细',
		url: web_app.name + '/paymasterAction!forwardPaydetailList.do', 
		param:{periodId:periodId,archivesId:archivesId,operationCode:operationCode,serialId:serialId},
		height:320,
		width:getDefaultDialogWidth(),
		resize:true,
		ok:false,
		cancel:true
	});
}