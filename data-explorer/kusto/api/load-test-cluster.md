---
title: Evaluate query performance in your Azure Data Explorer cluster
description: In this article, you'll learn how to evaluate query performance in your Azure Data Explorer cluster.
ms.reviewer: sujosyul
ms.topic: how-to
ms.date: 09/11/2022
---

# Evaluate query performance in your cluster

Load testing is important to evaluate and ensure that your query performance meets you requirements.

In this article, we'll show you how to evaluate query performance in your cluster by sending concurrent or sequential queries using the Azure Data Explorer REST API.

## Prerequisites

- Permissions to create a service principal in your Azure Active Directory
- Permissions to grant the service principal *Viewer* role in your Azure Data Explorer database
- Your API unit testing tool must be able to retrieve a bearer token to authenticate against our REST API requests.

## Retrieve a bearer (authentication) token

1. [Create a service principal](../../grafana.md#create-a-service-principal) and make a note of the following information that you'll need later:
    - AppID or ClientID
    - TenantID
    - Secret

1. [Grant the service principal *Viewer* role](../../grafana.md#add-the-service-principal-to-the-viewers-role) in your database.

1. Create a *POST* request to `https://login.microsoftonline.com/<My_Tenant_id>/oauth2/v2.0/token?` using the TenantID you noted earlier. Send the POST request using your preferred tool with the following parameters:

    | Key | Value | Description |
    |--|--|--|
    | *grant_type* | client_credentials | The OAuth 2.0 grant type |
    | *client_id* | `<app-or-client-id>` | The appId or ClientID you noted earlier |
    | *client_secret* | `<client-secret>` | The secret you noted earlier |
    | *scope* | `https://\<cluster-name>.<region-name>.kusto.windows.net/.default` | The URI for your cluster. You can get the URI from the overview page of your Azure Data Explorer cluster. |

    > [!NOTE]
    > For Synapse Data Explorer pools, use `https://<pool-name>.kusto.azuresynapse.net/.default`. You can get the URI from the overview page of your Azure Synapse Data Explorer pool.

    The following image shows an example of the sending request parameters using Postman:

    :::image type="content" source="images/load-test/postman-header-config-1.png" alt-text="Screenshot of POST request, showing parameters.":::

1. Check the response body for the bearer token and copy it as you'll need later. The following image shows the response body using Postman.

    :::image type="content" source="images/load-test/postman-bearer-token.png" alt-text="Screenshot of POST request, showing the bearer token.":::

1. Test the bearer token by sending a request to the Azure Data Explorer REST API and verifying the response. Build the query using the following format: `<cluster-uri>/v2/rest/query`. You can get the cluster query URI from the overview page Azure Data Explorer cluster or Synapse Data Explorer pool. Send the POST request using your preferred tool with the following parameters in the header:

    | Key | Value | Description |
    |--|--|--|
    | *Accept* | application/json | The content type of the request |
    | *Authorization* | `<bearer-token>` | The bearer token you noted earlier |
    | *Accept-Encoding* | deflate | The compression format of the request |
    | *Content-Type* | application/json; charset=utf-8 | The content type indicating the media type of the request |
    | *Host* | `<cluster-name>.<region>.kusto.windows.net` | The cluster query URI without the protocol |
    | *x-ms-client-request-id* | `<uuid>` | A random UUID to identify the request. If you're using Postman, you can use Postman.Query to generate the UUID. |
    | *x-ms-user-id* | `<user-name>` | A user name for reference. We recommend specifying one as it's useful when tracing and Root Cause Analysis query performance. |
    | *x-ms-app* | `<app-name>` | A app name for reference. We recommend specifying one as it's useful when tracing and Root Cause Analysis query performance. |

    The following image shows an example of sending a request to the Azure Data Explorer REST API using Postman.

    :::image type="content" source="images/load-test/postman-header-config-2.png" alt-text="Screenshot of POST request, showing the parameters for the API request.":::

    In the body of the request, include the following:

    | Key | Description |
    |--|--|
    | *db* | The name of the database you want to query. |
    | *csl* | The Kusto query you want to run. The query must be sent as a string literal. If used, [encode string literals](../query/scalar-data-types/string.md#string-literals). We recommend verifying the query before you send it by testing it in the [web UI](../../web-query-data.md). |

    :::image type="content" source="images/load-test/postman-request.png" lightbox="images/load-test/postman-request.png" alt-text="Screenshot of POST request, showing the parameters for the body of the API request.":::

    In the response, you'll get a JSON object with the result of the query.

## Load testing

In this section, you'll learn how to load testing your cluster using the Azure Data Explorer REST API. You can use any load testing tools you prefer. The following steps will guide you through testing using Grafana k6 and Apache JMeter.

### Before you begin

Before you start load testing, consider the following:

- Size your cluster appropriately to achieve an optimal price/performance ratio. Running tests on undersized cluster will likely result in high query response times.
- Configure the load test to reflect the estimated queries/second that you intend to send to your cluster. For example, 1 query/second translates to 86400 queries/day.
- Scale out is triggered by sustained CPU usage, and query and ingestion operations. Therefore, you should consider the following when planning your load test:
    - Running a few short load tests that last a matter of minutes is unlikely to trigger your cluster to scale out.
    - Running load tests for longer periods can generate unnecessary load on the cluster that can potentially trigger a scale-out event and additional costs.

    Hence, configure your load tests appropriately. Typically, running a load test for 5 mins with 20 virtual users can generate 7 queries per second, which is equivalent to sending nearly 200,000 queries to your cluster in an 8-hour business day.
- Load tests are synthetic in nature. This means that all users from the same location send the same requests for a defined duration. Your real-life scenarios typically have users from many locations, sending different queries to your cluster. Bear this in ming when reviewing the results of the tests.

### [Grafana k6](#tab/grafana-k6)

Grafana k6 is an open-source tool built for load testing using JavaScript that integrates with many other tools such as Microsoft Visual Studio Code and GitHub.

#### Prerequisites for Grafana k6

- An IDE
- Grafana k6. Choose between using a local installation with unlimited tests ([k6.io](https://k6.io)) or the [k6 Cloud offering](https://app.k6.io)

#### Run load tests using Grafana k6

In the following steps, you'll run load tests using a local installation of Grafana k6 and the latest version of Microsoft Visual Studio Code.

1. In Visual Studio Code, create a file with the following JavaScript code:

    ```javascript
    import { sleep } from 'k6'
    import http from 'k6/http'

    export const options = {
      ext: {
        loadimpact: {
          distribution: { 'amazon:fr:paris': { loadZone: 'amazon:fr:paris', percent: 100 } },
          apm: [],
        },
      },
      thresholds: {},
      scenarios: {
        Scenario_1: {
          executor: 'constant-vus',
          gracefulStop: '30s',
          duration: '<duration-in-minutes>',
          vus: <number-of-users>,
          exec: 'scenario_1',
        },
      },
    }

    export function scenario_1() {
      let response;
      let authtoken = '<access_token>';

      response = http.post(
        '<cluster-uri>/v2/rest/query',
        '{\r\n  "db":"<database-name>",\r\n  "csl":"<kusto-query>",\r\n  "properties":"{\\"Options\\":{\\"queryconsistency\\":\\"strongconsistency\\"},\\"Parameters\\":{},\\"ClientRequestId\\":\\"k6.Query;<random-uuid>\\"}"\r\n}',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            Host: '<cluster-uri>',
            'Accept-Encoding': 'gzip',
            'x-ms-client-request-id': '<app-name>;<random-uuid>',
            'x-ms-user-id': '<user-name>',
            'x-ms-app': '<app-name>',
            Authorization:
              authtoken,
          },
        }
      )
      // Automatically added sleep
      sleep(1)
    }
    ```

    Use the following table to replace the placeholders in the code:

    | Parameter | Example value | Description |
    |--|--|--|
    | *duration* | 1m | The number of minutes for the load test to run |
    | *vus* | 20 | The number of virtual users to create for simulating the load |
    | *access_token* | `<bearer-token>` | The bearer token you noted earlier |
    | *cluster-uri* | `https://\<cluster-name>.<region-name>.kusto.windows.net/.default` | The URI for your cluster. You can get the URI from the overview page of your Azure Data Explorer cluster. |
    | *database-name* | Sampledb | The name of the database you want to query. |
    | *kusto-query* | "Tablename \| take 10" | The Kusto query you want to run. The query must be sent as a string literal. If used, [encode string literals](../query/scalar-data-types/string.md#string-literals). We recommend verifying the query before you send it by testing it in the [web UI](../../web-query-data.md). |
    | *random-uuid* | e9f884e4-90f0-404a-8e8b-01d883023bf1 | A random UUID to identify the request. Use any internet-based generator to generate a UUID. |
    | *Host* | `<cluster-name>.<region>.kusto.windows.net` | The cluster query URI. For Azure Synapse Data Explorer pools, use the relevant Data Explorer pool URI. |
    | *x-ms-client-request-id* | e9f884e4-90f0-404a-8e8b-01d883023bf1 | A random UUID to identify the request. If you're using Postman, you can use Postman.Query to generate the UUID. |
    | *x-ms-user-id* | `<domain/user-name>` | A user name for reference. We recommend specifying one as it's useful when tracing and Root Cause Analysis query performance. |
    | *x-ms-app* | k6 | A app name for reference. We recommend specifying one as it's useful when tracing and Root Cause Analysis query performance. |

    >[!TIP]
    >
    > - If you plan on including multiple queries in the same load test script, distinguish each query by including a query identifier in the client request ID. For example, to include the query identifier Q001, use the client request ID 'Q001; e9f884e4-90f0-404a-8e8b-01d883023bf1'. You can then use this identifier in to distinguish each query and the time it took to execute.
    > - Grafana k6 provides an option to configure complex load tests using the option() function. You can also create multiple scenarios in the same load test. With the Grafana k6 Cloud offering you can create, configure, and execute load tests.

1. In the Azure Data Explorer web UI, run the following query to [create a dashboard](../../azure-data-explorer-dashboards.md) to view performance results for queries run in the last hour.

    ```kusto
    .show queries
    | where StartedOn >=ago(1h)
    | where Application == "k6"
    | where Database == "<database-name>"
    | where State == "Completed"
    | summarize percentile(Duration, 95), avg(Duration), min(Duration), max(Duration), count() by Text
    | extend P95_seconds = format_timespan(percentile_Duration_95,"s.ff"), Avg_seconds = format_timespan(avg_Duration,"s.ff")
    | extend Min_seconds = format_timespan(min_Duration,"s.ff"), Max_seconds = format_timespan(max_Duration,"s.ff"), TotalExecutions = count_
    | project-away percentile_Duration_95, avg_Duration, min_Duration, max_Duration, count_
    ```

    The query results show the time it takes to execute all the requests sent by Grafana k6.

1. In Visual Studio Code, use PowerShell or Bash to run the script, as follows:

    >[!TIP]
    > Before starting a full test run, perform a small load test execution with 1-2 virtual users for 10 seconds. This will help you identify if there are any HTTP errors, or authentication or authorization issues before you launch the full load test run.

    ```powershell
    k6 run \<your-k6-test-script-file-name>.js
    ```

    The following image shows the command running and the progress bar showing the progress of the load test.

    :::image type="content" source="images/load-test/k6-run-config.png" alt-text="Screenshot of the load test running, showing the progress bar.":::

1. Once the load test completes, take a look at the results Grafana k6 results and web UI dashboard results. For information about Grafana k6 results, see [Metrics (k6.io)](https://k6.io/docs/using-k6/metrics#built-in-metrics).

    The following image shows the Grafana k6 results with the most important metrics highlighted.

    :::image type="content" source="images/load-test/k6-results.png" alt-text="Screenshot of the Grafana k6 results, highlighting the  most important metrics.":::

#### Troubleshoot Grafana k6 issues

The following is a list of the common issues you might encounter when using Grafana k6:

| Issue | Resolution |
|--|--|
| **Authentication** | The bearer token is valid for 3600 seconds normally. Always retrieve the latest token before running a test to avoid getting http authentication failure errors. |
| **Authorization** | Ensure that the service principal has the right *Viewer* role on the cluster database. |

### [JMeter](#tab/jmeter)

JMeter is an open-source Java tool designed to load test functional behavior and measure performance. You can use JMeter to analyze and measure the performance of a web application or other services.

#### Prerequisites for JMeter

- [Apache JMeter for Windows](https://jmeter.apache.org/download_jmeter.cgi). You can download, unzip, and run the JMeter `jmeter.bat` file from the unzipped folder without actually installing JMeter. For information about installing on a Mac, see [Apache JMeter on Mac](https://octoperf.com/blog/2017/10/26/how-to-install-jmeter-mac/).
- Install the JMeter plugin for Microsoft Azure. Download `jmeter-plugins-functions-azure-x.x.x.jar` from [JMeter Plugins]( https://github.com/pnopjp/jmeter-plugins/releases) and place it in the unzipped folder under *lib/ext*.

## Run load test using JMeter

In the following steps, you'll set up and run load tests using JMeter. You'll set up a thread group, an HTTP request, and run 10 parallel sessions of query executions.

1. In JMeter, right-click on the **Test Plan**, and select **Add** > **Threads (Users)** > **Thread Group**.

    :::image type="content" source="images/load-test/jmeter-thread-group-add.png" alt-text="Screenshot of JMeter test plan, showing the creation of a new thread group.":::

1. Configure the properties for the thread group using the following information:

    | Property | Description |
    |--|--|
    | *Name* | The name for the thread group |
    | *Number of Threads (users)* | The number of parallel sessions (simulating users) for running the query |
    | *Loop Count* | The number of times the query should. The loops are run sequentially, not in parallel. |
    | Same user on each iteration | Runs the query as same user on each iteration. uses the query and results cache from the source. |

    For example, to run a query 10 times in parallel, set the *Number of Threads* to 10 and *Loop Count* to 1. To run a query 10 times in sequence, set the *Number of Threads* to 1 and *Loop Count* to 10.

    :::image type="content" source="images/load-test/jmeter-thread-group-properties.png" lightbox="images/load-test/jmeter-thread-group-properties.png" alt-text="Screenshot of the thread group, showing the properties of the thread group.":::

1. Right-click on the thread group and select **Add** > **Sampler** > **HTTP Request**.

    :::image type="content" source="images/load-test/jmeter-http-request-add.png" alt-text="Screenshot of the thread group, showing the addition of an HTTP request.":::

1. Configure the HTTP request to use the *POST* method and fill out the properties using the following information:

    | Property | Description |
    |--|--|
    | *Server Name or IP* | The URI for your cluster. You can get the URI from the overview page of your Azure Data Explorer cluster. The URI is in the format `https://<cluster-name>.<region>.kusto.windows.net`. |
    | *Path* | The API endpoint path to run the query. Specify the path as `/v2/rest/query`. |

    In the body of the request, include the following:

    | Key | Description |
    |--|--|
    | *db* | The name of the database you want to query. |
    | *csl* | The Kusto query you want to run. The query must be sent as a string literal. If used, [encode string literals](../query/scalar-data-types/string.md#string-literals). We recommend verifying the query before you send it by testing it in the [web UI](../../web-query-data.md). |

    :::image type="content" source="images/load-test/jmeter-http-request-properties.png" lightbox="images/load-test/jmeter-http-request-properties.png" alt-text="Screenshot of POST request, showing the body properties and the parameters of the API request.":::

1. Right-click on the HTTP Request and select **Add** > **Config Element** > **Http Header Manager**.

    :::image type="content" source="images/load-test/jmeter-http-header-add.png" alt-text="Screenshot of the HTTP request, showing the addition of an HTTP header.":::

1. Configure the HTTP header using the following information:

    | Key | Value | Description |
    |--|--|--|
    | *Accept* | application/json | The content type of the request |
    | *Authorization* | `<bearer-token>` | The bearer token you noted earlier |
    | *Accept-Encoding* | deflate | The compression format of the request |
    | *Content-Type* | application/json; charset=utf-8 | The content type indicating the media type of the request |
    | *Host* | `<cluster-name>.<region>.kusto.windows.net` | The cluster query URI without the protocol |
    | *x-ms-client-request-id* | `<uuid>` | A random UUID to identify the request. If you're using Postman, you can use Postman.Query to generate the UUID. |
    | *x-ms-user-id* | `<user-name>` | A user name for reference. We recommend specifying one as it's useful when tracing and Root Cause Analysis query performance. |
    | *x-ms-app* | `<app-name>` | A app name for reference. We recommend specifying one as it's useful when tracing and Root Cause Analysis query performance. |

    :::image type="content" source="images/load-test/jmeter-http-header-properties.png" alt-text="Screenshot of the HTTP Header, showing the configured properties.":::

1. Add the following output reports:

    > [!NOTE]
    > Output reports show the HTTP response for each request and multiple aggregated reports like 95th percentile, min, max times, throughput, and more. These reports can be added to thread groups, HTTP requests, and the Test Plan.

    1. Add listeners to the Test Plan to see the results of the execution: Right-click on the Test Plan and select **Add** > **Listener** > **View Results Tree**.
    2. Add an aggregated report to the result view: Right-click on the Test Plan and select **Add** > **Listener** > **Aggregate Report**.

    :::image type="content" source="images/load-test/jmeter-output-reports.png" alt-text="Screenshot of the Test Plan, showing the addition of output reports.":::

1. In JMeter, select the play button to run the tests.

    > [!TIP]
    > You can observe the HTTP requests, responses, and aggregate report in real time.

1. In the view results tree report, select HTTP requests to view their test results including the response header and body.

    :::image type="content" source="images/load-test/jmeter-results-tree.png" lightbox="images/load-test/jmeter-results-tree.png" alt-text="Screenshot of the view results tree report, showing the response headers.":::

1. In the aggregate report, you can see the overall results of the test including the number samples, the avg response time in milliseconds, the percentage of errors, and the throughput in requests per second.

    :::image type="content" source="images/load-test/jmeter-results.png" alt-text="Screenshot of the aggregate report, showing the overall test results.":::

> [!NOTE]
>
> - Consider running multiple rounds of tests with different concurrency, variety, and sequence to better approximate actual use in your environment.
> - When running the test from your local machine, make sure to account for the latency from your machine to your cluster that may be located in another region.
> - When running the test from a virtual machine, make sure to account for the latency resulting from the size and region of the virtual machine.

> [!TIP]
> You can save the test as a `.jmx` file and use it in Azure Load Testing. Do so enables you to automate, schedule, and report on the test run against your cluster. For more information, see [Create a JMeter-based load test](/azure/load-testing/how-to-create-and-run-load-test-with-jmeter-script).

---

## Next steps

- [Query limits](../concepts/querylimits.md)
- [Optimize for high concurrency](../../high-concurrency.md)
- [Query best practices](../query/best-practices.md)