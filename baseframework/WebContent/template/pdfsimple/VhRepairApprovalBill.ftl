<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>  
  <title>车辆报修及费用审核</title>  
        <style type="text/css">
            body { font-family: SimSun;   font-size:12px;}
            
            .brcImg{
			    border-bottom: 1px solid #000000;
            }
            
            table.print{
               width:100%;table-layout:fixed; word-break:break-strict;
               border-left: 1px solid #000000;border-top: 1px solid #000000;
            }
            
            table.print tr{  
               height: 55px;text-align: left;
            } 
                        
            table.print td{
               border-right: 1px solid #000000;height:25px;border-bottom: 1px solid #000000;
               word-break: break-all;word-wrap: break-word;
            }
            table.print td.center{
                width:100px;
            	text-align: center;
            	word-break: break-all;word-wrap: break-word;
            }
            table.print td.left{
                width:200px;
            	text-align: left;
            	padding-left:20px;
            }
            table.tableInput{
				font-size:9pt;
				width:100%;
				table-layout:fixed;
				word-wrap:break-word; 
                word-break:break-all;
			    border: 1px solid #000000;
			    border-width: 1px 0 0 1px;
			}
			
			table.tableInput td{
				border: 1px solid #000000;
			    border-width: 0 1px 1px 0;
			    height:auto;
			    min-height:25px;
			    vertical-align:middle;
				word-break:break-all;
				word-wrap:break-word;
			}
			table.tableInput td div.textLabel{
				padding-left:5px;
			}
            @page {    
              size:  210mm 297mm;
              @bottom-right {  
                    content: "KJ-A04-01[A/0版]";  
              } 
           }    
        </style> 
</head> 
<#-- 定义宏formatdate-->
<#macro formatdate date>
<#if date??&&date?string!=''>
${date?string("yyyy-MM-dd HH:mm")}
</#if>
</#macro>  
<body>  
	  <div class="brcImg"><img src="${imgHttpUrl}/themes/default/images/head_logo.png" width="155" height="35"/></div>
      <div align="center" style="font-weight:bold;font-size:20px;">  
          <h3>车&nbsp;辆&nbsp;报&nbsp;修&nbsp;及&nbsp;费&nbsp;用&nbsp;审&nbsp;核</h3>
      </div>
      
      <div>
			<span style="float: left; margin-left: 10px;font-weight:bold;"> 
				单据号码：<strong>${billCode}</strong> &nbsp;&nbsp;
				制单日期：<strong><@formatdate date=fillinDate/></strong>
			</span> 
			<span style="float: right; margin-right: 10px;"> 
				经办人：<strong>${organName}.${deptName}.${personMemberName}</strong>
			</span>
      </div>
      <br></br>
      
      <table cellspacing="0px" cellpadding="0px" class="print"> 
         <tr>  
            <td class="center">文件编号</td>  
            <td colspan="3" class="center">${dispatchNo}</td>  
            <td class="center">单位</td>  
            <td class="center">元</td>  
         </tr>  
         <tr>  
            <td class="center">报修单位</td>  
            <td class="left">${repairOrganName}</td>  
            <td class="center">报修中心</td>  
            <td class="left">${repairCenterName}</td>  
            <td class="center">报修人</td>  
            <td class="left">${repairPersonMemberName}</td>
         </tr>
         <tr>  
            <td class="center">资产名称</td>  
            <td class="left">${assetName}</td>  
            <td class="center">报修时间</td>  
            <td class="left"><@formatdate date=repairTime/></td>  
            <td class="center">维修单位</td>  
            <td class="left">${repairUnit}</td>
         </tr>
         <tr>  
            <td class="center">联系电话</td>  
            <td class="left">${phone}</td>  
            <td class="center">车牌号</td>  
            <td class="left">${plate}</td>  
            <td class="center">品牌</td>  
            <td class="left">${brand}</td>
         </tr>
         <tr>  
            <td class="center">现行驶公里数(公里)</td>  
            <td class="left">${returnMileCount}</td>  
            <td class="center">业务主体</td>  
            <td class="left">${bizDeptName}</td>  
            <td class="center">费用主体</td>  
            <td class="left">${feeDeptName}</td>
         </tr>
         <tr>  
            <td class="center">材料费(元)</td>  
            <td class="left">${repairAmount}</td>  
            <td class="center">材料费折扣(优惠)</td>  
            <td class="left">${feeDiscount}</td> 
            <td class="center">惠后材料费(元)</td>  
            <td class="left">${feeAmount}</td> 
         </tr>
         <tr>  
            <td class="center">工时费(元)</td>  
            <td class="left">${laborHourFee}</td> 
            <td class="center">材料管理费(元)</td>  
            <td class="left">${materialManaFee}</td>  
            <td class="center">实际支付金额(元)</td>  
            <td class="left">${amount}</td>  
         </tr>
         <tr>  
            <td class="center">大写金额</td>  
            <td colspan="5" class="left">${chineseAmount}</td>  
         </tr>
         <tr>  
            <td class="center">报修内容</td>  
            <td colspan="5" class="left">${reason?html}</td>  
         </tr>
         <tr>  
            <td class="center">备注</td>  
            <td colspan="5" class="left">${remark?html}</td>  
         </tr>
      </table>
      
      <br/>
    <div  style="font-weight:bold;font-size:16px;text-align:left;">  
          <b>车辆维修费用明细</b>
    </div>
	<table cellspacing="0" cellpadding="0" class="print">
      	<tr>  
      		<td class="center" style="width:30px;"><b>序号</b></td>  
            <td class="center" style="width:100px;"><b>项目名称</b></td>  
            <td class="center" style="width:50px;"><b>数目</b></td>
            <td class="center" style="width:50px;"><b>单价(元)</b></td>
            <td class="center" style="width:50px;"><b>总价(元)</b></td>
            <td class="center" style="width:50px;"><b>工时费(元)</b></td>
            <td class="center" style="width:50px;"><b>材料费(元)</b></td>
            <td class="center" style="width:100px;"><b>备注</b></td>
         </tr>
        <#if vhRepairDetail?? && vhRepairDetail?size gt 0> 
		<#list vhRepairDetail as vhRepair>
			<tr >
				<td class="center">${vhRepair_index?if_exists+1}</td>
				<td class="center">${vhRepair.repairProjectName}</td>
				<td class="center">${vhRepair.quantity}</td>
				<td class="center">${vhRepair.price}</td>
				<td class="center">${vhRepair.amount}</td>
				<td class="center">${vhRepair.laborHourFee}</td>
				<td class="center">${vhRepair.materialManaFee}</td>
				<td class="center">${vhRepair.remark}</td>
			</tr> 
		</#list>
		<#else>
			<tr>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
				<td class="center">&nbsp;</td>
			</tr> 
		</#if>
      </table>
      <br/>
    <#include "/simple/taskExecutionList.ftl" />
</body>  
</html>   