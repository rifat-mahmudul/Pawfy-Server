const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());

//verify token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).send({message : 'Unauthorized Access'});
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).send({message : 'Unauthorized Access'});
            }
            req.user = decoded;
            next();
        })
    }
}

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

        const userCollection = client.db('Pawfy').collection('users');
        const petsCollection = client.db('Pawfy').collection('pets');
        const donateCampaignCollection = client.db('Pawfy').collection('donationCampaign')

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

        //save user data in DB
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = {email : user?.email};
            const isExist = await userCollection.findOne(query);

            if(isExist) return res.status(401).send({message : 'User Already Save In Database'})
            
            const result = await userCollection.insertOne({
                ...user,
                Timestamp : Date.now()
            });
            res.send(result);
        })

        //get user data by email
        app.get('/user/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email : email};
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        //post pet on DB
        app.post('/pets', verifyToken, async(req, res) => {
            try {
                const petData = req.body;
                const result = await petsCollection.insertOne(petData);
                res.send(result);
            } catch (error) {
                console.log(`error from post pet data : ${error}`);
                res.status(500).send({message : `error from post pet data : ${error}`})
            }
        })

        //get pets for specific user by email 
        app.get('/pets/:email', verifyToken, async(req, res) => {
            try {
                const email = req.params.email;
                const query = {userEmail : email};
                const result = (await petsCollection.find(query).sort({'date' : -1}).toArray());
                res.send(result)
            } catch (error) {
                console.log(`error from get pets for specific user by email : ${error}`);
                res.status(500).send(`error from get pets for specific user by email : ${error}`)
            }
        })

        //get single pet by id
        app.get('/pet/:id', async(req, res) => {
            try {
                const id = req.params.id;
                const query = {_id : new ObjectId(id)};
                const result = await petsCollection.findOne(query);
                res.send(result);
            } catch (error) {
                console.log(`error from get single pet by id : ${error}`);
                res.status(500).send(`error from get single pet by id : ${error}`)
            }
        })

        //update pet data
        app.patch('/pet/:id', verifyToken, async(req, res) => {
            const petData = req.body;
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const updateDoc = {
                $set : {
                    ...petData,
                }
            }
            try {
                const result = await petsCollection.updateOne(query, updateDoc);
                res.send(result);
            } catch (error) {
                console.log(error);
                res.status(500).send({error : `An error occurred while update pet data : ${error}`})
            }
        })

        //delete pet by id
        app.delete('/pet/:id', async(req, res) => {
            try {
                const id = req.params.id;
                const query = {_id : new ObjectId(id)};
                const result = await petsCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.log(`error from delete pet : ${error}`);
                res.status(500).send(`error from delete pet : ${error}`)
            }
        })

        //create donatio on DB
        app.post('/donation', verifyToken, async(req, res) => {
            try {
                const donateData = req.body;
                const result = await donateCampaignCollection.insertOne(donateData);
                res.send(result);
            } catch (error) {
                console.log(`error from create donate data ${error}`);
                res.status(500).send({message : `error from create donate data ${error}`})
            }
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