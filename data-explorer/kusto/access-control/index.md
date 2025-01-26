---
title: Access Control Overview
description: This article describes Access control.
ms.reviewer: yogilad
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 01/26/2025
---
# Access control overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

:::moniker range="azure-data-explorer"
Access control is based on authentication and authorization. Each query and command on an Azure Data Explorer resource, such as a cluster or database, must pass both authentication and authorization checks.
::: moniker-end

:::moniker range="microsoft-fabric"
Access control is based on authentication and authorization. Each query and command on a Fabric resource, such as a database, must pass both authentication and authorization checks.
::: moniker-end

* [Authentication](#authentication): Validates the identity of the security principal making a request
* [Authorization](#authorization): Validates the security principal making a request is permitted to make that request on the target resource

## Authentication

To programmatically authenticate, a client must communicate with [Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-whatis) and request an access token specific to the Kusto service. Then, the client can use the acquired access token as proof of identity when issuing requests to your database.

The main authentication scenarios are as follows:

* [User authentication](#user-authentication): Used to verify the identity of human users.
* [Application authentication](#application-authentication): Used to verify the identity of an application that needs to access resources without human intervention by using configured credentials.
* [On-behalf-of (OBO) authentication](/azure/active-directory/develop/msal-authentication-flows#on-behalf-of-obo): Allows an application to exchange a token for said application with a token to access a Kusto service. This flow must be implemented with MSAL.
* [Single page application (SPA) authentication](/azure/active-directory/develop/msal-authentication-flows#authorization-code): Allows client-side SPA web applications to sign in users and get tokens to access your database. This flow must be implemented with MSAL.

> [!NOTE]
> For user and application authentication, we recommend using the [Kusto client libraries](../api/client-libraries.md). If you require On-behalf-of (OBO) or Single-Page Application (SPA) authentication, you'll need to use MSAL directly as the client libraries don't support these flows. For more information, see [Authenticate with Microsoft Authentication Library (MSAL)](../api/rest/authenticate-with-msal.md).

### User authentication

User authentication happens when a user presents credentials to Microsoft Entra ID or an identity provider that federates with Microsoft Entra ID, such as Active Directory Federation Services. The user gets back a security token that can be presented to the Azure Data Explorer service. Azure Data Explorer determines whether the token is valid, whether the token is issued by a trusted issuer, and what security claims the token contains.

::: moniker range="azure-data-explorer"
Azure Data Explorer supports the following methods of user authentication, including through the [Kusto client libraries](../api/client-libraries.md):

* Interactive user authentication with sign-in through the user interface.
* User authentication with a Microsoft Entra token issued for Azure Data Explorer.
* User authentication with a Microsoft Entra token issued for another resource that can be exchanged for an Azure Data Explorer token using On-behalf-of (OBO) authentication.
::: moniker-end

### Application authentication

Application authentication is needed when requests aren't associated with a specific user or when no user is available to provide credentials. In this case, the application authenticates to Microsoft Entra ID or the federated IdP by presenting secret information.

::: moniker range="azure-data-explorer"
Azure Data Explorer supports the following methods of application authentication, including through the [Kusto client libraries](../api/client-libraries.md):

* Application authentication with an Azure managed identity.
* Application authentication with an X.509v2 certificate installed locally.
* Application authentication with an X.509v2 certificate given to the client library as a byte stream.
* Application authentication with a Microsoft Entra application ID and a Microsoft Entra application key. The application ID and application key are like a username and password.
* Application authentication with a previously obtained valid Microsoft Entra token, issued to Azure Data Explorer.
* Application authentication with a Microsoft Entra token issued for another resource that can be exchanged for an Azure Data Explorer token using On-behalf-of (OBO) authentication.
::: moniker-end

## Authorization

Before carrying out an action on a resource, all authenticated users must pass an authorization check. The [Kusto role-based access control](role-based-access-control.md) model is used, where principals are ascribed to one or more security roles. Authorization is granted as long as one of the roles assigned to the user allows them to perform the specified action. For example, the Database User role grants security principals the right to read the data of a particular database, create tables in the database, and more.

The association of security principals to security roles can be defined individually or by using security groups that are defined in Microsoft Entra ID. For more information on how to assign security roles, see [Security roles overview](../management/security-roles.md).

## Group authorization

Authorization can be granted to Microsoft Entra ID groups by assigning one or more roles to the group.

When checking authorization for a user or application principal, the system first looks for an explicit role assignment that permits the specific action. If the role assignment doesn't exists, then the system checks the principal's membership in all groups that could authorize the action.

If the principal is a member of a group with appropriate permissions, the requested action is authorized. Otherwise, the action doesn't pass the authorization check and is disallowed.

> [!NOTE]
>
> [!INCLUDE [Cached Group Membership](../includes/cached-group-membership.md)]

### Force group membership refresh

Principals can force a refresh of group membership information. This capability is useful in scenarios where just-in-time (JIT) privileged access services, such as Microsoft Entra Privileged Identity Management (PIM), are used to obtain higher privileges on a resource.

#### Refresh for a specific group

Principals can force a refresh of group membership **for a specific group**. However, the following restrictions apply:

1. A refresh can be requested up to 10 times per hour per principal.
1. The requesting principal must be a member of the group at the time of the request.

The request results in an error if either of these conditions aren't met.

To reevaluate the current principal's membership of a group, run the following command:

```kusto
.clear cluster cache groupmembership with (group='<GroupFQN>')
```

Use the group's fully qualified name (FQN). For more information, see [Referencing Microsoft Entra principals and groups](../management/reference-security-principals.md#referencing-microsoft-entra-principals-and-groups).

#### Refresh for other principals

A privileged principal can request a refresh **for other principals**. The requesting principal must have [AllDatabaseMonitor](role-based-access-control.md) access for the target service. Privileged principals can also run the previous command without restrictions.

To refresh another principal’s group membership, run the following command:

```kusto
.clear cluster cache groupmembership with (principal='<PrincipalFQN>', group='<GroupFQN>')
```

Use the FQNs for the principal and group names. For more information, see [Referencing Microsoft Entra principals and groups](../management/reference-security-principals.md#referencing-microsoft-entra-principals-and-groups).

## Related content

* Understand [Kusto role-based access control](role-based-access-control.md).
* For user or application authentication, use the [Kusto client libraries](../api/client-libraries.md).
* For OBO or SPA authentication, see [How to authenticate with Microsoft Authentication Library (MSAL)](../api/rest/authenticate-with-msal.md).
* For referencing principals and groups, see [Referencing Microsoft Entra principals and groups](../management/reference-security-principals.md).
