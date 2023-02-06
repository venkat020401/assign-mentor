const express = require("express");
const route = express();
const mongodb = require("mongodb");
const dotenv = require("dotenv").config();
const mongoclient = mongodb.MongoClient;
const URL = process.env.DB;

route.use(express.json());

// create-mentor
route.post('/create-mentor', async (req, res) => {

    try {

        const connection = await mongoclient.connect(URL);
        const db = connection.db("student-mentor");
        const collection = db.collection("Mentors");
        const users = await collection.insertOne(req.body);
        await connection.close();

        res.json({ message: "Mentor created" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

// create-student
route.post('/create-student', async (req, res) => {

    try {

        const connection = await mongoclient.connect(URL);
        const db = connection.db("student-mentor");
        const collection = db.collection("Students");
        const users = await collection.insertOne(req.body);
        await connection.close();

        res.json({ message: "Student created" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});


// assign or change mentor for particular student
route.post('/assign-mentor-toStudent', async (req, res) => {
    try {

        const connection = await mongoclient.connect(URL);
        const db = connection.db("student-mentor");
        const collection = db.collection("Students");
        const students = await collection.findOneAndUpdate({ _id: mongodb.ObjectId(req.body.studentid) }, {
            $set: {
                mentor: req.body.mentorid
            }
        });
        await connection.close();

        res.json({ students, message: "Mentor assigned to student" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

// show the all students for particular mentor
route.get('/students-For-Specified-Mentor', async (req, res) => {
    try {

        const connection = await mongoclient.connect(URL);
        const db = connection.db("student-mentor");
        const collection = db.collection("Students");
        const students = await collection.find({ mentor: req.body.mentorid }).toArray();
        await connection.close();

        res.json({ students, message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

// Select one mentor and Add multiple Student 
// node : A student who has a mentor should not be shown in List
route.post('/addMentor-toStudents', async (req, res) => {
    try {

        const connection = await mongoclient.connect(URL);
        const db = connection.db("student-mentor");
        const collection = db.collection("Students");
        const students = await collection.update({mentor_assigned:false},{$set:{
            mentorid:req.body.mentorid,
            mentor_assigned:true
        }});
        await connection.close();

        res.json({ students, message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

route.listen(8000);