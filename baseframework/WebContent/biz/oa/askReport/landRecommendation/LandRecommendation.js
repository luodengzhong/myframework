var defaultTitle = "土地信息推荐表";
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	UICtrl.autoGroupAreaToggle();
	initGetDispatchNoBtn();
	initUI();
	initSerchBox();
	initTeatareaAutoHeight();
});

function initUI(){
	$("#fill_in_requirements").toggle();
	$("#screenshop").toggle();
	$('#landRecommendationIdAttachment').fileList();
	$("#mapScreenshopPreview")[0].src = web_app.name +'/attachmentAction!downFileBySavePath.ajax?file='+encodeURI(encodeURI($("#mapScreenshot").val()));
	$('#boxToolBar').toolBar([{name:'上传地块截图',id:"addPicture"}]);
	//注册上传照片事件
	$('#addPicture').find('span').uploadButton({
		filetype:['jpg','gif','jpeg','png','bmp'],
		afterUpload:function(data){
			if(data['path']!==undefined){
				$("#mapScreenshopPreview")[0].src=web_app.name +'/attachmentAction!downFileBySavePath.ajax?file='+encodeURI(encodeURI(data['path']));
				$("#mapScreenshot").val(data['path']);
				
			}
		},
		backurl:'landRecommendationAction!saveLandRecommendationPicture.ajax',
		param:function(){
			var landRecommendationId=$('#landRecommendationId').val();
			var mapScreenshot = $("#mapScreenshot").val();
			if(landRecommendationId==''){
				Public.tip('请先保存推荐表!');
				return false;
			}
			return {bizCode:'landRecommendationPicture',bizId:landRecommendationId,flag:'false',mapScreenshot:mapScreenshot};//flag:'false' 不添加日期目录
		}
	});
	
	if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){//只读模式下修改输入框为只读
		var td=$('td.edit');
		if(td.length>0){
			td.addClass('disable');
		}
	}
}


//初始化获取发文号按钮
function initGetDispatchNoBtn(){
	var dispatchNo=$('#dispatchNo').val();
	var fn='show';
	//已存在文号或在只读审核状态下不能修改文号
	if(Public.isReadOnly||!UICtrl.isApplyProcUnit()){
		fn='hide';
	}
	$('#getDispatchNoBtn')[fn]();
}


//获取发文号
function getDispatchNo(){
	var landRecommendationId=getId();
	if(landRecommendationId==''){
		Public.tip('请先保存表单后再获取发文号');
		return false;
	}
	UICtrl.getDispatchNo({
		bizId:landRecommendationId,
		bizUrl:'landRecommendationAction!showUpdate.job?isReadOnly=true&bizId='+landRecommendationId,
		title:defaultTitle,
		callback:function(param){
			var _self = this;
            $('#dispatchNo').val(param['dispatchNo']);
            _self.close();
		}
	});
}


/**
* 检查约束
* 
*/
function checkConstraints() {
	var dispatchNo=$('#dispatchNo').val();
	if(dispatchNo==''){
		Public.tips({type:1,content:'发起流程前,请先获取文件编号!',time:4000});
		return false;
	}
    return true;
}

function initSerchBox(){
	$("#referrerName").searchbox({type : "sys", name : "orgSelect", 
		getParam : function() {
			return {a : 1, b : 1, searchQueryCondition : " org_kind_id ='psm'"};
		},back:{personId:"#referrerId",personMemberName:"#referrerName",deptId:"#referrerDeptId",deptName:"#referrerDeptName"}
	});

}

function beforeSave(){
	var subject = $("#subject").val();
	if(subject ==""){
		subject = defaultTitle;
	}
	$("#subject").val(subject);
	
	return true;
}

function setId(value){
	$("#landRecommendationId").val(value);
	$('#landRecommendationIdAttachment').fileList({bizId:value});
}

function getId(){
	return $("#landRecommendationId").val();
}

/** **********textarea高度自适应***************** */
var observe;
initObserve();

function initObserve() {
	if (window.attachEvent) {
		observe = function(element, event, handler) {
			element.attachEvent('on' + event, handler);
		};
	} else {
		observe = function(element, event, handler) {
			element.addEventListener(event, handler, false);
		};
	}
}
function initTeatareaAutoHeight() {
	var textarea = $("textarea");
	$(textarea).each(function() {
		var text = this;
		function resize() {
			text.style.height = 'auto';
			text.style.height = text.scrollHeight + 'px';
		}
		/* 0-timeout to get the already changed text */
		function delayedResize() {
			window.setTimeout(resize, 0);
		}
		observe(text, 'change', resize);
		observe(text, 'cut', delayedResize);
		observe(text, 'paste', delayedResize);
		observe(text, 'drop', delayedResize);
		observe(text, 'keydown', delayedResize);
		resize();
	});

}
/** ***************end****************** */
/**
 * 图片等比缩放
 */
function DrawImage(ImgD,FitWidth,FitHeight){
	   var image=new Image();
	   image.src=ImgD.src;
	   image.width = ImgD.width;
	   image.height = ImgD.height;
	   if(image.width>0 && image.height>0){
	       if(image.width/image.height>= FitWidth/FitHeight){
	           if(image.width>FitWidth){
	               ImgD.width=FitWidth;
	               ImgD.height=(image.height*FitWidth)/image.width;
	           }else{
	               ImgD.width=image.width;
	               ImgD.height=image.height;
	           }
	       } else{
	           if(image.height>FitHeight){
	               ImgD.height=FitHeight;
	               ImgD.width=(image.width*FitHeight)/image.height;
	           }else{
	               ImgD.width=image.width;
	               ImgD.height=image.height;
	           }
	       }
	   }
	}