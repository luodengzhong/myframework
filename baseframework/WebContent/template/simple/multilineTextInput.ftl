<#setting number_format="#">
<textarea<#rt/>
 name="${parameters.name?default("")?html}"<#rt/>
 cols="${parameters.cols?default("")?html}"<#rt/>
<#if parameters.wrap??>
 wrap="${parameters.wrap?html}"<#rt/>
</#if>
<#if parameters.maxlength??>
 maxlength="${parameters.maxlength?html}"<#rt/>
</#if>
<#if parameters.disabled?default(false)>
 readonly="readonly"<#rt/>
</#if>
<#if parameters.required?default(false)>
 required="true"<#rt/>
 label="${parameters.label?default("")?html}"<#rt/>
</#if>
<#if parameters.readonly?default(false)>
 readonly="readonly"<#rt/>
</#if>
<#if parameters.tabindex??>
 tabindex="${parameters.tabindex?html}"<#rt/>
</#if>
<#if parameters.id??>
 id="${parameters.id?html}"<#rt/>
 <#else>
 id="${parameters.name?html}"<#rt/>
</#if>
<#include "/${parameters.templateDir}/simple/css.ftl" />
<#if parameters.title??>
 title="${parameters.title?html}"<#rt/>
</#if>
<#include "/${parameters.templateDir}/simple/scripting-events.ftl" />
<#include "/${parameters.templateDir}/simple/common-attributes.ftl" />
<#include "/${parameters.templateDir}/simple/dynamic-attributes.ftl" />
><#rt/>
<#if parameters.nameValue??>
<@s.property value="parameters.nameValue"/><#t/>
</#if>
</textarea>