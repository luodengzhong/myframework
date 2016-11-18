var taskManageType='taskBaseManage';
var managerArray=new Array();//管理者(下游评价人)
var executorArray=new Array();//执行者
var ownerArray=new Array();//责任人
var deptArray=new Array();//责任部门
//隐藏操作链接
function hideChooseLink(){
	$('a.GridStyle').hide();
}
//加载已存在的处理人信息
function queryTaskPerson(taskId){
	Public.ajax(web_app.name + '/planAuditAction!queryTaskOrg.ajax', {taskId:taskId}, function(data){
		var kindId=null;
		$.each(data,function(i,d){
			kindId=d['taskOrgKind'];
			if($.isArray(window[kindId+'Array'])){
				window[kindId+'Array'].push(d);
			}
		});
		//处理人列表排序
		managerArray.sort(managerArraySort);
		initShowDivText('manager');
		initShowDivText('executor');
		initShowDivText('owner');
		initShowDivText('dept');
	});
}
//处理人列表排序
function managerArraySort(o1,o2){
	var a=o1['sequence'],b=o2['sequence'];
	return a>b?1:-1
}
//打开机构选择对话框
function showChooseExecutorDialog(){
	var personKind='executor';//执行人列表
	var personArray=window[personKind+'Array'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "执行人选择",
		confirmHandler: function(){
			var data = this.iframe.contentWindow.selectedData;
			if (data.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}
			//清空数组
			personArray.splice(0,personArray.length);
			$.each(data,function(i,o){
				o['orgId']=o['id'];
				o['orgName']=o['name'];
				o['taskOrgKind']='executor';
				o['sequence']=(i+1);
				personArray.push(o);
			});
			initShowDivText(personKind);
			this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				$.each(personArray,function(i,d){
					addFn.call(window,d);
				});
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		}
	};
	showSelectOrgDialog(options);
}
//打开人员选择对话框
function showSelectOrgDialog(options){
	OpmUtil.showSelectOrgDialog(options);
}
//打开管理者(下游评价人)选择框
function showChooseManagerDialog(){
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();
    var params = $.extend({}, selectOrgParams);
    var options={
        title: '处理人选择',
        width: 800,
        height: 380,
        url: web_app.name + '/workflowAction!showCounterSignDialog.do',
        param: params,
        init:function(){
        	var addFn=this.iframe.contentWindow.addData;
			if($.isFunction(addFn)){//初始化已选择列表
			   this.iframe.contentWindow.isInitializingData = true;
				$.each(managerArray,function(i,d){
					d['groupId']=d['sequence'];
					addFn.call(window,d);
				});
				this.iframe.contentWindow.isInitializingData = false;
			}
			try{
				var gridManager=this.iframe.contentWindow.gridManager;
				//gridManager.toggleCol('groupId', false);//不用分组
			}catch(e){}
        },
        ok: function(){
        	var fn = this.iframe.contentWindow.getChooseGridData;
		    var params = fn();
		    if (!params) { return;}
		    //清空数组
			managerArray.splice(0,managerArray.length);
			$.each(params,function(i,o){
				o['orgId']=o['handlerId'];
				o['orgName']=o['handlerName'];
				o['taskOrgKind']='manager';
				o['id']=o['handlerId'];
				o['name']=o['handlerName'];
				o['sequence']=o['groupId'];
				managerArray.push(o);
			});
			//处理人列表排序
			managerArray.sort(managerArraySort);
			initShowDivText('manager');
			this.close();
        },
        cancelVal: '关闭',
        cancel: true
    };
   showManagerDialog(options);
}
//打开处理人对话框
function showManagerDialog(options){
	UICtrl.showFrameDialog(options);
}


