
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<div class="ui-form" style="width:610px;">
		
		<x:hidden name="meetingRoomId"/>
		<x:hidden name="ownerId"/>
		<div class="row">
			<x:inputL name="code" required="true" label="编码" maxLength="32"/>		
			<x:inputL name="name" required="true" label="名称" maxLength="64"/>
		</div>
		<div class="row">		
			<x:inputL name="place" required="true" label="地点" maxLength="64"/>		
			<x:inputL name="galleryful" required="true" label="容纳人数" maxLength="22" mask="nnn"/>
		</div>
		<div class="row">		
			<x:selectL name="supportVideo" required="true" label="是否支持视频" dictionary="yesorno"/>
			<x:selectL name="status" required="true" label="是否启用" dictionary="yesorno"/>
		</div>	
		<div class="row">
			<x:inputL name="ownerName" required="true" label="所属机构" wrapper="select"/>
			<x:selectL name="isSpecial" required="true" label="是否专用" dictionary="yesorno"/>
		</div>
		<div class="row">
			<x:inputL name="macSn" required="false" label="考勤机编码" maxLength="32"/>		
			<x:inputL name="sequence" required="true" label="序列号" mask="nnn"/>	
		</div>
		<div class="row">	
			<x:textareaL name="description" required="false" rows="3" label="备注" maxLength="128" width="485" labelWidth="60"/>			
		</div>
	</div>
</form>
