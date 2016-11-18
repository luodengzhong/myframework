var treeManager, projectId, parentId = 5316104, lastSelectedId;
$(function() {
	getQueryParameters();
	bindEvents();
	loadTree();
	initializeUI();
	setContentSrc();

	function getQueryParameters() {
		projectId = Public.getQueryStringByName("projectId") || 0;
	}

	function bindEvents() {

	}

	function initializeUI() {
		UICtrl.initDefaulLayout();

		$('.l-layout-center .l-layout-header')
				.html("<font style=\"color:Tomato;font-size:13px;\">项目一览表</font>");
		setContentSrc('projectPreviewAction!showProjectInfoPage.do');
	}

});

function loadTree() {
	$('#maintree').commonTree({
		loadTreesAction : "/permissionAction!queryFunctions.ajax",
		parentId : parentId,
		isLeaf : function(data) {
			if (!data.parentId) {
				data.nodeIcon = web_app.name
						+ "/themes/default/images/icons/function.gif";
			} else {
				data.nodeIcon = DataUtil.changeFunctionIcon(data.icon);
			}
			return data.hasChildren == 0;
		},
		onClick : function(data) {
			if (data && lastSelectedId != data.id) {
				if (data.url) {
					$('.l-layout-center .l-layout-header')
							.html("<font style=\"color:Tomato;font-size:13px;\">"
									+ data.name + "</font>");
					setContentSrc(data.url);
				}
			}
		},
		IsShowMenu : false
	});

}

function setContentSrc(url) {
	if (!url)
		return;
	if (url.indexOf("?") > 0)
		url += '&';
	else
		url += '?';

	url += 'projectId=' + projectId;

	url += '&viewSource=view';

	if ($('#mainiframe').attr('src') != url)
		document.getElementById('mainiframe').src = url;
}