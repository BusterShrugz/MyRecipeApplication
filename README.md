# My Recipes Storage and Creation App

[![CI](https://github.com/BusterShrugz/MyRecipeApplication/actions/workflows/ci.yml/badge.svg)](https://github.com/BusterShrugz/MyRecipeApplication/actions/workflows/ci.yml)

A full-stack recipe management application built to make storing, organizing, viewing, creating, editing, deleting, and scaling recipes simple.

The application combines a **React/Vite frontend**, **Node.js/Express REST API**, and **MongoDB Atlas database** to provide persistent recipe storage with a responsive, user friendly interface.

The project began as a practical exercise in working with REST APIs and MongoDB and has evolved into a complete deployed full-stack application with automated testing, continuous integration, validation, and production deployment.

---

## Features

### Recipe Management

* Create new recipes through the web interface
* View individual recipe details
* Delete recipes
* Retrieve recipes from MongoDB
* Organize recipes by category and subcategory
* Display recipe yield, ingredients, and instructions
* Storage through MongoDB Atlas

### Recipe Scaling

Recipes can be dynamically scaled based on the desired yield amount.

For example:

```text
Original Yield: 12
Desired Yield: 24

Scaling Factor = 24 / 12
               = 2
```

An ingredient using:

```text
200 g flour
```

will automatically become:

```text
400 g flour
```

The scaling functionality is handled on the frontend so users can adjust a recipe without modifying the original recipe stored in the database.

### Recipe Categories

Recipes can be organized into categories including:

* Cakes
* Breads
* Viennoiserie
* Pastry
* Cookies
* Sauces
* Creams & Custards
* Savory

Recipes can also contain subcategories for additional organization.

### Ingredient Display

Ingredients are stored as structured recipe data and displayed in a user friendly format.

The application supports:

* Ingredient quantities
* Units of measurement
* Ingredient names
* Dynamically calculated quantities when scaling
* Recipe yield information

### Recipe Validation

The backend validates incoming recipe data before it is stored or modified.

Validation includes:

* Required fields
* Valid recipe categories
* Allowed recipe fields
* Ingredient structure
* Recipe yield
* Input sanitization
* Validation of create and update requests

This prevents malformed or unexpected data from being stored in the database.

### REST API

The Express backend provides RESTful endpoints for recipe management.

Supported operations include:

* Retrieve all recipes
* Retrieve an individual recipe
* Create recipes
* Delete recipes

The React frontend communicates with the API using HTTP requests.

### MongoDB Atlas

Recipe data is persistently stored in MongoDB Atlas.

The database uses MongoDB's document-based structure to store information such as:

```text
Recipe
├── name
├── category
├── subcategory
├── yield
├── ingredients
└── instructions
```

### Responsive React UI

The frontend uses reusable React components to separate application functionality and presentation.

Components are organized around features such as:

* Recipe lists
* Recipe cards
* Recipe forms
* Ingredients
* Instructions
* Categories
* Buttons and reusable UI elements

The interface is designed to provide a practical experience for viewing and working with recipes on both desktop and smaller screens.

---

## Testing

The backend includes automated API tests using:

* **Vitest**
* **Supertest**
* **MongoDB Memory Server**

The test suite runs against an isolated in-memory MongoDB instance rather than the production database.

Tests cover the primary recipe API functionality, including:

* `GET /recipes`
* `GET /recipes/:id`
* `POST /recipes`
* `PUT /recipes/:id`
* `DELETE /recipes/:id`
* Validation failures
* Invalid recipe data
* Missing resources
* CRUD behavior

The project currently uses automated tests as part of the development workflow to help prevent regressions when modifying the API.

---

## Continuous Integration

GitHub Actions is used to automatically validate changes.

The CI workflow performs separate frontend and backend checks.

### Frontend Checks

The frontend pipeline runs:

* Dependency installation
* ESLint
* Production build

### Backend Checks

The backend pipeline runs:

* Dependency installation
* Automated Vitest test suite
* API tests using MongoDB Memory Server

The CI badge at the top of this README reflects the status of the project's automated checks.

---

## Deployment

The application is deployed using **Vercel**.

The production architecture separates the frontend application from the Express API while allowing both to operate under the same deployment.

### Production Architecture

```text
Browser
   │
   ▼
React / Vite Frontend
   │
   │ HTTP Requests
   ▼
Vercel Serverless API
   │
   ▼
Node.js / Express
   │
   │ MongoDB Driver
   ▼
MongoDB Atlas
```

The Express API is adapted for Vercel's serverless environment through:

```text
server/api/index.js
```

Production API requests are routed through:

```text
/api/*
```

Environment variables are used for sensitive configuration such as the MongoDB connection string rather than committing credentials to the repository.

---

## Technologies

### Frontend

* React
* JavaScript
* Vite
* CSS
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST API
* CORS
* dotenv

### Database

* MongoDB
* MongoDB Atlas
* MongoDB Node.js Driver

### Testing

* Vitest
* Supertest
* MongoDB Memory Server

### Deployment & CI/CD

* Vercel
* GitHub Actions

### Development Tools

* Git
* GitHub
* npm
* IntelliJ
* Firefox Developer Tools
* MongoDB Atlas

---

## Project Structure

The project is organized into separate frontend and backend applications.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* [Node.js](https://nodejs.org/)
* npm
* Git
* A MongoDB database, either locally or through MongoDB Atlas

### 1. Clone the repository

```bash
git clone https://github.com/BusterShrugz/MyRecipeApplication.git
cd MyRecipeApplication
```

### 2. Install dependencies

Install the root/backend dependencies:

```bash
npm install
```

Then install the frontend dependencies:

```bash
cd client
npm install
```

### 3. Configure environment variables

Create a `.env` file for the backend configuration.

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5050
```

Do **not** commit `.env` files or database credentials to GitHub.

The project `.gitignore` is configured to prevent environment files from being committed.

### 4. Start the backend

From the server/project directory, start the Express API using the project's development script.

The local API runs on:

```text
http://localhost:5050
```

### 5. Start the frontend

From the client directory:

```bash
cd client
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

---

## API

The backend exposes RESTful recipe endpoints.

### Get all recipes

```http
GET /api/recipes
```

### Get a recipe

```http
GET /api/recipes/:id
```

### Create a recipe

```http
POST /api/recipes
```

### Update a recipe

```http
PUT /api/recipes/:id
```

### Delete a recipe

```http
DELETE /api/recipes/:id
```

The API validates recipe data before creating or updating documents.

---

## Example Recipe

A recipe document follows a structure similar to:

```json
{
  "name": "Chocolate Chip Cookies",
  "category": "Cookies",
  "subcategory": "Drop Cookies",
  "yield": 24,
  "ingredients": [
    {
      "quantity": 200,
      "unit": "g",
      "name": "flour"
    }
  ],
  "instructions": [
    "Cream the butter and sugar.",
    "Add the eggs and vanilla.",
    "Mix in the dry ingredients.",
    "Bake until golden brown."
  ]
}
```

---

## Recipe Scaling

The recipe scaler calculates ingredient quantities using the ratio between the desired yield and the original recipe yield.

```text
Scaling Factor = Desired Yield / Original Yield
```

For example:

```text
Original Yield: 12
Desired Yield: 30

Scaling Factor = 30 / 12
               = 2.5
```

An ingredient containing:

```text
200 g flour
```

would become:

```text
500 g flour
```

The original recipe remains unchanged in the database.

This allows the application to function as both a recipe storage system and a practical kitchen calculation tool.

---

## Current Development Status

The core recipe management system is now functional.

### Completed

* [x] React frontend
* [x] Vite development environment
* [x] Express REST API
* [x] MongoDB integration
* [x] MongoDB Atlas persistence
* [x] Recipe retrieval
* [x] Recipe creation
* [x] Recipe editing
* [x] Recipe deletion
* [x] Recipe scaling
* [x] Ingredient display
* [x] Recipe categories
* [x] Recipe subcategories
* [x] Backend validation
* [x] Input sanitization
* [x] Frontend API service layer
* [x] Reusable React components
* [x] Loading and error handling
* [x] Automated backend testing
* [x] MongoDB Memory Server test environment
* [x] GitHub Actions CI
* [x] Production frontend build
* [x] Vercel deployment
* [x] Production serverless API
* [x] Production MongoDB connection
* [x] Environment variable configuration
* [x] CORS configuration
* [x] Production API routing

---

## Future Improvements

Potential future improvements include:

* [ ] User accounts and authentication
* [ ] Favorites / saved recipes
* [ ] Recipe search
* [ ] Advanced filtering
* [ ] Tags
* [ ] Improved unit conversion
* [ ] More sophisticated ingredient parsing
* [ ] Ingredient substitution suggestions
* [ ] Recipe image uploads
* [ ] Image optimization
* [ ] Recipe import/export
* [ ] Printable recipe cards
* [ ] Shopping list generation
* [ ] Improved mobile experience
* [ ] Accessibility improvements
* [ ] Expanded frontend test coverage
* [ ] End-to-end testing
* [ ] API documentation
* [ ] Performance monitoring
* [ ] Production analytics

---

## What I have Learned

This project has helped me develop a practical experience across the entire development lifecycle.

### Frontend Development

* Building component-based React applications
* Managing React state
* Creating reusable components
* Handling asynchronous API requests
* Building dynamic recipe calculations
* Managing loading, error, and success states
* Structuring frontend service layers
* Creating responsive interfaces

### Backend Development

* Designing RESTful APIs
* Building Express middleware
* Validating and sanitizing incoming data
* Handling HTTP errors
* Working with MongoDB's Node.js driver
* Managing database connections
* Structuring server-side application logic

### Database Development

* Designing MongoDB documents
* Connecting applications to MongoDB Atlas
* Performing CRUD operations
* Using isolated in-memory databases for testing

### Testing

* Writing API integration tests
* Using Vitest
* Using Supertest
* Testing CRUD operations
* Testing validation and error cases
* Creating isolated database environments with MongoDB Memory Server

### DevOps & Deployment

* Configuring GitHub Actions
* Building CI pipelines
* Debugging production build failures
* Deploying React applications with Vercel
* Deploying Express APIs as serverless functions
* Managing production environment variables
* Debugging production CORS and API issues
* Connecting a production application to MongoDB Atlas

---

## Project Goals

This project is being developed as a practical full-stack software engineering project rather than just a frontend demonstration.

The primary goals are to gain experience with:

* Full-stack application architecture
* RESTful API design
* React development
* MongoDB and document databases
* CRUD application design
* Data validation and sanitization
* Automated testing
* Continuous integration
* Cloud deployment
* Serverless architecture
* Environment configuration
* Debugging production applications
* Git and GitHub workflows
* Building software around a real-world use case (storing my recipes)

The project also reflects my transition from professional pastry work into software engineering by combining a familiar domain—recipe development—with modern software engineering practices.

---

## Author

**Reese Edens**

Computer Science & Software Engineering Senior Student

Former professional Chef / Pastry Chef transitioning into software engineering.

Interested in:

* Software Engineering
* Full-Stack Development
* Data & Databases
* Artificial Intelligence
* Machine Learning
* Practical application development

---

## Repository

**GitHub:**
https://github.com/BusterShrugz/MyRecipeApplication

If you find the project interesting, feel free to star the repository!

