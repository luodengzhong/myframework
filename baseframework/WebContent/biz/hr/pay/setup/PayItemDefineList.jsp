<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/biz/hr/pay/setup/PayItemDefine.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="工资栏目定义" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="name" required="false" label="字段编码" maxLength="32" />
					<x:inputL name="display" required="false" label="显示名称" maxLength="128" />
					<x:inputL name="operationCode" required="false" label="业务编码"
						maxLength="32" />
					<x:inputL name="visible" required="false" label="是否显示" maxLength="1" id="mainVisible"/>
					<x:selectL name="payItemKind" required="false" label="栏目分类" id="mainPayItemKind"/>
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />
						&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />
						&nbsp;&nbsp;
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
