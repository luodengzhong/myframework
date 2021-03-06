<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:340px;">
		
		<x:hidden name="attPeriodOndutyId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="periodId"/>
		<div class="row">
			<x:inputL name="year" label="业务年" required="true" cssStyle="width:80px;" width="60"/>
		</div>
		<div class="row">
			<x:inputL name="periodName" required="true" label="期间" wrapper="combo"  width="220" maxLength="22"/>			
		</div>
		<div class="row">
			<x:inputL name="positionName" required="false" readonly="true" label="岗位全路径"  width="220" maxLength="128"/>	
		</div>
		<div class="row">
			<x:inputL name="attendanceCount" required="true" label="出勤天数" mask="nn"  width="220" maxLength="22"/>	
		</div>
		<div class="row">		
			<x:inputL name="overtimeLimit" required="false" label="加班上限" mask="nn"  width="220" maxLength="22"/>	
		</div>	
	</div>
</form>
