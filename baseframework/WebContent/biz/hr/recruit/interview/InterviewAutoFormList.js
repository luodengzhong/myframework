var gridManager = null, refreshFlag = false;
var recruitWay=null;
var interviewStatus=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	 initializeGrid();
	 initializeUI();
	 recruitWay=$('#recruitWay').combox('getJSONData');
	 interviewStatus=$('#interviewStatus').combox('getJSONData');
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrArchivesManage',
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('面试动态列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>面试动态列表');
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
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
	    { display: "应聘单位", name: "applyOrganName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "应聘部门", name: "applyDeptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "日期", name: "registerDate", width: 80, minWidth: 60, type: "string", align: "left"},	
		{ display: "姓名", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left"},	
		{ display: "性别", name: "sexTextView", width: 60, minWidth: 60, type: "string", align: "left" },	
		{ display: "应聘职位", name: "applyPosName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "毕业学校", name: "university", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "专业", name: "specialty", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "联系电话", name: "phoneNumber", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "原公司", name: "company", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "原职位", name: "job", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "初试官", name: "firstViewMember", width: 100, minWidth: 60, type: "string", align: "left" ,
		render: function (item) { 
				return '<div title="'+item.firstViewMember+'">'+item.firstViewMember+'</div>';
			}},		   
		{ display: "初试结果", name: "firstInterviewResult", width: 200, minWidth: 60, type: "string", align: "left",
		render: function (item) { 
				return '<div title="'+item.firstInterviewResult+'">'+item.firstInterviewResult+'</div>';
			}},	
	    { display: "复试官", name: "secondViewMember", width: 100, minWidth: 60, type: "string", align: "left" ,
		render: function (item) { 
				return '<div title="'+item.secondViewMember+'">'+item.secondViewMember+'</div>';
			}},		   
		{ display: "复试结果", name: "secondInterviewResult", width: 200, minWidth: 60, type: "string", align: "left",
		render: function (item) { 
				return '<div title="'+item.secondInterviewResult+'">'+item.secondInterviewResult+'</div>';
			}},		
	      { display: "终试官", name: "finalViewMember", width: 100, minWidth: 60, type: "string", align: "left" ,
		render: function (item) { 
				return '<div title="'+item.finalViewMember+'">'+item.finalViewMember+'</div>';
			}},		   
		{ display: "终试结果", name: "finalInterviewResult", width: 200, minWidth: 60, type: "string", align: "left",
		render: function (item) { 
				return '<div title="'+item.finalInterviewResult+'">'+item.finalInterviewResult+'</div>';
			}},
		{ display: "是否录用", name: "recruitResultTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "渠道", name: "sourceType", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:recruitWay},
				render: function (item){
					return recruitWay[item.sourceType];}
		},
		{ display: "猎头名称", name: "headhunterName", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "推荐人", name: "personMemberName", width: 100, minWidth: 60, type: "String", align: "left" },
		{ display: "面试评价详情", name: "bsicAssessment", width: 300, minWidth: 60, type: "string", align: "left",
		render: function (item) { 
				return '<div title="'+item.bsicAssessment+'">'+item.bsicAssessment+'</div>';
			}	}   
		],
		dataAction : 'server',
		url: web_app.name+'/interviewApplyAction!slicedAutoFormQuery.ajax',
		manageType:'hrArchivesManage',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'registerDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.interviewApplyId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
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



