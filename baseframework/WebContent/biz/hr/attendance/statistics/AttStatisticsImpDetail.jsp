<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width:810px;">
		<x:layout />
		<tr>
			<x:hidden name="statisticsImpId" />
			<x:hidden name="organId" id="detailOrganId"/>
			<x:hidden name="organName" id="detailOrganName"/>
			<x:hidden name="archiviesId" id="detailArchiviesId"/>
			<x:inputTD name="staffName" required="true" label="员工姓名" maxLength="64" wrapper="select" id="detailStaffName"/>
			<x:hidden name="periodId" id="detailPeriodId"/>
			<td class="title">业务期间：</td>
			<td><x:input name="yearDetail" required="true" width="60"/></td>
			<td colspan="2"><x:input label="业务期间" name="periodName" required="true" wrapper="select"/></td>
		</tr>
		<tr>
			<x:inputTD name="withoutCard" required="false" label="未打卡次数" maxLength="22" mask="nn"/>
			<x:inputTD name="exceptionNumber" required="false" label="异常次数" maxLength="22" mask="nn.n"/>
			<x:inputTD name="sickLeave" required="false" label="病假天数" maxLength="22" mask="nn.nn"/>
		</tr>
		<tr>
			<x:inputTD name="personalAffair" required="false" label="事假天数" maxLength="22" mask="nn.n"/>
			<x:inputTD name="maternityLeave" required="false" label="产假天数" maxLength="22" mask="nn.n"/>
			<x:inputTD name="marriageLeave" required="false" label="婚假天数" maxLength="22" mask="nn.n"/>
		</tr>
		<tr>
			<x:inputTD name="funeralLeave" required="false" label="丧假天数" maxLength="22" mask="nn.n"/>
			<x:inputTD name="annualLeave" required="false" label="年假天数" maxLength="22" mask="nn.n"/>
			<x:inputTD name="examination" required="false" label="考试假天数" maxLength="22" mask="nn.n"/>
		</tr>
		<tr>
			<x:inputTD name="accompanyMaternityLeave" required="false" label="陪产假天数" maxLength="22" mask="nn.n"/>
			<!--<x:inputTD name="commonOvertime" required="false" label="一般加班天数" maxLength="22" mask="nn"/>-->
			<x:inputTD name="weekendOvertime" required="false" label="周末加班天数" maxLength="22" mask="nn.n"/>
			<x:inputTD name="holidayOvertime" required="false" label="节假日加班天数" maxLength="22" mask="nn.n"/>
		</tr>
		<tr>
			<x:inputTD name="industrialInjury" required="false" label="工伤假天数" maxLength="22" mask="nn.n"/>
			<x:inputTD name="driverNight" required="false" label="驾驶员晚上" maxLength="22" mask="nn"/>
			<x:inputTD name="driverNightBus" required="false" label="驾驶员夜班车" maxLength="22" mask="nn"/>
		</tr>
		<tr>
			<x:inputTD name="late15" required="false" label="迟到次数(15分钟内)" maxLength="22" mask="nn"/>
			<x:inputTD name="late1630" required="false" label="迟到次数(16-30分钟)" maxLength="22" mask="nn"/>
			<x:inputTD name="late3160" required="false" label="迟到次数(31-60分钟)" maxLength="22" mask="nn"/>
			
		</tr>
		<tr>
			<x:inputTD name="late61" required="false" label="迟到次数(60分钟以上)" maxLength="22" mask="nn"/>
			<x:inputTD name="leaveEarly15" required="false" label="早退次数(15分钟内)" maxLength="22" mask="nn"/>
			<x:inputTD name="leaveEarly1630" required="false" label="早退次数(16-30分钟)" maxLength="22" mask="nn"/>
		</tr>
		<tr>
			<x:inputTD name="leaveEarly3160" required="false" label="早退次数(31-60分钟)" maxLength="22" mask="nn"/>
			<x:inputTD name="leaveEarly61" required="false" label="早退次数(60分钟以上)" maxLength="22" mask="nn"/>
			<td class='title' colspan="2">&nbsp;</td>
		</tr>
	</table>
</form>
