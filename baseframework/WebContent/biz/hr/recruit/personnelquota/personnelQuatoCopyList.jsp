<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime" />
<script src='<c:url value="/biz/hr/recruit/personnelquota/personnelQuatoCopyList.js"/>' type="text/javascript"></script>

</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
					<x:title title="备份人员快报查询" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">

							<x:inputL name="year" required="false" label="年"   mask="nnnn"/>
							<x:inputL name="month" required="false" label="月" mask="nnnn"/>
							
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
				</div>
			</div>
</body>
</html>
