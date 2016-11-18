var gridManager = null, refreshFlag = false,archivesState=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	initializeUI();
	initializeGrid();
	bindEvent();
});
function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrArchivesManage',
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
	$('#state').combox({data:archivesState,checkbox:true}).combox('setValue','0,1');
	$('#yearPeriodName').searchbox({type:'hr',name:'chooseOperationPeriod',
		getParam:function(){
			var year=$('#year');
			if(year.length>0){
				var y=year.val();
				if(y!=''){
					return {paramValue:y};
				}
			}
		},
		onChange:function(){
			setTimeout(function(){
				var queryRadioRange=$('#queryRadioRange').getValue();
				query(queryRadioRange);
			},0);
		},
		back:{periodId:'#mainPeriodId',yearPeriodName:'#yearPeriodName'}
	});
	initWageOrgTreeChoose('#reshuffleWageOrgName','#reshuffleWageOrgId');
	initWageOrgTreeChoose('#archivesWageOrgName','#archivesWageOrgId');
}
function initWageOrgTreeChoose(name,id){
	$(name).orgTree({filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"},
		width:230,
		manageType:'hrWageOrgChooseManage',
		beforeChange:function(data){
				var flag=false,fullId=data.fullId;//是否是工资主体
				Public.authenticationWageOrg('',fullId,false,function(f){
					flag=f;
					if(f===false){
						Public.tip('选择的单位不是工资主体！');
					}
				});
				return flag;
		},
		back:{text:name,value:id,id:id,name:name}
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainFullId').val(fullId);
	var queryRadioRange=$('#queryRadioRange').getValue();
	query(queryRadioRange);
}

function bindEvent(){
	$('#queryRadioRangeDD').on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('input')){
			setTimeout(function(){
				var queryRadioRange=$('#queryRadioRange').getValue();
				gridManager.set('columns', getGridColumns()); 
        		gridManager.reRender();
        		$('#queryMainFormDiv')[queryRadioRange==1?'show':'hide']();
        		$('#queryArchivesFormDiv')[queryRadioRange==1?'hide':'show']();
        		query(queryRadioRange);
			},0);  	
	    }
	});
}
function getGridColumns(){
	var queryRadioRange=$('#queryRadioRange').getValue();
	var columns=[
		{ display: "姓名", name: "staffName", width: 100, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: "标志", name: "wageOrgName", width: 40, minWidth: 40, type: "string", align: "center",
			render: function (item) {
				var id=item['archivesWageOrgId'],status=1;
				if(Public.isBlank(id)){
					status=-1;
				}
				return UICtrl.getStatusInfo(status);
			} 
		},
		{ display: "期间内工资主体", name: "wageOrgName", width: 140, minWidth: 60, type: "string", align: "left" },
		{ display: "期间内工资归属", name: "wageCompanyName", width: 140, minWidth: 60, type: "string", align: "left" },
		{ display: "档案工资主体", name: "archivesWageOrgName", width: 140, minWidth: 60, type: "string", align: "left" }
	];
	if(queryRadioRange==1){
		columns.push({display: '异动前情况', columns:[
			{ display: "组织信息", name: "fromPosDesc", width: 300, minWidth: 60, type: "string", align: "left" },	
			{ display: "工资主体", name: "fromWageOrgName", width: 140, minWidth: 60, type: "string", align: "left" }
		]});
		columns.push({display: '异动后情况', columns:[
			{ display: "组织信息", name: "toPosDesc", width: 300, minWidth: 60, type: "string", align: "left" },	
			{ display: "工资主体", name: "toWageOrgName", width: 140, minWidth: 60, type: "string", align: "left" }
		]});
		columns.push({ display: "异动时间", name: "effectiveDate", width: 100, minWidth: 60, type: "date", align: "left" });
	}else{
		columns.push({ display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left" });	   
		columns.push({ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left" });	 		   
		columns.push({ display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left" });	 		   
		columns.push({ display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left" });	 
		columns.push({ display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left"});	 
		columns.push({ display: "离职办理", name: "isLeaveTextView", width: 60, minWidth: 60, type: "string", align: "left" });	 
		columns.push({ display: "试用期", name: "isProbationTextView", width: 60, minWidth: 60, type: "string", align: "left" });	 
	}
	columns.push({ display: "状态", name: "stateTextView", width: 60, minWidth: 60, type: "string", align: "left"});		
	return columns;
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		modifWageOrg:{id:'modifWageOrg',text:'修改工资主体单位',img:'page_user_light.gif',click:modifWageOrg},
		deletePeriodWageOrg:{id:'deletePeriodWageOrg',text:'删除期间内工资主体',img:'page_delete.gif',click:deletePeriodWageOrg}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:getGridColumns(),
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!slicedQueryArchivesWageOrg.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'effectiveDate',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		checkbox:true,
		selectRowButtonOnly : true,
		delayLoad:true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(type) {
	var obj=$('#'+(type==1?'queryMainForm':'queryArchivesForm'));
	var param = obj.formToJSON();
	if(!param) return;
	doQuery(param);
}
function doQuery(param){
	param=param||{};
	var queryRadioRange=$('#queryRadioRange').getValue();
	var mainPeriodId=$('#mainPeriodId').val();
	if(mainPeriodId==''){
		Public.tip('请选择业务期间!');
		return false;
	}
	var mainFullId=$('#mainFullId').val();
	param['queryRadioRange']=queryRadioRange;
	param['periodId']=mainPeriodId;
	param['fullId']=mainFullId;
	gridManager.options.parms={};
	gridManager.options.sortName=queryRadioRange==1?'effectiveDate':'sequence';
	UICtrl.gridSearch(gridManager, param);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(type) {
	var obj=$('#'+(type==1?'queryMainForm':'queryArchivesForm'));
	obj.formClean();
	if(type==2){
		$('#state').combox('setValue','0,1');
	}else{
		$('#fillinBeginDate').val($('#mainFillinBeginDate').val());
		$('#fillinEndDate').val($('#mainFillinEndDate').val());
	}
	onFolderTreeNodeClick();
}

function modifWageOrg(){
	var data = gridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip('请选择数据！');
		return false;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/hrArchivesAction!fowardModifArchivesWageOrg.load',width:380,title:'修改工资主体单位',
		ok: function(){
			var type=$('#modifArchivesWageOrgType0').getValue();
			var periodId=$('#modifPeriodId').val();
			if(type==0){
				if(periodId==''){
					Public.tip('请选择业务期间！');
					return false;
				}
			}
			var archiveIds=new Array();
			$.each(data,function(i,o){
				archiveIds.push(o['archivesId']);
			});
			var _self=this;
			$('#modifArchivesWageOrgForm').ajaxSubmit({
		        url: web_app.name + '/hrArchivesAction!modifArchivesWageOrg.ajax',
		        param: {ids:archiveIds.join(',')},
		        success: function (data) {
		           _self.close();
		           reloadGrid();
		        }
		    });
		},init:function(){
			initModifArchivesWageOrg();
		}
	});
}

function initModifArchivesWageOrg(){
	//初始化期间选择
	$('#modifYearPeriodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		var year=$('#modifYear').val();
		return {paramValue:year};
	},back:{periodId:'#modifPeriodId',yearPeriodName:'#modifYearPeriodName'}});
	//初始化工资主体选择
	initWageOrgTreeChoose('#modifWageOrgName','#modifWageOrgId');
	//初始化工资归属选择
	$('#modifWageCompanyName').searchbox({
		type:'hr',name:'businessRegistrationByOrg',
		getParam:function(){
			var orgId=$('#modifWageOrgId').val();
			if(orgId==''){
				Public.tip('请选择工资主体单位.');
				return false;
			}
			return {orgId:orgId};
		},
		back:{id:'#modifWageCompanyId',companyName:'#modifWageCompanyName'}
	});
	//注册单选事件
	$('#modifArchivesWageOrgType0').parent().on('click',function(e){
		var $clicked = $(e.target || e.srcElement);
		if($clicked.is('input')){
			setTimeout(function(){
				var type=$('#modifArchivesWageOrgType0').getValue();
				$('#modifPeriodChoose')[type==0?'show':'hide']();
			},0);  	
	    }
	});
}

function deletePeriodWageOrg(){
	var data = gridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip('请选择数据！');
		return false;
	}
	var ids=new Array();
	$.each(data,function(i,o){
		if(!Public.isBlank(o['archivesWageOrgId'])){
			ids.push(o['archivesWageOrgId']);
		}
	});
	if(!ids.length){
		Public.tip('没有可以删除的数据！');
		return false;
	}
	UICtrl.confirm('您确定删除期间内工资主体数据吗?', function() {
		Public.ajax(web_app.name + '/hrArchivesAction!deleteArchivesWageOrg.ajax', {ids:ids.join('')}, function(data) {
			reloadGrid();
		});
	});
}