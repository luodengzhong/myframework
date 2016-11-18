var gridManager = null, refreshFlag = false;
var dataSource={
		yesOrNo:{1:'是',0:'否'}
     };
var studentGridManager=null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	initializeGrid();
    initializeDialog();
    });

function initializeDialog(){
    $('#chooseStudent').comboDialog({type:'hr',name:'personArchiveSelect',width:635,
        dataIndex:'archivesId',
        checkbox:true,onChoose:function(){
        }});
}

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	$('#maintree').commonTree({
		loadTreesAction:'orgAction!queryOrgs.ajax',
		parentId :'orgRoot',
		manageType:'hrBasePersonquatoData',
		getParam : function(e){
			if(e){
				return {showDisabledOrg:0,orgKindId : "ogn,dpt"};
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
		html.push('专项班');
	}else{
		fullId=data.fullId,fullName=data.fullName;
		html.push('<font style="color:Tomato;font-size:13px;">[',fullName,']</font>专项班');
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
		//addHandler: addHandler, 
		updateHandler: function(){
			updateHandler();
		},
		deleteHandler: deleteHandler,
		studentGroupHandler:{
			id:'studentGroupHandler',
			text:'分组管理',
			img:'application.png',
			click:function(){
				var row = gridManager.getSelectedRow();
				if(!row){
					Public.tip("请选择班级！");
					return;
				}
				var clazzId=row.trainingSpecialClassId;
				var url = web_app.name+'/trainingStudentGroupAction!forwardList.do?trainingSpecialClassId='+clazzId;
				parent.addTabItem({tabid:'studentGroupHandler'+clazzId,text:'班级分组管理',url:url});
			}
		},
		studentDetailHandler:{
            id:'studentDetailHandler',
            text:'学员详情',
            img:'icon_user.gif',
            click:function(){
                var row = gridManager.getSelectedRow();
                if (!row) {
                    Public.tip('请选择数据！');
                    return;
                }
                var clazzId = row.trainingSpecialClassId;
                var url=web_app.name + '/trainingClassStudentAction!forwardList.do?trainingSpecialClassId='+clazzId;
                parent.addTabItem({ tabid: 'StudentDetailView'+clazzId, text: '查看学员详情', url:url});
            }
        },
        viewClassCourse:{
            id:'viewClassCourse',
            text:"课程选择",
            img:'book_edit.png',
            click:function(){
                var row = gridManager.getSelectedRow();
                if (!row) {
                    Public.tip('请选择数据！');
                    return;
                }
                var trainingSpecialClassId = row.trainingSpecialClassId;
                var url = web_app.name+'/trainingSpecialClassAction!forwardCourseList.do?trainingSpecialClassId='+trainingSpecialClassId;
              	parent.addTabItem({tabid:'classCourseHandler'+trainingSpecialClassId,text:'班级课程管理',url:url});
            }
        },
        statisticsCreditHandler:{id:'statisticsCredit',text:'统计学分',img:'application_firefox.gif',click:statisticsCredit},
        inputExamScoreHandler:{id:'inputExamScore',text:'录入学员考试成绩',img:'page_edit.gif',click:inputExamScore},
        trainingChangeApplyHandler:{id:'trainingChangeApply',text:'填写培训变更申请表',img:'action_refresh_blue.gif',click:trainingChangeApply},
        exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		}
        // sendClassNoticeHandler:{id:'sendClassNotice',text:'发送班级课程通知',img:'page_next.gif',click:sendClassNotice}
       // trainingClassChangeHandler:{id:'trainingClassChange',text:'培训变更申请',img:'action_refresh_blue.gif',click:trainingClassChange}
	});
	gridManager = UICtrl.grid('#maingrid', {
        columns: [
           { display: "机构", name: "applyCompany", width: 100, minWidth: 60, type: "string", align: "left" },
           { display: "部门", name: "applyDept", width: 100, minWidth: 60, type: "string", align: "left" },
           { display: "班级名称", name: "className", width: 100, minWidth: 60, type: "string", align: "left" },
           { display: "班级状态", name: "classStatusTextView", width: 70, minWidth: 60, type: "string", align: "center"},
           { display: "未开课课程数目", name: "noOpenCourseNum", width: 50, minWidth: 50, type: "number", align: "center"
            /*render:function(item){
				 if(item.noOpenCourseNum>=1){
					return '<font style="color:red;width:100%;height:100%;font-size:15px">'+item.noOpenCourseNum+'</font>';
				} 
				return item.noOpenCourseNum;}*/
           },
           { display: "培训级别", name: "trainingLevelTextView", width: 100, minWidth: 60, type: "string", align: "left" },
           { display: "是否新员工入职培训", name: "isNewStaffTrain", width: 100, minWidth: 60, type: "string", align: "left",
             render:function(item){
		       return dataSource.yesOrNo[item.isNewStaffTrain];
		       }
		   },
		   { display: "是否公司高管培训", name: "isHighLeaderTrain", width: 100, minWidth: 60, type: "string", align: "left",
             render:function(item){
		       return dataSource.yesOrNo[item.isHighLeaderTrain];
		       }
		   },
           { display: "班级负责人", name: "personMemberName", width: 80, minWidth: 60, type: "string", align: "left" },
           { display: '培训计划', columns:[
           { display: "培训人数", name: "trainStaffNum", width: 100, minWidth: 60, type: "number", align: "left" },
           { display: "开班时间", name: "openTime", width: 100, minWidth: 60, type: "dateTime", align: "left" },
           { display: "结业时间", name: "graduatedTime", width: 100, minWidth: 60, type: "dateTime", align: "left" },
           { display: "培训费用", name: "trainFee", width: 80, minWidth: 60, type: "string", align: "left"}]},
           { display: '实际完成', columns:[
           { display: "培训人数", name: "realityTrainStaffNum", width: 100, minWidth: 60, type: "number", align: "left" },
           { display: "开班时间", name: "realityOpenTime", width: 100, minWidth: 60, type: "dateTime", align: "left" },
           { display: "结业时间", name: "realityGraduatedTime", width: 100, minWidth: 60, type: "dateTime", align: "left" },
           { display: "培训费用", name: "realityTrainFee", width: 80, minWidth: 60, type: "string", align: "left"}]}
        ],
		dataAction : 'server',
		url: web_app.name+'/trainingSpecialClassAction!slicedQuery.ajax',
		pageSize : 20,
	    manageType:'hrBasePersonquatoData',
		width : '100%',
		height : '100%',
		heightDiff : -10,
		headerRowHeight : 25,
		rowHeight : 25,
		sortName:'openTime',
		sortOrder:'desc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			updateHandler(data.id);
		}
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
//培训变更流程
function  trainingClassChange(){
	var row = gridManager.getSelectedRow();
    if (!row) {
           Public.tip('请选择数据！'); return;
               }
    var trainingSpecialClassId = row.trainingSpecialClassId;
}

function inputExamScore(){
	  var row = gridManager.getSelectedRow();
      if (!row) {
          Public.tip('请选择数据！'); return;
         }
     var trainingSpecialClassId = row.trainingSpecialClassId;
     var url=web_app.name + '/trainingClassStudentAction!forwardListScore.do?trainingSpecialClassId='+trainingSpecialClassId;
     parent.addTabItem({ tabid: 'inputExamScore'+trainingSpecialClassId, text: '录入学员考试成绩', url:url});
}
//统计学分
function  statisticsCredit(){
	 var row = gridManager.getSelectedRow();
      if (!row) {
          Public.tip('请选择数据！'); return;
          }
     var trainingSpecialClassId = row.trainingSpecialClassId;
	 UICtrl.confirm('确定统计结果吗?',function(){
		$('#submitForm').ajaxSubmit({
			url : web_app.name + '/trainingSpecialClassAction!statisticsClassData.ajax',
			param:{trainingSpecialClassId:trainingSpecialClassId},
			success : function() {
			reloadGrid();
			}
		});
	})
}

function autostatisticsCredit(){
		$('#submitForm').ajaxSubmit({
			url : web_app.name + '/trainingSpecialClassAction!autostatisticsClassData.ajax',
			success : function() {
			reloadGrid();
			}
		});
}
//添加按钮 
function addHandler() {
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingSpecialClassAction!showInsert.load',
	ok: insert, 
	close: dialogClose,
	title:'新增专项班',
	init:initDialog,
	width:600});
}

