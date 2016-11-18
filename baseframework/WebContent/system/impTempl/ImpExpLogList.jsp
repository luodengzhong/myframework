<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.toolBar.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/impTempl/ImpExpLog.js"/>' type="text/javascript"></script>
<c:if test="${requestScope.templId > 0}">
<script src='<c:url value="/system/impTempl/js/${requestScope.templetCode}.js"/>' type="text/javascript" id="impOperationJSFile"></script>
</c:if>
</head>
<body>
	<div id="topToolbar" style="margin:2px;"></div>
	<div class="mainPanel">
		<form method="post" action="" id="queryMainForm">
				<x:hidden name="templId"/>
				<x:hidden name="templCode"/>
				<c:choose>
					<c:when test="${requestScope.templId > 0}">
						<div class="subject" id="templetNameSubject"><c:out value="${requestScope.templetName}"/></div>							
					</c:when>
					<c:otherwise>
					<div class="ui-form" id="queryTable" style="width: 900px;">
						<x:inputL name="templetName" required="true" label="模板名称" width="300" labelWidth="70"/>
						<dl>
							<x:button value="选择模板" id="chooseImptemplet" />&nbsp;&nbsp;
						</dl>		
					</div>						
					</c:otherwise>
				</c:choose>
		</form>
		<div class="blank_div"></div>
		<div id="maingrid"></div>
	</div>
	<div id='impResultTab' style="margin:5px;">
		<div class="ui-tab-links">
			<h2>导入明细列表</h2>
			<ul>
				<li id="imp_success_title">导入成功</li>
				<li id="imp_error_title">导入失败</li>
			</ul>
		</div>
		<div class="ui-tab-content" style="padding:2px;padding-right:0;">
			<div class="layout" id="imp_success_content" style="height:412px;position:relative;">
				<div id='imp_success_tmp_div'>
					<div id="imp_success_grid"></div>
				</div>
			</div>
			<div class="layout" id="imp_error_content" style="height:412px;position:relative;">
				<div id='imp_error_tmp_div'>
					<div id="imp_error_grid"></div>
				</div>
			</div>
		</div>
	</div>
	<iframe name="imp_main_iframe" style="display: none;" id='imp_main_iframe_id'></iframe>
</body>
</html>
