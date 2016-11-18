<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<table class='tableInput' style="width: 99%;">
		<x:layout proportion="90px,160px,90px,160px,90px,160px" />
		<x:hidden name="hunterId"/>
		<x:select name="wageChangeKind"  cssStyle="display:none;" emptyOption="false"/>
		<tr>
		<x:inputTD name="name" required="true" label="公司名称"/>	
		<x:inputTD name="code" required="true" label="猎头验证码"/>	
		<x:inputTD name="palce" required="false" label="总部所在地"/>		
		</tr>
		<tr>	
		<x:inputTD name="cooperateStatus" required="true" label="合作状态"  id="detailCoopStatus"/>	
		<x:inputTD name="contactPerson" required="false" label="联系人" />	
		<x:inputTD name="contactTelephone" required="false" label="联系号码" />		
		</tr>
		<tr>		
		<x:inputTD name="beginTime" required="false" label="起始时间"  wrapper="date"/>		
		<x:inputTD name="endTime" required="false" label="终止时间"  wrapper="date"/>		
		<x:inputTD name="suggestCoopWay" required="false" label="建议合作状态"  id="detailSuggestStatus"/>	
		</tr>
		<tr>
		<x:inputTD name="cost" required="false" label="费用(%)"  mask="nnn"/>		
		<x:inputTD name="importantPerson" required="false" label="代表客户"   colspan="3"  maxLength="128"/>		
		</tr>
		<tr>
		<x:textareaTD name="companyDetail" required="false" label="公司情况汇总" rows="3"   colspan="5" maxLength="512"/>	
		</tr>
		<tr>
		<x:textareaTD name="characteristic" required="false" label="特点" rows="3"   colspan="5" maxLength="512"/>		
		</tr>
	</table>
</form>
