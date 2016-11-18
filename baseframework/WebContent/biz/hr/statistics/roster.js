var archivesFields={};//可用字段
var displayField=new Array();//显示字段
var conditionField=new Array();//查询条件
var conditionSetUp='';
var archivesManageType='hrArchivesManage';
var archivesState={};
var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	archivesState=$('#tempArchivesState').combox('getJSONData');
	conditionField.push({field:'state',symbol:'=',value:1,lookUpValue:'',type:'number'});//默认增加查询条件 在职人员
	initializeUI();
	queryArchivesFields();
});
//获取可用字段
function queryArchivesFields(){
	Public.ajax(web_app.name + "/hrRosterAction!queryArchivesFields.load",{functionCode:'HRArchivesMaintain'},function(data){
		var rosterDisplay=-1,isWageField=false,name;
		$.each(data,function(i,o){
			name=o['name'];
			archivesFields[name]=o;
			rosterDisplay=parseInt(o['rosterDisplay'],10);
			if(!isNaN(rosterDisplay)&&rosterDisplay>0){//花名称中默认显示的字段
				displayField.push(o);
			}
			if(name=='wageStandard'||name=='wageMonth'){
				isWageField=true;
			}
		});
		if(displayField.length>0){//排序
			displayField = displayField.sort(function(o1,o2){
			    var s1=parseInt(o1['rosterDisplay'],10);
			    var s2=parseInt(o2['rosterDisplay'],10);
			    return s1-s2;
			});                   
		}
		if(isWageField){//存在薪酬字段需要密码
			initPersonalPassword();
		}
	});
}
//如果有薪酬字段需输入密码
function initPersonalPassword(){
	PersonalPasswordAuth.showScreenOver();
	PersonalPasswordAuth.showDialog({
		okFun:function(){
			this.close();
			PersonalPasswordAuth.hideScreenOver();
		}
	});
}
function initializeUI(){
	var layout = $("#pageLayout"), bodyHeight = $(window).height() ;
	UICtrl.layout(layout, {
		topHeight : 25,
		heightDiff : -5,
		allowBottomResize : false,
		allowTopResize : false,
		allowRightResize : false,
		onHeightChanged : function(options) {
			var bodyHeight = layout.height() - 30;
			$('#pageCenter').height(bodyHeight);
			if(gridManager){
				setTimeout(function(){
					gridManager.setHeight(bodyHeight-5);
				},0);
			}
		}
	});
	$('#pageCenter').height(bodyHeight - 26);
	$('#toolBar').toolBar([{
		id:'showField',name:'设置显示字段',icon:'add',event:showField},
	    {line:true,id:'showField_line'},
	    {id:'showCondition',name:'设置查询条件',icon:'edit',event: showCondition},
	    {line:true,id:'showCondition_line'},
	    {id:'exportExcel',name:'导出Excel',icon:'down',event: function(){
	    	if(gridManager){
	    		UICtrl.gridExport(gridManager);
	    	}
	    }},
	    {line:true,id:'export_line'}
	]);
}
//编辑显示字段
function showField(){
	UICtrl.showAjaxDialog({
		url: web_app.name + '/hrRosterAction!showField.load', 
		width:500,
		height:getDefaultDialogHeight()-20,
		title:'编辑显示字段',
		okVal:'确定',
		ok: function(){
			//保存显示字段
			var fields=$('#showFieldsDiv').find('a.b-link');
			if(fields.length==0){
				Public.tip('请选择需要显示的字段!');
				return;
			}
			displayField=new Array();
			fields.each(function(){
				displayField.push(archivesFields[$(this).attr('id')]);
			});
			//初始化表格显示
			initDataGrid();
			return true;
		},
		init:function(){
			initShowFields();
			initChooseFields(function(d){
				var showFieldsDiv=$('#showFieldsDiv'),html=[];
				html.push('<a class="b-link" href="##" id="',d['name'],'">',d['display'],'</a>');
				showFieldsDiv.append(html.join(''));
			});
		}
	});
};
//初始化已选择的显示字段
function initShowFields(){
	var showFieldsDiv=$('#showFieldsDiv'),html=[];
	$.each(displayField,function(i,d){
		html.push('<a class="b-link" href="##" id="',d['name'],'">',d['display'],'</a>');
	});
	showFieldsDiv.html(html.join(''));
	//注册选中事件
	showFieldsDiv.on('click',function(e){
     		var $clicked = $(e.target || e.srcElement);
     		if($clicked.hasClass('b-link')){
     			showFieldsDiv.find('a.b-link').removeClass("b-link-select");
     			$clicked.addClass('b-link-select');
     		}
     });
     //双击移除字段
     showFieldsDiv.on('dblclick',function(e){
     		var $clicked = $(e.target || e.srcElement);
     		if($clicked.hasClass('b-link')){
     			$clicked.remove();
     		}
     });
}
//获取选中的显示字段
function getChooseFields(fn){
	var obj=$('#showFieldsDiv').find('a.b-link-select');
	if(obj.length==0){
		Public.tip('请选择需要操作的字段!');
		return;
	}
	if($.isFunction(fn)){
		fn.call(window,obj);
	}
}
//删除显示字段
function removeShowFields(){
	getChooseFields(function(obj){
		obj.remove();
	});
}
//上移显示字段
function upShowFields(){
	getChooseFields(function(obj){
		var prev=obj.prev();
		prev.before(obj);
	});
}
//下移显示字段
function downShowFields(){
	getChooseFields(function(obj){
		var next=obj.next();
		next.after(obj);
	});
}
//初始化字段选择框
function initChooseFields(fn){
	var height=getDefaultDialogHeight()-50;
	if(height<300){
		height=300;
	}
	var chooseFieldsDiv=$('#chooseFieldsDiv').height(height);
	$('#showFieldsDiv').height(height);
	$('#conditionFieldsDiv').height(height-25);
	var types={},t=null;
	$.each(archivesFields,function(p,o){
		t=o['groupName'];
		if(!types[t]){
			types[t]=new Array();
		}
	    types[t].push(o);
	});
	var html=[];
	$.each(types,function(p,o){
		html.push('<div title="',p,'">');
		$.each(o,function(i,d){
			html.push('<a class="l-link" href="##" id="',d['name'],'">',d['display'],'</a>');
		});
		html.push('</div>');
	});
	chooseFieldsDiv.html(html.join(''));
    chooseFieldsDiv.on('click',function(e){
     		var $clicked = $(e.target || e.srcElement);
     		if($clicked.hasClass('l-link')){
     			var id=$clicked.attr('id');
     			if($.isFunction(fn)){
     				fn.call(window,archivesFields[id]);
     			}
     		}
     });
     UICtrl.accordion(chooseFieldsDiv,{ height:chooseFieldsDiv.height(), speed: null });
}
//编辑查询条件
function showCondition(){
	UICtrl.showAjaxDialog({
		url: web_app.name + '/hrRosterAction!showCondition.load', 
		title:'编辑查询条件',
		width:700,
		okVal:'确定',
		ok: function(){
			var flag=true;
			conditionField=new Array();
			$('#conditionFieldsTable').find('tr').each(function(){
				var field=$(this).attr('id');
				var symbol=$(this).find('input[name="symbol"]').val();
				var input=$(this).find('input[name="conditionValue"]');
				var value=input.val();
				var lookUpValue='';
				if(input.hasClass('ui-combox-element')){
					lookUpValue=input.combox('getText');
				}
				var title=$(this).attr('title');
				if(symbol==''){
					Public.tip('请选择操作符号('+title+')!');
					conditionField=new Array();
					flag=false;
					return false;
				}
				if(value==''){
					Public.tip('请填写条件数据('+title+')!');
					conditionField=new Array();
					flag=false;
					return false;
				}
				conditionField.push({field:field,symbol:symbol,value:value,lookUpValue:lookUpValue,type:archivesFields[field]['controlType']});
			});
			if(flag){//执行查询
				conditionSetUp=$('#conditionSet').val();
				query();
			}
			return flag;
		},
		init:function(){
			initConditionFields();
			initChooseFields(function(d){
				var tr=$(groupCondition(d));
				$('#conditionFieldsTable').append(tr);
				autoInitializeUI(tr);
				initConditionIndex();//序号
			});
		},
		button:[{
			id : 'moerCondition',
			name : '高级设置',
			callback :moerConditionSetUp
		}]
	});
}
//组合条件行
function groupCondition(d,condition){
	var html=[];
	var type=d['controlType'];
	var name=d['name'];
	var display=d['display'];
	condition=condition||{};
	var symbol=condition['symbol']||'';
	var value=condition['value']||'';
	var lookUpValue=condition['lookUpValue']||'';
	html.push('<tr id="',name,'" title="',display,'">');
	html.push('<td class="title index" style="width:7%;text-align:center;"></td>');
	html.push('<td class="title" style="width:25%;">',display,'&nbsp:</td>');
	html.push('<td style="width:20%;">','<input type="text" combo="true" name="symbol" value="',symbol,'" dataOptions="data:',getSymbolByType(type,name),'"/>','</td>');
	html.push('<td style="width:40%;">',getInputHtmlByType(d,value,lookUpValue),'</td>');
	html.push('<td class="title" style="width:8%;text-align:center;">','<a href="##" class="GridStyle">删除</a>','</td>');
	html.push('</tr>');
	return html.join('');
}
//获取操作符号
function getSymbolByType(type,name){
	if(name=='staffingPostsRankSequence'){//特殊处理职级序列
		return '{\'=\':\'等于\',\'in\':\'包含\',\'not in\':\'不包含\',\'<>\':\'不等于\'}';
	}
	switch (type) {
		case 'date':
			return '{\'<\':\'小于\',\'<=\':\'小于等于\',\'=\':\'等于\',\'>=\':\'大于等于\',\'>\':\'大于\',\'montheq\':\'月等于\',\'monthgt\':\'月大于等于\',\'monthlt\':\'月小于等于\'}';
        case 'number': 
        case 'money': 
           return '{\'<\':\'小于\',\'<=\':\'小于等于\',\'=\':\'等于\',\'>=\':\'大于等于\',\'>\':\'大于\'}';
       case 'dictionary': 
            return '{\'=\':\'等于\',\'in\':\'包含\',\'not in\':\'不包含\',\'<>\':\'不等于\'}';
       case 'select': 
       case 'text': 
       default:
       	    return '{\'=\':\'等于\',\'like\':\'包含\',\'not like\':\'不包含\',\'<>\':\'不等于\'}';
      }
}
//初始化输入框
function getInputHtmlByType(d,value,lookUpValue){
	var type=d['controlType'];
	value=value||'';
	lookUpValue=lookUpValue||'';
	var inputHtml="<input type='text' class='text{class}' name='conditionValue' value='"+value+"' {controlType}{dataOptions}{mask}/>";         
	switch (type) {
		case 'date':
		    return inputHtml.replace('{class}',' textDate').replace('{controlType}'," date='true'").replace('{dataOptions}','').replace('{mask}'," mask='9999-99-99'");
        case 'number': 
        case 'money': 
            return inputHtml.replace('{class}',' ').replace('{controlType}',"").replace('{dataOptions}','').replace('{mask}'," mask='9999999.99'");
       case 'select': 
       	    var type=d['dataSource']?d['dataSource']:d['name'];
            return inputHtml.replace('{class}','').replace('{controlType}',' select="true"').replace('{dataOptions}',' lookUpValue="'+lookUpValue+'" dataType="'+type+'"').replace('{mask}','');
       case 'dictionary':
       		var dictionary=d['dataSource']?d['dataSource']:d['name'];
       		if(dictionary=='state'){//单独处理状态字段
       			return inputHtml.replace('{class}','').replace('{controlType}',' state="true"').replace('{dataOptions}','').replace('{mask}','');
       		}else{
       			return inputHtml.replace('{class}','').replace('{controlType}',' dictionary="true"').replace('{dataOptions}',' dataOptions="checkbox:true,lookUpValue:\''+lookUpValue+'\',name:\''+dictionary+'\'"').replace('{mask}','');
       		}
       case 'text': 
       default:
       	    return inputHtml.replace('{class}','').replace('{controlType}','').replace('{dataOptions}','').replace('{mask}','');
      }
}
//初始化已选择的条件字段
function initConditionFields(){
	var table=$('#conditionFieldsTable'),html=[];
	$.each(conditionField,function(i,d){
		html.push(groupCondition(archivesFields[d.field],d));
	});
	table.html(html.join(''));
	table.on('click',function(e){
     		var $clicked = $(e.target || e.srcElement);
     		if($clicked.hasClass('GridStyle')){
     			var tr=$clicked.parent().parent();
     			tr.remove();
     			initConditionIndex();//序号初始化
     			insertAtCaret();//清空条件
     		}else if ($clicked.is('td')){
     			var index=$clicked.parent().attr('index');
     			insertAtCaret('{'+index+'}');//插入设置
     		}
    });
    if(!Public.isBlank(conditionSetUp)){
    	$('#conditionSet').val(conditionSetUp);
    	setTimeout(moerConditionSetUp,0);//打开输入框
    }
    autoInitializeUI(table);
    initConditionIndex();//序号初始化
}
function autoInitializeUI(obj){
	Public.autoInitializeUI(obj);//制动注册
	initSelectControl(obj);
	$('[state]',obj).combox({data:archivesState,checkbox:true});//单独处理状态字段
}
function initConditionIndex(){
	$('#conditionFieldsTable').find('tr').each(function(i){
		$(this).find('td.index').html(i+1);
		$(this).attr('index',i+1);
	});
}

