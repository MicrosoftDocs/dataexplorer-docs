---
title: GQL Query Patterns, Examples, and Use Cases
description: GQL query patterns, examples, and common use case scenarios. Find out how to use MATCH, WHERE, and RETURN clauses to analyze graph relationships. GQL use cases alongside KQL. See how to build queries for security, social networks, and organizational analysis with step-by-step examples.
ms.reviewer: herauch
ms.topic: reference
ms.date: 08/24/2025

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---
# GQL query patterns, examples, and common scenarios (preview)

This article gives Graph Query Language examples focusing on core query patterns, and shows common real world use cases for GQL using realistic graph schemas and queries.

The following examples show the GQL syntax supported, from simple to complex patterns.

> [!NOTE]
>
> Before you try these examples, set up your environment to use GQL. See [Getting Started](graph-query-language.md#getting-started) for details. Ensure you set the client request properties to use GQL, and set the graph reference function to your graph data source.
>
> GQL support is in **preview**. Features and syntax can change based on feedback and ongoing development.

## Core GQL query patterns

[MATCH](#basic-pattern-matching-examples)

* [WHERE](#filter-by-properties-with-where): Use standard comparison and logical operators similar to KQL `where` clauses. `WHERE` clauses filter patterns based on node and edge properties. They work like KQL or SQL WHERE clauses but operate on graph patterns.

* [RETURN](#return-specific-properties)): Use `RETURN` statements to project results from matched patterns. They specify what data to output from your graph query.

* [Advanced patterns](#advanced-patterns-examples)

* [Complex multi-pattern queries](#complex-multi-pattern-examples)

* [Temporal data analysis with DURATION functions](#temporal-data-analysis-with-duration-functions)

For a full list of supported GQL functions and operators, see [Graph Query Language Functions](graph-query-language-functions.md).

## Basic pattern matching examples

### Basic pattern matching without variables

The simplest pattern matches any relationship without referencing the matched values.

<!-- csl -->
```gql
MATCH ()-[]-()
RETURN COUNT(*)
```

This query finds all relationships in the graph. The empty parentheses `()` represent anonymous nodes, and `[]` represents anonymous edges. Because we don't assign variables, we can only count the matches but can't access their properties.

### Pattern matching with variables

To access the matched nodes and edges, assign them to variables.

<!-- csl -->
```gql
MATCH (n)-[e]->(n2)
RETURN COUNT(*)
```

`n` represents the source node, `e` represents the _directed_ edge, and `n2` represents the target node. You reference these variables to access properties, but in this example you're still just counting matches.

### Access node properties

Once you have variables, you access properties of matched nodes.

<!-- csl -->
```gql
MATCH (person)-[e]->(target)
RETURN person.name, target.name, e.lbl
ORDER BY person.name
LIMIT 2
```

**Output**

This query returns the names of connected entities and the type of relationship between them, ordered by person.name and limited to two results to manage output size.
Although those entities are named `person` and `target`, there's no restriction that ensures they're actually a person.

| person.name | target.name | e.lbl |
|-------------|-------------|------------------|
| Alice       | TechCorp    | works_at        |
| Alice       | Seattle     | located_at      |

### Filter by node labels

Use labels to match specific types of nodes. Specify labels with a colon after the variable name.

<!-- csl -->
```gql
MATCH (person:Person)
RETURN person.name
ORDER BY person.name
LIMIT 5
```

**Output**

This query matches only nodes with the "Person" label and returns their names, limited to five results to avoid large result sets.

| person.name |
|-------------|
| Alice       |
| Bob         |
| Carol      |
| David      |
| Emma       |

### Filter by edge labels

<!-- csl -->
```gql
MATCH (person:Person)-[works:works_at]->(company:Company)
RETURN person.name, company.name
```

### Filter by edge labels without variables

For this example, switch back to the original G_Doc_Transient() graph, which has the "knows" relationship:

<!-- csl -->
```gql
#crp query_graph_reference=G_Doc_Transient()
```

Filter by edge labels without assigning the edge to a variable when you don't need to access its properties.

<!-- csl -->
```gql
MATCH (p1:Person)-[:knows]->(p2:Person)
RETURN p1.name, p2.name
ORDER BY p1.name
```

**Output**

This query finds Person nodes connected to other Person nodes through "knows" relationships. The edge is filtered by its label but isn't assigned to a variable because you only need the connected nodes.

| p1.name | p2.name |
|----------|----------|
| Alice    | Bob      |
| Bob      | Carol    |
| Carol    | David    |
| David    | Emma     |

### Filter by properties with WHERE

Use WHERE clauses to filter based on property values.

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.properties.age > 25
RETURN person.name, person.properties.age
```

This query finds people over 25 years old and returns their names and ages. The WHERE clause filters the matched nodes by the age property.

### Inline property filters

Filter by properties directly in the pattern using inline conditions.

<!-- csl -->
```gql
MATCH (person:Person {name: 'Bob'})
RETURN person.properties.age
```

This query finds the person named "Bob" and returns their age. The `{name: 'Bob'}` syntax filters nodes where the name property equals 'Bob'.

### Multiple inline conditions

Specify multiple property conditions inline.

<!-- csl -->
```gql
MATCH (person:Person {name: 'Bob'})
WHERE person.properties.age = 30
RETURN person as Bob
```

This query finds the person with both the specified name and age. It returns the person node as "Bob."

### Variable length paths

Use variable length path patterns with quantifiers for multi-hop relationships:

<!-- csl -->
```gql
MATCH (s)-[]->{1,3}(e)
RETURN s.name, e.name
```

This query finds paths with 1 to 3 hops. The `{1,3}` quantifier sets the minimum and maximum path length.

### Unbounded variable length paths

Specify open ranges for paths of variable length:

<!-- csl -->
```gql
MATCH (center)-[]->{1,}(connected)
WHERE center.name = 'Alice'
RETURN DISTINCT connected.name
```

This query finds all nodes you can reach from Alice through paths of one or more hops. The `{1,}` quantifier means "one or more hops."

### Path functions

Use path functions to extract information about the matched paths, including the nodes and relationships that make up the path:

<!-- csl -->
```gql
MATCH fof = (person)-[:knows]->{2,2}()
RETURN fof, NODES(fof) AS NodesOfPath, RELATIONSHIPS(fof) AS EdgesOfPath
LIMIT 1
```

This query finds paths exactly 2 hops long using the "knows" relationship. The path variable `fof` contains the entire path as an array of alternating nodes and edges. The `NODES()` function extracts just the nodes from the path, and `RELATIONSHIPS()` extracts just the edges.

**Output**

| fof | NodesOfPath | EdgesOfPath |
|-----|-------------|-------------|
| `[{"id": "p3", "lbl": "Person", "name": "Carol", "properties": {"age": 28}, "$labels": ["Person"]}, {"source": "p3", "target": "p4", "lbl": "knows", "since": 2022, "$labels": ["knows"]}, {"id": "p4", "lbl": "Person", "name": "David", "properties": {"age": 35}, "$labels": ["Person"]}, {"source": "p4", "target": "p5", "lbl": "knows", "since": 2023, "$labels": ["knows"]}, {"id": "p5", "lbl": "Person", "name": "Emma", "properties": {"age": 26}, "$labels": ["Person"]}]` | `[{"id": "p3", "lbl": "Person", "name": "Carol", "properties": {"age": 28}, "$labels": ["Person"]}, {"id": "p4", "lbl": "Person", "name": "David", "properties": {"age": 35}, "$labels": ["Person"]}, {"id": "p5", "lbl": "Person", "name": "Emma", "properties": {"age": 26}, "$labels": ["Person"]}]` | `[{"source": "p3", "target": "p4", "lbl": "knows", "since": 2022, "$labels": ["knows"]}, {"source": "p4", "target": "p5", "lbl": "knows", "since": 2023, "$labels": ["knows"]}]` |

## Basic property filtering

Filter nodes based on a single property condition:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.properties.age > 26
RETURN person.name, person.properties.age
ORDER BY person.name
```

**Output**

This query finds all `Person` nodes where the `age` property is greater than 26.

| person.name | person.properties.age |
|--------------|-------------|
| Bob          | 30          |
| Carol        | 28          |
| David        | 35          |

### Range filtering with AND

To create a range, combine multiple conditions:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.properties.age >= 28 AND person.properties.age <= 35
RETURN person.name, person.properties.age
```

This query shows people whose ages are between 28 and 35, inclusive.

### Edge property filtering

Filter by edge properties to find specific types of relationships.

<!-- csl -->
```gql
MATCH (person:Person)-[wa:works_at]->(c:Company)
WHERE wa.since >= 2022
RETURN person.name, c.name, wa.since
```

This query shows people who start working at companies in 2022 or later. It filters by the `since` property of the `works_at` relationship.

### String pattern matching

Use string functions to match text patterns.

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.name STARTS WITH 'Al'
RETURN COUNT(*)
```

This query counts people whose names start with 'Al'. It provides a quick summary without returning a large result set.

### String contains matching

Check if a string has a specific substring.

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.name CONTAINS 'i'
RETURN person.name
```

This query finds people whose names have 'i' anywhere in the string. This match is case sensitive.

### Inequality comparisons

Use comparison operators to exclude specific values:

<!-- csl -->
```gql
MATCH (person:Person)-[wa:works_at]->(company:Company)
WHERE person.properties.age > 25 AND company.name <> 'TechCorp'
RETURN person.name, company.name
```

This query shows people over 25 who work at companies other than 'TechCorp'.

### Null value checking

Check for the presence or absence of property values.

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.properties.age IS NOT NULL
RETURN person.name, person.properties.age
```

This query finds all people who have an age recorded (non-null age property).

### Logical OR operations

Use OR to match multiple conditions

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.properties.age > 30 OR person.name CONTAINS 'a'
RETURN person.name, person.properties.age
```

This query finds people who are over 30 years old or have 'a' in their name.

### Return specific properties

Return individual properties from matched nodes.

<!-- csl -->
```gql
MATCH (person:Person)
RETURN person.name, person.properties.age
```

This query returns the name and age properties for each Person node. Each row in the result shows these two values.

### Return with aliases

Use aliases to rename output columns for clarity.

<!-- csl -->
```gql
MATCH (person:Person)-[employment:works_at]->(company:Company)
RETURN person.name AS Employee, company.name AS Company, employment.since AS WorkingSince
```

This query returns employee names, company names, and employment start dates with descriptive column headers.

### Return property bags (JSON objects)

Create custom JSON objects by combining multiple properties in the RETURN clause.

<!-- csl -->
```gql
MATCH (person:Person)
RETURN {age: person.properties.age, name: person.name} AS myPropertyBag
LIMIT 1
```

**Output**

This query creates a custom JSON object (property bag) containing selected properties from matched Person nodes. The property bag combines the person's age and name into a single structured object.

| myPropertyBag |
|---|
| { "age": 28, "name": "Carol" } |

### Return entire nodes and edges

<!-- csl -->
```gql
MATCH (person:Person)-[e]->(company:Company)
WHERE person.name = 'Alice'
RETURN person, e, company
```

**Output**

This query returns the complete node and edge objects for Alice's relationship with companies, including all properties.

| person | e | company |
|--------|------|-------|
{"id":"p1","lbl":"Person","name":"Alice","properties":{"age": 25}} |{"source":"p1","target":"c1","lbl":"works_at","since":2020} | {"id":"c1","lbl":"Company","name":"TechCorp","properties":{}}

### Count matching patterns

Use COUNT(*) to count the number of pattern matches.

<!-- csl -->
```gql
MATCH (person:Person)-[:likes]->(p2:Person)
RETURN person.name, COUNT(*) AS LikesGiven
```

This query counts how many people each person likes and groups the results by person name.

### Aggregate with MIN and MAX

Find minimum and maximum values across all matches.

<!-- csl -->
```gql
MATCH (person:Person)
RETURN MIN(cast(person.properties.age as int)) AS Youngest, MAX(cast(person.properties.age as int)) AS Oldest
```

This query finds the youngest and oldest ages among all people in the graph.

### Collect values into arrays

Use COLLECT_LIST to gather multiple values into arrays.

<!-- csl -->
```gql
MATCH (person:Person)
RETURN COLLECT_LIST(person.name) AS AllNames
```

This query collects all person names into a single array.

### Return distinct values

Remove duplicates from your results.

<!-- csl -->
```gql
MATCH (person:Person)-[]->(company:Company)
RETURN DISTINCT company.name
```

This query returns each unique company name only once, even if multiple people are connected to the same company.

### Return ordered results

Sort your results using ORDER BY.

<!-- csl -->
```gql
MATCH (person:Person)
RETURN person.name, person.properties.age
ORDER BY cast(person.properties.age as int) DESC
```

This query returns people sorted by age in descending order, oldest first.

### Limit result count

Restrict the number of results returned.

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.properties.age > 25
RETURN person.name
ORDER BY cast(person.properties.age as int)
LIMIT 5
```

This query returns only the first five people over 25 years old, ordered by age.

**Comparable KQL:** Similar to KQL `project`, `summarize`, `sort`, and `take` operators.

## Advanced patterns examples

Advanced patterns let you match complex graph structures and label combinations.

### Label unions (OR)

Match nodes that have any of the specified labels:

<!-- csl -->
```gql
MATCH (entity:Person | Company)
RETURN entity
```

This query matches nodes that have either the "Person" or "Company" label. The pipe symbol `|` means logical OR for labels.

### Label intersections (AND)

Match nodes that have all of the specified labels:

<!-- csl -->
```gql
MATCH (person:Person & Male)
RETURN person.name
```

This query matches nodes that have both the "Person" and "Male" labels. The ampersand `&` means logical AND for labels.

### Label negation (NOT)

Match nodes that do NOT have the specified label:

<!-- csl -->
```gql
MATCH (person:!Female)
RETURN person.name
```

This query matches all nodes that don't have the "Female" label. The exclamation mark `!` means logical NOT for labels.

### Variable length paths with exact range

Match paths with a specific number of hops:

<!-- csl -->
```gql
MATCH (s)-[es]->{2,2}(e)
RETURN s, es, e
```

This query finds paths that are exactly two hops long. The `{2,2}` quantifier sets both minimum and maximum path length to 2.

### Variable length paths with open range

Match paths with a minimum number of hops but no maximum:

<!-- csl -->
```gql
MATCH (s)-[p]->{1,}(e)
RETURN s, e, p
```

This query finds paths that are one or more hops long. The `{1,}` quantifier means one or more hops with no upper limit.

### Zero-length paths

Match nodes with themselves (identity relationships):

<!-- csl -->
```gql
MATCH (n)-[]->{0,0}(same_n)
RETURN n
```

This query matches each node with itself through a zero-length path. The `{0,0}` quantifier sets the path length to zero, so each node is paired with itself.

### Named path variables

Assign entire paths to variables for later use:

<!-- csl -->
```gql
MATCH p = (person:Person)-[:works_at]->(company:Company)
RETURN p
```

This query assigns the entire pattern to the variable `p`, which you can return or use in other parts of the query. The path variable has the complete sequence of nodes and edges.

### Optional matching

Use `OPTIONAL MATCH` to find patterns that might not exist, returning empty values when patterns don't match:

<!-- csl -->
```gql
MATCH (p:Person)
    WHERE p.properties.age < 30
OPTIONAL MATCH (p)->(c:City)
    WHERE c.name <> 'Seattle' 
RETURN p.name as Person, c.name as City
```

This query finds all `Person` nodes where age is less than 30, and optionally matches cities they're connected to (excluding Seattle). If a person isn't connected to any city (or only to Seattle), the City column returns empty, but the person is still included in the results.

**Output**

The optional match ensures that people without city connections are still returned:

|Person|City|
|---|---|
|Carol|Portland|
|Emma|Portland|
|Alice||



### Multi-hop named paths

Create named paths that span multiple relationships:

<!-- csl -->
```gql
MATCH full_path = (s)-[first_edge]->(middle)-[second_edge]->(e)
RETURN full_path, s.name, e.name
```

This query creates a named path variable `full_path` that captures a two-hop pattern and returns specific properties from the s and e nodes.

**Comparable KQL:** Uses advanced `graph-match` operator features for complex pattern matching.

## Complex multi-pattern examples

### Cross product filtering with FILTER

When using multiple separate `MATCH` patterns, GQL creates a cross product of all matching combinations. The `FILTER` keyword allows you to filter this cross product based on conditions involving variables from different patterns.

This example shows how to filter the cross product of persons and cities:

<!-- csl -->
```gql
MATCH (p:Person)
MATCH (c:City)
FILTER p.name = 'Carol' or c.name = 'Seattle'
RETURN p.name as Person, c.name as City
LIMIT 2
```

**Output**

| Person | City |
|---|---|
| Carol | Portland |
| David | Seattle |

This query demonstrates how the `FILTER` keyword operates on the cross product of all Person nodes and all City nodes, returning only the combinations where either the person's name is 'Carol' or the city's name is 'Seattle'.

### Cross-town *likes* with company filter

This example combines multiple patterns and filters in one statement:

1. Find a pair of people where **p1 _likes_ p2**.
1. Link each person to their home city. p1's city name must **start with "San"**, and p2 must live in a **different city**.
1. Make sure p2 **works at TechCorp**.
1. Only include pairs where the two people have **different ages**.

The first `RETURN` shows every qualifying match—both people, their cities, and the company—so you can review the raw results.
The second `RETURN` aggregates all matches to output a single value: the **average age of all "liked" people** (p2) who meet these criteria.

<!-- csl -->
```gql
MATCH  (p1:Person)-[:likes]->(p2:Person),
       (p1)-[:located_at]->(home:City),
       (p2)-[:located_at]->(home2:City),
       (p2)-[:works_at]->(work:Company {name: 'TechCorp'})
WHERE  cast(p1.properties.age as int) <> cast(p2.properties.age as int) and home.name <> home2.name and home.name starts with 'San'
RETURN p1.name, p2.name, home.name, work.name, home2.name
```

**Output**

| p1.name | p2.name | home.name | work.name | home2.name |
|---------|---------|-----------|-----------|------------|
| David   | Alice   | San Francisco | TechCorp | Seattle    |

<!-- csl -->
```gql
MATCH  (p1:Person)-[:likes]->(p2:Person),
       (p1)-[:located_at]->(home:City),
       (p2)-[:located_at]->(home2:City),
       (p2)-[:works_at]->(work:Company {name: 'TechCorp'})
WHERE  cast(p1.properties.age as int) <> cast(p2.properties.age as int) and home.name <> home2.name and home.name starts with 'San'
RETURN AVG(cast(p2.properties.age as int)) AS AvgAgeLikedAcrossTowns
```

**Output**

| AvgAgeLikedAcrossTowns |
|---------------------|
| 25                  |

This example shows how GQL lets you express complex multi-pattern queries with cross-variable filtering, inline property matching, string pattern matching, and aggregation—all in one readable statement.

## Temporal data analysis with DURATION functions

GQL provides comprehensive support for temporal data analysis using duration functions. These functions enable you to perform time-based filtering, calculations, and comparisons on graph data with timestamps.

### Supported duration units

The `DURATION()` function supports a wide range of time units with flexible, case-insensitive syntax and returns a `timespan` object:

| Time Unit | Supported Names | Example | Timespan Output |
|-----------|----------------|---------|-----------------|
| **Days** | `days`, `day` | `DURATION({days: 7})` | `7.00:00:00` |
| **Hours** | `hours`, `hour`, `HOURS` | `DURATION({hours: 24})` | `1.00:00:00` |
| **Minutes** | `minutes`, `minute`, `MINUTES` | `DURATION({minutes: 30})` | `00:30:00` |
| **Seconds** | `seconds`, `second`, `SECONDS`, `secOnd` | `DURATION({seconds: 45})` | `00:00:45` |
| **Milliseconds** | `milliseconds`, `millisecond` | `DURATION({milliseconds: 500})` | `00:00:00.5000000` |
| **Microseconds** | `microseconds`, `microsecond`, `micRosecond` | `DURATION({microseconds: 1000})` | `00:00:00.0010000` |
| **Nanoseconds** | `nanoseconds`, `nanosecond`, `nanoSecond` | `DURATION({nanoseconds: 1000000})` | `00:00:00.0010000` |

You can combine multiple units in a single duration object: `DURATION({days: 1.8, minutes: 8, seconds: 7})` returns `1.00:08:07`.

### Complex temporal boundary analysis

Combine duration functions with timestamp arithmetic for precise temporal filtering:

<!-- csl -->
```gql
MATCH (system:System)-[event:generated]->(alert:Alert)
WHERE event.event_timestamp <= zoned_datetime("2012-01-01 08:00:00.0") + DURATION({days: 3})
    AND event.event_timestamp > zoned_datetime("2012-01-01 08:00:00.0") + DURATION({minutes: 1})
RETURN 
    system.name,
    alert.severity,
    event.event_timestamp,
    DURATION_BETWEEN(zoned_datetime("2012-01-01 08:00:00.0"), event.event_timestamp) AS time_since_baseline
ORDER BY event.event_timestamp
```

This query finds alerts generated within a specific time window (between 1 minute and 3 days after a baseline date) and calculates the duration between the baseline and each event.

**Output**

| system.name | alert.severity | event_timestamp | time_since_baseline |
|-------------|----------------|-----------------|---------------------|
| WebServer01 | Warning | 2012-01-01T08:01:30.0Z | 00:01:30 |
| Database02 | Critical | 2012-01-02T20:15:45.0Z | 1.12:15:45 |
| LoadBalancer | Info | 2012-01-04T16:30:00.0Z | 3.08:30:00 |

## Social networks use case: Friend recommendations

Social media platforms use GQL to suggest potential friends based on mutual relationships.  
We will be using the LDBC Social Network Benchmark dataset (see [GQL Sample Data](graph-sample-data.md#ldbc-snb-interactive)).  

1. Set up the graph reference to point to the LDBC dataset.

    <!-- csl -->
    ```gql
    #crp query_graph_reference=graph('LDBC_SNB_Interactive')
    ```

1. Find potential friends through mutual connections.

    <!-- csl: https://help.kusto.windows.net/database/Samples?graph_reference=graph('LDBC_SNB_Interactive') -->
    ```gql
    MATCH (p1:PERSON {firstName: 'Karl', lastName: 'Muller'})-[:KNOWS]-(p2:PERSON)-[:KNOWS]-(p3:PERSON),
          (p1)-[:IS_LOCATED_IN]-(c1:PLACE),
          (p3)-[:IS_LOCATED_IN]-(c1)
    WHERE p1.id <> p3.id
    RETURN DISTINCT p3.firstName, p3.lastName
    ```

**Output**

This query suggests friends for Karl who have mutual connections and live in the same location.

| p3.firstName | p3.lastName |
|---------------|--------------|
| Alfred       | Hoffmann     |
| Hans         | Becker       |
| Wilhelm     | Muller       |

## Related topics

* [Graph Query Language (GQL)](graph-query-language.md)
* [Graph Query Language (GQL) reference](graph-query-language-functions.md)
