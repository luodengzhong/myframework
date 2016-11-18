var gridManager = null, refreshFlag = false,performanceLevelData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	performanceLevelData=$('#mainPerformanceLevel').combox('getJSONData');
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	$('#toolbar_menuAdd').comboDialog({type:'hr',name:'personArchiveSelect',width:635,dataIndex:'archivesId',
		manageType:'hRPayManage',
		checkbox:true,onChoose:function(){
	    	var rows=this.getSelectedRows();
	    	var addRows = [], addRow;
	    	$.each(rows, function(i, o){
	    		addRow = $.extend({}, o);
	    		addRow["organId"] = o["ognId"];
	    		addRow["organName"] = o["ognName"];
	    		addRow["deptId"] = o["dptId"];
	    		addRow["deptName"] = o["dptName"];
	    		addRow["archivesName"] = o["staffName"];
	    		addRow["year"] = $('#year').val();
	    		addRow["periodId"] = $('#periodId').val();
	    		addRow["isChangePay"] = 0;
	    		addRows.push(addRow);
	    	});
	    	gridManager.addRows(addRows);
	    	return true;
    }});
    setTimeout(function(){UICtrl.setEditable('#queryDiv')},0);
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveEvaluate:{id:'saveEvaluate',text:'重新加载',img:'page_refresh.gif',click:function(){
			Public.ajax(web_app.name + "/payPerformanceAction!saveEvaluate.ajax",{performanceMainId:$('#performanceMainId').val()},function(){
				reloadGrid();
			});
		}},
		exportExcelHandler:{id:'exportExcelHandler',text:'导出',img:'page_down.gif',click:function(){
			UICtrl.gridExport(gridManager);
		}},
		saveHandler:saveHandler,
		addHandler: function(){}, 
		deleteHandler: deleteHandler,
		saveRecompute:{id:'saveRecompute',text:'重算',img:'page_refresh.gif',click:function(){
			Public.ajax(web_app.name + "/payPerformanceAction!saveRecompute.ajax",{performanceMainId:$('#performanceMainId').val()},function(){
				reloadGrid();
			});
		}},
		viewPayChange:{id:'viewPayChange',text:'查看薪酬变动',img:'page.gif',click:function(){
			var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			Public.ajax(web_app.name + '/hrSetupAction!queryFieldDefine.ajax', {id:488624}, function(data) {
				UICtrl.showDialog({title:'薪酬变动记录',width:700,
					content:'<div style="overflow: hidden;width:680;height:305px;"><div class="testClass"></div></div>',
					ok:false,
					init:function(doc){
						DetailUtil.getDetailGrid($('div.testClass',doc),data,{width:870,archivesId:row.archivesId,detailDefineId:488624});
					}
				});
			});
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		
		{ display: "中心名称", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "岗位名称", name: "posName", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "层级", name: "posTierTextView", width: 80, minWidth: 60, type: "string", align: "left" },		   
		{ display: "行政级别", name: "posLevelTextView", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "姓名", name: "archivesName", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "工资类别", name: "wageKindTextView", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "计算标准", name: "basisOfCalculation", width: 100, minWidth: 60, type: "money", align: "right",
			editor: { type:'text',required: true,mask:'money'}
		},		   
		{ display: "考核得分", name: "effectiveScore", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',mask:'nnn.nn'}
		},		   
		{ display: "考核等级", name: "effectiveRank", width: 60, minWidth: 60, type: "string", align: "left",
			editor: { type:'combobox',data:performanceLevelData},
			render: function (item) { 
		 		 return performanceLevelData[item.effectiveRank];
		    } 
		},		   
		{ display: "计算结果", name: "result", width: 100, minWidth: 60, type: "money", align: "right" },		   
		{ display: "绩效奖金", name: "performanceBonus", width: 100, minWidth: 60, type: "money", align: "right",
			editor: { type:'text',required: true,mask:'money'}
		},		   
		{ display: "说明", name: "remark", width: 200, minWidth: 60, type: "string", align: "left",
			editor: { type:'text'}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/payPerformanceAction!slicedQueryPayPerformanceDetail.ajax',
		parms:{performanceMainId:$('#performanceMainId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		checkbox:true,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
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


//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'payPerformanceAction!deletePayPerformanceDetail.ajax',
		gridManager: gridManager,idFieldName:'payPerformanceDetailId',
		onSuccess:function(){
			gridManager.loadData();
		}
	});
}
function saveHandler(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	Public.ajax(web_app.name + "/payPerformanceAction!savePayPerformanceDetail.ajax",
		{performanceMainId:$('#performanceMainId').val(),detailData:encodeURI($.toJSON(detailData))},
		function(){
			reloadGrid();
		}
	);
}