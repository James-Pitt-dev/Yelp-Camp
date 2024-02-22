# Making an Express CRUD App

### Example
/your-mvc-app
|-- /models
|   |-- user.js
|   |-- post.js
|-- /views
|   |-- /user
|   |   |-- profile.ejs
|   |-- /post
|   |   |-- postDetails.ejs
|   |-- layout.ejs
|-- /controllers
|   |-- userController.js
|   |-- postController.js
|-- /routes
|   |-- userRoutes.js
|   |-- postRoutes.js
|-- /public
|   |-- /css
|   |-- /js
|   |-- /images
|-- app.js
|-- package.json

## Error Handling

- Wrap your endpoints in your catchAsync(async fn...) function. DRY, Clean Code
- Create utility Error class to gracefully handle errors. DRY
- throw new ExpressError(msg, code)
- set up error.ejs route
## How To Client-Side Validate Form Inputs?

    - https://getbootstrap.com/docs/5.0/forms/validation/

- Navigate to client form
- Add 'required' to all inputs. This is good enough but to make it better...
- add 'novalidate' and class='form-validate' to the form attributes so Bootstrap/Javascript can takeover validation instead of default behavior.

    - Bootstrap to make error handling styles easy, Javascript for setting custom validation handling

- Javascript: Use the script to take the non-validated forms from the DOM, then turn that NodeList into an iterable array by calling Array.slice() on it. Array.from(form) is more modern
        
        // Example starter JavaScript for disabling form submissions if there are invalid fields
        (function () {
        'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.form-validate')

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
            })
        })()

-  Place this in a partial on each form page. DRY

## How to Server-Side validate
- npm i joi, require joi...
- create Joi schemas.js that you can use to validate request data
- add a callback option to validate method in the put/post route as middleware

## Functional Requirements

## Non-Functional Requirements

## Tech Stack


## Testing

We will employ the standard Arrange, Act, Assert (AAA) testing pattern across various components of our project to ensure clarity, maintainability, and flexibility in our testing suite. This pattern aids in understanding the purpose behind each test and simplifies future updates or changes.

What are the main components we will be testing?

 - API Endpoints

 - Database and System Integrations

 - Front-End Components 

 - Functional and Non-Functional Requirements

 How will we test?

 - Unit Testing:
    This will cover core functions, the critical units of our project like business logic, database schema constraints, and data processing.

- Integration Testing:
    This will cover our key system integrations, ensuring databases and servers communicate correctly, and API providers return successfully.

- Front-End Testing:
    This will cover common user interactions, like form submissions, navigating between routes, and correct rendering of views/UI.

- Manual/System Testing:
    Conducted periodically by team members to verify the application’s behavior aligns with user expectations and project functional requirements.

Tools:
 - Jest: A standard testing framework in the NodeJS/Express ecosystem, lends itself well to unit testing and integration testing.
 - React Testing Library: A standard React testing library, allowing us to simulate user interactions and check for proper rendering of components.
 - Postman: For manual API testing, Postman allows us to send requests to our server endpoints and inspect the responses without writing any code.

### Continuous Integration

