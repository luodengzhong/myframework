
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
	  		<x:title title="考核人表" hideTable="queryDiv"/>
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
					
		<x:hidden name="scorePersonDetailId"/>
					
		<x:inputL name="formId" required="false" label="考核表id" maxLength="22"/>					
		<x:inputL name="scorePersonId" required="false" label="评分人id" maxLength="65"/>					
		<x:inputL name="scorePersonName" required="false" label="评分人" maxLength="32"/>					
		<x:inputL name="scorePersonLevel" required="false" label="评分人级别" maxLength="8"/>					
		<x:inputL name="proportion" required="false" label="所占权重" maxLength="22"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
					</dl>
			</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid" style="margin: 2px;"></div>
		</div> 
	</div>
  </body>
</html>
