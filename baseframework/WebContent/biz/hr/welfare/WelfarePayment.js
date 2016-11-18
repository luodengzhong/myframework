
var gridManager = null, refreshFlag = false,welfareCommodityData=null,welfareTypeData=null,paymentStatusData=null ;

$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	welfareCommodityData=$('#welfareCommodityId').combox('getJSONData');
	welfareTypeData=$('#welfareTypeId').combox('getJSONData');
	paymentStatusData=$('#status').combox('getJSONData');
	initializeGrid();
	initializeUI();
	$('#year').spinner({countWidth:80}).mask('nnnn');
});

function initializeUI(){
	$('#mainfullId').val("-1");
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5,onSizeChanged:function(){
		try{detailGridManager.reRender();}catch(e){}
	}});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrPerFormAssessManage',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt,pos,psm"};
			}
			return {showDisabledOrg:0};
		},
		changeNodeIcon:function(data){
			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
		},
		IsShowMenu:false,
		onClick : onFolderTreeNodeClick
	});
	$('div.l-layout-center').css({borderWidth:0});
}
function onFolderTreeNodeClick(data) {
	var fullId='',orgKindId='',html=[],fullName='';
	orgNode=null;
	if(data){
		fullId=data.fullId;
		fullName=data.fullName;
		$('#mainFullId').val(fullId);
		orgKindId=data.orgKindId;
		if(orgKindId=='psm'){//选择的是人员，新增时默认为选中人员
			orgNode=data;
		}
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>福利发放');
	}else {
		html.push('福利发放');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var columns=[
	 			{ display: "员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center'},
				{ display: "单位", name: "organizationName", width: 180, minWidth: 180, type: "string", align: "center" },	
				{ display: "中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "lecenterft" },	
				{ display: "福利类型", name: "welfareTypeId", width: 100, minWidth: 60, type: "string", align: "center",
					render: function (item) { 
					    return welfareTypeData[item.welfareTypeId];
				    } 					
				},
				{ display: "福利卡", name: "welfareCommodityId", width: 150, minWidth: 150, type: "string", align: "left",
					render: function (item) { 
					    return welfareCommodityData[item.welfareCommodityId];
				    } 
				},
				{ display: "金额", name: "sum", width: 100, minWidth: 60, type: "string", align: "center" },
				{ display: "申请时间", name: "welfareApplyDate", width: 150, minWidth: 150, type: "String", align: "center" },
				{ display: "发放时间", name: "welfarePaymentDate", width: 150, minWidth: 150, type: "String", align: "center" },
				{ display: "状态", name: "status", width: 80, minWidth: 60, type: "string", align: "center",
					render: function (item) { 
						return paymentStatusData[item.status];
					}					
				},
				{ display: "备注", name: "remark", width: 200, minWidth:150, type: "string",  align: "left",
					editor:{type:'text',maxLength:256}
				}
	 	];


	var toolbarOptions = { 
	items: [ 
		    {id: "payment", text: "发放", click: paymentHandler, img: web_app.name + '/themes/default/images/icons/ok.png'},
		    {id: "rollback", text: "撤销", click: rollbackHandler, img: web_app.name + '/themes/default/images/icons/cancel.png'}
		]
	};
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/welfareAction!slicedQueryWelfare.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		delayLoad:true,
		rowHeight : 25,
		sortName:'welfareApplyDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true, 
		autoAddRow:{welfareId:'',archivesId:'',organizationId:'',centerId:'',welfareTypeName:'',welfareCommodityId:'',fullId:''}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 


//发放按钮
function paymentHandler(){
	 var welfareIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'welfareId' });
     if (!welfareIds) {Public.tip('请选择数据！'); return; }    
 	UICtrl.confirm('确定发放福利吗?',function(){
 	     $('#submitForm').ajaxSubmit({url: web_app.name + '/welfareAction!paymentWelfare.ajax',
 			param:{ids:$.toJSON(welfareIds)},
 			success : function() {
 				gridManager.loadData();	
 				}
 		});	
	})
}
//撤销按钮
function rollbackHandler(){
	 var welfareIds = DataUtil.getSelectedIds({gridManager : gridManager,idFieldName: 'welfareId' });
     if (!welfareIds) {Public.tip('请选择数据！'); return; } 
  	 UICtrl.confirm('确定撤销福利吗?',function(){
  	     $('#submitForm').ajaxSubmit({url: web_app.name + '/welfareAction!rollbackWelfare.ajax',
  			param:{ids:$.toJSON(welfareIds)},
  			success : function() {
  				gridManager.loadData();	
  				}
  		});	
	})
}
function afterSave(){
	reloadGrid();
}

function getExtendedData(){
	var detailData = DataUtil.getGridData({gridManager: gridManager});
	if(!detailData){
		return false;
	}
	return {detailData:encodeURI($.toJSON(detailData))};
}
//查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}


//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


