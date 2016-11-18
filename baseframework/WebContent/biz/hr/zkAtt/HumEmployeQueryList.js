var gridManager = null, refreshFlag = false,selectFunctionDialog=null;
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
		manageType:'hrBaseZKAtt',
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
    var options={
    	type:'zk',name:'chooseWebMachines',checkbox:true,
		dataIndex:'macSn',
		title:'考勤设备选择',
		onShow:function(){
			var data = gridManager.getSelectedRows();
			if (!data || data.length < 1) {
				Public.tip('请选择人员！');
				return false;
			}
			return true;
		},
		onChoose:function(){
			var rows=this.getSelectedRows();
			if (!rows || rows.length < 1) {
				Public.tip('请选择设备！');
				return false;
			}
			var machines=new Array();
			$.each(rows,function(i,o){
				machines.push(o['macSn']);
			});
		    var datas = gridManager.getSelectedRows();
		    var hums=new Array();
		    $.each(datas,function(i,o){
				hums.push(o['empNo']);
			});
			var url=web_app.name +this.options.dataUrl;
			UICtrl.confirm('您确定要执行该操作吗?', function() {
				Public.ajax(url,{machines:$.toJSON(machines),hums:$.toJSON(hums)});
			});
		    return true;
	   	}
    };
	$('#toolbar_menusyncToMachines').comboDialog($.extend({dataUrl:'/zkAttAction!syncToMachines.load'},options));
	$('#toolbar_menudelToMachines').comboDialog($.extend({dataUrl:'/zkAttAction!delToMachines.load'},options));
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',name='',fullId='';
	if(!data){
		html.push('外包人员信息');
	}else{
		organId=data.id,name=data.name,fullId=data.fullId;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>外包人员信息');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&organId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		syncToMachines:{id:'syncToMachines',text:'添加到设备',img:'page_tree.gif',click:function(){}},
		delToMachines:{id:'delToMachines',text:'删除设备上人员',img:'page_user_light.gif',click:function(){}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "人员编号", name: "empNo", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "人员名称", name: "empName", width: 100, minWidth: 60, type: "string", align: "left" },		 
		{ display: "身份证号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "备注", name: "remark", width: 300, minWidth: 60, type: "string", align: "left" },
		{ display: "外部单位名称", name: "otherOrgName", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "联系人", name: "linkMan", width: 150, minWidth: 60, type: "string", align: "left" },
		{ display: "联系方式", name: "linkInfo", width: 150, minWidth: 60, type: "string", align: "left" }
		],
		dataAction : 'server',
		url: web_app.name+'/zkAttAction!slicedQueryOtherHumEmployee.ajax',
		pageSize : 20,
		manageType:'hrBaseZKAtt',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'empNo',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		checkbox:true,
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


function managerAtt(otherOrgId,name){
	var url=web_app.name + '/zkAttAction!forwardListHumAttRecord.do?otherOrgId='+otherOrgId;
	parent.addTabItem({ tabid: 'zkAttRecord'+otherOrgId, text:"["+name+"]打卡记录", url:url});
}