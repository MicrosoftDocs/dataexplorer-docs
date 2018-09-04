---
title: Getting the Kusto client libraries - Azure Kusto | Microsoft Docs
description: This article describes Getting the Kusto client libraries in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Getting the Kusto client libraries

## The "official" NuGet feed



The Kusto client libraries are published as NuGet packages and can be found on [nuget.org](https://www.nuget.org/packages?q=kusto).

The following packages are available at this feed:

|Package               |Main assembly name|Runtime             |Description              |
|----------------------|------------------|--------------------|-------------------------|
|Microsoft.Kusto.Client|Kusto.Data        |.NET Framework 4.5.1|Kusto Client Library.    |
|Microsoft.Kusto.Ingest|Kusto.Ingest      |.NET Framework 4.5.1|Kusto Ingestion Library. |


**Accessing the official NuGet feed from Visual Studio**

1. See [Consume NuGet packages in Visual Studio](https://www.visualstudio.com/en-us/docs/package/get-started/nuget/consume)
- Note that instructions are different, depending on which version of Visual Studio you're using:
  -  It is **strongly recommended** upgrading to Visual Studio 2015 Update 1 or later, as 
  Package Management feeds work *seamlessly* with the NuGet Package Manager for Visual Studio 2015 extension as of 
  Visual Studio 2015 Update 1.
      - If you haven't installed Update 1 or later, you can update to the latest version of the 
  [NuGet Package Manager extension](https://dist.nuget.org/visualstudio-2015-vsix/latest/NuGet.Tools.vsix) directly.
      - Visual Studio 2013 and earlier versions don't automatically acquire credentials for authenticated feeds. 
      Instead, you need to get a Personal Access Token (PAT) and save it in NuGet's config file. Follow the instructions to
      [get a PAT and connect to a feed](https://www.visualstudio.com/en-us/docs/package/nuget/auth#personal-access-tokens).
      Then restart Visual Studio and continue.
2. The feed location to use is: https://1essharedassets.pkgs.visualstudio.com/_packaging/Kusto/nuget/v3/index.json
3. For any issues with consuming NuGet packages from VSTS feeds, try contacting 1ESHelp@microsoft.com or 
   vsopackagingteam@microsoft.com for assistance.

**Accessing the official NuGet feed using the NuGet Package Manager console**

1. First read [Authenticating to feeds with NuGet](https://www.visualstudio.com/en-us/docs/package/get-started/nuget/auth).
2. Then make sure that the NuGet client version is 3.2 or above.
3. Now execute the following PowerShell commands in the Package Manager console.
  - Make sure you replace `<package name>` with either of the following:
    - Microsoft.Kusto.Client
    - Microsoft.Kusto.Ingest
    - Microsoft.Kusto.Manage
    - Microsoft.Kusto.IntelliSense

```powershell
Install-Package <package name>
  -Source https://1essharedassets.pkgs.visualstudio.com/_packaging/Kusto/nuget/v3/index.json
```

**Accessing the official NuGet feed using the NuGet command-line tool**

1. First read [Authenticating to feeds with NuGet](https://www.visualstudio.com/en-us/docs/package/get-started/nuget/auth).
2. Then make sure that the NuGet client version is 3.2 or above.
3. Now execute the following PowerShell commands from a command propmpt:
  - Make sure you replace `<package name>` with either of the following:
    - Microsoft.Kusto.Client
    - Microsoft.Kusto.Ingest
    - Microsoft.Kusto.Manage
    - Microsoft.Kusto.IntelliSense

```cmd
nuget.exe Install <package name> 
  -Source https://1essharedassets.pkgs.visualstudio.com/_packaging/Kusto/nuget/v3/index.json
```

**Comment on build automation and authenticating to the 'Kusto' feed from outside the '1ESSharedAssets' VSTS account**

(Source: [1ES Wiki -> Nuget Auth](https://1eswiki.com/wiki/NuGet-Auth))
- Currently, VSTS identities are scoped to the account ([account].visualstudio.com). This makes it challenging to use feeds in one account from another account's build. VSTS will soon introduce the concept of an "organization" which allows resources to span multiple accounts. As that work lands, the VSTS packaging team will work on leveraging it to make this scenario better. 
- In the meantime, you can use the following workaround if you need to consume packages from a different account: [Link](https://1eswiki.com/wiki/NuGet-Auth#Authenticating-to-feeds-outside-of-your-VSTS-account-in-Team-Build). 

## Getting the Kusto client libraries for users of CoreXT, CloudBuild, or PacMan

It is possible to consume VSTS NuGet feeds from CoreXT / CloudBuild / PacMan.
See [here](https://1eswiki.com/wiki/Using-VSTS-NuGet-with-CloudBuild) for details.

## Getting the Kusto client libraries for users of Azure Build (OneBranch)
The Kusto NuGet packages are mirrored into a OneBranch-accessible repository daily;
add a reference to ManualMirror:

```xml
<repo name="Manual"   uri="https://msazure.pkgs.visualstudio.com/DefaultCollection/_apis/packaging/ManualMirror/nuget/index.json" fallback="http://wanuget/ManualMirror/nuget" />
```

To see the currently-available packages:

```
nuget list Kusto -Source http://wanuget/ManualMirror/nuget -AllVersions
```

* See [Package Stores](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Package Stores.aspx)
  to learn about the package stores available in Azure Build.
* See [Mirroring packages from external feeds](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Mirroring packages from external feeds.aspx)
  to learn about package mirroring in Azure Build.
* See [Publishing to the ManualMirror Feed](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Publishing to the ManualMirror Feed.aspx)
  to learn about how to mirror the Kusto packages (if you need to for some reason).

## Troubleshooting

If you are having difficulties consuming Kusto client libraries or building with them, the following suggests some besic remediation steps:
* Make sure to follow recommendations about Visual Studio versions, CU version, and extensions suggested and referenced in the paragraph above
* Consider installing the libraries using the NuGet.exe client
* Contact [1ESHelp Support DL](mailto:1ESHelp@microsoft.com) or [VSO Packaging Team](mailto:vsopackagingteam@microsoft.com)