var gridManager = null, refreshFlag = false,competeStatus=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
		competeStatus=$('#competeStatus').combox('getJSONData');
		initializeUI();
	initializeGrid();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseTalentsChosenData',
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
		html.push('员工列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>员工列表');
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
	var speechType=$('#speechType').val();
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		aduitHandler:{id:'aduit',text:'发起审核',img:'page_next.gif',click:function(){
			aduit();
		}},
		dropHandler:{id:'drop',text:'淘汰',img:'page_deny.gif',click:function(){
			drop();
		}},
		passHandler:{id:'pass',text:'通过',img:'page_extension.gif',click:function(){
			pass();
		}}
		
		
	});
	
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "填表时间", name: "fillinDate", width: 80, minWidth: 60, type: "string", align: "left" },	
		{ display: "就职演讲岗位", name: "chosenPosName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "就职演讲机构", name: "chosenOrganName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "就职演讲中心", name: "chosenCenterName", width: 120, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工姓名", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "competeStatus", width: 100, minWidth: 60, type: "string", align: "left",
		render:function(item){
				return competeStatus[item.competeStatus];
			}},		   
		{ display: "员工所属机构", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "员工所属中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "员工所属岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "性别", name: "sexTextView", width: 60, minWidth: 60, type: "string", align: "left" },		   
		{ display: "学历", name: "educationTextView", width: 70, minWidth: 60, type: "string", align: "left" },		   
		{ display: "大学", name: "campus", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "专业", name: "specialty", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "年龄", name: "age", width: 60, minWidth: 60, type: "string", align: "left" }		   
		   
		],
		dataAction : 'server',
		url: web_app.name+'/talentschosenapplyAction!slicedQueryTalentsChosenApply.ajax',
		pageSize : 20,
		parms:{speechType:speechType},
		manageType:'hrBaseTalentsChosenData',
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'asc',
		checkbox:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.chosenApplyId);
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


function addHandler(){
	
		UICtrl.showAjaxDialog({
		url: web_app.name + '/talentschosenapplyAction!showInsertTalentsChosenApply.load',
		ok: insertTalentsChsoenApply, 
		param:{speechType:2},
		init:initdialog,
		title:'新增就职演讲候选人员',
		width:850,
		close: dialogClose});
	
}

function initdialog(){
	 posNameSelect($('#chosenPosName'));
	     $('#staffName').searchbox({ type:"hr",name: "resignationChoosePerson",
			back:{
				ognId:"#ognId",ognName:"#ognName",centreId:"#centreId",sex:"#sex",birthdate:"#birthday",age:"#age",fullId:"#fullId",
				centreName:"#centreName",dptId:"#departmentId",dptName:"#departmentName",employedDate:"#employedDate",
				posId:"#posId",posName:"#posName",staffName:"#staffName",archivesId:"#archivesId",education:"#education",campus:'#campus',
				specialty:'#specialty',jobTitleName:'#jobTitleName'},
		onChange:function(){
			        	 $('#sex').combox('setValue');
			        	 $('#education').combox('setValue');
		 	          }
	 });
}

 function posNameSelect($el){
	$el.orgTree({filter:'pos',manageType:'noControlAuthority',
		searchName :'hrPosSelect',
		searchType :'hr',
		onChange:function(values,nodeData){
			if(this.mode=='tree'){
				Public.ajax(web_app.name + "/hrSetupAction!loadPosTier.ajax", {posId: $('#chosenPosId').val()}, function(data) {
					$.each(data,function(i,id){
						if(i=='posLevel'){
							$('#posLevel').val(id).combox('setValue');
						}
					});
				});
				$('#chosenOrganName').val(nodeData.orgName);
	        	$('#chosenOrganId').val(nodeData.orgId);
	        	$('#chosenDeptName').val(nodeData.deptName);
	        	$('#chosenDeptId').val(nodeData.deptId);
	        	$('#chosenCenterId').val(nodeData.centerId);
	        	$('#chosenCenterName').val(nodeData.centerName);
			}else{   
				$('#posLevel').combox('setValue');
			}
       	 
		},
		back:{
			text:$el,
			value:'#chosenPosId',
			id:'#chosenPosId',
			name:$el,
			posLevel:'#posLevel',
			orgName:'#chosenOrganName',
			orgId:'#chosenOrganId',
			centerId:'#chosenCenterId',
			centerName:'#chosenCenterName',
			deptName:'#chosenDeptName',
			deptId:'#chosenDeptId'
		}
	});
}
function dialogClose(){
	if (refreshFlag) {
		reloadGrid();
		refreshFlag = false;
	}
}

