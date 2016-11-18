<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,grid,dialog,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/exam/setup/ExaminationTypeTrees.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="题目类型" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="详细信息">
					<div id="examinationTypeToolBar" style="margin:2px "></div>
					<form method="post" action="" id="submitForm">
						<table class='tableInput' style="width:99.5%; margin: 2px;">
							<x:layout />
							<tr>
								<x:hidden name="examQuestionTypeId" />
								<x:hidden name="parentId" />
								<x:hidden name="typeFullId" />
								<x:inputTD name="code" required="true" label="编码" maxLength="30" />
								<x:inputTD name="name" required="true" label="名称" maxLength="12" />
								<x:inputTD name="sequence" required="true" label="序号" maxLength="6" spinner="true" mask="nnn" />
							</tr>
							<tr>
								<x:inputTD name="statusTextView" required="false" readonly="true" label="状态" cssClass="textReadonly" />
								<x:inputTD name="description" required="false" label="描述" maxLength="100" colspan="3" />
							</tr>
						</table>
					</form>
					<div class="blank_div"></div>
					<div id="permissionGrid" style="margin:2px "></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
