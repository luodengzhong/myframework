<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
 	<script src='<c:url value="/biz/hr/entry/changeteacher/ChangeTeacherApplyBill.js"/>' type="text/javascript"></script>
  	
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
  			<div class="subject">更换督导师申请</div>
    <form method="post" action="" id="submitForm">
	  <table class='tableInput' style="width: 99%;">
				<x:layout proportion="73px,160px,120px,140px,120px,140px" />
	     <tr>
		
		<x:hidden name="changeTeacherId"/>
			<x:hidden name="organId"/>
		<x:hidden name="deptId"/>
		<x:hidden name="positionId"/>
		<x:hidden name="personMemberId"/>
		<x:hidden name="fullId"/>
		<x:hidden name="personId"/>
		
			<tr>
		<x:inputTD name="organName" required="false" label="单位名称"  disabled="true"  />					
		<x:inputTD name="fillinDate" required="false" label="填表日期" disabled="true" wrapper="date"/>					
		<x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>		
		</tr>
		<tr>			
		<x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>					
		<x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		<x:inputTD name="personMemberName" required="false" label="申请人" disabled="true"/>	
		</tr>
	    			
	    
	    <tr>
	    <x:hidden name="oldTeacherId"/>
	    <x:hidden name="oldTeacherDptId"/>
	    <x:hidden name="oldTeacherPosId"/>
	    <x:inputTD name="oldTeacher" required="false" label="原督导师" 
	       readonly="true"/>		
	    		<x:inputTD name="oldTeacherDptNam" required="false" label="原督导师所在部门" maxLength="32" readonly="true"/>		
	    		<x:inputTD name="oldTeacherPosName" required="false" label="原督导师所在岗位" maxLength="32" readonly="true"/>	
	    </tr>
	     <tr>
	     <x:hidden name="newTeacherId"/>
	    <x:hidden name="newTeacherDptId"/>
	    <x:hidden name="newTeacherPosId"/>
	    		<x:inputTD name="newTeacher" required="true" label="新督导师"   wrapper="select"  />		
	    		<x:inputTD name="newTeacherDptName" required="false" label="新督导师所在部门" maxLength="32"/>		
	    	    <x:inputTD name="newTeacherPosName" required="false" label="新督导师所在岗位" maxLength="32"/>		
	    
	    </tr>
	     <tr>	
		<x:textareaTD name="reason" required="true" label="更换原因" rows="3" colspan="5" maxLength="256"/>		

	     </tr>
	</table>
	
</form>
</div>
  </body>
</html>