var gridManager = null;
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
	var html=[],fullId='',fullName='';
	if(!data){
		html.push('人员列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>人员列表');
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
		syncToArchives:{id:'syncToArchives',text:'修改人事档案',img:'page_dynamic.gif',click:function(){
			  DataUtil.updateById({ action: 'hrArchivesAction!syncToArchives.ajax',
					gridManager: gridManager,
					message:'确实要修改人事档案吗?',
					onSuccess:function(){
						reloadGrid();	
					}
				});
		}},
		syncToOrg:{id:'syncToOrg',text:'调整组织架构',img:'page_dynamic.gif',click:function(){
				DataUtil.updateById({ action: 'hrArchivesAction!syncToOrg.ajax',
					gridManager: gridManager,
					message:'确实要调整组织架构吗?',
					onSuccess:function(){
						reloadGrid();	
					}
				});
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
		{ display: "姓名", name: "staffName", width:60, minWidth: 60, type: "string", align: "left",frozen: true },
		{ display: '人事档案组织信息', columns:
                [
                    { display: "单位", name: "ognName", width: 100, minWidth: 60, type: "string", align: "left",
                    	render: function (item) { 
                    		if(item.ognName!=item.orgOrgName){
                    			return '<font color="red">'+item.ognName+'</font>';
                    		}
							return item.ognName;
						}
                    },		   
			    	{ display: "所属一级中心", name: "centreName", width: 100, minWidth: 60, type: "string", align: "left",
			    		render: function (item) { 
                    		if(item.centreName!=item.orgCenterName){
                    			return '<font color="red">'+item.centreName+'</font>';
                    		}
							return item.centreName;
						}
			    	},		   
		            { display: "部门", name: "dptName", width: 100, minWidth: 60, type: "string", align: "left",
		            	render: function (item) { 
                    		if(item.dptName!=item.orgDeptName){
                    			return '<font color="red">'+item.dptName+'</font>';
                    		}
							return item.dptName;
						}
		            },		   
		            { display: "岗位", name: "posName", width: 100, minWidth: 60, type: "string", align: "left",
		            	render: function (item) { 
                    		if(item.posName!=item.orgPosName){
                    			return '<font color="red">'+item.posName+'</font>';
                    		}
							return item.posName;
						}
		            }	
                ]
        },
	    { display: '组织架构信息', columns:
                [
                    { display: "单位", name: "orgOrgName", width: 100, minWidth: 60, type: "string", align: "left" },		   
			    	{ display: "所属一级中心", name: "orgCenterName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		            { display: "部门", name: "orgDeptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		            { display: "岗位", name: "orgPosName", width: 100, minWidth: 60, type: "string", align: "left" }	
                ]
        }
		],
		dataAction : 'server',
		url: web_app.name+'/hrArchivesAction!slicedQueryContrastOrg.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'sequence',
		sortOrder:'asc',
		checkbox:true,
		toolbar: toolbarOptions,
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

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}
