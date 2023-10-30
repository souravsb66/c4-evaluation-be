const jwt = require("jsonwebtoken");

const auth = (req,res,next) => {

    const token = req.headers.authorization?.split(" ")[1];

    if(token) {
        jwt.verify(token, "avengers", (err, decoded) => {
            if(decoded) {

                // console.log(decoded);
                const {name, userID} = decoded;
                // console.log(name, userID);

                req.body.name = name;
                req.body.userID = userID;

                // console.log(req.body)
                next();
            }
            else {
                res.status(200).send({"message": "Authorization failed!"});
            }
        })
    }
    else {
        res.status(400).send({"error": "Login First!"});
    }
}

module.exports = {
    auth
}