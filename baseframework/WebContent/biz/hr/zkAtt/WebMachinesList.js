var gridManager = null, refreshFlag = false,selectOrgDialog=null;
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
		manageType:'hrBaseZKAtt',
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
	$('#folderKindName').on('click',function(){
		showGroupChooseDialog(function(parentId,node){
			$('#folderKindId').val(parentId);
			$('#folderKindName').val(node.name);
		});
	});
}
function onFolderTreeNodeClick(data) {
	var html=[],organId='',name='',fullId='';
	if(!data){
		html.push('考勤设备');
	}else{
		organId=data.id,name=data.name,fullId=data.fullId;
		html.push('<font style="color:Tomato;font-size:13px;">[',name,']</font>考勤设备');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainOrganId').val(organId);
	$('#mainOrganName').val(name);
	$('#mainFullId').val(fullId);
	if (gridManager&&organId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
}
//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		moveHandler:moveHandler,
		modifManagerOrg:{id:'modifManagerOrg',text:'设置管理机构',img:'page_favourites.gif',click:modifManagerOrg},
		modifGroup:{id:'modifGroup',text:'修改考勤分组',img:'page_tree.gif',click:modifAttGroup},
		syncGroup:{id:'syncGroup',text:'按分组同步人员',img:'page_user_light.gif',click:syncAttGroup},
		compelSyncMachines:{id:'compelSyncMachines',text:'强制同步',img:'page_dynamic.gif',click:compelSyncMachines},
		moreOperate:{id:'moreOperate',text:'更多操作',img:'page_settings.gif',click:function(){}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "设备序列号", name: "macSn", width: 120, minWidth: 60, type: "string", align: "left",frozen: true },
			{ display: "设备名称", name: "macName", width: 150, minWidth: 60, type: "string", align: "left" ,frozen: true},		
			{ display: "考勤分组", name: "folderKindName", width:120, minWidth: 60, type: "string", align: "left" },
			{ display: "在线状态", name: "status", width: 100, minWidth: 60, type: "string", align: "left",
				render: function (item) {
					var color='red';
					if(item.status=='在线'){
						color='blue'
					}
					return '<font color="'+color+'">'+item.status+'<font>';
				} 
			},
			{ display: "所在地", name: "macAddress", width: 100, minWidth: 60, type: "string", align: "left" },	
			{ display: "最新联机时间", name: "newTime", width: 120, minWidth: 60, type: "datetime", align: "left" },		   
			{ display: "员工数", name: "userCount", width: 60, minWidth: 60, type: "string", align: "left" },		   
			{ display: "指纹记录数", name: "tmpCount", width: 60, minWidth: 60, type: "string", align: "left" },		   
			{ display: "考勤记录数", name: "attCount", width: 60, minWidth: 60, type: "string", align: "left" },
			{ display: "管理单位", name: "orgName", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "管理人", name: "managerName", width: 80, minWidth: 60, type: "string", align: "left" },
			{ display: "设备型号", name: "macStyle", width: 100, minWidth: 60, type: "string", align: "left" },	
			//{ display: "错误间隔时间(秒)", name: "errorDelay", width: 80, minWidth: 60, type: "string", align: "left" },		   
			//{ display: "传送间隔时间(秒)", name: "delay", width: 80, minWidth: 60, type: "string", align: "left" },		   
			{ display: "上传指定时刻", name: "transTimes", width: 80, minWidth: 60, type: "string", align: "left" },		   
			{ display: "刷新间隔时间(分钟)", name: "transInterval", width: 80, minWidth: 60, type: "string", align: "left" },
			//{ display: "是否实时传送", name: "realTime", width: 60, minWidth: 60, type: "string", align: "left" },
			{ display: "IP地址", name: "ipAddress", width: 120, minWidth: 60, type: "string", align: "left" },
			{ display: "固件版本号", name: "macVersion", width: 100, minWidth: 60, type: "string", align: "left" },
			{ display: "状态", name: "state", width: 60, minWidth: 60, type: "string", align: "left",
				render: function (item) {
					return UICtrl.getStatusInfo(item.state);
				} 
			},
			{ display: "打开记录", name: "state", width: 60, minWidth: 60, type: "string", align: "center",
				render: function(item) {
				 	var macSn=item.macSn,name=item.macName;
					var html=new Array();
					html.push('<a href="javascript:void(null);" class="GridStyle" onclick="managerAtt(');
					html.push('\'',macSn,'\',\'',name,'\')">','考勤记录','</a>');
					return html.join('');
				}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/zkAttAction!slicedQueryWebMachines.ajax',
		parms:{deleteState:1},
		//manageType:'hrBaseZKAtt',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'id',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		checkbox:true,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);
	initMoreOperate();
}
//更多操作按钮
function initMoreOperate(){
	var more=$('#toolbar_menumoreOperate');
	more.contextMenu({
		width:"200px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"启用",icon:'enable',handler:enableHandler},
			{name:"停用",icon:'disable',handler:disableHandler},
			{classes:'separator'},
			{name:"更新设备信息",icon:'copyGif',handler:operate(sendCmd,'info')},
			{name:"重新启动设备",icon:'next',handler:operate(sendCmd,'reboot')},
			{classes:'separator'},
			{name:"重新传送设备上全部数据",icon:'down',handler:operate(sendCmd,{cmdKind:'check',dataKind:'all'})},
			{name:"重新传送设备上人员数据",icon:'down',handler:operate(sendCmd,{cmdKind:'check',dataKind:'user'})},
			{name:"重新上传设备上的考勤记录",icon:'down',handler:operate(sendCmd,{cmdKind:'check',dataKind:'att'})},
			{name:"传送人员到设备",icon:'copy',handler:operate(showSelectOrgDialog,'addHum',true)},
			{name:"选择组织中人员到设备",icon:'copy',handler:operate(saveChooseORGCmd,'addHum',true)},
			{name:"立即检查并传送数据",icon:'refresh',handler:operate(sendCmd,'log')},
			{classes:'separator'},
			{name:"清除设备上全部数据",icon:'deleteAll',handler:operate(sendCmd,'clear data')},
			{name:"清除设备上的考勤记录",icon:'deleteAll',handler:operate(sendCmd,'clear log')},
			{name:"删除设备上人员",icon:'delete',handler:operate(showSelectOrgDialog,'delHum',true)},
			{name:"删除选择组织中人员",icon:'delete',handler:operate(saveChooseORGCmd,'delHum',true)}
			//{classes:'separator'}
			//{name:"重新载入系统项",icon:'paste',handler:operate(sendCmd,'reload options')}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
}
//执行更多操作
function operate(fn,param,flag){
	return function(){
		var  macSns = DataUtil.getSelectedIds({gridManager: gridManager,idFieldName:'macSn',nochooseMessage:'请选择设备'});
	    if (!macSns) {
	        return;
	    }
	    if(!flag){
	    	UICtrl.confirm('您确定要执行该操作吗?', function() {
		    	fn.call(window,macSns,param);
		    });
	    }else{
	    	fn.call(window,macSns,param);
	    }
	}
}
//发送命令
function sendCmd(macSns,param){
	if($.isPlainObject(param)){
		param['macSns']=$.toJSON(macSns);
	}else{
		param={cmdKind:param,macSns:$.toJSON(macSns)};
	}
	Public.ajax(web_app.name + "/zkAttAction!saveCmd.ajax",param);
}
// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}

function showSelectOrgDialog(macSns,opKind){
	/*
	var selecteOrgparams = {
		"filter": "",
        "multiSelect": true,
        "parentId": "orgRoot",
        "manageCodes": "hrBaseZKAtt",
        "orgKindIds": "psm",
        "includeDisabledOrg": false,
        "listMode": false,
        "showCommonGroup": false,
        "cascade": true,
        "selected": []
    };
    */
    var selectOrgparams = OpmUtil.getSelectOrgDefaultParams();
    selectOrgparams =  jQuery.extend(selectOrgparams, {multiSelect: true, manageCodes: "hrBaseZKAtt",selectableOrgKinds: "ogn,dpt,pos,psm" });
    selectOrgparams['selectableOrgKinds']='psm';
    var options = { 
    	params: selectOrgparams, 
    	confirmHandler: function(){
    		var data = this.iframe.contentWindow.selectedData;
        	if (data.length == 0) {
        		Public.errorTip("请选择组织");
        		return;
        	}
        	var psmIds=new Array();
        	$.each(data,function(i,o){
        	    psmIds.push(o.id);
        	});
        	var _self=this;
        	UICtrl.confirm('您确定要执行该操作吗?', function() {
        		_self.close();
		    	Public.ajax(web_app.name + "/zkAttAction!saveChoosePSMCmd.ajax",{opKind:opKind,psmIds:$.toJSON(psmIds),macSns:$.toJSON(macSns)});
		    });
        }, 
        closeHandler: function(){},
        title : "选择组织"
   };
   OpmUtil.showSelectOrgDialog(options);
}
//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

//添加按钮 
function addHandler() {
	var organId=$('#mainOrganId').val();
	if(organId==''){
		Public.tip('请选择单位！'); 
		return;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/zkAttAction!showInsertWebMachines.load', ok: insert,init:initAjaxDialog, close: dialogClose});
}

//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.id;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/zkAttAction!showUpdateWebMachines.load', param:{id:id}, ok: update,init:initAjaxDialog, close: dialogClose});
}
function initAjaxDialog(doc){
	var $el=$('#detailManagerName');
	$el.orgTree({filter:'psm',
		manageType:'hrBaseZKAtt',
		back:{
			text:$el,
			value:'#detailManagerId',
			id:'#detailManagerId',
			name:$el
		}
	});
	var id=$('#detailId').val();
	if(id!=''){
		UICtrl.disable($('#macSn',doc));
	}
}
//删除按钮
function deleteHandler(){
	DataUtil.del({action:'zkAttAction!deleteWebMachines.ajax',
		gridManager:gridManager,
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}

//新增保存
function insert() {
	var id=$('#detailId').val();
	if(id!='') return update();
	var organId=$('#mainOrganId').val();
	if(organId==''){
		Public.tip('请选择单位！'); 
		return;
	}
	$('#submitForm').ajaxSubmit({url: web_app.name + '/zkAttAction!insertWebMachines.ajax',
		param:{orgId:organId,orgName:$('#mainOrganName').val(),fullId:$('#mainFullId').val()},
		success : function(data) {
			$('#detailId').val(data);
			refreshFlag = true;
		}
	});
}

//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/zkAttAction!updateWebMachines.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}


//启用
function enableHandler(){
	DataUtil.updateById({ action: 'zkAttAction!updateWebMachinesState.ajax',
		gridManager: gridManager, param:{status:1},
		message:'确实要启用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}
//禁用
function disableHandler(){
	DataUtil.updateById({ action: 'zkAttAction!updateWebMachinesState.ajax',
		gridManager: gridManager,param:{status:-1},
		message: '确实要禁用选中数据吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		
}

function showChooseOrgDialog(fn){
	var  ids = DataUtil.getSelectedIds({gridManager: gridManager});
    if (!ids) {
        return;
    }
    window['showChooseOrgDialogFn']=fn;
    if (!selectOrgDialog) {
        selectOrgDialog = UICtrl.showDialog({
            title: "选择机构...",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="movetree"></ul></div>',
            init: function () {
                $('#movetree').commonTree({
                	loadTreesAction:'orgAction!queryOrgs.ajax',
            		parentId :'orgRoot',
            		manageType:'hrBaseZKAtt',
            		getParam : function(e){
            			if(e){
            				return {showDisabledOrg:0,displayableOrgKinds : "ogn,dpt"};
            			}
            			return {showDisabledOrg:0};
            		},
            		changeNodeIcon:function(data){
            			data[this.options.iconFieldName]= OpmUtil.getOrgImgUrl(data.orgKindId, data.status);
            		},
            		IsShowMenu:false
                });
            },
            ok: function(){
            	var moveToNode = $('#movetree').commonTree('getSelected');
			    var moveToId = moveToNode.id;
			    var moveToName=moveToNode.name;
			    var moveToFullId=moveToNode.fullId;
			    if (!moveToId) {
			        Public.tip('请选择组织节点！');
			        return false;
			    }
			    var params = {};
			    params.orgId = moveToId;
			    params.orgName = moveToName;
			    params.fullId = moveToFullId;
			    params.ids = $.toJSON(ids);
			    window['showChooseOrgDialogFn'].call(window,params);
            },
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        selectOrgDialog.show().zindex();
    }
}

function moveHandler(){
	showChooseOrgDialog(function(params){
		 Public.ajax(web_app.name + "/zkAttAction!moveWebMachines.ajax", params, function (data) {
	    	reloadGrid();
			selectOrgDialog.hide();
		});
	});
}
//设备人员操作(选择组织)
function saveChooseORGCmd(macSns,opKind){
	showChooseOrgDialog(function(params){
		UICtrl.confirm('您确定要执行该操作吗?', function() {
			params['opKind']=opKind;
			params['macSns']=$.toJSON(macSns);
		    Public.ajax(web_app.name + "/zkAttAction!saveChooseORGCmd.ajax",
		    	params,
		    	function(){
		    		selectOrgDialog.hide();
		    	}
		    );
		});
	});
}

function showGroupChooseDialog(fn){
	window['showGroupChooseDialogFn']=fn;
	UICtrl.showMoveTreeDialog({
		title:'选择考勤分组',kindId:CommonTreeKind.AttKind,
		save:function(parentId,node){
			window['showGroupChooseDialogFn'].call(window,parentId,node);
		}
	});
}

function machineChooseGroup(){
	showGroupChooseDialog(function(parentId,node){
		$('#detailFolderKindId').val(parentId);
		$('#detailFolderKindName').val(node.name);
	});
}
function modifAttGroup(){
	showGroupChooseDialog(function(parentId,node){
		DataUtil.updateById({action:'zkAttAction!modifAttGroup.ajax',
			gridManager:gridManager,param:{folderKindId:parentId},
			onSuccess:function(){
				reloadGrid();
			}
		});
	});
}

function syncAttGroup(){
	showGroupChooseDialog(function(parentId,node){
		UICtrl.confirm('您确定要同步人员数据吗?', function() {
		    Public.ajax(web_app.name + "/zkAttAction!syncAttGroup.ajax",{folderKindId:parentId});
		});
	});
}
function compelSyncMachines(){
	var data = gridManager.getSelectedRows();
	if (!data || data.length < 1) {
		Public.tip('请选择数据！');
		return false;
	}
	var flag=true;
	var rows=new Array(),state;
	$.each(data,function(i,o){
		state=o['state'];
		if(state!='1'){
			Public.tip('设备"'+o['macName']+'"未启用，不能执行该操作！');
			flag=false;
			return false;
		}
		rows.push({
			macSn:o['macSn'],
			fpVersion:o['fpVersion'],
			folderKindId:o['folderKindId']
		});
	});
	if(!flag) return;
	UICtrl.confirm('您确定要强制同步人员数据吗?', function() {
		Public.ajax(web_app.name + "/zkAttAction!compelSyncMachines.ajax",{chooseData:$.toJSON(rows)});
	});
}

function managerAtt(macSn,name){
	var url=web_app.name + '/zkAttAction!forwardListHumAttRecord.do?macSn='+macSn+'&macName='+encodeURI(encodeURI(name));
	parent.addTabItem({ tabid: 'zkAttRecord'+macSn, text:"打卡记录", url:url});
}

function modifManagerOrg(){
	var row = gridManager.getSelectedRow();
	if(!row){
		Public.tip('请选择设备！');
		return false;
	}
	UICtrl.showFrameDialog({
		url: web_app.name + '/zkAttAction!forwardWebMachinesManagerOrg.do', 
		param : {
			macSnId : row.id
		},
		title : "设备["+row.macSn+"::"+row.macName+"]管理单位",
		width : 880,
		height : 400,
		cancelVal: '关闭',
		ok :false,
		cancel:true
	});
}