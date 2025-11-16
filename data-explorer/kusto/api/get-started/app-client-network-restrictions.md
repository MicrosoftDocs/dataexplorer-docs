---
title: Manage DNS Restrictions
description: Resolve DNS validation errors in Kusto tools by adding custom allowances or disabling validation for specific use cases.
ms.reviewer: yogilad
ms.author: spelluru
author: spelluru
ms.topic: how-to
ms.date: 11/16/2025
ms.custom: 
---

# Client network restrictions

When working with Kusto tools and SDKs, network security is a top priority. To safeguard customer data, queries, and authentication tokens, Kusto enforces DNS restrictions that limit connections to a predefined set of trusted domains. While these restrictions enhance security, certain scenarios might require bypassing them to accommodate custom configurations, such as hosting Kusto behind custom URIs or using older SDK versions. These cases include:

* Customers hosting Kusto behind custom URIs
* Customers hosting Kusto behind Azure Front Door for redundancy or high availability
* Customers running with older version of the SDK where new domains aren't yet allowed
* Customers running with older version of the SDK in new clouds

In these cases, Kusto SDK and Tools allow adding custom allowances to bypass the default restrictions.

> [!IMPORTANT]
>
> For the latter two cases, the best course of action to resolve the issue is to update to the latest version of the SDK or tool being used. Adding custom domains and policy overrides should be used as a short term mitigation.

This article provides step-by-step guidance on managing DNS restrictions in Kusto tools, including adding trusted hosts, disabling DNS validation, and programmatically customizing validation policies.

## Bypass DNS restrictions using Kusto Explorer

1. Open Kusto Explorer.
1. From the **Tools** ribbon, select **Options**.
1. Select **Connections**.
1. In **Additional Trusted Hosts** add the fully qualified hostname or DNS suffix (preceded with an asterisk `*`) you want to work with. You can list multiple FQDNs or DNS suffixes by separating them with a semicolon `;`.

:::image type="content" source="../../media/bypass-dns-restrictions/kusto_explorer_options.png" alt-text="Options editor open with the Additional Trusted Hosts field highlighted.":::

## Bypass DNS restrictions using Azure Data Explorer

1. Open Azure Data Explorer.
1. Select the *Settings* icon in the top-right corner.
1. Select **Connection**.
1. In **Additional trusted hosts**, add the fully qualified hostname or DNS suffix (preceded with an asterisk `*`) you want to work with. You can list multiple FQDNs or DNS suffixes by separating them with a semicolon `;`.

:::image type="content" source="../../media/bypass-dns-restrictions/kusto_web_explorer_settings.png" alt-text="ADX Settings editor open with the Additional trusted hosts field highlighted.":::

## Bypass DNS restrictions using Command Line Applications and Tools

For command line applications and tools, you can disable DNS validation entirely by passing a command line argument, or by setting an environment variable.

> [!NOTE]
> Disabling DNS validation using environment variables affects all applications and tools using the C# SDK. That includes Kusto Explorer, Light Ingest, Kusto CLI, Perkus, and any third-party application developed using the C# Kusto SDK.

To disable with a command-line argument, add the following argument to the command line of the tool you run.

```shell
-tweaks:Kusto.Cloud.Platform.Data.EnableWellKnownKustoEndpointsValidation=false
```

To disable with an environment variable:

```shell
SET TWEAKS="Kusto.Cloud.Platform.Data.EnableWellKnownKustoEndpointsValidation=false"
```

## Bypass DNS restrictions using Kusto SDKs

When using Kusto SDKs, you can programmatically control DNS validation by adding trusted hosts and DNS domains, or by providing the SDK with a predicate that takes the target hostname and returns *true* or *false* depending on whether the connection is allowed.

### [C\#](#tab/csharp)

```csharp
using Kusto.Data.Common;
 
// Add a DNS domain
KustoTrustedEndpoints.AddTrustedHosts(
    new[] { new FastSuffixMatcher<EndpointContext>.MatchRule("*.domain.com", exact: false, context: KustoTrustedEndpoints.KustoEndpointContext) },
    replace:false);
 
// Add a fully qualified domain name
KustoTrustedEndpoints.AddTrustedHosts(
    new[] { new FastSuffixMatcher<EndpointContext>.MatchRule("mykusto.domain.com", exact: true, context: KustoTrustedEndpoints.KustoEndpointContext) },
    replace:false);

// Set a custom validation policy 
KustoTrustedEndpoints.SetOverridePolicy(
    (hostname) => true, 
    KustoTrustedEndpoints.KustoEndpointContext);

```

### [Go](#tab/go)

```go
import (
    "github.com/Azure/azure-kusto-go/azkustodata/trustedEndpoints"
)

// Add a DNS domain
trustedEndpoints.Instance.AddTrustedHosts([]trustedEndpoints.MatchRule{
    security.NewMatchRule("*.domain.com", false),
})

// Add a fully qualified domain name
trustedEndpoints.Instance.AddTrustedHosts([]trustedEndpoints.MatchRule{
    security.NewMatchRule("mykusto.domain.com", true),
})

// Set a custom validation policy
trustedEndpoints.Instance.SetOverrideMatcher(
    func(h string) bool {
        return true
            },
    security.KustoTrustedEndpoints.KustoEndpointContext,
)
```

### [Java](#tab/java)

```java

import com.microsoft.azure.kusto.data.auth.endpoints.KustoTrustedEndpoints;
import com.microsoft.azure.kusto.data.auth.endpoints.MatchRule;

// Add a DNS domain
KustoTrustedEndpoints.addTrustedHosts(
    java.util.Arrays.asList(new MatchRule("*.domain.com", false)));

// Add a fully qualified domain name
KustoTrustedEndpoints.addTrustedHosts(
    java.util.Arrays.asList(new MatchRule("mykusto.domain.com", true)));

// Set a custom validation policy
KustoTrustedEndpoints.setOverridePolicy(
    h -> true,
    KustoTrustedEndpoints.KustoEndpointContext);
```

### [JavaScript](#tab/javascript)

```javascript

import { KustoTrustedEndpoints, MatchRule } from "azure.kusto.data";

// Add a DNS domain
KustoTrustedEndpoints.addTrustedHosts([new MatchRule("*.domain.com", false)]);

// Add a fully qualified domain name
KustoTrustedEndpoints.addTrustedHosts([new MatchRule("mykusto.domain.com", true)]);

// Set a custom validation policy
KustoTrustedEndpoints.setOverrideMatcher(
    (h) => true,
    KustoTrustedEndpoints.KustoEndpointContext
);

```

### [ Python](#tab/python)

```python
from azure.kusto.data.security import KustoTrustedEndpoints, MatchRule

# Add a DNS domain
KustoTrustedEndpoints.add_trusted_hosts([MatchRule("*.domain.com", exact=false)])

# Add a fully qualified domain name
KustoTrustedEndpoints.add_trusted_hosts([MatchRule("mykusto.domain.com", exact=true)])

# Set a custom validation policy 
KustoTrustedEndpoints.set_override_matcher(
    lambda h: true, 
    KustoTrustedEndpoints.KustoEndpointContext)
```
