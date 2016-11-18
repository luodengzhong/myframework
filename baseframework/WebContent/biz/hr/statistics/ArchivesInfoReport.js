var gridManager = null, refreshFlag = false, totalgridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5}); 
	UICtrl.layout("#divLayOut", {topHeight: 150});
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

}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='/',fullName='', ognKindId='';
	if(!data){
		html.push('统计报表');
	}else{
		fullId=data.fullId,fullName=data.fullName, ognKindId=data.orgKindId;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>统计报表');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#ognKindId').val(ognKindId);
	$('#fullId').val(fullId);
	if (gridManager&&fullId!=''&&fullId!='/') {
	query();
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler:function(){
			UICtrl.gridExport(gridManager);
		}
	});
	var columns=[
	      { display: "单位名称", name: "ognName", width: 150, minWidth: 60, type: "string", align: "center"},
	      { display: "所属一级中心", name: "centreName", width: 150, minWidth: 60, type: "string", align: "center"},		   
	      { display: "部门名称", name: "dptName", width: 150, minWidth: 60, type: "string", align: "center" },	
	      { display: "职位", name: "posName", width: 150, minWidth: 60, type: "string", align: "center" },
	      { display: "职级", name: "staffingPostsRank", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#staffingPostsRank_text').val();
	      	}
	      },
	      { display: "性别", name: "sex", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#sex_text').val();
	      	}
	      },
	      { display: "工龄", name: "cWorkTime", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#lowCWorkTime').val() + '-' + $('#upCWorkTime').val();
	      	}
	      },
	      { display: "学历", name: "education", width: 80, minWidth: 80, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#education_text').val();
	      	} 
	      },
	      { display: "年龄", name: "age", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#lowAge').val() + '-' + $('#upAge').val();
	      	}
	      },
	      { display: "人数", name: "num", width: 50, minWidth: 50, type: "string", align: "left" },	  
	      { display: "占比", name: "pos_total_num", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return (item.num/item.posTotalNum).toFixed(2) * 100 + '%';
	      	}
	      }		   
	];
	
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!slicedArchivesInfoQuery.ajax',
		manageType:'hrArchivesManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		delayLoad:true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledSort : false
		
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
	
    var totalNum = 0, totalConNum = 0;
	var totalColumns=[
	      { display: "组织机构", name: "ognName", width: 200, minWidth: 60, type: "string", align: "center",
	      	render: function (item) {
	      		var ognName = item.ognName;
	      		if(item.centreName)
	      			ognName += "-" + item.centreName;
	      		if(item.dptName)
	      			ognName += "-" + item.dptName;
	      		if(item.posName)
	      			ognName += "-" + item.posName;
	      		return ognName;
	      	},
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			totalNum = item.sum;
	     	 			return "总计：";
	     	 		} }},
	      { display: "组织机构总人数", name: "posTotalNum", width: 100, minWidth: 50, type: "string", align: "left",
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			totalNum = item.sum;
	     	 			return item.sum;
	     	 		} }  },	
	      { display: "职级", name: "staffingPostsRank", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#staffingPostsRank_text').val();
	      	}
	      },
	      { display: "性别", name: "sex", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#sex_text').val();
	      	}
	      },
	      { display: "工龄", name: "cWorkTime", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#lowCWorkTime').val() + '-' + $('#upCWorkTime').val();
	      	}
	      },
	      { display: "学历", name: "education", width: 80, minWidth: 80, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#education_text').val();
	      	} 
	      },
	      { display: "年龄", name: "age", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return $('#lowAge').val() + '-' + $('#upAge').val();
	      	}
	      },
	      { display: "人数", name: "num", width: 50, minWidth: 50, type: "string", align: "left",
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	     	 			totalConNum = item.sum;
	     	 			return item.sum;
	     	 		} }  },	  
	      { display: "占比", name: "pos_total_num", width: 50, minWidth: 50, type: "string", align: "center",
	      	render: function (item) {
	      		return (item.num/item.posTotalNum).toFixed(2) * 100 + '%';
	      	},
	     	 	totalSummary: {align: "left",type: "sum",
	     	 		render: function (item) {
	      		return (totalConNum/totalNum).toFixed(2) * 100 + '%';
	     	 		} }  
	      }		   
	];
	totalgridManager = UICtrl.grid('#maingridTotal', {
		columns:totalColumns,
		dataAction : 'server',
		url: web_app.name+'/hrSystemStatisticsAction!archivesTotalInfoQuery.ajax',
		manageType:'hrArchivesManage',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		delayLoad:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		enabledSort : false,
		usePager: false,
		title: "总计"
		
	});
	UICtrl.setSearchAreaToggle(totalgridManager,false);
}

// 查询
function query(obj) {
	var fullId = $('#fullId').val();
	if(!fullId){
		Public.tip('请选择机构')	;	
		return;
	}
	var ognKindId = $('#ognKindId').val();
	if(!fullId){
		Public.tip('请选择机构')	;	
		return;
	}
	var param = $('#queryMainForm').formToJSON();
	UICtrl.gridSearch(gridManager, param);
	UICtrl.gridSearch(totalgridManager, param);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
	totalgridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
	onFolderTreeNodeClick();
}

function totalQuery(){
	var param = $('#queryMainForm').formToJSON();
	Public.ajax(web_app.name + "/hrSystemStatisticsAction!archivesTotalInfoQuery.ajax",param, function(data){
	});
}

