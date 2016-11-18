package com.brc.system.attachment.service;

import com.brc.system.attachment.model.FileInfo;
import java.io.File;

public abstract interface WebUploaderService
{
  public abstract File getReadySpace(FileInfo paramFileInfo);

  public abstract boolean chunkCheck(FileInfo paramFileInfo);

  public abstract File chunksMerge(FileInfo paramFileInfo);

  public abstract Long saveFileMap(FileInfo paramFileInfo, File paramFile);
}

