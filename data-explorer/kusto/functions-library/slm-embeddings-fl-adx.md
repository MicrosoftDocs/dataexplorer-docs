---
ms.topic: include
ms.date: 01/08/2026
---

# slm_embeddings_fl()

The function `slm_embeddings_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that generates text embeddings using local Small Language Models (SLM). This function converts text into numerical vector representations that can be used for semantic search, similarity analysis, and other natural language processing tasks.
Currently the function supports [jina-v2-small](https://huggingface.co/jinaai/jina-embeddings-v2-small-en) and [e5-small-v2](https://huggingface.co/intfloat/e5-small-v2) models.

[!INCLUDE [python-zone-pivot-fabric](../includes/python-zone-pivot-fabric.md)]
* More for ADX

## Syntax

`T | invoke slm_embeddings_fl(`*text_col*`,` *embeddings_col* [`,` *batch_size* ] [`,` *model_name* ] [`,` *prefix* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*text_col*| `string` | :heavy_check_mark:|The name of the column containing the text to embed.|
|*embeddings_col*| `string` | :heavy_check_mark:|The name of the column to store the output embeddings.|
|*batch_size*| `int` ||The number of texts to process in each batch. Default is 32.|
|*model_name*| `string` ||The name of the embedding model to use. Supported values are `jina-v2-small` (default) and `e5-small-v2`.|
|*prefix*| `string` ||The text prefix to add before each input. Default is `query:`. For E5 model, use `query:` for search queries and `passage:` for documents to be searched. This parameter is ignored for Jina model.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `slm_embeddings_fl()`, see [Example](#example).

~~~kusto
let slm_embeddings_fl = (tbl:(*), text_col:string, embeddings_col:string, batch_size:int=32, model_name:string='jina-v2-small', prefix:string='query:')
{
    let kwargs = bag_pack('text_col', text_col, 'embeddings_col', embeddings_col, 'batch_size', batch_size, 'model_name', model_name, 'prefix', prefix);
    let code = ```if 1:
		from sandbox_utils import Zipackage
		Zipackage.install('embedding_engine.zip')
#		Zipackage.install('tokenizers-0.22.1.whl')			# redundant if tokenizers package is included in the Python image
		
		from embedding_factory import create_embedding_engine
		
		text_col = kargs["text_col"]
		embeddings_col = kargs["embeddings_col"]
		batch_size = kargs["batch_size"]
		model_name = kargs["model_name"]
		prefix = kargs["prefix"]

		Zipackage.install(f'{model_name}.zip')

		engine = create_embedding_engine(model_name, cache_dir="C:\\Temp")
		embeddings = engine.encode(df[text_col].tolist(), batch_size=batch_size, prefix=prefix)		#	prefix is used only for E5
		
		result = df
		result[embeddings_col] = list(embeddings)
	```;
    tbl
    | evaluate hint.distribution=per_node python(typeof(*), code, kwargs, external_artifacts = bag_pack(
    			'embedding_engine.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/embedding_engine.zip',
//				'tokenizers-0.22.1.whl', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/tokenizers-0.22.1-cp39-abi3-win_amd64.whl',
				'jina-v2-small.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/jina-v2-small.zip',
				'e5-small-v2.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/e5-small-v2.zip'))
};
// Write your query to use the function here.
~~~

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

~~~kusto
.create-or-alter function with (folder = "Packages\\AI", docstring = "Embedding using local SLM")
slm_embeddings_fl(tbl:(*), text_col:string, embeddings_col:string, batch_size:int=32, model_name:string='jina-v2-small', prefix:string='query:')
{
    let kwargs = bag_pack('text_col', text_col, 'embeddings_col', embeddings_col, 'batch_size', batch_size, 'model_name', model_name, 'prefix', prefix);
    let code = ```if 1:
		from sandbox_utils import Zipackage
		Zipackage.install('embedding_engine.zip')
#		Zipackage.install('tokenizers-0.22.1.whl')			# redundant if tokenizers package is included in the Python image
		
		from embedding_factory import create_embedding_engine
		
		text_col = kargs["text_col"]
		embeddings_col = kargs["embeddings_col"]
		batch_size = kargs["batch_size"]
		model_name = kargs["model_name"]
		prefix = kargs["prefix"]

		Zipackage.install(f'{model_name}.zip')

		engine = create_embedding_engine(model_name, cache_dir="C:\\Temp")
		embeddings = engine.encode(df[text_col].tolist(), batch_size=batch_size, prefix=prefix)		#	prefix is used only for E5
		
		result = df
		result[embeddings_col] = list(embeddings)
	```;
    tbl
    | evaluate hint.distribution=per_node python(typeof(*), code, kwargs, external_artifacts = bag_pack(
    			'embedding_engine.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/embedding_engine.zip',
//				'tokenizers-0.22.1.whl', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/tokenizers-0.22.1-cp39-abi3-win_amd64.whl',
				'jina-v2-small.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/jina-v2-small.zip',
				'e5-small-v2.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/e5-small-v2.zip'))
}
~~~

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### Generate embeddings and perform semantic search

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

~~~kusto
let slm_embeddings_fl=(tbl:(*), text_col:string, embeddings_col:string, batch_size:int=32, model_name:string='jina-v2-small', prefix:string='query:')
{
    let kwargs = bag_pack('text_col', text_col, 'embeddings_col', embeddings_col, 'batch_size', batch_size, 'model_name', model_name, 'prefix', prefix);
    let code = ```if 1:
		from sandbox_utils import Zipackage
		Zipackage.install('embedding_engine.zip')
#		Zipackage.install('tokenizers-0.22.1.whl')			# redundant if tokenizers package is included in the Python image
		
		from embedding_factory import create_embedding_engine
		
		text_col = kargs["text_col"]
		embeddings_col = kargs["embeddings_col"]
		batch_size = kargs["batch_size"]
		model_name = kargs["model_name"]
		prefix = kargs["prefix"]

		Zipackage.install(f'{model_name}.zip')

		engine = create_embedding_engine(model_name, cache_dir="C:\\Temp")
		embeddings = engine.encode(df[text_col].tolist(), batch_size=batch_size, prefix=prefix)		#	prefix is used only for E5
		
		result = df
		result[embeddings_col] = list(embeddings)
	```;
    tbl
    | evaluate hint.distribution=per_node python(typeof(*), code, kwargs, external_artifacts = bag_pack(
    'embedding_engine.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/embedding_engine.zip',
    'jina-v2-small.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/jina-v2-small.zip',
    'e5-small-v2.zip', 'https://artifactswestus.z22.web.core.windows.net/models/SLM/e5-small-v2.zip'))
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
