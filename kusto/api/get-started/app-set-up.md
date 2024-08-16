---
title: Set up your development environment to use Kusto client libraries
description: Learn how to set up your development environment to use Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# Set up your development environment to use Kusto client libraries

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Learn how to set up your environment to use Kusto client libraries. You can use these libraries to create apps that connect with a cluster and run queries or ingest data.

In this article, you learn how to install client library packages for your preferred language.

## Prerequisites

Select the prerequisites for the programming language used to create your app.

> [!NOTE]
> Kusto client libraries are compatible with JavaScript and TypeScript. To convert TypeScript examples to JavaScript, simply remove the type annotations used for variables, parameters, and return values.

### [C\#](#tab/csharp)

One or more of the following .NET SDK frameworks:

- .NET SDK 5.0 or later
- .NET Core 2.1 or later
- .NET Standard 2.1 or later
- .NET Framework 4.7.2 or later

Verify installation: In a command shell, run `dotnet sdk check` to check that the versions installed meet the minimum requirements.

### [Python](#tab/python)

- [Python 3.7 or later](https://www.python.org/downloads/)
    - Ensure the `python` executable is in your `PATH`
    - Verify installation: In a command shell, run `python --version` to check that the version is 3.7 or later

### [Typescript](#tab/typescript)

- [Node 16 or later](https://nodejs.org/en/download/) built with ES6
    - Ensure the `node` executable is in your `PATH`
    - Verify installation: In a command shell, run `node --version` to check that the version is 3.7 or later
- A Node.js app or a browser-based web app, such as a React app.
- For browser-based web apps:
  
  - If your app has a login experience, you can use the [@auzre/identity library](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity/test/manual/interactive-browser-credential) to issue an authorization token and use `withTokenProvider` to feed this token to the Kusto client:

    ```typescript
    const tokenProvider =  () => Promise.resolve("someToken")
    KustoConnectionStringBuilder.withTokenProvider(clusterUri, tokenProvider)
    ```

  - If your app doesn't have a login experience, or you prefer to use the Kusto client library to prompt authentication, you need to set up an application registration with the necessary permissions:
  
    1. [Create a Microsoft Entra application registration](../../access-control/provision-entra-id-app.md#create-microsoft-entra-application-registration).
    1. In the **Authentication** tab, select **+ Add a platform**. Then, select **Single-page application**.
    1. Enter the desired **Redirect URIs**, select the boxes for **Access tokens** and **ID tokens**, and select **Configure**. For more information on redirect URIs, see [Desktop app that calls web APIs](/entra/identity-platform/scenario-desktop-app-registration).
    1. [Configure delegated permissions for the application](../../access-control/provision-entra-id-app.md#configure-delegated-permissions-for-the-application---optional).
    1. [Grant the application access to your database](../../access-control/provision-entra-id-app.md#grant-a-service-principal-access-to-the-database).
    1. In the **Overview** tab, copy the **Application (client) ID**.

    The examples throughout the following tutorials use the Kusto client library to prompt authentication.

    > [!NOTE]
    > If you belong to an organization, restrictions based on organization configurations might prevent you from authenticating. Ask for access from an organization admin or try again on a personal account.

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

- JDK 8 or later
    - Ensure the `java` executable is in your `PATH`
    - Verify installation: In a command shell, run `java -version` to check that the version is 8 or later
- Maven 3.6.3 or later
    - Ensure the `mvn` executable is in your `PATH`
    - Verify installation: In a command shell, run `mvn -version` to check that the version is 3.6.3 or later
---

## Install the package

This section walks you through installing the Kusto client library in your environment.

The following table lists the client libraries and the corresponding package names.

| Library Name | Description |
|--|--|
| Kusto Data library | Provides a client for connecting to clusters. Use the client library to [query data](../../query/index.md) or run [management commands](../../management/index.md). |
| Kusto Ingest library | Provides a client for ingesting data into clusters. For more information, see [Kusto Ingest library overview](../netfx/about-kusto-ingest.md) into your cluster. |

Add the Kusto client libraries for your preferred language to your project, or use the package manager appropriate for your language to install the client libraries.

### [C\#](#tab/csharp)

```bash
dotnet add package Microsoft.Azure.Kusto.Data --version 11.2.2
dotnet add package Microsoft.Azure.Kusto.Ingest --version 11.2.2
```

### [Python](#tab/python)

```bash
python -m pip install azure-kusto-data
python -m pip install azure-kusto-ingest
```

### [Typescript](#tab/typescript)

```bash
npm install azure-kusto-data
npm install azure-kusto-ingest
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

When creating apps, use the *maven-archetype-quickstart* Maven template for the package, as follows.

```bash
 mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId==my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

Then add the following dependencies to your pom.xml, replacing the artifact versions with the latest available on Maven Central for [kusto-data](https://central.sonatype.com/search?q=kusto-data) and [kusto-ingest](https://central.sonatype.com/search?q=kusto-ingest).

```xml
<dependency>
  <groupId>com.microsoft.azure.kusto</groupId>
  <artifactId>kusto-data</artifactId>
  <version>5.0.0</version>
</dependency>
<dependency>
  <groupId>com.microsoft.azure.kusto</groupId>
  <artifactId>kusto-ingest</artifactId>
  <version>5.0.0</version>
</dependency>
```

You also need to add the *maven-compiler-plugin* and *exec-maven-plugin* plugins in your pom.xml. If they don't already exist, add them as follows.

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <version>${maven-compiler-plugin.version}</version>
  <configuration>
    <source>${java.version}</source>
    <target>${java.version}</target>
  </configuration>
</plugin>
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <version>3.1.0</version>
</plugin>
```

---

The Kusto SDKs contain quick start sample applications. These applications showcase how to authenticate, administer, query, and ingest data using the Kusto client libraries. You can use them as a starting point for your own application by modifying the code or incorporating specific sections into your project.

### [C\#](#tab/csharp)

[C# Quickstart App](https://github.com/Azure/azure-kusto-samples-dotnet/tree/master/client/QuickStart)

### [Python](#tab/python)

[Python Quickstart App](https://github.com/Azure/azure-kusto-python/tree/master/quick_start)

### [Typescript](#tab/typescript)

- [Node.js Quickstart App](https://github.com/Azure/azure-kusto-node/tree/master/packages/quick_start)
- [Browser Quickstart App](https://github.com/Azure/azure-kusto-node/tree/master/packages/quick_start_browser)

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

[Java Quickstart App](https://github.com/Azure/azure-kusto-java/tree/master/quickstart)

---

## Learn how to create apps that use client libraries

The following articles walk you through creating apps that use the Kusto client libraries.

- [Create your first app](app-hello-kusto.md)
- [Create an app to run basic queries](app-basic-query.md)
- [Create an app to run management commands](app-management-commands.md)
- [Create an app to get data using queued ingestion](app-queued-ingestion.md)

## Related content

- [KQL quick reference](../../query/kql-quick-reference.md)
::: moniker range="azure-data-explorer"
- [Sample app generator wizard](/azure/data-explorer/sample-app-generator-wizard)
::: moniker-end
