var gridManager = null, refreshFlag = false;
var dataSource={
		status:{'1':'启用','-1':'禁用','0':'草稿'},
		yesOrNo:{1:'是',0:'否'}
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
	$('#status').combox({data:dataSource.status,checkbox:true}).combox('setValue','0,1');


});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseRecruitData',
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
		html.push('招聘岗位列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>招聘岗位列表');
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
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		enableHandler: enableHandler,
		disableHandler: disableHandler,
		assignHeadHunterHandler:{id:'assignHeadHunter',text:'指定猎头',img:'page_extension.gif',click:assignHeadHunter},
		addOuterOrgPosHandler:{id:'addOuterOrgPos',text:'外部单位招聘',img:'icon_home.gif',click:addOuterOrgPos}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "招聘岗位", name: "name", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item){
	    		return '<a href="javascript:viewHeadHunter('+item.jobPosId+',\''+item.name+'\');" class="GridStyle">' + item.name + '</a>';
			}},	
		{ display: "招聘部门", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "招聘单位", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "招聘人数", name: "recNumber", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			} },	
		{ display: "官网是否可见", name: "isSocialRecruit", width: 90, minWidth: 60, type: "string", align: "left",
			render:function(item){
		    return dataSource.yesOrNo[item.isSocialRecruit];
		    }
		},	
		{ display: "猎头是否可见", name: "isHeadhunter", width: 90, minWidth: 60, type: "string", align: "left",
			render:function(item){
		    return dataSource.yesOrNo[item.isHeadhunter];
		      }
		},		   
		{ display: "是否内推", name: "isInterRecommend", width: 90, minWidth: 60, type: "string", align: "left",
					 render:function(item){
						 return dataSource.yesOrNo[item.isInterRecommend];
					 }},		   
		{ display: "说明", name: "desption", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "创建时间", name: "createDate", width: 100, minWidth: 60, type: "date", align: "left" }

		],
		dataAction : 'server',
		url: web_app.name+'/recruitPositionAction!slicedQuery.ajax',
		manageType:'hrBaseRecruitData',
		parms:{status:'0,1'},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'createDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.jobPosId,data.isOuterOrgPos);
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

function  assignHeadHunter(){
	 var jobPosIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'jobPosId' });
	    if (!jobPosIds) return;
	  var isHeadhunters=DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'isHeadhunter' });
	    for(var i=0;i<isHeadhunters.length;i++){
	   		if(parseInt(isHeadhunters[i])!=1 ){
	   			Public.tip('请将选择的数据改为猎头可见状态!');
	   			return false;
	   		}
	    }
	    $("#toolbar_menuassignHeadHunter").comboDialog({type:'hr',name:'headHunterSelect',
	      width:600,
	      height:600,
	    dataIndex:'hunterId',
			title:'请选择猎头',
			checkbox:true,
			onChoose:function(){
				var rows=this.getSelectedRows();
				if(!rows.length){
		    		Public.tip('请选择猎头!');
		    		return false;
		    	}
				Public.ajax(web_app.name+'/recruitPositionAction!assignHeadHunter.ajax',
			    		{jobPosIds:$.toJSON(jobPosIds),headHunterDatas:$.toJSON(rows)}
			    	);
			    	return true;	
			}});    
	    
}


//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/recruitPositionAction!showInsert.load', 
		ok: insert, 
		param:{isOuterOrgPos:0}, 
		width:500,
		title:"新增招聘岗位",
		init:initDialog,
		close: dialogClose});
}

//addOuterOrgPos
function addOuterOrgPos(){
	UICtrl.showAjaxDialog({url: web_app.name + '/recruitPositionAction!showInsert.load', 
		ok: insert, 
		param:{isOuterOrgPos:1}, 
		width:500,
		title:"新增外部单位招聘岗位(单位、部门、岗位手动输入)",
		close: dialogClose});
}
function initDialog(){
     
    $('#organName').orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
    	manageType:'hrBaseRecruitData',
    	onChange:function(){
    		$('#deptId').val('');
    		$('#deptName').val('');
    		$('#recPosId').val('');
    		$('#name').val('');
		},
		back:{
			text:'#organName',
			value:'#organId',
			id:'#organId',
			name:'#organName'
		}
	});
    
    
    $('#deptName').orgTree({filter:'dpt',
		getParam:function(){
			var ognId=$('#organId').val();
			var mode=this.mode;
			if(mode=='tree'){//更改树的根节点
				return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			}else{
				var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
				if(ognId!=''){//增加根查询参数
					condition.push(" and full_id like '/"+ognId+"%'");
				}
				param['searchQueryCondition']=condition.join('');
				return param;
			}
		},
		manageType:'hrBaseRecruitData',
		back:{
			text:'#deptName',
			value:'#deptId',
			id:'#deptId',
			name:'#deptName'
		}
	});
    
    var $el=$('#name');
	$el.orgTree({filter:'pos',
		getParam:function(){
			var ognId=$('#organId').val(),
				dptId=$('#deptId').val(),
				root='orgRoot';
			if(ognId!=''){
				root=ognId;
			}
			if(dptId!=''){
				root=dptId;
			}
		  return {a:1,b:1,orgRoot:root,searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"};
		},
		
		back:{
			text:$el,
			value:'#recPosId',
			id:'#recPosId'
		}
	});
  
    
}
//编辑按钮
function updateHandler(jobPosId,isOuterOrgPos){
	if(!jobPosId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		jobPosId=row.jobPosId;
	    isOuterOrgPos=row.isOuterOrgPos;
	}
	if(isOuterOrgPos==1){
	  UICtrl.showAjaxDialog({url: web_app.name + '/recruitPositionAction!showUpdate.load', 
		param:{jobPosId:jobPosId}, 
		width:500,
		title:"修改外部单位招聘岗位",
		ok: update, 
		close: dialogClose});
		}else{
	 UICtrl.showAjaxDialog({url: web_app.name + '/recruitPositionAction!showUpdate.load', 
		param:{jobPosId:jobPosId}, 
		width:500,
		title:"修改招聘岗位",
		ok: update, 
		init:initDialog,
		close: dialogClose});
	}
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'recruitPositionAction!delete.ajax',
		gridManager:gridManager,idFieldName:'jobPosId',
		onCheck:function(data){
			if(parseInt(data.status)!=0){
				Public.tip('招聘岗位名称'+data.name+'不是草稿状态,不能删除!');
				return false;
			}
		},
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	
	var jobPosId=$('#jobPosId').val();
	if(jobPosId!='') return update();
	
	$('#submitForm').ajaxSubmit({url: web_app.name + '/recruitPositionAction!insert.ajax',
		param:{parentId:$('#treeParentId').val()},
		success : function(data) {
			//如果不关闭对话框这里需要对主键赋值
			$('#jobPosId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/recruitPositionAction!update.ajax',
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

function viewHeadHunter(jobPosId,name){
	
	UICtrl.showFrameDialog({
		title:'招聘岗位['+name+']所指定的猎头',
		url: web_app.name + '/recruitPositionAction!forwardHeadHunterPoslList.do', 
		param:{jobPosId:jobPosId},
		height:290,
		width:650,
		ok:false,
		cancel:true
	});
	
}
//启用
function enableHandler(){
	DataUtil.updateById({ action: 'recruitPositionAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'jobPosId', param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'recruitPositionAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'jobPosId',param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
