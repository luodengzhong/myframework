var gridManager = null, refreshFlag = false;
var interviewTypeMap=null;
$(document).ready(function() {
	interviewTypeMap=$('#interviewType').combox('getJSONData');
	initializeGrid();
	$.getFormButton([{name:' 保 存  ',event:function(){
		save();
		}},{name:'发起面试',event:function(){
			sendInterView();
		}}]);
	
});
//初始化表格
function initializeGrid() {
	var writeId=$('#writeId').val();
	var queryFlag=$('#queryFlag').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		deleteHandler:function(){

			DataUtil.delSelectedRows({
				action : 'interviewApplyAction!delete.ajax',
				gridManager : gridManager,
				idFieldName : 'interviewApplyId',
				onSuccess : function() {
					gridManager.loadData();
				}
			});

		
		}
	});
	gridManager = UICtrl.grid('#detailMaingrid', {
		columns: [
		{ display: "面试官", name: "viewMemberName", width: 150, minWidth: 60, type: "string", align: "center" },
		{ display: "面试类型", name: "interviewType", width: 150, minWidth: 60, type: "string", align: "center",
		 editor: { type:'combobox',required: true,data:interviewTypeMap},
		 render: function (item) { 
				return interviewTypeMap[item.interviewType];
			}},
		{ display: "预约面试时间", name: "bookInterviewTime", width: 200, minWidth: 60, type: "string", align: "left",
			editor: { type:'dateTime',required: true}},	
		{ display: "预约面试地点", name: "bookInterviewPlace", width: 440, minWidth: 60, type: "string", align: "left",
			editor: { type:'text',required: true}}
		
		],
		dataAction : 'server',
		url: web_app.name+'/interviewApplyAction!slicedNullQuery.ajax',
		parms: {writeId:writeId,queryFlag:queryFlag},
		usePager: false,
		width : '100%',
		height : 280,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'staffName',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledEdit: true,
		  onLoadData :function(){
				return !($('#writeId').val()=='');
			}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
function sendInterView(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData) {
		detailData = '';
	}else {
		detailData = encodeURI($.toJSON(detailData));

	}
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/interviewApplyAction!sendInterView.ajax',
		param:{detailData:detailData},
		success : function() {
		UICtrl.closeAndReloadTabs("TaskCenter", null);
		}
	});
	
}

function save(){
   	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData) {
		detailData = '';
	}
	else {
		detailData = encodeURI($.toJSON(detailData));

	}
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/interviewApplyAction!updateTimeAndPlace.ajax',
		param:{detailData:detailData},
		success : function() {
			refreshFlag = true;
		}
	});
		

}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 




//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

