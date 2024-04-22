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
 - express.Router({mergeParams: true}) //allows url params like campgrounds/:id/review to be passed through to route
 - create routes folder with entities /dogs.js, /shelters.js
 - import router 
 - instead of app.get, use router.get/post. router.get('/', (req,res) => {}), router.get('/:id', (req,res) => {})
 - export file
 - in app.js, import each entity, use as middleware now
 - app.use('/shelters', shelterRoutes) 
 - shelterRoutes is the shelters.js, were just intercepting the url pattern, then forwarding it to the route path to be handled.
 - (clean up if needed: alter route.js paths and remove /shelters since were already using it. Import depency methods to route.js like catchAsync(), expressError(), import Models, correct paths)

 ### Cookies and Express
 - Adds statefulness to http, ex. to remember a users shopping cart or contents of fields
 - res.cookie('key', 'value'), will be sent with the response. Third arg is for signing
 - to req the cookie and access it, need to install cookie-parser. npm i cookie-parser
 - import it to app, app.use(cookieParser()) //its middleware
 - ensure authenticaty and integrity with signing cookies. 
 - sign the cookie on server, send to client, client sends cookie to sever, can check if untampered both ways
 - add the secret to - app.use(cookierParser(secret))
 - add sign - req.cookie('name', 'value', {signed: true})
 - verify - req.signedCookies

 ### Session
 - Session is stored on server-side, unlike cookies with client. But stored on a temp database
 - Server gives client sessionID cookie, client can access the session store with cookie sessionID
 - session id is a hashed value
 - npm i express-session, require session
 - express middleware
 - app.use(session({secret: 'envExample', OtherOptions})) //look into 'resave: true/false' 'saveUnitialized: true/false' options
 - Now a session object is attached to the req body. -> req.session
 - Use in conjunction with redis/mongo session stores for production, ssession data by default is unsecure and unscalable
 - required for authentication

 ### Authentication and Authorization
 - Authentication = Verifying who a user is, aka username/pass or MFA. Authoriziation = What a user has access to do after being authenticated.
 - these are async/await functions
 - Use bcrypt library to generate hashed passwords and compare incoming plaintext to hashed pw's in db
 - fetch user from db User.findOne({username})
 - bcrypt.compare(pw, user.pw)
 #### System Design of Auth/Authoriz.
 - Set up 4-5 routes like log in/out
 - Serve the form to register     
 - Establish middleware to force you to log in for some routes
 - Then set up authorization for content, someone owns a review, someone owns a campground
 - Tie methods to the user model
 ##### Staying logged in with Session
 - npm i express-session
 - req.session.user_id = user._id; // give log in ID to session when login or register success. On guarded routes, add cond. to check if session.userid exists.
 #### Logging out with session
 - since sessionID is attached to req.body, it gets checked for valid hash every request. On log out, set sessionID = null.
 - Do this by: 
    - Making a post route --> POST /logout
    - req.session.user_id = null OR req.sessions.destroy() to clear other info in there
    - redirect('/home');
    - Now make a view and a form to send that post request. < form action='logout' method=post>< button>< /form>
 - Best to move this to a middleware if more routes to protect. DRY
    - const requireMiddleware = 
    - (r,r,n) => {if (!req.session.user_id) {return redirect them} else next()}
    - now add that middleware to the routes you require log in for
 - Move it to Model. Even DRYer   

#### Passport
- Its the thing that lets you log in via google, facebook, twitter, local, etc
- npm i passport passport-local passport-local-mongoose       
- in user model: require passportlocalmongoose, UserSchema.plugin(passportLocalMongoose)
- in app.use, initialize(), passport.use(new strat(auth))
- passport.serialise(User.serializeUser) + deserialize //handles session
 ### Connect-flash
 - a flash is a spot in the session to flash a message to the user, like'success', 'failure'. Shows up one time on page load, then goes away
 - Add to the session => req.flash('success', 'successfuly created!') args are key, value
 - show it with res.render('view', {messages: req.flash('success')}) pass it through to the view as prop data
 - in the view.ejs, show it like any other data <= messages >

 - Better method is to make the flash values global scope through defining a middleware.
 - This reduces repeitition from constantly passing flash messages as props to each individual view.
 - Remove the message prop from views then:
     app.use((req, res, next) => {
        res.locals.messages = req.flash(success);
        next();
     })
 - res.locals is an express object you can attach data to, scoped to specific views.

 ### Public dir
 - use it to include stuff into boilerplate, more separation of concerns.
 - client-side form val, stylesheets, logos, fonts, audio files, etc. Better performance
 - set up app.js middleware -> app.use(express.static(path.join(__dirname, 'public'))) //path.join so pathing is consistent across dirs
