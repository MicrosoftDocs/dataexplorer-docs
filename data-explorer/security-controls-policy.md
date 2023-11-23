---
title: Azure Policy Regulatory Compliance controls for Azure Data Explorer
description: Lists Azure Policy Regulatory Compliance controls available for Azure Data Explorer. These built-in policy definitions provide common approaches to managing the compliance of your Azure resources.
ms.date: 04/21/2021
ms.topic: sample
ms.custom: subject-policy-compliancecontrols
---
# Azure Policy Regulatory Compliance controls for Azure Data Explorer

[Regulatory Compliance in Azure Policy](/azure/governance/policy/concepts/regulatory-compliance)
provides Microsoft created and managed initiative definitions, known as _built-ins_, for the
**compliance domains** and **security controls** related to different compliance standards. This
page lists the **compliance domains** and **security controls** for Azure Data Explorer. You can
assign the built-ins for a **security control** individually to help make your Azure resources
compliant with the specific standard.

The title of each built-in policy definition links to the policy definition in the Azure portal. Use
the link in the **Policy Version** column to view the source on the
[Azure Policy GitHub repo](https://github.com/Azure/azure-policy).

> [!IMPORTANT]
> Each control below is associated with one or more
> [Azure Policy](/azure/governance/policy/overview) definitions. These policies may help you
> [assess compliance](/azure/governance/policy/how-to/get-compliance-data) with the control;
> however, there often is not a one-to-one or complete match between a control and one or more
> policies. As such, **Compliant** in Azure Policy refers only to the policies themselves; this
> doesn't ensure you're fully compliant with all requirements of a control. In addition, the
> compliance standard includes controls that aren't addressed by any Azure Policy definitions at
> this time. Therefore, compliance in Azure Policy is only a partial view of your overall compliance
> status. The associations between controls and Azure Policy Regulatory Compliance definitions for
> these compliance standards may change over time.

## CMMC Level 3

To review how the available Azure Policy built-ins for all Azure services map to this compliance
standard, see
[Azure Policy Regulatory Compliance - CMMC Level 3](/azure/governance/policy/samples/cmmc-l3). For
more information about this compliance standard, see
[Cybersecurity Maturity Model Certification (CMMC)](https://blogs.oracle.com/site/cloud-infrastructure/post/achieving-cybersecurity-maturity-model-certification-cmmc-on-oracle-cloud).

|Domain |Control ID |Control title |Policy<br /><sub>(Azure portal)</sub> |Policy version<br /><sub>(GitHub)</sub>  |
|---|---|---|---|---|
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Azure Data Explorer encryption at rest should use a customer-managed key](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F81e74cea-30fd-40d5-802f-d72103c2aaaa) |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_CMK.json) |
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Disk encryption should be enabled on Azure Data Explorer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff4b53539-8df9-40e4-86c6-6b607703bd4e) |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_disk_encrypted.json) |
|System and Communications Protection |SC.3.177 |Employ FIPS-validated cryptography when used to protect the confidentiality of CUI. |[Double encryption should be enabled on Azure Data Explorer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fec068d99-e9c7-401f-8cef-5bdde4e6ccf1) |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_doubleEncryption.json) |
|System and Communications Protection |SC.3.191 |Protect the confidentiality of CUI at rest. |[Disk encryption should be enabled on Azure Data Explorer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff4b53539-8df9-40e4-86c6-6b607703bd4e) |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_disk_encrypted.json) |
|System and Communications Protection |SC.3.191 |Protect the confidentiality of CUI at rest. |[Double encryption should be enabled on Azure Data Explorer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fec068d99-e9c7-401f-8cef-5bdde4e6ccf1) |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Data%20Explorer/ADX_doubleEncryption.json) |

## Related content

- Learn more about [Azure Policy Regulatory Compliance](/azure/governance/policy/concepts/regulatory-compliance).
- See the built-ins on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).
