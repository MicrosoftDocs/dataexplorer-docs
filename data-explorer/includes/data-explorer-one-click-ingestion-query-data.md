---
ms.topic: include
ms.date: 09/04/2022
---
## Explore quick queries and tools

In the tiles below the ingestion progress, explore **Quick queries** or **Tools**:

* **Quick queries** include links to the Azure Data Explorer web UI with example queries.
* **Tools** includes links to **Undo** or **Delete new data** on the web UI, which enable you to troubleshoot issues by running the relevant `.drop` commands.

     > [!NOTE]
     > You might lose data when you use `.drop` commands. Use them carefully.
     > Drop commands will only revert the changes that were made by this ingestion flow (new extents and columns). Nothing else will be dropped.
