---
title: Built-in policy definitions for Azure Data Explorer
description: Lists Azure Policy built-in policy definitions for Azure Data Explorer. These built-in policy definitions provide common approaches to managing your Azure resources.
ms.date: 11/17/2020
ms.topic: reference
ms.custom: subject-policy-reference
---
# Azure Policy built-in definitions for Azure Data Explorer

This page is an index of [Azure Policy](/azure/governance/policy/overview) built-in policy
definitions for Azure Data Explorer. For additional Azure Policy built-ins for other services, see
[Azure Policy built-in definitions](/azure/governance/policy/samples/built-in-policies).

The name of each built-in policy definition links to the policy definition in the Azure portal. Use
the link in the **Version** column to view the source on the
[Azure Policy GitHub repo](https://github.com/Azure/azure-policy).

## Azure Data Explorer

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Data Explorer encryption at rest should use a customer-managed key](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F81e74cea-30fd-40d5-802f-d72103c2aaaa) |Enabling encryption at rest using a customer-managed key on your Azure Data Explorer cluster provides additional control over the key being used by the encryption at rest. This feature is oftentimes applicable to customers with special compliance requirements and requires a Key Vault to managing the keys. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_CMK.json) |
|[Disk encryption should be enabled on Azure Data Explorer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff4b53539-8df9-40e4-86c6-6b607703bd4e) |Enabling disk encryption helps protect and safeguard your data to meet your organizational security and compliance commitments. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_disk_encrypted.json) |
|[Double encryption should be enabled on Azure Data Explorer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fec068d99-e9c7-401f-8cef-5bdde4e6ccf1) |Enabling double encryption helps protect and safeguard your data to meet your organizational security and compliance commitments. When double encryption has been enabled, data in the storage account is encrypted twice, once at the service level and once at the infrastructure level, using two different encryption algorithms and two different keys. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_doubleEncryption.json) |
|[Virtual network injection should be enabled for Azure Data Explorer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9ad2fd1f-b25f-47a2-aa01-1a5a779e6413) |Secure your network perimeter with virtual network injection which allows you to enforce network security group rules, connect on-premises and secure your data connection sources with service endpoints. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_VNET_configured.json) |

## Next steps

- See the built-ins on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).
- Review the [Azure Policy definition structure](/azure/governance/policy/concepts/definition-structure).
- Review [Understanding policy effects](/azure/governance/policy/concepts/effects).