//初始化选择控件
function initSelectControl(obj){
	$('input[select]',obj).each(function(){
		var type=$(this).attr('dataType');
		type=Public.isBlank(type)?$(this).attr('name'):type;
		if($.isFunction(window[type+'Select'])){
			window[type+'Select'].call(window,$(this));
		}
	});
}
//机构
function ognNameSelect($el){
	orgSelect($el,{filter:'ogn',param:{searchQueryCondition:"org_kind_id in('ogn')"}});
}
//中心
function centreNameSelect($el){
	orgSelect($el,{filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}});
}
//选择部门
function dptNameSelect($el){
	orgSelect($el,{filter:'dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}});
}
//选择岗位
function posNameSelect($el){
	orgSelect($el,{filter:'pos',param:{searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"}});
}
//路径选择
function fullNameSelect($el){
	orgSelect($el,{filter:'ogn,dpt,pos',param:{searchQueryCondition:"org_kind_id in('ogn','dpt','pos')"}});
}
//选择工资主体单位
function wageOrgNameSelect($el){
	orgSelect($el,{filter:'ogn,dpt',param:{searchQueryCondition:"org_kind_id in('ogn','dpt')"}});
}
//组织机构选择
function orgSelect($el,param){
	$el.orgTree($.extend({
		manageType:archivesManageType,
		needAuth:false,
		textIndex:'name',
		valueIndex:'id',
		lookUpValue:$el.attr('lookUpValue')
	},param));
}
function wageCompanyNameSelect($el){
	businessRegistrationSelect($el);
}
//工商登记单位选择
function businessRegistrationSelect($el){
	$el.searchbox({type:'hr',name:'businessRegistration',textIndex:'companyName',valueIndex:'id',lookUpValue:$el.attr('lookUpValue')});
}
function staffingPostsRankSequenceSelect($el){
	$el.searchbox({
		type:'hr',name:'postsRankSequenceByCurrent',checkboxIndex:'code',
		showToolbar:true,pageSize:100,checkbox:true,
		maxHeight:200,
		getViewWidth:function(){
			return 180;
		},
		textIndex:'code',valueIndex:'code',lookUpValue:$el.attr('lookUpValue')
	});
}
//职能分类选择注册
function responsibilitiyNamesSelect($el){
	$el.treebox({
		name:'responsibilitiy',
		onChange:function(n,d){
			$el.val(d.fullId);
			$el.attr('lookUpValue',d.fullName);
			//更改显示名称
			this.options.callBackControls['text'].val(d.fullName);
		},
		lookUpValue:$el.attr('lookUpValue')
	});
}
//选择了表头后执行该方法初始化表头
function initDataGrid(){
	var columns=getGridColumns();
	if(gridManager){
		gridManager.set('columns', columns); 
        gridManager.reRender();
	}else{
		var bodyHeight = $(window).height() ;
		gridManager = UICtrl.grid('#rosterMainGrid', {
			columns: columns,
			dataAction : 'server',
			url: web_app.name+'/hrRosterAction!slicedQuery.ajax',
			manageType:archivesManageType,
			pageSize : 20,
			width : '99.8%',
			height:bodyHeight-45,
			headerRowHeight : 25,
			rowHeight : 25,
			sortName:'sequence',
			sortOrder:'asc',
			fixedCellHeight : true,
			delayLoad:true,
			selectRowButtonOnly : true
		});
	}
	query();//自动查询
}
//获取表格显示列头
function getGridColumns(){
	var columns=new Array();
	$.each(displayField,function(i,d){
		var controlType=d['controlType'];
		var type='',align='',name=d['name'];
		switch (controlType) {
			case 'date':
				type='date';
				align='center';
			    break;
	        case 'number': 
	        	type='number';
				align='right';
			    break;
	        case 'money': 
	            type='money';
				align='right';
			    break;
	       case 'dictionary':
	       		type='text';
				align='left';
				name=name+'TextView';
			    break;
	       case 'select': 
	       case 'text': 
	       default:
	       	    type='text';
				align='left';
			    break;
	     }
		 columns.push({ display:d['display'], name:name, width: 100, minWidth: 60, type: type, align:align})
	});
	return columns;
}
//查询
function query() {
	if(displayField.length>0){//存在现实字段
		var conditionFieldStr='';
		if(conditionField.length>0){//存在查询条件
			conditionFieldStr=encodeURI($.toJSON(conditionField));
		}
		if(gridManager){
			UICtrl.gridSearch(gridManager, {conditionFields:conditionFieldStr,conditionSetUp:conditionSetUp});
		}
	}
}
//查询条件高级设置打开设置框
function moerConditionSetUp(){
	var conditionFieldsDiv=$('#conditionFieldsDiv');
	var conditionSetDiv=$('#conditionSetDiv');
	if(conditionSetDiv.is(':hidden')){
		conditionSetDiv.show();
		var fieldHeight=conditionFieldsDiv.height()-102
		conditionFieldsDiv.height(fieldHeight);
		conditionFieldsDiv.find('table').css('cursor','pointer');
	}
	return false;
}
function insertAtCaret(value){
	if(!value){
		$('#conditionSet').val('');
	}else{
		$('#conditionSet').insertAtCaret(value);
	}
}