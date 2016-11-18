var advanceQueryGridManager, scopeQueryGridManager;

var MergeHandlerManager = MergeHandlerManager || {}; //合并处理人管理器

/**
 * 初始化流转预览表格
 * @param previewHandlerData
 * 预览数据
 */
function initAdvanceQueryGrid(previewHandlerData) {
    var hideSegmention = (!previewHandlerData.hasSegmentation);
    
    MergeHandlerManager.initCanMerge(previewHandlerData.Rows);
    
    var hasCanMerge = MergeHandlerManager.calculateCanMerge(previewHandlerData.Rows);
    
    var hideOperation = !previewHandlerData.hasSelection && !hasCanMerge;
    
    advanceQueryGridManager =$("#advanceQueryGrid").ligerGrid({
        columns: [
		            { display: "环节", name: "handleKindName", width: 140, minWidth: 60, type: "string", align: "left",
		                render: function (item) {
		                    if (HandlerKind.isSelection(item.handleKindCode)) {
		                        return '<font style="color:Tomato;font-size:13px;">' + item.handleKindName + '</font>';
		                    } else {
		                        return item.handleKindName;
		                    }
		                }
		            },
		            { display: "选择", name: "selectSegmentation", width: 40, minWidth: 40, type: "string", align: "left", hide: hideSegmention,
		                render: function (item) {
		                    if (item.showRadioCtrl) {
		                        var checked = item.checked == true ? ' checked="true" ' : '';
		                        return '<center><input type="radio" style="height:23px; line-height:23px;" name="' + item.ruleHandlerId
		                          + '" value="' + item.id + '"' + checked + '  bizSegmentationTypeCode="' + item.bizSegmentationTypeCode + '" /></center>';
		                    }
		                }
		            },
		            { display: "业务段", name: "bizSegmentationName", width: 100, minWidth: 60, type: "string", align: "left", hide: hideSegmention,
		                render: function (item) {
		                    if (item.bizSegmentationCount && parseInt(item.bizSegmentationCount) > 1) {
		                        return '<font style="color:Tomato;font-size:13px;">' + item.bizSegmentationName + '</font>';
		                    } else {
		                        return item.bizSegmentationName;
		                    }
		                }
		            },
		            { display: "办理人", name: "fullName", width: 380, minWidth: 60, type: "string", align: "left",
		                render: function (item) {
		                	if (Public.isBlank(item.fullName)){
		                		if (HandlerKind.isSelection(item.handleKindCode) && item.isMustPass){
		                			return '<font style="color:Tomato;font-size:13px;">必经环节...</font>';
		                		}
		                		return "";
		                	}
		                    if (item.bizSegmentationCount && parseInt(item.bizSegmentationCount) > 1) {
		                        return '<font style="color:Tomato;font-size:13px;">' + item.fullName + '</font>';
		                    }
		                    return item.fullName;
		                }
		            },
		            { display: "已合并", name: "merged", width: 60, minWidth: 60, type: "string", hide: true},
		            { display: "操作", name: "operation", width: 60, minWidth: 60, type: "string", align: "center", hide: hideOperation,
		            	render: function (item){
		            		var result = "";
		            		if (HandlerKind.isSelection(item.handleKindCode)){
		            			result = "<a href='##' class='GridStyle Selection' HandlerKind ='" + item.handleKindCode + "' rowIndex='" + item.__index + "' procUnitName='" + item.handleKindName +"'>选择</a>";
		            		}
		            		if (item.canMerge == "1" && Public.isBlank(item.handleKindId)){
		            			var operationalDisplay = MergeHandlerManager.getOperationalDisplay(item.merged);
		            			result += "<a href='##' " + operationalDisplay.style + " class='GridStyle Merging' merged='"+ item.merged + "' rowIndex='" + item.__index + "'>"  + operationalDisplay.display + "</a>"
		            		}
		            		return result;
		            	}
		            },
		            { display: "分组", name: "groupId", width: 60, minWidth: 60, type: "string", align: "left" },
		            { display: "处理人", name: "handlerData", width: 60, minWidth: 60, type: "string", align: "left", hide: true}
		            
		             ],
        dataAction: "local",
        data: previewHandlerData,
        checkbox: false,
        usePager: false,
        width: "790",
        height: "360",
        enabledSort: false,
        autoAddRowByKeydown:false,
        enabledEdit: true,
        rownumbers: true,
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        fixedCellHeight: true,
        selectRowButtonOnly: true,
        title:"流程审批规则：" + previewHandlerData.procApprovalRuleFullName,
        onAfterShowData: function (currentData) {
            setTimeout(function () {
                var grid = $("#advanceQueryGrid");
                UICtrl.mergeCell("handleKindName", grid);
                UICtrl.mergeCell("bizSegmentationName", grid);
                UICtrl.setGridRowAutoHeight($('#advanceQueryGrid'));
            }, 100);
        },
        onAfterChangeColumnWidth: function () {
            UICtrl.setGridRowAutoHeight($('#advanceQueryGrid'));
        }
    });
    
    $('#advanceQueryGrid').on('click',function(e){
    	var $clicked = $(e.target || e.srcElement);
		if($clicked.hasClass('Selection')){
			var handlerKind = $clicked.attr('handlerKind');
			var procUnitName = $clicked.attr('procUnitName');
			var rowIndex = $clicked.attr("rowIndex");
			
			showSelectHandlerDialog(handlerKind, rowIndex, procUnitName);
		}else if ($clicked.hasClass('Merging')){
			var merged = $clicked.attr('merged');
			var rowIndex = $clicked.attr("rowIndex");
			
			MergeHandlerManager.mergeProcUnitHandler(merged, rowIndex);
		}else if ($clicked.hasClass('SelectionMerging')){

			var merged = $clicked.attr('merged');
			var rowIndex = $clicked.attr("rowIndex");
			var selectedRowIndex = $clicked.attr("selectedRowIndex");
			
			MergeHandlerManager.mergeProcUnitInnerHandler(merged, rowIndex, selectedRowIndex);
		}
    });
}

