<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<table class='tableInput' style="width: 99%;">
		<x:layout proportion="90px,200px,90px,160px"/>
		<tr>
		<x:hidden name="jobPosId"/>
		<x:hidden name="organId"/>
		<x:hidden name="isOuterOrgPos"/>
		<x:inputTD name="organName" required="true" label="招聘单位" wrapper="select"  />	
		<x:hidden name="deptId"/>
			<x:inputTD name="deptName" required="true" label="招聘部门" wrapper="select"  />	
			</tr>
			<tr>
			<x:hidden name="recPosId"/>
			<x:inputTD name="name" required="true" label="招聘岗位" wrapper="select"  />	
			<x:inputTD name="recNumber" required="true" label="招聘人数"  mask="nnn" />	
			</tr>
		<tr>	
		<x:radioTD name="isHeadhunter" required="false" label="猎头是否可见"  dictionary="yesorno"/>		
		<x:radioTD name="isInterRecommend" required="false" label="是否内推" dictionary="yesorno" />	
		</tr>
		<tr>	
		<x:radioTD name="isSocialRecruit" required="false" label="是否官网招聘" dictionary="yesorno"  />	
		<x:radioTD name="isSchoolrecruit" required="false" label="是否校园招聘" dictionary="yesorno"  />	
		
		</tr>
		<tr>	
		<x:textareaTD name="desption" required="false" label="说明"  rows="3"  colspan="3" />
		</tr>
</table>
</form>
