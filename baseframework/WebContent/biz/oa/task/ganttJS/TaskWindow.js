
TaskWindow = function () {
    TaskWindow.superclass.constructor.call(this);
    //body        
    var bodyEl = this.getBodyEl();
    mini.update(this.url, bodyEl);
    this.initControls();
    this.initEvents();
};

mini.extend(TaskWindow, mini.Window, {
    url: web_app.name+"/biz/oa/task/TaskWindow.html",
    width: 580,
    height: 380,
    showFooter: true,
    showModal: true,
    getJQEl:function(el){
    	return $(el.getEl()).find('input.mini-buttonedit-input');
    },
    initControls: function () {
        //footer buttons
        var footerEl = this.getFooterEl();
        mini.setStyle(footerEl, "padding:8px;padding-right:10px;text-align:right;");
        footerEl.innerHTML = '<a name="ok" class="mini-button" width="60" style="margin-right:10px;">确定</a> <a name="cancel" class="mini-button" width="60">取消</a>';
        mini.parse(footerEl);

        //获取控件对象

        this.ok = mini.getbyName("ok", this);
        this.cancel = mini.getbyName("cancel", this);

        this.addLink = mini.get("twin_linkadd");
        this.delLink = mini.get("twin_linkdel");
        this.addRes = mini.get("twin_resadd");
        this.delRes = mini.get("twin_resdel");

        this.Name = mini.get("twin_name");
        //this.Principal = mini.get("twin_principal");
        this.PercentComplete = mini.get("twin_percentcomplete");
        //this.Department = mini.get("twin_department");
        this.Duration = mini.get("twin_duration");
        //this.Work = mini.get("twin_work");
        this.Start = mini.get("twin_start");
        this.Finish = mini.get("twin_finish");
        this.ActualStart = mini.get("twin_actualstart");
        this.ActualFinish = mini.get("twin_actualfinish");
        this.PredecessorLink = mini.get("twin_linkgrid");
        this.Assignments = mini.get("twin_resgrid");
        this.ConstraintType = mini.get("twin_constrainttype");
        this.ConstraintDate = mini.get("twin_constraintdate");
        this.FixedDate = mini.get("twin_fixeddate");
        this.Milestone = mini.get("twin_milestone");
        this.Critical2 = mini.get("twin_critical2");
        //this.WBS = mini.get("twin_wbs");
        this.Notes = mini.get("twin_notes");
        /********new add*********/
        this.taskKind=mini.get("twin_task_kind");
        this.reportingWorkKind=mini.get("twin_reporting_work_kind");
        this.taskLevelKind=mini.get("twin_task_level_kind");
        this.taskOwner=mini.get("twin_task_owner_name");
        this.taskDutyDeptName=mini.get("twin_task_duty_dept_name");
        this.executorgrid = mini.get("twin_executorgrid");
    },
    initEvents: function () {
        //绑定事件处理函数        

        //////////////////////////////
        /*this.Department.on('ValueChanged', function () {
            this.Principal.setData(this.getPrincipalsByDepartment(this.Department.getValue()));
            this.Principal.setValue('');
        }, this);*/
        /////////////////////////////
    	/************本地化修改*************/
    	var _self=this;
    	//处理事务类别选择
    	$(this.taskKind.getEl()).treebox({
    		treeLeafOnly: true, name: 'taskKind',width:200,
    		beforeChange:function(data){
    			if(data.nodeType=='f'){
    				return false;
    			}
    			$('#twin_extended_code').val(data['extendedCode']);
    			_self.clearExtendedField();
    			return true;
    		},
    		beforClose:function(){
    			if($('#twin_task_kind_id').val()==''){
    				$('#twin_extended_code').val('');
    			}
    		},
    		back:{
    			text:this.getJQEl(this.taskKind),
    			value:'#twin_task_kind_id'
    		}
    	});
    	//处理扩展字段显示
    	var tabs = mini.get("twin_tabs");
    	tabs.on("activechanged", function (e) {
    		var tab=e.tab;
    		if(tab.name=='extended_field'){//扩展字段加载
    			var $el=$('#task_extended_field');
    			var extendedCode=$('#twin_extended_code').val();
    			var code=$el.attr('businessCode')||'';
    			if(extendedCode==code) return;
    			$el.empty().removeAttr('businessCode').removeData();
    			if(extendedCode=='') return;
    			$el.extendedField({businessCode:extendedCode,bizId:_self.taskId,onInit:function(){
    				$el.attr('businessCode',extendedCode);
    			}});
    		}
    	});
    	/*********注册选择所有人***********/
    	var taskOwnerInput=this.getJQEl(this.taskOwner).removeAttr('readonly');
    	this.taskOwner.allowInput=true;
    	$(this.taskOwner.getEl()).orgTree({
    		manageType:taskManageType,
    		getInput:function(){
    			return taskOwnerInput;
    		},
    		getViewWidth:function(){
    			if(this.mode=='tree'){
    				return 190;
    			}
    			return null;
    		},
    		back:{
    			text:taskOwnerInput,
    			value:'#twin_task_owner_id',
    			id:'#twin_task_owner_id',
    			name:taskOwnerInput
    		}
    	});
    	/*********注册选择这人部门***********/
    	var taskDutyDeptInput=this.getJQEl(this.taskDutyDeptName).removeAttr('readonly');
    	this.taskDutyDeptName.allowInput=true;
    	$(this.taskDutyDeptName.getEl()).orgTree({
    		filter:'ogn,dpt',
    		getParam:function(){
				return {a:1,b:1,orgRoot:'orgRoot',searchQueryCondition:"org_kind_id in('ogn','dpt')"};
			},
    		manageType:taskManageType,
    		getInput:function(){
    			return taskDutyDeptInput;
    		},
    		getViewWidth:function(){
    			if(this.mode=='tree'){
    				return 190;
    			}
    			return null;
    		},
    		back:{
    			text:taskDutyDeptInput,
    			value:'#twin_task_duty_dept_id',
    			id:'#twin_task_duty_dept_id',
    			name:taskDutyDeptInput
    		}
    	});
    	/*************************************/
        this.Duration.on("valuechanged", function (e) {
            if (this.dateChangedAction != null) return;

            this.dateChangedAction = "duration";
            var start = this.Start.getValue();
            var duration = this.Duration.getValue();
            if (start) {
                var date = this.project.getFinishByCalendar(start, duration);
                this.Finish.setValue(date);
            }
            this.dateChangedAction = null;

        }, this);
        this.Start.on("valuechanged", function (e) {
            if (this.dateChangedAction != null) return;

            this.dateChangedAction = "start";
            var start = this.Start.getValue();
            var duration = this.Duration.getValue();
            if (start) {
                var date = this.project.getFinishByCalendar(start, duration);
                this.Finish.setValue(date);
            }
            this.dateChangedAction = null;
        }, this);
        this.Finish.on("valuechanged", function (e) {
            if (this.dateChangedAction != null) return;

            this.dateChangedAction = "finish";
            var finish = this.Finish.getValue();
            var start = this.Start.getValue();
            if (finish && start) {
                if (start > finish) {
                    start = finish;
                    this.Start.setValue(start);
                }
                var duration = this.project.getDurationByCalendar(start, finish);
                this.Duration.setValue(duration);
            }
            this.dateChangedAction = null;
        }, this);

        ////////////////////////////
        this.addLink.on("click", function (e) {
            var link = {
                Type: 1,
                LinkLag: 0
            };
            this.PredecessorLink.addRow(link);
        }, this);
        this.delLink.on("click", function (e) {            
            this.PredecessorLink.removeSelected();
        }, this);
        this.PredecessorLink.on("drawcell", function (e) {
            var link = e.record, field = e.field;
            var preTask = this.getTaskByUID(link.PredecessorUID) || {};
            if (field == "PredecessorID") {
                e.cellHtml = preTask.ID;
            }
            if (field == "PredecessorName") {
                e.cellHtml = preTask.Name;
            }
            if (field == "Type") {
                var linkType = mini.Gantt.PredecessorLinkType[e.value];
                e.cellHtml = linkType.Name;
            }
            if (field == "LinkLag") {
                e.cellHtml = e.value + "天";
            }
        }, this);
        this.PredecessorLink.on("cellbeginedit", function (e) {
            var link = e.record, field = e.field;
            var preTask = this.getTaskByUID(link.PredecessorUID) || {};
            if (field == "PredecessorID") {
                e.value = preTask.ID || "";
            }
            if (field == "Type") {
                e.editor.setData(mini.Gantt.PredecessorLinkType);
            }
        }, this);
        this.PredecessorLink.on("cellcommitedit", function (e) {
            
            if (e.field == "PredecessorID") {
                e.cancel = true;
                var task = this.getTaskByID(e.value);
                if (task) {
                    e.sender.updateRow(e.record, "PredecessorUID", task.UID);
                } else {
                    e.sender.updateRow(e.record, "PredecessorUID", "");
                }
            }
        }, this);
        /////////////////////////////////
        //修改资源人员的添加方式
        this.addRes.on("click", function (e) {
            /*var align = {
                Units: 100
            };
            this.Assignments.addRow(align);*/
        	var gridManager=this.Assignments;
        	var taskOrgKind='manager';
        	if($('#twin_executorgrid').is(':visible')){
        		gridManager=this.executorgrid;
        		taskOrgKind='executor';
        	}
        	/*
        	var selecteOrgparams = {
        		"filter": "",
        		"multiSelect": true,
        		"parentId": "orgRoot",
        		"manageCodes": taskManageType,
        		"orgKindIds": "psm",
        		"includeDisabledOrg": false,
        		"listMode": false,
        		"showCommonGroup": false,
        		"cascade": true,
        		"selected": []
        	};
        	*/
        	
           var selectOrgparams = OpmUtil.getSelectOrgDefaultParams();
           selectOrgparams =  jQuery.extend(selectOrgparams, {multiSelect: true,selectableOrgKinds: "psm" });
        	
        	var options = { 
        		params: selectOrgparams,
        		confirmHandler: function(){
        			var data = this.iframe.contentWindow.selectedData;
        			if (data.length == 0) {
        				Public.errorTip("请选择组织");
        				return;
        	        }
        			$.each(data,function(i,o){
        				var row={fullName:o.fullName,fullId:o.fullId,orgId:o.id,orgName:o.name,taskOrgKind:taskOrgKind};
        				gridManager.addRow(row);
        			});
        			this.close();
        		}, 
        		closeHandler: function(){}, title : "选择组织"
        	};
        	OpmUtil.showSelectOrgDialog(options);
        }, this);
        this.delRes.on("click", function (e) {
        	var gridManager=this.Assignments;
        	if($('#twin_executorgrid').is(':visible')){
        		gridManager=this.executorgrid;
        	}
        	gridManager.removeSelected();
        }, this);
        //////////////////////////
        this.FixedDate.on("checkedchanged", function (e) {
            this.editEnabled();
        }, this);
        //////////////////////////
        this.ok.on("click", function (e) {
            var ret = true;
            if (this.callback) ret = this.callback('ok');
            if (ret !== false) {
                this.hide();
            }
        }, this);
        this.cancel.on("click", function (e) {
            var ret = true;
            if (this.callback) ret = this.callback('cancel');
            if (ret !== false) {
                this.hide();
            }
        }, this);

        this.on("beforebuttonclick", function (e) {
            if (e.name == "close") {
                e.cancel = true;
                var ret = true;
                if (this.callback) ret = this.callback('close');
                if (ret !== false) {
                    this.hide();
                }
            }
        }, this);
    },
    //如果是摘要任务, 并且不固定工期, 则禁止摘要任务操作日期(开始/完成/工期)
    editEnabled: function () {
        this.Duration.enable();
        this.Start.enable();
        this.Finish.enable();
        this.ConstraintType.enable();
        this.ConstraintDate.enable();
        this.FixedDate.disable();

        if (this.__TaskSummary) {
            this.FixedDate.enable();

            if (this.FixedDate.getChecked()) {
                this.ConstraintType.disable();
                this.ConstraintDate.disable();
            } else {
                this.Duration.disable(true);
                this.Start.disable(true);
                this.Finish.disable(true);
            }
        }
    },
    setData: function (task, project, callback) {
    	//默认选中第一个tab
    	var tabs = mini.get("twin_tabs");
    	tabs.activeTab(tabs.getTab(0));
    	this.clearExtendedField();
    	
        this.callback = callback;
        this.project = project;
        this.taskId=task.UID;
        
        
        /*************************/
        //taskReportingWork 在主页面读取数据字典
        this.reportingWorkKind.setData(taskReportingWork);
        this.taskLevelKind.setData(taskLevelKind);
        this.getTaskPersons(task.UID);
        this.taskLevelKind.setValue(task.taskLevel);
          //设置任务责任部门
        var task_duty_dept_id=task.DutyDeptId,task_duty_dept_name=task.DutyDeptName;
        if(Public.isBlank(task_duty_dept_id)){
        	task_duty_dept_id=ContextUtil.getOperator('centerId');
        	task_duty_dept_name=ContextUtil.getOperator('centerName');
        }
         $('#twin_task_duty_dept_id').val(task_duty_dept_id);
        this.taskDutyDeptName.setText(task_duty_dept_name);
        /*************************************/
        //常规
        this.Name.setValue(task.Name);
        this.PercentComplete.setValue(task.PercentComplete);
        //this.Work.setValue(task.Work);

        //日期
        this.dateChangedAction = "no";
        this.Duration.setValue(task.Duration);
        this.Start.setValue(task.Start);
        this.Finish.setValue(task.Finish);
        this.ActualStart.setValue(task.ActualStart);
        this.ActualFinish.setValue(task.ActualFinish);
        this.dateChangedAction = null;

        //高级
        var ctypes = mini.Gantt.ConstraintType.clone();
        if (task.Summary) {
            for (var i = ctypes.length - 1; i >= 0; i--) {
                var ct = ctypes[i];
                if (ct.ID != 0 && ct.ID != 4 && ct.ID != 7) {
                    ctypes.removeAt(i);
                }
            }
        }
        this.ConstraintType.setData(ctypes);
        this.ConstraintType.setValue(task.ConstraintType);
        this.ConstraintDate.setValue(task.ConstraintDate);
        this.FixedDate.setChecked(task.FixedDate == 1);
        this.Milestone.setChecked(task.Milestone == 1);
        this.Critical2.setChecked(task.Critical2 == 1);
        //this.WBS.setValue(task.WBS);

        //前置任务、资源分配
        this.PredecessorLink.setData(task.PredecessorLink || []);

        this.Notes.setValue(task.Notes);

        //保存初始化的任务开始日期(点击"确定", 判断此值是否变化, 如果变化, 且没有设置任务限制, 则自动设置任务限制)
        this.__TaskStart = task.Start ? new Date(task.Start.getTime()) : null;
        this.__TaskSummary = task.Summary == 1;

        //控件可操作性处理  
        this.editEnabled();

        //设置日期选择框的显示日期为项目开始日期，方便操作
        var startDate = new Date();
        this.Start.setViewDate(startDate);
        this.Finish.setViewDate(startDate);
        this.ConstraintDate.setViewDate(startDate);
        this.ActualStart.setViewDate(startDate);
        this.ActualFinish.setViewDate(startDate);
    },
    getData: function () {
        var task = {
            Name: this.Name.getValue(),
            PercentComplete: this.PercentComplete.getValue(),
            Duration: this.Duration.getValue(),
            Start: this.Start.getValue(),
            Finish: this.Finish.getValue(),
            ActualStart: this.ActualStart.getValue(),
            ActualFinish: this.ActualFinish.getValue(),
            ConstraintType: this.ConstraintType.getValue(),
            ConstraintDate: this.ConstraintDate.getValue(),
            Notes: this.Notes.getValue(),
            FixedDate: this.FixedDate.getChecked() ? 1 : 0,
            Milestone: this.Milestone.getChecked() ? 1 : 0,
            Critical2: this.Critical2.getChecked() ? 1 : 0,
            taskOwnerId:$('#twin_task_owner_id').val(),
            taskOwnerName:this.getJQEl(this.taskOwner).getValue(),
            OwnerName:this.getJQEl(this.taskOwner).getValue(),
            taskReportingWork:this.reportingWorkKind.getValue(),
            taskKindId:$('#twin_task_kind_id').val(),
            taskLevel:this.taskLevelKind.getValue(),
            TaskLevel:this.taskLevelKind.getValue(),
            dutyDeptId:$('#twin_task_duty_dept_id').val(),
            dutyDeptName:this.getJQEl(this.taskDutyDeptName).getValue(),
            DutyDeptName:this.getJQEl(this.taskDutyDeptName).getValue()
        };
        
        //前置任务
        task.PredecessorLink = mini.clone(this.PredecessorLink.getData());
        //管理者
        task.taskManager = mini.clone(this.Assignments.getData());
        //執行者
        task.taskExecutors = mini.clone(this.executorgrid.getData());
        //扩展属性
        if($('#task_extended_field').attr('businessCode')){
        	task.extendedField = $('#task_extended_field').extendedField('getExtendedFieldValue')['extendedField'];
        }

        //日期范围
        if (task.Start) { //开始日期是:   00:00:00
            var d = task.Start;
            task.Start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
        if (task.Finish) {//完成日期是:   23:23:59
            var d = task.Finish;
            task.Finish = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        }

        //任务限制
        if (task.ConstraintType == 0 || task.ConstraintType == 1) {
            task.ConstraintDate = null;

            if ((!this.__TaskStart && task.Start) || (this.__TaskStart && task.Start && this.__TaskStart.getTime() != task.Start.getTime())) {
                task.ConstraintType = 4;    //不得早于...开始
                task.ConstraintDate = new Date(task.Start.getTime());
            }
        }
        else if (task.ConstraintDate == null) {
            if (task.ConstraintType == 2 || task.ConstraintType == 4 || task.ConstraintType == 5) task.ConstraintDate = new Date(task.Start.getTime());
            if (task.ConstraintType == 3 || task.ConstraintType == 6 || task.ConstraintType == 7) task.ConstraintDate = new Date(task.Finish.getTime());
        }

        return task;
    },
    /////////////////////
    clearExtendedField: function () {
    	$('#task_extended_field').empty().removeAttr('businessCode').removeData();
    },
    getTaskPersons:function(taskId){
    	//清空数据
    	this.setTaskPersonsData();
    	if(Public.isBlank(taskId)){
    		return;
    	}
    	var url = web_app.name+'/planTaskManagerAction!getTaskPersons.ajax';
    	var _self=this;
    	Public.ajax(url,{taskId:taskId},function(data){
    		_self.setTaskPersonsData(data);
        });
    },
    setTaskPersonsData:function(data){
    	data=data||{};
    	//设置任务类别
        var task_kind_id=data.taskKindId,task_kind_name=data.taskKindName,extended_code=data.extendedCode;
        $('#twin_task_kind_id').val(task_kind_id||'');
        $('#twin_extended_code').val(extended_code||'');
        this.taskKind.setText(task_kind_name||'');
        //设置汇报类别
        this.reportingWorkKind.setValue(data.reportingWorkKind);
        //设置任务所有者
        var task_owner_id=data.ownerId,task_owner_name=data.ownerName;
        if(Public.isBlank(task_owner_id)){
        	task_owner_id=ContextUtil.getOperator('personMemberId');
        	task_owner_name=ContextUtil.getOperator('personMemberName');
        }
        $('#twin_task_owner_id').val(task_owner_id);
        this.taskOwner.setText(task_owner_name);
        //所有者
        this.Assignments.setData(data.taskManager || []);
        //执行者
        this.executorgrid.setData(data.executors || []);  
    },
    getTaskByID: function (taskID) {
        return this.project.getTaskByID(taskID);
    },
    getTaskByUID: function (taskUID) {
        return this.project.getTask(taskUID);
    }
});


