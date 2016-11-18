var gridManager = null, refreshFlag = false;
var totalFields=[],tableHTML=['<table class="tableInput" style="width: 99%;" border="0" cellspacing="0" cellpadding="0" id="dialogTableRecord">','<COLGROUP><COL width="14%"><COL width="19%"><COL width="14%"><COL width="19%"><COL width="14%"><COL width="19%"></COLGROUP>'],tableCol=3;//每行显示3个
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeUI();
	//是员工本人浏览需要验证访问密码
	PersonalPasswordAuth.showScreenOver();
	PersonalPasswordAuth.showDialog({
		okFun:function(){
			this.close();
			PersonalPasswordAuth.hideScreenOver();
		}
	});
});

function initializeUI(){
	var columns=[
	    { display: "姓名", name: "archivesName", width: 60, minWidth: 60, type: "string", align: "left",frozen: true,totalSummary:{
	    	render: function (suminf, column, data){
        		return '合 计:';
			},
			align: 'center'
	    }},
	    { display: "工资类别", name: "wageKindTextView", width: 60, minWidth: 60, type: "string", align: "left",frozen: true },
	    { display: "发放期间", name: "periodName", width: 180, minWidth: 60, type: "string", align: "left",frozen: true }
	];
	Public.ajax(web_app.name + '/paymasterAction!queryPayItems.ajax', {}, function(data) {
		var totalSummary=null,payItemKind=null,render=null;
		var currCol = 0;
		$.each(data,function(i,o){
			totalSummary=null;
			if(parseInt(o.isTotal,10)==1){
				totalFields.push(o.name);
				totalSummary=UICtrl.getTotalSummary();
			}
			render=null;
			payItemKind=parseInt(o.payItemKind,10);
			if(payItemKind<5){
				render=function(item){
						return '<a href="javascript:showPayDetail('+item.periodId+','+item.archivesId+','+item.serialId+',\''+o.name+'\',\''+o.display+'\');" class="GridStyle">' + Public.currency(item[o.name]) + '</a>';
				};
			}
			columns.push({ 
				display: o.display, name: o.name,
				width: 100, minWidth: 60,
				type: "money", align: "right",
				render:render,totalSummary:totalSummary
			});
			//构造TABLE显示的html
			if (i % tableCol == 0) {
                if (i!=0&&currCol == tableCol) { 
                	tableHTML.push("</tr>"); 
                	currCol = 0; 
                }
                tableHTML.push("<tr>");
            }
            currCol++;
            tableHTML.push("<td  class='title' style='padding-left:10px;'>");
            if(payItemKind<5){
            	tableHTML.push('<a href="javascript:void(0)" class="GridStyle" code="',o.name,'">');
            	tableHTML.push(o.display);
            	tableHTML.push('</a>',':');
            }else{
            	tableHTML.push(o.display,':');
            }
            tableHTML.push("</td>");
            tableHTML.push("<td class='edit disable'>");
            tableHTML.push("<input type='text' class='text textReadonly' readonly='true' name='",o.name,"'/>");
            tableHTML.push("</td>");
		});
		for(var i=0;i<tableCol-currCol;i++){
			tableHTML.push("<td class='title' colspan='2'>&nbsp;</td>");
    	}
		tableHTML.push("</tr>","</table>");
		initializeGrid(columns);
	});
	$('#year').spinner({countWidth:80}).mask('nnnn');
	$('#periodName').searchbox({
		type:'hr',name:'chooseOperationPeriod',getParam:function(){
			return {paramValue:$('#year').val()};
		},back:{periodId:'#periodId',yearPeriodName:'#periodName'}
	});	
	$('#statKind').combox({
		onChange:function(obj){
			statKindChange(obj.value);
		}
	});
	statKindChange($('#statKind').val());
	
	/*$('#personOwnPayTab').tab();
	 <div id="toolBar" style="position: absolute;z-index:100;left:200px;border:0;background:none;"></div>
	$('#toolBar').css('top',$('#personOwnPayTab').offset().top+2).toolBar([
	       {id:'exportExcelHandler',name:'导出Excel',icon:'transfer',
	    	   event:function(){
	    		   UICtrl.gridExport(gridManager);
	    	   }
	       },{line:true},
	       {name:'测试01',event:'test01'}
	]);*/
}
function statKindChange(kind){
	switch (parseInt(kind,10)) {
		case 1://年
			$.each(['periodName','dateBegin','dateEnd'],function(i,p){
				$('#'+p).parents('dl').hide();
			});
			$('#year').parents('dl').show();
			break;
    	case 2://期间
    		$.each(['dateBegin','dateEnd'],function(i,p){
				$('#'+p).parents('dl').hide();
			});
    		$('#periodName').parents('dl').show();
    		$('#year').parents('dl').show();
    		break;
    	case 3://时间
    		$.each(['dateBegin','dateEnd'],function(i,p){
				$('#'+p).parents('dl').show();
			});
    		$('#periodName').parents('dl').hide();
    		$('#year').parents('dl').hide();
    		break;
	}
}

