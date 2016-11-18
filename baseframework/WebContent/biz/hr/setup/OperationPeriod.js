var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
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
	$('#year').spinner({countWidth:80}).mask('nnnn');
	changeOrgId();
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',fullName='';
	if(!data){
		html.push('业务处理期间');
	}else{
		organId=data.id,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>业务处理期间');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainOrganId').val(organId);
	changeOrgId();
	query('#queryMainForm');
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		saveHandler:saveHandler,
		addHandler: function(){
			UICtrl.addGridRow(gridManager,{year:$('#year').val()});
		}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "年", name: "year", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true}
			},		   
			{ display: "期间名称", name: "periodName", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type: 'text',required:true}
			},		   
			{ display: "开始日期", name: "periodBeginDate", width: 120, minWidth: 60, type: "string", align: "left",
				editor: { type: 'date',required:true}
			},		   
			{ display: "结束日期", name: "periodEndDate", width: 120, minWidth: 60, type: "string", align: "left",
				editor: { type: 'date',required:true}
			},
			{ display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "left",
				render: function (item) { 
					return UICtrl.getStatusInfo(item.status);
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/operationPeriodAction!slicedQuery.ajax',
		parms:{year:$('#year').val()},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'periodBeginDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		enabledEdit: true,
		checkbox:true,
		selectRowButtonOnly : true,
		autoAddRow:{status:0},
		onBeforeEdit:function(editParm){
			 return editParm.record['status']===0;
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
//查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 
function initPeriod(obj){
	var param = $(obj).formToJSON();
	Public.ajax(web_app.name + '/operationPeriodAction!saveInitPeriod.ajax',param, function(){
		query();
	});
}

function saveHandler(){
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0) return false;
	var organId=$('#mainOrganId').val();
	Public.ajax(web_app.name +'/operationPeriodAction!saveOperationPeriod.ajax',
		{
			organId:organId,
			detailData:encodeURI($.toJSON(detailData))
		},
		function(){
			reloadGrid();
		}
	);
}

function changeOrgId(){
	var organId=$('#mainOrganId').val();
	if(organId==''){
		$('#initMainPeriod').show();
		$('#updateOrgPeriod').hide();
	}else{
		$('#initMainPeriod').hide();
		$('#updateOrgPeriod').show();
	}
}
function showUpdateOrgPeriod(){
	var year=$('#year').val();
	var organId=$('#mainOrganId').val(); 
	var html=['<div class="ui-form" >'];
	html.push('<div style="text-align:center;">修改<b style="font-size:14px;color:red;">',year,'</b>年度期间</div>');
	html.push('<dl><dt style="width:80px">期间起日期<font color=red>*</font>&nbsp;:</dt><dd style="width:140px">');
	html.push('<input	 type="text" id="orgPeriodBeginDate" class="text" date="true"/>');
    html.push('</dd></dl>');
	html.push('</div>');
	UICtrl.showDialog({
		title:'批量修改期间日期',width:280,okVal:'确定',
		content:html.join(''),
		ok:function(){
			var orgPeriodBeginDate=$('#orgPeriodBeginDate').val();
			if(Public.isBlank(orgPeriodBeginDate)){
				Public.tip('请选择期间起日期！');
				return false;
			}
			var _self=this;
			var url=web_app.name + '/operationPeriodAction!updateOrgPeriodDate.ajax';
			Public.ajax(url, {organId:organId,year:year,orgPeriodBeginDate:orgPeriodBeginDate}, function(data){
				_self.close();
				reloadGrid();
			});
			return false;
		}
	});
}