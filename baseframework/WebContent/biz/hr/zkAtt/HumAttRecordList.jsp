<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox" />
<script src='<c:url value="/lib/jquery/jquery.comboDialog.js"/>' type="text/javascript"></script>
<script src='<c:url value="/biz/hr/zkAtt/HumAttRecordList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<x:title title="搜索" hideTable="queryDiv" />
			<x:hidden name="otherOrgId" id="mainOtherOrgId" />
			<form method="post" action="" id="queryMainForm">
				<div class="ui-form" id="queryDiv" style="width: 900px;">
					<x:inputL name="datebegin" required="true" label="开始时间" wrapper="date" />
					<x:inputL name="dateend" required="true" label="结束时间" wrapper="date" />
					<div class="clear"></div>
					<x:inputL name="empName" required="false" label="人员名称" maxLength="32" />
					<x:hidden name="macSn" id="mainMacSn" />
					<x:inputL name="macName" required="false" label="考勤机" maxLength="32" wrapper="select" 
						dataOptions="type:'zk',name:'chooseWebMachines',callBackControls:{macSn:'#mainMacSn',macName:'#macName'}"
					/>
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