function initScopeQueryGrid(scopeData){
	scopeQueryGridManager = $("#scopeQueryGrid").ligerGrid({
        columns: [ { display: "办理人", name: "fullName", width: 230, minWidth: 60, type: "string", align: "left",
        	      render: function(item){
        	    	  return item.orgName + "." + item.deptName + "." + item.positionName + "." + item.handlerName;
        	      } 
                  }
		         ],
        dataAction: "local",
        data: scopeData,
        checkbox: true,
        usePager: false,
        width: "300",
        height: "320",
        enabledSort: false,
        autoAddRowByKeydown:false,
        rownumbers: true,
        heightDiff: -10,
        headerRowHeight: 25,
        rowHeight: 25,
        fixedCellHeight: true,
        selectRowButtonOnly: true
    });
}

function showSelectHandlerDialog(handlerKind, rowIndex, procUnitName){
	if (handlerKind == HandlerKind.MANUAL_SELECTION){
		showManualSelectHandlerDialog(rowIndex, procUnitName)
	}else{
		showScopeSelectHandlerDialog(rowIndex, procUnitName);
	}
}

function showManualSelectHandlerDialog(rowIndex, procUnitName){
	var params = {};
    var selectOrgParams = OpmUtil.getSelectOrgDefaultParams();

    params.counterSignKindId = CounterSignKind.MANUAL_SELECTION;
    params.procUnitName = procUnitName;
    params.beginGroupId = advanceQueryGridManager.getRow(rowIndex).groupId;
    var nextRow = advanceQueryGridManager.getRow(rowIndex+1);
    if (nextRow){
    	params.endGroupId = nextRow.groupId;
    }else{
        params.endGroupId = params.groupId + 200;
    }
    
    params = $.extend({}, params, selectOrgParams, { showPosition: false });
    
    UICtrl.showFrameDialog({
        title: '选择处理人',
        width: 800,
        height: 380,
        parent: window['advanceQueryDialog'],
        url: web_app.name + '/workflowAction!showCounterSignDialog.do',
        param: params,
        init:function(){
        	var handlerData = advanceQueryGridManager.getRow(rowIndex).handlerData;
        	if (!handlerData){
        		return;
        	}
        	
			var addFn=this.iframe.contentWindow.addDataOneNode;
			if($.isFunction(addFn)){//初始化已选择列表
				this.iframe.contentWindow.isInitializingData = true;
				
				$.each(handlerData,function(i,d){
					addFn.call(window, d);
				});
				
				this.iframe.contentWindow.isInitializingData = false;
				//刷新列表
				var reloadGrid=this.iframe.contentWindow.reloadGrid;
				reloadGrid.call(window);
			}
		},
        ok: function(){
        	doSelectHandler.call(this, HandlerKind.MANUAL_SELECTION, rowIndex);
        },	
        close: onDialogCloseHandler,
        cancelVal: '关闭',
        cancel: true
    });
}

