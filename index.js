require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KAY);
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
        const donateCampaignCollection = client.db('Pawfy').collection('donationCampaign');
        const adoptCollection = client.db('Pawfy').collection('adoptionRequest');
        const donationCollection = client.db('Pawfy').collection('donation')

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

        //verifyAdmin
        const verifyAdmin = async (req, res, next) => {
            const user = req.user;
            const query = {email : user?.email};
            const result = await userCollection.findOne(query);
            if(!result || result?.role !== "admin"){
                return res.status(401).send({ message: 'unauthorized access!!' })
            }
            next();
        }

        //create payment intent
        app.post('/create-payment-intent', verifyToken, async(req, res) => {
            const {petId, amount} = req.body;
            const pet = await donateCampaignCollection.findOne({_id : new ObjectId(petId)});

            if(!pet){
                return res.status(400).send({ message: 'Plant Not Found' })
            }

            const donateAmount = amount * 100;

            const { client_secret } = await stripe.paymentIntents.create({
                    amount: donateAmount,
                    currency: 'usd',
                    automatic_payment_methods: {
                    enabled: true,
                },
            });
            res.send({ clientSecret: client_secret });
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

        //get all user data for admin 
        app.get('/users', verifyToken, verifyAdmin, async(req, res) => {
            try {
                const result = await userCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.log(`error from get all user data for admin  : ${error}`);
                res.status(500).send({message : `get all user data for admin  : ${error}`})
            }
        })

        //update user data (Make admin)
        app.patch('/user/admin/:id', verifyToken, verifyAdmin, async(req, res) => {
            const id = req.params.id;
            const userData = req.body;
            const query = {_id : new ObjectId(id)};
            const updateDoc = {
                $set : {
                    ...userData
                }
            }

            try {
                const result = await userCollection.updateOne(query, updateDoc);
                res.send(result);
            } catch (error) {
                console.log(`error from update user data  : ${error}`);
                res.status(500).send({message : `error from update user data  : ${error}`})
            }
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

        //get all pets
        app.get('/pets', async(req, res) => {

            const {search, category} = req.query;
            let filterOption = {};

            if(search){
                filterOption.petName = { $regex: search, $options: "i" };
            }

            if(category) {
                filterOption.category = category;
            }

            try {
                const result = 
                await petsCollection
                .find(filterOption)
                .toArray();
                res.send(result);
            } catch (error) {
                console.log(`error from get all pets : ${error}`);
                res.status(500).send(`error from get all pets : ${error}`)
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

        //update adopt data
        app.patch('/pets/adopt/:id', verifyToken, async(req, res) => {
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
        app.delete('/pet/:id', verifyToken, async(req, res) => {
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

        //request adopt data
        app.post('/adopt-request', verifyToken, async(req, res) => {
            try {
                const adoptData = req.body;
                const result = await adoptCollection.insertOne(adoptData);
                res.send(result);
            } catch (error) {
                console.log(`Error from request adopt data : ${error}`);
                res.status(500).send(`Error from request adopt data : ${error}`)
            }
        })

        //get specific adopt request data by user email
        app.get('/adopt-request/:email', verifyToken, async(req, res) => {
            try {
                const email = req.params.email;
                const query = {petOwner : email};
                const result = await adoptCollection.find(query).toArray();
                res.send(result)
            } catch (error) {
                console.log(`error from get specific adopt request data by user email : ${error}`);
                res.status(500).send(`error from get specific adopt request data by user email : ${error}`)
            }
        })

        //update adopt request data 
        app.patch('/adopt-request/:id', verifyToken, async(req, res) => {
            try {
                const adoptData = req.body;
                const id = req.params.id;
                const query = {_id : new ObjectId(id)};

                const updateDoc = {
                    $set : {
                        ...adoptData
                    }
                }
                const result = await adoptCollection.updateOne(query, updateDoc);
                res.send(result);
            } catch (error) {
                console.log(`error from update adopt request data  : ${error}`);
                res.status(500).send(`error from update adopt request data  : ${error}`)
            }
        })

        //create donation campaign on DB
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

        //get all donationCampaign from DB
        app.get('/donationCampaigns', async(req, res) => {

            const {search} = req.query;
            let filterOption = {};

            if(search){
                filterOption.petName = { $regex: search, $options: "i" };
            }

            try {
                const result = await donateCampaignCollection.find(filterOption).toArray();
                res.send(result);
            } catch (error) {
                console.log(`error from get all donationCampaign from DB ${error}`);
                res.status(500).send({message : `error from get all donationCampaign from DB ${error}`})
            }
        })

        //get all donationCampaign from DB for specific user
        app.get('/donationCampaigns/:email', verifyToken, async(req, res) => {
            try {
                const email = req.params.email;
                const query = {userEmail : email};
                const result = await donateCampaignCollection.find(query).sort({'date' : -1}).toArray()
                res.send(result);
            } catch (error) {
                console.log(`error from get all donationCampaign from DB for specific user ${error}`);
                res.status(500).send({message : `error from get all donationCampaign from DB for specific user ${error}`})
            }
        })

        //get specific donation campaign data by id
        app.get('/campaign/:id', async(req, res) => {
            try {
                const id = req.params.id;
                const query = {_id : new ObjectId(id)};
                const result = await donateCampaignCollection.findOne(query);
                res.send(result);
            } catch (error) {
                console.log(`error from get specific donation campaign data by id ${error}`);
                res.status(500).send({message : `error from get specific donation campaign data by id ${error}`})
            }
        })

        //update donation info on DB
        app.patch('/donationCampaign/:id', verifyToken, async(req, res) => {
            try {
                const id = req.params.id;
                const query = {_id : new ObjectId(id)};
                const donationInfo = req.body;
                const updateDoc = {
                    $set : {
                        ...donationInfo
                    }
                }
                const result = await donateCampaignCollection.updateOne(query, updateDoc);
                res.send(result);
            } catch (error) {
                console.log(`error from update donation info on DB ${error}`);
                res.status(500).send(`error from update donation info on DB ${error}`)
            }
        })

        //delete campaign 
        app.delete('/campaigns/:id', verifyToken, verifyAdmin, async(req, res) => {
            try {
                const id = req.params.id;
                const query = {_id : new ObjectId(id)};
                const result = await donateCampaignCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.log(`error from delete campaign  ${error}`);
                res.status(500).send(`error from delete campaign  ${error}`)
            }
        })

        //post donation
        app.post('/all-donation', verifyToken, async(req, res) => {
            try {
                const donationInfo = req.body;
                const result = await donationCollection.insertOne(donationInfo);
                res.send(result);
            } catch (error) {
                console.log(`error from post donation ${error}`);
                res.status(500).send(`error from post donation ${error}`)
            }
        })

        //get donation info for specific user
        app.get('/my-donations/:email', verifyToken, async(req, res) => {
            try {
                const email = req.params.email;
                const query = {"donatorData.donator.email" : email};
                const result = await donationCollection.find(query).toArray();
                res.send(result);
            } catch (error) {
                console.log(`error from get donation info for specific user : ${error}`);
                res.status(500).send(`error from get donation info for specific user : ${error}`)
            }
        })

        //delete donation info
        app.delete('/donations/:id', async(req, res) => {
            try {
                const id = req.params.id;
                const query = {_id : new ObjectId(id)};
                const result = await donationCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                console.log(`error from delete donation info : ${error}`);
                res.status(500).send(`error from delete donation info : ${error}`)
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