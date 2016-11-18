var gridManager = null;
Public.tip.topDiff=10;
$(document).ready(function() {
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "序号", name: "sequence", width: 40, minWidth:30, type: "string", align: "center",frozen: true },	
		{ display: "文号", name: "dispatchNo", width: 160, minWidth: 60, type: "string", align: "left",frozen: true },		   
		{ display: "标题", name: "title", width: 300, minWidth: 60, type: "string", align: "left",
			render: function (item) {
				var bizId=item.bizId;
				if(Public.isBlank(bizId)){
					return ['<div title="',item.title,'">',item.title,'</div>'].join('');
				}else{
					return ['<a title="',item.title,'" class="GridStyle" href="javascript:openWindow(\'',item.bizUrl,'\',\'',item.title,'\',',item.bizId,',\'',item.fullId,'\');">',item.title,'</a>'].join('');
				}
			}
		},
		{ display: "状态", name: "statusTextView", width: 50, minWidth: 30, type: "string", align: "left",
			render: function (item) {
				var status=item.status,color='red';
				color=status==1?'green':'red';
				return ['<font color="',color,'">',item.statusTextView,'</font>'].join('');
			}
		},		   
		{ display: "单位", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "岗位", name: "positionName", width: 60, minWidth: 60, type: "string", align: "left" },		 
		{ display: "取号人", name: "personMemberName", width: 60, minWidth: 60, type: "string", align: "left" },	
		{ display: "创建时间", name: "createDate", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "文件存放处", name: "depositary", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "备注", name: "remark", width: 120, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/dispatchManagerAction!slicedQueryDispatchBillRelevance.ajax',
		parms:{dispatchKindId:$('#dispatchKindId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'dispatchBillRelevanceId',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	param['sequencegt']='';
	param['sequencelt']='';
	param['sequenceeq']='';
	var sequenceSymbol=param['sequenceSymbol'];
	if(sequenceSymbol!=''){
		var sequence=param['sequence'];
		if(sequence!=''){
			param['sequence'+sequenceSymbol]=sequence;
		}
	}
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

function openWindow(url,title,bizId,fullId){
	Public.authenticationManageType('dispatchViewManage',fullId,function(flag){
		if(flag){
			parent.parent.addTabItem({ tabid: 'dispatchBill'+bizId, text:title, url:web_app.name+'/'+url});
		}else{
			Public.errorTip('您没有查看权限!');
		}
	});
}

function getChooseRow(){
	var data = gridManager.getSelectedRow();
	if (!data) {Public.tip('请选择数据！'); return false; }
	var status=data.status;
	if(status==1){
		Public.errorTip('不能选择状态[正常]的文件!');
		return false;
	}
	return data;
}