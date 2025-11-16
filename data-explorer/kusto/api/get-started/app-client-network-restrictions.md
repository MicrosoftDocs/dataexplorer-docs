# Client Network Restrictions

## Overview

Kusto tools and SDKs restrict which URIs can be called to a set of well known DNS domains.
This restrictions prevents sending customer data, queries and Entra app and user tokens to an untrusted party, thus protecting the customer's identity, security and their data.

While this restriction should not pose any issues to the vast majority of customers, there are legitimate cases where calls need to be made to a URI that is not trusted by the library. These cases include:

* Customers hosting Kusto behind custom URIs
* Customers hosting Kusto behind Azure Front Door for redundancy or high availability
* Customers running with older version of the SDK where new domains are not yet allowed
* Customers running with older version of the SDK in new clouds

In these cases, Kusto SDK and Tools allow adding custom allowances to bypass the default restrictions.

> [!IMPORTANT]
> For the latter two cases, the best course of action to resolve the issue is to update to the latest version of the SDK or tool being used. Adding custom domains and policy overrides should be used as a short term mitigation.

## Bypassing DNS Restrictions

### Kusto Explorer

1. Open Kusto Explorer
1. In the _Tools_ ribbon menu click on _Options_
1. Choose _Connections_
1. In _Additional Trusted Hosts_, add the fully qualified hostname or DNS suffix (preceded with an asterisk `*`) you wish to work with. You can list multiple FQDNs and / or DNS suffixes by separating them with a semicolon `;`.

> PIC kusto_explorer_options.png goes here

### Kusto Web Explorer

1. Open Kusto Web Explorer
1. Click on the Settings icon on the top right corner
1. Choose _Connections_
1. In _Additional Trusted Hosts_, add the fully qualified hostname or DNS suffix (preceded with an asterisk `*`) you wish to work with. You can list multiple FQDNs and / or DNS suffixes by separating them with a semicolon `;`.

> PIC kusto_wb_explorer_settings.png goes here

### Command Line Applications and Tools

For command line applications and tools, you can disable DNS validation entirely by passing a command line arg, or by setting an environment variable.

> [!NOTE]
> Disabling DNS validation using environment variables affect all application and tools using the C# sdk. That includes _Kusto Explorer, Light Ingest, Kusto CLI, Perkus_ and any 3rd party application developed using the C# Kusto SDK.

To disable with CMD arg, add the below argument to the command line of the tool you run

```shell
-tweaks:Kusto.Cloud.Platform.Data.EnableWellKnownKustoEndpointsValidation=false
```

To disable with Env var:

```shell
SET TWEAKS="Kusto.Cloud.Platform.Data.EnableWellKnownKustoEndpointsValidation=false"
```

### SDKs

When using Kusto SDKs, you can problematically control the DNS validation by adding trusted hosts and DNS domains, or by providing the SDK with a predicate taking in the target hostname and returning _true_ or _false_ depending on whether the connection should be allowed or not.

#### C\#

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

#### Go

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

#### Java

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

#### Java Script

```javascript

import { KustoTrustedEndpoints, MatchRule } from "azure.kusto.data";

// Add a DNS domain
KustoTrustedEndpoints.addTrustedHosts([new MatchRule("*.domain.com", false]);

// Add a fully qualified domain name
KustoTrustedEndpoints.addTrustedHosts([new MatchRule("mykusto.domain.com", true]);

// Set a custom validation policy
KustoTrustedEndpoints.setOverrideMatcher(
    (h) => true,
    KustoTrustedEndpoints.KustoEndpointContext);

```

#### Python

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
