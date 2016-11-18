<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<x:hidden name="projectId" />
	<x:hidden name="parentId" />
	<x:hidden name="status" value="0" />
	<x:hidden name="isStage" value="0" />
	<x:hidden name="logicAreaId" id="logicAreaId" />
	<x:hidden name="orgId" id="orgId" />
	<x:hidden name="fullId" id="fullId" />
	<x:hidden name="fullName" id="fullName" />
	<x:hidden name="managerId" id="managerId" />
	<table class='tableInput'>
		<x:layout proportion="90px,160px,90px,160px,90px,160px" />
		<tr>
			<x:inputTD name="name" required="true" label="项目名称" maxLength="100" />
			<x:inputTD name="code" required="true" label="项目编码" maxLength="100" />
			<x:inputTD name="logicAreaName" id="logicAreaName" required="true"
				label="所属区域" readonly="false" wrapper="select" />
		</tr>
		<tr>
			<x:inputTD name="orgName" required="true" label="所属组织机构"
				maxLength="32" wrapper="select" />
			<x:inputTD name="virtualProjectId" required="false" label="虚拟项目"
				maxLength="22" wrapper="select" />
			<x:inputTD name="managerName" required="false" label="项目负责人"
				maxLength="32" wrapper="select" />
		</tr>
		<tr>
			<x:inputTD name="plotSchemeNo" required="false" label="策划方案编号"
				maxLength="100" disabled="true" />
			<x:inputTD name="planSchemeNo" required="false" label="规划方案编号"
				maxLength="100" disabled="true" />
			<x:inputTD name="projectPhase" required="false" label="项目阶段"
				maxLength="64" wrapper="select" disabled="true" />
		</tr>
		<tr>
			<x:inputTD name="phaseStatus" required="false" label="项目阶段状态"
				maxLength="64" wrapper="select" disabled="true" />
			<x:inputTD name="constructionLicenses" required="false"
				label="施工许可证编号" maxLength="100" />
			<x:inputTD name="constructionLicensesDate" required="false"
				label="施工许可证发放时间" maxLength="22" wrapper="date" />
		</tr>
		<tr>
			<x:inputTD name="area" required="false" label="总面积(㎡)" maxLength="22"
				mask="nnnnnnnnnnnn.nnn" />
			<x:inputTD name="construncArea" required="false" label="建筑面积(㎡)"
				maxLength="22" mask="nnnnnnnnnnnn.nnn" />
			<x:inputTD name="overConstruncArea" required="false"
				label="地上建筑面积(㎡)" maxLength="22" mask="nnnnnnnnnnnn.nnn" />
		</tr>
		<tr>
			<x:inputTD name="underConstruncArea" required="false"
				label="地下建筑面积(㎡)" maxLength="22" mask="nnnnnnnnnnnn.nnn" />
			<x:inputTD name="volumeRate" required="false" label="容积率(%)"
				maxLength="22" mask="nnnnnnnnnnnn.nnn" />
			<x:inputTD name="businessMaxScale" required="false" label="最大商业占比(%)"
				maxLength="22" mask="nnnnnnnnnnnn.nnn" />
		</tr>
		<tr>
			<x:inputTD name="estimateCost" required="false" label="预估成本(万元)"
				maxLength="22" mask="money" />
			<x:inputTD name="actualCost" required="false" label="实际成本(万元)"
				maxLength="22" mask="money" />
			<x:selectTD name="lateStatus" required="false" label="是否尾盘"
				maxLength="22" dictionary="yesorno" value="0" />
		</tr>
		<tr>
			<x:inputTD name="lateDate" required="false" label="转为尾盘时间"
				maxLength="32" wrapper="date" />
			<x:inputTD name="linkPhone" required="false" label="联系电话"
				maxLength="11" />
			<td class="title"></td>
			<td class="edit"></td>
		</tr>
		<tr>
			<x:inputTD name="address" required="false" label="项目地址"
				maxLength="1024" colspan="5" />
		</tr>
		<tr>
			<x:textareaTD name="remark" required="false" label="项目描述"
				maxLength="2048" colspan="5" cols="60" rows="5" />
		</tr>
	</table>
</form>
