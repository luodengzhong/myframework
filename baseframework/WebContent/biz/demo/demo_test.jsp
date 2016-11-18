<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' id='queryTable'>
		<x:layout proportion="80px,160px,80px,160px,80px,160px"/>
		<tr>
			<x:hidden name="id" />
			<x:inputTD name="sourcetable" required="true" label="对应表名"
				readonly="false" />
			<x:inputTD name="filename1" required="true" label="文件名" dataOptions="data:{'a':'不同意','b':'同意'}" combo="true" />
			<x:hidden name="createby" id="edit_createby" />
			<x:inputTD name="createbyname" id="edit_createbyname" label="创建人"
				wrapper="select" required="true"
				dataOptions="type:'test',name:'test001',callBackControls:{operatorname:'#edit_createbyname',userid:'#edit_createby'}" />
		</tr>
		<tr>
			<x:inputTD name="remark" required="false" label="备注" />
			<x:inputTD name="createdate" label="创建时间" wrapper="date"
				required="true" />
			<x:inputTD name="path" required="false" label="路径" readonly="false"
				match="url" />
		</tr>
		<tr>
			<x:selectTD name="remark" required="false" label="备注" dictionary="degree" value="1" readonly="true"/>
			<x:inputTD name="createdate" label="创建时间" spinner="true"
				required="true" readonly="true"/>
			<x:inputTD name="path" required="false" label="路径" readonly="false"
				match="url" disabled="true"/>
		</tr>
		<tr>
		 <td colspan=2><input type="button" value="上 传" id="aaaaaa"/></td>
		</tr>
	</table>
</form>

