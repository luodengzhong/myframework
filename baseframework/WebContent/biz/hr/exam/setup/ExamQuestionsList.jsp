<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="layout,grid,dialog,tree,combox,attachment" /> 
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.formButton.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/exam/setup/ExamQuestionsList.js"/>' type="text/javascript"></script>
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
				<div position="center" title="题目信息">
					<x:title title="搜索" hideTable="queryDiv" />
					<x:hidden name="examQuestionTypeId"/>
					<form method="post" action="" >
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="itemName" required="false" label="题目名称" maxLength="32"  labelWidth="80" width="120"/>
							<x:selectL name="itemType" required="false" label="题目类型" maxLength="8" list="questionKinds" labelWidth="80" width="100"/>
							<dl>
								<dd style="width:90px"><x:checkbox name="showChildren" label="显示下级"/></dd>
								<dt style="width:190px">
									<x:button value="查 询" onclick="query(this.form)" />&nbsp;&nbsp;
									<x:button value="重 置" onclick="resetForm(this.form)" />&nbsp;&nbsp;
								</dt>
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="mainGrid" style="margin:2px "></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
