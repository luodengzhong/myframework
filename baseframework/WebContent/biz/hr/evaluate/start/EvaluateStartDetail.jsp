<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
 <x:base include="dialog,grid,dateTime,tree,combox,attachment"/>
 <script src='<c:url value="/system/opm/js/OpmUtil.js"/>' type="text/javascript"></script>
 <script src='<c:url value="/lib/jquery/jquery.commonTree.js"/>' type="text/javascript"></script>
 <script src='<c:url value="/biz/hr/evaluate/start/EvaluateStartDetail.js"/>'   type="text/javascript"></script>
 </head>
<body>
	<div class="mainPanel">
		<div class="subject">发起母子公司双向评价</div>
		<div class="bill_info">
			<span style="float: left; margin-left: 10px;"> 
				单据号码：<strong><c:out value="${billCode}" /></strong> &nbsp;&nbsp;
				制单日期：<strong><x:format name="fillinDate" type="date"/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				发起人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
			</span>
		</div>
		<div id="inputFormDiv">
			<form method="post" action="" id="submitForm">
				<table class='tableInput' style="width: 99%;" id="mainTableInput">
					<x:layout />
					<tr>
						<x:hidden name="evaluateStartId" />
						<x:hidden name="organId" />
						<x:hidden name="deptId" />
						<x:hidden name="positionId" />
						<x:hidden name="personMemberId" />
						<x:hidden name="fullId" />
						<x:hidden name="organName" />
						<x:hidden name="fillinDate" type="date" />
						<x:hidden name="billCode" />
						<x:hidden name="status" />
						<x:hidden name="deptName" />
						<x:hidden name="positionName" />
						<x:hidden name="personMemberName" />
						<x:inputTD name="subject" required="true" label="标题"	colspan="5" maxlength="100"/>
					</tr>
					<tr>
						<x:textareaTD name="remark" required="false" label="备注"	colspan="5" maxlength="200" rows="3"/>
					</tr>
				</table>
			</form>
		</div>
		<x:title title="人员信息" name="group"/>
		<div id="personChooseDiv">
			<table style="width:100%;">
				<tr>
					<td style="width:250px;">
						<div style="height:485px;width:250px;overflow:auto;border:1px solid #d0d0d0;  ">
							<ul id="maintree"></ul>
						</div>
					</td>
					<td style="width:80%;">
						<form method="post" action="" id="queryPersonForm">
						<div class="ui-form" id="queryPersonDiv" style="width: 1000px;">
							<x:inputL name="personQueryName" required="false" label="姓名" maxLength="64"  labelWidth="40" width="120"/>
							<x:selectL name="personQuerystatus" label="状态" list="evaluateTaskStatusList" labelWidth="40" width="120"/>
							<x:selectL name="orgStatus" label="人员状态" list="#{'1':'在职','0':'离职'}" labelWidth="60" width="100"/>
							<dl>
								<dd style="width:100px;"><x:checkbox name="isNotEvaluate" label="未评价人员" /></dd>
								<dt style="width:190px">
									<x:button value="查 询" onclick="queryPerson(this.form)" />&nbsp;&nbsp;
									<x:button value="重 置" onclick="reQueryPerson(this.form)" />&nbsp;&nbsp;
								</dt>
							</dl>
						</div>
						</form>
						<div id="personChooseGrid" style="margin-left:2px;margin-right: 2px;"></div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
	
	
