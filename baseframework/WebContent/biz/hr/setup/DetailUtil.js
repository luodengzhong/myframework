var DetailUtil=DetailUtil||{};
DetailUtil.archivesId='';
DetailUtil.detailDefineId='';
DetailUtil.hrDetailGridManager=null;
DetailUtil.getNumberMask=function(fieldData){//获取number的格式化参数
	if(fieldData['controlType']=='money') return "money";
	if(fieldData['controlType']!='number') return "";
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
		return mask.join('');
	}else{
		return "";
	}
};
DetailUtil.getDetailGrid=function(div,data,op){
	op=op||{};
	DetailUtil.refreshFlag = false;
	DetailUtil.archivesId=op['archivesId']||DetailUtil.archivesId;
	DetailUtil.detailDefineId=op['detailDefineId']||DetailUtil.detailDefineId;
	var url=web_app.name + '/hrArchivesAction!slicedDetailQuery.ajax';
	var columns=[],dataSources={},hrDetailGridManager=null;
	var isUpdate=parseInt(data['isUpdate']);//是否允许编辑
	var isInsert=parseInt(data['isInsert']);//是否允许新增
	var checkbox=parseInt(data['isDelete'])===1?true:false;//允许删除显示 checkbox
	var isGrid=parseInt(data['isGrid']);//是否在GRID中编辑
	var cols=parseInt(data['cols']);//在dialog中生成表格的列数
	var tableLayout=data['tableLayout'];//table布局样式
	var enabledEdit=false;
	if(isGrid===1&&(isUpdate===1||isInsert===1)){
		enabledEdit=true;//是否在表格中编辑
	}
	//循环生成表头
	$.each(data.fields,function(i,o){
		var filed={
			display:o['display'],
			name: o['name'],
			width:o['width']||100,
			minWidth: 60,
			type: "string",
			align:o['align']
		};
		var controlType=o['controlType'];
		var dataSource=o['dataSource'];
		if(controlType=='combobox'){//获取数据源
			dataSources[o['name']]=Public.getJSONDataSource(dataSource);
			filed['render']=function(item){
				return dataSources[o['name']][item[o['name']]];
			};
			filed['dictionary']=o['dictionary'];
		}
		if(o['readOnly']===0&&isGrid===1){//生成表头中的编辑数据
			filed['editor']={
				type:(controlType=='money'||controlType=='number'||controlType=='textarea')?'text':controlType,
				required:o['nullable']===0,
				maxLength:o['fieldLength']||64,
				mask:DetailUtil.getNumberMask(o),
				data:dataSources[o['name']]
			};
		}
		if(controlType=='money'||controlType=='date'){
			filed['type']=controlType;
		}
		columns.push(filed);
	});
	if(columns.length==0){
		Public.tip('没有数据！');
		return;
	}
	//组合头按钮
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({
		saveHandler:enabledEdit===true?function(){
			if(!DetailUtil.archivesId){
				Public.tip('没有人事档案记录无法保存!');
				return;
			}
			var detailData=DataUtil.getGridData({gridManager:hrDetailGridManager});
			if(!detailData) return false;
			if(detailData.length==0) return false;
			Public.ajax(web_app.name +'/hrArchivesAction!doSaveBatchDetail.ajax',
				{
					detailData:encodeURI($.toJSON(detailData)),
					archivesId:DetailUtil.archivesId,
					detailDefineId:DetailUtil.detailDefineId
				},
				function(){
					DetailUtil.hrDetailGridManager.loadData();
				}
			);
		}:false,
		addHandler:isInsert===1?function(){
			if(isGrid===1){
				UICtrl.addGridRow(hrDetailGridManager);
			}else{
				DetailUtil.showTableDialog({
					fields:data.fields,
					cols:cols,
					tableLayout:tableLayout,
					title:data.name
				});
			}
		}:false,
		updateHandler:isUpdate===1&&isGrid===0?function(){
			var row = hrDetailGridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			DetailUtil.showTableDialog({
				fields:data.fields,
				cols:cols,
				tableLayout:tableLayout,
				title:data.name,
				data:row
			});
		}:false,
		deleteHandler:checkbox? function(){
			DataUtil.delSelectedRows({action:'hrArchivesAction!deleteDetail.ajax',
				gridManager:hrDetailGridManager,param:{archivesId:DetailUtil.archivesId,detailDefineId:DetailUtil.detailDefineId},
				onSuccess:function(){
					DetailUtil.loadGrid();
				}
			});
		}:false
	});
	var headerRowHeight=25;
	var ordeby ='asc';
	//年度绩效工资表头高度加大
	if(DetailUtil.detailDefineId=='524418'){
		headerRowHeight=50;
		ordeby='desc';
	}
	//创建表格
	hrDetailGridManager=UICtrl.grid(div, {
		columns:columns,
		dataAction : 'server',
		url:url,
		parms:{archivesId:DetailUtil.archivesId,detailDefineId:DetailUtil.detailDefineId},
		width :op['width']||'99%',
		sortName:'id',
		sortOrder:ordeby,
		height :300,
		headerRowHeight : headerRowHeight,
		rowHeight : 25,
		enabledEdit: enabledEdit,
		usePager: true,
		checkbox: checkbox,
		toolbar: toolbarOptions,
		fixedCellHeight: true,
		autoAddRow:{},
		selectRowButtonOnly: true,
		onDblClickRow : function(row, rowindex, rowobj) {
			if(isUpdate===1&&isGrid===0){
				DetailUtil.showTableDialog({
					fields:data.fields,
					cols:cols,
					tableLayout:tableLayout,
					title:data.name,
					data:row
				});
			}
		},
		onLoadData :function(){
			return !(DetailUtil.archivesId=='');
		}
	});
	DetailUtil.hrDetailGridManager=hrDetailGridManager;
	return hrDetailGridManager;
};
DetailUtil.showTableDialog=function(op){
	op=op||{};
	var fields=op.fields,cols=op.cols,tableLayout=op.tableLayout,data=op.data||{};
	var id=data['dbDetailId'];//数据库中ID取值字段
	//alert(id);
	if(!id){//默认取名称为ID的字段
		id=data['id'];
	}
	var html = ["<form name='hrDetailForm' id='hrDetailForm'>"];
	html.push('<input type="hidden" name="id" id="detatiId" value="',id||'','">');
	html.push('<table class="tableInput" style="width:645px;">');
	if(!Public.isBlank(tableLayout)){
		html.push('<COLGROUP>');
		$.each(tableLayout.split(','),function(i,o){
			html.push("<COL width='",o,"'>");
		});
		html.push('</COLGROUP>');
	}
	var col=isNaN(cols)?2:cols;
	var index= 0;
	$.each(fields,function(i,field){
		var name=field.name;
		var isNewLine=parseInt(field.newLine),colSpan=1;
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
		html.push("<td class='title'>");
		html.push(field.display);
        if (!field.nullable) {
        	html.push("<font color='#FF0000'>*</font>");
        }
        html.push("&nbsp;:","</td>");
    	html.push("<td class='edit' colspan='",colSpan,"'>");
    	 //字段长度
        var maxLength = [];
        var fieldLength=parseInt(field.fieldLength);
        if (!isNaN(fieldLength)&&fieldLength > 0){
            maxLength.push(" maxlength='" , fieldLength , "' ");
        }else{
        	maxLength.push(" maxlength='40' ");
        }
        var readOnly =field.readOnly?[" readonly='readonly'"] :[];
        var mask=DetailUtil.getNumberMask(field);
        var inputHtml="<input type='text' class='text{class}' value='{value}' name='{name}' {required}{controlType}{maxLength}{readOnly}{dataOptions}{mask}/>";
        inputHtml=inputHtml.replace('{maxLength}',maxLength.join(''))
        			.replace('{value}',data[name]||'')
        			.replace('{name}',name)
        			.replace('{readOnly}',readOnly.join(''))
        			.replace('{required}',field.nullable?'':' required="true" label="'+field.display+'"')
        			.replace('{mask}',mask?[' mask="',mask,'"'].join(''):'');
        switch (field.controlType) {
        case 'text': 
        case 'number': 
        case 'money': 
            html.push(inputHtml.replace('{class}','').replace('{controlType}','').replace('{dataOptions}',''));
            break;
        case 'combobox':
    		var dataSource=field['dataSource'];
    		dataSource=Public.getJSONDataSource(dataSource);
        	html.push(inputHtml.replace('{class}','').replace('{controlType}'," combo='true'").replace('{dataOptions}',[" dataOptions='data:",$.toJSON(dataSource),"'"].join('')));
            break;
        case 'date':
        	html.push(inputHtml.replace('{class}',' textDate').replace('{controlType}'," date='true'").replace('{dataOptions}',''));
            break;
        case 'dateTime':
        	html.push(inputHtml.replace('{class}',' textDate').replace('{controlType}'," dateTime='true'").replace('{dataOptions}',''));
        	break;
        case 'textarea':
        	html.push('<textarea class="textarea" {required}{maxLength}{readOnly} name="{name}" rows="4">{value}</textarea>'
        			.replace('{maxLength}',maxLength.join(''))
        			.replace('{value}',data[name]||'')
        			.replace('{name}',name)
        			.replace('{readOnly}',readOnly.join(''))
        			.replace('{required}',field.nullable?'':' required="true" label="'+field.fieldCname+'"'));
            break;
        }
        html.push("</td>");
	});
	for(var i=0;i<col-index;i++){
		html.push("<td class='title'>&nbsp;</td>");
	}
	html.push("</tr>","</table>");
	html.push('</form>');
	UICtrl.showDialog({title:'编辑'+op.title,width:650,
		content:html.join(''),
		ok:function(){
			if(!DetailUtil.archivesId){
				Public.tip('没有人事档案记录无法保存!');
				return true;
			}
			if(!DetailUtil.detailDefineId){
				Public.tip('子集定义ID不存在!');
				return true;
			}
			DetailUtil.saveDetail();
			return false;
		},
		init:function(doc){
			//修改只读对象显示样式
			$('input[readonly]',doc).each(function(){UICtrl.disable(this);});
		},
		close:function(){
			if(DetailUtil.refreshFlag===true){
				DetailUtil.refreshFlag=false;
				DetailUtil.loadGrid();
			}
		}
	});
};
DetailUtil.saveDetail=function(){
	$('#hrDetailForm').ajaxSubmit({url: web_app.name +'/hrArchivesAction!doSaveDetail.ajax',
		param:{archivesId:DetailUtil.archivesId,detailDefineId:DetailUtil.detailDefineId}, 
		success : function(id) {
			$('#detatiId').val(id);
			DetailUtil.refreshFlag = true;
		}
	});
};
DetailUtil.loadGrid=function(){
	if(DetailUtil.hrDetailGridManager){
		DetailUtil.hrDetailGridManager.loadData();
	}
};
DetailUtil.reRender=function(){
	if(DetailUtil.hrDetailGridManager){
		DetailUtil.hrDetailGridManager.reRender();
	}
};
DetailUtil.gridExport=function(){
	if(DetailUtil.hrDetailGridManager){
		UICtrl.gridExport(DetailUtil.hrDetailGridManager);
	}
};
