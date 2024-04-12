import express from "express";
import expressLayouts from 'express-ejs-layouts';


import mysql from 'mysql2/promise.js';
import blogsRouter from './routes/blogRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3002;

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'blog/main');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', blogsRouter);

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
