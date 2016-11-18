<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	 <table class='tableInput' id='queryTable' >
	   <x:layout proportion="180px,180px,180px,180px" />
		
		<x:hidden name="familyMemberId"/>
		<x:hidden name="writeId"/>
		<tr>
		<x:inputTD name="familyName" required="true" label="家庭成员姓名" maxLength="5"/>		
		<x:selectTD name="familyRelation" required="true" label="与本人关系" maxLength="2" />		
		</tr>
		<tr>
		<x:inputTD name="familyFirm" required="false" label="工作单位" maxLength="16"/>		
	    <x:inputTD name="occupation" required="false" label="职务" maxLength="8"/>		
		</tr>
		<tr>
		<x:inputTD name="address" required="false" label="地址" maxLength="32"/>		
		<x:inputTD name="familyPhone" required="false" label="联系方式" maxLength="16"/>		
		</tr>
		
	</table>
</form>
