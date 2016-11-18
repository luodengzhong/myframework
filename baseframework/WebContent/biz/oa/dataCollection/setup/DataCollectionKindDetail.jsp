<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<form method="post" action="" id="submitForm">
	<table class='tableInput' style="width: 99%;">
		<COLGROUP><COL width='18%'/><COL width='32%'/><COL width='18%'/><COL width='32%'/></COLGROUP>
	     <tr>
			<x:hidden name="dataCollectionKindId" id="detailDataCollectionKindId"/>
			<x:inputTD name="name" required="true" label="名称" maxLength="64"/>		
			<x:inputTD name="code" required="true" label="编码" maxLength="32"/>
		</tr>
		<tr>		
			<x:textareaTD name="description" required="false" label="描述" maxLength="512" colspan="3" rows="3"/>
	     </tr>
	</table>
</form>
<div class="blank_div"></div>
<div id="detailGroupgrid"></div>