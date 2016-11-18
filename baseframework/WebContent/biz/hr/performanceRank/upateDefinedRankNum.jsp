<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
<div class="ui-form" style="width:400px;">
	  <table class='tableInput' id='queryTable'>
		<x:layout proportion="80px,100px,80px,100px" />
		
		<x:hidden name="performanceRankGroupId"/>
		 <tr>
			             <x:inputTD name="levelA"  required="true" label="等级A人数" mask="nn"/>
			            <x:inputTD name="levelB"  required="true" label="等级B人数" mask="nn"/>
	     </tr>
	     <tr>
			              <x:inputTD name="levelC"  required="true" label="等级C人数" mask="nn"/>
			            <x:inputTD name="levelD" required="true" label="等级D人数" mask="nn"/>	
			            </tr>
			            <tr>
			              <x:inputTD name="levelE" required="true" label="等级E人数" mask="nn"/>	
			            <x:inputTD name="levelF" required="true" label="等级F人数" mask="nn"/>	
			            
		            </tr>
		
	</table>
	</div>
</form>