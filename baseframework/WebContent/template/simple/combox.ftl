<#setting number_format="#">
<#if parameters.disabled?default(false)>
<#include "/${parameters.templateDir}/simple/inputLable.ftl" />
<#else>
	<#setting number_format="#.#####">
	<select<#rt/>
	 name="${parameters.name?default("")?html}"<#rt/>
	<#if parameters.get("size")??>
	 size="${parameters.get("size")?html}"<#rt/>
	</#if>
	<#if parameters.disabled?default(false)>
	 disabled="disabled"<#rt/>
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
	<#if parameters.multiple?default(false)>
	 multiple="multiple"<#rt/>
	</#if>
	<#if parameters.required?default(false)>
	 required="true"<#rt/>
	 label="${parameters.label?default("")?html}"<#rt/>
	</#if>
	<#include "/${parameters.templateDir}/simple/scripting-events.ftl" />
	<#include "/${parameters.templateDir}/simple/common-attributes.ftl" />
	<#include "/${parameters.templateDir}/simple/dynamic-attributes.ftl" />
	>
	<#if parameters.headerKey?? && parameters.headerValue??>
	    <option value="${parameters.headerKey?html}"
	    <#if tag.contains(parameters.nameValue, parameters.headerKey) == true>
	    selected="selected"
	    </#if>
	    >${parameters.headerValue?html}</option>
	</#if>
	<#if parameters.emptyOption?default(false)>
	    <option value=""></option>
	</#if>
	<#if parameters.list?? && parameters.list?size gt 0> 
	<@s.iterator value="parameters.list">
		<#if parameters.listKey??>
		    <#if stack.findValue(parameters.listKey)??>
		      <#assign itemKey = stack.findValue(parameters.listKey)/>
		      <#assign itemKeyStr = stack.findString(parameters.listKey)/>
		    <#else>
		      <#assign itemKey = ''/>
		      <#assign itemKeyStr = ''/>
		    </#if>
		<#else>
		    <#assign itemKey = stack.findValue('top')/>
		    <#assign itemKeyStr = stack.findString('top')>
		</#if>
		<#if parameters.listValue??>
		    <#if stack.findString(parameters.listValue)??>
		      <#assign itemValue = stack.findString(parameters.listValue)/>
		    <#else>
		      <#assign itemValue = ''/>
		    </#if>
		<#else>
		    <#assign itemValue = stack.findString('top')/>
		</#if>
		<#if parameters.listCssClass??>
		    <#if stack.findString(parameters.listCssClass)??>
		      <#assign itemCssClass= stack.findString(parameters.listCssClass)/>
		    <#else>
		      <#assign itemCssClass = ''/>
		    </#if>
		</#if>
		<#if parameters.listCssStyle??>
		    <#if stack.findString(parameters.listCssStyle)??>
		      <#assign itemCssStyle= stack.findString(parameters.listCssStyle)/>
		    <#else>
		      <#assign itemCssStyle = ''/>
		    </#if>
		</#if>
		<#if parameters.listTitle??>
		    <#if stack.findString(parameters.listTitle)??>
		      <#assign itemTitle= stack.findString(parameters.listTitle)/>
		    <#else>
		      <#assign itemTitle = ''/>
		    </#if>
		</#if>
	    <option value="${itemKeyStr?html}"<#rt/>
		<#if tag.contains(parameters.nameValue, itemKey) == true>
	 selected="selected"<#rt/>
		</#if>
		<#if itemCssClass?if_exists != "">
	 class="${itemCssClass?html}"<#rt/>
		</#if>
		<#if itemCssStyle?if_exists != "">
	 style="${itemCssStyle?html}"<#rt/>
		</#if>
		<#if itemTitle?if_exists != "">
	 title="${itemTitle?html}"<#rt/>
		</#if>
	    >${itemValue?html}</option><#lt/>
	</@s.iterator>
	</#if>
	<#include "/${parameters.templateDir}/simple/optgroup.ftl" />

	</select>
	<#if parameters.multiple?default(false)>
	<input type="hidden" id="__multiselect_${parameters.id?html}" name="__multiselect_${parameters.name?html}" value=""<#rt/>
	<#if parameters.disabled?default(false)>
	 disabled="disabled"<#rt/>
	</#if>
	 />
	</#if>
</#if>