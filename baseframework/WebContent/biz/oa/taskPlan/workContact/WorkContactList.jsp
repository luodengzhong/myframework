
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>

<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/workContact/WorkContact.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
    <script src='<c:url value="/biz/oa/taskPlan/taskPlan/TaskPlanCreate.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
		<x:hidden name="selfDeptId"/>
	  	<div id="mainWrapperDiv">
	  		<x:title title="工作联系单表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="workContactId"/>
		<x:hidden name="deptId"/>
							
		<x:inputL name="deptName" required="false" label="发起部门名称" maxLength="64"  wrapper="tree"/>	
		<x:inputL name="personName" required="false" label="发起人名称" maxLength="64"/>			
		<x:inputL name="funTypeName" required="false" label="职能类别" maxLength="64"  wrapper="select"/>		
		<x:selectL name="expectLoad" required="false" label="预估工作量" maxLength="10"  list="infoDemandWorkList"/>				
		<x:inputL name="lastDealDate" required="false" label="最后处理时间" maxLength="7"   wrapper="dateTime" />
		<x:inputL name="organName" required="false" label="公司名称" maxLength="64"/>					
		<x:inputL name="billCode" required="false" label="单据号码" maxLength="32"/>	
		<x:inputL name="fillinDate" required="false" label="填表日期" maxLength="7"  wrapper="dateTime" />			
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/><element>
							&nbsp;&nbsp;
</element>
						<x:button value="重 置" onclick="resetForm(this.form)"/><element>
							&nbsp;&nbsp;
</element></dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div> 
	</div>
  </body>
</html>
