<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
     	<x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
     	<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
        <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
  	  	<script src='<c:url value="/biz/hr/performanceInterview/PerformanceInterviewInfo.js"/>'   type="text/javascript"></script>
  </head>

  <body>
  	<div class="ui-form" style="width: 99%;">
  			<div class="subject">绩效面谈整改审批表</div>
	  	<form method="post" action="" id="submitForm">
			<table class='tableInput' style="width: 99%;"  id='queryTable' id="table_03">
			<x:layout proportion="12%,21%,12%,21%,10%" />
			        <x:hidden name="auditId" />
			        <x:hidden name="organId" />
			        <x:hidden name="deptId" />
			        <x:hidden name="positionId" />
			        <x:hidden name="personMemberId" />
			        <x:hidden name="fullId" />
			        <x:hidden name="taskId" />
			        <x:hidden name="archivesId" />
			        <x:hidden name="orgnizationId" />
			        <x:hidden name="centerId" />
			        <x:hidden name="departmentId" />
			        <x:hidden name="posId" />
			        <x:hidden name="status"  value="0"/>
			        <x:hidden name="rectificationPlan"  value="0"/>
			        <x:hidden name="interviewerId" />

		<tr>
		     <x:inputTD name="organName" required="false" label="单位名称"  disabled="true"  />					
		     <x:inputTD name="fillinDate" required="false" label="填表日期" wrapper="date" disabled="true"/>					
		     <x:inputTD name="billCode" required="false" label="单据号码" disabled="true"/>		
		</tr>
		<tr>			
		      <x:inputTD name="deptName" required="false" label="部门名称" disabled="true"/>					
		      <x:inputTD name="positionName" required="false" label="岗位名称" disabled="true"/>					
		      <x:inputTD name="personMemberName" required="false" label="制表人" disabled="true"/>	
		</tr>
		</table>
		<x:title name="group" title="被面谈人基本信息" hideTable="#table_01" />
		<table  class='tableInput' style="width: 99%;"  id="table_01">
		<x:layout proportion="12%,21%,12%,21%,10%" />
		<tr>
		      <x:inputTD name="staffName" required="true" label="员工" readonly="true"  />
		      <x:selectTD name="rank" dictionary="performanceLevel"  required="true" label="排名等级" readonly="true"/>
		      <x:selectTD name="sex" required="false" dictionary="sex" label="性别" readonly="true" />
		     
		</tr>
		<tr>
		      <x:inputTD name="year" required="true" label="考核年"   mask="nnnn" disabled="true"/>
	          <x:selectTD list="period" name="periodCode"   required="true" label="考核周期" emptyOption="false"  />		   
			<x:inputTD name="periodIndex" required="true" label="考核时间" />
		     
		</tr>
		<tr>
              <x:selectTD name="education" required="false" dictionary="education" label="学历" readonly="true"/>		
			  <x:inputTD name="orgnizationName" required="false" label="单位" readonly="true"/>
		      <x:inputTD name="centerName" required="false" label="中心"  readonly="true"/>
		      
		</tr>
		<tr>
		      <x:inputTD name="posName" required="false" label="岗位" readonly="true"/>
		      <x:selectTD name="posLevel" dictionary="posLevel"  required="false" label="行政级别" readonly="true"/>	
		      <x:inputTD name="employedDate" required="false" label="入职日期" wrapper="date" readonly="true"/>
		</tr>
		</table>
	
		<x:title name="group" title="面谈记录" hideTable="#table_03"/>
		<table  class='tableInput' style="width: 99%;"  id="table_03">
		<x:layout proportion="86px,160px,100px,160px,87px,160px" />
		<tr>
		<td colspan="6" style="color:red;font-size:14px">
		备注： 1、若您本人与员工面谈沟通，请在沟通后填写沟通人、面谈时间和面谈地点，并提交；<br>
         &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;  2、若您安排其他人员与员工沟通，可选择指定沟通人，并提交。
		</td>
		</tr>
		<tr  >
		      <x:inputTD name="interviewerName" required="true" label="沟通人" wrapper="select"/>	
		      <x:inputTD name="interviewTime" required="false" label="沟通时间"  wrapper="date"/>	
		      <x:inputTD name="interviewLocation" required="false" label="沟通地点"  />			
		</tr>
		</table>
	
		</div>
			</form>
		</div>
	
  </body>
	
	
