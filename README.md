<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

# Odin Book Server

<center style='font-size:12pt'>

<a href='/CHANGELOG.md'>Changelog</a>

</center>

---

## Introduction

Backend API for Odin Book, a social media app clone project as part of The Odin Project curriculum.

## Technologies Used

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,postgres,prisma)](https://skillicons.dev)

- [NodeJS](https://nodejs.org/) is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more.

- [Express JS](https://expressjs.com/) or simply Express, is a back end web application framework for building RESTful APIs with Node.js.

- [PostgreSQL](https://www.postgresql.org/) is a free and open-source relational database management system emphasizing extensibility and SQL compliance.

- [Prisma](https://www.prisma.io/) is a modern ORM with a fully managed Postgres database.

## Installation

The instructions below will guide you through installing the api locally.

### Perquisites

Verify that you have Node.js, NPM and PostgreSQL installed.

1. Open a terminal by pressing `Ctrl+Alt+T`.

2. **Node:**

   ```sh
   node -v (or --version)
   ```

   _If not installed, download and installation procedures can be found at [Node.js][Nodejs-url] website._

3. **NPM**

   ```sh
   npm -v (or --version)
   ```

   _If not installed, download and installation procedures can be found at [NPM][NPM-url] website._

4. **PostgreSQL**

   ```sh
   psql -V (or --version)
   ```

   _If not installed, download and installation procedures can be found at [PostgreSQL][postgres-url] website._

### Database Setup

To setup your PostgreSQL database, create a new database named `odin-book`.

```sh
createdb odin-book;
```

### Installation Procedures

1. Open a terminal by pressing `Ctrl+Alt+T`.

2. Clone the repo
   ```sh
   git clone https://github.com/marefpceo/odin-book-server.git
   ```
3. Change directory to `odin-book-server`
   ```sh
   cd odin-book-server
   ```
4. Install modules and dependencies
   ```sh
   npm install
   ```
5. Generate Prisma Client
   ```sh
   npx prisma generate
   ```
6. Create an `.env` file in the root directory
   ```sh
   touch .env
   ```
7. Add the following variables and values to `.env`
   ```sh
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/odin-book"
   NODE_ENV="development"
   SESSION_SECRET="some-secret-string"
   ```
8. Start the server in development mode.
   ```sh
   npm run serverstart
   ```

## Endpoints

| Method   | Description                                   |
| -------- | --------------------------------------------- |
| `GET`    | method used to request data from the server   |
| `POST`   | method used to send data to the server        |
| `DELETE` | method used to delete an item from the server |

| Method   | URL                         | Description                                          |
| -------- | --------------------------- | ---------------------------------------------------- |
| `POST`   | `/signup`                   | creates a new user                                   |
| `POST`   | `/login`                    | verifies user credentials and logs the user in       |
| `POST`   | `/logout`                   | logs the user out and terminates the session         |
| `GET`    | `/auth/posts`               | timeline view showing user and friend's recent posts |
| `GET`    | `/auth/post/:postId`        | get selected post                                    |
| `GET`    | `/auth/post/create`         | gets info to create or update a post                 |
| `POST`   | `/auth/post/create`         | creates a new post                                   |
| `PUT`    | `/auth/post/:postId/update` | update a previously created message                  |
| `DELETE` | `/auth/post/:postId/delete` | delete a post                                        |
| `GET`    | `/auth/profile`             | gets profile information for the current user        |
| `GET`    | `/auth/profile/:profileId`  | gets profile of selected user (if one is created)    |
| `POST`   | `/auth/profile/create`      | create a user profile                                |
| `PUT`    | `/auth/profile/update`      | update user profile                                  |
| `DELETE` | `/auth/profile/delete`      | delete user profile (ADMIN role)                     |
| `GET`    | `/auth/users`               | gets list of all users and status                    |
| `GET`    | `/auth/users/:user`         | returns info for selected user                       |
| `POST`   | `/auth/users/:user/add`     | sends add request to selected user                   |
| `PUT`    | `/auth/users/:user/update`  | updates the friendship status                        |
| `DELETE` | `/auth/users/:user/remove`  | remove selected user from friend list                |

[Nodejs-url]: https://nodejs.org/en/download
[NPM-url]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[postgres-url]: https://www.postgresql.org/download/

<p align="right">(<a href="#readme-top">back to top</a>)</p>
