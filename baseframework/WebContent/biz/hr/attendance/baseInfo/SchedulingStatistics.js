var gridManager = null, refreshFlag = false,selectOrgDialog=null,overtimeSettlements=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	$('#personName').searchbox({ type:"hr", name: "queryAllArchiveSelect",manageType:'hrBaseAttManage',
		back:{
                 staffName:"#personName",personId:"#personId"
		}
	});
	initializeUI();
	initializeGrid();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseAttManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
}

function onFolderTreeNodeClick(data) {
	var html=[];
	if(!data){
		html.push('排班统计');
	}else{
		$('#schOrgId').val(data.id);
		html.push('<font style="color:Tomato;font-size:13px;">[',data.fullName,']</font>'+'排班统计');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
}

function reloadGrid() {
	gridManager.loadData();
} 

function query(obj) {
	if(getSchOrgId()==''){
		Public.tip('请选择机构!');	
		return;
	}
	var param = $(obj).formToJSON();
	if(!param) return;
	if(!Public.compareDate(param['endDate'],param['startDate'])){
		Public.tip("开始日期不能大于结束日期!");
		return false;
	}
	initGridData(param);
}

function getSchOrgId(){
	return $('#schOrgId').val();
}

var defaultcols = [{display: "单位名称", name: "orgName", type: "text", width: 146, align: "center",frozen: true},
		         {display: "姓名", name: "name", type: "text", width: 146, align: "center",frozen: true},
		         {display: "排班总计", name: "total", type: "int", width: 100, align: "center"},
		         {display: "休假总计", name: "xjtotal", type: "int", width: 100, align: "center"}];
function initializeGrid(){
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		exportExcelHandler: function(){
			var params = {};
			params.datas = $.toJSON(gridManager.rows);
			UICtrl.gridExport(gridManager, params);
		},
		queryDetail:{id:'queryDetail',text:'排班详情',img:'page_dynamic.gif',click:function(){
			var data = gridManager.getSelectedRow();
			if (!data) {Public.tip('请选择数据！'); return; }
			var ownerPersonId=data.ownerPersonId;
			var startDate=$('#startDate').val();
			var endDate=$('#endDate').val();
			var name=data.name;
			UICtrl.showFrameDialog({
				title:'['+name+']排班详情',
				url: web_app.name + '/attBaseInfoAction!forwardSchedulingPersonDetail.do', 
				param:{ownerPersonId:ownerPersonId,startDate:startDate,endDate:endDate},
				height:400,
				width:getDefaultDialogWidth(),
				resize:true,
				ok:false,
				cancel:true
			});
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:defaultcols,
		dataAction : 'server',
		url: web_app.name+'/attBaseInfoAction!slicedQuerySchedulingStatistics.ajax',
		delayLoad:true,
		pageSize : 20,
		width : '99%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'orgName,name',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
	});
	UICtrl.setSearchAreaToggle(gridManager);
}
function initGridData(param){
	var columns = [];
	//调整查询走索引新增
	var schorgs = "";
	var colname = "";
	//查询班次信息,作为表头
	Public.syncAjax(web_app.name+'/attBaseInfoAction!queryContainWorkShift.ajax', 
			param,
			function(tableData){
			columns.splice(0, 0, {display: "单位名称", name: "orgName", type: "text", width: 146, align: "center",frozen: true});
			columns.splice(1, 0, {display: "姓名", name: "name", type: "text", width: 146, align: "center",frozen: true});
			$.each(tableData, function (index, data) {
				colname = "," + data.id + colname;
				schorgs = "','" + data.schOrgId + schorgs;
				columns.splice(columns.length, 0, {display: data.text, name: data.id, type: "int", width: 100, align: "center"});
			});
			columns.splice(columns.length, 0, {display: "排班总计", name: "total", type: "int", width: 100, align: "center"});
			columns.splice(columns.length, 0, {display: "休假总计", name: "xjtotal", type: "int", width: 100, align: "center"});
	});
	param.colname=colname.substring(1);
	param.schorgs=schorgs.substring(2)+"'";
	gridManager.set('columns', columns);
	gridManager.set('parms', param);
	gridManager.loadData();
};