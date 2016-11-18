<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="/WEB-INF/JSTLFunction.tld" prefix="f"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout />
		<tr>
			<x:hidden name="calendarId" id="detailCalendarId" />
			<x:inputTD name="calendarCode" required="true" label="日历编码" maxLength="8" />
			<x:inputTD name="calendarName" required="true" label="日历名称" maxLength="12" />
			<x:radioTD name="isBaseCalendar" required="false" dictionary="yesorno" label="默认日历" maxLength="1" value="0"/>
		</tr>
	</table>
</form>
<div id='calendarTabDiv' style="margin-left: 0px; margin-right: 0px; width: 99%;">
	<div class="ui-tab-links">
		<ul style="left: 10px">
			<li>例外日期</li>
			<li>工作周</li>
		</ul>
	</div>
	<div class="ui-tab-content">
		<div class="layout" style="height: 250px;">
			<div id="planCalendarExceptionsGrid"></div>
		</div>
		<div class="layout" id="planCalendarWeekDays" style="height: 250px;">
			<table class='tableInput'>
				<x:layout proportion="50px,90px,300px" />
				<thead>
					<tr class="table_grid_head_tr">
						<th>工作日</th>
						<th>星期</th>
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tbody>
				<c:forEach items="${planCalendarWeekDays}" var="item">
					<tr style="height:26px;">
						<td style="text-align:center;">
						   <input type="checkbox" value="${item.dayType}" <c:if test="${item.dayWorking==1}">checked</c:if>/>
						</td>
						<td>
							${f:getWeekDay(item.dayType)}
						</td>
						<td>&nbsp;</td>
					</tr>
				</c:forEach>
				</tbody>
			</table>
		</div>
	</div>
</div>
