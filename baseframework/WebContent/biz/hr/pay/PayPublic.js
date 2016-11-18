var PayPublic = PayPublic || {};
//初始化业务期间选择对话框
PayPublic.initPeriodSearchbox=function(){
	$('#periodName').searchbox({type:'hr',name:'chooseOperationPeriod',getParam:function(){
		var year=$('#year');
		if(year.length>0){
			var y=year.val();
			if(y!=''){
				return {paramValue:y};
			}
		}
	},back:{periodId:'#periodId',yearPeriodName:'#periodName'}});
};
/****************业务期间更改选择器*******************/
PayPublic.updateOperationPeriod=function(op){
	op=$.extend({title:'请选择业务期间',type:'hr',name:'chooseOperationPeriod',width:305},op||{});
	var button=op.button||'#toolbar_menuupdateOperationPeriod';
	op['onInit']=function(doc){
		//默认查询条件为当前年
		var year = new Date().getFullYear();
		$('input.text',doc).val(year).mask('9999').spinner();
	};
	$(button).comboDialog(op);
};
PayPublic.updateOperationPeriodByAudit=function(gridManager,action,callBack){
	var options={
		onShow:function(){
			if($('#auditId').val()==''){
				Public.tip("没有数据,无法执行!");
				return false;
			}
			var data=gridManager.getChanges();
			if(data.length > 0){
				return confirm(gridManager.options.isContinueByDataChanged);
			}
		},
		getParam:function(){
			var organId=$('#organId').val();
			var year = new Date().getFullYear();
			return {organId:organId,paramValue:year};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			var rows = gridManager.getSelectedRows();
			var periodId=row['periodId'];
			if (!rows || rows.length < 1) {
				UICtrl.confirm('您确定修改所有数据的业务期间吗?', function() {
					Public.ajax(web_app.name + '/'+action,
							{periodId:periodId,auditId:$('#auditId').val()}, 
							function(data) {
								if($.isFunction(callBack)){
									callBack.call(window);
								}else if($.isFunction(window['reloadGrid'])){
									window['reloadGrid']();	
								}	
							}
					);
				});
			}else{
				DataUtil.updateById({action:action,
					gridManager:gridManager,idFieldName:'detailId',param:{periodId:periodId},
					onSuccess:function(){
						if($.isFunction(callBack)){
							callBack.call(window);
						}else if($.isFunction(window['reloadGrid'])){
							window['reloadGrid']();	
						}
					}
				});
			}
			return true;
		}
	};
	PayPublic.updateOperationPeriod(options);
};
PayPublic.updateOperationPeriodByRow=function(gridManager,action,callBack){
	var options={
		onShow:function(){
			var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return false; }
			/*var isEffect=row['isEffect'];
			if(isEffect=='1'){
				Public.tip('已生效的数据不能修改！'); 
				return false; 
			}*/
		},
		getParam:function(){
			var row = gridManager.getSelectedRow();
			var organId=row['organId'];
			var year = new Date().getFullYear();
			return {organId:organId,paramValue:year};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			var periodId=row['periodId'];
			var gridRow = gridManager.getSelectedRow();	
			Public.ajax(web_app.name + '/'+action,{periodId:periodId,detailId:gridRow['detailId']}, function(data) {
				if($.isFunction(callBack)){
					callBack.call(window);
				}else if($.isFunction(window['reloadGrid'])){
					window['reloadGrid']();	
				}
			});
			return true;
		}	
	};
	PayPublic.updateOperationPeriod(options);
};

//是否执行显示图片
PayPublic.getIsEffectfo=function(isEffect) {
    switch (parseInt(isEffect)) {
        case 0:
            return "<div class='tmp' title='未生效'/>";
            break;
        case 1:
            return "<div class='Yes' title='已生效'/>";
            break;
        case -1:
            return "<div class='No' title='作废'/>";
            break;
    }
};
/*************批量选择修改业务期间**********************/
//允许选择多行执行
PayPublic.updateOperationPeriodByMultilRow=function(gridManager,action,callBack){
	var options={
		onShow:function(){
			var row = gridManager.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return false; }
		},
		getParam:function(){
			var row = gridManager.getSelectedRow();
			var organId=row['organId'];
			var year = new Date().getFullYear();
			return {organId:organId,paramValue:year};
		},
		onChoose:function(){
			var row=this.getSelectedRow();
			if (!row) {Public.tip('请选择数据！'); return; }
			var periodId=row['periodId'];
			var gridRows = gridManager.getSelectedRows();	
			var detailIds=new Array();
			if(gridRows){
				$.each(gridRows,function(i,o){
					detailIds.push(o['detailId']);
				});
			}
			if(detailIds.length==0){
				Public.tip('请选择数据！'); return; 
			}
			Public.ajax(web_app.name + '/'+action,{periodId:periodId,ids:encodeURI($.toJSON(detailIds))}, function(data) {
				if($.isFunction(callBack)){
					callBack.call(window);
				}else if($.isFunction(window['reloadGrid'])){
					window['reloadGrid']();	
				}
			});
			return true;
		}	
	};
	PayPublic.updateOperationPeriod(options);
};