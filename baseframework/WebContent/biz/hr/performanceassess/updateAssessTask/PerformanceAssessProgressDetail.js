var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	$('#print,#print_line').hide();
	$('#save,#save_line').hide();
	$('#back,#back_line').hide();
	$('#abort,#abort_line').hide();
	$('#taskCollect,#taskCollect_line').hide();
	var index=$('#periodIndex').val();
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodIndex').combox({data:{}});
	var value =$('#periodCode').combox().val(); 
	setPriodIndex(value);	 
	$('#periodCode').combox({
			onChange:function(obj){
				var value = obj.value;
				setPriodIndex(value);
			}
	});

});

function setPriodIndex(value){
	if("month"==value){
		$('#periodIndex').combox('setData',{
			1:'1月',
			2:'2月',
			3:'3月',
			4:'4月',
			5:'5月',
			6:'6月',
			7:'7月',
			8:'8月',
			9:'9月',
			10:'10月',
			11:'11月',
			12:'12月'
		});
	}else if("quarter"==value){
		$('#periodIndex').combox('setData',{
			1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'
		});
	}else {
		$('#periodIndex').combox('setData',{});					
	}				
}
//初始化表格
function initializeGrid() {
	var progressId=$('#progressId').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		   addBatchHandler:addHandler,
	       deleteHandler: deleteHandler,
		   exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "assessPersonName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "编制类别", name: "staffingLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "人员状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left" }

		],
		dataAction : 'server',
		url: web_app.name+'/updateAssessTaskAction!slicedQueryAssessProgressDetail.ajax',
		parms : {
			progressId : progressId
		},
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'progressDetailId',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData : function() {
			return !($('#progressId').val() == '');
		},
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.progressDetailId);
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


function getExtendedData() {
	var extendedData = DataUtil.getGridData({
		gridManager : gridManager
	});
	if (!extendedData) {
		return false;
	}
	return {
		detailData : encodeURI($.toJSON(extendedData))
	};
}

function getId() {
   	return $("#progressId").val() || 0;
}
function save(){
	var extendedData=getExtendedData();
    var params = $.extend({},  extendedData);
	 $('#submitForm').ajaxSubmit({
        url: web_app.name + '/updateAssessTaskAction!save.ajax',
        param: params,
        success: function (data) {
        	    setId(data);
                reloadGrid();
        }
    });	
}


function  advance(){
	var extendedData=getExtendedData();
    var params = $.extend({},  extendedData);
	 $('#submitForm').ajaxSubmit({
        url: web_app.name + '/updateAssessTaskAction!advance.ajax',
        param: params,
        success: function (data) {
        	UICtrl.closeAndReloadTabs("TaskCenter", null);
        }
    });	
}
function setId(value){
	$("#progressId").val(value);
	gridManager.options.parms['progressId'] =value;
}
//添加按钮 
function addHandler() {
 $("#toolbar_menuAddBatch").comboDialog({type:'hr',name:'personArchiveSelect',width:635,
		dataIndex:'personId',
		checkbox:true,onChoose:function(){
			var rows=this.getSelectedRows();
			var addRows = [], addRow;
			$.each(rows, function(i, o){
				addRow = {};
				addRow["assessPersonId"]=o["personId"];
				addRow["assessPersonName"] = o["staffName"];
				addRow["ognName"] = o["ognName"];
				addRow["dptName"] = o["dptName"];
				addRow["posName"] = o["posName"];
				addRow["staffingLevel"] = o["staffingLevel"];
				addRow["state"] = o["state"];
				addRows.push(addRow);
			});
			gridManager.addRows(addRows);
			return true;
		}});
}



//删除按钮
function deleteHandler(){
	DataUtil.delSelectedRows({action:'updateAssessTaskAction!deleteAssessProgressDetail.ajax',
		gridManager:gridManager,idFieldName:'progressDetailId',
		onSuccess:function(){
			reloadGrid();
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
