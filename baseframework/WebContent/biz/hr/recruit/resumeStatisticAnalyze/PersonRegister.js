var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
});

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler
		//enableHandler: enableHandler,
		//disableHandler: disableHandler,
		//saveSortIDHandler: saveSortIDHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		   
		{ display: "应聘职位(岗位)ID", name: "applyPosId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘职位(岗位)名称", name: "applyPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "希望待遇（税前年收入）", name: "expecteSalary", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "性别", name: "sex", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "出生日期", name: "birthdate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年龄", name: "age", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "籍贯", name: "nativePlace", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "宗教信仰", name: "religion", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "民族", name: "nation", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "到岗时间", name: "employedDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "婚姻状况", name: "maritalStatus", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最高学历", name: "education", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "技术职称", name: "jobTitle", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "体重", name: "weight", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "身高（ｃｍ）", name: "height", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "血型", name: "blood", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "所学专业", name: "specialty", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "毕业学校", name: "university", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "毕业类型", name: "eduform", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "驾照类别", name: "driverLicense", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "政治面貌", name: "politicsStatus", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "户口所在地", name: "registeredPlace", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "户口性质", name: "registeredKind", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "现家庭住址", name: "residence", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "现住所性质", name: "residenceKind", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "移动号码", name: "phoneNumber", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "紧急联系人姓名", name: "linkman", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "紧急联系人电话号码", name: "otherPhoneNumber", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "英语程度", name: "englishLevel", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "业余爱好", name: "hobby", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "技术业务专长及业绩", name: "expertise", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "个人特长", name: "strength", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "首选工作地点", name: "workPlace", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "工作地点是否接受公司安排", name: "choice", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘来源(1,猎头招聘  2：社会招聘   3：内部推荐  4：校园招聘)", name: "sourceType", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "填表日期", name: "registerDate", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "电子邮箱", name: "email", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "办公电话", name: "workPhone", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "猎头ID", name: "hunterId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "编码", name: "vaCode", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘结果", name: "recruitResult", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "推荐人ID", name: "personMemberId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "推荐人姓名", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘部门ID", name: "applyDeptId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘部门名称", name: "applyDeptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘单位ID", name: "applyOrganId", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘单位名称", name: "applyOrganName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "是否是回流员工", name: "isBackflow", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "招聘ID", name: "jobApplyId", width: 100, minWidth: 60, type: "string", align: "left" },
		   {}
		],
		dataAction : 'server',
		url: web_app.name+'/resumeStatisticsAnalyzeAction!slicedQueryPersonRegister.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
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

//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/resumeStatisticsAnalyzeAction!showInsertPersonRegister.load', ok: insert, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	//所需参数需要自己提取 {id:row.id}
	UICtrl.showAjaxDialog({url: web_app.name + '/resumeStatisticsAnalyzeAction!showUpdatePersonRegister.load', param:{}, ok: update, close: dialogClose});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/resumeStatisticsAnalyzeAction!deletePersonRegister.ajax', {}, function(){
			reloadGrid();
		});
	});
	/*
	DataUtil.del({action:'resumeStatisticsAnalyzeAction!deletePersonRegister.ajax',
		gridManager:gridManager,idFieldName:'id',
		onCheck:function(data){
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});*/
}

//新增保存
function insert() {
	/*
	var id=$('#detailId').val();
	if(id!='') return update();
	*/
	$('#submitForm').ajaxSubmit({url: web_app.name + '/resumeStatisticsAnalyzeAction!insertPersonRegister.ajax',
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			//$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/resumeStatisticsAnalyzeAction!updatePersonRegister.ajax',
		success : function() {
			refreshFlag = true;
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
/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "resumeStatisticsAnalyzeAction!updatePersonRegisterSequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'resumeStatisticsAnalyzeAction!updatePersonRegisterStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'resumeStatisticsAnalyzeAction!updatePersonRegisterStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
