<#if parameters.title??>
<div id='${parameters.id?default("navTitle")?html}' class="navTitle"><#rt/>
<#if parameters.hideTable??||parameters.hideIndex??>
<a href='javascript:void(0);' hidefocus class='togglebtn' hideTable='${parameters.hideTable?default("")?html}' hideIndex='${parameters.hideIndex?default("")?html}'  title='show or hide'></a><#rt/>
</#if>
<span class='${parameters.name?default("search")?html}'>&nbsp;</span>&nbsp;<span class="titleSpan">${parameters.title?default("")?html}</span><#rt/>
</div><#rt/>
<#if parameters.needLine?default(true)>
<div class="navline"></div><#rt/>
</#if>
</#if>