
var gridManager = null, refreshFlag = false,assessCycleData=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	$('#periodIndex').combox({checkbox:true,data:{}});
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
	assessCycleData=$('#mainAssessCycle').combox('getJSONData');
	periodCodeData=$('#periodCode').combox('getJSONData');
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
		html.push('绩效排名查询');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>绩效排名查询');
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
		viewHandler: function(){
			updateHandler();
		},
		combineRankHandler:{id:'combineRank',text:'合并排名',img:'page_user.gif',click:combineRankHandler},
		deleteHandler:deleteHandler
	//	archiveRankResultHandler:{id:'archiveRankResult',text:'归档',img:'page_user.gif',click:archiveRankResultHandler}

		
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		
		           { display: "排名单位", name: "name", width: 180, minWidth: 180, type: "string", align: "center" },
		            { display: "排名单位路径", name: "fullName", width: 180, minWidth: 180, type: "string", align: "center" },
		           	{ display: "考核年", name: "year", width: 60, minWidth: 60, type: "string", align: "center" },
		           	{ display: "考核周期", name: "periodCode", width: 80, minWidth: 80, type: "string", align: "center",
		 				render: function (item) { 
	 					return periodCodeData[item.periodCode];
	 			        }					
					},
				   { display: "考核周期索引", name: "periodCodeName", width: 80, minWidth: 80, type: "string", align: "center"},
				    { display: "状态", name: "statusTextView", width: 80, minWidth: 60, type: "string", align: "center"},
			  		{ display: "排名开始时间", name: "fillinDate", width: 100, minWidth: 60, type: "string", align: "center" },		   
					{ display: "单据号码", name: "billCode", width: 140, minWidth: 60, type: "string", align: "center" },
					{ display: "是否合并排名", name: "isCombine", width: 110, minWidth: 60, type: "string", align: "center" ,
					 render:function (item){
					 	if(item.isCombine==1){
					 		return "是";
					 	}else{
					 		return "否";
					 	}
					 }
					 },

					{ display: "排名负责人", name: "staffName", width: 100, minWidth: 60, type: "string", align: "center" },
					{ display: "排名负责人单位", name: "organizationName", width: 180, minWidth: 180, type: "string", align: "center" },
					{ display: "排名负责人中心", name: "centerName", width: 140, minWidth: 140, type: "string", align: "center" }
		],
		dataAction : 'server',
		url: web_app.name+'/performanceRankAction!slicedQueryPerformanceRankGroup.ajax',
		pageSize : 20,
		checkbox:true,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		manageType:'hrPerFormAssessManage',
		rowHeight : 25,
		sortName:'fillinDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		enabledEdit: true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.performanceRankGroupId,data.status,data.taskId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function  deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  performanceRankGroupId=row.performanceRankGroupId;
	var taskId=row.taskId;
	var status=row.status;
	if(status==0 ){
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/performanceRankAction!deletePerformanceRankGroup.ajax', {performanceRankGroupId:performanceRankGroupId,taskId:taskId}, function(){
			reloadGrid();
		});
	});
	}else{
		Public.tip('不是申请状态,不允许删除！');
	}
}
//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


//编辑按钮
function updateHandler(id,status,taskId){
	var url;
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		auditId=row.performanceRankGroupId;
		status=row.status;
		taskId=row.taskId;
	}else{
		auditId=id;
	}
    if(status==0){
    	if(!taskId){
    	   url=web_app.name + '/performanceRankAction!forwardPerformanceRankGroup.job?bizId=' 
		                  	+ auditId+'&nendConstraint=false';
    	}else{
    		url=web_app.name + '/performanceRankAction!showUpdate.job?bizId=' 
		                  	+ auditId+'&nendConstraint=false'+'&taskId='+taskId+'&procUnitId=Apply'
    	}
    	  parent.addTabItem({
	            tabid: 'HRPerformanceRankResultList'+auditId,
	            text: '绩效排名查看',
		         url: url
	               }
	               );	
    }else{
	parent.addTabItem({
		tabid: 'HRPerformanceRankResultList'+auditId,
		text: '绩效排名结果查询',
		url: web_app.name + '/performanceRankAction!showUpdate.job?bizId=' 
			+ auditId
	}
	);}
}


function  combineRankHandler(){
	var data =gridManager.getSelectedRows();
	if (!data || data.length < 2) {
		Public.tip('请选择至少两条数据！');
		return false;
	}
	var yearTmp=data[0].year;
	var periodCodeTmp=data[0].periodCode;
	var periodIndexmp=data[0].periodIndex;
    var status=data[0].status;
	for(var k=1;k<data.length;k++){
		
		if(yearTmp==data[k].year){
			yearTmp=data[k].year;
		}else{
			Public.tip('选择的排名数据年份不同,请重新选择');
		    return false;
		}
		
		if( periodIndexmp==data[k].periodIndex ){
			 periodIndexmp =data[k].periodIndex ;
		}else{
			Public.tip('选择的排名数据考核周期索引不同,请重新选择');
		    return false;
		}
	    
	  }
	Public.ajax(web_app.name + "/performanceRankAction!saveCombineRankData.load",
			{data:$.toJSON(data)}, function(data) {
				
				refreshFlag = true;
				  UICtrl.reloadParentTab('main_tab');
				/*parent.addTabItem({ 
				tabid: 'HRperformanceRankAdd'+data,
				text:'绩效排名结果',
				url: web_app.name + '/interviewApplyAction!showInsertDetailByWriteId.do?performanceRankGroupId=' 
					+ data
				}); */
			});
	
	
}

function  archiveRankResultHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  performanceRankGroupId=row.performanceRankGroupId;
	var status=row.status;
	if(status!=0){
		Public.tip('不是已完成状态,不能归档！'); return;
	}
	parent.addTabItem({
		tabid: 'HRPerformanceRankResultList'+performanceRankGroupId,
		text: '绩效排名结果归档',
		url: web_app.name + '/performanceRankAction!showUpdate.do?bizId=' 
			+ performanceRankGroupId+'&isReadOnly=true'+'&isArchive=true'
	}
	);
	
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
}


