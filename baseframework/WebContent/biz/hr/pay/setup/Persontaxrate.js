var gridManager = null;
$(document).ready(function() {
	UICtrl.autoSetWrapperDivHeight();
	initializeGrid();
	initializeUI();
});

function initializeUI(){
	UICtrl.layout("#layout", {leftWidth : 200,heightDiff : -5});
	var childrenData = [];
	Public.ajax(web_app.name + "/paySetupAction!queryMainPersontaxrate.ajax",{}, function(data) {
		for(var i=0; i < data.Total; i++){
			childrenData[i]={id : data.Rows[i].mainId,text : data.Rows[i].name,icon : '',url : '',isexpand : false,children : ''}
		}
	$("#maintree").ligerTree({
					data : [{id : '-1',text : '个税分类',icon : '',url : '',isexpand : true,children : childrenData
							}],
					onClick : function(node) {onFolderTreeNodeClick(node)}
				});
	});
}

function onFolderTreeNodeClick(data) {
	var html=[],mainId=data.data.id;
	if(mainId==-1){
		mainId="";
		html.push('个税分类');
	}else{
		html.push('<font style="color:Tomato;font-size:13px;">[',data.data.text,']</font>个税分类');
	}
	$('.l-layout-center .l-layout-header').html(html.join(''));
	$('#mainId').val(mainId);
	if (gridManager) {
		UICtrl.gridSearch(gridManager,{mainId:mainId});
	}
}

//初始化表格
function initializeGrid() {
	var toolbarOptions = UICtrl.getDefaultToolbarOptions({ 
		saveHandler: saveHandler,
		addHandler: function(){
			var mainId=$('#mainId').val();
			if(mainId < 1){
				Public.tip('请选择分类!');
				return ;
			}
            var addRows = [], addRow;
            addRow = {mainId:mainId,lowerlimit:"",upperlimit:"",rate:"",deduct:""};
            gridManager.addRows(addRow);
		}, 
		deleteHandler: deleteHandler
	});
	gridManager = UICtrl.grid('#maingrid', {
		columns: [
			{ display: "mainId", name: "mainId", width: 150, minWidth: 60, type: "money", align: "left", hide: true
			},
			{ display: "收入下限", name: "lowerlimit", width: 150, minWidth: 60, type: "money", align: "left" ,
				editor: { type: 'text',required:true,mask:'money'}
			},		   
			{ display: "收入上限", name: "upperlimit", width: 150, minWidth: 60, type: "money", align: "left",
				editor: { type: 'text',required:true,mask:'money'}
			},		   
			{ display: "适用税率", name: "rate", width: 150, minWidth: 60, type: "string", align: "left" ,
				editor: { type: 'text',required:true,mask:'nnn'}
			},		   
			{ display: "扣除数", name: "deduct", width: 150, minWidth: 60, type: "money", align: "left" ,
				editor: { type: 'text',required:true,mask:'money'}
			}
		],
		dataAction : 'server',
		url: web_app.name+'/paySetupAction!slicedPersontaxrateQuery.ajax',
		pageSize : 20,
		width : '100%',
		height : '100%',
		heightDiff : -5,
		headerRowHeight : 25,
		rowHeight : 25,
		enabledEdit: true,
		checkbox:true,
		autoAddRow:{},
		sortName:'lowerlimit',
		sortOrder:'asc',
		toolbar: toolbarOptions,
		fixedCellHeight : true,
		selectRowButtonOnly : true
	});
}



//刷新表格
function reloadGrid() {
	gridManager.loadData();
} 


//添加按钮 
function saveHandler() {
	var detailData=DataUtil.getGridData({gridManager:gridManager});
	if(!detailData) return false;
	if(detailData.length==0){
		Public.tip('没有数据被修改!');
		return false;
	}
	Public.ajax(web_app.name + '/paySetupAction!savePersontaxrate.ajax', {datas:encodeURI($.toJSON(detailData))}, function(data) {
		reloadGrid();
	});
}

//删除按钮
function deleteHandler(){
	DataUtil.del({action:'paySetupAction!deletePersontaxrate.ajax',
		gridManager:gridManager,
		onSuccess:function(){
			reloadGrid();		  
		}
	});
}