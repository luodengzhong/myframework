<#if parameters.disabled?default(false)>
<#include "/${parameters.templateDir}/simple/inputLable.ftl" />
<#else>
	<#if parameters.get("wrapper")??>
	<div class="ui-combox-wrap" id="${parameters.name?default("")?html}_click"><#rt/>
	</#if>
	<input<#rt/>
	 type="${parameters.type?default("text")?html}"<#rt/>
	 name="${parameters.name?default("")?html}"<#rt/>
	<#if parameters.get("size")??>
	 size="${parameters.get("size")?html}"<#rt/>
	</#if>
	<#if parameters.maxlength??>
	 maxlength="${parameters.maxlength?html}"<#rt/>
	</#if>
	<#if parameters.nameValue??>
	 value="${parameters.nameValue?html}"<#rt/>
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
	<#if parameters.mask??>
	 mask="${parameters.mask?html}"<#rt/>
	</#if>
	<#if parameters.match??>
	 match="${parameters.match?html}"<#rt/>
	</#if>
	<#if parameters.required?default(false)>
	 required="true"<#rt/>
	</#if>
	<#if parameters.label??>
	 label="${parameters.label?default("")?html}"<#rt/>
	</#if>
	<#if parameters.dataOptions??>
	 dataOptions="${parameters.dataOptions?default("")?html}"<#rt/>
	</#if>
	<#if parameters.get("wrapper")??>
	 ${parameters.wrapper?default("")?html}="true"<#rt/>
	</#if>
	<#include "/${parameters.templateDir}/simple/scripting-events.ftl" />
	<#include "/${parameters.templateDir}/simple/common-attributes.ftl" />
	<#include "/${parameters.templateDir}/simple/dynamic-attributes.ftl" />
	/>
	<#if parameters.get("wrapper")??>
	<span class="${parameters.wrapper?html}">&nbsp;</span><#rt/>
	</div><#rt/>
	</#if>
</#if>