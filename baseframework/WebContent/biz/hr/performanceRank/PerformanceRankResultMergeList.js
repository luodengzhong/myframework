var gridManager = null, refreshFlag = false,assessCycleData=null,performanceLevelData=null;;
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
		manageType:'hrPerFormAssessManage',
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
	performanceLevelData=$('#mainPerformanceLevel').combox('getJSONData');
	assessCycleData=$('#mainAssessCycle').combox('getJSONData');
	periodCodeData=$('#periodCode').combox('getJSONData');
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodIndex').combox({checkbox:true,data:{}});
	$('#periodCode').combox({
			onChange:function(obj){
				var value = obj.value;
				setPriodIndex(value);
			}
	});
	$('#periodCode').combox('setValue','quarter');
	var value =$('#periodCode').combox().val(); 
	setPriodIndex(value);	 
}
function setPriodIndex(value){
	if("month"==value){
		$('#periodIndex').combox('setData',{
			1:'1月',
			2:'2月',
			3:'3月',
			4:'4月',
			5:'5月',
			6:'6月',
			7:'7月',
			8:'8月',
			9:'9月',
			10:'10月',
			11:'11月',
			12:'12月'
		});
	}else if("quarter"==value){
		$('#periodIndex').combox('setData',{
			1:'1季度',
			2:'2季度',
			3:'3季度',
			4:'4季度'
		});
	}else {
		$('#periodIndex').combox('setData',{});					
	}				
}
function onFolderTreeNodeClick(data) {
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('绩效排名结果');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>绩效排名结果');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	if (gridManager&&fullId!='') {
		$('#fullId').val(fullId);
	}else{
		$('#fullId').val('');
	}
	query($('#submitForm'));
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		deleteHandler:deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		 			{ display: "员工", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" ,align: 'center'},
		 			{ display: "机构", name: "organizationName", width: 180, minWidth: 180, type: "string", align: "center" ,align: 'center'},
		 			{ display: "中心", name: "centerName", width: 120, minWidth: 120, type: "string", align: "center" ,align: 'center'},
//		 			{ display: "岗位", name: "posName", width: 80, minWidth: 80, type: "string", align: "center" ,align: 'center'},
//		 			{ display: "行政级别", name:"posLevelTextView", width: 80, minWidth: 80, type: "string", align: "center" ,align: 'center'},
//		 			{ display: "员工类别", name:"staffKindTextView", width: 80, minWidth: 80, type: "string", align: "center" ,align: 'center'},
		 			{ display: "最终分数", name: "effectiveScore", width: 80, minWidth: 80, type: "string", align: "center" ,align: 'center'},
		 			{ display: "最终等级", name: "effectiveRankTextView", width: 80, minWidth: 80, type: "string", align: "center" ,align: 'center'
		 		     },
					{ display: "考核年", name: "year", width: 60, minWidth: 60, type: "string", align: "center" },
					{ display: "考核周期", name: "periodCode", width: 80, minWidth: 80, type: "string", align: "center",
		 				render: function (item) { 
		 					return periodCodeData[item.periodCode];
		 			        }							
					},
					{ display: "考核周期索引", name: "periodCodeName", width: 90, minWidth: 90, type: "string", align: "center"},
					{ display: "考核时间", name: "assessmentDate", width: 120, minWidth: 120, type: "date", align: "center"},
					{ display: "排名单位", name: "underAssessmentName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "排名路径", name: "underFullName", width: 100, minWidth: 60, type: "string", align: "center" }

		],
		dataAction : 'server',
		url: web_app.name+'/performanceRankAction!slicedQueryMergedPerformanceRankDetail.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		sortName:'assessmentDate',
		sortOrder:'desc',
		manageType:'hrPerFormAssessManage',
		rowHeight : 25,
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
	UICtrl.setSearchAreaToggle(gridManager,false);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function deleteHandler(){
	DataUtil.del({action:'performanceRankAction!deletePerformanceRankGroupDetaDir.ajax',
		gridManager:gridManager,idFieldName:'performanceGroupDetailId',
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

function reloadGrid(){
	gridManager.loadData();
}
//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


