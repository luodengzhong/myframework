/*********************************************
title:      下拉滚动条动态加载数据
Author:      xiexin
使用:
$('#showAnnotations').scrollLoad({
		url:web_app.name + '/BugMainAction!getAnnotations.ajax',
		params:{bugid:bugid},
		onLoadItem:function(obj){
	    	var html=['<div class="scrollLoadData">'];
		    html.push('<b>',obj['operationdate'],'&nbsp;',obj['operatorname'],'&nbsp;:</b>');
		    html.push(obj['content']);
		    html.push('<hr/></div>');
		    return html.join('');
		}
});
*********************************************/
(function($){
    $.fn.scrollLoad = function (options) {
        var defaults = {
			url: "",                      //json数据获取地址
			getMethod: 'POST',                //Ajax获取数据的方法 POST 或则 GET
			params:{},                        //获取json数据的参数
			total:0,
			size:10,
			pageParmName: 'page',
			sizeParmName: 'size', 
			totalParmName: 'total', 
			scrolloffset:20,
			loadHtml:'<img src="'+web_app.name+'/themes/default/ui/load.gif" border="0"/>&nbsp;数据加载中......',//等待提示层代码
			fillBox:false,                   //填充显示数据的容器，如果不填则默认为自身容器填充数据
			loadBox:false,                   //提示对话框
			itemClass:'scrollLoadData',      //显示元素样式
			onLoadItem:false,                //显示元素的加载回调方式，返回html
			loading:true,
			isOver:false,
			dataRender:null 
        };
        options = $.extend(defaults, options||{});
        return this.each(function() {
			var showbox=$(this);
			if(options.fillBox){
				showbox=$(options.fillBox);
			}
			options.fillBox=showbox;
			if(!options.loadBox&&$(showbox).children('div.loading').length==0){
				var loadDiv=$('<div class="loading"></div>');
				loadDiv.css('padding-left','1%').css('color','buttonshadow');
				loadDiv.html(options.loadHtml);
				showbox.append(loadDiv);
				options.loadBox=loadDiv;
			}
			
			if($(showbox).children('div.'+options.itemClass).length==0){
				$.ajaxGetData(showbox,options,false);
			}else{
				$.createBox(showbox,false,options);
			}
			$.data(this, "ui-scrollLoad", options);
        });
	};
	//重新加载
	$.fn.scrollReLoad = function(op){
		return this.each(function() {
			var options=$.data(this,'ui-scrollLoad');
			var showbox=$(this);
			if(options){
				options = $.extend(options, op);
				//删除原来的数据
				try{
					$('div.'+options.itemClass,options.fillBox).removeAllNode();//removeAllNode定义在common.js
				}catch(e){
					$('div.'+options.itemClass,options.fillBox).remove();
				}
				options['total']=0;//设置开始为0
				options['isOver']=false;
				if(options.loadBox&&$(showbox).children('div.loading').length==0){
					$(options.loadBox).remove();
					var loadDiv=$('<div class="loading"></div>');
					loadDiv.css('padding-left','1%').css('color','buttonshadow');
					loadDiv.html(options.loadHtml);
					showbox.append(loadDiv);
					options.loadBox=loadDiv;
				}
				$(options.loadBox).show();
				$.ajaxGetData(options.fillBox,options,false);
			}
		});
	};
		
	$.ajaxGetData=function(showbox,options,isScroll){
		var params={};
		params[options.sizeParmName]=options.size;
		params[options.totalParmName]=options.total;
		params[options.pageParmName]=options.total/options.size+1;
		var p=options.params||{};
		if($.isFunction(p)){
			p=p.call(window);
		}
		params = $.extend(params,p);
		var doError=function(msg){
			$(options.loadBox).css('background-image','none');
			$(options.loadBox).append('<span>'+msg+'</span>');
			return false;
		};
		//setTimeout 避免操作频繁
		setTimeout(function(){
			$.ajax({
				type: options.getMethod,
				url: options.url,
				data: params,
				dataType:'json',
				success: function(data){
					Public.ajaxCallback(data,function(d){
						if($.isFunction(options.dataRender)){
							d=options.dataRender.call(window,d,options);
							if(d===false){
								return false;
							}
						}
						if(isScroll){
							$.createListItem(showbox,d,options);
						}else{
							$.createBox(showbox,d,options);
						}
					});
				 },
				 error:function(e){
					doError(e);
				 }
			});
		},isScroll?500:0);
	};
	
	$.createBox=function(showbox,data,options){
		if(data){
			$.createListItem(showbox,data,options); //加载初始化数据
		}
		$(showbox).scroll(function(){
			var childrenLength=$(this).children('div.'+options.itemClass).length;
			if(options.total==childrenLength||options.isOver)
				return;
			var scrolltop=$(showbox)[0].scrollTop;
			var scrollheight=$(showbox)[0].scrollHeight;
			var windowheight=$(showbox).height();
			//ajax加载判断
			if(scrolltop>=(scrollheight-(windowheight+options.scrolloffset))&&!options.loading){
				options.loading=true;
				$(options.loadBox).show(); 
				showbox.append(options.loadBox);
				options.total=childrenLength;
				$.ajaxGetData(showbox,options,true);
			}
		});
	};
	
	$.createListItem=function(listbox,data,options){
		if(data.length==0){
			options.loading=false;
			options.isOver=true;
	    	$(options.loadBox).hide();
			return;
		}
		if(data.length<options.size){
			options.isOver=true;
		}
		var htmls=[];
		$.each(data, function(i,item){
			if(options.onLoadItem){
				htmls.push(options.onLoadItem.call(window,item));
			}else{
				htmls.push('<div class="'+options.itemClass+'">',item,'</div>');
			}
		});
		listbox.append(htmls.join(''));
		options.loading=false;
	    $(options.loadBox).hide();
	};

})(jQuery);