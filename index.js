const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
    origin : ['http://localhost:5173'],
    credentials : true,
    optionsSuccessStatus : 200
}));
app.use(express.json());

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.fyqjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        //create jwt token for uer
        app.post('/jwt',(req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : '1d'});
            res
            .cookie('token', token, {
                httpOnly : true,
                secure : process.env.NODE_ENV = 'production' ? true : false,
                sameSite : process.env.NODE_ENV = 'production' ? 'none' : 'strict'
            })
            .send({result : true})
        })

        //clear jwt token when log out
        app.get('/logout', (req, res) => {
            res
            .clearCookie('token', {
                httpOnly : true,
                secure : process.env.NODE_ENV = 'production' ? true : false,
                sameSite : process.env.NODE_ENV = 'production' ? 'none' : 'strict',
                maxAge : 0
            })
            .send({result : true});
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING...')
})

app.listen(port, () => {
    console.log(`server is running from ${port} port number`)
})