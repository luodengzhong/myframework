<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<x:layout />
		<tr>
			<x:hidden name="id" id="detailId"/>
			<x:inputTD name="macSn" required="true" label="设备序列号" maxLength="32" colspan="3"/>
			<x:inputTD name="newTime" required="false" label="最新联机时间" maxLength="7" mask="dateTime" disabled="true"/>
		</tr>
		<tr>
			<x:inputTD name="macName" required="true" label="设备名称" maxLength="64" colspan="2"/>
			<x:inputTD name="macAddress" required="false" label="所在地" maxLength="128" colspan="2"/>
		</tr>
		<tr>
			<x:hidden name="folderKindId" id="detailFolderKindId"/>
			<x:inputTD name="folderKindName" id="detailFolderKindName" required="true" label="考勤分组" maxLength="64" readonly="true"/>
			<td><input type='button' value='选择分组' class='buttonGray' onClick='machineChooseGroup()'/></td>
			<td colspan="3" style="color:gray;">考勤机分组,用于快速同步相同分组的设备数据</td>
		</tr>
		<tr>
			<x:inputTD name="transTimes" required="true" label="上传指定时刻" maxLength="64" />
			<td colspan="4" style="color:gray;">考勤机从某个时刻起开始检查并向服务器传送新数据. hh:mm (时:分)格式, 多个时间之间用分号(;)分开</td>
		</tr>
		<tr>
			<x:inputTD name="transInterval" required="true" label="传送间隔时间" maxLength="4" />
			<td colspan="4" style="color:gray;">设定设备每间隔多少分钟就检查并向服务器传送新数据（分钟）</td>
		</tr>
		<tr>
			<x:selectTD name="realTime" required="false" label="实时传送" dictionary="yesorno" value="0" emptyOption="false"/>
			<td colspan="4" style="color:gray;">实时传送新记录。为'是'表示有新数据就传送到服务器，为'否'表示按照上传指定时刻和传送间隔时间上传</td>
		</tr>
		<tr>
			<x:inputTD name="delay" required="true" label="联接间隔" maxLength="4" />
			<td colspan="4" style="color:gray;">为正常联网时联接服务器的间隔时间（秒）</td>
		</tr>
		<tr>
			<x:inputTD name="errorDelay" required="true" label="重联间隔" maxLength="4" />
			<td colspan="4" style="color:gray;">为联网失败后重新联接服务器的间隔时间（秒）</td>
		</tr>
		<tr>
			<x:inputTD name="macStyle" required="false" label="机器型号" maxLength="64" disabled="true"/>
			<x:inputTD name="orgName" required="false" label="管理部门名称" maxLength="64" disabled="true"/>
			<x:inputTD name="managerName" required="false" label="管理人"  wrapper="select" id="detailManagerName"/>
			<x:hidden name="managerId" id="detailManagerId"/>
		</tr>
		<tr>	
			<x:inputTD name="userCount" required="false" label="员工数" maxLength="22" disabled="true"/>
			<x:inputTD name="tmpCount" required="false" label="指纹记录数" maxLength="22" disabled="true"/>
			<x:inputTD name="attCount" required="false" label="考勤记录数" maxLength="22" disabled="true"/>
		</tr>
		<tr>
			<x:inputTD name="remark" required="false" label="备注" maxLength="200" colspan="5"/>
		</tr>
	</table>
</form>
