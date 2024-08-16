---
title:  Scalar Functions 
description: Learn how to use scalar functions to perform calculations that return a single value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/23/2023
---
# Scalar function types at a glance

This article lists all available scalar functions grouped by type. For aggregation functions, see [Aggregation function types](aggregation-functions.md).

## Binary functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[binary_and()](binary-and-function.md)|Returns a result of the bitwise and operation between two values.|
|[binary_not()](binary-not-function.md)|Returns a bitwise negation of the input value.|
|[binary_or()](binary-or-function.md)|Returns a result of the bitwise or operation of the two values.|
|[binary_shift_left()](binary-shift-left-function.md)|Returns binary shift left operation on a pair of numbers: a << n.|
|[binary_shift_right()](binary-shift-right-function.md)|Returns binary shift right operation on a pair of numbers: a >> n.|
|[binary_xor()](binary-xor-function.md)|Returns a result of the bitwise xor operation of the two values.|
|[bitset_count_ones()](bitset-count-ones-function.md)|Returns the number of set bits in the binary representation of a number.|

## Conversion functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[tobool()](tobool-function.md)|Convert inputs to boolean (signed 8-bit) representation.|
|[todatetime()](todatetime-function.md)|Converts input to datetime scalar.|
|[todouble()](todouble-function.md)|Converts the input to a value of type real.|
|[tostring()](tostring-function.md)|Converts input to a string representation.|
|[totimespan()](totimespan-function.md)|Converts input to timespan scalar.|

## DateTime/timespan functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[ago()](ago-function.md)|Subtracts the given timespan from the current UTC clock time.|
|[datetime_add()](datetime-add-function.md)|Calculates a new datetime from a specified datepart multiplied by a specified amount, added to a specified datetime.|
|[datetime_diff()](datetime-diff-function.md)|Returns the end of the year containing the date, shifted by an offset, if provided.|
|[datetime_local_to_utc()](datetime-local-to-utc-function.md) |  Converts local datetime to UTC datetime using [a time-zone specification](../query/timezone.md).
|[datetime_part()](datetime-part-function.md)|Extracts the requested date part as an integer value.|
| [datetime_utc_to_local()](datetime-utc-to-local-function.md) | Converts UTC datetimgoe to local datetime using a [time-zone specification](../query/timezone.md).
|[dayofmonth()](day-of-month-function.md)|Returns the integer number representing the day number of the given month.|
|[dayofweek()](day-of-week-function.md)|Returns the integer number of days since the preceding Sunday, as a timespan.|
|[dayofyear()](day-of-year-function.md)|Returns the integer number represents the day number of the given year.|
|[endofday()](endofday-function.md)|Returns the end of the day containing the date, shifted by an offset, if provided.|
|[endofmonth()](endofmonth-function.md)|Returns the end of the month containing the date, shifted by an offset, if provided.|
|[endofweek()](endofweek-function.md)|Returns the end of the week containing the date, shifted by an offset, if provided.|
|[endofyear()](endofyear-function.md)|Returns the end of the year containing the date, shifted by an offset, if provided.|
|[format_datetime()](format-datetime-function.md)|Formats a datetime parameter based on the format pattern parameter.|
|[format_timespan()](format-timespan-function.md)|Formats a format-timespan parameter based on the format pattern parameter.|
|[getyear()](getyear-function.md)|Returns the year part of the datetime argument.|
|[hourofday()](hour-of-day-function.md)|Returns the integer number representing the hour number of the given date.|
|[make_datetime()](make-datetime-function.md)|Creates a datetime scalar value from the specified date and time.|
|[make_timespan()](make-timespan-function.md)|Creates a timespan scalar value from the specified time period.|
|[monthofyear()](monthofyear-function.md)|Returns the integer number that represents the month number of the given year.|
|[now()](now-function.md)|Returns the current UTC clock time, optionally offset by a given timespan.|
|[startofday()](startofday-function.md)|Returns the start of the day containing the date, shifted by an offset, if provided.|
|[startofmonth()](startofmonth-function.md)|Returns the start of the month containing the date, shifted by an offset, if provided.|
|[startofweek()](startofweek-function.md)|Returns the start of the week containing the date, shifted by an offset, if provided.|
|[startofyear()](startofyear-function.md)|Returns the start of the year containing the date, shifted by an offset, if provided.|
|[todatetime()](todatetime-function.md)|Converts input to datetime scalar.|
|[totimespan()](totimespan-function.md)|Converts input to timespan scalar.|
|[unixtime_microseconds_todatetime()](unixtime-microseconds-todatetime-function.md)|Converts unix-epoch microseconds to UTC datetime.|
|[unixtime_milliseconds_todatetime()](unixtime-milliseconds-todatetime-function.md)|Converts unix-epoch milliseconds to UTC datetime.|
|[unixtime_nanoseconds_todatetime()](unixtime-nanoseconds-todatetime-function.md)|Converts unix-epoch nanoseconds to UTC datetime.|
|[unixtime_seconds_todatetime()](unixtime-seconds-todatetime-function.md)|Converts unix-epoch seconds to UTC datetime.|
|[weekofyear()](week-of-year-function.md)|Returns an integer representing the week number.|