function  insertTalentsChsoenApply(){
	var  chosenApplyId=$('#chosenApplyId').val();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/talentschosenapplyAction!insertTalentsChosenApply.ajax',
		success : function(data) {
			$('#chosenApplyId').val(data);
			//  $('#talentsChosenApplyFileList').fileList({bizId:data});
			refreshFlag=true;
		}
	});
	
}
//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


function aduit(){
	
	 var chosenApplyIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'chosenApplyId' });
    if (!chosenApplyIds) return;
    var sts=DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'competeStatus' });
    	 var competePositionIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'competePositionId' });
    	 var chosenPosIds= DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'chosenPosId' });
    for(var i=0;i<sts.length;i++){
   		if(parseInt(sts[i])==1 ){
   			Public.tip('选中人员已发起报批,无需重复发起!');
   			return false;
   		}
    }
    
    
	$('#submitForm').ajaxSubmit({url: web_app.name + '/talentschosenapplyAction!insertCompeteCandidateAduit.ajax',
		param:{chosenApplyIds:$.toJSON(chosenApplyIds),chosenPosIds:$.toJSON(chosenPosIds),type:2},
		success : function(data) {
			refreshFlag = true;
			reloadGrid();
			UICtrl.closeAndReloadTabs("TaskCenter", null);
		}
	});
	


}


//编辑按钮
function updateHandler(chosenApplyId){
	if(!chosenApplyId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		chosenApplyId=row.chosenApplyId;
	}
	parent.addTabItem({ 
		tabid: 'HRTalentsChosenApply'+chosenApplyId,
		text: '修改就职演讲员工详情 ',
		url: web_app.name + '/talentschosenapplyAction!showUpdateTalentsChosenApply.do?chosenApplyId=' 
			+ chosenApplyId+'&speechType='+2
		}); 
}

function drop(){
	var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		chosenApplyId=row.chosenApplyId;
	UICtrl.confirm('确定该员工不参与竞聘演讲吗?',function(){
		Public.ajax(web_app.name + '/talentschosenapplyAction!updateChosenStatus.ajax', 
				{chosenApplyId:chosenApplyId,competeStatus:2}, function(){
			reloadGrid();
		});
	}); 	
		
}

function pass(){
	var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		chosenApplyId=row.chosenApplyId;
	UICtrl.confirm('确定该员工参与竞聘演讲吗?',function(){
		Public.ajax(web_app.name + '/talentschosenapplyAction!updateChosenStatus.ajax', 
				{chosenApplyId:chosenApplyId,competeStatus:3}, function(){
			reloadGrid();
		});
	}); 	
}

/*
//保存扩展字段排序号
function saveSortIDHandler(){
	var action = "talentschosenapplyAction!updateTalentsChosenApplySequence.ajax";
	DataUtil.updateSequence({action: action,gridManager: gridManager,idFieldName:'id', onSuccess: function(){
		reloadGrid(); 
	}});
	return false;
}

//启用
function enableHandler(){
	DataUtil.updateById({ action: 'talentschosenapplyAction!updateTalentsChosenApplyStatus.ajax',
		gridManager: gridManager,idFieldName:'id', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'talentschosenapplyAction!updateTalentsChosenApplyStatus.ajax',
		gridManager: gridManager,idFieldName:'id',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
*/
