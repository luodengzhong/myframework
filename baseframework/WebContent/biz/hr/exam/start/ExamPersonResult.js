var gridManager = null, manageType="hrExaminationManage";
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});
function initializeUI(){
	
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:manageType,
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('#examinationTypeName').searchbox({
		type: 'hr', name: 'examinationType',
		back: {
			examinationTypeId: '#examinationTypeId', 
			name:'#examinationTypeName'
		}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('考试结果列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>考试结果列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		viewTaskHandler:{id:'viewTask',text:'考试记录',img:'page_url.gif',click:function(){
			viewTaskHandler();
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "填表日期", name: "fillinDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "单据号码", name: "billCode", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "发起人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "考试类型", name: "examinationTypeName", width: 100, minWidth: 60, type: "string", align: "left" },
		    { display: "考试主题", name: "subject", width: 250, minWidth: 60, type: "string", align: "left" },
		    { display: "姓名", name: "personName", width: 100, minWidth: 60, type: "string", align: "left",
		    	render: function (item) { 
					return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+item.personName+"</font>";
				}
		    },	
			{ display: "人员路径", name: "personFullName", width: 300, minWidth: 60, type: "string", align: "left" },	
			{ display: "考试次数", name: "examCount", width: 80, minWidth: 60, type: "string", align: "left"},
			{ display: "是否合格", name: "isQualifiedTextView", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+(item.isQualifiedTextView?item.isQualifiedTextView:'')+"</font>";
				}
			},
			{ display: "最终分数", name: "finalScore", width: 80, minWidth: 60, type: "string", align: "left"},
			{ display: "开始考试时间", name: "examStartTime", width:100, minWidth: 60, type: "date", align: "left"},
			{ display: "完成考试时间", name: "examEndTime", width: 100, minWidth: 60, type: "date", align: "left"},
			{ display: "状态", name: "personStatusTextView", width: 80, minWidth: 60, type: "string", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/examStartAction!slicedQueryExamPersonResult.ajax',
		manageType:manageType,
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillin_date desc,exam_start_person_id asc',
		sortOrder:true,
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

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	onFolderTreeNodeClick();
}

function viewTaskHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var examStartPersonId=row.examStartPersonId;
	var html=['<div>','<div id="personExamTaskGrid"></div>','</div>'];
	UICtrl.showDialog({title:'考试记录',width:600,top:50,height:300,
		content:html.join(''),ok:false,
		init:function(){
		 	UICtrl.grid('#personExamTaskGrid', {
				columns: [
				    { display: "姓名", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left",
				    	render: function (item) { 
							return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+item.personMemberName+"</font>";
						}
				    },	
					{ display: "是否合格", name: "isQualifiedTextView", width: 80, minWidth: 60, type: "string", align: "left",
						render: function (item) { 
							return "<font color='"+(item.isQualified==1?'green':'red')+"'>"+(item.isQualifiedTextView?item.isQualifiedTextView:'')+"</font>";
						}
					},
					{ display: "最终分数", name: "finalScore", width: 80, minWidth: 60, type: "string", align: "left"},
					{ display: "开始考试时间", name: "examStartTime", width:100, minWidth: 60, type: "date", align: "left"},
					{ display: "完成考试时间", name: "examEndTime", width: 100, minWidth: 60, type: "date", align: "left"},
					{ display: "状态", name: "personStatusTextView", width: 80, minWidth: 60, type: "string", align: "left"},
					{ display: "查看", name: "personStatus", width: 80, minWidth: 60, type: "string", align: "left",
						render: function (item) { 
							var personStatus=item.personStatus;
							if(personStatus=='3'){
								return "<a href='javascript:forwardQuestionAnswerList("+item.examPersonTaskId+");' class='GridStyle'>查看</a>";
							}
							return "";
						}
					}
				],
				dataAction : 'server',
				url: web_app.name+'/examStartAction!slicedQueryExamPersonTask.ajax',
				parms:{examStartPersonId:examStartPersonId},
				manageType:manageType,
				pageSize : 20,
				width : '100%',
				height :280,
				heightDiff : -15,
				headerRowHeight : 25,
				rowHeight : 25,
				sortName:'examPersonTaskId',
				sortOrder:'desc',
				fixedCellHeight : true,
				selectRowButtonOnly : true
			});
		}
   });
}

function forwardQuestionAnswerList(examPersonTaskId){
	var url= web_app.name +'/examTaskAction!forwardQuestionAnswerList.do?examPersonTaskId='+examPersonTaskId;
	parent.addTabItem({ tabid: 'QuestionAnswerList'+examPersonTaskId, text: '查看个人考卷 ', url:url});
}