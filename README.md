
# MIT-Harvard Real-Time Bus Tracker 🚌


## Description

This project provides a real-time visualization of the buses traveling along MIT-Harvard.  Buses traveling northbound are represented by red bus markers, whereas buses traveling southbound are represented by blue bus markers.  The upper right corner of each bus marker contains an indicator that represents seat capacity.

- red = no seats available
- orange = few seats available
- green = many seats available
- grey = seat status unknown

The title of each map marker is contained in the tooltip and can be seen by mousing over any map marker.  The bus marker locations are updated every 15 seconds by making an API call to Massachusetts Bay Transportation Authority, [MBTA](https://www.mbta.com/developers/v3-api).


## Preview

![MIT-Harvard Real-Time Bus Tracker Demo](./demo-real-time-bus-tracker.gif)
\* *Demonstration illustrates red, orange and green bus statuses*


## How to Run

1. Fork a copy of this project to your [GitHub](https://github.com) repository
2. Clone a copy from your [GitHub](https://github.com) repository to your local machine
3. Create an [account](http://account.mapbox.com) at [Mapbox](http://www.mapbox.com) for a [Mapbox access token](https://docs.mapbox.com/help/glossary/access-token/)
4. In the JavaScript file, replace ['YOUR_MAPBOX_ACCESS_TOKEN'](./script/realTimeBusTracker.js) with your Mapbox access token
5. Open the index file in your web browser


## Roadmap of Future Improvements

- [x] Replace default Mapbox map markers with custom markers
- [x] Add bus seat occupancy status indicator to bus markers


## Tech Stack

| Front End    | API          |
| ------------ | ------------ |
| JavaScript   | MBTA         |
| Mapbox GL    |              |


## License Information

[MIT License](https://choosealicense.com/licenses/mit/)

Copyright (c) 2021 [bryanjob](https://github.com/bryanjob)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.