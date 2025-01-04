const express = require('express');
const morgan = require('morgan');
const app = express();

let persons = [
    { id: "1", name: "Arto Hellas", number: "040-123456" },
    { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
    { id: "3", name: "Dan Abramov", number: "12-43-234345" },
    { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Middleware to parse JSON
app.use(express.json());

// Custom token to log request body for POST requests
morgan.token('post-data', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''; 
});

// Use Morgan middleware with custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

// Route: Return all persons
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

// Route: Add a new contact
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    const nameExists = persons.some(p => p.name === name);
    if (nameExists) {
        return res.status(400).json({ error: "Name must be unique" });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 1000000).toString(),
        name,
        number
    };

    persons.push(newPerson);
    res.json(newPerson);
});

const PORT = 3001;
app.use(express.static('dist'));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
