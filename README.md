# Documentation
## How to run:
- In order to run, navigate to root of project and type in console `npm start` (make sure to 'npm install' before running for the first time)
- Go to `localhost:3000` to view web app
- Note: When testing locally, be sure to change every link base url from `(your heroku link)` to `localhost:3000` and revert it back for heroku deployment (although if a current version of the api was deployed previously that already serves that same route to the database, you can still modify database without changing it back to localhost)
- To deploy to heroku:
    - Follow the heroku tutorial online (something like `heroku create <your app name here>`)
    - push to that repo (`git push heroku master` or whatever branch your on)
    - navigate to that heroku link 

## Functionality:
- currently, by clicking on a location on the map, it stores the coordinates of where you click, then by clicking add files, you can add a marker with the image of what you select by clicking on an image after clicking the map (Do not click select file before)
- Persistent storage
- Google sign in api integrated
- Mapbox api implemented


## Things that might break:
- Since Vue and Express both have routers, be sure to not have two routes overlap between client and api
- After adding about 20 locations, something random error occured when trying to add another photo, deleting the user fixed the problem, haven't replicated this issue



## Features to implement
### Front end:
- Need to add url to Oath authorization to get gooogle verification set up
- UI for adding photos (they need a place to get location like a button, a submit button, a search bar and a place to enter coordinates if they have to (optional))
- Some UI for deleting photos
- change navbar based on state of sign in
- Get location data using browser location access
- UI to list friends (and display that list), add a friend, remove a friend
-
### Back end:
- Create a create user (by either a local signin or by google signin)
- Add an about/account page
- Develop schema to include things like image tags
- Filter images by tag, location/distance?, whether or not signed in or out (show only your tags by default?)
- Make api requests for deleting user, deleting photo, and creating user, and getting filtered search results, editing existing photos (add tag, change location)
