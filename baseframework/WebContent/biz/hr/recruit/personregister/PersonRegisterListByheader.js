var gridManager = null, refreshFlag = false;
var recruitWay=null;
var work=null;
var dataSource={
		yesorno:{1:'是',0:'否'}
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	recruitWay=$('#recruitWay').combox('getJSONData');
	work=$('#choicePlace').combox('getJSONData');
	
});



//初始化表格
function initializeGrid() {
	var hunterId=$('#hunterId').val();
	var sourceType=$('#sourceType').val();
	var toolbarButton={};
	var columns=[];
	if(hunterId==''){
		
	}else{
		toolbarButton['addHandler']=addHandler;
		toolbarButton['updateHandler']=function(){updateHandler();};
		
		/*toolbarButton['importResumeHandler']={
				id:'importResume',text:'导入简历',img:'page_deny.gif',click:function(){
					importResume();
				}
			};*/
		columns=[
        { display: "应聘岗位名称", name: "applyPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
        { display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left",
	       render: function (item){
		    return '<a href="javascript:interviewRecord('+item.writeId+',\''+item.staffName+'\');" class="GridStyle">' + item.staffName + '</a>';
	     }},
		{ display: "填表日期", name: "registerDate", width: 100, minWidth: 60, type: "date", align: "left" },	
	     { display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "应聘结果", name: "recruitResultTextView", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "原因", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "到岗时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "left" },		   
			{ display: "婚姻状况", name: "maritalStatusTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "最高学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "技术职称", name: "jobTitle", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "身高(cm)", name: "height", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "毕业类型", name: "eduformTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "户口性质", name: "registeredKindTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "现家庭住址", name: "residence", width: 100, minWidth: 60, type: "string", align: "left" },		   
			{ display: "移动号码", name: "phoneNumber", width: 100, minWidth: 60, type: "string", align: "left" }
		         ];
	}
	var toolbarOptions = UICtrl.getDefaultToolbarOptions(
			toolbarButton);
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/personRegisterInnerAction!slicedQueryPersonRegister.ajax',
		parms:{hunterId:hunterId,sourceType:sourceType},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:true,
		sortName:'registerDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.writeId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}
function checkBox(workPlace){
	var workArray=[];
    $.each(workPlace.split(','),function(i,v){
    	workArray.push(work[v]||'');
    });
    return workArray.join(',');
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//添加按钮 
function addHandler() {
	var hunterId=$('#hunterId').val();
	var sourceType=$('#sourceType').val();
	if(sourceType==4){
	  window.open( web_app.name + '/personregisterAction!showInsertPersonRegister.do?hunterId='+hunterId+'&sourceType='+sourceType,'登记页面');
	}else{
	parent.addTabItem({ 
		tabid: 'HRPerRegAdd',
		text:'应聘人员登记',
		url: web_app.name + '/personregisterAction!showInsertPersonRegister.do?hunterId='+hunterId
		}); 
	}
}

//编辑按钮
function updateHandler(writeId){
	if(!writeId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		writeId=row.writeId;
	}
	var sourceType=$('#sourceType').val();
	if(sourceType==4){
		  window.open( web_app.name + '/personregisterAction!showUpdatePersonRegister.do?writeId=' 
					+ writeId,'修改简历详细');

	}else{
	parent.addTabItem({ 
		tabid: 'HRPerRegAdd'+writeId,
		text: '应聘人员登记 ',
		url: web_app.name + '/personregisterAction!showUpdatePersonRegister.do?writeId=' 
			+ writeId
		}); 
	}
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/personregisterAction!deletePersonRegister.ajax', 
				{writeId:row.writeId}, function(){
			reloadGrid();
		});
	});
}

//查看按钮

function viewHandler(){
}
//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updatePersonRegister.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//面试按钮  进入面试流程
function interview(){
	
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	 var writeId = row.writeId;
	 var  staffName=row.staffName;
	 
	 var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();

	 UICtrl.showFrameDialog({
			title : "选择面试官",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {
				insertInterviewApply(this,writeId,staffName);
			},
			close : dialogClose
		});
}

//将面试测评信息插入面试测评表中
function insertInterviewApply(_self,writeId,staffName){
	var data = _self.iframe.contentWindow.selectedData;
	if (!data)
		return;
	


/*	UICtrl.showAjaxDialog({url: web_app.name + '/interviewApplyAction!insert.load',
		param:{writeId:writeId,staffName:staffName,data:$.toJSON(data)}, 
		ok: insert,
		width:550,
		title:"新增面试信息",
		close: dialogClose});*/
	
	Public.ajax(web_app.name + "/interviewApplyAction!insert.load",
			{writeId:writeId,staffName:staffName,data:$.toJSON(data)}, function() {
				
				refreshFlag = true;
				_self.close();
				parent.addTabItem({ 
				tabid: 'HRInterViewAdd'+writeId,
				text:'修改面试测评',
				url: web_app.name + '/interviewApplyAction!showInsertDetailByWriteId.do?writeId=' 
					+ writeId
				}); 
			});
   

	
}
//录用按钮
function employ(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var writeId = row.writeId;
	parent.addTabItem({ 
		tabid: 'HREmployApply'+writeId,
		text: '新员工录用申请 ',
		url: web_app.name + '/employApplyAction!forwardBill.job?writeId=' 
			+ writeId
		}); 
}

//备选按钮
function waitEmploy(){
	DataUtil.updateById({ action: 'personregisterAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'writeId', param:{recruitResult:1},
		message:'确定备选吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
	
	
}

//淘汰按钮
function drop(){
	DataUtil.updateById({ action: 'personregisterAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'writeId', param:{recruitResult:-1},
		message:'确定淘汰吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//面试记录
function interviewRecord(writeId,name){
	
	UICtrl.showFrameDialog({
		title:'应聘者['+name+']的面试记录',
		url: web_app.name + '/interviewApplyAction!forwardListDetail.do', 
		param:{writeId:writeId},
		height:290,
		width:650,
		ok:false,
		cancel:true
	});
	
}


function turn(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var writeId=row.writeId;
	Public.ajax(web_app.name + '/employApplyAction!turnInfo.ajax',{writeId:writeId},function(){
		reloadGrid();
	});
	
}

function  posListHandler(){
		var hunterId=$('#hunterId').val();
	  window.open( web_app.name + '/personregisterAction!showHeadHunterPosListPage.do?hunterId='+hunterId,'岗位列表页面');

}

function importResume(){
	$('#upLoad').uploadButton();
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
