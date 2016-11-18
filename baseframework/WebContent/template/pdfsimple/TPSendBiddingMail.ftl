<stationery>
	<div>
		<div>&nbsp;</div>
		<p>
			“${supplierName}”您好：<br/>
			该邮件为我司为您发出的“${planName}”在线投标邮件！<br/>
			相关投标资料在附件中，请及时回标！<br/>
			<br/>
		</p>
		<p>
			您只需点击下面的链接即可在线回标，开标之后该链接将自动失效。如需再次回标，我司将再次为您发送此临时回标地址：<br/>
			<a href="${biddingURL}" target="_blank">${biddingURL}</a><br/>
			(如果上面不是链接形式，请将该地址手工粘贴到浏览器地址栏再访问)<br/>
			谢谢合作！<br/>
		</p>
		<div style="FONT-FAMILY: Verdana; COLOR: #c0c0c0; FONT-SIZE: 10pt">&nbsp;</div>
	</div>
</stationery>

<div id="_divBigFile">
	<#if biddingFileList?? && biddingFileList?size gt 0>
	<div
		style="PADDING-BOTTOM: 4px; MARGIN-TOP: 10px; PADDING-LEFT: 4px; PADDING-RIGHT: 4px; FONT-FAMILY: verdana, Arial, Helvetica, sans-serif; MARGIN-BOTTOM: 15px; BACKGROUND: #dee8f2; CLEAR: both; PADDING-TOP: 4px"
		id="divNeteaseBigAttach">
		<div
			style="PADDING-BOTTOM: 8px; LINE-HEIGHT: 16px; PADDING-LEFT: 8px; PADDING-RIGHT: 8px; FONT-SIZE: 14px; PADDING-TOP: 4px">
			<b>从蓝光${sendFrom}邮箱发来的超大附件</b>
		</div>
		
		<div
			style="PADDING-BOTTOM: 4px; PADDING-LEFT: 4px; PADDING-RIGHT: 4px; BACKGROUND: #fff; PADDING-TOP: 4px">
			<#list biddingFileList as biddingFile>
				<div
					style="PADDING-BOTTOM: 6px; PADDING-LEFT: 4px; PADDING-RIGHT: 4px; HEIGHT: 36px; CLEAR: both; PADDING-TOP: 6px">
					<div style="WIDTH: 36px; FLOAT: left">
						<a
							href="${biddingFile.filePath}"><img
							border="0" src="${imgHttpUrl}/themes/default/images/32X32/icon_logo.png" width="32" height="32"/></a>
					</div>
					<div>
						<div
							style="PADDING-BOTTOM: 0px; LINE-HEIGHT: 14px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; FONT-SIZE: 12px; PADDING-TOP: 0px">
							<a style="COLOR: #000; TEXT-DECORATION: none"
								href="${biddingFile.filePath}"
								target="_blank" expiretime="1451101384423" filesize="5901772"
								filename="${biddingFile.fileName}" fileid="1142783787"
								download="${biddingFile.filePath}">${biddingFile.fileName}</a>
							<#--
							<span style="COLOR: #bbb"> (5.6 MB, 2015-12-26 11:43 到期)</span>
							-->
						</div>
						<div
							style="PADDING-BOTTOM: 4px; LINE-HEIGHT: 14px; PADDING-LEFT: 0px; PADDING-RIGHT: 0px; FONT-SIZE: 12px; PADDING-TOP: 4px">
							<a
								href="${biddingFile.filePath}">下载</a>
						</div>
					</div>
				</div>
			</#list>
		</div>
	</div>
	</#if>
</div>

<stationery>
	<div>
		<p>
			此致<br/>
			四川蓝光和骏实业有限公司<br/>
			招标采购中心<br/>
			http://www.brc.com.cn/
		</p>
	</div>
	<div style="FONT-FAMILY: Verdana; COLOR: #c0c0c0; FONT-SIZE: 10pt">&nbsp;</div>
</stationery> 