function doSelectHandler(kindId, rowIndex){
	var selectedData = kindId == HandlerKind.MANUAL_SELECTION ? this.iframe.contentWindow.getChooseGridData() : scopeQueryGridManager.getSelectedRows();;
    if (!selectedData) {
        return;
    }
    var _self = this;

    MergeHandlerManager.initCanMerge(selectedData);

    advanceQueryGridManager.updateCell('handlerData', selectedData, rowIndex);

    var data = advanceQueryGridManager.getData();
    
    MergeHandlerManager.initCanMerge(data);
    MergeHandlerManager.calculateCanMerge(data);
    MergeHandlerManager.calculateProcUnitInnerFullName(data);
    
    advanceQueryGridManager.setData({Rows: data});
    advanceQueryGridManager.reload();

	_self.close();
}

/**
 * 显示范围选择处理人对话框
 * @param rowIndex
 * @param procUnitName
 */
function showScopeSelectHandlerDialog(rowIndex, procUnitName){
	var scopeData = {Rows: advanceQueryGridManager.getRow(rowIndex).scopeData };
    UICtrl.showDialog({
     	content:'<div id="scopeQueryGrid"></div>',
     	title: '选择处理人',
     	width: 340,
        height: 350,               
        cancel: "取消",
        parent: window['advanceQueryDialog'],
        init: function (){
        	initScopeQueryGrid(scopeData);
        },
        ok: function(){
        	doSelectHandler.call(this, HandlerKind.SCOPE_SELECTION, rowIndex);
        }
     });
}

/**
 * 初始化可合并属性
 */
MergeHandlerManager.initCanMerge = function (data){
	var obj;
	for (var i = 0, len = data.length; i < len; i++){
		obj = data[i];
		if (HandlerKind.isSelection(obj.handleKindCode || HandlerKind.PSM)){
			selectedData = obj.handlerData;
			if (selectedData){
				MergeHandlerManager.initCanMerge(selectedData);
			}
		}else{
			data[i].canMerge = "0";
			data[i].merged = "0";
		}
	}
}

/**
 * 合并环节处理人
 */
MergeHandlerManager.mergeProcUnitHandler = function(merged, rowIndex){
	merged = merged == "1" ? "0" : "1";
	advanceQueryGridManager.updateCell('merged', merged, rowIndex);
	advanceQueryGridManager.reload();	
}

/**
 *合并环节内部处理人
 */
