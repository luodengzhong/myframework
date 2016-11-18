var gridManager = null, refreshFlag = false,selectFunctionDialog=0;
var recruitWay=null;
var work=null;
var maritalStatus=null;
var layout01Manager=null;
var dataSource={
		yesorno:{1:'是',0:'否'}
};

var title=null;
$(document).ready(function() {
	//UICtrl.autoSetWrapperDivHeight();
	 autoSetWrapperDivHeight() ;

	initializeUI();
	initializeGrid();
	initUI();
	recruitWay=$('#recruitWay').combox('getJSONData');
	work=$('#choicePlace').combox('getJSONData');
	maritalStatus=$('#maritalStatus').combox('getJSONData');

	
});


function autoSetWrapperDivHeight(){
        $('html').addClass("html-body-overflow");
        var div = $('#mainWrapperDiv'), pageSize = UICtrl.getPageSize();
        if ($.browser.msie && $.browser.version < 8) {
            div.height(pageSize.h - 10);
        }
        $('#divTreeArea').height(pageSize.h - 40);
        $('#orgTreeDiv').height(pageSize.h - 50);
        var str_data = 'resize-special-event';
        div.data(str_data, pageSize);
        setInterval(function () {
            var _size = UICtrl.getPageSize(), data = div.data(str_data);
            if (_size.h !== data.h) {
                if ($.browser.msie && $.browser.version < 8) {
                    div.data(str_data, _size).height(_size.h - 10);
                }
                $('#divTreeArea').height(_size.h - 40);
                $('#orgTreeDiv').height(_size.h - 50);
            }
        }, 140);
    
}
function initializeUI(){
	 autoSetWrapperDivHeight();
	  UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5,onSizeChanged:function(){
		  layout01Manager._onResize.call(layout01Manager);
	  }});
	  layout01Manager=UICtrl.layout("#layout01", {leftWidth : 200,heightDiff : -5,onSizeChanged:function(){
		 
	  }});
	  $('#layout01').parent().parent().css({borderTop:'0px',borderLeft:'0px'});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBaseRecruitData',
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
		onClick : onFolderTreeNodeClick});
}

function onFolderTreeNodeClick(data) {

	var html=[],fullId='',fullName='';
	if(!data){
		html.push('简历列表');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',title+'---'+fullName,']</font>简历列表');
	}
	$('#listCenter').prev().html(html.join(''));
	$('#mainFullId').val(fullId);
	if (gridManager&&fullId!='') {
		UICtrl.gridSearch(gridManager,{fullId:fullId});
	}else{
		gridManager.options.parms['fullId']='';
	}
	
}

function initUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#infoTypeTree').commonTree({
		kindId : CommonTreeKind.PersonRegisterType,
		onClick : onFolderTypeTreeNodeClick
	});
    var more=$('#toolbar_menumoreOperate');
	more.contextMenu({
		width:"100px",
		eventType:'mouseover',
		autoHide:true,
		overflow:function(){
			var of=more.offset(),height=more.height()+2;
			return {left:of.left,top:of.top+height};
		},
		items:[
			{name:"打印",icon:'enable',handler:printResume},
			{name:"导出",icon:'disable',handler:function(){
				printResume(true);
			}},
			{name:"导出全部",icon:'edit',handler:function(){
				UICtrl.gridExport(gridManager);
			}}
		],
		onSelect:function(){
			this._hideMenu();
		}
	});
}

function onFolderTypeTreeNodeClick(data,folderId){

	var html=[],parentId=folderId;
	if(folderId==CommonTreeKind.PersonRegisterType){
		parentId="";
		html.push('简历列表');
	}else{
		 title=data.name;
		html.push('<font style="color:Tomato;font-size:13px;">[',data.name,']</font>简历列表');
	}
	$('#listCenter').prev().html(html.join(''));
	$('#treeParentId').val(parentId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{parentId:parentId});
	}

}


