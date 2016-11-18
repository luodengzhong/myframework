var authGridManager={};

function getDocumentLibraryId(){
	return false;
}

function authTabClickInit(id,documentLibraryId,height){
	if(!authGridManager[id]){
		authGridManager[id]=initializeAuthGrid(id,documentLibraryId,height);
	}
	return authGridManager[id];
}

function initializeAuthGrid(authKind,documentLibraryId,height) {
	height=height||'100%';
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: function(){
			showChooseOrgDialog(authKind,function(data){
				var paramDocumentLibraryId=getDocumentLibraryId();
				var addRows=[];
				$.each(data,function(i,o){
					var row=$.extend({},o,{orgInId:o['id'],orgInName:o['name']});
					addRows.push(row);
				});
				var url=web_app.name + '/oaDocumentAction!saveDocumentAuthority.ajax';
				Public.ajax(url,{documentLibraryId:paramDocumentLibraryId,authorityKind:authKind,detailData:encodeURI($.toJSON(addRows))}, function(data){
					authGridManager[authKind].loadData();
				});
			});
		},
		deleteHandler: function(){
			var paramDocumentLibraryId=getDocumentLibraryId();
			DataUtil.delSelectedRows({action:'oaDocumentAction!deleteDocumentAuthority.ajax',
				gridManager:authGridManager[authKind],idFieldName:'documentAuthorityId',
				param:{documentLibraryId:paramDocumentLibraryId},
				onSuccess:function(){
					authGridManager[authKind].loadData();
				}
			});
		}
	});
	var gridManager = UICtrl.grid('#'+authKind+'AuthGrid', {
		columns: [	   
		{ display: "组织单元名称", name: "orgInName", width: '140', minWidth: 60, type: "string", align: "left",frozen: true},
		{ display: "类型", name: "orgKindId", width: '60', minWidth: 40, type: "string", align: "left",
			render: function (item) {
                   return OpmUtil.getOrgKindDisplay(item.orgKindId);
             }
		},
		{ display: "机构路径", name: "fullName", width: '400', minWidth: 60, type: "string", align: "left"},
		{ display: "状态", name: "status", width: 60, minWidth: 60, type: "string", align: "left",
			render: function (item) { 
				return UICtrl.getStatusInfo(item.status);
			}
		}
		],
		dataAction : 'server',
		url: web_app.name+'/oaDocumentAction!slicedQueryDocumentAuthority.ajax',
		parms :{documentLibraryId:documentLibraryId,authorityKind:authKind},
		width : '99.5%',
		height : height,
		heightDiff : -55,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'fullSequence',
		sortOrder:'asc',
		checkbox: true,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !(documentLibraryId=='');
		}
	});
	UICtrl.createGridQueryBtn('#'+authKind+'AuthGrid','div.l-panel-topbar', function (value) {
        UICtrl.gridSearch(authGridManager[authKind], { keyValue: encodeURI(value) });
    });
	return gridManager;
}


//打开机构选择对话框
function showChooseOrgDialog(kind,fn){
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	if(kind=='manage'){//所有者不能选择机构
		selectOrgParams['selectableOrgKinds']='dpt,pos,psm';
	}else{
		selectOrgParams['selectableOrgKinds']='ogn,dpt,pos,psm';
	}
	var options = { params: selectOrgParams,title : "选择组织",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			if($.isFunction(fn)){
				fn.call(window,data);
			}
			this.close();
		}
	};
	if(window['setDocumentAuthDialog']){
		options['parent']=window['setDocumentAuthDialog'];
	}
	OpmUtil.showSelectOrgDialog(options);
}

/*************************权限人员查询**********************************/
var authGridManagerView={};
function authTabClickDocumentPersonPower(id,documentLibraryId,height){
	if(!authGridManagerView[id]){
		authGridManagerView[id]=initializeDocumentPersonPowerByKindAuthGrid(id,documentLibraryId,height);
	}
	return authGridManagerView[id];
}

function initializeDocumentPersonPowerByKindAuthGrid(authKind,documentLibraryId,height) {
	height=height||'100%';
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(authGridManagerView[authKind]);
		}
	});
	var gridManager = UICtrl.grid('#'+authKind+'ViewAuthGrid', {
		columns: [	   
		{ display: "姓名", name: "name", width: '100', minWidth: 60, type: "string", align: "left",frozen: true},
		{ display: "路径", name: "fullName", width: '250', minWidth: 40, type: "string", align: "left"},
		{ display: "授权文档名称", name: "documentName", width: '100', minWidth: 60, type: "string", align: "left"},
		{ display: "授权文档路径", name: "fullPathName", width: '250', minWidth: 60, type: "string", align: "left"},
		{ display: "授权人", name: "createByName", width: 80, minWidth: 60, type: "string", align: "left"},
		{ display: "授权时间", name: "createDate", width: 120, minWidth: 60, type: "datetime", align: "left"}
		],
		dataAction : 'server',
		url: web_app.name+'/oaDocumentAction!slicedQueryDocumentPersonPowerByKind.ajax',
		parms :{queryDocumentLibraryId:documentLibraryId,queryAuthorityKind:authKind},
		width : '99.5%',
		height : height,
		heightDiff : -55,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox: true,
		fixedCellHeight : true,
		toolbar: toolbarOptions,
		selectRowButtonOnly : true,
		onLoadData :function(){
			return !(documentLibraryId=='');
		}
	});
	UICtrl.createGridQueryBtn('#'+authKind+'ViewAuthGrid','div.l-panel-topbar', function (value) {
        UICtrl.gridSearch(authGridManagerView[authKind], { queryAuthKeyValue: encodeURI(value) });
    });
	return gridManager;
}