MergeHandlerManager.mergeProcUnitInnerHandler = function(merged, rowIndex, selectedRowIndex){
	var data = advanceQueryGridManager.getData();
	var selectedData;
	for (var i = 0, outerLen = data.length; i < outerLen; i++){
		if (data[i].__id == rowIndex){
			selectedData = data[i].handlerData;
			for (var j = 0, innerLen = selectedData.length; j < innerLen; j++){
				if (selectedData[j].__id == selectedRowIndex){
					merged = merged == "1" ? "0" : "1"
					selectedData[j].merged = merged;
					MergeHandlerManager.updateProcUnitInnerHandler(selectedData, rowIndex);
				}
			}
		}
	}	
}

MergeHandlerManager.updateProcUnitInnerHandler = function(selectedData, rowIndex){
	var fullName = "", operationalDisplay;
	if (selectedData){
		for(var i = 0, len = selectedData.length; i < len; i++){
			selectedObj = selectedData[i];
			fullName +=  selectedObj.handlerName;
			if (selectedObj.canMerge == "1"){
				operationalDisplay = MergeHandlerManager.getOperationalDisplay(selectedObj.merged);
				fullName += "&nbsp;&nbsp;<a href='##' " + operationalDisplay.style + " class='GridStyle SelectionMerging' merged='"+ selectedObj.merged + "' rowIndex='" + rowIndex +  "' selectedRowIndex='" + selectedObj.__id + "'>"  + operationalDisplay.display + "</a>"
			}
			
			if (i != len - 1){
				fullName += ","
	    	}
		}
	}
	advanceQueryGridManager.updateCell('handlerData', selectedData, rowIndex);
	advanceQueryGridManager.updateCell('fullName', fullName, rowIndex);
}

MergeHandlerManager.internalCalculateBackwardCanMerge = function(obj, currentPersonId){
	var result = false;
	if (obj.handlerId) {
		var personId = OpmUtil.getPersonIdFromPsmId(obj.handlerId);	
		if (personId == currentPersonId){
			obj.canMerge = "1";
			result = true;
		}
	}
	return result;
}

/**
 * 向后计算处理人的可合并属性
 */
MergeHandlerManager.calculateBackwardCanMerge = function (data, currentIndex, currentPersonId){
	var obj, selectedData, selectedObj, canMerged = false, currentHandlerCanMerged;
	for (var i = currentIndex + 1, l = data.length; i < l; i++){
		obj = data[i];
		
		if (obj.handleKindCode == HandlerKind.SEGMENTATION){
			continue;
		}
		
		if (HandlerKind.isSelection(obj.handleKindCode)){
			selectedData = obj.handlerData;
			if (selectedData){
				for (var j = 0, len = selectedData.length; j < len; j++){
					selectedObj = selectedData[j];
					currentHandlerCanMerged = MergeHandlerManager.internalCalculateBackwardCanMerge(selectedObj, currentPersonId);
					canMerged = canMerged || currentHandlerCanMerged;
				}
			}
		}else{
			currentHandlerCanMerged = MergeHandlerManager.internalCalculateBackwardCanMerge(obj, currentPersonId);
			canMerged = canMerged || currentHandlerCanMerged;
		}
	}
	return canMerged;
}

/**
 * 内部计算处理人的可合并属性
 */
MergeHandlerManager.internalCalculateCanMerge = function(data, index, currentObj){
	var canMerge = false;
	if (currentObj.handlerId){
		var currentPersonId = OpmUtil.getPersonIdFromPsmId(currentObj.handlerId);
		canMerge = MergeHandlerManager.calculateBackwardCanMerge(data, index, currentPersonId);
		
		if (canMerge){
			currentObj.canMerge = "1";
		}else{
			currentObj.canMerge = "0";
			currentObj.merged = "0";
		}	
	}
	return canMerge;
}

