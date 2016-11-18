<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="/WEB-INF/taglib.tld" prefix="x"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<x:hidden name="infoPromulgateId"  id="previewInfoPromulgateId"/>
<div id="previewMainDiv">
	<div id="previewTitleDiv">
		<div class="navTitle">
			<a href='javascript:void(0);'  hidefocus class='togglebtn'  id="navTitleLink" title='show or hide' onClick="toggleSubject()"></a>
			<span class="emailOpen" id="navTitleIcon" onClick="toggleSubject()" style="cursor:pointer;">&nbsp;</span>&nbsp;
			
			<span class="titleSpan" style="font-size: 16px;" onClick="toggleSubject()">
				[<c:out value="${ownOrganName}" />]<c:out value="${dispatchNo}" /><c:out value="${subject}" />
			</span>
		</div>
		<div class="navline"></div>
		<div id="toggleTitleDiv">
			<div class="bill_info" style="height: 25px;line-height: 25px;margin: 0;">
				<span style="float: left; margin-left: 10px;color: #333333;"> 
					创建人&nbsp;:&nbsp;<c:out value="${organName}" />.<c:out value="${deptName}" />.<c:out value="${personMemberName}" />
				</span> 
				<span style="float: left; margin-left: 10px;color: #333333;">
					发布时间&nbsp;:&nbsp;<fmt:formatDate value="${finishTime}"  type="both" pattern="yyyy-MM-dd HH:mm"/>
				</span>
				<c:if test="${requestScope.fileTextBody==true&&requestScope.isPicture==false&&requestScope.isBodyDown==1}">
				<div class="ui-panelBar" style="width:85px;float: right;">
					<ul>
						<li title="下载正文"><a href="javascript:AttachmentUtil.downFileByAttachmentId('${attachmentId}');" class="aLink down"><span>下载正文</span></a></li>
					</ul>
				</div>
			</c:if>
			</div>
			<c:if test="${isHideReceiver!=1}">
			<div style="text-align: left; padding-left: 10px; color: #333333;">
				接收人范围&nbsp;:&nbsp;<c:out value="${receiverName}" />
			</div>
			</c:if>
			<div id="showInfoAttachment" style="display: none;">
				<x:fileList bizCode="infoPromulgate" bizId="infoPromulgateId" id="previewInfoAttachment" readOnly="true" isWrap="false" />
				<div class="clear"></div>
			</div>
			
			<div class="navline"></div>
		</div>
	</div>
	<c:choose>
		<c:when test="${null!=requestScope.businessViewUrl&&requestScope.businessViewUrl!=''}">
		<div id="iFrameBusinessDiv">
			<input type="hidden" name="businessViewUrl" value=<c:url value="${businessViewUrl}"/> id="iFrameBusinessURL"/>
		</div>
		</c:when>
		<c:when test="${requestScope.fileTextBody==true&&requestScope.isPicture==true}">
		<img src='<c:url value="/attachmentAction!downFile.ajax?id=${attachmentId}"/>'  border=0  id="showTextBodyPicture"/>
		</c:when>
		<c:when test="${requestScope.fileTextBody==true&&requestScope.isPicture==false}">
		<div id="iFrameBusinessDiv">
			<x:hidden name="converUrl"  id="iFrameBusinessURL"/>
		</div>
		</c:when>
		<c:otherwise>
		<div style="padding: 5px;" class="clearStyle"><c:out value="${infoContent}" escapeXml="false" /></div>
		</c:otherwise>
	</c:choose>
</div>