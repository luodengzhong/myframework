<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.contextmenu.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/zkAtt/WebMachinesList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="组织机构" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="考勤设备">
					<x:hidden name="organId" id="mainOrganId" />
					<x:hidden name="organName" id="mainOrganName" />
					<x:hidden name="fullId" id="mainFullId" />
					<x:title title="搜索" hideTable="queryDiv" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="macSn" label="设备序列号" maxLength="64" />
							<x:inputL name="macStyle" label="设备型号" maxLength="32" />
							<x:inputL name="macName" label="设备名称" maxLength="32" />
							<x:inputL name="macAddress" label="所在地" maxLength="32" />
							<x:hidden name="folderKindId"/>
							<x:inputL name="folderKindName" label="考勤分组" maxLength="64" readonly="true" cssClass="text textSearch"/>
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
		</div>
	</div>
</body>
</html>
