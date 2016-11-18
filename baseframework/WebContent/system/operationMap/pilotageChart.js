var _button_default = {
	color: "#000000",
	borderColor: "#fef9e3",
	eclipse: 4,
	width: 142,
	height: 42,
	fontSize: "12px",
	x:80,
	y:30
};
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initFlash();
	initToolBar();
});
function getMainFlash(){
	return document.getElementById('mainflash');
}

function initToolBar(){
	$('#charToolBar').toolBar([
		{ id: 'save', name: '保存', icon: 'save', event: doSave},
		{ line: true},
		{ id: 'addPicture', name: '背景图', icon: 'collect'},
		{ line: true},
		{ id: 'batchAddButton', name: '批量选择功能', icon: 'refresh', event:batchAddButton},
	    { line: true},
	    { id: 'addButton', name: '新增节点', icon: 'add', event:function(){
	    	var id=new Date().getTime();
	    	showAddButtonPage('addButton',$.extend({},_button_default,{id:id}));
	    }},
	    { line: true},
	    { id: 'addFoldPoint', name: '添加折线点', icon: 'undo', event:addFoldPoint},
	    { line: true},
	    { id: 'editButton', name: '编辑节点', icon: 'edit', event:editButton},
	    { line: true},
	    { id: 'delete', name: '删除选中节点', icon: 'delete', event: delSelected},
	    { line: true},
	    { id: 'horizSelected', name: '图像水平对齐', icon: 'table', event: horizSelected},
	    { line: true},
	   	{ id: 'verticalSelected', name: '图像垂直对齐', icon: 'tables', event: verticalSelected},
	    { line: true},
	    { id: 'deleteAll', name: '清除全部', icon: 'withdraw', event: deleteAll},
	    { line: true},
	    { id: 'browseView', name: '预览', icon: 'view', event:browseView},
		{ line: true }
	]);
	var html=['连线类型&nbsp:&nbsp;'];
	html.push('<input type="radio" name="lineType" id="lineType1" checked="checked" value="standard"/><label for="lineType1">实线</label>');
	html.push('<input type="radio" name="lineType" id="lineType2" value="dashed"/><label for="lineType2">虚线</label>');
	html.push('<input type="radio" name="lineType" id="lineType3" value="bold"/><label for="lineType3">实线加粗</label>');
	$('#charToolBar').append(html.join(''));
	$.each(['lineType1','lineType2','lineType3'],function(i,id){
		$('#'+id).on('click',function(){
			setLineType($(this).val());
		});
	});
	//注册上传图片事件
	$('#addPicture').find('span').uploadButton({
		filetype:['jpg','gif','jpeg','png','bmp'],
		afterUpload:function(data){
			setTimeout(function(){
				addBackImg(data['path']);
			},500);
		},
		backurl:'operationMapAction!savePicture.ajax',
		param:function(){
			var operationMapId=$('#operationMapId').val();
			if(operationMapId==''){
				Public.tip('请先保存记录!');
				return false;
			}
			return {bizCode:'operationMapBackground',bizId:operationMapId,flag:'false'};//flag:'false' 不添加日期目录
		}
	});
}

function addBackImg(path){
	var flash = getMainFlash();
	//var url=web_app.name +'/attachmentAction!downFileBySavePath.ajax?file='+encodeURI(encodeURI(path));
	var url=web_app.name +'/attachmentAction!downFileBySavePath.ajax?file='+path.replace(/\\/g,"____");
	flash.addBackImg({url: url});
}

function initFlash(){
  	 var flashVars = { fontswf: web_app.name + '/lib/swf/brcmenu.swf' };
	 var params = { wmode: "opaque" };
	 swfobject.embedSWF(web_app.name + "/lib/swf/brcmenu.swf", 'mainflash', "100%", "100%","9.0.0",web_app.name + "/lib/swf/expressInstall.swf", flashVars, params);
}
function initLoadChar(){
	var operationMapId=$('#operationMapId').val();
	Public.ajax(web_app.name + '/operationMapAction!loadChar.ajax',{operationMapId:operationMapId},function(data){
		var flash = getMainFlash();
	    flash.setJsonInfo(data);
	});
}
function showAddButtonPage(fnName,obj){
	UICtrl.showAjaxDialog({
		url: web_app.name + '/operationMapAction!showAddButtonPage.load', 
		width:370,
		title:'编辑节点',
		init:function(){
			$('#submitForm').formSet(obj);
			$('#buttonTitle').treebox({treeLeafOnly: true, name: 'opFunction',beforeChange:function(node){
				$('#functionId').val(node.id);
				$('#buttonTitle').val(node.name);
				$('#buttonText').val(node.description);
				$('#functionUrl').val(node.url);
			}});
		},
		ok: function(){
			var param=$('#submitForm').formToJSON({encode:false});
			if(!param){
				return false;
			}
			var flash = getMainFlash();
			flash[fnName](param);
			return true;
		}
	});
}

