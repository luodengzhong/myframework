<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.extendedField.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>'
	type="text/javascript"></script>
<script src='<c:url value="/biz/oa/task/AdjustSelectTasks.js"/>'
	type="text/javascript"></script>

</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<%-- <div position="left" title="计划所属对象">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;"
						id="divTreeArea">
						<x:title id="myOrgtitle" title="管理计划" name="group"
							hideTable="#myOrgSearch" />
						<div
							style="width: 97%; margin-left: 3px; background-color: #fafafa;"
							id="myOrgSearch">
							<div style="overflow-x: hidden; overflow-y: auto;"
								id="divTreeArea">
								<ul id="orgTree">
								</ul>
							</div>
						</div>
						<x:title id="myProtitle" title="项目计划" name="group"
							hideTable="#myProSearch" />
						<div
							style="width: 97%; margin-left: 3px; background-color: #fafafa;"
							id="myProSearch">
							<div style="overflow-x: hidden; overflow-y: auto;"
								id="divProTreeArea">
								<ul id="proTree">
								</ul>
							</div>
						</div>
					</div>
				</div> --%>

				<div position="center" style="border: 0px;">

					<form method="post" action="" id="queryMainForm">
					<x:hidden name="owningObjectId" />
					<x:hidden name="managerType"/>
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="taskName" label="计划名称" maxLength="64" />
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="relationTaskGrid"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
