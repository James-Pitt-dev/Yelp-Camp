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

### How to create mongoose Schema
- Import mongoose
- 

### Middleware and hooks, kind of like eventListeners.
 - Mongoose middleware/hooks pre.() post.() allows you to run custom logic when a database operation occurs like CRUD
 - Delete a campground, run a post function to delete all associated references in review table.
 - These exist in the model.js so they are tied to the instantiated Model object
 - Be sure the crud event matches. If you call findByIdAndDelete(id), then you must specify that event in your pre/post args
 -----------------
 - Express middleware app.use() intercepts the req/res to also do custom functions when server requests occur
 - Parse out req.body to json, methodOverride to allow for update/delete on POST reqs

### Express Router
 - express.Router()
 - create routes folder with entities /dogs.js, /shelters.js
 - import router 
 - instead of app.get, use router.get or post. router.get('/', (req,res) => {}), router.get('/:id', (req,res) => {})
 - export file
 - in app.js, import each entity, use as middleware now
 - app.use('/shelters', shelterRoutes) 
 - shelterRoutes is the shelters.js, were just intercepting the url pattern, then forwarding it to the route path to be handled.

 ### Cookies and Express
 - Adds statefulness to http, ex. to remember a users shopping cart or contents of fields
 - res.cookie('key', 'value'), will be sent with the response. Third arg is for signing
 - to req the cookie and access it, need to install cookie-parser. npm i cookie-parser
 - import it to app, app.use(cookieParser()) //its middleware
 - ensure authenticaty and integrity with signing cookies. 
 - sign the cookie on server, send to client, client sends cookie to sever, can check if untampered both ways
 - add the secret to - app.use(cookierParser(secret))
 - add sign - req.cookie('name', 'value', {signed: true})