package com.brc.system.opm.webservice;

import javax.jws.WebService;

@WebService
public abstract interface OpmForAppWebService
{
  public abstract String queryDeltaOrg(String paramString);

  public abstract String slicedQueryDeltaOrg(String paramString);

  public abstract String queryDeltaPerson(String paramString);

  public abstract String slicedQueryDeltaPerson(String paramString);

  public abstract String updatePersonContactInfo(String paramString);
}

