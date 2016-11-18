
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>

<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/workContact/WorkContactDetail.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/taskPlan/TaskPlanCreate.js"/>' type="text/javascript"></script>  
    
  </head>
  <body>
  	<div class="mainPanel">
		<x:hidden name="selfDeptId"/>
	  	<div id="mainWrapperDiv">
	  		<x:title title="联系事项表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="workContactDetailId"/>	
		<x:hidden name="deptId"/>
		<x:hidden name="selfPersonId"/>
									
		<x:inputL name="workContactId" required="false" label="联系单号" maxLength="256"/>			
		<x:inputL name="deptName" required="false" label="联系部门名称" maxLength="64"   wrapper="tree"/>							
		<x:inputL name="funTypeName" required="false" label="职能类别" maxLength="64" wrapper="select"/>			
		<x:inputL name="description" required="false" label="联系事项描述" maxLength="256"/>				
		<x:selectL name="expectLoad" required="false" label="预估工作量" maxLength="10"  list="infoDemandWorkList"/>				
		<x:inputL name="createDate" required="false" label="填表日期" maxLength="7"  wrapper="dateTime" />									
		<x:inputL name="expectDate" required="false" label="预期完成时间" maxLength="7"  wrapper="dateTime" />								
		<x:selectL name="urgentDegree" required="false" label="优先级" maxLength="22"  list="infoDemandUrgentList"/>		
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
