<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="id" id="detailId"/>
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="80px,120px,80px,120px,80px,120px"/>
	     <tr>
			<x:hidden name="fieldId" id="delailFieldId"/>
			<x:inputTD name="name" id="delailName" required="true" label="字段编码" wrapper="select" dataOptions="type:'hr',name:'archivesFieldChoose',back:{fieldId:'#delailFieldId',name:'#delailName',display:'#delailDisplay'}"/>		
			<x:inputTD name="display" id="delailDisplay" readonly="true" label="字段名称"/>
			<x:radioTD dictionary="yesorno" name="isWageField" required="true" label="薪酬字段"/>
		</tr>
		<tr>
			<x:textareaTD name="ruleContent" required="false" label="计算规则" maxlength="2048" rows="12" colspan="5"/>
	     </tr>
	</table>
</form>
