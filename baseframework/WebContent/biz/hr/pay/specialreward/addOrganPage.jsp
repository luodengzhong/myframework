<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout proportion="110px,190px"/>
	     <tr id="chooseKind">
			<x:hidden name="speciaId"/>
			<x:hidden name="organId" id="detailOrganId"/>
			<x:hidden name="personMemberId" id="detailPersonMemberId"/>
			<x:hidden name="allotKind" id="detailAllotKind"/>
			<x:inputTD name="organName" required="true" label="单位" maxLength="64" wrapper="select" id="detailOrganName"/>	
		</tr>
		<tr>
			<x:inputTD name="amount" required="true" label="金额" maxLength="15" mask="positiveMoney"/>		
		</tr>
		<tr>
			<x:inputTD name="personMemberName" required="true" label="分配责任人" maxLength="64" wrapper="select" id="detailPersonMemberName"/>		
		</tr>
		<tr>
			<x:inputTD name="groupRatio" required="true" label="团队比例%" maxLength="5" mask="nnn"/>		
	     </tr>
	     <tr>
			<x:textareaTD name="remark" required="false" label="备注" maxLength="100" />		
	     </tr>
	</table>
</form>
