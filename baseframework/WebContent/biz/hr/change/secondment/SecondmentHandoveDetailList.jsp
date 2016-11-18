
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
	  		<x:title title="员工辞职工作交接清单明细" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="detailId"/>
					
		<x:inputL name="archivesId" required="false" label="员工ID" maxLength="22"/>					
		<x:inputL name="staffName" required="false" label="员工姓名" maxLength="64"/>					
		<x:inputL name="workContent" required="false" label="工作内容" maxLength="100"/>					
		<x:inputL name="finishDate" required="false" label="完成时间" maxLength="7"/>					
		<x:inputL name="finishStatus" required="false" label="完成状况" maxLength="100"/>					
		<x:inputL name="finishProgress" required="false" label="完成进度" maxLength="100"/>					
		<x:inputL name="qualityRequirement" required="false" label="质量要求" maxLength="100"/>					
		<x:inputL name="auditId" required="false" label="员工离职工作交接主表ID" maxLength="32"/>
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
