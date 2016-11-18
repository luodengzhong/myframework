<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
 	<form method="post" action="" id="submitForm" style="width: 99%;">
			<table class='tableInput' id='queryTable'>
				<x:layout proportion="90px,160px,90px,160px,90px,160px" />
		<x:hidden name="visitMemberId"/>			
		<x:hidden name="visitId"/>
		<x:hidden name="archivesId"/>
		
		<tr>
		<x:inputTD name="name" required="false" label="被访人姓名" maxLength="32"  wrapper="select" 
		dataOptions="type:'hr',name:'personArchiveSelect',
		callBackControls:{archivesId:'#archivesId',staffName:'#name',dptName:'#dept',posName:'#pos',employedDate:'#employDate'}"  />		
		<x:inputTD name="dept" required="false" label="被访人所在部门" readonly="true"/>		
		<x:inputTD name="pos" required="false" label="被访人岗位" readonly="true"/>		
		</tr>
		<tr>
		<x:inputTD name="employDate" required="false" label="被访人入司时间" wrapper="date" readonly="true"/>		
		<x:inputTD name="visitTime" required="false" label="家访时间" wrapper="date"/>
		<x:selectTD name="houseProperty" required="false" label="居住房屋性质" maxLength="22" dictionary="residenceKind" />	
		</tr>
		<tr>
				<x:inputTD name="visitAddress" required="false" label="被访人地址"  colspan="5" maxLength="64"/>	
		</tr>
		<tr>
			
		<x:inputTD name="visitRecord" required="false" label="家访记录" colspan="5" maxLength="128"/>		
		</tr>
	
  </table>
			<div class="blank_div"></div>
<%--   			    <x:fileList bizCode="familyVisit" bizId="visitId" id="familyVistFileList"/>
 --%>  
     <div id="marginDetailId"></div>
</form>
