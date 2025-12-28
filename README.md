# Assignment 2 — Backend API Integration & Service Development

## Objective
This project demonstrates how to work with external APIs on the **backend** using Node.js and Express.  
All third-party requests are processed on the server, and the frontend receives only ready JSON data.

---

## Project Structure
```
server.js
package.json
public/
 ├── index.html
 ├── style.css
 └── app.js
README.md
```

---

## Technologies
- Node.js  
- Express.js  
- REST APIs  
- HTML, CSS, JavaScript  

---

## Environment Variables (.env)

Create a `.env` file:

```
PORT=3000
OPENWEATHER_API_KEY=your_key
NEWS_API_KEY=your_key
```

> API keys are private and are NOT uploaded to GitHub.

---

## How to Run

### 1 - Install dependencies
```
npm install
```

### 2 - Start server
```
node server.js
```

### 3 - Open in browser
```
http://localhost:3000
```

---

##  Weather API (Server-Side)

Endpoint:

```http
GET /api/weather?city=Almaty
```

Example:

```http
http://localhost:3000/api/weather?city=Almaty
```

Returns:

- temperature  
- feels like  
- description  
- wind speed  
- coordinates  
- rain (last 3h)  
- country code  

---

## News API (Server-Side)

Endpoint:

```http
GET /api/news?city=Almaty
```

Returns:

- latest news articles related to the selected city

---

## Country API (Server-Side)

Endpoint:

```http
GET /api/country?name=Kazakhstan
```

Returns:

- capital  
- region  
- population  
- languages  
- currencies  
- other country details  

---

## UI & Design
- responsive layout  
- clean dark theme  
- simple and readable interface  

---

## Conclusion
Through this assignment I learned how to:

- integrate external APIs  
- hide API keys using `.env`  
- separate backend and frontend logic  
- build a responsive user interface  
- debug and handle API requests  
