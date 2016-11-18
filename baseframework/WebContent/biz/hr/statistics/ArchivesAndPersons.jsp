<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="dialog,layout,grid,tree,combox,date" />
<script src='<c:url value="/biz/hr/statistics/ArchivesAndPersons.js"/>'	type="text/javascript"></script>
</head>
<body>
	<div class="mainPanel">
		<div id="mainWrapperDiv">
			<table style="width: 99%;table-layout:fixed;">
				<x:layout proportion="49%,2%,49%" />
				<tr>
					<td>
						<div class='ui-form'>
							<x:inputL name="staffName" label="条件" />
							<dl>
								<x:button value="查 询" onclick="queryArchives()" />
							</dl>
						</div>
						<div class="blank_div"></div>
						<div id="archivesGrid" style="margin: 2px;"></div>
					</td>
					<td>&nbsp;</td>
					<td>
						<div class='ui-form'>
							<x:inputL name="personName" label="条件" />
							<dl>
								<x:button value="查 询" onclick="queryPerson()" />
							</dl>
						</div>
						<div class="blank_div"></div>
						<div id="personsGrid" style="margin: 2px;"></div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>
