var project=null;
//try{window.onerror=function(){return false;};}catch(e){}
$(document).ready(function() {
	initGantt();
});

function initGantt(){
	mini.parse();
	project = new PlusProject();
	project.setStyle("width:100%;");
	UICtrl.autoSetWrapperDivHeight(function(_size){
		if(_size.h>100){
			project.setHeight(_size.h - 42);
		}
	});
	project.setColumns([
	        new PlusProject.IDColumn(),
	        new PlusProject.StatusColumn(),
	        new PlusProject.NameColumn(),
	        new PlusProject.PredecessorLinkColumn(),
	        new PlusProject.PercentCompleteColumn(),
	        new PlusProject.DurationColumn(),
	        new PlusProject.StartColumn(),
	        new PlusProject.FinishColumn(),
	        new PlusProject.WorkColumn(),
	        new PlusProject.DepartmentColumn(),
	        new PlusProject.PrincipalColumn(),
	        new PlusProject.AssignmentsColumn()
	 ]);
	 project.render(document.getElementById("ganttView"));
	//创建右键菜单
	 var menu = new ProjectMenu();
	 project.setContextMenu(menu);
	 menu.edit.on("click", function (e) {
	     ShowTaskWindow(project);
	 });
	 load();
}

function load() {
    var url = web_app.name+'/lib/Gantt/Data/Project.txt';
    LoadJSONProject(url, project);
}
function track() {
    TrackProject(project);
}
function save() {
    alert("网站示例不提供保存，产品开发包内有此功能！");
    //SaveProject(project);
}

function addTask() {
    var newTask = project.newTask();
    newTask.Name = '<新增任务>';    //初始化任务属性

    var selectedTask = project.getSelected();
    if (selectedTask) {
        //project.addTask(newTask, "before", selectedTask);   //插入到到选中任务之前
        //project.addTask(newTask, "add", selectedTask);       //加入到选中任务之内 
    	project.addTask(newTask, "after", selectedTask);       //加入到选中任务之后  
    } else {
        project.addTask(newTask);
    }
}
function removeTask() {
    var task = project.getSelected();
    if (task) {
        if (confirm("确定删除任务 " + task.Name + " ？")) {
            project.removeTask(task);
        }
    } else {
        alert("请选中任务");
    }
}
function updateTask() {
    ShowTaskWindow(project);
}
function upgradeTask() {
    var task = project.getSelected();
    if (task) {
        project.upgradeTask(task);
    } else {
        alert("请选选中任务");
    }
}
function downgradeTask() {
    var task = project.getSelected();
    if (task) {
        project.downgradeTask(task);
    } else {
        alert("请选选中任务");
    }
}

function zoomIn() {
    project.zoomIn();
}
function zoomOut() {
    project.zoomOut();
}
function showCalendars() {
    ShowCalendarWindow(project);
}
function editTaskByTaskWindow() {
    ShowTaskWindow(project);
}

function onLockClick(e) {
    var checked = this.getChecked();
    if (checked) {
        project.frozenColumn(0, 2);
    } else {
        project.unfrozenColumn();
    }
}