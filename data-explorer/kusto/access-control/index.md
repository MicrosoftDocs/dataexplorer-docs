---
title: Access Control Overview - Azure Data Explorer
description: This article describes Access control in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 06/21/2023
---
# Access control overview

Azure Data Explorer access control is based on authentication and authorization. Each query and command on an Azure Data Explorer resource, such as a cluster or database, must pass both authentication and authorization checks.

* [Authentication](#authentication): Validates the identity of the security principal making a request
* [Authorization](#authorization): Validates that the security principal making a request is permitted to make that request on the target resource

## Authentication

[Azure Active Directory (Azure AD)](aad.md) is the preferred method of authentication to Azure Data Explorer. Azure AD can authenticate security principals or federate with other identity providers, and it supports both user and application authentication.

[User authentication](aad.md#user-authentication) is used to verify the identity of human principals and can be carried out interactively, where a human user provides credentials, or programmatically using a token. [Application authentication](aad.md#application-authentication) is used to authenticate services and applications that need to run and access resources without human intervention.

## Authorization

Before carrying out an action on an Azure Data Explorer resource, all authenticated users must pass an authorization check. Azure Data Explorer uses the [Kusto role-based access control](role-based-access-control.md) model, where principals are ascribed to one or more security roles. Authorization is granted as long as one of the roles assigned to the user allows them to perform the specified action. For example, the Database User role grants security principals the right to read the data of a particular database, create tables in the database, and more.

The association of security principals to security roles can be defined individually or by using security groups that are defined in Azure AD. For more information on how to assign security roles, see [Security roles overview](../management/security-roles.md).

## Next steps

* [Authenticate with Azure Active Directory](aad.md)
* Use the [client libraries](../api/client-libraries.md)
* Build [Kusto connection strings](../api/connection-strings/kusto.md)
* Understand Azure Data Explorer [role-based access control](role-based-access-control.md)
