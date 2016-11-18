<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout/>
		<tr>
			<x:hidden name="infoFeedbackTemplateId"  id="detailInfoFeedbackTemplateId"/>
			<x:inputTD name="code" required="true" label="模板编码" maxLength="16" />
			<x:inputTD name="name" required="true" label="模板名称" maxLength="30" />
			<x:inputTD name="sequence" required="true" label="序号"  mask="nnnn" spinner="true"/>
		</tr>
		<tr>
			<x:inputTD name="remark" required="false" label="备注" maxLength="100"  colspan="5"/>
		</tr>
	</table>
</form>
<div class="blank_div"></div>
<div id="infoFeedbackTemplateItemGrid"></div>