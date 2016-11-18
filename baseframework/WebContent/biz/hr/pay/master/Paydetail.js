var gridManager = null;
$(document).ready(function() {
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var param={totalFields:'operationData'},field=['periodId','archivesId','operationCode','serialId'];
	$.each(field,function(i,o){
		param[o]=$('#'+o).val();
	});
	var isSimple=$('#isSimple').val();
	var columns=[{ display: "序号", name: "myRownum", width: 60, minWidth: 60, type: "string", align: "center" ,frozen: true,totalSummary:{
		render: function (suminf, column, data){
			return '合 计';
		},
		align: 'center'
	}}];
	if(isSimple!='true'){
		columns.push({ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" ,frozen: true});
		columns.push({ display: "中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true });
		columns.push({ display: "部门", name: "dptName", width: 80, minWidth: 60, type: "string", align: "left",frozen: true });
		columns.push({ display: "层级", name: "posTierTextView", width: 60, minWidth: 60, type: "string", align: "left",frozen: true });
		columns.push({ display: "行政级别", name: "posLevelTextView", width: 60, minWidth: 60, type: "string", align: "left",frozen: true });
		columns.push( { display: "姓名", name: "staffName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true,
	    	render: function (item){
	    		return '<a href="javascript:showArchiveInfo('+item.archivesId+');" class="GridStyle">' + item.staffName + '</a>';
			}
	    });
	}else{
		columns.push( { display: "姓名", name: "staffName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true});
	}
	columns.push({ display: "业务内容", name: "operationContent", width: 300, minWidth: 60, type: "string", align: "left",
    	render:function(item){
    		var operationUrl=item.operationUrl;
    		if(Public.isBlank(operationUrl)){
    			return item.operationContent;
    		}else{
    			return '<a href="javascript:showOperationBill(\''+operationUrl+'\','+item.archivesId+');" class="GridStyle">' + item.operationContent + '</a>';
    		}
			
		}
    });
	columns.push({ display: "业务数据", name: "operationData", width: 100, minWidth: 60, type: "money", align: "left" ,
    	totalSummary:UICtrl.getTotalSummary()
    });
	columns.push({ display: "创建日期", name: "createDate", width: 100, minWidth: 60, type: "string", align: "left" });
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/paymasterAction!slicedPaydetailQuery.ajax',
		parms:param,
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'createDate',
		sortOrder:'asc',
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}
function showOperationBill(opUrl,archivesId){
	var tabid='HRPayDetail'+$('#periodId').val()+'_'+archivesId;
	var url=web_app.name + opUrl;
	parent.parent.addTabItem({ tabid: tabid, text: '薪资业务单据', url:url});
}
function showArchiveInfo(archivesId){
	parent.showArchiveInfo(archivesId);
}