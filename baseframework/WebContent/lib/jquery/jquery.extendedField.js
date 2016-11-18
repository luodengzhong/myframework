/*---------------------------------------------------------------------------*\
|  title:         扩展字段使用                                                                                                                                  |
|  Author:        xiexin                                                      |
|  Created:       2014-02-12                                                  |
|  Description:   扩展字段的读取及数据存储                                                                                                    |
|   select dataOptions: type:'sys',name:'extendedFieldDefine',back:{defineId:'003',fieldCname:'select'} 只能匹配同一分组下的字段
|   lookup dataOptions: type:'sys',name:'extendedFieldDefine',textField:'fieldCname',valueField:'defineId'
|   lookup 只有一条显示数据时 dataOptions: type:'sys',name:'extendedFieldDefine'
\*---------------------------------------------------------------------------*/
(function($) {
	
	$.fn.extendedField = function(op){
		var obj=this.data('ui-extended-field');
		if(!obj){
			new ExtendedField(this,op);
		}else{
			if (typeof op == "string") {
				var value=null,args = arguments;
				$.each(['getExtendedFieldValue'],function(i,m){
					if(op==m){
						args = Array.prototype.slice.call(args, 1);
						value=obj[m].apply(obj,args);
						return false;
					}
				});
				return value;
			}else{
				obj.set(op);
			}
		}
		return this;
	};
	
	function ExtendedField(el,op){
		this.options={};
		this.element=$(el);
		this.dynamicParam={};//combobox,select,lookup存在获取参数的方法
		this.set(op);
		this.init();
		this.element.data('ui-extended-field',this);
	}
	
	$.extend(ExtendedField.prototype, {
		set:function(op){
			this.options=$.extend({
				url:web_app.name+'/extendedFieldAction!queryExtendedFieldStorage.ajax',
				businessCode:'',//业务类别
				bizId:'',//业务ID
				onInit:function(){}
			},this.options, op||{});
		},
		init:function(){//初始化加载分组信息
		    var opt = this.options, _self = this, html = [];
		    var bizId = opt.bizId;
		    if (!bizId && opt.oldBizId && opt.oldBizId > 0) bizId = opt.oldBizId;
		    Public.ajax(opt.url, { businessCode: opt.businessCode, bizId: bizId }, function (data) {
		        $.each(data, function (i, groupData) {
		            try {
		                html.push("<div id='navTitle_" + groupData.groupId + "' class='navTitle'>");
		                html.push("<a href='javascript:void(0);' hidefocus class='togglebtn' hideTable='#extendedFieldtable_" + groupData.groupId + "' title='show or hide'></a>");
		                html.push("<span class='group'>&nbsp;</span>&nbsp;<span>", groupData.name, "</span>");
		                html.push("</div>", "<div class='navline'></div>");
		                html.push(_self.createExtendedField(groupData));
		            } catch (e) { alert("扩展字段读取:" + e.message); }
		        });
				_self.element.html(html.join(''));
				_self.element.css('overflow','hidden');
				var maxWidth=0,tempwidth;
				$('div.row',_self.element).each(function(){
					tempwidth=0;
					$('dl',this).each(function(){
						tempwidth+=$(this).outerWidth();
					});
					maxWidth=Math.max(maxWidth,tempwidth);
				});
				$('tr',_self.element).each(function(){
					tempwidth=0;
					$('td',this).each(function(){
						tempwidth+=$(this).outerWidth();
					});
					maxWidth=Math.max(maxWidth,tempwidth);
				});
				_self.element.css('width',maxWidth+20);
				try{Public.autoInitializeUI(_self.element);}catch(e){alert("扩展字段UI:"+e.message);}
				try{UICtrl.autoGroupAreaToggle(_self.element);}catch(e){}
				//适应动态获取参数的方式
				_self.element.find('input[param]').each(function(){
					var param=$(this).attr('param'),getParam=_self.dynamicParam[param];
					if(getParam){
						if($.isPlainObject(getParam)){
							var groupDiv=$(this).parents('div[groupId]')[0];
							var fn=function(par,div){
								return function(){
									var param={};
									$.each(par,function(p,o){
		                				param[p]=$('input[fieldEname="'+o+'"]',div).val();
		                			});
		                			return param;
								};
	            			};
	            			$(this).combox({getParam:fn(getParam,groupDiv)});
						}else if($.isFunction(getParam)){
							$(this).combox({getParam:getParam});
						}
					}
				});
				if($.isFunction(opt.onInit)){
					opt.onInit.call(window);
				}
			});
		},
		createExtendedField:function(groupData){//根据分组加载字段
			var _self=this,showModel=groupData.showModel;
			var html = ["<div class='extendedFieldDiv' groupId='",groupData.groupId,"'>"];
			if(showModel==1){
				html.push("<table cellspacing='0px' cellpadding='0px' class='tableInput' id='extendedFieldtable_",groupData.groupId,"'>");
				var tableLayout=groupData.tableLayout;
				if(!Public.isBlank(tableLayout)){
					html.push('<COLGROUP>');
					$.each(tableLayout.split(','),function(i,o){
						html.push("<COL width='",o,"'/>");
					});
					html.push('</COLGROUP>');
				}
			}else{
				html.push("<div class='ui-form' id='extendedFieldtable_",groupData.groupId,"'><div class='ui-form-container'>");
			}
            var col = parseInt(groupData.cols);
            var index= 0,length=groupData.fields.length;
            $.each(groupData.fields,function(i,fieldData){
            	var fieldInfo=[" fieldEname='",fieldData.fieldEname,"' name='f_",fieldData.defineId,"' value='",fieldData.fieldValue,"' "];
                if(!fieldData.visible){//不显示的字段定义为隐藏字段
                	html.push("<input type='hidden'",fieldInfo.join(''),"/>");
                	return true;
                }
            	var isNewLine=parseInt(fieldData.newLine),colSpan=parseInt(fieldData.colSpan);
            	colSpan=isNaN(colSpan)?1:colSpan;
            	if(showModel==1){//表格显示
            		if(isNewLine==1){
            			for(var j=0;j<col-index;j++){//补上一行空白
                    		html.push("<td class='title'>&nbsp;</td>");
                    	}
            			html.push("</tr>"); 
            			html.push("<tr>");
            			colSpan=col-1;//默认占一排
            			index=col;
            		}else{
            			if((index+1+colSpan)>col){
                			colSpan=col-1-index;
                		}else if((index+1+colSpan)==col-1){
                			colSpan=colSpan+1;
                		}
                		colSpan=colSpan<1?1:colSpan;
                		if(index%col==0){
                			if(index==col){
                				html.push('</tr>');
                				index=0;
                			}
                			html.push('<tr>');
                		}
                		index=index+1+colSpan;
                		index=index>col?col:index;
            		}
            	}else{//div 显示
            		if(isNewLine==1){
            			html.push("</div>"); 
            			html.push("<div class='row'>");
            			index=col;
            		}else{
            			if(index%col==0){
                			if(index==col){
                				html.push("</div>"); 
                				index=0;
                			}
                			html.push("<div class='row'>");
                		}
            			index++;
            		}
            	}
                var controlWidth=parseInt(fieldData.controlWidth),labelWidth=parseInt(fieldData.labelWidth);
                if(showModel==1){
                	html.push("<td class='title'",isNaN(labelWidth)?"":" style='width:"+labelWidth+"px'","><span class='labelSpan'>");
                }else{
                	html.push("<dl>");
                	html.push("<dt ",isNaN(labelWidth)?"":" style='width:"+labelWidth+"px'",">");
                }
                html.push(fieldData.fieldCname);
                if (!fieldData.nullable) {
                	html.push("<font color='#FF0000'>*</font>");
                }
                if(showModel==1){
                	html.push("&nbsp;:</span>","</td>");
                	html.push("<td  class='edit'",isNaN(controlWidth)?"":" style='width:"+controlWidth+"px'"," colspan='",colSpan,"'>");
                }else{
                	html.push("&nbsp;:","</dt>");
                	html.push("<dd ",isNaN(controlWidth)?"":" style='width:"+controlWidth+"px'",">");
                }
                //字段长度
                var maxLength = [];
                var fieldLength=parseInt(fieldData.fieldLength);
                if (!isNaN(fieldLength)&&fieldLength > 0){
                    maxLength.push(" maxlength='" , fieldLength , "' ");
                }else{
                	maxLength.push(" maxlength='40' ");
                }
                //控件宽度与高度
                var controlWH=[];//[" style='width:" , fieldData.controlWidth , "px;height:" , fieldData.controlHeight, "px;'"];
                //只读
                var readOnly =fieldData.readOnly?[" readonly='readonly'"] :[];
                //数据输入框HTML
                var inputHtml="<input type='text' class='text{class}' "+fieldInfo.join('')+"{required}{controlType}{maxLength}{style}{readOnly}{dataOptions}{mask}/>";
                inputHtml=inputHtml.replace('{maxLength}',maxLength.join(''))
                			.replace('{style}',controlWH.join(''))
                			.replace('{readOnly}',readOnly.join(''))
                			.replace('{required}',fieldData.nullable?'':' required="true" label="'+fieldData.fieldCname+'"')
                			.replace('{mask}',_self.getNumberMask(fieldData));
                //处理控件类型显示
                switch (parseInt(fieldData.controlType)) {
                    case 1: //textbox
                        html.push(inputHtml.replace('{class}','').replace('{controlType}','').replace('{dataOptions}',''));
                        break;
                    case 2: //combobox                                
                    	html.push(inputHtml.replace('{class}','').replace('{controlType}'," combo='true'").replace('{dataOptions}',_self.getComboxDataOptions(fieldData)));
                        break;
                    case 3: //spinner
                    	html.push(inputHtml.replace('{class}','').replace('{controlType}'," spinner='true'").replace('{dataOptions}',_self.getSpinnerDataOptions(fieldData)));
                        break;
                    case 4: //date
                    	html.push(inputHtml.replace('{class}',' textDate').replace('{controlType}'," date='true'").replace('{dataOptions}',''));
                        break;
                    case 5: //dateTime
                    	html.push(inputHtml.replace('{class}',' textDate').replace('{controlType}'," dateTime='true'").replace('{dataOptions}',''));
                        break;
                    case 6: //radio
                        html.push(_self.createControl(fieldData,'radio'));
                        break;
                    case 7: //checkbox
                        html.push(_self.createControl(fieldData,'checkbox'));
                        break;
                    case 8: //select
                    	html.push(_self.createSelectControl(fieldData,inputHtml.replace('{class}','').replace('{controlType}'," select='true'"),groupData.groupId));
                        break;
                    case 9: //lookup
                    	html.push(_self.createSelectControl(fieldData,inputHtml.replace('{class}','').replace('{controlType}'," select='true'")));
                        break;
                    case 10: //tree 
                    	html.push(_self.createSelectControl(fieldData,inputHtml.replace('{class}','').replace('{controlType}'," tree='true'"),groupData.groupId));
                        break;
                    default:
                    	html.push(inputHtml.replace('{class}','').replace('{controlType}','').replace('{dataOptions}',''));
                        break;
                }
                if(showModel==1){
                	html.push("</td>");
                }else{
                	html.push("</dd>","</dl>");
                }
            });
            if(showModel==1){
            	for(var i=0;i<col-index;i++){
            		html.push("<td class='title'>&nbsp;</td>");
            	}
            	html.push("</tr>","</table>");
            }else{
            	html.push("</div>","</div>");
            }
            html.push("</div>");
            return html.join('');
		},
		getJSONDataSource:function(fieldData){//读取Json数据源
			try{
				var dataSource=fieldData.dataSource;
				if(dataSource && typeof dataSource=='string'){
					if (dataSource.substring(0, 1) != "{"){
						dataSource = ["{" , dataSource , "}"].join('');
					}
					dataSource=(new Function("return "+dataSource))();
				}
				return dataSource;
			}catch(e){
				alert('读取字段'+fieldData.fieldCname+'数据源错误!'+e.message);
				return {};
			}
		},
		getArrayDataSource:function(fieldData){//读取集合数据源
			try{
				var dataSource=fieldData.dataSource;
				if(dataSource && typeof dataSource=='string'){
					if (dataSource.substring(0, 1) != "["){
						dataSource = ["[", dataSource , "]"].join('');
					}
					dataSource=(new Function("return "+dataSource))();
				}
				return dataSource;
			}catch(e){
				alert('读取字段'+fieldData.fieldCname+'数据源错误!'+e.message);
				return [];
			}
		},
		createControl:function(fieldData,type){//构造radio或checkbox
			var html=[],_self=this,dataSource;
			var radioHtml="<input type='"+type+"' id={id} name='{name}' value='{value}' fieldEname='{fieldEname}' {checked}/>&nbsp;<label for='{id}'>{label}</label>";
			var getChecked =function(value){
				var flag=false;
				if(type=='radio'){
					flag=value==fieldData.fieldValue;
				}else{
					$.each(fieldData.fieldValue.split(','),function(i,o){
						if(value==o){
							flag=true;
							return false;
						}
					});
				}
				return flag?"checked='checked'":"";
			};
			switch (parseInt(fieldData.dataSourceKind)) {
			 case 2: //集合
				 dataSource=_self.getArrayDataSource(fieldData);
				 $.each(dataSource,function(i,o){
					 html.push(radioHtml.replace(/{id}/g,fieldData.fieldEname+"_"+i)
			                    .replace('{name}','f_'+fieldData.defineId)
			                    .replace('{value}',o)
			                    .replace('{fieldEname}',fieldData.fieldEname)
			                    .replace('{checked}',getChecked(o))
			                    .replace('{label}',o),'&nbsp;');
				 });
                 break;
			 case 3: //数据字典
			 case 4: //JSON
				 dataSource=_self.getJSONDataSource(fieldData);
				 $.each(dataSource,function(i,o){
					 html.push(radioHtml.replace(/{id}/g,fieldData.fieldEname+"_"+i)
			                    .replace('{name}','f_'+fieldData.defineId)
			                    .replace('{value}',i)
			                    .replace('{fieldEname}',fieldData.fieldEname)
			                    .replace('{checked}',getChecked(i))
			                    .replace('{label}',o),'&nbsp;');
				 });
                 break;
			}
			return html.join('');
		},
		getSpinnerDataOptions:function(fieldData){//获取Spinner执行参数
			var dataOptions={},flag=false;
			if(fieldData.minValue&&!isNaN(parseInt(fieldData.minValue))){
				dataOptions['min']=parseInt(fieldData.minValue);
				flag=true;
			}
			if(fieldData.maxValue&&!isNaN(parseInt(fieldData.maxValue))){
				dataOptions['max']=parseInt(fieldData.maxValue);
				flag=true;
			}
			if(fieldData.defaultValue&&!isNaN(parseInt(fieldData.defaultValue))){
				dataOptions['default_value']=parseInt(fieldData.defaultValue);
				flag=true;
			}
			if(flag){
				return [" dataOptions='",$.toJSON(dataOptions),"'"].join('');
			}else{
				return "";
			}
		},
		getNumberMask:function(fieldData){//获取number的格式化参数
			if(parseInt(fieldData.fieldType)!=2) return "";//fieldType ==2 为number类型
			var length=parseInt(fieldData.fieldLength),precision=parseInt(fieldData.fieldPrecision);
			var mask=[];
			if(length&&!isNaN(length)){
				for(var i=0;i<length;i++){
					mask.push('n');
				}
			}
			if(precision&&!isNaN(precision)&&precision>0){
				mask.push('.');
				for(var i=0;i<precision;i++){
					mask.push('n');
				}
			}
			if(mask.length>0){
				return [" mask='",mask.join(''),"'"].join('');
			}else{
				return "";
			}
		},
		getComboxDataOptions:function(fieldData){//获取Combox执行参数
			var data={},_self=this;
			switch (parseInt(fieldData.dataSourceKind)) {
			 case 2: //集合
				var dataSource=_self.getArrayDataSource(fieldData);
				//转化数组为json对象
				$.each(dataSource,function(i,o){
					data[o]=o;
				});
				return [" dataOptions='data:",$.toJSON(data),"'"].join('');
                break;
			 case 3: //数据字典
				 data=_self.getJSONDataSource(fieldData);
				 return [" dataOptions='data:",$.toJSON(data),"'"].join('');
				 break;
			 case 4: //JSON
				 data=_self.getJSONDataSource(fieldData);
				 if(data.url&&data.mode){//读取远程数据
					 if(data.getParam){
						 var timer='f_'+fieldData.defineId+'_'+(new Date().getTime());
						 if($.isPlainObject(data.getParam)){
							 this.dynamicParam[timer]=data.getParam;
						 }
						 delete data['getParam'];
						 return [" dataOptions='",$.toJSON(data),"' param='",timer,"'"].join('');
					 }
					 return [" dataOptions='",$.toJSON(data),"'"].join('');
				 }else if(!$.isEmptyObject(data)){
					 return [" dataOptions='data:",$.toJSON(data),"'"].join('');
				 }
                break;
			}
		},
		createSelectControl:function(fieldData,inputHtml,groupId){//获取select or lookup执行html 
			//groupId 存在代表 select 否则为lookup
			var html=[];
			var dataOptions=this.getJSONDataSource(fieldData);//只能从Json中获取数据
			if(dataOptions.name){//存在 name
				 var timer=false;
				if(dataOptions.getParam){
					 timer="f_"+fieldData.defineId+"_"+(new Date().getTime());
					 this.dynamicParam[timer]=dataOptions.getParam;
					 timer=" param='"+timer+"'";
					 delete dataOptions['getParam'];
				}
				if(dataOptions.back){//输入形式入:type:'sys',name:'extendedFieldDefine',back:{defineId:'003',fieldCname:'select'}
					dataOptions['callBackControls']={};
					$.each(dataOptions.back,function(p,o){
						dataOptions['callBackControls'][p]='#extendedFieldtable_'+groupId+' input[fieldEname="'+o+'"]';
					});
					delete dataOptions['back'];
				}
				if(parseInt(fieldData.controlType)==8){
					html.push('<div class="ui-combox-wrap">');
					html.push(inputHtml.replace('{dataOptions}',[" dataOptions='",$.toJSON(dataOptions),"'",timer?timer:""].join('')));
					html.push('<span class="select">','</span>','</div>');
				}else{//lookup
					dataOptions['fieldValue']=fieldData['fieldValue'];
					dataOptions['lookUpValue']=fieldData['lookUpValue'];
					html.push(inputHtml.replace('{dataOptions}',[" dataOptions='",$.toJSON(dataOptions),"'",timer?timer:""].join('')));
				}
			}else{
				html.push(inputHtml.replace('{dataOptions}',''));
			}
			return html.join('');
		},
		getLookUpValue:function(groupId,name){//获取关联字段的值
			var lookUp=$('#extendedFieldtable_'+groupId).find('input[name="'+name+'_text"]');
			if(lookUp.length>0){
				return lookUp.getValue();
			}else{
				return '';
			}
		},
		getExtendedFieldValue:function(isEncode){//获取扩展字段数据
			isEncode=typeof isEncode=='boolean'?isEncode:true;//默认转码
			var opt=this.options,_self=this,fields=[],flag=false;
			this.element.find('div.extendedFieldDiv').each(function(){
				var els = $(":input",this),el, name,values=[],processed={};
				var groupId=$(this).attr('groupId');
				for ( var i = 0, length = els.length; i < length; i++) {
					el = els.get(i),name = el.name;
					if (!name || processed[name]||name.endsWith('_text')){
						continue;
					}
					flag = $(el).defaultCheckVal();
					if (flag === false){// 验证不通过
						return false;
					}else{
						flag = true;
					}
					values.push({
						extendedFieldId:name.replace('f_',''),//字段name统计加入前缀f_
						fieldValue:$(el).getValue(),
						groupId:groupId,
						fieldEname:$(el).attr('fieldEname'),
						lookUpValue:_self.getLookUpValue(groupId,name)
					});
					processed[name] = true;
				}
				fields.push.apply(fields,values);
			});
			if(!flag){
				return false;
			}else{
				var obj={businessCode:opt.businessCode,bizId:opt.bizId,fieldList:fields};
				return isEncode?{extendedField:encodeURI($.toJSON(obj))}:obj;
			}
		}
	});
})(jQuery);
//解析内容替换	input对象
function parseExtendedFieldHtmlToView(el){
	var obj=$(el).data('ui-extended-field');
	if(!obj) return '';
	if($(el).html()=='') return '';
	var clearItem = $('#clear-use-memory');
	if (clearItem.length == 0) {
		jQuery('<div/>').hide().attr('id', 'clear-use-memory').appendTo('body');
		clearItem = jQuery('#clear-use-memory');
	}
	clearItem.empty().append($(el).clone());
	clearItem.find('div[businesscode]').width('100%');
	//删除不显示的对象
	clearItem.find('font').remove();
	clearItem.find('a').remove();
	//只读不删除
	clearItem.find('input.ui-combox-element').not('input.textReadonly').remove();
	//替换输入框
	clearItem.find('input:text').each(function(){
		var parent=$(this).parent();
		var div=$('<div class="textLabel"></div>').html($(this).val());
		if(parent.hasClass('ui-combox-wrap')){
			div.insertAfter(parent);
		}else{
			div.insertAfter($(this));
		}
	});
	//替换单选
	clearItem.find('input:radio').each(function(){
		$('<span class="radio'+($(this).is(':checked')?'checked':'')+'"></span>').insertAfter($(this));
	});
	//替换复选
	clearItem.find('input:checkbox').each(function(){
		$('<span class="checkbox'+($(this).is(':checked')?'checked':'')+'"></span>').insertAfter($(this));
	});
	//删除输入框对象
	clearItem.find('div.ui-combox-wrap').remove();
	clearItem.find('input').remove();
	return clearItem.html();
}