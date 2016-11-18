<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<div class="bill_info">
	<span style="padding-left: 10px"> 
		取号人：<strong><c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${positionName}" />.<c:out value="${personMemberName}" /></strong>
	</span>
	<x:hidden name="bizId"  id="detailBizId"/>
	<x:hidden name="bizUrl" id="detailBizUrl" />
	<x:hidden name="status" id="detailStatus" />
</div>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout proportion="14%,36%,14%,36%"/>
		<tr>
			<x:hidden name="dispatchBillRelevanceId" />
			<x:hidden name="organId" />
			<x:hidden name="deptId" />
			<x:hidden name="positionId" />
			<x:hidden name="personMemberId" />
			<x:hidden name="fullId" />
			<x:hidden name="organName" />
			<x:hidden name="deptName" />
			<x:hidden name="positionName" />
			<x:hidden name="personMemberName" />
			<x:inputTD name="title" required="true" label="文件标题" maxLength="128"  colspan="3" id="detailTitle"/>
		</tr>
		<tr style="display:none;" id="showDispatchNoTr">
			<x:inputTD name="dispatchNo"  label="文号" maxLength="64" />
			<x:inputTD name="sequence"  label="序号" maxLength="22" />
		</tr>
		<tr>
			<x:inputTD name="createDate" required="true" label="取号时间"  wrapper="date"/>
			<x:inputTD name="year" disabled="true" label="年号" />
		</tr>
		<tr>
			<x:selectTD name="status" disabled="true" label="状态" maxLength="1"  list="statusDataList"/>
			<x:inputTD name="depositary" required="true" label="文件存放处" maxLength="40" />
		</tr>
		<tr>
			<x:inputTD name="remark" required="false" label="备注" maxLength="256"  colspan="5"/>
		</tr>
	</table>
	<c:if test="${requestScope.dispatchBillRelevanceId==null}">
	<div style="color:red;min-height:22px;text-align:right;padding-right: 20px">保存数据后自动获取文件编号！</div>
	</c:if>
</form>
