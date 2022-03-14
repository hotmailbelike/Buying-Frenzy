<div id="top"></div>




<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

REST API to make complex searches from a collection of Restaurants and purchase a dish for a User

Main Features:
* List all restaurants that are open at a certain datetime
* List top y restaurants that have more or less than x number of dishes within a price range
* Search for restaurants or dishes by name, ranked by relevance to search term
* Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [MongoDB.js](https://www.mongodb.com/)
* [TypeScript](https://www.typescriptlang.org/)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

The app is deployed and is hosted in `https://omar-buying-frenzy.herokuapp.com`.
You can make api calls from this this link to test it out. 
If you want to test it right away, scroll down to <a href="#usage">Usage</a> section
Or, If you want to run it in your own local machine, scroll down to <a href="#prerequisites">Prerequisites</a> section.

### Prerequisites
* MongoDB atlas account (use mine if you don't have one)
* MongoDB atlas URI (use mine if you don't have one)
* Latest LTS version of Node.js installed in local machine
* npm or yarn installed in local machine
* git installed in local machine 
* TypeScript installed in local machine

### Installation
Be sure to follow the Prerequisites steps mentioned above

1.  Clone this repository: 
    ```
    git clone https://github.com/hotmailbelike/abdullah-omar-backend-11Mar2022.git
    ```
1.  Open the folder in terminal
1.  Install NPM packages
    ```
    npm i 
    ```
    or 
    ```
    yarn 
    ```
1.  Create `.env` file in the root of the project 
1.  Add the line `MONGODB_URL=YOUR MONGO DB ATLAS URI` in the `.env` file. <br/>
**Note:** if you don't want to use your own YOUR MONGO DB ATLAS URI or if you don't have one, you can use mine and skip the next step
1.  Run in development mode: `npm run dev` or `yarn dev`. App will run on `Port 5000 (localhost:5000)` <br/>
**Note:** if there are errors, be sure to delete all lock files and node_modules folder and install NPM packages again (See command from Step 1) <br/>
My Mongo DB Atlas URI: `mongodb+srv://user_1:user1234@cluster0-vq45a.mongodb.net/Buying_Frenzy_DB?retryWrites=true&w=majority`

1.  **(Skip this step if you are not using your Mongo DB Atlas URI)** <br/>
Populate your database with sample restaurant and user data provided.
Make a `POST` api call to the route `/api/restaurant/populate` and wait until you get a "Database populated!" message.
fetch example:

```js
fetch('localhost:5000/api/restaurant/populate',{method:"post"})
	.then((res) => res.json())
	.then((res) => {
		console.log('🚀 -> res', res);
	})
	.catch((error) => {
		console.error('🚀 -> error', error);
	});
```

REST client example:
![image](https://user-images.githubusercontent.com/25118296/158273903-428e98f6-ebf8-4ada-80af-74cff7ceef7f.png)

8.  If there are no errors, you are finally ready to test the app locally from your machine.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
This section contains list of apis available and how to use them with example. <br/>
As mentioned earlier the app is already hosted in `https://omar-buying-frenzy.herokuapp.com`, use this has host when making api calls. <br/>
If you have the app running and ready in your local machine and want to make requests from there then use `localhost:5000` as host when making api calls

* **List all restaurants that are open at a certain datetime**

```
api: POST /api/restaurant/search/isOpen
body: timeString
(optional) query params: page, limit
```
**Note**: timeString in reqest body must follow the format: **"DDD HH:MM am/pm"** e.g "Mon 12:30 pm"
page will skip results and limit will set limit to number of results return

fetch example:

```js
fetch('/api/restaurant/search/isOpen?page=0&limit=10', {
	method: 'post',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ timeString: 'Sun 5:30 am' }),
})
	.then((res) => res.json())
	.then((res) => {
		console.log('🚀 -> res', res);
	})
	.catch((error) => {
		console.error('🚀 -> error', error);
	});
```

REST client example:

![image](https://user-images.githubusercontent.com/25118296/158077110-14122f13-89bc-4d75-9bec-898bed70bc80.png)

<hr/>

* **Search for restaurants or dishes by name, ranked by relevance to search term**

```
api: POST /api/restaurant/search/restaurantOrDish
body: restaurantOrDishName
```

fetch example:

```js
fetch('/api/restaurant/search/restaurantOrDish', {
	method: 'post',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ restaurantOrDishName: 'Fish' }),
})
	.then((res) => res.json())
	.then((res) => {
		console.log('🚀 -> res.dishes', res.dishes);
                console.log('🚀 -> res.restaurants', res.restaurants);
	})
	.catch((error) => {
		console.error('🚀 -> error', error);
	});
```

REST client example:

![image](https://user-images.githubusercontent.com/25118296/158080683-187694f7-b421-4729-b5ec-61ad7602d463.png)
<hr/>

* **List top y restaurants that have more or less than x number of dishes within a price range**

```
api: POST /api/restaurant/search/priceRange
body: {
  restaurantLimit: limit number of restaurants to fetch, 
  moreOrLess: eiter "more" or "less" to indicate more than dishLimit or less than dishLimit,
  dishLimit: how many dishes to limit per restaurant,
  priceUpperLimit: dish price max limit,
  priceLowerLimit: dish price min limit,
}
```

**Example 1**: List top 10 restaurants with less than or equals to 5 dishes within price 20 and 10
fetch:

```js
fetch('/api/restaurant/search/priceRange', {
	method: 'post',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ 
	    restaurantLimit : 10,
            moreOrLess : "less",
            dishLimit : 5,
            priceUpperLimit :  20,
            priceLowerLimit :  10
	}),
})
	.then((res) => res.json())
	.then((res) => {
		console.log('🚀 -> res', res);
	})
	.catch((error) => {
		console.error('🚀 -> error', error);
	});
```

REST client example:

![image](https://user-images.githubusercontent.com/25118296/158247008-baa2ca44-d706-45ea-b860-981c47ac44d3.png)

**Example 2**: List top 50 restaurants with more than or equals to 7 dishes within price 12 and 5

fetch:

```js
fetch('/api/restaurant/search/priceRange', {
	method: 'post',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ 
	    restaurantLimit : 50,
            moreOrLess : "more",
            dishLimit : 7,
            priceUpperLimit :  12,
            priceLowerLimit :  5
	}),
})
	.then((res) => res.json())
	.then((res) => {
		console.log('🚀 -> res', res);
	})
	.catch((error) => {
		console.error('🚀 -> error', error);
	});
```

REST client example:

![image](https://user-images.githubusercontent.com/25118296/158247413-70e3f163-52e6-4b90-bbb0-50fb6d2782d0.png)

<hr/>

* **Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction**

```
api: POST /api/user/purchaseDish/:userId
body: {
restaurantId : mongo db id of the restaurant
dishName: fill dish name
}
param: userId: mongodb id of the user
```

**Example:** Christopher Deisher whose _id is 622f64e59c2e631c97749448, is purchasing dish: rote schweizer weine from 13 Coins whose _id is 622f649f9c2e631c97741688

fetch: 

```js
fetch('/api/user/purchaseDish/622f64e59c2e631c97749448', {
	method: 'post',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({ restaurantId: '622f649f9c2e631c97741688', dishName:'rote schweizer weine' }),
})
	.then((res) => res.json())
	.then((res) => {
		console.log('🚀 -> res.user', res.user);
                console.log('🚀 -> res.restaurant', res.restaurant);
	})
	.catch((error) => {
		console.error('🚀 -> error', error);
	});
```

REST client:
![image](https://user-images.githubusercontent.com/25118296/158276257-b441616d-e970-4c66-a701-d9ca60aa1a09.png)







<!-- ROADMAP -->
## Roadmap

- [x] Create APIs
- [x] Deploy to Heroku 
- [ ] Set up test codes
- [ ] Switch to SQL database


<p align="right">(<a href="#top">back to top</a>)</p>



