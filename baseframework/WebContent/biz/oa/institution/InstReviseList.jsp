<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
<x:base include="grid,dateTime,attachment" />
<script src='<c:url value="/biz/oa/institution/InstReviseList.js"/>' type="text/javascript"></script>
</head>
<body style="overflow-x:hidden">
			<x:hidden name="institutionProcessId"/>
			<x:fileList bizCode="OAInstReviseBody" bizId="institutionProcessId" id="instReviseBody" isClass="true" />
			<div id="editDetail"></div>
			<div class="blank_div" style="height: 31px"></div>
			<table id='reviseInstitutionList' style="overflow-x:hidden;width: 99%;">
				<c:forEach items="${requestScope.institutionReviseList}" var="institutionRevise">
					<tr>
						<td>
							<table class='tableInput'>
								<tr>
									<td class="title" width="60" style="height:25px;">修订制度：</td>
									<td width="120" style="white-space: nowrap;overflow:hidden;word-break:break-all;" title="${institutionRevise.name}">${institutionRevise.name}</td>
									<td class="title" width="60" style="height:25px;">制度版本：</td>
									<td style="white-space: nowrap;overflow:hidden;word-break:break-all;" width="120" style="height:20px;">${institutionRevise.institutionVersion}</td>
									<td rowspan="3" class="title" width="14">附件列表</td>
									<td rowspan="3" width="360">
										<div style="width:360px;height:75px;overflow-y: auto">
										<c:forEach items="${institutionRevise.attachmentList}" var="attachmentItem">
											<div class="list_view">
												<a href="#" onClick="openAttachment('${attachmentItem.id}')" class="GridStyle">
													<span class="fileKind ${attachmentItem.fileKind}">&nbsp;</span>&nbsp;
													${attachmentItem.fileName}
												</a>
											</div>
										</c:forEach>
										</div>
									</td>
								</tr>
								<tr>
									<td class="title" style="height:25px;">制度路径：</td>
									<td class="edit"style="height:25px;white-space: nowrap;overflow:hidden;word-break:break-all;" colspan="3" title="${institutionRevise.fullName}">${institutionRevise.fullName}</td>
								</tr>
								<tr>
									<td class="title" style="height:25px;">生效日期：</td>
									<td class="edit" style="text-align: center;height:20px;">${institutionRevise.effdate}</td>
									<td class="title" style="height:25px;">修订状态：</td>
									<td class="edit"  style="text-align: center;">${institutionRevise.rstatus}</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td style="height:5px;"></td>
					</tr>
				</c:forEach>
			</table>
</body>
</html>