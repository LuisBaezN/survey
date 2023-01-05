const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

// init app & middleware
const app = express();
app.use(express.json());

// DB connection
let db;
let port = process.env.PORT || 3000;


connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`> App escuchando en el puerto ${port}`);
        });
        db = getDb();
    }
})

// Rutas
app.get('/books', (req, res) => {
    // after books in the addres add ? and then p, in this case
    // current page
    const page = req.query.p || 0; // p can change to anything
    const booksPerPage = 3;

    let books = [];

    db.collection('books')
        .find()
        .sort({ autor: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: "Could not fetch the documents"})
        })
});

app.get('/books/:id', (req, res) => {
    // verify null when id is not in the collection
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .findOne({_id: ObjectId(req.params.id)})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not fetch the document'})
            })
    } else {
        res.status(501).json({error: 'Not a valid doc id'})
    }
})

app.post('/books', (req, res) => {
    const book = req.body;

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not create a new document'})
        })
})

app.delete('/books/:id', (req, res) => {
    // verify null when id is not in the collection
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .deleteOne({_id: ObjectId(req.params.id)})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not delete the document'})
            })
    } else {
        res.status(501).json({error: 'Not a valid doc id'})
    }
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body;

    // verify null when id is not in the collection
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not update the document'})
            })
    } else {
        res.status(501).json({error: 'Not a valid doc id'})
    }
})