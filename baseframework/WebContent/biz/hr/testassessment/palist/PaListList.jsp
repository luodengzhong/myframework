
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="dialog,grid,dateTime,combox"/>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
	  		<x:title title="测评名单表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="paListId"/>
					
		<x:inputL name="scorePersonId" required="false" label="评分人id" maxLength="65"/>					
		<x:inputL name="scorePersonName" required="false" label="评分人" maxLength="32"/>					
		<x:inputL name="scorePersonLevel" required="false" label="评分人级别" maxLength="8"/>					
		<x:inputL name="proportion" required="false" label="所占权重" maxLength="22"/>					
		<x:inputL name="status" required="false" label="" maxLength="1"/>					
		<x:inputL name="totalEva" required="false" label="" maxLength="256"/>					
		<x:inputL name="evaDate" required="false" label="" maxLength="7"/>					
		<x:inputL name="personMemberId" required="false" label="人员ID" maxLength="22"/>					
		<x:inputL name="personMemberName" required="false" label="人员名称" maxLength="32"/>					
		<x:inputL name="billCode" required="false" label="单据号码" maxLength="32"/>					
		<x:inputL name="deptId" required="false" label="部门ID" maxLength="32"/>					
		<x:inputL name="organName" required="false" label="机构名称" maxLength="32"/>					
		<x:inputL name="fullId" required="false" label="full_id" maxLength="1024"/>					
		<x:inputL name="fillinDate" required="false" label="填表日期" maxLength="7"/>					
		<x:inputL name="organId" required="false" label="机构ID" maxLength="32"/>					
		<x:inputL name="positionId" required="false" label="岗位ID" maxLength="32"/>					
		<x:inputL name="positionName" required="false" label="岗位名称" maxLength="32"/>					
		<x:inputL name="deptName" required="false" label="部门名称" maxLength="32"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"  style="margin: 2px;"></div>
		</div> 
	</div>
  </body>
</html>
