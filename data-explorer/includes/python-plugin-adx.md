---
ms.topic: include
ms.date: 08/14/2023
---

The Python plugin runs a user-defined function (UDF) using a Python script. The Python script gets tabular data as its input, and produces tabular output. The plugin's runtime is hosted in [sandboxes](../kusto/concepts/sandboxes.md), running on the cluster's nodes.

## Syntax

*T* `|` `evaluate` [`hint.distribution` `=` (`single` | `per_node`)] [`hint.remote` `=` (`auto` | `local`)] `python(`*output_schema*`,` *script* [`,` *script_parameters*] [`,` *external_artifacts*][`,` *spill_to_disk*]`)`

[!INCLUDE [syntax-conventions-note](syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*output_schema*| `string` | :heavy_check_mark:|A `type` literal that defines the output schema of the tabular data, returned by the Python code. The format is: `typeof(`*ColumnName*`:` *ColumnType*[, ...]`)`. For example, `typeof(col1:string, col2:long)`. To extend the input schema, use the following syntax: `typeof(*, col1:string, col2:long)`.|
|*script*| `string` | :heavy_check_mark:|The valid Python script to execute. To generate multi-line strings, see [Usage tips](#usage-tips).|
|*script_parameters*| `dynamic` ||A property bag of name value pairs to be passed to the Python script as the reserved `kargs` dictionary. For more information, see [Reserved Python variables](#reserved-python-variables).|
|*hint.distribution*| `string` ||A hint for the plugin's execution to be distributed across multiple cluster nodes. The default value is `single`. `single` means a single instance of the script will run over the entire query data. `per_node` means that if the query before the Python block is distributed, an instance of the script will run on each node, on the data that it contains.|
|*hint.remote*| `string` ||This hint is only relevant for cross cluster queries. The default value is `auto`. `auto` means the server decides automatically in which cluster the Python code is executed. Setting the value to `local` forces executing the Python code on the local cluster. Use it in case the Python plugin is disabled on the remote cluster.|
|*external_artifacts*| `dynamic` ||A property bag of name and URL pairs for artifacts that are accessible from cloud storage. See more in [Using external artifacts](#using-external-artifacts).|
|*spill_to_disk*| `bool` ||Specifies an alternative method for serializing the input table to the Python sandbox. For serializing big tables set it to `true` to speed up the serialization and significantly reduce the sandbox memory consumption. Default is `true`.|

## Reserved Python variables

The following variables are reserved for interaction between Kusto Query Language and the Python code.

* `df`: The input tabular data (the values of `T` above), as a `pandas` DataFrame.
* `kargs`: The value of the *script_parameters* argument, as a Python dictionary.
* `result`: A `pandas` DataFrame created by the Python script, whose value becomes the tabular data that gets sent to the Kusto query operator that follows the plugin.

## Enable the plugin

The plugin is disabled by default. Before you start, review the list of [prerequisites](../kusto/concepts/sandboxes.md#prerequisites-and-limitations). To enable the plugin and select the version of the Python image, see [Enable language extensions on your cluster](../language-extensions.md#enable-language-extensions-on-your-cluster).

## Python sandbox image

To change the version of the Python image, see [Change the Python language extensions image on your cluster](../language-extensions.md#change-the-python-language-extensions-image-on-your-cluster).

To see the list of packages for the different Python images, see [Python package reference](../python-package-reference.md).

> [!NOTE]
>
> * By default, the plugin imports *numpy* as **np** and *pandas* as **pd**. Optionally, you can import other modules as needed.
> * Some packages might be incompatible with the limitations enforced by the sandbox where the plugin is run.

## Use ingestion from query and update policy

* Use the plugin in queries that are:
  * Defined as part of an [update policy](../kusto/management/update-policy.md), whose source table is ingested to using *non-streaming* ingestion.
  * Run as part of a command that [ingests from a query](../kusto/management/data-ingestion/ingest-from-query.md), such as `.set-or-append`.
* You can't use the plugin in a query that is defined as part of an update policy, whose source table is ingested using [streaming ingestion](../ingest-data-streaming.md).

## Examples

~~~kusto
range x from 1 to 360 step 1
| evaluate python(
//
typeof(*, fx:double),               //  Output schema: append a new fx column to original table 
```
result = df
n = df.shape[0]
g = kargs["gain"]
f = kargs["cycles"]
result["fx"] = g * np.sin(df["x"]/n*2*np.pi*f)
```
, bag_pack('gain', 100, 'cycles', 4)    //  dictionary of parameters
)
| render linechart 
~~~

:::image type="content" source="../kusto/query/media/plugin/sine-demo.png" alt-text="Screenshot of sine demo showing query result." border="false":::

~~~kusto
print "This is an example for using 'external_artifacts'"
| evaluate python(
    typeof(File:string, Size:string), ```if 1:
    import os
    result = pd.DataFrame(columns=['File','Size'])
    sizes = []
    path = '.\\\\Temp'
    files = os.listdir(path)
    result['File']=files
    for file in files:
        sizes.append(os.path.getsize(path + '\\\\' + file))
    result['Size'] = sizes
    ```,
    external_artifacts = 
        dynamic({"this_is_my_first_file":"https://kustoscriptsamples.blob.core.windows.net/samples/R/sample_script.r",
                 "this_is_a_script":"https://kustoscriptsamples.blob.core.windows.net/samples/python/sample_script.py"})
)
~~~

| File   | Size |
|--------|------|
| this_is_a_script      | 120  |
| this_is_my_first_file | 105  |

## Performance tips

* Reduce the plugin's input dataset to the minimum amount required (columns/rows).
  * Use filters on the source dataset, when possible, with Kusto's query language.
  * To do a calculation on a subset of the source columns, project only those columns before invoking the plugin.
* Use `hint.distribution = per_node` whenever the logic in your script is distributable.
  * You can also use the [partition operator](../kusto/query/partition-operator.md) for partitioning the input dataset.
* Use Kusto's query language whenever possible, to implement the logic of your Python script.

## Usage tips

* To generate multi-line strings containing the Python script in your query editor, copy your Python script from your favorite
  Python editor (*Jupyter*, *Visual Studio Code*, *PyCharm*, and so on), paste it in your query editor, and then enclose the full script between lines containing three consecutive backticks. For example:  

    ` ``` `  
    ` python code`  
    ` ``` `
* Use the [`externaldata` operator](../kusto/query/externaldata-operator.md) to obtain the content of a script that you've stored in an external location, such as Azure Blob storage.
  
### Example

```kusto
    let script = 
        externaldata(script:string)
        [h'https://kustoscriptsamples.blob.core.windows.net/samples/python/sample_script.py']
        with(format = raw);
    range x from 1 to 360 step 1
    | evaluate python(
        typeof(*, fx:double),
        toscalar(script), 
        bag_pack('gain', 100, 'cycles', 4))
    | render linechart 
 ```

## Using External Artifacts

External artifacts from cloud storage can be made available for the script and used at runtime.

The URLs referenced by the external artifacts property must be:

* Included in the cluster's [callout policy](../kusto/management/callout-policy.md).
* In a publicly available location, or provide the necessary credentials, as explained in [storage connection strings](../kusto/api/connection-strings/storage-connection-strings.md).

> [!NOTE]
> When authenticating external artifacts using Managed Identities, the `SandboxArtifacts` usage must be defined on the cluster level [managed identity policy](../kusto/management/managed-identity-policy.md).

The artifacts are made available for the script to consume from a local temporary directory, `.\Temp`. The names provided in the property bag are used as the local file names. See [Examples](#examples).

For information regarding referencing external packages, see [Install packages for the Python plugin](#install-packages-for-the-python-plugin).

### Refreshing external artifact cache

External artifact files utilized in queries are cached on your cluster. If you make updates to your files in cloud storage and require immediate synchronization with your cluster, you can use the [.clear cluster cache external-artifacts command](../kusto/management/clear-external-artifacts-cache-command.md). This command clears the cached files and ensures that subsequent queries run with the latest version of the artifacts.

## Install packages for the Python plugin

You may need to install package(s) yourself, for the following reasons:

* The package is private and is your own.
* The package is public but isn't included in the plugin's base image.

Install packages as follows:

### Prerequisites

  1. Create a blob container to host the packages, preferably in the same place as your cluster. For example, `https://artifactswestus.blob.core.windows.net/python`, assuming your cluster is in West US.
  1. Alter the cluster's [callout policy](../kusto/management/callout-policy.md) to allow access to that location.
        * This change requires [AllDatabasesAdmin](../kusto/management/access-control/role-based-access-control.md) permissions.

        * For example, to enable access to a blob located in `https://artifactswestus.blob.core.windows.net/python`, run the following command:

        ```kusto
        .alter-merge cluster policy callout @'[ { "CalloutType": "sandbox_artifacts", "CalloutUriRegex": "artifactswestus\\.blob\\.core\\.windows\\.net/python/","CanCall": true } ]'
        ```

### Install packages

1. For public packages in [PyPi](https://pypi.org/) or other channels,
download the package and its dependencies.

   * From a cmd window in your local Windows Python environment, run:

    ```python
    pip wheel [-w download-dir] package-name.
    ```

1. Create a zip file that contains the required package and its dependencies.

    * For private packages, zip the folder of the package and the folders of its dependencies.
    * For public packages, zip the files that were downloaded in the previous step.

    > [!NOTE]
    >
    > * Make sure to download the package that is compatible to the Python engine and the platform of the sandbox runtime (currently 3.6.5 on Windows)
    > * Make sure to zip the `.whl` files themselves, and not their parent folder.
    > * You can skip `.whl` files for packages that already exist with the same version in the base sandbox image.

1. Upload the zipped file to a blob in the artifacts location (from step 1).

1. Call the `python` plugin.
    * Specify the `external_artifacts` parameter with a property bag of name and reference to the zip file (the blob's URL, including a SAS token).
    * In your inline python code, import `Zipackage` from `sandbox_utils` and call its `install()` method with the name of the zip file.

### Example

Install the [Faker](https://pypi.org/project/Faker/) package that generates fake data.

~~~kusto
range ID from 1 to 3 step 1 
| extend Name=''
| evaluate python(typeof(*), ```if 1:
    from sandbox_utils import Zipackage
    Zipackage.install("Faker.zip")
    from faker import Faker
    fake = Faker()
    result = df
    for i in range(df.shape[0]):
        result.loc[i, "Name"] = fake.name()
    ```,
    external_artifacts=bag_pack('faker.zip', 'https://artifacts.blob.core.windows.net/kusto/Faker.zip?*** REPLACE WITH YOUR SAS TOKEN ***'))
~~~

| ID | Name |
|----|-------|
|   1| Gary Tapia   |
|   2| Emma Evans   |
|   3| Ashley Bowen |

## Related content

For more examples of UDF functions that use the Python plugin, see the [Functions library](../kusto/functions-library/functions-library.md).
