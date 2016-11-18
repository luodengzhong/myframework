<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox,tree"/>
  	 <script src='<c:url value="/biz/hr/recruit/interview/InterviewApplyDetail.js"/>' type="text/javascript"></script>  
  	  <script src='<c:url value="/biz/hr/recruit/interview/QueryOrganComm.js"/>' type="text/javascript"></script>  
  	  <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	  <script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
  </head>
  <body>
  <div class="ui-form" style="width: 99%;">
		<div class="subject">修改面试测评</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
	<x:layout proportion="70px,120px,70px,120px,70px,220px"/>
		<x:hidden name="writeId"/>
		<x:hidden name="interviewApplyId"/>
		<x:hidden name="flag"/>
		<x:hidden  name="queryFlag"/>
		<x:select name="interviewType" id="interviewType" cssStyle="display:none;" emptyOption="false"/>
	   <tr>			
		<x:inputTD name="staffName" required="false" label="应聘者" disabled="true"/>
		<x:hidden name="applyPosId"/>
		<x:inputTD name="applyPosName" required="false" label="应聘职位" disabled="true"/>	
		<x:inputTD name="expecteSalary" required="false" label="希望待遇(万)" disabled="true"/>
		</tr>	
		<tr>					
		<x:hidden name="employCompanyId"/>
		<x:inputTD name="employCompany" required="false" label="拟定单位"   wrapper="select"/>	
		<x:hidden name="employCenterId"/>				
		<x:inputTD name="employCenter" required="false" label="拟定中心" maxLength="32"  wrapper="select"/>	
		<x:hidden name="employDeptId"/>				
		<x:inputTD name="employDept" required="false" label="拟定部门" maxLength="32"  wrapper="select"/>	
		</tr> 
	</table>
	<div class="clean"></div>
	<div id="detailMaingrid"></div>
    </form>
	</div>
  </body>
</html>