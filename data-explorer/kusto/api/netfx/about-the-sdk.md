---
title: About Kusto .NET SDK - Azure Data Explorer | Microsoft Docs
description: This article describes About Kusto .NET SDK in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
---
# About Kusto .NET SDK

## NuGet feed



Kusto client libraries are published as NuGet packages and can be found on [Nuget.org](https://www.nuget.org/packages?q=microsoft.azure.kusto).

The following Kusto packages are available for consumption:


|Package                                                                                             |Main assembly name|Runtime                                 |Source            |Description        |
|----------------------------------------------------------------------------------------------------|------------------|----------------------------------------|------------------|-------------------|
|[Microsoft.Azure.Kusto.Data](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Data/)            |Kusto.Data        |.NET Framework 4.6.2 / .NET Core 2.0    |Nuget.org         |Client Library     |
|[Microsoft.Azure.Kusto.Ingest](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Ingest/)        |Kusto.Ingest      |.NET Framework 4.6.2 / .NET Core 2.0    |Nuget.org         |Ingestion Library  |
|[Microsoft.Azure.Management.Kusto](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/)|                  |.NET Framework 4.6.1 / .NET Core 2.0    |Nuget.org         |Management Library |
|[Microsoft.Azure.Kusto.Tools](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Tools/)          |                  |.NET Framework 4.6.2                    |Nuget.org         |Command-line tools |
|[Microsoft.Azure.Kusto.Language](https://www.nuget.org/packages/Microsoft.Azure.Kusto.Language/)    |Kusto.Language    |.NET Framework 4.6.2 / .NET Core 2.0    |Nuget.org         |Language service   |

**Accessing the NuGet feed from Visual Studio**

- See [Consume NuGet packages in Visual Studio](https://www.visualstudio.com/docs/package/get-started/nuget/consume)
- Note that instructions are different, depending on which version of Visual Studio you're using:
  -  It is **strongly recommended** upgrading to Visual Studio 2015 Update 1 or later, as 
  Package Management feeds work *seamlessly* with the NuGet Package Manager for Visual Studio 2015 extension as of 
  Visual Studio 2015 Update 1.
      - If you haven't installed Update 1 or later, you can update to the latest version of the 
  [NuGet Package Manager extension](https://dist.nuget.org/visualstudio-2015-vsix/latest/NuGet.Tools.vsix) directly.
      - Visual Studio 2013 and earlier versions don't automatically acquire credentials for authenticated feeds. 
      Instead, you need to get a Personal Access Token (PAT) and save it in NuGet's config file. Follow the instructions to
      [get a PAT and connect to a feed](https://docs.microsoft.com/vsts/organizations/accounts/use-personal-access-tokens-to-authenticate).
      Then restart Visual Studio and continue.


**Accessing the NuGet feed using the NuGet Package Manager console**

1. First read [Authenticating to feeds with NuGet](https://www.visualstudio.com/docs/package/get-started/nuget/auth).
2. Then make sure that the NuGet client version is 3.2 or above.
3. Now execute the following PowerShell commands in the Package Manager console.
  - Make sure you replace `<package name>` with either of the following:
    - Microsoft.Azure.Kusto.Client
    - Microsoft.Azure.Kusto.Ingest

```powershell
Install-Package <package name>
  -Source https://api.nuget.org/v3/index.json
```

**Accessing the NuGet feed using the NuGet command-line tool**

1. First read [Authenticating to feeds with NuGet](https://www.visualstudio.com/docs/package/get-started/nuget/auth).
2. Then make sure that the NuGet client version is 3.2 or above.
3. Now execute the following PowerShell commands from a command prompt:
  - Make sure you replace `<package name>` with either of the following:
    - Microsoft.Azure.Kusto.Client
    - Microsoft.Azure.Kusto.Ingest

```cmd
nuget.exe Install <package name> 
  -Source https://api.nuget.org/v3/index.json
```





## Troubleshooting

If you are having difficulties consuming Kusto client libraries or building with them, the following suggests some besic remediation steps:
* Make sure to follow recommendations about Visual Studio versions, CU version, and extensions suggested and referenced in the paragraph above
* Consider installing the libraries using the NuGet.exe client
