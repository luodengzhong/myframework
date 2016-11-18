var gridManager = null,feedBackColumns=null;
$(document).ready(function() {
	getFeedBackItem();
});
//查询反馈栏目
function getFeedBackItem(){
	var infoPromulgateId=$('#infoPromulgateId').val();
	Public.ajax(web_app.name + '/oaInfoAction!getFeedBackItem.ajax', {infoPromulgateId:infoPromulgateId}, function(data){
		initFeedBackColumns(data);
		initializeGrid();
	});
}
function initFeedBackColumns(data){
	feedBackColumns=[
			{ display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
			{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" ,frozen: true},	
			{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
			{ display: "反馈人", name: "personName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },
			{ display: "反馈内容", name: "content", width: 180, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return ['<div title="',item.content,'">',item.content,'</div>'].join('');
				}
			},		
			{ display: "反馈时间", name: "feedbackTime", width: 130, minWidth: 60, type: "datetime", align: "left" }
	];
	$.each(data,function(i,o){
		var type=o.dataType;
		if(type!='data'){
			type='string';
		}
		var name='f'+(i+1);
		feedBackColumns.push({
			display:o.itemName, 
			name:name,
			width: 100, 
			minWidth: 60, 
			type: type, 
			align: "left",
			render: function (item) { 
				return ['<div title="',item[name],'">',item[name],'</div>'].join('');
			}
		});
	});
	var hasFeedBackAttachment=$('#hasFeedBackAttachment').val();
	if(hasFeedBackAttachment=='true'){
		feedBackColumns.push({
			display:'附件', 
			name:'attachment',
			width: 60, 
			minWidth: 60, 
			exportAble:false,
			type: 'string', 
			align: "center",
			render: function (item) {
				var personId=item.personId,infoPromulgateId=item.infoPromulgateId;
				var attachmentBizId=personId+'@'+infoPromulgateId;
				return ['<a href="##" class="GridStyle" onClick="showAttachmentByBizId(\'',attachmentBizId,'\')">查看</a>'].join('');
			}
		});
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		saveEvaluate:{id:'saveEvaluate',text:'重新统计',img:'page_refresh.gif',click:function(){
			Public.ajax(web_app.name + "/oaInfoAction!saveStatFeedBack.ajax",{infoPromulgateId:$('#infoPromulgateId').val()},function(){
				reloadGrid();
			});
		}},
		exportPdf:{id:'exportPdf',text:'导出PDF',img:'page_package.gif',click:function(){
			window.open(web_app.name + '/oaInfoAction!createFeedBackPdf.load?infoPromulgateId='+$("#infoPromulgateId").val());
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:getFeedBackColumns(),
		dataAction : 'server',
		url: web_app.name+'/oaInfoAction!slicedQueryFeedBackStat.ajax',
		parms:{infoPromulgateId:$('#infoPromulgateId').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		onSuccess:function(){
			var flag=$('#isNoFeedBack1').is(':checked');
			var columns=window[flag?'getNoFeedBackColumns':'getFeedBackColumns']();
			gridManager.set('columns', columns);
		},
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

function getFeedBackColumns(){
	return feedBackColumns;
}

function getNoFeedBackColumns(){
	var columns=[
		{ display: "公司", name: "organName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
		{ display: "部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" ,frozen: true},	
		{ display: "岗位", name: "positionName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
		{ display: "名称", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },	
		{ display: "人员类别", name: "kindIdTextView", width: 80, minWidth: 60, type: "string", align: "left"},		
		{ display: "人员路径", name: "fullName", width: 400, minWidth: 60, type: "string", align: "left" }
	];
	return columns;
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
//查看附件
function showAttachmentByBizId(bizId){
	var options={
			title:'附件查看',
			content:'<div id="feedBackAttachmentDiv"></div>',
			width: 350,
			opacity:0.1
	};
	Public.dialog(options);
	$("#feedBackAttachmentDiv").load(web_app.name+"/common/attachment.jsp", {bizCode:"feedBackPersonAttachment",bizId:bizId,isWrap:'false'},function(){
		$('#attachmentList').fileList({readOnly:true});
	});
}