function initDialog(){
 //选择机构
  var  $el=$('#applyCompany');
	$el.orgTree({filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"},
		manageType:'hrArchivesManage',
		onChange:function(){
		   $('#applyDept').val('');
		   $('#applyDeptId').val('');
		},
		needAuth:false,
		back:{
			text:$el,
			value:'#applyCompanyId',
			id:'#applyCompanyId',
			name:$el
		}
	});
	var $al=$('#applyDept');
		$al.orgTree({filter:'dpt',
		    manageType:'hrArchivesManage',
			getParam:function(){
				var ognId=$('#applyCompanyId').val();
				var mode=this.mode;
				if(mode=='tree'){//更改树的根节点
					return {a:1,b:1,orgRoot:ognId==''?'orgRoot':ognId,searchQueryCondition:"org_kind_id in('ogn','dpt')"};
				}else{
					var param={a:1,b:1},condition=["org_kind_id ='dpt'"];
					if(ognId!=''){//增加根查询参数
						condition.push(" and full_id like '%/"+ognId+"%'");
					}
					param['searchQueryCondition']=condition.join('');
					return param;
				}
			 },
			back:{
				text:$al,
				value:'#applyDeptId',
				id:'#applyDeptId',
				name:$al
			}
		});
}
//编辑按钮
function updateHandler(id){
	if(!id){
		var row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
		id=row.trainingSpecialClassId;
	}
	UICtrl.showAjaxDialog({url: web_app.name + '/trainingSpecialClassAction!showUpdate.load', param:{trainingSpecialClassId:id},
	ok: update, 
	close: dialogClose,
	width:600,
	init:initDialog,
	title:"修改专项班信息"});
}