//初始化表格
function initializeGrid(columns) {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler: function(){
			UICtrl.gridExport(gridManager);
		},
		showTableRecord:{id:'showTableRecord',text:'表格显示',img:'table.gif',click:function(){
			showTableRecord();
		}},
		showPayChange:{id:'showPayChange',text:'薪酬变动记录',img:'page_link.gif',click:function(){
			showArchivesDetail(488624);
		}},
		showDecemberBonus:{id:'showDecemberBonus',text:'年度绩效工资记录',img:'page_link.gif',click:function(){
			showArchivesDetail(524418);
		}}
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		dataAction : 'server',
		url: web_app.name+'/paymasterAction!slicedQueryPaymasterPerson.ajax',
		parms:{archivesId:$('#mainArchivesId').val(),status:6,totalFields:totalFields.join(',')},
		delayLoad:true,
		pageSize : 20,
		width : '99.8%',
		height : '100%',
		heightDiff : -15,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		sortName:'fillinDate',
		sortOrder:'desc',
		fixedCellHeight : true,
		selectRowButtonOnly : true,
		onDblClickRow : function(data, rowindex, rowobj) {
			showTableRecord(data);
		}
	});
	query($('#queryGridForm'));
}

//查询
function query(obj) {
	var param = $(obj).formToJSON();
	var statKind=parseInt(param['statKind'],10);
	var parms={};
	if(isNaN(statKind)||statKind==1){
		parms['year']=param['year'];
		parms['periodId']='';
		parms['dateBegin']='';
		parms['dateEnd']='';
	}else if(statKind==2){
		parms['year']=param['year'];
		parms['periodId']=param['periodId'];
		parms['dateBegin']='';
		parms['dateEnd']='';
	}else{
		parms['dateBegin']=param['dateBegin'];
		parms['dateEnd']=param['dateEnd'];
		parms['year']='';
		parms['periodId']='';
	}
	UICtrl.gridSearch(gridManager, parms);
}

//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

function showArchivesDetail(detailId){
	var width=getDefaultDialogWidth();
	Public.ajax(web_app.name + '/hrSetupAction!queryFieldDefine.ajax', {id:detailId}, function(data) {
		UICtrl.showDialog({title:'年度绩效工资',width:width,
			content:'<div style="overflow: hidden;width:'+(width+10)+'px;height:305px;"><div class="testClass"></div></div>',
			ok:false,
			init:function(doc){
				DetailUtil.getDetailGrid($('div.testClass',doc),data,{width:getDefaultDialogWidth(),archivesId:$('#mainArchivesId').val(),detailDefineId:detailId});
			}
		});
	});
}

//查看工资明细
function showPayDetail(periodId,archivesId,serialId,operationCode,display){
	UICtrl.showFrameDialog({
		title:'['+display+']详细',
		url: web_app.name + '/paymasterAction!forwardPaydetailList.do', 
		param:{periodId:periodId,archivesId:archivesId,operationCode:operationCode,serialId:serialId,isSimple:'true'},
		height:320,
		width:getDefaultDialogWidth(),
		resize:true,
		ok:false,
		cancel:true
	});
}

function showTableRecord(row){
	if(!row){
		row = gridManager.getSelectedRow();
		if (!row) {Public.tip('请选择数据！'); return; }
	}
	UICtrl.showDialog({title:row.periodName,width:820,
		content:tableHTML.join(''),
		init:function(doc){
			$.each(row,function(p,o){
				$('input[name="'+p+'"]',doc).val(Public.currency(o));
			});
			$('a.GridStyle',doc).on('click',function(){
				var code=$(this).attr('code'),display=$(this).text();
				showPayDetail(row.periodId,row.archivesId,row.serialId,code,display);
			});
		},
		cancelVal: '关闭',
		okVal:'导出',
		ok:function(doc){
			var table=$('#dialogTableRecord'),html=['<table border="0" cellspacing="0" cellpadding="0" style="width:99%;">'];
			html.push('<colgroup><col width="14%"/><col width="19%"/><col width="14%"/><col width="19%"/><col width="14%"/><col width="19%"/></colgroup>');
			$('tr',table).each(function(){
				html.push('<tr>');
				$('td',this).each(function(){
					html.push('<td style="padding-left:10px;padding-right:10px;"');
					html.push(' colspan="',$(this).attr('colspan'),'"');
					html.push(' rowspan="',$(this).attr('colspan'),'"');
					if($(this).find('input').length>0){
						html.push(' align="right">');
						html.push($(this).find('input').val());
					}else{
						html.push('>');
						html.push($(this).text());
					}
					html.push('</td>');
				});
				html.push('</tr>');
			});
			html.push('</table>');
			UICtrl.downFileByAjax(web_app.name + '/paymasterAction!expTableRecord.ajax',{html:encodeURI(html.join(''))},row.periodName);
			return false;
		}
   });
}

