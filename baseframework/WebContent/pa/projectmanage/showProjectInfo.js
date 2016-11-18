var  operateCfg = {},projectId;

$(function() {
	getQueryParameters();
	initializeOperateCfg();
	loadProject();
     function getQueryParameters() {
		projectId = Public.getQueryStringByName("projectId") || 0;
	}

     /**
	 * 初始化参数配置
	 */
	function initializeOperateCfg() {
		var actionPath = web_app.name + "/projectMainAction!";
         operateCfg.loadProjectAction = actionPath + "loadProject.ajax";
     }

	function initializeUI() {

	}

    function loadProject(){
        Public.ajax(operateCfg.loadProjectAction, {
            projectId : projectId
        }, function(data) {
            if (data) {
                $('#address').html(data.projectAddress);
                $('#name').html(data.name);
                $('#code').html(data.code);
            }
        });
    }

});
