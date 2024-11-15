
# React and Express Application: Simulated Unix Console

This application simulates a Unix console in the browser, using a **React** front-end, an **Express** back-end, and a **MySQL** database for user management. The application allows for basic interaction with a simulated shell environment and supports user authentication.

## Features

- Simulated Unix shell in the browser (soon)
- Authentication
- MySQL database for user data storage
- Express server to handle API requests
- React front-end for user interface

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) 
- [MySQL](https://www.mysql.com/)
- [React](https://reactjs.org/)

## Setup

### 1. Clone the Repository

Start by cloning the repository to your local machine:
```bash
git clone https://github.com/qwegod/webunix.git
cd webunix
```

### 2. Install Dependencies

#### Install Dependencies for the Client (React):

Navigate to the `client` directory and install the React dependencies:
```bash
cd client
npm install
```
#### Install Dependencies for the Server (Express):

Navigate to the `server` directory and install the Express dependencies:
```bash
cd ../server
npm install
```

### 3. Set Up the MySQL Database

Create a new MySQL database and user for the application:
```sql
CREATE DATABASE express_DB;
USE express_DB;
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL, 
password VARCHAR(255), 
registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
directory VARCHAR(255) DEFAULT NULL );
```

### 4. Set Up the `.env` File

Create a `.env` file in the `server` directory with the following content:
```
PORT=3232
SECRET_KEY=your_secret_key
HOST=localhost
USER=root
PASSWORD=your_password
DATABASE=express_DB
```

### 6. Start the Application

Now that everything is set up, you can start both the **React front-end** and the **Express server**.
Navigate to the `root` directory and start the server:
```bash
cd ..
npm run start
```

### 7. Access the Application

Open your browser and navigate to:

-   Front-end (React): `http://localhost:3000`
-   Back-end (Express API): `http://localhost:3232`

