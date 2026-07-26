---
ms.topic: include
ms.date: 07/26/2026
---

The function `slm_embeddings_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that generates text embeddings using local Small Language Models (SLM). This function converts text into numerical vector representations that can be used for semantic search, similarity analysis, and other natural language processing tasks.
Currently, the function supports [harrier-v1-270m](https://huggingface.co/microsoft/harrier-oss-v1-270m), [jina-v2-small](https://huggingface.co/jinaai/jina-embeddings-v2-small-en), [e5-small-v2](https://huggingface.co/intfloat/e5-small-v2), and [SecBERT](https://huggingface.co/jackaduma/SecBERT) models. SecBERT is designed for cybersecurity text and generates 768-dimensional embeddings.

## Prerequisites

* The `python()` plugin must be [enabled on the database](/fabric/real-time-analytics/python-plugin) with either the `3.11.7` or `3.11.7 DL` Python sandbox image. This is required for the inline Python used in the function. To review the package contents for these images, see [Python package reference](../query/python-package-reference.md).
* Create a lakehouse to host the external artifacts (which are referenced in the KQL code below), preferably in the same workspace as your eventhouse.

## Syntax

`T | invoke slm_embeddings_fl(`*text_col*`,` *embeddings_col* [`,` *batch_size* ] [`,` *model_name* ] [`,` *prefix* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*text_col*| `string` | :heavy_check_mark:|The name of the column containing the text to embed.|
|*embeddings_col*| `string` | :heavy_check_mark:|The name of the column to store the output embeddings.|
|*batch_size*| `int` ||The number of texts to process in each batch. Default is 32.|
|*model_name*| `string` ||The name of the embedding model to use. Supported values are `harrier-v1-270m` (default), `jina-v2-small`, `e5-small-v2`, and `secbert`. The value must match the model artifact ZIP file name without the `.zip` extension.|
|*prefix*| `string` ||The text prefix to add before each input. Default is `query:`. For the Harrier and E5 models, use `query:` for search queries and `passage:` for documents to be searched (for the Harrier model, `passage:` maps to the empty task). This parameter is ignored for the Jina and SecBERT models.|

## Function definition

* Download `embedding_engine.zip` and the model ZIP files you plan to use, and upload them to your lakehouse.
* In the KQL code, update `artifact_root` to the OneLake folder that contains the artifacts, for example `https://msit-onelake.dfs.fabric.microsoft.com/MY_WORKSPACE/MY_LAKEHOUSE.Lakehouse/Files/models/SLM/`.
* Define the function by either embedding its code as a query-defined function or creating it as a stored function in your database.
* Each invocation loads the embedding engine and only the selected model artifact. To optimize storage, delete external artifacts for models that aren't used.

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `slm_embeddings_fl()`, see [Example](#example).

~~~kusto
let slm_embeddings_fl = (tbl:(*), text_col:string, embeddings_col:string, batch_size:int=32, model_name:string='harrier-v1-270m', prefix:string='query:')
{
    let artifact_root = 'https://msit-onelake.dfs.fabric.microsoft.com/MY_WORKSPACE/MY_LAKEHOUSE.Lakehouse/Files/models/SLM/';
    let engine_artifact = 'embedding_engine.zip';
    let kwargs = bag_pack('text_col', text_col, 'embeddings_col', embeddings_col, 'batch_size', batch_size, 'model_name', model_name, 'prefix', prefix);
    let code = ```if 1:
        import os
        from sandbox_utils import Zipackage
        Zipackage.install('embedding_engine.zip')

        from embedding_factory import create_embedding_engine

        text_col = kargs["text_col"]
        embeddings_col = kargs["embeddings_col"]
        batch_size = kargs["batch_size"]
        model_name = kargs["model_name"]
        prefix = kargs["prefix"]

        Zipackage.install(f'{model_name}.zip')

        work_dir = os.environ.get("UPLOAD_PATH")
        engine = create_embedding_engine(model_name, cache_dir=work_dir)
        embeddings = engine.encode(df[text_col].tolist(), batch_size=batch_size, prefix=prefix)		#	prefix is used by E5 and Harrier; Jina and SecBERT ignore it

        result = df
        result[embeddings_col] = list(embeddings)
	```;
    tbl
    | evaluate hint.distribution=per_node python(
        typeof(*), code, kwargs,
        external_artifacts=bag_pack(
            'embedding_engine.zip', strcat(artifact_root, engine_artifact, ';impersonate'),
            strcat(model_name, '.zip'), strcat(artifact_root, model_name, '.zip;impersonate')))
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = "Packages\\AI", docstring = "Embedding using local SLM")
slm_embeddings_fl(tbl:(*), text_col:string, embeddings_col:string, batch_size:int=32, model_name:string='harrier-v1-270m', prefix:string='query:')
{
    let artifact_root = 'https://msit-onelake.dfs.fabric.microsoft.com/MY_WORKSPACE/MY_LAKEHOUSE.Lakehouse/Files/models/SLM/';
    let engine_artifact = 'embedding_engine.zip';
    let kwargs = bag_pack('text_col', text_col, 'embeddings_col', embeddings_col, 'batch_size', batch_size, 'model_name', model_name, 'prefix', prefix);
    let code = ```if 1:
        import os
        from sandbox_utils import Zipackage
        Zipackage.install('embedding_engine.zip')

        from embedding_factory import create_embedding_engine

        text_col = kargs["text_col"]
        embeddings_col = kargs["embeddings_col"]
        batch_size = kargs["batch_size"]
        model_name = kargs["model_name"]
        prefix = kargs["prefix"]

        Zipackage.install(f'{model_name}.zip')

        work_dir = os.environ.get("UPLOAD_PATH")
        engine = create_embedding_engine(model_name, cache_dir=work_dir)
        embeddings = engine.encode(df[text_col].tolist(), batch_size=batch_size, prefix=prefix)		#	prefix is used by E5 and Harrier; Jina and SecBERT ignore it

        result = df
        result[embeddings_col] = list(embeddings)
	```;
    tbl
    | evaluate hint.distribution=per_node python(
        typeof(*), code, kwargs,
        external_artifacts=bag_pack(
            'embedding_engine.zip', strcat(artifact_root, engine_artifact, ';impersonate'),
            strcat(model_name, '.zip'), strcat(artifact_root, model_name, '.zip;impersonate')))
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### Generate embeddings and perform semantic search

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let slm_embeddings_fl = (tbl:(*), text_col:string, embeddings_col:string, batch_size:int=32, model_name:string='harrier-v1-270m', prefix:string='query:')
{
    let artifact_root = 'https://msit-onelake.dfs.fabric.microsoft.com/MY_WORKSPACE/MY_LAKEHOUSE.Lakehouse/Files/models/SLM/';
    let engine_artifact = 'embedding_engine.zip';
    let kwargs = bag_pack('text_col', text_col, 'embeddings_col', embeddings_col, 'batch_size', batch_size, 'model_name', model_name, 'prefix', prefix);
    let code = ```if 1:
        import os
        from sandbox_utils import Zipackage
        Zipackage.install('embedding_engine.zip')

        from embedding_factory import create_embedding_engine

        text_col = kargs["text_col"]
        embeddings_col = kargs["embeddings_col"]
        batch_size = kargs["batch_size"]
        model_name = kargs["model_name"]
        prefix = kargs["prefix"]

        Zipackage.install(f'{model_name}.zip')

        work_dir = os.environ.get("UPLOAD_PATH")
        engine = create_embedding_engine(model_name, cache_dir=work_dir)
        embeddings = engine.encode(df[text_col].tolist(), batch_size=batch_size, prefix=prefix)		#	prefix is used by E5 and Harrier; Jina and SecBERT ignore it

        result = df
        result[embeddings_col] = list(embeddings)
	```;
    tbl
    | evaluate hint.distribution=per_node python(
        typeof(*), code, kwargs,
        external_artifacts=bag_pack(
            'embedding_engine.zip', strcat(artifact_root, engine_artifact, ';impersonate'),
            strcat(model_name, '.zip'), strcat(artifact_root, model_name, '.zip;impersonate')))
};
//
// Create a sample dataset with text passages
let passages = datatable(text:string)
[
    "Machine learning models can process natural language efficiently.",
    "Python is a versatile programming language for data science.",
    "Azure Data Explorer provides fast analytics on large datasets.",
    "Embeddings convert text into numerical vector representations.",
    "Neural networks learn patterns from training data."
];
// Generate embeddings for passages using 'passage:' prefix
let passage_embeddings = 
    passages
    | extend text_embeddings=dynamic(null)
    | invoke slm_embeddings_fl('text', 'text_embeddings', 32, 'e5-small-v2', 'passage:');
// Create a search query and find similar passages
let search_query = datatable(query:string)
[
    "How do embeddings work?"
];
search_query
| extend query_embeddings=dynamic(null)
| invoke slm_embeddings_fl('query', 'query_embeddings', 32, 'e5-small-v2', 'query:')
| extend dummy=1
| join (passage_embeddings | extend dummy=1) on dummy
| project query, text, similarity=series_cosine_similarity(query_embeddings, text_embeddings, 1.0, 1.0)
| top 3 by similarity desc
~~~

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
// Create a sample dataset with text passages
let passages = datatable(text:string)
[
    "Machine learning models can process natural language efficiently.",
    "Python is a versatile programming language for data science.",
    "Azure Data Explorer provides fast analytics on large datasets.",
    "Embeddings convert text into numerical vector representations.",
    "Neural networks learn patterns from training data."
];
// Generate embeddings for passages using 'passage:' prefix
let passage_embeddings = 
    passages
    | extend text_embeddings=dynamic(null)
    | invoke slm_embeddings_fl('text', 'text_embeddings', 32, 'e5-small-v2', 'passage:');
// Create a search query and find similar passages
let search_query = datatable(query:string)
[
    "How do embeddings work?"
];
search_query
| extend query_embeddings=dynamic(null)
| invoke slm_embeddings_fl('query', 'query_embeddings', 32, 'e5-small-v2', 'query:')
| extend dummy=1
| join (passage_embeddings | extend dummy=1) on dummy
| project query, text, similarity=series_cosine_similarity(query_embeddings, text_embeddings, 1.0, 1.0)
| top 3 by similarity desc
```

---

**Output**

| query | text | similarity |
|---|---|---|
| How do embeddings work? | Embeddings convert text into numerical vector representations. | 0.871 |
| How do embeddings work? | Neural networks learn patterns from training data. | 0.812 |
| How do embeddings work? | Machine learning models can process natural language efficiently. | 0.782 |
