<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:880px;">
		<div class="ui-form-container">
			<div class="row">
				<x:hidden name="id" />
				<x:inputL name="sourcetable" required="true" label="对应表名"
					readonly="false" />
				<x:inputL name="filename" required="true" label="文件名" />
				<x:hidden name="createby" id="edit_createby" />
				<x:inputL name="createbyname" id="edit_createbyname" label="创建人"
					wrapper="select"
					dataOptions="type:'test',name:'test001',callBackControls:{operatorname:'#edit_createbyname',userid:'#edit_createby'}" />
			</div>
			<div class="row">
				<x:inputL name="remark" required="false" label="备注" />
				<x:inputL name="createdate" label="创建时间" wrapper="date"
					required="true" />
				<x:inputL name="path" required="false" label="路径" readonly="false"
					match="url" />
			</div>
		</div>
	</div>
</form>
<div id="extendedFieldDiv"></div>

