
# Ebook_Library

Ebook_Library is a backend project implementing APIs for user login, registration, and Ebook CRUD operations

## Project setup

### Steps :-

First of all create an empty folder for Project

```bash
  mkdir Ebook_Lib
```

Initialize a node Project

```text
npm init -y
```

Setup Typescript with nodemon

```text
npm install -D typescript nodemon ts-node @types/node 
```

After initializing tsconfig file

```text
npx tsc --init
```

Add Dev script in package.json file

```text
"dev":"server.ts"
```

#### Eslint setup

[ESLINT](https://eslint.org/)

```text
npm init @eslint/config@latest
```

 Note :-  Make sure to install Eslint Vs Code Extension by MicroSoft

#### Text Formatting setup  using Prettier

Note :-  Make sure to install Prettier Vs Code Extension

Create a .prettierrc.json file in root of Project

```text
{

    "tabWidth": 4,
    "singleQuote": false
}
```

#### Git Setup ( Make sure Git install in system)

[Install Git](https://git-scm.com/install/mac)

In your project run

```text
git init
```

Note :- Install Vs Code gitignore by Code Zombie

And then ( cmd + shift + p) search  (add gitignore) and click and wait 2-3 second and then type node and select node ( we select node because our project in node) and you see a .gitignore created in root of project

#### Express Setup

```text
npm i express 
```

Install Types if not inbuilt

Check if this npm inbuilt for ts or not [Express](https://www.npmjs.com/package/express)

```text
npm i -D @types/express
```

#### config setup

Install dotenv

```text
npm i dotenv
```

create config.ts file and export it ( config.ts is in config folder)

#### Setup Mongo Database with mongoose

MongoDB server can be used via MongoDB Atlas or Docker depending on your setup

Install mongoose

```text
npm i mongoose
```

```text
npm i -D @types/mongoose
```

Note :- Here i mension mongoose build for TS , no need to install Dependencies [mongoose](https://www.npmjs.com/package/mongoose)

#### Setup for Error Handling

Install http-errors

```text
npm i http-errors
```

```text
npm i -D @types/http-errors

```

#### JWT setup

```text
npm i jsonwebtoken
```

```text
npm i -D @types/jsonwebtoken
```

#### Bcrypt Setup

```text
npm i bcrypt
```

```text
npm i -D @types/bcrypt
```

#### Multer

```text
npm i multer

```

```text
npm i -D @types/multer
```

#### Cloudinary Setup

```text
npm i cloudinary
```

```text
npm i -D @types/cloudinary
```

Note :- TS Dependencies all ready inbuilt

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGO_URI_STRING`

`NODE_ENV`

`JWT_SECRET`

`CLOUDINARY_CLOUD_NAME`

`CLOUDINARY_API_KEY`

`CLOUDINARY_API_SECRET`

## API Reference

### Register User

```http
POST /api/users/register
Content-Type: application/json
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. User's name |
| `email` | `string` | **Required**. User's email |
| `password` | `string` | **Required**. User's password |

### Login User

```http
POST /api/users/login
Content-Type: application/json
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. User's email |
| `password` | `string` | **Required**. User's password |

### Create Book

```http
POST /api/books
Content-Type: multipart/form-data <Postman - form-data>
Authorization: Bearer <your_token_here>
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**. title is required|
| `genre` | `string` | **Required**. genre is required|
| `coverImage` | `file` | **Required**. coverImage is required |
| `file` | `file` | **Required**. file is required |

### Update Book

```http
PATCH /api/books/:id
Content-Type: multipart/form-data  -> <Postman - form-data>
Authorization: Bearer <your_token_here>
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**. title is required|
| `genre` | `string` | **Required**. genre is required|
| `coverImage` | `file` | **Required**. coverImage is required |
| `file` | `file` | **Required**. file is required |

### List Book

```http
GET /api/books
```

### Single Book

```http
GET /api/books/:id
```

### Delete Book

```text
DELETE /api/books/:id
Authorization: Bearer <your_token_here>
```

## Command For Running Project

To run the project , run the following command

```bash
  npm run dev
```

## Tech Stack

**Server:** Node, Express, Cloudinary, Multer, Mongoose, bcrypt, JWT, cors, dotenv, http-errors

## Features

- Login
- SignUp
- Create a Book
- Update a Book
- Delete a Book
- List all Books
- Get a Single Book

## Contact

For Contact email - <shahbazjamia1957@gmail.com>
