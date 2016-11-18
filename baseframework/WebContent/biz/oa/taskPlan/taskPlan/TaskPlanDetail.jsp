<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">		
		<x:hidden name="id"/>
		<x:hidden name="selfDeptId"/>
		<x:hidden name="dealPersonId"/>
		<x:hidden name="dealPersonFullId"/>		
		<x:hidden name="workContactId"/>
		<x:hidden name="workContactDetailId"/>		
		<x:hidden name="errorinfo"/>	
		<tr>
			<x:textareaTD name="title" required="false" label="任务内容" disabled="true" rows="3" colspan="3" />
		</tr>	
	     <tr>			
			<x:selectTD name="taskKindId" required="false" label="任务类别" maxLength="128"  list="taskKindList" 	 wrapper="select"/>
			<x:selectTD name="status" required="false" label="审核状态" disabled="true" maxLength="10" list="billStatusMap" />
		</tr>					
	    <tr>
			<x:inputTD name="selfDeptName" required="true" label="责任部门" maxLength="64" wrapper="tree" />
			<x:inputTD name="dealPersonName" required="true" label="责任人" maxLength="128"  wrapper="select"/>
		</tr>	
	</table>
</form>
