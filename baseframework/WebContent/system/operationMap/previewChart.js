$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initFlash();
});

function getMainFlash(){
	return document.getElementById('mainflash');
}

function initFlash(){
  	 var flashVars = { fontswf: web_app.name + '/lib/swf/brcmenu_auto_scroll.swf' };
	 var params = { wmode: "opaque" };
	 swfobject.embedSWF(web_app.name + "/lib/swf/brcmenu_auto_scroll.swf", 'mainflash', "100%", "100%","9.0.0",web_app.name + "/lib/swf/expressInstall.swf", flashVars, params);
}
function initLoadChar(){
	var operationMapId=$('#operationMapId').val();
	Public.ajax(web_app.name + '/operationMapAction!loadChar.ajax',{operationMapId:operationMapId,isCheckPermission:true},function(data){
		var flash = getMainFlash();
	    flash.setJsonInfo(data);
	    afterLoad();
	});
}
function afterLoad(){
	var flash = getMainFlash();
	flash.setDragEnable(false);
	flash.showFoldPoint(false);
	setTimeout(setWrapperDivSize,10);
	//$('#mainflash').width(size.width).height(size.height);
}
function setWrapperDivSize(){
	var flash = getMainFlash();
	var size=flash.getImgSize();
}
function flash_callback_func(kind,d){
	kind=$.trim(kind);
	if(kind=='init'){
		setTimeout(function(){initLoadChar();},10);
		return;
	}else if(kind=='click'){
		var text=d.text,url=d.functionUrl,id=d.id;
		if(!Public.isBlank(url)){
			parent.addTabItem({ tabid: id, text:text, url:web_app.name +'/'+url});
		}
	}
}
