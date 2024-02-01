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

- Wrap your endpoints in try/catch, use next(err)
- Create utility Error class to gracefully handle errors. DRY
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