---
title: Troubleshoot Private Endpoints in Azure Data Explorer
description: In this article, you learn how to troubleshoot private endpoints in Azure Data Explorer.
ms.reviewer: eladb
ms.topic: how-to
ms.date: 02/02/2026
---

# Troubleshoot private endpoints

This guide helps you troubleshoot connectivity, operational, and cluster creation problems for a cluster that uses private endpoints. If you have connectivity problems to private endpoints, use the following troubleshooting guidance.

## Check the connection state

Make sure that the private endpoint's connection state is set to **approved**.

1. In the Azure portal, go to your cluster and then select **Networking**.

1. Select **Private endpoint**. In the table, in the **Connection state** column, verify that the private endpoint is **approved**.

    :::image type="content" source="media/security-network-private-endpoint/pe-create-7.png" alt-text="Screenshot of the networking page, showing the all private endpoints of the cluster in the Azure portal.":::

## Run checks from within the virtual network

Use the following checks to investigate connectivity problems from within the same virtual network. Deploy a virtual machine in the same virtual network where you created the private endpoint. When you sign in to the machine, you can run the following tests.

### Check name resolution

Make sure that the name resolution works properly.

Iterate over all FQDNs of the private endpoint DNS configuration and run the tests by using *nslookup*, *Test-NetConnection*, or other similar tools to verify that each DNS matches its corresponding IP address.

:::image type="content" source="media/security-network-private-endpoint/pe-dns-config-inline.png" alt-text="Screenshot of the DNS configuration page, showing the DNS configuration of the private endpoint." lightbox="media/security-network-private-endpoint/pe-dns-config.png":::

### Check DNS resolution

Run the following command to verify that the DNS name of each FQDN matches its corresponding IP address.

```bash
#replace the <...> placeholders with the correct values
nslookup <cluster-name>.<cluster-region>.kusto.windows.net

#Results in the following output:
Server:'Server'
Address:'Address'

Non-authoritative answer:
<cluster-name>.<cluster-region>.kusto.windows.netcanonical name = <cluster-name>.privatelink.<cluster-region>.kusto.windows.net.
Name:<cluster-name>.privatelink.<cluster-region>.kusto.windows.net
Address: 'Address'
```

If you find an FQDN that doesn't match its corresponding IP address, fix your custom DNS server. If you're not using a custom DNS server, create a support ticket.

### Connectivity checks

Check if you can establish a TCP connection to every FQDN of the private endpoint DNS. Run the following tests on all FQDNs mentioned in the DNS configuration of the private endpoint.

```Powershell
#replace the <...> placeholders with the correct values
Test-NetConnection -ComputerName <cluster-name>.<cluster-region>.kusto.windows.net -Port 443

#Results in the following output:
ComputerName     : <cluster-name>.<cluster-region>.kusto.windows.net
RemoteAddress    : 'RemoteAddress'
RemotePort       : 443
InterfaceAlias   : Ethernet
SourceAddress    : 'SourceAddress'
TcpTestSucceeded : True
```

A successful result returns **TcpTestSucceeded : True**, which means that you can establish a TCP connection to the cluster.

### Check the health of the cluster

The last step of the troubleshooting process is to test the health of the cluster.

```Powershell
#replace the <...> placeholders with the correct values
#engine
Invoke-RestMethod https://<cluster-name>.<cluster-region>.kusto.windows.net/v1/rest/ping
Pong! IP address: 'IPv6IPaddress1'

#data management
Invoke-RestMethod https://ingest-<cluster-name>.<cluster-region>.kusto.windows.net/v1/rest/ping
Pong! IP address: 'IPv6IPaddress2'
```

A successful result returns **Pong!** and an IPv6 address.

### Check remote certificate revocation list 

If you get an exception saying the remote certificate can't be validated when using the C# SDK, your network might be configured to block checking the remote certificate revocation list.

```
System.Net.Http.HttpRequestException: The SSL connection could not be established, see inner exception. --->
System.Security.Authentication.AuthenticationException: The remote certificate is invalid because of errors in the certificate chain: RevocationStatusUnknown
```

You can resolve this problem by allowing access to the [list of remote certificate verification URLs](/entra/global-secure-access/how-to-configure-connectors#allow-access-to-urls) from the [Azure private network configuration guide](/entra/global-secure-access/how-to-configure-connectors).

Alternatively (less recommended), you can disable the remote certificate revocation validation by using one of the following options:

* Using Command Line Args: Add the following argument to your C# process:

```
-tweaks:Kusto.Cloud.Platform.Net.ExtendedServicePointManager.DisableCertificateRevocationListValidation=true
```

* Using Environment Variables: Set the following environment variable in the context of your machine process:

```
tweaks="Kusto.Cloud.Platform.Net.ExtendedServicePointManager.DisableCertificateRevocationListValidation=true"
````

* Using Code: Add the following line of code when initializing your application:

```csharp
Kusto.Cloud.Platform.Utils.Anchor.Tweaks.SetProgrammaticAppSwitch("Kusto.Cloud.Platform.Net.ExtendedServicePointManager.DisableCertificateRevocationListValidation", "true");
```

### Other troubleshooting tips

If after trying all these checks you're still experiencing an issue, try using the [private endpoint troubleshooting guide](/azure/private-link/troubleshoot-private-endpoint-connectivity#diagnose-connectivity-problems) to diagnose it.

## Troubleshoot managed private endpoints

For managed private endpoints, the only check you can do is to verify that the connection status of all managed private endpoints is **Approved**. Otherwise, the cluster can't connect to the corresponding services.

To verify that the managed private endpoint's connection state is set to **Approved**, complete the following steps:

1. In the Azure portal, go to your cluster and then select **Networking**.

1. Select **Private endpoint connections**. In the table, in the **Connection state** column, verify that the managed private endpoint is approved.

If you can't create a managed private endpoint, make sure the subscription is registered for the *Microsoft.Network* [resource provider](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider-1):

1. In the Azure portal, go to your subscription and select **Resource Providers**.

1. Search for *Microsoft.Network* and register the resource provider.

## Other troubleshooting guidelines

If all the checks are successful and you still can't connect to the cluster, contact your corporate security team. They're responsible for firewalls and networking.

Potential reasons for failure include:

* Misconfiguration of the firewall appliance
* Misconfiguration of User Defined Routes in your Azure Virtual Network
* A misconfigured proxy on the client machine
* A misconfigured proxy between the client and the cluster
