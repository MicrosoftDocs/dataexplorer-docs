---
ms.topic: include
ms.date: 07/07/2025
---

> [!IMPORTANT]
>
> * If the principal is in the same tenant as the user, their FQNs (fully qualified name) is shown.
>
> * If the principal is in a different tenant as the user, the display name format is `[User/Group/Application] from AAD Tenant [Tenant Id]`. This means that the display name doesn't show the actual name of the principal, but rather indicates that it's from a different tenant.
>
>      * To identify principals from a different tenant, you can add identifying information to their role assignment. This is done using the `Description` parameter when assigning the role in their tenant. The `Description` is included in the display name.