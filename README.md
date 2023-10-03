# FireFinder API

Small coding challenge, This is a simple REST API that's supposed to be used with it's companion project FireFinderUI. *FireFinder API* works as a middleware layer, extracting Wildfire events from the NASA EONET database, using it's own API documentation.

The interface is very simple, it will return the name and country codes (ISO 3166-1 alpha-3) for every wildfire that ended in the specified month of the specified year.

Example:
```bash
curl '[FireFinderEndpoint]/api/v1/fires?month=SEP&year=2023' -H 'Accept: application/json'

## Response

[
    {
        "eventName": "Wanes Gray Fire Information",
        "country": "USA"
    },
    {
        "eventName": "Monkey Creek Fire, Texas",
        "country": "USA"
    },
    {
        "eventName": "Laguna Larga Fire, Texas",
        "country": "USA"
    },
    # ..etc..
]

```

# Design

The following section aims to explain the architecture and design decisions made prior to developing this API. So we should start with some requirements about the project.

* Query data from the NASA EONET API
* It should be made in javascript: (Not really required, but client preferred so we set this as a business requirement.)
* Should be simple, as we're on a short deadline.

Next we list the design assumptions, constraints or features we could add:

* The EONET API can be filtered, so we can offload the filtering to their system. We should then focus on transforming our inputs to their input formats.
* The EONET API is slow and it's not always available, therefore we should not rely completely on it.
    - We should return an error message if the service is unavailable
    - We could store the response temporarily to prevent flooding their endpoint (more on this below)
* We can make _our_ endpoint more efficient by caching the response using a basic read-through cache, this also addresses the previous point, if a specific date is requested many times we can serve our users from a single EONET read. 
* Following best practices, this API could be modified or extended later, so we should at least do some basic API versioning.
