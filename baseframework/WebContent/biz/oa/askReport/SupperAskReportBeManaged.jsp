<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
  <head>
  	<x:base include="layout,dialog,grid,dateTime,combox"/>
  	<script src='<c:url value="/biz/oa/askReport/SupperAskReportBeManaged.js"/>' type="text/javascript"></script>
  </head>
  <body>
  	<div class="mainPanel">
	  	<div id="mainWrapperDiv">
			<form method="post" action="" id="queryMainForm">
			<div class="ui-form" id="queryDiv" style="width:900px;">
				<x:selectL name="personId"  list="beManaged" label="管理人员" required="true" emptyOption="false" labelWidth="70"/>
				<x:inputL name="subject" required="false" label="标题" maxLength="32" labelWidth="40" />
				<x:inputL name="applicantPersonMemberName" required="false" label="上报人" maxLength="32" labelWidth="50" width="100"/>
				<dl>
					<x:button value="查 询" onclick="query(this.form)"/>&nbsp;&nbsp;
					<x:button value="重 置" onclick="resetForm(this.form)"/>&nbsp;&nbsp;
				</dl>
			</div>
			</form>
			<div id="layoutGrid" style="margin: 2px; margin-right: 3px;">
				<div position="left" title="请示报告列表">
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
				<div position="center" title="当面汇报列表">
					<div id="lineUpGrid" style="margin: 2px;"></div>
				</div>
			</div>
		</div> 
	</div>
  </body>
</html>
