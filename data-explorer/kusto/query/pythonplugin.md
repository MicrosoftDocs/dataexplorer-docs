# python plugin (preview)

Runs an arbitrary Python script to process the input tabular data source and produce an output tabular data source.

    T | evaluate python(script, output-schema, script-parameters)

The `python` plugin allows an arbitrary Python code embedded in the Kusto query
be used as a Kusto query operator (accepting and returning a Kusto tabular data
stream).

**Syntax**

*T* `|` `evaluate` `python` `(` *Script* [`,` *OutputSchema* [`,` *ScriptParameters*]] `)`


**Arguments**

* *Script*: A `string` literal that holds a valid Python script to be executed.
* *OutputSchema*: An optional `string` literal containing the output schema of
  the tabular data returned by the Python code. The format is: `"col1:type1, col2:type2, ..."`. `df(*)` can be used as a reference to all the columns of the input tabular data stream.
  If this value is not provided, then the results of the Python code are returned
  as a packed dynamic dictionary (similar to the `pack-all` output)
* *ScriptParameters*: An optional `dynamic` literal holding a property bag of name/value
  pairs to be passed to the Python script as the reserved `kargs` variable (see below).

**Reserved Python variables**

In the Python code, the following symbols are reserved and hold a special meaning:

* `df`: The input tabular data (the values of `T` above), as a pandas dataframe.
* `kargs`: The value of the *ScriptParameters* argument, as a Python dictionary.
* `result`: A pandas dataframe created by the Python script whose value becomes
  the tabular data that gets sent to any Kusto query operator that follows
  the plugin.

**Architecure & flow**

1. The plugin makes use of an external Python service endpoint (that is, Kusto
   doesn't host the Python interpreter on its own nodes).
2. The plugin encodes the input data (table, script, and paramters) and performs
   an HTTP POST to a Python service endpoint.
3. The Python service:
    (a) Creates the context containing the `df` dataframe from the tabular input,
       and the `kargs` dictionary from the script parameters.
    (b) Executes the code script using Python `exec()`.
    (c) The Python script should create and set the `result` dataframe conforming to *OutputSchema*
    (d) This `result` dataframe  is encoded and sent back as the HTTP response to the plugin
4. The plugin decodes it and built the tabular output that is returned

**Notes**

* The plugin is disabled by default; to enable it please contact [Kusto Ops](http://aka.ms/kustosupport).
* For the duration of the preview, the Python service endpoint is on [AML Studio](https://services.azureml.net/quickstart),
  with resources being shared between all Kusto users regardless of the Kusto
  cluster they are using. Consequently, you should avoid overloading it with long-running Pythong
  scripts. It is recommended that the input to the Python script be kept
  smaller than 1M rows x 100 columns.
* The Python service is based on Anaconda 4.0.0 distribution with Python 3.5 engine.
  Note that this version is not the latest one.
  The list and versions of all included packages can be found [here](https://docs.anaconda.com/anaconda/packages/old-pkg-lists/4.0.0/py35).
* The plugin imports numpy (as `np`) & pandas (as `pd`) by default.
  You can import other modules as needed.
* Currently the Python script is barred from accessing the network, and therefore
  cannot install & import additional Python packages that are not already installed by the above Anaconda 4.0.0 distribution.
  This limitation will be lifted in the future.
* As the script is run in the scope of Python exec() function, any name
  (e.g. variable, function, import etc.) defined at script scope and referenced
  from embedded functions must be explicitly declared as global.
  See [here](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces)
  for more information about Python scopes and namespaces.
* In order to generate multi-line strings containing the Python script in Kusto.Explorer, copy your Python script from your favorite Python editor (e.g. Jupyter, Visual Studio Code, PyCharm etc.), then either:
    * Press F2 to open "Edit in Python" window. Paste the script into this window. Once you press the Ok button, the script will be decorated with quotes & newlines (to make it valid in Kusto) and automatically pasted into the query tab
    * Paste the Python code directly into the query tab, then select these lines and press Ctrl+K,Ctrl+S hot key to decorate them as above (to reverse it press Ctrl+K, Ctrl+M hot key).
    [Here](https://kusdoc2.azurewebsites.net/docs/tools/tools_kusto_explorer_shortcuts.html) is the full list of Query Editor shortcuts

* To avoid interference between Kusto string delimiters and Python's ones, we recommend using single quote characters (`'`) for Kusto string
  literals in Kusto queries, and double quote characters (`"`) for
  Python string literals in Python scripts.

**Example**

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```
range x from 1 to 360 step 1
| evaluate python(
//
'result = df\n'
'n = df.shape[0]\n'
'g = kargs["gain"]\n'
'f = kargs["cycles"]\n'
'result["fx"] = g * np.sin(df["x"]/n*2*np.pi*f)\n'
//
, 'df(*), fx:double'                //  Output schema: append a new fx column to original table 
//
, pack('gain', 100, 'cycles', 4)    //  dictionary of parameters
)
| render linechart 
```
![](./images/samples/sine-demo.png)

Please send feedback and questions about this plugin to [Kusto Machine Learning](mailto:kustoML@microsoft.com).
We'd love to hear from you!
