# My Recipes Storage and Creation App

A full-stack recipe management application built to make storing, viewing, and scaling recipes simple. The application uses a React frontend with a Node.js/Express backend and MongoDB for persistent recipe storage.

The project was created as a practical full-stack application to explore REST APIs, database integration, reusable React components, and dynamic recipe calculations.

![CI](https://github.com/BusterShrugz/MyRecipeApplication/actions/workflows/ci.yml/badge.svg)
##  Features

*  **Recipe Management**

  * Store recipes in MongoDB
  * View recipe details and ingredients
  * Organize recipes for easy access

*  **Recipe Scaling**

  * Adjust recipe quantities based on the desired yield
  * Automatically calculate scaled ingredient amounts

*  **Ingredient Display**

  * Display ingredient quantities and measurements
  * Present recipes in a cook-friendly format

*  **REST API**

  * Express backend provides recipe endpoints
  * Frontend communicates with the backend using HTTP requests

*  **MongoDB Database**

  * Persistent storage for recipes
  * Flexible document structure for ingredients, instructions, and recipe metadata

*  **Responsive React UI**

  * Component-based frontend architecture
  * Reusable UI components
  * Designed for both desktop and smaller screens

##  Technologies

### Frontend

* React
* JavaScript
* Vite
* CSS / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* MongoDB Atlas

### Development Tools

* Git / GitHub
* npm
* VS Code

##  Project Structure <-- So far  

```text
recipe-app/
├── client/
│   ├── src/
│   │   ├── appComponents/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

> The exact structure may change as the application develops.

##  Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* A MongoDB database, either locally or through MongoDB Atlas

### 1. Clone the repository

```bash
git clone <https://github.com/BusterShrugz/MyRecipeApplication.git>
cd recipe-app
```

### 2. Install dependencies

Install the frontend dependencies:

```bash
cd client
npm install
```

Then install the backend dependencies:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the server directory.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5050
```

Do not commit your `.env` file to GitHub.

### 4. Start the backend

From the server directory:

```bash
npm run dev
```

The API should be available at:

```text
http://localhost:5050
```

### 5. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

##  API

The backend exposes REST endpoints for interacting with recipes.

### Get all recipes

```http
GET /recipes
```

### Get a recipe

```http
GET /recipes/:id
```

### Create a recipe

```http
POST /recipes
```

### Update a recipe

```http
PUT /recipes/:id
```

### Delete a recipe

```http
DELETE /recipes/:id
```

> API endpoints may change as development continues.

##  Recipe Scaling : TODO

One of the main goals of the application is to make recipes easier to scale.

For example, if a recipe produces 12 cookies and the user wants 24:

```text
Original Yield: 12
Desired Yield: 24

Scaling Factor = 24 / 12
               = 2
```

An ingredient originally using:

```text
200 g flour
```

would become:

```text
400 g flour
```

The frontend handles these calculations dynamically so the user can adjust the recipe without manually recalculating every ingredient.

##  Screenshots : TODO

Screenshots of the application will be added here as the UI develops.

### Recipe List

*Future screenshot here*

### Recipe Details

*Future screenshot here*

### Recipe Scaling

*Future screenshot here*

##  Future Improvements

Planned improvements include:

* [ ] User accounts and authentication
* [ ] ~~Create~~/edit/~~delete~~ recipes through the UI
* [ ] Recipe search and filtering
* [ ] Recipe categories and tags
* [ ] Improved unit conversion
* [ ] Fractional measurements
* [ ] Ingredient substitution suggestions
* [ ] Image uploads for recipes
* [ ] Responsive/mobile improvements
* [ ] Deployment of frontend and backend
* [ ] Automated testing

##  Project Goals

This project is being developed as a full-stack software engineering project with a focus on:

* Building a RESTful API
* Working with MongoDB and document-based data
* Connecting a React frontend to a backend service
* Creating reusable React components
* Managing application state
* Performing dynamic calculations in the frontend
* Practicing Git and GitHub development workflows
* Designing an application around a practical real-world use case

##  Author

**Reese Edens**

Senior Computer Science & Software Engineering Student

Interested in software engineering, full-stack development, data, and building practical applications.

---

If you find this project interesting, feel free to star the repository!
