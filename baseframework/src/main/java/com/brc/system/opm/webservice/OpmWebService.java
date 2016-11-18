package com.brc.system.opm.webservice;

import javax.jws.WebService;

@WebService
public abstract interface OpmWebService
{
  public abstract String findSubordinationsByLoginName(String paramString1, String paramString2);
}

