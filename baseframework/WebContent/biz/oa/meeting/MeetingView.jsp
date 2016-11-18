<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
	<table class="tableInput" id="mainInfo" style="width: 99%">
		<x:layout proportion="15%,35%,15%,35%"/>
	  <tr>
	    <x:inputTD name="subject" colspan="3" readonly="true" labelWidth="80" label="会议主题"/>
	  </tr>
	  <tr>
	    <x:inputTD name="meetingKindName" readonly="true" labelWidth="80" label="类型"/>
	    <x:inputTD name="managerName" readonly="true" labelWidth="80" label="主持人"/>
	  </tr>
	  <tr>
	   	<x:inputTD name="meetingTime" colspan="3" readonly="true" labelWidth="80" label="时间"/>
	  </tr>
	  <tr>
	  	<x:textareaTD name="meetingPlace" colspan="3" readonly="true" rows="3" labelWidth="80" label="会议室"/>
	  </tr>
	  <tr>
	  	<x:selectTD name="signIn" readonly="true" label="是否签到" dictionary="yesorno"/>
	  	<x:selectTD name="signOut" readonly="true" label="是否签退" dictionary="yesorno"/>			
	  </tr>
	  <tr>
	 	<x:inputTD name="dutyName" readonly="true" labelWidth="80" label="召集人"/>
	    <x:inputTD name="recorderName" readonly="true" labelWidth="80" label="记录人"/>
	  </tr>
	  <tr>
	    <x:textareaTD name="meetingParticipate" rows="3" colspan="3" readonly="true" labelWidth="80" label="参会人员"/>
	  </tr>
	  <tr>
	    <x:textareaTD name="meetingAttendance" rows="3" colspan="3" readonly="true"  labelWidth="80" label="列席人员"/>
	  </tr>
	  <tr>
	  	 <x:textareaTD name="description" colspan="3" readonly="true" rows="3" labelWidth="80" label="会议说明"/>
	  </tr>
	</table>