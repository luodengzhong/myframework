
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<html>
  <head>

<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/workContact/WorkContactDeta.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/taskPlan/TaskPlanCreate.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
<form method="post" action="" id="submitForm">
		<x:hidden name="workContactId" />
		<x:hidden name="organId"/>	
		<x:hidden name="deptId"/>	
		<x:hidden name="personId"/>			
		<x:hidden name="funTypeId"/>		
		<x:hidden name="positionId"/> 
		<x:hidden name="selfDeptId"/>
		<x:hidden name="taskId"/>
		
			<div style="margin: 0 auto;">
				<div class="subject">工 作 联 系 单</div>
			</div>
	<table class='tableInput' style="width: 99%;">
					<x:layout proportion="12%,24%,14%,24%" />
					<tr>
						<x:inputTD name="title" required="false" label="标题"
							width="744" colspan="3" maxLength="1000" >
						</x:inputTD>
					</tr>
					<tr>
						<x:inputTD name="organName" disabled="true" required="false"
							label="公司名称" maxLength="64" />
						<x:inputTD name="billCode" disabled="true" required="false"
							label="单据号码" maxLength="32" />
					</tr>
					<tr>
						<x:inputTD name="fillinDate" disabled="true" required="false"
							label="填表日期" maxLength="7" wrapper="dateTime" />
						<x:inputTD name="deptName" disabled="true" required="false"
							label="发起部门名称" maxLength="64" />
					</tr>
					<tr>
						<x:inputTD name="personName" disabled="true" required="false"
							label="发起人名称" maxLength="65" /> 
						<x:inputTD name="funTypeName" required="false" label="职能类别"
							maxLength="64" wrapper="select"/>
					</tr>
					<tr>
						<x:selectTD name="expectLoad" required="false" label="预估工作量"
						 list="infoDemandWorkList"/>
						<x:inputTD name="expectDate" required="false" label="预期完成时间"
							maxLength="7" wrapper="dateTime" />		
						
					</tr>
					<tr>				
						<x:selectTD name="status" required="false" label="审核状态" disabled="true" 
							maxLength="10"  list="billStatusMap"  />
						<x:inputTD name="lastDealDate" required="false" label="最后处理时间"
							maxLength="7" wrapper="dateTime" />		
					</tr>
					<tr>				
						<x:textareaTD name="remark" required="false" label="备注信息"
							rows="3" colspan="3">
						</x:textareaTD>
					</tr>				
					
				</table>				
			<div id="workContactDetailList"></div>
			<div class="blank_div"></div>
			<div id="extendedFieldDiv"></div>
			<div class="blank_div"></div>
			<x:fileList bizCode="workContact" bizId="workContactId" id="workContactIdAttachment" />
			<div class="blank_div"></div>
</form>

	</div>
  </body>
</html>
