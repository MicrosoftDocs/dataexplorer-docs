---
title: Set up your development environment to use Kusto client libraries
description: Learn how to set up your development environment to use Kusto client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 04/24/2023
---
# Set up your development environment to use Kusto client libraries

Learn how to set up your environment to use Kusto client libraries. You can use these libraries to create apps that connect with a cluster and run queries or ingest data.

In this article, you learn how to install client library packages for your preferred language.

## Prerequisites

Select the prerequisites for the programming language used to create your app.

> [!NOTE]
> Kusto client libraries support both JavaScript and TypeScript. To convert the TypeScript examples to JavaScript, simply remove the typings.

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
- A Node.js app or a browser-based web app.
- For browser-based apps, set up an application registration with the necessary permissions for authentication:
  
    1. [Create a Microsoft Entra application registration](../../../provision-azure-ad-app.md).
    2. In the **Authentication** tab, select **+ Add a platform**.
    3. Select **Single-page application**.
    4. Enter the desired **Redirect URIs**, select the boxes for **Access tokens** and **ID tokens**, and select **Configure**.
    5. In the **API permissions** tab, select **Add a permission**.
    6. Select **APIs my organization uses**.
    7. Search for "Azure Data Explorer" and add the application that you just configured.
    8. In the **Overview** tab, copy the **Application (client) ID**.

    > [!NOTE]
    > If you belong to an organization, restrictions based on the organization configurations might prevent you from authenticating. If these steps aren't effective, try again on a personal account.

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
| Kusto Ingest library | Provides a client for ingesting data into clusters. For more information, see [ingest data](../../../ingest-data-overview.md) into your cluster. |

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

## Learn how to create apps that use client libraries

The following articles walk you through creating apps that use the Kusto client libraries.

- [Create your first app](app-hello-kusto.md)
- [Create an app to run basic queries](app-basic-query.md)
- [Create an app to run management commands](app-management-commands.md)

## Next steps

<!-- Advance to the next article to learn how to create... -->
> [!div class="nextstepaction"]
> [KQL quick reference](../../../kql-quick-reference.md)

> [!div class="nextstepaction"]
> [Sample app generator wizard](../../../sample-app-generator-wizard.md)
