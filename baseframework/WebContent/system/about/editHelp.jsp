<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,grid,dialog,tree,combox" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/about/editHelp.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="帮助分类" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="详细信息">
					<form method="post" action="" id="submitForm">
						<table class='tableInput' style="width: 99%; margin: 2px;">
							<x:layout />
							<tr>
								<x:hidden name="helpId" />
								<x:hidden name="parentId" />
								<x:inputTD name="helpName" required="true" label="名称" maxLength="128" />
								<x:inputTD name="helpCode" required="true" label="编码" maxLength="16" />
								<x:inputTD name="sequence" required="true" label="序号" maxLength="6" spinner="true" mask="nnn" />
							</tr>
							<tr>
								<x:inputTD name="helpTitle" required="false" label="标题" maxLength="100" colspan="5" />
							</tr>
							<tr>
								<x:inputTD name="filePath" required="false" label="文件路径" maxLength="64" colspan="3" />
								<x:radioTD list="#{'1':'启用','-1':'停用'}" name="status" label="状态" value="1"/>
							</tr>
							<tr>
								<x:textareaTD rows="5" name="helpKeyword" required="false" label="关键字" maxLength="200" colspan="5" />
							</tr>
						</table>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px;"></div>
					<div style="text-align:right;">
						<x:button value="新增同级" onclick="add(0)" />
						&nbsp;&nbsp;
						<x:button value="新增子级" onclick="add(1)" />
						&nbsp;&nbsp;
						<x:button value="删 除" onclick="deleteHelp()" />
						&nbsp;&nbsp;
						<x:button value="保 存" onclick="saveHelp()" />
						&nbsp;&nbsp;
						<x:button value="关 闭" onclick="closeWindow()" />
						&nbsp;&nbsp;
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
