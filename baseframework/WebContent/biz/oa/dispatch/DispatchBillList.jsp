<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,tree,layout,grid,dateTime,combox" />
<script src='<c:url value="/biz/oa/dispatch/DispatchBillList.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<div id="layout">
				<div position="left" title="文件编号类别" id="mainmenu">
					<div style="overflow-x: hidden; overflow-y: auto; width: 100%;" id="divTreeArea">
						<ul id="maintree"></ul>
					</div>
				</div>
				<div position="center" title="文件列表">
					<x:title title="搜索" hideTable="queryDiv" />
					<x:hidden name="dispatchKindId" />
					<form method="post" action="" id="queryMainForm">
						<div class="ui-form" id="queryDiv" style="width: 900px;">
							<x:inputL name="dispatchNo" required="false" label="文号"  labelWidth="60" width="120" />
							<x:inputL name="title" required="false" label="标题" labelWidth="60" width="120" />
							<x:selectL name="status" required="false" label="状态" labelWidth="40" width="100" list="statusDataList" />
							<div class="clear"></div>
							<x:inputL name="orgName" required="false" label="取号组织" labelWidth="60" width="120" />
							<dl><dt style="width:190px">(单位、部门、岗位、姓名)</dt></dl>
							<dl>
								<dt style="width: 40px;">序号:</dt>
								<dd style="width: 60px;">
									<x:select name="sequenceSymbol" list="#{'gt':'大于','eq':'等于','lt':'小于'}" />
								</dd>
								<dd style="width: 60px;">
									<x:input name="sequence" required="false" mask="nnnn" />
								</dd>
							</dl>
							<div class="clear"></div>
							<x:inputL name="beginDate" required="false" label="日期起" wrapper="date" labelWidth="60" width="120" />
							<x:inputL name="endDate" required="false" label="日期止" wrapper="date" labelWidth="60" width="120" />
							<dl>
								<x:button value="查 询" onclick="query(this.form)" />
								&nbsp;&nbsp;
								<x:button value="重 置" onclick="resetForm(this.form)" />
								&nbsp;&nbsp;
							</dl>
						</div>
					</form>
					<div class="blank_div"></div>
					<div id="maingrid" style="margin: 2px"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
