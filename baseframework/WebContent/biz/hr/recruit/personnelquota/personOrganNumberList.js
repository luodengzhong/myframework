var gridManager = null, refreshFlag = false;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();

});

//初始化表格
function initializeGrid() {
	var copyId=$('#copyId').val();
	var year=$('#year').val();
	var month=$('#month').val();
	var yearName=year+"年目标人数";
	var monthName=month+"月实际人数";
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		exportExcelHandler:function(){
			UICtrl.gridExport(gridManager);
		}
		/*copyHandler:{id:'copy',text:'备份',img:'page_extension.gif',click:function(){
			copy();
		}}*/
	});
	
	var columns=[{display: "单位路径", name: "fullName", width: 120, minWidth: 60, type: "string", align: "left",frozen: true},
		{ display: "单位名称", name: "name", width: 120, minWidth: 60, type: "string", align: "left",frozen: true,
			render:function(item){
				if(item.formalExistNum>item.formalNum){
					return '<font style="color:red;width:100%;height:100%;font-size:15px">'+item.name+'</font>';
				} 
				return item.name;},
			totalSummary:{
				render: function (suminf, column, data){
					return '合 计';
				},
				align: 'center'
			}}];
			
		columns.push({display:"计入人力成本",
		columns:[{display:"正式编制",
		columns:[{display: yearName, name: "formalNum", width: 100, minWidth: 60, type: "number", align: "left" ,
			totalSummary:UICtrl.getTotalSummary()},
			{display: monthName, name: "formalExistNum", width: 80, minWidth: 60, type: "number", align: "left",
	        totalSummary:UICtrl.getTotalSummary()}
			]},
			{display: "外包人数", name: "outpersonExistNum", width: 70, minWidth: 60, type: "number", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()},
		    {display: "见习人数", name: "proExistNum", width: 70, minWidth: 60, type: "number", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()},
		    {display: "实习人数", name: "studentExistNum", width: 70, minWidth: 60, type: "number", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()},
		    { display: "病产孕人数", name: "sickExistNum", width: 70, minWidth: 60, type: "number", align: "left",
			 totalSummary:UICtrl.getTotalSummary()},
			{ display: "非全日制用工人员", name: "partExistNum", width: 70, minWidth: 60, type: "number", align: "left",
			 totalSummary:UICtrl.getTotalSummary()},
			 { display: "口径合计", name: "hrTotalNum", width: 70, minWidth: 60, type: "number", align: "left",
			 totalSummary:UICtrl.getTotalSummary()}
			 ]
		});
		columns.push({display:"计入营销费用",
		columns:[
			{display: "正式编制", name: "yxformalExistNum", width: 80, minWidth: 60, type: "number", align: "left",
	        totalSummary:UICtrl.getTotalSummary()},
			{display: "外包人数", name: "yxoutpersonExistNum", width: 70, minWidth: 60, type: "number", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()},
		    {display: "见习人数", name: "yxproExistNum", width: 70, minWidth: 60, type: "number", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()},
		    {display: "实习人数", name: "yxstudentExistNum", width: 70, minWidth: 60, type: "number", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()},
		    { display: "病产孕人数", name: "yxsickExistNum", width: 70, minWidth: 60, type: "number", align: "left",
			 totalSummary:UICtrl.getTotalSummary()},
			{ display: "非全日制用工人员", name: "yxpartExistNum", width: 70, minWidth: 60, type: "number", align: "left",
			 totalSummary:UICtrl.getTotalSummary()},
			 { display: "口径合计", name: "yxTotalNum", width: 70, minWidth: 60, type: "number", align: "left",
			 totalSummary:UICtrl.getTotalSummary()}
			 ]
		});	
	 columns.push(
		 { display: "全口径合计", name: "totalExistNum", width: 70, minWidth: 60, type: "number", align: "left",totalSummary:UICtrl.getTotalSummary() }
	 );
	gridManager = UICtrl.grid('#maingrid', {
		columns:columns,
		/*[
		{ display: "单位名称", name: "name", width: 90, minWidth: 60, type: "string", align: "left",frozen: true,
			render:function(item){
				if(item.formalExistNum>item.formalNum){
					return '<font style="color:red;width:100%;height:100%;font-size:15px">'+item.name+'</font>';
				} 
				return item.name;},
			totalSummary:{
				render: function (suminf, column, data){
					return '合 计';
				},
				align: 'center'
			}},
		{ display: "当前年目标编制人数", name: "formalNum", width: 90, minWidth: 60, type: "string", align: "left" ,frozen: true,
			totalSummary:UICtrl.getTotalSummary()},		   
		{ display: "当月计编人数", name: "formalExistNum", width: 80, minWidth: 60, type: "string", align: "left",
		     totalSummary:UICtrl.getTotalSummary()},		   
		{ display: "外包人员动态", columns:[{display: "编制人数", name: "outpersonNum", width: 70, minWidth: 60, type: "string", align: "left",
			                              totalSummary:UICtrl.getTotalSummary()},
		                              {display: "实际人数", name: "outpersonExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()}] },		   
		{ display: "见习生人数", columns:[{display: "编制人数", name: "proNum", width: 70, minWidth: 60, type: "string", align: "left",
			                              totalSummary:UICtrl.getTotalSummary()},
		                              {display: "实际人数", name: "proExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()}] },		   
		{ display: "实习生人数", columns:[{display: "编制人数", name: "studentNum", width: 70, minWidth: 60, type: "string", align: "left",
			 totalSummary:UICtrl.getTotalSummary()},
		                              {display: "实际人数", name: "studentExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()}] },
		{ display: "病产孕人数", name: "sickExistNum", width: 70, minWidth: 60, type: "string", align: "left",
			 totalSummary:UICtrl.getTotalSummary()},	
		{ display: "非全日制用工人员", name: "partExistNum", width: 70, minWidth: 60, type: "string", align: "left",
			 totalSummary:UICtrl.getTotalSummary()},	
		{display: "专项编制",columns:[{display: "蓝图计划", columns:[{display: "编制人数", name: "blueNum", width: 70, minWidth: 60, type: "string", align: "left",
			                                     totalSummary:UICtrl.getTotalSummary()},
		                                                       {display: "实际人数", name: "blueExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                            	  totalSummary:UICtrl.getTotalSummary()}]},
		                           { display: "核心人才引进", columns:[{display: "编制人数", name: "importNum", width: 70, minWidth: 60, type: "string", align: "left",
		                           		     totalSummary:UICtrl.getTotalSummary()},
		                                                           {display: "实际人数", name: "importExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                           		       totalSummary:UICtrl.getTotalSummary()}] },
		                            { display: "A计划", columns:[{display: "编制人数", name: "aplanNum", width: 70, minWidth: 60, type: "string", align: "left",
		                          		                        totalSummary:UICtrl.getTotalSummary()},
		                          		                        {display: "实际人数", name: "aplanExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                          		                           totalSummary:UICtrl.getTotalSummary()}] },
		                            { display: "渠道正式人员", columns:[{display: "编制人数", name: "channelNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	  totalSummary:UICtrl.getTotalSummary()},
		                      		                          	 {display: "实际人数", name: "channelExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	totalSummary:UICtrl.getTotalSummary()}] }, 
		                      	   { display: "渠道外包人员", columns:[{display: "编制人数", name: "channelOutNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	  totalSummary:UICtrl.getTotalSummary()},
		                      		                          	 {display: "实际人数", name: "channelOutExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	totalSummary:UICtrl.getTotalSummary()}] }, 
		                      	   { display: "浦兴商贸", columns:[{display: "编制人数", name: "pxsmNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	  totalSummary:UICtrl.getTotalSummary()},
		                      		                          	 {display: "实际人数", name: "pxsmExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	totalSummary:UICtrl.getTotalSummary()}] }, 
		                      	    { display: "驻京办", columns:[{display: "编制人数", name: "zjbNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	  totalSummary:UICtrl.getTotalSummary()},
		                      		                          	 {display: "实际人数", name: "zjbExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	totalSummary:UICtrl.getTotalSummary()}] },           		                          	
		                      		{ display: "软件开发", columns:[{display: "编制人数", name: "softwareNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	  totalSummary:UICtrl.getTotalSummary()},
		                      		                          	 {display: "实际人数", name: "softwareExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	totalSummary:UICtrl.getTotalSummary()}] },  
		                      	   { display: "支付管理中心", columns:[{display: "编制人数", name: "payNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	  totalSummary:UICtrl.getTotalSummary()},
		                      		                          	 {display: "实际人数", name: "payExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	totalSummary:UICtrl.getTotalSummary()}] },
		                      	   { display: "保修", columns:[{display: "编制人数", name: "otherNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	  totalSummary:UICtrl.getTotalSummary()},
		                      		                          	 {display: "实际人数", name: "otherExistNum", width: 70, minWidth: 60, type: "string", align: "left",
		                      		                          	totalSummary:UICtrl.getTotalSummary()}] }
		                      		                          	]},
		 		{ display: "全口径合计", name: "totalExistNum", width: 70, minWidth: 60, type: "string", align: "left",totalSummary:UICtrl.getTotalSummary() }

		],*/
		dataAction : 'server',
		url: web_app.name+'/hRPersonnelQuotaAction!slicedPersonOrganNumberList.ajax',
		parms:{copyId:copyId,totalFields:'hrTotalNum,yxTotalNum,yxformalExistNum,yxoutpersonExistNum,yxproExistNum,yxstudentExistNum,yxsickExistNum,yxpartExistNum,formalNum,formalExistNum,outpersonExistNum,partExistNum,sickExistNum,studentExistNum,proExistNum,totalExistNum'},
		pageSize : 50,
		manageType:'hrArchivesManage',
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	
	});
	UICtrl.setSearchAreaToggle(gridManager);
}

// 查询
function query(obj) {
	var param = $(obj).formToJSON();
	UICtrl.gridSearch(gridManager, param);
}


//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 

//重置表单
function resetForm(obj) {
	$(obj).formClean();
}


function copy(){
		Public.ajax(web_app.name + '/hRPersonnelQuotaAction!copy.ajax',function(){
		reloadGrid();
	});
	
}


//关闭对话框
function dialogClose(){
	if(refreshFlag){
		reloadGrid();
		refreshFlag=false;
	}
}