//初始化表格
function initializeGrid() {
	var hunterId=$('#hunterId').val();
	var sourceType=$('#sourceType').val();
	var toolbarButton={};
	var columns=[];
	if(hunterId==''){
		toolbarButton['addHandler']=addHandler;
		toolbarButton['viewHandler']=function(){viewHandler();};
		toolbarButton['sendResume']={id:'sendResume',text:'发送简历',img:'page_next.gif',click:sendResume};
		toolbarButton['moreOperate']={id:'moreOperate',text:'导出操作',img:'page_settings.gif',click:function(){}};
		toolbarButton['moveHandler']=moveHandler;
		toolbarButton['updateHandler']=function(){updateHandler();};
		
		toolbarButton['interviewHandler']={id:'interview',text:'面试',img:'page_user.gif',click:function(){
			interview();
		}};
		toolbarButton['employHandler']={id:'employ',text:'录用',img:'page_extension.gif',click:function(){
			employ();
		}};
		toolbarButton['waitEmployHandler']={id:'waitEmploy',text:'备选',img:'page_java.gif',click:function(){
			waitEmploy();
		}};
		toolbarButton['dropHandler']={id:'drop',text:'淘汰',img:'page_deny.gif',click:function(){
			drop();
		}};
		toolbarButton['deleteHandler']=deleteHandler;
		toolbarButton['backgroundSurveyHandler']={id:'backgroundSurvey',text:'背景调查',img:'icon_user.gif',click:function(){
			backgroundSurvey();
		}};
        /*toolbarButton['exportExcelHandler']=function(){
			UICtrl.gridExport(gridManager);
		};*/
		columns=[
		{ display: "单位名称", name: "organName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "中心/部门名称", name: "deptName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "应聘岗位名称", name: "applyPosName", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "姓名", name: "staffName", width: 80, minWidth: 60, type: "string", align: "left"
			},	
		{ display: "应聘来源", name: "sourceType", width: 100, minWidth: 60, type: "string", align: "left",
				editor: { type:'combobox',data:recruitWay},
				render: function (item){
					return recruitWay[item.sourceType];
				} },
		{ display: "猎头名称", name: "headhunterName", width: 100, minWidth: 60, type: "date", align: "left" },
		{ display: "移动号码", name: "phoneNumber", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "应聘结果", name: "recruitResultTextView", width: 100, minWidth: 60, type: "string", align: "left",
		render: function (item){
	    		return '<a href="javascript:interviewRecord('+item.writeId+',\''+item.staffName+'\');" class="GridStyle">' + item.recruitResultTextView + '</a>';
			}},	
		{ display: "性别", name: "sexTextView", width: 60, minWidth: 60, type: "string", align: "left" },	
		{ display: "身高(cm)", name: "height", width: 100, minWidth: 60, type: "string", align: "left" },	
		{ display: "年龄", name: "age", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "婚姻状况", name: "maritalStatus", width: 100, minWidth: 60, type: "string", align: "left",
			render:function(item){
				return maritalStatus[item.maritalStatus];
			}},	
		{ display: "首选工作地点", name: "workPlace", width: 100, minWidth: 60, type: "string", align: "left",
				render:function(item){
					return checkBox(item.workPlace);
				} }	,
		{ display: "毕业院校", name: "university", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "专业", name: "specialty", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "最高学历", name: "educationTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "毕业类型", name: "eduformTextView", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "技术职称", name: "jobTitle", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "是否是回流员工", name: "isBackflow", width: 120, minWidth: 60, type: "string", align: "left",
			render:function(item){
				return dataSource.yesorno [item.isBackflow];
			}},	
		{ display: "证件号", name: "idCardNo", width: 100, minWidth: 60, type: "string", align: "left" },		   
		{ display: "填表日期", name: "registerDate", width: 80, minWidth: 60, type: "dateTime", align: "left" },	
		{ display: "到岗时间", name: "employedDate", width: 100, minWidth: 60, type: "date", align: "left" }	,
		{ display: "社会招聘验证码", name: "vaCode", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "推荐人", name: "personMemberName", width: 100, minWidth: 60, type: "string", align: "left" },
		{ display: "备选/淘汰原因", name: "remark", width: 100, minWidth: 60, type: "string", align: "left" }
		];
	}
	var toolbarOptions = UICtrl.getDefaultToolbarOptions(
			toolbarButton);
	gridManager = UICtrl.grid('#maingrid', {
		columns: columns,
		dataAction : 'server',
		url: web_app.name+'/personRegisterInnerAction!slicedQueryPersonRegister.ajax',
		parms:{hunterId:hunterId,sourceType:sourceType},
		manageType:'hrBaseRecruitData',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		checkbox:true,
		sortName:'registerDate',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		
		onDblClickRow : function(data, rowindex, rowobj) {
			viewHandler(data.writeId);
		}
	});
	UICtrl.setSearchAreaToggle(gridManager);

}


// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}
function checkBox(workPlace){
	var workArray=[];
    $.each(workPlace.split(','),function(i,v){
    	workArray.push(work[v]||'');
    });
    return workArray.join(',');
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}

function moveHandler() {
    ids = DataUtil.getSelectedIds({
        gridManager: gridManager,
        idFieldName: "writeId"
    });
    if (!ids) {
        return;
    }

	UICtrl.showMoveTreeDialog({
		gridManager:gridManager,title:'移动到',kindId:CommonTreeKind.PersonRegisterType,
		save:function(parentId){
			DataUtil.updateById({action:'personregisterAction!updatePersonRegisterParentId.ajax',
				gridManager:gridManager,idFieldName:'writeId',param:{parentId:parentId},
				onSuccess:function(){
					reloadGrid();
				}
			});
		}
	});

   
}




//添加按钮 
function addHandler() {
	var hunterId=$('#hunterId').val();
	var sourceType=$('#sourceType').val();
	if(sourceType==4){
	  window.open( web_app.name + '/personregisterAction!showInsertPersonRegister.do?hunterId='+hunterId+'&sourceType='+sourceType,'登记页面');
	}else{
	parent.addTabItem({ 
		tabid: 'HRPerRegAdd',
		text:'应聘人员登记',
		url: web_app.name + '/personregisterAction!showInsertPersonRegister.do?hunterId='+hunterId
		}); 
	}
}

//编辑按钮
function updateHandler(writeId){
	if(!writeId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		writeId=row.writeId;
	}
	var sourceType=$('#sourceType').val();
	if(sourceType==4){
		  window.open( web_app.name + '/personregisterAction!showUpdatePersonRegister.do?writeId=' 
					+ writeId,'修改简历详细');

	}else{
	parent.addTabItem({ 
		tabid: 'HRPerRegAdd'+writeId,
		text: '应聘人员登记 ',
		url: web_app.name + '/personregisterAction!showUpdatePersonRegister.do?writeId=' 
			+ writeId+'&isInnerUpdate='+1
		}); 
	}
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	
	UICtrl.confirm('确定删除吗?',function(){
		//所需参数需要自己提取 {id:row.id}
		Public.ajax(web_app.name + '/personregisterAction!deletePersonRegister.ajax', 
				{writeId:row.writeId,recruitResult:row.recruitResult}, function(){
			reloadGrid();
		});
	});
}

//查看按钮

function viewHandler(writeId){
	if(!writeId){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		writeId=row.writeId;
	}
	
	parent.addTabItem({ 
		tabid: 'HRPerRegAdd'+writeId,
		text: '查看简历详情 ',
		url: web_app.name + '/personregisterAction!showViewPersonRegister.do?writeId=' 
			+ writeId+'&isReadOnly=true'
		}); 
}
//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updatePersonRegister.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}

//面试按钮  进入面试流程
function interview(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	 var writeId = row.writeId;
	 var  staffName=row.staffName;
	 
	 var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
	 
	 UICtrl.showFrameDialog({
			title : "选择面试官",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {
				insertInterviewApply(this,writeId,staffName);
			},
			close : dialogClose
		});
	
	/* parent.addTabItem({ 
			tabid: 'HRInterViewAdd'+writeId,
			text:'面试详情',
			url: web_app.name + '/interviewApplyAction!showInsertDetailByWriteId.do?writeId=' 
				+ writeId
			}); */
	
}
//将面试测评信息插入面试测评表中  状态为1  同意面试
function insertInterviewApply(_self,writeId,staffName){
	var data = _self.iframe.contentWindow.selectedData;
	
	Public.ajax(web_app.name + "/interviewApplyAction!insert.load",
			{writeId:writeId,staffName:staffName,status:1,data:$.toJSON(data)}, function() {
				
				refreshFlag = true;
				_self.close();
				parent.addTabItem({ 
				tabid: 'HRInterViewAdd'+writeId,
				text:'修改面试测评',
				url: web_app.name + '/interviewApplyAction!showInsertDetailByWriteId.do?writeId=' 
					+ writeId
				}); 
			});
   
}


