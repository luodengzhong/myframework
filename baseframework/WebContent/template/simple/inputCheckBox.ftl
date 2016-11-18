<input type="checkbox" name="${parameters.name?html}"<#rt/>
 value="${parameters.value?default("1")?html}"<#rt/><#rt/>
<#if parameters.checked?? && parameters.checked><#rt/>
 checked="checked"<#rt/>
</#if><#rt/>
<#if parameters.disabled?default(false)><#rt/>
 disabled="disabled"<#rt/>
</#if><#rt/>
<#if parameters.readonly?default(false)><#rt/>
 readonly="readonly"<#rt/>
</#if><#rt/>
<#if parameters.tabindex??><#rt/>
 tabindex="${parameters.tabindex?html}"<#rt/>
</#if><#rt/>
<#if parameters.id??><#rt/>
 id="${parameters.id?html}"<#rt/>
<#else><#rt/>
 id="${parameters.name?html}${parameters.value?default("1")?html}"<#rt/>
</#if><#rt/>
<#include "/${parameters.templateDir}/simple/css.ftl" />
<#if parameters.label??><#rt/>
 title="${parameters.label?html}"<#rt/>
</#if><#rt/>
<#include "/${parameters.templateDir}/simple/scripting-events.ftl" />
<#include "/${parameters.templateDir}/simple/common-attributes.ftl" />
<#include "/${parameters.templateDir}/simple/dynamic-attributes.ftl" />
/>
<#if parameters.get("label")??><#rt/>
<label<#rt/>
<#if parameters.id??><#rt/>
 for="${parameters.id?html}">
<#else><#rt/>
 for="${parameters.name?html}${parameters.value?default("1")?html}">
</#if><#rt/>
&nbsp;${parameters.label?default("")?html}</label><#rt/>
</#if><#rt/>