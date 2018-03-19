## Identifier naming rules

Identifiers are used to name various entities. Legal names are case-sensitive,
up to 1024 characters long, and may contain letters, digits, and underscores (`_`).  
Additionally, entity names may include spaces (' '), dots (`.`), and dashes (`-`),
but then they may have to be quoted in certain scopes (such as data queries).
Identifiers that are identical to some query language
keywords also have to be quoted in certain scopes. For example: 

|Query text         |Comments                          |
|-------------------|----------------------------------|
| `entity`          |Entity names (`entity`) that do not include special characters or map to some language keyword require no quoting|
|`['entity-name']`  |Entity names that include special characters (here: `-`) must be quoted using `['` and `']` or using `["` and `"]`|
|`["where"]`        |Entity names that are language keywords must be quoted quoted using `['` and `']` or using `["` and `"]`|

Note: Some language-defined identifiers start with a dollar sign (`$`).
These are not allowed in user-defined identifiers.

## Naming your entities to avoid collisions with Kusto language keywords

As the Kusto query language includes a number of keywords that have the same
naming rules as identifiers, it is possible to have entity names that are actually
keywords, but then referring to these names becomes difficult (one must quote them).

Alternatively, one might want to choose entity names that are guaranteed to never
"collide" with a Kusto keyword. The following guarantees are made:

1. The Kusto query language will not define a keyword that starts with a capital letter (`A` to `Z`).
2. The Kusto query language will not define a keyword that starts with a single underscore (`_`).
3. The Kusto query language will not define a keyword that ends with a single underscore (`_`).

The Kusto query language reserves all identifiers that start or end with a
sequence of two underscore characters (`__`); users cannot define such names
for their own use.