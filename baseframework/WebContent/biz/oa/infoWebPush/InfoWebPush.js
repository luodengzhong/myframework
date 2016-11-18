$(document).ready(function() {
	initializeUI();
	bindEvent();
	initLayoutBottomBars();
	 changeIframeUrl($('#firstId').val());
});

function initializeUI(){
	 UICtrl.layout("#layout", {bottomHeight : 110,heightDiff : -5,allowBottomResize:false});
	 $(window).resize(function (){
	 	initLayoutBottomBars();
     });
}
function initLayoutBottomBars(){
	var width=$('#layoutBottom').width();
	var thumbsWidth=$('#layoutBottomThumbs').width();
	if(thumbsWidth>width){
		 $('#layoutBottom').hover(
		 	function () {
			  	 $('#layoutBottomBars').find('span.nav').show();
			},
			 function () {
			 	 $('#layoutBottomBars').find('span.nav').hide();
			}
		);
	}else{
		$('#layoutBottom').unbind("mouseenter mouseleave");
	}
	var curr=$('#layoutBottomThumbs').find('li.curr');
	if(curr.length>0){
		setCurrEm(curr);
	}
}
function bindEvent(){
	 var fadeSpeed = 1000,widthSpeed=250;
	var thumbs=$('#layoutBottomThumbs');
	var thumbsLi=thumbs.find('li');
	
	var slideCount = thumbsLi.length;
	thumbs.width(slideCount*widthSpeed);
	thumbsLi.on('click',function () {
        var id=$(this).attr('id');
        thumbsLi.removeClass('curr');
        changeIframeUrl(id);
        $(this).addClass('curr');
        setCurrEm($(this));
    });
    $('#layoutBottomBars').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
    	if($clicked.hasClass('nav')){
    		var scrollLeft=$('#layoutBottomThumbsDiv').scrollLeft();
    		if($clicked.is('span.prev')){
				scrollLeft-=widthSpeed;
			}else if($clicked.is('span.next')){
				scrollLeft+=widthSpeed;
			}
			$('#layoutBottomThumbsDiv').scrollLeft(scrollLeft);
    	}
    });
}

function setCurrEm(curr){
	var left=curr.offset().left+250/2;
	$('#currEm').css({left:left}).show();
}

function changeIframeUrl(id){
	var iframeloading=$('#screenOverViewCenter').show();
	var convertViewIFrame=$('#mainIframe');
	var convertUrl=web_app.name + '/oaInfoAction!toHandleInfoPromulgate.do?isReadOnly=true&isWebPush=true&autoHide=true&infoPromulgateId='+id;
	if(convertViewIFrame.length>0){
		try{ 
				convertViewIFrame[0].src = 'about:blank';  
				convertViewIFrame[0].contentWindow.document.write('');//清空iframe的内容
			    convertViewIFrame[0].contentWindow.close();//避免iframe内存泄漏
		}catch(e){
		}  
		convertViewIFrame.remove();
	}
	convertViewIFrame=$("<iframe src='about:blank' id='mainIframe' style='width:100%;height:100%;background-color:#fff;' frameborder='0' allowtransparency='true'></iframe>").appendTo($('#layoutViewCenter'));
    var fmState = function() {
	    var state = null;
	    if (document.readyState) {
	        try {
	            //判断Iframe内document 是否加载完成
	            state = convertViewIFrame[0].contentWindow.document.readyState;
	        } catch(e) {
	            state = null;
	        }
	        if (state == "complete" || state == 'interactive') {
	            iframeloading.hide();
	            if (fmState.TimeoutInt) window.clearTimeout(fmState.timeoutInt);
	            return;
	        }
	        window.setTimeout(fmState, 10);
	    }
	};
	convertViewIFrame.attr("src", convertUrl).bind('load',function() {
	    iframeloading.hide();
	    if (fmState.TimeoutInt) window.clearTimeout(fmState.timeoutInt);
	});
	if (fmState.TimeoutInt) window.clearTimeout(fmState.timeoutInt);
	fmState.timeoutInt = window.setTimeout(fmState, 400);
}

function updatehandledFlag(){
	var url=web_app.name +'/infoWebPushAuditAction!updatehandledFlag.ajax';
	var curr=$('#layoutBottomThumbs').find('li.curr');
	var infoHandlerId=null;
	if(!curr.length){
		 infoHandlerId=$('#firstInfoHandlerId').val();
	}else{
	     infoHandlerId=curr.attr('infoHandlerId');
	}
	Public.ajax(url,{infoHandlerId:infoHandlerId}, function(data){});
}