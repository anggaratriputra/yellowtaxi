
# Yellow Taxi Analytics

![preview](https://i.imgur.com/mrfvwJ6.png)

This project is a **Single Page Application (SPA)** designed to display detailed taxi trip information, including taxi service type, fare amount, distance traveled, and trip duration. The app features an interactive map visualization to view each trip's route and details.

Users can filter trip data based on:

- Distance

- Fare amount

- Taxi service type

- Payment type

This allows for a streamlined and customized viewing experience, letting users focus on specific trip details according to their preferences. The app is built for fast, dynamic interactions, ensuring an efficient and user-friendly interface.

This project also has deployed on this website
https://yellowtaxi.anggaratriputra.my.id/





## Tech Stack

**Client:** React, TailwindCSS, Axios, Leaflet

**Server:** Node, Express, Axios






## Socrata API

This project uses the Socrata API to fetch datasets for taxi trips in New York City. 

The API endpoint for the dataset can be found here: 

[NYC Taxi Trip Data](https://dev.socrata.com/foundry/data.cityofnewyork.us/gkne-dk5s)

To access the data, you’ll need to sign up on the Socrata website and obtain an App Token. This token is required to authenticate API requests and ensure stable access to the data.


## Mapbox
This project uses the Mapbox library to display and draw routes on an interactive map. To enable map functionality, you’ll need to sign up on the [Mapbox website](https://www.mapbox.com/) and obtain an access token. This token is essential for authenticating your requests and accessing Mapbox’s mapping services.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

client .env :

`REACT_APP_MAPBOX_ACCESS_TOKEN`

server .env :

`SOCRATA_API_URL`

`SOCRATA_APP_TOKEN`

`PORT=` **(for local running)**






## Run Locally

Clone the project

```bash
  git clone https://github.com/anggaratriputra/yellowtaxi.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies both on client and server folders

```bash
  cd client
  npm install
```

```bash
  cd server
  npm install
```

Setting up .env

client .env :
```
REACT_APP_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
```
server .env :
```
SOCRATA_API_URL=https://data.cityofnewyork.us/resource/gkne-dk5s.json

SOCRATA_APP_TOKEN=your-socrata-app-token

PORT= 5000
```


Start the client and server in different terminal

client
```bash
  npm run start
```

server
```bash
  npm run start
```