/**
 * 计算处理人的可合并属性
 A1  A                     B        C      B      D       A1
     A1 A2 A3                                       A1 A3
*/
MergeHandlerManager.calculateCanMerge = function(data){
	var currentObj, currentPersonId, hasCanMerge = false, canMerge, selectedData;
	for (var i = 0, l = data.length; i < l - 1; i++)
    {
		currentObj = data[i];		
		//段不需合并
		if (currentObj.canMerge == "1" || currentObj.handleKindCode == HandlerKind.SEGMENTATION){
			continue;
		}
		//选择处理人
		if (HandlerKind.isSelection(currentObj.handleKindCode)){
			selectedData = currentObj.handlerData;
			if (selectedData){
				for (var j = 0, len = selectedData.length; j < len; j++){
					//currentObj已重新赋值了
					currentObj = selectedData[j];
					if (currentObj.canMerge != "1"){
						canMerge = MergeHandlerManager.internalCalculateCanMerge(data, i, currentObj);
						hasCanMerge = hasCanMerge || canMerge;
					}
				}
			}
		}else{
			canMerge = MergeHandlerManager.internalCalculateCanMerge(data, i, currentObj);
			hasCanMerge = hasCanMerge || canMerge;
		}
    }
	return hasCanMerge;
}

MergeHandlerManager.getOperationalDisplay = function(merged){
	var display = merged == "1" ? "已合并" : "未合并";            			
	var style = merged == "1" ? "style='color:red;'" : "";
	return { display: display, style: style }; 
}

/**
 * 计算选择处理人的FullName
 */
MergeHandlerManager.calculateProcUnitInnerFullName = function (data){	
	var obj, fullName, selectedData, selectedObj, operationalDisplay;
    for(i = 0, l = data.length; i < l; i++){
    	obj = data[i];
    	if (HandlerKind.isSelection(obj.handleKindCode)){
    		fullName = "";
    		selectedData = obj.handlerData;
			if (selectedData){
				for(var j = 0, len = selectedData.length; j < len; j++){
					selectedObj = selectedData[j];
					fullName +=  selectedObj.handlerName;
					
					if (selectedObj.canMerge == "1"){
						operationalDisplay = MergeHandlerManager.getOperationalDisplay(selectedObj.merged);
						fullName += "&nbsp;&nbsp;<a href='##' " + operationalDisplay.style + " class='GridStyle SelectionMerging' merged='"+ selectedObj.merged + "' rowIndex='" + obj.__id +  "' selectedRowIndex='" + selectedObj.__id + "'>"  + operationalDisplay.display + "</a>"
					}
					
					if (j != len - 1){
						fullName += ",";
			    	}
				}
			}
			obj.fullName = fullName;
			advanceQueryGridManager.updateCell('fullName', fullName, obj.__id);
    	}
    }
}

/**
* 得到处理人
*/
function getAdvanceQueryHandlers() {
    var row;
    var data = advanceQueryGridManager.getData();
    
    for (var i = 0; i < data.length; i++) {
        row = data[i];
        if (HandlerKind.isSelection(row.handleKindCode) && data[i].isMustPass) {
            if (!row.fullName) {
                Public.errorTip("选择节点没有选择办理人，不能提交。");
                return false;
            }
        }
    }

    var $SelectedBizSegmentation = $("input:radio:checked");
    var selectedBizSegmentations = [];
    for (var i = 0; i < $SelectedBizSegmentation.length; i++) {
        selectedBizSegmentations.push($($SelectedBizSegmentation[i]).attr("bizSegmentationTypeCode"));
    }

    var found;
    var result = [];
    for (var i = 0; i < data.length; i++) {
        if (!data[i].bizSegmentationTypeCode) {
            result.push(data[i]);
        } else {
            found = false;
            for (var j = 0; j < selectedBizSegmentations.length; j++) {
                if (data[i].bizSegmentationTypeCode == selectedBizSegmentations[j]) {
                    found = true;
                    break;
                }
            }
            if (found && data[i].fullName) {
                result.push(data[i]);
            }
        }
    }

    $.each(result, function(i, o){
    	delete o.scopeData;
    });
    
    return result;
}