function saveInsertInterviewApply(_self,writeId,staffName){
	var data = _self.iframe.contentWindow.selectedData;
	if (data.length<1){
		Public.tip("请选择面试官!");
		return;
	}
		
	Public.ajax(web_app.name + "/interviewApplyAction!insert.load",
			{writeId:writeId,staffName:staffName,status:0,data:$.toJSON(data)}, function() {
				refreshFlag = true;
				_self.close();
			});
}
//录用按钮
function employ(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var writeId = row.writeId;
	parent.addTabItem({ 
		tabid: 'HREmployApply'+writeId,
		text: '新员工录用申请 ',
		url: web_app.name + '/employApplyAction!forwardBill.job?writeId=' 
			+ writeId
		}); 
}

//备选按钮
function waitEmploy(){
	/*
	DataUtil.updateById({ action: 'personregisterAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'writeId', param:{recruitResult:1},
		message:'确定备选吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		*/
	 var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var writeId = row.writeId;
	var staffName=row.staffName;
	 UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showUpateRemarkDetail.load', 
			title:"提示：请填写备选原因",
			param:{writeId:writeId,recruitResult:1},
			ok: function (){
			     updateStatus();
			}, 
			width:400,
			height:100,
			close: this.close()});  
	
}

//淘汰按钮
function drop(){
	/*DataUtil.updateById({ action: 'personregisterAction!updateStatus.ajax',
		gridManager: gridManager,idFieldName:'writeId', param:{recruitResult:-1},
		message:'确定淘汰吗?',
		onSuccess:function(){
			reloadGrid();	
		}
	});		*/
	
   var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var writeId = row.writeId;
	var staffName=row.staffName;

	 UICtrl.showAjaxDialog({url: web_app.name + '/personregisterAction!showUpateRemarkDetail.load', 
			title:"提示：请填写淘汰原因",
			param:{writeId:writeId,recruitResult:-1},
			ok: function (){
			     updateStatus();
			}, 
			width:400,
			height:100,
			close: this.close()});  
}

function updateStatus(){
	var _self=this;
	$('#submitForm').ajaxSubmit({url: web_app.name + '/personregisterAction!updateStatus.ajax',
	  success : function() {
	  	_self.close();
		reloadGrid();
			}});
}
//面试记录
function interviewRecord(writeId,name){
	parent.addTabItem({
		tabid: 'HRInterViewApply'+writeId,
		text: '面试测评记录',
		url: web_app.name + '/interviewApplyAction!forwardListDetail.do?writeId='+writeId
	});
	
}


function turn(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var writeId=row.writeId;
	Public.ajax(web_app.name + '/employApplyAction!turnInfo.ajax',{writeId:writeId},function(){
		reloadGrid();
	});
	
}

function sendResume(){
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！'); 
	    return; 
	}
	 var writeId = row.writeId;
	 var  staffName=row.staffName;
	 
      var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
			
		UICtrl.showFrameDialog({
			title : "选择面试官",
			url : web_app.name + "/orgAction!showSelectOrgDialog.do",
			param : selectOrgParams,
			width : 700,
			height : 400,
			ok : function() {				
				saveInsertInterviewApply(this,writeId,staffName);
			},
			close : dialogClose
		});
}


function  backgroundSurvey(){
	var row = gridManager.getSelectedRow();
	if (!row) {
		Public.tip('请选择数据！'); 
	    return; 
	}
	 var writeId = row.writeId;
	 var  staffName=row.staffName;
	 parent.addTabItem({ 
		tabid: 'HRbackgroundSurvey'+writeId,
		text: '新员工背景调查 ',
		url: web_app.name + '/backgroundSurveyAction!forwardList.job?writeId=' 
			+ writeId
		}); 
}
function importResume(){
	$('#upLoad').uploadButton();
}

function printResume(flag){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var writeId = row.writeId;
	flag=flag||false;
  	window.open(web_app.name + '/personregisterAction!createPdf.load?writeId='+writeId+'&flag='+flag);	
}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