//打开责任人和责任部门
function showChooseOwnerDialog(){
//	var personKind='owner';//责任人列表
//	var ownerArray=window[personKind+'Array'];
	var selectOrgParams = OpmUtil.getSelectOrgDefaultParams	();
	selectOrgParams['selectableOrgKinds']='psm';
	var options = { params: selectOrgParams,title : "执行人选择",
		confirmHandler: function(){
			var params = this.iframe.contentWindow.selectedData;
		    var ownerids;
		    var ownernames;
		    var deptids;
		    var deptnames;
			if (params.length == 0) {
				Public.errorTip("请选择数据。");
				return;
			}			
			    //清空数组
			    ownerArray.splice(0,ownerArray.length);
				$.each(params,function(i,o){
					//var owner = new Array();  
					o['orgId']=o['id'];
					o['orgName']=o['name'];
					o['fullName']=o['fullName'];
					o['taskOrgKind']='owner';
					o['sequence']=o[i+1];
					if(ownerids){
						ownerids = ownerids+","+o['id'];
						ownernames =  ownernames+","+o['name'];				
					}else{
						ownerids = o['id'];
						ownernames = o['name'];
					}
					ownerArray.push(o);
				});
				deptArray.splice(0,deptArray.length);
				$.each(params,function(i,o){
					var dept = new Array(); 
					dept['orgId']=o['centerId'];
					dept['orgName']=o['centerName'];
					dept['fullName']=o['fullName'];
					//fullName,	就使用人员的			
					dept['taskOrgKind']='dept';
					dept['sequence']=o['groupId'];
					if(deptids){
						if(deptids.indexOf(o['centerId']) < 0 )
						{
							deptids = deptids+","+o['centerId'];
							deptnames =  deptnames+","+o['centerName'];
							deptArray.push(dept);
						}
					}else{
							deptids = o['centerId'];
							deptnames = o['centerName'];
							deptArray.push(dept);
						//否则已存在，不处理部门
					}
				});
				//处理责任人ids,names,处理则部门isd，names

				$('#ownerId').val(ownerids);
				$('#ownerName').val(ownernames);
				
				$('#dutyDeptId').val(deptids);
				$('#dutyDeptName').val(deptnames);
				//处理人列表排序
				managerArray.sort(managerArraySort);
				initShowDivText('owner');
				initShowDivText('dept');
				this.close();
		},
		initHandler:function(){
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				$.each(ownerArray,function(i,d){
					addFn.call(window,d);
				});
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		}
	};
	showSelectOrgDialog(options);
}
//初始化显示
function initShowDivText(personKind){
	var personArray=window[personKind+'Array'];
	var showDiv=$('#'+personKind+'ShowDiv');
	var html=new Array();
	$.each(personArray,function(i,o){
		html.push('<span title="',o['fullName'],'" style="color:#2D65DC;">');
		html.push(o['orgName']);
		html.push('</span">;&nbsp;');
	});
	showDiv.html(html.join(''));
}
//清空已选择列表
function clearChooseArray(personKind){
	var personArray=window[personKind+'Array'];
	$('#'+personKind+'ShowDiv').html('');
	//清空数组
	personArray.splice(0,personArray.length);
}
/****获取数据用于保存***/
function getDeptArray(){
	return encodeURI($.toJSON(deptArray));
}
function getOwnerArray(pagetype){
	if(pagetype&&pagetype !=1&&ownerArray.length<=0){
		Public.errorTip("责任人不允许为空!");
		return false;
	}
	return encodeURI($.toJSON(ownerArray));
}
function getExecutorArray(){
	return encodeURI($.toJSON(executorArray));
}
function getManagerArray(pagetype){
	if(pagetype&&pagetype !=1&&managerArray.length<=0){
		Public.errorTip("评价人不允许为空!");
		return encodeURI($.toJSON(''));;
	}
	return encodeURI($.toJSON(managerArray));
}
//注册责任人及责任部门选择
function initOwnerAndDeptChoose(){
	/*********注册选择责任人***********/
	//如果是项目的话，责任人根据选择的责任部门选择人员，人员选择后更改责任部门为人员所在中心。
	//如果是管理的话，责任人根据选择的责任部门选择人员，人员选择后更改责任部门为人员所在部门。
	//设置人员选择为批量选择，同时读取人员所在部门设置为责任部门数据
	/*var managerType =  $('#managerType').val();
	managerType = managerType?managerType:0;
	if(managerType&&1 == managerType){
	    $('#ownerName').searchbox({
	        type: 'mm',
	        name: 'operatorSelect',
	        getParam : function() {
	    		var searchQueryCondition = ' 1=1 ';
				var deptId=$('#dutyDeptId').val();    		
	    		if(deptId){
	    			searchQueryCondition = searchQueryCondition + " and full_id like '%/"+deptId+"%'";
	    		}    		
				return {searchQueryCondition : searchQueryCondition};
			},
	        callBackControls: {
	            personMemberName: '#ownerName',
	            personMemberId: '#ownerId',
	            centerId: '#dutyDeptId',
	            centerName: '#dutyDeptName'	            
	        },
	    	onChange: function(data){
	    		$('#dutyDeptId').val(data.centerId);
	        	$('#dutyDeptName').val(data.centerName);
	        	$('#dutyDeptName').val(data.centerName);
	        	$('#dutyDeptName_view').text(data.centerName);
	        	
	    	}
	    });
	    *//*********注册选择责任部门***********//*
	    $('#dutyDeptName').orgTree({
	    	filter:'ogn,dpt',height:230,
	    	getParam:function(){
				return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:" (org_kind_id = 'ogn' OR (org_kind_id = 'dpt'	AND CENTER_ID = ID))"};
			},
	    	manageType:taskManageType,
	    	getViewWidth:function(){
	    		if(this.mode=='tree'){
	    			return 190;
	    		}
	    		return null;
	    	},
	    	back:{
	    		text:'#dutyDeptName',
	    		value:'#dutyDeptId',
	    		id:'#dutyDeptId',
	    		name:'#dutyDeptName'
	    	},
	        onChange: function (data){
	        	$('#ownerId').val('');
	        	$('#ownerName').val('');
	        	$('#ownerName_text').val('');
	        }
	    });
	}else{
    $('#ownerName').searchbox({
        type: 'mm',
        name: 'operatorSelect',
        getParam : function() {
    		var searchQueryCondition = ' 1=1 ';
			var deptId=$('#dutyDeptId').val();    		
    		if(deptId){
    			searchQueryCondition = searchQueryCondition + " and full_id like '%/"+deptId+"%'";
    		}    		
			return {searchQueryCondition : searchQueryCondition};
		},
        callBackControls: {
            personMemberName: '#ownerName',
            personMemberId: '#ownerId',
            deptId: '#dutyDeptId',
            deptName: '#dutyDeptName'
            
        },
    	onChange: function(data){
    		$('#dutyDeptId').val(data.deptId);
    		$('#ownerName').val(data.personMemberName);
        	$('#dutyDeptName').val(data.deptName);
        	$('#dutyDeptName_view').text(data.deptName);
        	
    	}
    });
    *//*********注册选择责任部门***********//*
    $('#dutyDeptName').orgTree({
    	filter:'ogn,dpt',height:230,
    	getParam:function(){
			return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"};
		},
    	manageType:taskManageType,
    	getViewWidth:function(){
    		if(this.mode=='tree'){
    			return 190;
    		}
    		return null;
    	},
    	back:{
    		text:'#dutyDeptName',
    		value:'#dutyDeptId',
    		id:'#dutyDeptId',
    		name:'#dutyDeptName'
    	},
        onChange: function (data){
        	$('#ownerId').val('');
        	$('#ownerName').val('');
        	$('#ownerName_text').val('');
        }
    });
    }*/
}
//获取计划开始时间
function getStartDate(){
	var value = $("#startDate").val();
	if(value==''){
		Public.errorTip("请输入计划开始时间!");
		return false;
	}
	if (!Public.isDate(value)) {
		Public.errorTip("请输入计划开始时间!");
		return false;
	}
	return value;
}
//获取计划完成时间
function getFinishDate(){
	var value = $("#finishDate").val();
	if(value==''){
		Public.errorTip("请输入计划完成时间!");
		return false;
	}
	if (!Public.isDate(value)) {
		Public.errorTip("请输入计划完成时间!");
		return false;
	}
	return value;
}

function openPlanDetail(){
	var planTaskId=$('#planTaskId').getValue();
	if(!planTaskId){
		planTaskId=$('#taskId').getValue();
	}
	
	var url=web_app.name + '/planTaskManagerAction!showTaskDetail.do?taskId='+planTaskId;
	parent.addTabItem({ tabid: 'viewTask'+planTaskId, text: '任务详情', url:url});
	
}