<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,tree,combox,attachment" />
<script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
<script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/setup/DetailUtil.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/pay/performance/PayPerformanceDetail.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div class="subject"><c:out value="${orgUnitName}"/><c:out value="${year}"/>年<c:out value="${periodCodeName}"/>考核绩效奖金表</div>
			<div class="bill_info">
				<span style="float:left;">
					单据号码：<strong><c:out value="${billCode}"/></strong>
					&nbsp;&nbsp;
					制表日期：<strong><x:format name="fillinDate" type="date"/></strong>
				</span>
				<span style="float:right;">
					制表人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
				</span>
			</div>
			<x:hidden name="performanceMainId"/>
			<x:hidden name="year"/>
			<x:hidden name="periodId"/>
			<x:title title="搜索" hideTable="queryDiv" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="archivesName" required="false" label="姓名" maxLength="32"  labelWidth="60" width="100"/>
					<x:selectL name="performanceLevel" id="mainPerformanceLevel" label="排名" dictionary="performanceLevel"  labelWidth="60"  width="60"/>
					<x:selectL name="yesorno" label="薪酬变动"  labelWidth="60"  width="60"/>
					<%-- <x:selectL name="wageKind" label="工资类别"  labelWidth="60"  width="120"/> --%>
					<x:selectL list="wageKindList" id="wageKind" name="wageKind" label="工资类别" labelWidth="60"  width="120" />
					<dl>
						<x:button value="查 询" onclick="query(this.form)" />&nbsp;&nbsp;
						<x:button value="重 置" onclick="resetForm(this.form)" />
					</dl>
				</div>
			</form>
			<div class="blank_div"></div>
			<div id="maingrid"></div>
		</div>
	</div>
</body>
</html>
