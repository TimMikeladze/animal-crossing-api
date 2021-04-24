# Animal Crossing API

A GraphQL API for Animal Crossing New Horizon items, villagers, fish, etc.

https://animal-crossing-api.vercel.app - Demo & Documentation

https://animal-crossing-api.vercel.app/api/graphql - GraphQL endpoint.

## Query examples

**Top 5 hardest fish to catch**

```graphql
{
    fishes(first: 5, filter: { catchDifficulty: { equalTo: "Very Hard" } }) {
        id
        name
        description
        catchphrase
        color1
        color2
        spawnRates
        whereHow
        catchDifficulty
    }
}

```

**Villagers with birthdays in June or July sorted by birthday and name**

```graphql
{
    villagersWithSummerBirthdays: villagers(
        filter: {
            or: [{ birthday: { like: "6/%" } }, { birthday: { like: "7/%" } }]
        }
        orderBy: [BIRTHDAY_ASC, NAME_ASC]
    ) {
        id
        birthday
        name
        favoriteSong
        hobby
        personality
        species
        subtype
    }
}

```

**All seasons and events**

```graphql
{
    seasonsAndEvents {
        id
        name
        unlockDate
        unlockMethod
        datesNorthernHemisphere
        year
        displayName
        datesSouthernHemisphere
        internalLabel
        nodeId
        type
        uniqueEntryId
        versionLastUpdated
        versionAdded
    }
}

```

## How it works

The data is provided by the community made [Data Spreadsheet for Animal Crossing New Horizons](https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/).

The XLSX spreadsheet is fetched and converted into JSON. After some data massaging the schema for each sheet is determined and relevant
Postgres tables are created and populated with data.

Using PostGraphile a read only GraphQL API is automatically generated by introspecting the Postgres database structure.


