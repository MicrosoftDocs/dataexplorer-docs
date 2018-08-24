# evaluate operator

The evaluate operator is an extension mechanism to the Kusto query path that
allows first-party extensions to be appended to queries.

Extensions provided by the evaluate operator are not bound by the necessary
rules of query execution, and may have limitation based on the concrete extension implementation. 
For example extensions which output schema changes depending on the data (e.g. bag-unpack, pivot)
cannot be used in remote functions (cross-cluster query).



