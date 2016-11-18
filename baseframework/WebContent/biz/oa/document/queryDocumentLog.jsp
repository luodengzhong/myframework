<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="queryDocumentLogForm">
	<div class="ui-form" >
		<x:inputL name="createByName" required="false" label="操作人"  labelWidth="70"  width="100"/>		
		<x:inputL name="createByName" required="false" label="详细信息"  labelWidth="70" />
		<div class="clear"></div>
		<x:selectL name="operationType"  label="操作类型"  list="operationTypeList" labelWidth="70" width="100"/>
		<dl>
			<dt style="width: 70px;">操作时间&nbsp;:</dt>
			<dd style="width:100px">
				<x:input name="createBeginDate" required="false" label="时间起" wrapper="date" />
			</dd>
			<dd style="width:100px">
				<x:input name="createEndDate" required="false" label="时间止" wrapper="date" />
			</dd>
		</dl>
		<c:if test="${showButton}">
		<dl>
			 <x:button value="查 询" onclick="query(this.form)" />
			&nbsp;&nbsp;
			<x:button value="重 置" onclick="resetForm(this.form)" />
			&nbsp;&nbsp;
		</dl>
		</c:if>
	</div>
</form>