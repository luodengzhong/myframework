var gridManager = null,refreshFlag = false;
var mealAllowanceUnit={1:'天',2:'月'};	
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
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn"};
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
	var html=[],fullId='',name='', organId='';
	if(!data){
		html.push('误餐补贴标准');
	}else{
		fullId=data.fullId,name=data.name, organId=data.orgId;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>误餐补贴标准');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#fullId').val(fullId); 
	$('#deptName').val(name); 
	$('#organId').val(organId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler: saveHandler,
		addHandler: function(){
			var organId=$('#organId').val();
			var fullId=$('#fullId').val();
			var organName=$('#deptName').val();
			if(organId == ''){
				Public.tip('请选择机构!');
				return ;
			}
            var addRows = [], addRow;
            addRow = {fullId: fullId,organId:organId,organName:organName};
            gridManager.addRows(addRow);
		}, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "机构fullID", name: "fullId", hide: true },
		{ display: "机构ID", name: "organId", hide: true },
		{ display: "工资归属单位ID", name: "wageCompanyId", hide: true },
		{ display: "岗位ID", name: "posId", hide: true },
		{ display: "机构", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "工资归属单位", name: "wageCompanyName", width: 200, minWidth: 60, type: "string", align: "left", 
			editor: { type: 'select', required: true,data:{type:'hr',name:'businessRegistrationByOrg',
				getParam:function(rowData){
					var organId=rowData.organId||'';
					if(organId==''){
						Public.tip('请选择工资主体单位.');
					return false;
					}
					return {orgId:organId};
				},
				back:{id:'wageCompanyId',companyName:'wageCompanyName'}}}
		},
		{ display: "岗位", name: "posName", width: 400, minWidth: 60, type: "string", align: "left", 
			editor: { type: 'select', required: true,data:{name :'hrPosSelect',type :'hr',
				getParam:function(rowData){
					var fullId=rowData.fullId||'';
					var root='';
			 	   if(fullId!=''){
					   root=fullId;
			 	   }
			  	  return {searchQueryCondition:"full_id like '%"+root+"%'"};
			},back:{
				id:'posId',
				fullName:'posName'
			}}}
		},		   
		{ display: "餐贴单位(天/月)", name: "allowanceUnit", width: 100, minWidth: 60, type: "money", align: "center",
			editor: { type:'combobox',data:mealAllowanceUnit,required: true},
				render: function (item) { 
					return mealAllowanceUnit[item.allowanceUnit];
				}
		},		   
		{ display: "餐贴标准", name: "allowanceStandard", width: 80, minWidth: 60, type: "money", align: "left",
				editor: { type: 'text',required:true,mask:'money'}
		},		   
		{ display: "收入上限", name: "upperLimit", width: 80, minWidth: 60, type: "money", align: "left",
				editor: { type: 'text',required:false,mask:'money'}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/paySetupAction!slicedMealAllowanceStandardQuery.ajax',
		parms:{fullId:"/"},
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		autoAddRowByKeydown:false,
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
}

//保存按钮 
function saveHandler() {
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改!');
		return false;
	}
	Public.ajax(web_app.name + '/paySetupAction!saveMealAllowanceStandard.ajax', {datas:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'paySetupAction!deleteMealAllowanceStandard.ajax',
		gridManager:gridManager,idFieldName:'mealAllowanceStandardId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

