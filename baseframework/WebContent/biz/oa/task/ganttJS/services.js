/* 标准方法：加载、保存、调试项目，弹出任务面板。
-----------------------------------------------------------------------------*/
function saveGantt(ganttObject) {
	//获取当前任务树形数据
    var tasktree = ganttObject.getTaskTree();
    var datas=getModifDate(tasktree);
    if(datas.length==0){
    	Public.tip('没有数据改变！');
    	return;
    }
    var url = web_app.name+'/planTaskManagerAction!saveBatchTask.ajax';
    project.loading();
    Public.ajax(url,{tasks:$.toJSON(datas)},function(data){
    	ganttObject.acceptChanges();
    	ganttObject.unmask();
    },function(){
    	ganttObject.unmask();
    });
}

//获取改变的数据
function getModifDate(treeData){
	var datas=new Array();
	for(var i=0;i<treeData.length;i++){
		var da=treeData[i],state=da['_state'];
		if(state=='modified'||state=='added'){
			var json=formatTaskData(da,false);
			delete json['taskExecutors'];
			delete json['taskManager'];
			datas.push(json);
		}
		var children=da['children'];
		if(children&&children.length>0){
			datas.push.apply(datas,arguments.callee(children));
		}
	}
	return datas;
}

function trackData(datas) {
    var json = mini.encode(datas);
    document.write(json);
}
function LoadJSONProject(project,url,param, callback) {
    project.loading();
    param=param||{};
    Public.ajax(url,param,function(data){
    	var dataProject = mini.decode(data);
        //project.loadData(dataProject);
    	//project.loadTasks(dataProject.Tasks);
    	project.loadTasks(dataProject);
        if (callback) callback(project);
        project.unmask();
    },function(){
    	project.unmask();
    });
}


//创建任务面板

var taskWindow = null;

function ShowTaskWindow(project) {
    var task = project.getSelected();
    if (task) {
        if (!taskWindow) {
            taskWindow = new TaskWindow();
        }
        taskWindow.setTitle("编辑任务");
        taskWindow.show();
        taskWindow.setData(task, project,
            function (action) {
                if (action == 'ok') {
                    try {
                        var taskData = taskWindow.getData();
                        saveTask(task,taskData,function(id){
                        	taskData['UID']=id;
							project.updateTask(task, taskData);
                        });
                    } catch (ex) {
                        alert("error:" + ex.message);
                        return false;
                    }
                }
            }
        );
    } else {
        Public.tip("请先选择任务"); 
    }
}
/*保存单个任务*/
function saveTask(task,taskData,fn){
	var url = web_app.name+'/planTaskManagerAction!saveTask.ajax';
	var json=mini.clone(taskData);
	json['UID']=task.UID;
	json['ParentTaskUID']=task.ParentTaskUID;
	json['ID']=task.ID;
	json['isPlan']=task.isPlan;
	json=formatTaskData(json,true);
	Public.ajax(url,json,function(id){
		fn.call(window,id);
    });
}
//保存前格式化数据
function formatTaskData(task,flag){
	var json=$.extend({},task);
	if(json['taskExecutors']){
		json.taskExecutors=$.toJSON(json.taskExecutors);
	}
	if(json['taskManager']){
		json.taskManager=$.toJSON(json.taskManager);
	}
	if(json['PredecessorLink']){
		if(json['PredecessorLink'].length>0){
			if(flag===true){//是否转化为字符串
				json.PredecessorLink=$.toJSON(json.PredecessorLink);
			}
		}else{
			json.PredecessorLink='';
		}
	}
	$.each(json,function(p,o){
		if(p=='PredecessorLink'){
			return;
		}
		if(mini.isDate(o)){
			o=Public.formatDate(o,'%Y-%M-%D %H:%I:%S');
		}
		if(Public.isBlank(o)){
			o='';
		}
		json[p]=encodeURI(o);
	});
	delete json['children'];
	return json;
}

/*删除任务*/
function deleteTask(task,fn){
	var url = web_app.name+'/planTaskManagerAction!deleteTask.ajax';
	var taskId=task.UID;
	if(Public.isBlank(taskId)){
		fn.call(window);
		return;
	}
	Public.ajax(url,{taskId:taskId},function(){
		fn.call(window);
    });
}
/*保存计划*/
function savePlan(task,taskData,fn){
	var url = web_app.name+'/planTaskManagerAction!savePlan.ajax';
	var json=mini.clone(taskData);
	json['UID']=task.UID;
	json['ParentTaskUID']=task.ParentTaskUID;
	json['ID']=task.ID;
	json['isPlan']=task.isPlan;
	json=formatTaskData(json,true);
	Public.ajax(url,json,function(id){
		fn.call(window,id);
    });
}

