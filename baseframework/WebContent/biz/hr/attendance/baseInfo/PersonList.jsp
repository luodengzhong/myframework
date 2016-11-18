
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
	  		<x:title title="考勤人员信息" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="attPersonId"/>
					
		<x:inputL name="orgId" required="false" label="机构ID" maxLength="32"/>					
		<x:inputL name="fullId" required="false" label="ID全路径" maxLength="1024"/>					
		<x:inputL name="orgName" required="false" label="机构名称" maxLength="64"/>					
		<x:inputL name="deptId" required="false" label="部门ID" maxLength="32"/>					
		<x:inputL name="deptName" required="false" label="部门名称" maxLength="64"/>					
		<x:inputL name="positionId" required="false" label="岗位ID" maxLength="32"/>					
		<x:inputL name="positionName" required="false" label="岗位名称" maxLength="64"/>					
		<x:inputL name="personMemberId" required="false" label="人员ID" maxLength="65"/>					
		<x:inputL name="personMemberName" required="false" label="人员名称" maxLength="64"/>					
		<x:inputL name="joinCompanyDate" required="false" label="入职日期" maxLength="7"/>					
		<x:inputL name="leaveCompanyDate" required="false" label="离职日期" maxLength="7"/>					
		<x:inputL name="isAtt" required="false" label="是否考勤统计" maxLength="22"/>					
		<x:inputL name="status" required="false" label="状态" maxLength="22"/>					
		<x:inputL name="version" required="false" label="版本号" maxLength="22"/>
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