//删除按钮
function deleteHandler(){
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	UICtrl.confirm('确定删除吗?',function(){
		Public.ajax(web_app.name + '/trainingSpecialClassAction!delete.ajax',
		{trainingSpecialClassId:row.trainingSpecialClassId}, 
		function(){
		 reloadGrid();
		});
	});
}
//新增保存
function insert() {
	var id=$('#trainingSpecialClassId').val();
	if(id!='') return update();
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingSpecialClassAction!insert.ajax',
		success : function(data) {
			$('#trainingSpecialClassId').val(data);
			refreshFlag = true;
		}
	});
}
//编辑保存
function update(){
	$('#submitForm').ajaxSubmit({url: web_app.name + '/trainingSpecialClassAction!update.ajax',
		success : function() {
			refreshFlag = true;
		}
	});
}


function  trainingChangeApply(){
//	var row = gridManager.getSelectedRow();
//	if (!row) {Public.tip('请选择数据！'); return; }
//	var  trainingSpecialClassId=row.trainingSpecialClassId;
	var url=web_app.name + '/trainingChangeApplyAction!forwardTrainingChangeApplyBill.job';
    parent.addTabItem({ tabid: 'trainingChangeApply', text: '培训变更申请', url:url});
}
function sendClassNotice(){
	
	var row = gridManager.getSelectedRow();
	if (!row) {Public.tip('请选择数据！'); return; }
	var  classStatus=row.classStatus;
	var trainingSpecialClassId=$('#trainingSpecialClassId').val();
	if(classStatus==3){
		Public.tip('此班级已经结业,不能发送通知！'); return;
	}
	Public.ajax(web_app.name + '/trainingClassCourseAction!sendCourseNotice.ajax', 
			{trainingSpecialClassId:trainingSpecialClassId,flag:1}, function(){
			reloadGrid();
		});

}
//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
