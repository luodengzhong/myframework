var viewUrl=web_app.name + '/showHelp.load';

$(document).ready(function() {
	$('html').addClass("html-body-overflow");
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth :250,heightDiff : -5,onHeightChanged:function(){
		setViewHeight();
	}});
	setViewHeight();
	$('#helpTab').tab();
	var parentIds=$('#parentIds').val();
	parentIds=parentIds.split(',');
	UICtrl.tree("#maintree", {
		url: web_app.name+'/treeViewAction!root.ajax',
		param: {treeViewMappingName: "sysHelp"},
		idFieldName: 'helpId',
		textFieldName: "helpName",
		btnClickToToggleOnly: true,
		nodeWidth: 230,
		dataRender: function (data) {
			return data.Rows;
	    },
	    isExpand:function(node){
	    	if(parentIds.length==0){
	    		return false;
	    	}
	    	var helpId=node.data.helpId+"";
	    	if(helpId==parentIds[0]){
	    		treeNodeOnclick(node);
	    	}
	    	if($.inArray(helpId,parentIds)>-1){
	    		return true;
	    	}
	    	return false;
	    },
	    onClick: treeNodeOnclick
	});
	$('#scrollLoadDiv').scrollLoad({
		url:web_app.name + '/indexHelp.ajax',
		size:30,
		scrolloffset:25,
		onLoadItem:function(obj){
	    	var html=['<div class="scrollLoadData"><span>'];
		    html.push('<a href="',viewUrl,'?helpId=',obj['helpId'],'" class="aLink" target="mainFrame">',obj['helpTitle'],'</a>');
		    html.push('</span></div>');
		    return html.join('');
		}
	});
	$('#ui-grid-query-button').click(function(){
		var value=$('#ui-grid-query-input').val();
		$('#scrollLoadDiv').scrollReLoad({params:{keyword:encodeURI(value)}});
	});
	$('#ui-grid-query-input').keyup(function(e){
		var k =e.charCode||e.keyCode||e.which;
		if(k==13){
			$('#ui-grid-query-button').trigger('click');
		}
	});
}
function setViewHeight(){
	var layout=$("#layout"),bodyHeight=layout.height();
	$('#showTreeView').height(bodyHeight-73);
	$('#showListView').height(bodyHeight-73);
	$('#scrollLoadDiv').height(bodyHeight-100);
}
function treeNodeOnclick(node) {
	var helpId=node.data.helpId;
	var iframe=$('#main_iframe');
	if(!Public.isBlank(helpId)){
		iframe[0].src=viewUrl+'?helpId='+helpId;
	}
}