---
title: #Required; Keep the title body to 60-65 chars max including spaces and brand
description: #Required; Keep the description within 100- and 165-characters including spaces 
author: #Required; your GitHub user alias, with correct capitalization
ms.author: #Required; microsoft alias of author
ms.service: #Required; use the name-string related to slug in ms.product/ms.service
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---
# Core GQL query patterns and examples

GQL in Azure Data Explorer implements the standard GQL syntax for graph pattern matching. The following examples show the GQL syntax supported in Azure Data Explorer, building from simple to complex patterns.

* [MATCH](#basic-pattern-matching-without-variables): The `MATCH` clause defines the graph patterns you want to find. Let's start with the most basic patterns and build complexity gradually. Similar functionality is achieved using the `graph-match` operator in KQL.

* [WHERE](#basic-property-filtering): Uses standard comparison and logical operators similar to KQL `where` clauses. `WHERE` clauses filter patterns based on node and edge properties.  They work similarly to KQL or SQL WHERE clauses but operate on graph patterns.

* [RETURN](#return-specific-properties): `RETURN` statements project results from matched patterns. They specify what data to output from your graph query.

* [Advanced patterns](#examples-advanced-patterns-and-complex-multi-patterns)

* [Complex multi-pattern queries](#complex-multi-pattern-queries): Complex multi-pattern queries let you combine multiple patterns and filters in a single statement, enabling sophisticated graph analysis.

## Example: Basic pattern matching without variables

The simplest pattern matches any relationship without referencing the matched values:

<!-- csl -->
```gql
MATCH ()-[]-()
RETURN COUNT(*)
```

This query finds all relationships in the graph. The empty parentheses `()` represent anonymous nodes, and `[]` represents anonymous edges. Since we don't assign variables, we can only count the matches but not access their properties.

## Example: Pattern matching with variables

To access the matched nodes and edges, assign them to variables:

<!-- csl -->
```gql
MATCH (n)-[e]->(n2)
RETURN COUNT(*)
```

Now `n` represents the source node, `e` represents the _directed_ edge, and `n2` represents the target node. We can reference these variables to access properties, but in this example we're still just counting matches.

## Example: Access node properties

Once you have variables, you can access properties of matched nodes:

<!-- csl -->
```gql
MATCH (person)-[e]->(target)
RETURN person.name, target.name, e.lbl
ORDER BY person.name
LIMIT 2
```

**Output**

This query returns the names of connected entities and the type of relationship between them, ordered by person.name and limited to two results to manage output size.
Although we name those entities `person` and `target`, we don't have any restriction in place that makes sure that they are, in fact, a person.

| person.name | target.name | e.lbl |
|-------------|-------------|------------------|
| Alice       | TechCorp    | works_at        |
| Alice       | Seattle     | located_at      |

## Example: Filter by node labels

Use labels to match specific types of nodes. Labels are specified with a colon after the variable name:

<!-- csl -->
```gql
MATCH (person:Person)
RETURN person.name
LIMIT 5
```

**Output**

This query matches **only nodes with the "Person" label** and returns their names, limited to 5 results to avoid large result sets.

| person.name |
|-------------|
| Alice       |
| Bob         |
| Carol      |
| David      |
| Emma       |

## Example: Filter by edge labels

<!-- csl -->
```gql
MATCH (person:Person)-[works:works_at]->(company:Company)
RETURN person.name, company.name
```

### Filter by edge labels without variables

For this example, let's switch back to our original G() graph, which contains the "knows" relationship:

<!-- csl -->
```gql
#crp query_graph_reference=G()
```

You can filter by edge labels without assigning the edge to a variable when you don't need to access its properties.

<!-- csl -->
```gql
MATCH (p1:Person)-[:knows]->(p2:Person)
RETURN p1.name, p2.name
```

**Output**

This query finds Person nodes connected to other Person nodes through "knows" relationships. The edge is filtered by its label but not assigned to a variable since we only need the connected nodes.

| p1.name | p2.name |
|----------|----------|
| Alice    | Bob      |
| Bob      | Carol    |
| Carol    | David    |
| David    | Emma     |

## Example: Filter by properties with WHERE

Use WHERE clauses to filter based on property values:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.age > 25
RETURN person.name, person.age
```

This query finds people over 25 years old and returns their names and ages. The WHERE clause filters the matched nodes based on the age property.

## Example: Inline property filters

You can also filter by properties directly in the pattern using inline conditions:

<!-- csl -->
```gql
MATCH (person:Person {name: 'Bob'})
RETURN person.age
```

This query finds the specific person named "Bob" and returns their age. The `{name: 'Bob'}` syntax filters for nodes where the name property equals 'Bob'.

## Example: Multiple inline conditions

You can specify multiple property conditions inline:

<!-- csl -->
```gql
MATCH (person:Person {name: 'Bob', age: 30})
RETURN person as Bob
```

This query finds the person with both the specified name and age. It returns the person node as "Bob".

## Example: Variable length paths

For multi-hop relationships, use variable length path patterns with quantifiers:

<!-- csl -->
```gql
MATCH (s)-[]->{1,3}(e)
RETURN s.name, e.name
```

This query finds paths that include between 1 to 3 hops. The `{1,3}` quantifier specifies the minimum and maximum path length.

## Example: Unbounded variable length paths

For paths of variable length, you can specify open ranges:

<!-- csl -->
```gql
MATCH (center)-[]->{1,}(connected)
WHERE center.name = 'Alice'
RETURN DISTINCT connected.name
```

This query finds all nodes reachable from Alice through paths of one or more hops. The `{1,}` quantifier means "one or more hops".

## Example: Basic property filtering

Filter nodes based on a single property condition:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.age > 26
RETURN person.name, person.age
```

**Output**

This query finds all Person nodes where the age property is greater than 26.

| person.name | person.age |
|--------------|-------------|
| Bob          | 30          |

## Example: Range filtering with AND

To create ranges, cCombine multiple conditions:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.age >= 28 AND person.age <= 35
RETURN person.name, person.age
```

This query finds people with ages between 28 and 35 (inclusive).

## Example: Edge property filtering

Filter based on edge properties to find specific types of relationships:

<!-- csl -->
```gql
MATCH (person:Person)-[wa:works_at]->(c:Company)
WHERE wa.since >= 2022
RETURN person.name, c.name, wa.since
```

This query finds people who started working at companies since 2022 or later, filtering based on the `since` property of the `works_at` relationship.

## Example: String pattern matching

Use string functions to match text patterns:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.name STARTS WITH 'Al'
RETURN COUNT(*)
```

This query counts how many people have names that start with 'Al', providing a quick summary without returning potentially large result sets.

### String contains matching

Check if a string contains a specific substring:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.name CONTAINS 'i'
RETURN person.name
```

This query finds all people whose names contain 'i' anywhere in the string.
This is case-sensitive.

## Example: Inequality comparisons

Use comparison operators to exclude specific values:

<!-- csl -->
```gql
MATCH (person:Person)-[wa:works_at]->(company:Company)
WHERE person.age > 25 AND company.name <> 'TechCorp'
RETURN person.name, company.name
```

This query finds people over 25 who work at companies other than 'TechCorp'.

## Example: Null value checking

Check for the presence or absence of property values:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.age IS NOT NULL
RETURN person.name, person.age
```

This query finds all people who have an age recorded (non-null age property).

## Example: Logical OR operations

Use OR to match multiple conditions:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.age > 30 OR person.name CONTAINS 'a'
RETURN person.name, person.age
```

This query finds people who are either over 30 years old OR have 'a' in their name.

## Example: Return specific properties

Return individual properties from matched nodes:

<!-- csl -->
```gql
MATCH (person:Person)
RETURN person.name, person.age
```

This query returns the name and age properties of all Person nodes. Each row in the result contains these two values.

### Return with aliases

Use aliases to rename output columns for clarity:

<!-- csl -->
```gql
MATCH (person:Person)-[employment:works_at]->(company:Company)
RETURN person.name AS Employee, company.name AS Company, employment.since AS WorkingSince
```

This query returns actor names, movie titles, and character names with descriptive column headers.

### Return entire nodes and edges

<!-- csl -->
```gql
MATCH (person:Person)-[e]->(movie:Movie)
WHERE person.name = 'Kevin Bacon'
RETURN person, e, movie
```

**Output**

This query returns the complete node and edge objects for Kevin Bacon's relationships, including all properties.

| person | e | movie |
|--------|------|-------|
{"id":"2","lbl":"Person","name":"Kevin Bacon","title":"","born":1958} |	{"source":"2","target":"3","lbl":"ACTED_IN","Role":"Jack Swigert"} | {"id":"3","lbl":"Movie","name":"","title":"Apollo 13","born":1995}

## Example: Count matching patterns

Use COUNT(*) to count the number of pattern matches:

<!-- csl -->
```gql
MATCH (person:Person)-[:ACTED_IN]->(movie:Movie)
RETURN person.name, COUNT(*) AS MovieCount
```

This query counts how many movies each person acted in and groups the results by person name.

### Aggregate with MIN and MAX

Find minimum and maximum values across all matches:

<!-- csl -->
```gql
MATCH (person:Person)
RETURN MIN(person.age) AS Youngest, MAX(person.age) AS Oldest
```

This query finds the earliest and latest birth years among all people in the graph.

### Collect values into arrays

Use COLLECT_LIST to gather multiple values into arrays:

<!-- csl -->
```gql
MATCH (person:Person)
RETURN COLLECT_LIST(person.name) AS AllNames
```

This query collects all person names into a single array result.

## Example: Return distinct values

Remove duplicates from your results:

<!-- csl -->
```gql
MATCH (person:Person)-[]->(company:Company)
RETURN DISTINCT company.name
```

This query returns each unique movie title only once, even if multiple people are connected to the same movie.

### Order results

Sort your results using ORDER BY:

<!-- csl -->
```gql
MATCH (person:Person)
RETURN person.name, person.age
ORDER BY person.age DESC
```

This query returns people sorted by age in descending order (oldest first).

### Limit result count

Restrict the number of results returned:

<!-- csl -->
```gql
MATCH (person:Person)
WHERE person.age > 25
RETURN person.name
ORDER BY person.age
LIMIT 5
```

This query returns only the first five people over 25 years old, ordered by age.

**Comparable KQL:** Similar to KQL `project`, `summarize`, `sort`, and `take` operators.

## Examples: Advanced patterns

Advanced patterns provide powerful ways to match complex graph structures and label combinations.

### Label unions (OR)

Match nodes that have any of the specified labels:

<!-- csl -->
```gql
MATCH (entity:Person | Movie)
RETURN entity
```

This query matches nodes that have either the "Person" OR "Movie" label. The pipe symbol `|` represents logical OR for labels.

### Label intersections (AND)

Match nodes that have all of the specified labels:

<!-- csl -->
```gql
MATCH (person:Person & Male)
RETURN person.name
```

This query matches nodes that have both the "Person" AND "Male" labels. The ampersand `&` represents logical AND for labels.

### Label negation (NOT)

Match nodes that do NOT have the specified label:

<!-- csl -->
```gql
MATCH (person:!Female)
RETURN person.name
```

This query matches all nodes that do NOT have the "Female" label. The exclamation mark `!` represents logical NOT for labels.

### Variable length paths with exact range

Match paths with a specific number of hops:

<!-- csl -->
```gql
MATCH (s)-[es]->{2,2}(e)
RETURN s, es, e
```

This query finds paths that are exactly two hops long. The `{2,2}` quantifier specifies both minimum and maximum path length as 2.

### Variable length paths with open range

Match paths with a minimum number of hops but no maximum:

<!-- csl -->
```gql
MATCH (s)-[p]->{1,}(e)
RETURN s, e, p
```

This query finds paths that are 1 or more hops long. The `{1,}` quantifier means "one or more hops" with no upper limit.

### Zero-length paths

Match nodes with themselves (identity relationships):

<!-- csl -->
```gql
MATCH (n)-[]->{0,0}(same_n)
RETURN n
```

This query matches each node with itself through a zero-length path. The `{0,0}` quantifier specifies exactly zero hops, effectively returning each node paired with itself.

### Named path variables

Assign entire paths to variables for later use:

<!-- csl -->
```gql
MATCH p = (person:Person)-[:DIRECTED]->(movie:Movie)
RETURN p
```

This query assigns the entire pattern to the variable `p`, which can then be returned or used in other parts of the query. The path variable contains the complete sequence of nodes and edges.

### Multi-hop named paths

Create named paths that span multiple relationships:

<!-- csl -->
```gql
MATCH full_path = (s)-[first_edge]->(middle)-[second_edge]->(e)
RETURN full_path, s.name, e.name
```

This query creates a named path variable `full_path` that captures a 2-hop pattern, while also returning specific properties from the s and e nodes.

**Comparable KQL:** Uses advanced `graph-match` operator features for complex pattern matching.

## Examples: Complex multi-pattern – cross-town "likes" with company filter

This query ties together multiple patterns and filters in a single statement:

1. Find a pair of people where **p1 _likes_ p2**.
2. Link each person to their home city, requiring that p1's city name **starts with "San"** while p2 lives in a **different city**.
3. Ensure p2 **works at TechCorp**.
4. Keep only pairs where the two people have **different ages**.

The first `RETURN` lists every qualifying match – both people, their cities, and the company – so you can inspect the raw results.
The second `RETURN` then aggregates across all matches to output a single scalar: the **average age of all "liked" people** (p2) who meet these criteria.

<!-- csl -->
```gql
MATCH  (p1:Person)-[:likes]->(p2:Person),
       (p1)-[:located_at]->(home:City),
       (p2)-[:located_at]->(home2:City),
       (p2)-[:works_at]->(work:Company {name: 'TechCorp'})
WHERE  p1.age <> p2.age and home.name <> home2.name and home.name starts with 'San'
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
WHERE  p1.age <> p2.age and home.name <> home2.name and home.name starts with 'San'
RETURN AVG(p2.age) AS AvgAgeLikedAcrossTowns
```

**Output**

| AvgAgeLikedAcrossTowns |
|---------------------|
| 25                  |

This example demonstrates GQL's ability to express complex multi-pattern queries with cross-variable filtering, inline property matching, string pattern matching, and aggregation—all in a single, readable statement.

## Common GQL use case examples 

This section shows common real-world use cases for GQL in Azure Data Explorer using realistic graph schemas and queries.

### Security use case - attack path analysis

Security analysts use GQL to find potential attack paths in network infrastructure and access control systems.

1. Create a security graph function:

    <!-- csl -->
    ```gql
    .create-or-alter function SecurityGraph() {
        let entities = datatable(id:string, lbl:string, name:string, type:string, criticality:string)
        [
            "u1", "User", "john.doe", "StandardUser", "Low",
            "u2", "User", "admin.user", "Administrator", "High", 
            "s1", "System", "web-server", "WebServer", "Medium",
            "s2", "System", "database", "Database", "Critical",
            "s3", "System", "domain-controller", "DomainController", "Critical"
        ];
        let relationships = datatable(source:string, target:string, lbl:string, access_type:string)
        [
            "u1", "s1", "CAN_ACCESS", "HTTP",
            "s1", "s2", "CAN_ACCESS", "SQL",
            "u2", "s3", "CAN_ACCESS", "RDP",
            "s3", "s2", "CAN_ACCESS", "Direct"
        ];
        relationships
        | make-graph source --> target with entities on id
    }
    ```

1. Set up the security graph:

    <!-- csl -->
    ```gql
    #crp query_graph_reference=SecurityGraph()
    ```

1. Find potential attack paths to critical systems.

    <!-- csl -->
    ```gql
    MATCH (user:User)-[]->{1,3}(critical:System)
    WHERE critical.criticality = 'Critical'
    RETURN user.name AS AttackOrigin, critical.name AS CriticalTarget, COUNT(*) AS PathCount
    ```

**Output**

This query finds users who can reach critical systems within three hops, so security teams can prioritize access reviews.

| AttackOrigin | CriticalTarget | PathCount |
|--|--|--|
| admin.user | domain-controller | 1 |
| john.doe | database | 1 |
| admin.user | database | 1 |

### Social networks use case: Friend recommendations

Social media platforms use GQL to find potential friend connections based on mutual relationships.

1. Create a social network graph.

    <!-- csl -->
    ```gql
    .create-or-alter function SocialGraph() {
        let entities = datatable(id:string, lbl:string, name:string, location:string, interests:string)
        [
            "p1", "Person", "Alice Johnson", "Seattle", "Technology,Travel",
            "p2", "Person", "Bob Smith", "Seattle", "Sports,Technology", 
            "p3", "Person", "Carol Davis", "Portland", "Travel,Photography",
            "p4", "Person", "David Wilson", "Seattle", "Technology,Gaming",
            "p5", "Person", "Emma Brown", "Portland", "Photography,Art"
        ];
        let relationships = datatable(source:string, target:string, lbl:string, strength:string)
        [
            "p1", "p2", "FRIENDS_WITH", "Close",
            "p1", "p3", "FRIENDS_WITH", "Medium",
            "p2", "p4", "FRIENDS_WITH", "Close",
            "p3", "p5", "FRIENDS_WITH", "Medium"
        ];
        relationships
        | make-graph source --> target with entities on id
    }
    ```

1. Set up the social graph:

    <!-- csl -->
    ```gql
    #crp query_graph_reference=SocialGraph()
    ```

1. Find potential friends through mutual connections.

    <!-- csl -->
    ```gql
    MATCH (person:Person)-[:FRIENDS_WITH]->(mutual:Person)-[:FRIENDS_WITH]->(potential:Person)
    WHERE person.name = 'Alice Johnson' AND person.location = potential.location
    RETURN potential.name AS SuggestedFriend, mutual.name AS MutualFriend, potential.interests AS CommonInterests
    ```

**Output**

This query suggests friends for Alice who have mutual connections and live in the same location.

| SuggestedFriend | MutualFriend | CommonInterests |
|--|--|--|
| David Wilson | Bob Smith | Technology,Gaming |

### Organization use case: Management hierarchy

Organizations use GQL to analyze reporting structures and find management chains.

Create an organizational graph.

<!-- csl -->
```gql
.create-or-alter function OrgChart() {
    let entities = datatable(id:string, lbl:string, name:string, title:string, department:string, level:int)
    [
        "e1", "Employee", "Satya Nadella", "CEO", "Executive", 1,
        "e2", "Employee", "Amy Hood", "CFO", "Finance", 2,
        "e3", "Employee", "Brad Smith", "President", "Legal", 2,
        "e4", "Employee", "Scott Guthrie", "EVP", "Cloud", 2,
        "e5", "Employee", "Finance Director", "Director", "Finance", 3,
        "e6", "Employee", "Cloud Architect", "Principal", "Cloud", 3,
        "e7", "Employee", "Senior Engineer", "Senior", "Cloud", 4,
        "e8", "Employee", "Software Engineer", "L63", "Cloud", 5
    ];
    let relationships = datatable(source:string, target:string, lbl:string)
    [
        "e2", "e1", "REPORTS_TO", 
        "e3", "e1", "REPORTS_TO",
        "e4", "e1", "REPORTS_TO", 
        "e5", "e2", "REPORTS_TO",
        "e6", "e4", "REPORTS_TO",
        "e7", "e6", "REPORTS_TO",
        "e8", "e7", "REPORTS_TO"
    ];
    relationships
    | make-graph source --> target with entities on id
}
```

Set up the org chart:

<!-- csl -->
```gql
#crp query_graph_reference=OrgChart()
```

Find all managers three levels down from CEO.

<!-- csl -->
```gql
MATCH (ceo:Employee)-[:REPORTS_TO]-{0,3}(manager:Employee)
WHERE ceo.title = 'CEO' AND manager.level <= 4
RETURN manager.name AS ManagerName, manager.title AS Title, manager.department AS Department
ORDER BY manager.level
```

This query finds all employees within three management levels of the CEO, which helps with organizational analysis and communication planning.
