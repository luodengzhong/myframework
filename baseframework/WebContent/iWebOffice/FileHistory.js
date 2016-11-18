var gridManager;
$(function() {
	initializeGrid();
	//<img src='<c:url value="/attachmentAction!downFileBySavePath.ajax?file=${picturePath}"/>' height='120' width='85' border=0 id="showArchivePicture"/>
	function initializeGrid() {
		var recordId = Public.getQueryStringByName("recordId");
		gridManager = UICtrl.grid("#maingrid", {
			columns : [ 
			            { display : "修改人", name : "updaterName", width : 100 , minWidth : 60, type : "string", align : "left" },
			            { display : "修改时间", name : "updateDate", width : 150 , minWidth : 60, type : "string", align : "left" },
			            { display : "操作", name : "path", width : 50 , minWidth : 60, type : "string", align : "left",
			            	render: function(item) {
								var filePath = item.path;
								if(filePath){
									var html = "<a href='##' onclick='downFile(\""+encodeURI(filePath)+"\")' class='GridStyle'>下载</a>";
									return html;
								}
								return "";
							}
			            }
			          ],
			dataAction : "server",
			url : web_app.name + "/webOfficeAction!queryHistory.ajax",
			parms: {recordId: recordId},
			width : "99.8%",
			height : "350",
			headerRowHeight : 25,
			rowHeight : 25,
			fixedCellHeight : true,
			selectRowButtonOnly : true
		});
	}
});

function downFile(path){
	path=decodeURI(path);
	var iframe=$('#down_file_iframe')[0];
	iframe.src=web_app.name+"/attachmentAction!downFileBySavePath.ajax?file="+path;
}