const express = require('express'); //it's from Node.js
// express = lightweight
// routers -> organizing our endpoints
// middleware -> allows us expand and customize

const db = require('./data/db.js');

const server = express(); //it's from express as well as .listen
const { hubs } = db;

// middleware
server.use(express.json());

//creating endpoints
// I want to make something available in case anyone needs it
server.get('/', (req, res) => {
    console.log('inside the get request');
    // specify data type
    // set a status code
    // send a response
    res.send('<p>Hello World! With nodemon we can forget about restarting the server. Just run `yarn server`</p>');
});

// READ - send back a list of all hubs
server.get('/hubs', (req, res) => {
    hubs.find()
    //get the hubs from the db
    .then(allHubs => {
        // then send them back
        res.json(allHubs);
    })
    // fancy catch
    .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    })
    /* regular catch
    .catch(err => {
        res.status(500).json(err);
    }) */
})

// Create - add a new hub to the list
server.post('/hubs', (req, res) => {
    const newHub = req.body;
    hubs.add(newHub)
    .then(addedHub => {
        res.status(201).json(addedHub)
    })
    .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    });
});

// Destroy - remove a hub
server.delete('/hubs/:id', (req, res) => {
    const { id } = req.params;

    hubs.remove(id)
    .then(removedHub => {
        if (removedHub) {
            res.json(removedHub);
        } else {
            res.status(404).json({ err:'incorrect id'});
        }
    })
    .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    });
})

// Update - alter a hub
server.put('/hubs/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    hubs.update(id, changes)
    .then(updatedHub => {
        if (updatedHub) {
            res.json(updatedHub);
        } else {
            res.status(404).json({ err:'incorrect id'});
        }
    })
    .catch(({ code, message }) => {
        res.status(code).json({ err: message });
    });
})

// request handler for /now that sends back the current date in string form
server.get('/now', (req, res) => {
    // const date = new Date();
    // res.send(`${date}`);
    const now = new Date().toISOString();
    res.send(now);
})

//listening
server.listen(9090, () => {
    console.log('Listening on port 9090');
});