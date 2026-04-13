
`const express = require("express");

const router = express.Router();

router.get("/hello", (req, res) => {

    // res.send() is used to send simple text responses

    res.send("Hello VelDB API");

});

module.exports = router;`
const express = require("express");

const router = express.Router();

router.get("/hello", (req, res) => {
    res.send("Hello VelDB API");
});

module.exports = router;