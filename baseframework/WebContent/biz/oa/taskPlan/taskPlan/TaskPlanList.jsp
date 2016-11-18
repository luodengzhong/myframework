
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/oa/info/InfoManagerUtil.js"/>'	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquert.htmlEditor.js"/>'	type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/taskPlan/TaskPlan.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/taskPlan/TaskPlanCreate.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="任务计划表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="id"/>
					
		<x:inputL name="workContactId" required="true" label="联系单ID" maxLength="32"/>					
		<x:inputL name="detailId" required="false" label="联系事项ID" maxLength="32"/>	
		<x:inputL name="title" required="false" label="标题" maxLength="128"/>						
		<x:inputL name="dealPersonId" required="false" label="当前处理人ID" maxLength="65"/>					
		<x:inputL name="dealPersonName" required="false" label="当前处理人名称" maxLength="128"/>					
		<x:inputL name="workStatue" required="false" label="任务状态" maxLength="10"/>					
		<x:inputL name="createDate" required="false" label="创建时间" maxLength="7"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
	</div>
  </body>
</html>