## Dynamic/array functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[array_concat()](array-concat-function.md)|Concatenates a number of dynamic arrays to a single array.|
|[array_iff()](array-iff-function.md)|Applies element-wise iif function on arrays.|
|[array_index_of()](array-index-of-function.md)|Searches the array for the specified item, and returns its position.|
|[array_length()](array-length-function.md)|Calculates the number of elements in a dynamic array.|
|[array_reverse()](array-reverse-function.md)|Reverses the order of the elements in a dynamic array.|
|[array_rotate_left()](array-rotate-left-function.md)|Rotates values inside a dynamic array to the left.|
|[array_rotate_right()](array-rotate-right-function.md)|Rotates values inside a dynamic array to the right.|
|[array_shift_left()](array-shift-left-function.md)|Shifts values inside a dynamic array to the left.|
|[array_shift_right()](array-shift-right-function.md)|Shifts values inside a dynamic array to the right.|
|[array_slice()](array-slice-function.md)|Extracts a slice of a dynamic array.|
|[array_sort_asc()](array-sort-asc-function.md)|Sorts a collection of arrays in ascending order.|
|[array_sort_desc()](array-sort-desc-function.md)|Sorts a collection of arrays in descending order.|
|[array_split()](array-split-function.md)|Builds an array of arrays split from the input array.|
|[array_sum()](array-sum-function.md)|Calculates the sum of a dynamic array.|
|[`bag_has_key()`](bag-has-key-function.md)|Checks whether a dynamic bag column contains a given key.|
|[bag_keys()](bag-keys-function.md)|Enumerates all the root keys in a dynamic property-bag object.|
|[bag_merge()](bag-merge-function.md)|Merges dynamic property-bags into a dynamic property-bag with all properties merged.|
|[bag_pack()](packfunction.md)|Creates a dynamic object (property bag) from a list of names and values.|
|[bag_pack_columns()](bag-pack-columns-function.md)|Creates a dynamic object (property bag) from a list of columns.|
|[bag_remove_keys()](bag-remove-keys-function.md)|Removes keys and associated values from a dynamic property-bag.|
|[bag_set_key()](bag-set-key-function.md)|Sets a given key to a given value in a dynamic property-bag.|
|[jaccard_index()](jaccard-index-function.md)|Computes the [Jaccard index](https://en.wikipedia.org/wiki/Jaccard_index) of two sets.|
|[pack_all()](pack-all-function.md)|Creates a dynamic object (property bag) from all the columns of the tabular expression.|
|[pack_array()](pack-array-function.md)|Packs all input values into a dynamic array.|
|[repeat()](repeat-function.md)|Generates a dynamic array holding a series of equal values.|
|[set_difference()](set-difference-function.md)|Returns an array of the set of all distinct values that are in the first array but aren't in other arrays.|
|[set_has_element()](set-has-element-function.md)|Determines whether the specified array contains the specified element.|
|[set_intersect()](set-intersect-function.md)|Returns an array of the set of all distinct values that are in all arrays.|
|[set_union()](set-union-function.md)|Returns an array of the set of all distinct values that are in any of provided arrays.|
|[treepath()](treepath-function.md)|Enumerates all the path expressions that identify leaves in a dynamic object.|
|[zip()](zip-function.md)|The zip function accepts any number of dynamic arrays. Returns an array whose elements are each an array with the elements of the input arrays of the same index.|

## Window scalar functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[next()](next-function.md)|For the serialized row set, returns a value of a specified column from the later row according to the offset.|
|[prev()](prev-function.md)|For the serialized row set, returns a value of a specified column from the earlier row according to the offset.|
|[row_cumsum()](row-cumsum-function.md)|Calculates the cumulative sum of a column.|
|[row_number()](row-number-function.md)|Returns a row's number in the serialized row set - consecutive numbers starting from a given index or from 1 by default.|
|[row_rank_dense()](row-rank-dense-function.md)|Returns a row's dense rank in the serialized row set.|
|[row_rank_min()](row-rank-min-function.md)|Returns a row's minimal rank in the serialized row set.|

## Flow control functions

|Function Name            |Description                                             |
|-------------------------|--------------------------------------------------------|
|[toscalar()](toscalar-function.md)|Returns a scalar constant value of the evaluated expression.|

## Mathematical functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[abs()](abs-function.md)|Calculates the absolute value of the input.|
|[acos()](acos-function.md)|Returns the angle whose cosine is the specified number (the inverse operation of cos()).|
|[asin()](asin-function.md)|Returns the angle whose sine is the specified number (the inverse operation of sin()).|
|[atan()](atan-function.md)|Returns the angle whose tangent is the specified number (the inverse operation of tan()).|
|[atan2()](atan2-function.md)|Calculates the angle, in radians, between the positive x-axis and the ray from the origin to the point (y, x).|
|[beta_cdf()](beta-cdf-function.md)|Returns the standard cumulative beta distribution function.|
|[beta_inv()](beta-inv-function.md)|Returns the inverse of the beta cumulative probability beta density function.|
|[beta_pdf()](beta-pdf-function.md)|Returns the probability density beta function.|
|[cos()](cos-function.md)|Returns the cosine function.|
|[cot()](cot-function.md)|Calculates the trigonometric cotangent of the specified angle, in radians.|
|[degrees()](degrees-function.md)|Converts angle value in radians into value in degrees, using formula degrees = (180 / PI) * angle-in-radians.|
|[erf()](erf-function.md)|Returns the error function.|
|[erfc()](erfc-function.md)|Returns the complementary error function.|
|[exp()](exp-function.md)|The base-e exponential function of x, which is e raised to the power x: e^x.|
|[exp10()](exp10-function.md)|The base-10 exponential function of x, which is 10 raised to the power x: 10^x.|
|[exp2()](exp2-function.md)|The base-2 exponential function of x, which is 2 raised to the power x: 2^x.|
|[gamma()](gamma-function.md)|Computes gamma function.|
|[isfinite()](isfinite-function.md)|Returns whether input is a finite value (isn't infinite or NaN).|
|[isinf()](isinf-function.md)|Returns whether input is an infinite (positive or negative) value.|
|[isnan()](isnan-function.md)|Returns whether input is Not-a-Number (NaN) value.|
|[log()](log-function.md)|Returns the natural logarithm function.|
|[log10()](log10-function.md)|Returns the common (base-10) logarithm function.|
|[log2()](log2-function.md)|Returns the base-2 logarithm function.|
|[loggamma()](loggamma-function.md)|Computes log of absolute value of the gamma function.|
|[not()](not-function.md)|Reverses the value of its bool argument.|
|[pi()](pi-function.md)|Returns the constant value of Pi (π).|
|[pow()](pow-function.md)|Returns a result of raising to power.|
|[radians()](radians-function.md)|Converts angle value in degrees into value in radians, using formula radians = (PI / 180) * angle-in-degrees.|
|[rand()](rand-function.md)|Returns a random number.|
|[range()](range-function.md)|Generates a dynamic array holding a series of equally spaced values.|
|[round()](round-function.md)|Returns the rounded source to the specified precision.|
|[sign()](sign-function.md)|Sign of a numeric expression.|
|[sin()](sin-function.md)|Returns the sine function.|
|[sqrt()](sqrt-function.md)|Returns the square root function.|
|[tan()](tan-function.md)|Returns the tangent function.|
|[welch_test()](welch-test-function.md)|Computes the p-value of the [Welch-test function](https://en.wikipedia.org/wiki/Welch%27s_t-test).|

## Metadata functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[column_ifexists()](column-ifexists-function.md)|Takes a column name as a string and a default value. Returns a reference to the column if it exists, otherwise - returns the default value.|
|[current_cluster_endpoint()](current-cluster-endpoint-function.md)|Returns the current cluster running the query.|
|[current_database()](current-database-function.md)|Returns the name of the database in scope.|
|[current_principal()](current-principal-function.md)|Returns the current principal running this query.|
|[current_principal_details()](current-principal-details-function.md)|Returns details of the principal running the query.|
|[current_principal_is_member_of()](current-principal-is-member-of-function.md)|Checks group membership or principal identity of the current principal running the query.|
|[cursor_after()](cursor-after-function.md)|Used to access to the records that were ingested after the previous value of the cursor.|
|[estimate_data_size()](estimate-data-size-function.md)|Returns an estimated data size of the selected columns of the tabular expression.|
|[extent_id()](extent-id-function.md)|Returns a unique identifier that identifies the data shard ("extent") that the current record resides in.|
|[extent_tags()](extenttagsfunction.md)|Returns a dynamic array with the tags of the data shard ("extent") that the current record resides in.|
|[ingestion_time()](ingestion-time-function.md)|Retrieves the record's $IngestionTime hidden datetime column, or null.|

## Rounding functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[bin()](bin-function.md)|Rounds values down to an integer multiple of a given bin size.|
|[bin_at()](bin-at-function.md)|Rounds values down to a fixed-size "bin", with control over the bin's starting point. (See also bin function.)|
|[ceiling()](ceiling-function.md)|Calculates the smallest integer greater than, or equal to, the specified numeric expression.|

## Conditional functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[case()](case-function.md)|Evaluates a list of predicates and returns the first result expression whose predicate is satisfied.|
|[coalesce()](coalesce-function.md)|Evaluates a list of expressions and returns the first non-null (or non-empty for string) expression.|
|[iff()](./ifffunction.md)|Evaluate the first argument (the predicate), and returns the value of either the second or third arguments, depending on whether the predicate evaluated to true (second) or false (third).|
|[max_of()](max-of-function.md)|Returns the maximum value of several evaluated numeric expressions.|
|[min_of()](min-of-function.md)|Returns the minimum value of several evaluated numeric expressions.|

## Series element-wise functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[series_abs()](series-abs-function.md)|Calculates the element-wise absolute value of the numeric series input.|
|[series_acos()](series-acos-function.md)|Calculates the element-wise arccosine function of the numeric series input.|
|[series_add()](series-add-function.md)|Calculates the element-wise addition of two numeric series inputs.|
|[series_asin()](series-asin-function.md)|Calculates the element-wise arcsine function of the numeric series input.|
|[series_atan()](series-atan-function.md)|Calculates the element-wise arctangent function of the numeric series input.|
|[series_ceiling()](series-ceiling-function.md)|Calculates the element-wise ceiling function of the numeric series input.|
|[series_cos()](series-cos-function.md)|Calculates the element-wise cosine function of the numeric series input.|
|[series_divide()](series-divide-function.md)|Calculates the element-wise division of two numeric series inputs.|
|[series_equals()](series-equals-function.md)|Calculates the element-wise equals (`==`) logic operation of two numeric series inputs.|
|[series_exp()](series-exp-function.md)|Calculates the element-wise base-e exponential function (e^x) of the numeric series input.|
|[series_floor()](series-floor-function.md)|Calculates the element-wise floor function of the numeric series input.|
|[series_greater()](series-greater-function.md)|Calculates the element-wise greater (`>`) logic operation of two numeric series inputs.|
|[series_greater_equals()](series-greater-equals-function.md)|Calculates the element-wise greater or equals (`>=`) logic operation of two numeric series inputs.|
|[series_less()](series-less-function.md)|Calculates the element-wise less (`<`) logic operation of two numeric series inputs.|
|[series_less_equals()](series-less-equals-function.md)|Calculates the element-wise less or equal (`<=`) logic operation of two numeric series inputs.|
|[series_log()](series-log-function.md)|Calculates the element-wise natural logarithm function (base-e) of the numeric series input.|
|[series_multiply()](series-multiply-function.md)|Calculates the element-wise multiplication of two numeric series inputs.|
|[series_not_equals()](series-not-equals-function.md)|Calculates the element-wise not equals (`!=`) logic operation of two numeric series inputs.|
|[series_pow()](series-pow-function.md)|Calculates the element-wise power of two numeric series inputs.|
|[series_sign()](series-sign-function.md)|Calculates the element-wise sign of the numeric series input.|
|[series_sin()](series-sin-function.md)|Calculates the element-wise sine function of the numeric series input.|
|[series_subtract()](series-subtract-function.md)|Calculates the element-wise subtraction of two numeric series inputs.|
|[series_tan()](series-tan-function.md)|Calculates the element-wise tangent function of the numeric series input.|

## Series processing functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[series_cosine_similarity()](series-cosine-similarity-function.md)|Calculates the [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) of two numeric series.|
|[series_decompose()](series-decompose-function.md)|Does a decomposition of the series into components.|
|[series_decompose_anomalies()](series-decompose-anomalies-function.md)|Finds anomalies in a series based on series decomposition.|
|[series_decompose_forecast()](series-decompose-forecast-function.md)|Forecast based on series decomposition.|
|[series_dot_product()](series-dot-product-function.md)|Calculates the [dot product](https://en.wikipedia.org/wiki/Dot_product) of two numeric series.|
|[series_fill_backward()](series-fill-backward-function.md)|Performs backward fill interpolation of missing values in a series.|
|[series_fill_const()](series-fill-const-function.md)|Replaces missing values in a series with a specified constant value.|
|[series_fill_forward()](series-fill-forward-function.md)|Performs forward fill interpolation of missing values in a series.|
|[series_fill_linear()](series-fill-linear-function.md)|Performs linear interpolation of missing values in a series.|
|[series_fft()](series-fft-function.md)|Applies the Fast Fourier Transform (FFT) on a series.|
|[series_fir()](series-fir-function.md)|Applies a Finite Impulse Response filter on a series.|
|[series_fit_2lines()](series-fit-2lines-function.md)|Applies two segments linear regression on a series, returning multiple columns.|
|[series_fit_2lines_dynamic()](series-fit-2lines-dynamic-function.md)|Applies two segments linear regression on a series, returning dynamic object.|
|[series_fit_line()](series-fit-line-function.md)|Applies linear regression on a series, returning multiple columns.|
|[series_fit_line_dynamic()](series-fit-line-dynamic-function.md)|Applies linear regression on a series, returning dynamic object.|
|[series_fit_poly()](series-fit-poly-function.md)|Applies polynomial regression on a series, returning multiple columns.|
|[series_ifft()](series-ifft-function.md)|Applies the Inverse Fast Fourier Transform (IFFT) on a series.|
|[series_iir()](series-iir-function.md)|Applies an Infinite Impulse Response filter on a series.|
|[series_magnitude()](series-magnitude-function.md)|Calculates the [magnitude](https://en.wikipedia.org/wiki/Magnitude_(mathematics)#Euclidean_vector_space) of the numeric series.|
|[series_outliers()](series-outliers-function.md)|Scores anomaly points in a series.|
|[series_pearson_correlation()](series-pearson-correlation-function.md)|Calculates the Pearson correlation coefficient of two series.|
|[series_periods_detect()](series-periods-detect-function.md)|Finds the most significant periods that exist in a time series.|
|[series_periods_validate()](series-periods-validate-function.md)|Checks whether a time series contains periodic patterns of given lengths.|
|[series_seasonal()](series-seasonal-function.md)|Finds the seasonal component of the series.|
|[series_stats()](series-stats-function.md)|Returns statistics for a series in multiple columns.|
|[series_stats_dynamic()](series-stats-dynamic-function.md)|Returns statistics for a series in dynamic object.|
|[series_sum()](series-sum-function.md)|Calculates the sum of numeric series elements.|

## String functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[base64_encode_tostring()](base64-encode-tostring-function.md)|Encodes a string as base64 string.|
|[base64_encode_fromguid()](base64-encode-fromguid-function.md)|Encodes a GUID as base64 string.|
|[base64_decode_tostring()](base64-decode-tostring-function.md)|Decodes a base64 string to a UTF-8 string.|
|[base64_decode_toarray()](base64-decode-toarray-function.md)|Decodes a base64 string to an array of long values.|
|[base64_decode_toguid()](base64-decode-toguid-function.md)|Decodes a base64 string to a GUID.|
|[countof()](countof-function.md)|Counts occurrences of a substring in a string. Plain string matches may overlap; regex matches don't.|
|[extract()](extract-function.md)|Get a match for a regular expression from a text string.|
|[extract_all()](extract-all-function.md)|Get all matches for a regular expression from a text string.|
|[extract_json()](extract-json-function.md)|Get a specified element out of a JSON text using a path expression.|
|[has_any_index()](has-any-index-function.md)|Searches the string for items specified in the array and returns the position of the first item found in the string.|
|[indexof()](indexof-function.md)|Function reports the zero-based index of the first occurrence of a specified string within input string.|
|[isempty()](isempty-function.md)|Returns true if the argument is an empty string or is null.|
|[isnotempty()](isnotempty-function.md)|Returns true if the argument isn't an empty string or a null.|
|[isnotnull()](isnotnull-function.md)|Returns true if the argument is not null.|
|[isnull()](isnull-function.md)|Evaluates its sole argument and returns a bool value indicating if the argument evaluates to a null value.|
|[parse_command_line()](parse-command-line-function.md)|Parses a Unicode command line string and returns an array of the command line arguments.|
|[parse_csv()](parse-csv-function.md)|Splits a given string representing comma-separated values and returns a string array with these values.|
|[parse_ipv4()](parse-ipv4-function.md)|Converts input to long (signed 64-bit) number representation.|
|[parse_ipv4_mask()](parse-ipv4-mask-function.md)|Converts input string and IP-prefix mask to long (signed 64-bit) number representation.|
|[parse_ipv6()](parse-ipv6-function.md)|Converts IPv6 or IPv4 string to a canonical IPv6 string representation.|
|[parse_ipv6_mask()](parse-ipv6-mask-function.md)|Converts IPv6 or IPv4 string and netmask to a canonical IPv6 string representation.|
|[parse_json()](parse-json-function.md)|Interprets a string as a JSON value and returns the value as dynamic.|
|[parse_url()](parse-url-function.md)|Parses an absolute URL string and returns a dynamic object contains all parts of the URL.|
|[parse_urlquery()](parse-url-query-function.md)|Parses a url query string and returns a dynamic object contains the Query parameters.|
|[parse_version()](parse-version-function.md)|Converts input string representation of version to a comparable decimal number.|
|[replace_regex()](replace-regex-function.md)|Replace all regex matches with another string.|
|[replace_string()](replace-string-function.md)|Replace all single string matches with a specified string.|
|[replace_strings()](replace-strings-function.md)|Replace all multiple strings matches with specified strings.|
|[punycode_from_string()](punycode-from-string-function.md)| Encodes domain name to Punycode form.|
|[punycode_to_string()](punycode-to-string-function.md)| Decodes domain name from Punycode form.|
|[reverse()](reverse-function.md)|Function makes reverse of input string.|
|[split()](split-function.md)|Splits a given string according to a given delimiter and returns a string array with the contained substrings.|
|[strcat()](strcat-function.md)|Concatenates between 1 and 64 arguments.|
|[strcat_delim()](strcat-delim-function.md)|Concatenates between 2 and 64 arguments, with delimiter, provided as first argument.|
|[strcmp()](strcmp-function.md)|Compares two strings.|
|[strlen()](strlen-function.md)|Returns the length, in characters, of the input string.|
|[strrep()](strrep-function.md)|Repeats given string provided number of times (default - 1).|
|[substring()](substring-function.md)|Extracts a substring from a source string starting from some index to the end of the string.|
|[toupper()](toupper-function.md)|Converts a string to upper case.|
|[translate()](translate-function.md)|Replaces a set of characters ('searchList') with another set of characters ('replacementList') in a given a string.|
|[trim()](trim-function.md)|Removes all leading and trailing matches of the specified regular expression.|
|[trim_end()](trim-end-function.md)|Removes trailing match of the specified regular expression.|
|[trim_start()](trim-start-function.md)|Removes leading match of the specified regular expression.|
|[url_decode()](url-decode-function.md)|The function converts encoded URL into a regular URL representation.|
|[url_encode()](url-encode-function.md)|The function converts characters of the input URL into a format that can be transmitted over the Internet.|

## IPv4/IPv6 functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[ipv4_compare()](ipv4-compare-function.md)|Compares two IPv4 strings.|
|[ipv4_is_in_range()](ipv4-is-in-range-function.md)|Checks if IPv4 string address is in IPv4-prefix notation range.|
|[ipv4_is_in_any_range()](ipv4-is-in-any-range-function.md)|Checks if IPv4 string address is any of the IPv4-prefix notation ranges.|
|[ipv4_is_match()](ipv4-is-match-function.md)|Matches two IPv4 strings.|
|[ipv4_is_private()](ipv4-is-private-function.md)|Checks if IPv4 string address belongs to a set of private network IPs.|
|[ipv4_netmask_suffix](ipv4-netmask-suffix-function.md)|Returns the value of the IPv4 netmask suffix from IPv4 string address.|
|[parse_ipv4()](parse-ipv4-function.md)|Converts input string to long (signed 64-bit) number representation.|
|[parse_ipv4_mask()](parse-ipv4-mask-function.md)|Converts input string and IP-prefix mask to long (signed 64-bit) number representation.|
|[ipv4_range_to_cidr_list()](ipv4-range-to-cidr-list-function.md)|Converts IPv4 address range to a list of CIDR ranges.|
|[ipv6_compare()](ipv6-compare-function.md)|Compares two IPv4 or IPv6 strings.|
|[ipv6_is_match()](ipv6-is-match-function.md)|Matches two IPv4 or IPv6 strings.|
|[parse_ipv6()](parse-ipv6-function.md)|Converts IPv6 or IPv4 string to a canonical IPv6 string representation.|
|[parse_ipv6_mask()](parse-ipv6-mask-function.md)|Converts IPv6 or IPv4 string and netmask to a canonical IPv6 string representation.|
|[format_ipv4()](format-ipv4-function.md)|Parses input with a netmask and returns string representing IPv4 address.|
|[format_ipv4_mask()](format-ipv4-mask-function.md)|Parses input with a netmask and returns string representing IPv4 address as CIDR notation.|
|[ipv6_is_in_range()](ipv6-is-in-range-function.md)|Checks if an IPv6 string address is in IPv6-prefix notation range.|
|[ipv6_is_in_any_range()](ipv6-is-in-any-range-function.md)|Checks if an IPv6 string address is in any of the IPv6-prefix notation ranges.|
|[geo_info_from_ip_address()](geo-info-from-ip-address-function.md)|Retrieves geolocation information about IPv4 or IPv6 addresses.|

## IPv4 text match functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[has_ipv4()](has-ipv4-function.md)|Searches for an IPv4 address in a text.|
|[has_ipv4_prefix()](has-ipv4-prefix-function.md)|Searches for an IPv4 address or prefix in a text.|
|[has_any_ipv4()](has-any-ipv4-function.md)|Searches for any of the specified IPv4 addresses in a text.|
|[has_any_ipv4_prefix()](has-any-ipv4-prefix-function.md)|Searches for any of the specified IPv4 addresses or prefixes in a text.|

## Type functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[gettype()](gettype-function.md)|Returns the runtime type of its single argument.|

## Scalar aggregation functions

|Function Name     |Description                                          |
|-------------------------|--------------------------------------------------------|
|[dcount_hll()](dcount-hll-function.md)|Calculates the dcount from hll results (which was generated by hll or hll-merge).|
|[hll_merge()](hll-merge-function.md)|Merges hll results (scalar version of the aggregate version hll-merge()).|
|[percentile_tdigest()](percentile-tdigest-function.md)|Calculates the percentile result from tdigest results (which was generated by tdigest or merge_tdigest).|
|[percentile_array_tdigest()](percentile-array-tdigest-function.md)|Calculates the percentile array result from tdigest results (which was generated by tdigest or merge_tdigest).|
|[percentrank_tdigest()](percentrank-tdigest-function.md)|Calculates the percentage ranking of a value in a dataset.|
|[rank_tdigest()](rank-tdigest-function.md)|Calculates relative rank of a value in a set.|
|[merge_tdigest()](merge-tdigest-function.md)|Merge tdigest results (scalar version of the aggregate version tdigest-merge()).|

## Geospatial functions

|Function Name|Description|
|--------------------------------------------------------------------------|--------------------------------------------------------|
|[geo_angle()](geo-angle-function.md)|Calculates clockwise angle in radians between two lines on Earth.|
|[geo_azimuth()](geo-azimuth-function.md)|Calculates clockwise angle in radians between the line from point1 to true north and a line from point1 to point2 on Earth.|
|[geo_distance_2points()](geo-distance-2points-function.md)|Calculates the shortest distance between two geospatial coordinates on Earth.|
|[geo_distance_point_to_line()](geo-distance-point-to-line-function.md)|Calculates the shortest distance between a coordinate and a line or multiline on Earth.|
|[geo_distance_point_to_polygon()](geo-distance-point-to-polygon-function.md)|Calculates the shortest distance between a coordinate and a polygon or multipolygon on Earth.|
|[geo_intersects_2lines()](geo-intersects-2lines-function.md)|Calculates whether the two lines or multilines intersects.|
|[geo_intersects_2polygons()](geo-intersects-2polygons-function.md)|Calculates whether the two polygons or multipolygons intersects.|
|[geo_intersects_line_with_polygon()](geo-intersects-line-with-polygon-function.md)|Calculates whether the line or multiline intersects with polygon or multipolygon.|
|[geo_intersection_2lines()](geo-intersection-2lines-function.md)|Calculates the intersection of two lines or multilines.|
|[geo_intersection_2polygons()](geo-intersection-2polygons-function.md)|Calculates the intersection of two polygons or multipolygons.|
|[geo_intersection_line_with_polygon()](geo-intersection-line-with-polygon-function.md)|Calculates the intersection of line or multiline with polygon or multipolygon.|
|[geo_point_buffer()](geo-point-buffer-function.md)|Calculates polygon that contains all points within the given radius of the point on Earth.|
|[geo_point_in_circle()](geo-point-in-circle-function.md)|Calculates whether the geospatial coordinates are inside a circle on Earth.|
|[geo_point_in_polygon()](geo-point-in-polygon-function.md)|Calculates whether the geospatial coordinates are inside a polygon or a multipolygon on Earth.|
|[geo_point_to_geohash()](geo-point-to-geohash-function.md)|Calculates the Geohash string value for a geographic location.|
|[geo_point_to_s2cell()](geo-point-to-s2cell-function.md)|Calculates the S2 Cell token string value for a geographic location.|
|[geo_point_to_h3cell()](geo-point-to-h3cell-function.md)|Calculates the H3 Cell token string value for a geographic location.|
|[geo_line_buffer()](geo-line-buffer-function.md)|Calculates polygon or multipolygon that contains all points within the given radius of the input line or multiline on Earth.|
|[geo_line_centroid()](geo-line-centroid-function.md)|Calculates the centroid of line or a multiline on Earth.|
|[geo_line_densify()](geo-line-densify-function.md)|Converts planar line edges to geodesics by adding intermediate points.|
|[geo_line_length()](geo-line-length-function.md)|Calculates the total length of line or a multiline on Earth.|
|[geo_line_simplify()](geo-line-simplify-function.md)|Simplifies line or a multiline by replacing nearly straight chains of short edges with a single long edge on Earth.|
|[geo_line_to_s2cells()](geo-line-to-s2cells-function.md)|Calculates S2 cell tokens that cover a line or multiline on Earth. Useful geospatial join tool.|
|[geo_polygon_area()](geo-polygon-area-function.md)|Calculates the area of polygon or a multipolygon on Earth.|
|[geo_polygon_buffer()](geo-polygon-buffer-function.md)|Calculates polygon or multipolygon that contains all points within the given radius of the input polygon or multipolygon on Earth.|
|[geo_polygon_centroid()](geo-polygon-centroid-function.md)|Calculates the centroid of polygon or a multipolygon on Earth.|
|[geo_polygon_densify()](geo-polygon-densify-function.md)|Converts polygon or multipolygon planar edges to geodesics by adding intermediate points.|
|[geo_polygon_perimeter()](geo-polygon-perimeter-function.md)|Calculates the length of the boundary of polygon or a multipolygon on Earth.|
|[geo_polygon_simplify()](geo-polygon-simplify-function.md)|Simplifies polygon or a multipolygon by replacing nearly straight chains of short edges with a single long edge on Earth.|
|[geo_polygon_to_s2cells()](geo-polygon-to-s2cells-function.md)|Calculates S2 Cell tokens that cover a polygon or multipolygon on Earth. Useful geospatial join tool.|
|[geo_polygon_to_h3cells()](geo-polygon-to-h3cells-function.md)|Converts polygon to H3 cells. Useful geospatial join and visualization tool.|
|[geo_geohash_to_central_point()](geo-geohash-to-central-point-function.md)|Calculates the geospatial coordinates that represent the center of a Geohash rectangular area.|
|[geo_geohash_neighbors()](geo-geohash-neighbors-function.md)|Calculates the geohash neighbors.|
|[geo_geohash_to_polygon()](geo-geohash-to-polygon-function.md)|Calculates the polygon that represents the geohash rectangular area.|
|[geo_s2cell_to_central_point()](geo-s2cell-to-central-point-function.md)|Calculates the geospatial coordinates that represent the center of an S2 Cell.|
|[geo_s2cell_neighbors()](geo-s2cell-neighbors-function.md)|Calculates the S2 cell neighbors.|
|[geo_s2cell_to_polygon()](geo-s2cell-to-polygon-function.md)|Calculates the polygon that represents the S2 Cell rectangular area.|
|[geo_h3cell_to_central_point()](geo-h3cell-to-central-point-function.md)|Calculates the geospatial coordinates that represent the center of an H3 Cell.|
|[geo_h3cell_neighbors()](geo-h3cell-neighbors-function.md)|Calculates the H3 cell neighbors.|
|[geo_h3cell_to_polygon()](geo-h3cell-to-polygon-function.md)|Calculates the polygon that represents the H3 Cell rectangular area.|
|[geo_h3cell_parent()](geo-h3cell-parent-function.md)|Calculates the H3 cell parent.|
|[geo_h3cell_children()](geo-h3cell-children-function.md)|Calculates the H3 cell children.|
|[geo_h3cell_level()](geo-h3cell-level-function.md)|Calculates the H3 cell resolution.|
|[geo_h3cell_rings()](geo-h3cell-rings-function.md)|Calculates the H3 cell Rings.|
|[geo_simplify_polygons_array()](geo-simplify-polygons-array-function.md)|Simplifies polygons by replacing nearly straight chains of short edges with a single long edge, while ensuring mutual boundaries consistency related to each other, on Earth.|
|[geo_union_lines_array()](geo-union-lines-array-function.md)|Calculates the union of lines or multilines on Earth.|
|[geo_union_polygons_array()](geo-union-polygons-array-function.md)|Calculates the union of polygons or multipolygons on Earth.|

## Hash functions

|Function Name|Description|
|--------------------------------------------------------------------------|--------------------------------------------------------|
|[hash()](hash-function.md)|Returns a hash value for the input value.|
|[hash_combine()](hash-combine-function.md)|Combines two or more hash values.|
|[hash_many()](hash_manyfunction.md)|Returns a combined hash value of multiple values.|
|[hash_md5()](hash-md5-function.md)|Returns an MD5 hash value for the input value.|
|[hash_sha1()](hash-sha1-function.md)|Returns a SHA1 hash value for the input value.|
|[hash_sha256()](hash-sha256-function.md)|Returns a SHA256 hash value for the input value.|
|[hash_xxhash64()](hash-xxhash64-function.md)|Returns an XXHASH64 hash value for the input value.|

## Units conversion functions

|Function Name                                            | Description                                                            |
|---------------------------------------------------------|------------------------------------------------------------------------|
| [convert_angle()](convert-angle-function.md)             | Returns the input value converted from one angle unit to another       |
| [convert_energy()](convert-energy-function.md)           | Returns the input value converted from one energy unit to another      |
| [convert_force()](convert-force-function.md)             | Returns the input value converted from one force unit to another       |
| [convert_length()](convert-length-function.md)           | Returns the input value converted from one length unit to another      |
| [convert_mass()](convert-mass-function.md)               | Returns the input value converted from one mass unit to another        |
| [convert_speed()](convert-speed-function.md)             | Returns the input value converted from one speed unit to another       |
| [convert_temperature()](convert-temperature-function.md) | Returns the input value converted from one temperature unit to another |
| [convert_volume()](convert-volume-function.md)           | Returns the input value converted from one volume unit to another      |