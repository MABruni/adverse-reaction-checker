# Adverse Reaction Checker
Team Project for CS361.  Adverse Reaction Checker for FDA approved drugs using the OpenFDA API. The program is developed using React with the Vite tool and typescript as the main language. It is implemented using two microservices, for it to work correctly both need to be running.

# Main webpage
Written in typescript and developed by me. This microservice performs the search, input validation and result display for users.<p>
It can be started locally using the command `npm run dev`.

# Partner's microservice
Written in JavaScript and developed by my partner Jack Youssef. This microservice performs the API call to openFDA that returns all the adverse reactions associated with the searched drug.<p>
It can be started locally by running `node microservice.js`
