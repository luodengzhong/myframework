<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,grid,dateTime,combox,tree,attachment" />
<script src='<c:url value="/biz/demo/BillSpecialHandling.js"/>' type="text/javascript"></script>
</head>
<body>
	<div class="ui-form" style="width: 99%;">
		<x:title name="group" title="出差单处理"/>
		<x:inputL name="businessTripCode" required="false" label="单据编号" readonly="false" />
		<x:button value="导入ERP" onclick="businessTripCode()"/>
		<x:checkbox name="isAborted" label="是否作废单据" value="1"/>
		<x:button value="删除ERP数据" onclick="saveAbortedBusinessTrip()"/>
		<div class="clear"></div>
		<x:title name="group" title="薪酬变动单直接生效"/>
		<x:inputL name="payChangeCode" required="false" label="单据编号" readonly="false" />
		<x:checkbox name="isUpdateArchives" label="是否更新人事档案" value="1"/>
		<x:checkbox name="isDeleteTask" label="是否删除流程任务" value="1"/>
		<x:button value="执行" onclick="payChangeCode()"/>
		<div class="clear"></div>
		<x:title name="group" title="制度奖罚直接生效"/>
		<x:inputL name="rewardPunishCode" required="false" label="单据编号" readonly="false" />
		<x:button value="执行" onclick="rewardPunishCode()"/>
		<div class="clear"></div>
		<x:title name="group" title="审批通过后未及时修改档案及架构的异动批量调整单"/>
		<x:inputL name="structureAdjustmentCode" required="false" label="单据编号" readonly="false" />
		<x:button value="执行" onclick="structureAdjustmentCode()"/>
		<div class="clear"></div>
		<x:title name="group" title="删除考勤设备上人员"/>
		<x:inputL name="mainEmpNo" required="false" label="考勤卡号" readonly="false" />
		<x:button value="执行" onclick="deleteUserASAllMsn()"/>
		<div class="clear"></div>
	</div>	
</body>
</html>
