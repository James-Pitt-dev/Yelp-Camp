# YelpCamp

## What It Does
YelpCamp is a web application that allows users to share and discover campgrounds. Users can create their own campgrounds, view campgrounds created by others, and leave reviews.

## Tech Stack
- **Languages:** JS, HTML, CSS, Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Bootstrap

## Features

- View a list of campgrounds.
- Create new campgrounds with detailed information.
- Edit existing campground information.
- Delete campgrounds.
- Responsive web design for optimal viewing on various devices.

## Architecture
YelpCamp follows the MVC (Model-View-Controller) architectural pattern. It's a functional programming application where each part of the code has its own job. The model represents the data, the view displays the data, and the controller handles the input.

- **Model:** Mongoose is used as an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data.
- **View:** EJS (Embedded JavaScript) is used as the templating engine to generate HTML markup with plain JavaScript.
- **Controller:** Express.js is used to handle HTTP requests and responses.

## Database
The database for YelpCamp is hosted on MongoDB, a source-available cross-platform document-oriented database program. It uses JSON-like documents with optional schemas.