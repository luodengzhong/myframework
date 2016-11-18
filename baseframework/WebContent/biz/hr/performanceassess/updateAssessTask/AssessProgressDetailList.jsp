
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
	  		<x:title title="经办人发送更新绩效考核表任务明细" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="progressDetailId"/>
					
		<x:inputL name="progressId" required="false" label="" maxLength="22"/>					
		<x:inputL name="assessPersonId" required="false" label="" maxLength="32"/>					
		<x:inputL name="assessPersonName" required="false" label="" maxLength="32"/>					
		<x:inputL name="auditId" required="false" label="" maxLength="22"/>					
		<x:inputL name="formId" required="false" label="" maxLength="22"/>					
		<x:inputL name="updateDate" required="false" label="" maxLength="7"/>					
		<x:inputL name="resultId" required="false" label="" maxLength="22"/>					
		<x:inputL name="performanceGroupDetailId" required="false" label="" maxLength="22"/>
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