function editButton(){
	var flash = getMainFlash();
	var nodes=flash.getSelecteds();
	if(nodes.length>0){
		showAddButtonPage('updateButton',nodes[0]);
	}
}

function addFoldPoint(){
	var id=new Date().getTime();
	var flash = getMainFlash();
	flash.addFoldPoint({id:id,x:180,y:30});
}
function delSelected(){
	UICtrl.confirm( '您确定删除选中节点吗?', function() {
		var flash = getMainFlash();
		flash.delSelected();
	});
}
function verticalSelected(){
	var flash = getMainFlash();
	flash.verticalSelected();
}
function horizSelected(){
	var flash = getMainFlash();
	flash.horizSelected();
}
function deleteAll(){
	UICtrl.confirm( '您确定删除全部数据吗?', function() {
		var flash = getMainFlash();
		flash.clear();
	});
}
function setLineType(type){
	var flash = getMainFlash();
	flash.setLineType(type);
}
function flash_callback_func(kind,data){
	kind=$.trim(kind);
	if(kind=='init'){
		setTimeout(function(){initLoadChar();},10);
	}else if(kind=='doubleClick'){
		showAddButtonPage('updateButton',data);
	}
}

function doSave(){
	var flash = getMainFlash();
	var jsonData=flash.getJsonInfo();
	var operationMapId=$('#operationMapId').val();
	Public.ajax(web_app.name + '/operationMapAction!saveChar.ajax',{operationMapId:operationMapId,jsonData:encodeURI($.toJSON(jsonData))});
}

function browseView(){
	var operationMapId=$('#operationMapId').val();
	var url=web_app.name + '/operationMapAction!previewChart.do?operationMapId='+operationMapId;
	parent.addTabItem({ tabid: 'operationMapView'+operationMapId, text: '图形预览', url:url});
}
var selectFunctionDialog= null;
//批量选择功能添加
function batchAddButton(){
    if (!selectFunctionDialog) {
        selectFunctionDialog = UICtrl.showDialog({
            title: "请选择系统功能",
            width: 350,
            content: '<div style="overflow-x: hidden; overflow-y: auto; width: 340px;height:250px;"><ul id="saFunctiontree"></ul></div>',
            init: function () {
                $('#saFunctiontree').commonTree({
                	loadTreesAction:'/treeViewAction!root.ajax',
            		IsShowMenu:false,
            		checkbox:true,
            		autoCheckboxEven:true,
            		getParam:function(e){
            			return {treeViewMappingName:'opFunction'};
            		},
            		dataRender:function(data){
						return data['Rows']||data;
					},
            		onDelay:function(e){
            			var param = {treeParentId:e.data['id'],treeViewMappingName:'opFunction'};
            			return { url: web_app.name + '/treeViewAction!children.ajax', parms: param};
            		}
                });
            },
            ok: function(){
            	var nodes=$('#saFunctiontree').commonTree('getChecked');
            	if(nodes.length==0){
            		Public.tip('请选择功能节点！'); 
            		return false;
            	}
            	var flash = getMainFlash();
            	$.each(nodes,function(i,node){
            		var id=new Date().getTime()+Math.ceil(Math.random()*10000);
            		var data={
            			color: "#000000",borderColor: "#fef9e3",eclipse: 4,
						width: 142,height: 42,id: id,x:180+(i*20),y:30+(i*20),
						text:node.data.description||node.data.name,
						functionId:node.data.id,
						title:node.data.name,
						functionUrl:node.data.url
					};
					flash.addButton(data);
            	});
            	this.hide();
            },
            close: function () {
                this.hide();
                return false;
            }
        });
    } else {
        selectFunctionDialog.show().zindex();
    }
}