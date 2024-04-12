import mysql from 'mysql2/promise';
import fs from 'fs';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog_node_js',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
})
                                            ////////////////
                                            // GET POST
                                            ////////////////
export async function getAllPost(req, res) {
    try {
        const [rows] = await pool.query('SELECT * from Posts');
        res.render('admin', {posts: rows});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}


export async function getPost(req, res) {
    const id = req.params.id;
    const path = req.path;

    try {
        const postQuery = 'SELECT * FROM Posts WHERE id = ?';
        const [rows] = await pool.query(postQuery, [id]);

        if (rows.length === 0) {
            return res.status(404).json({error: 'Post not found'});
        }

        const post = rows[0];
        const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [post.categorie_id]);

        if (categories.length === 0) {
            return res.status(404).json({error: 'Category not found'});
        }

        const category = categories[0];

        if (path.includes('/edit')) {
            const [allCats] = await pool.query('SELECT * FROM categories');
            res.render('layouts/editPost', {post: post, postCat: category, allCat: allCats});
        } else if (path.includes('/view')) {
            res.render('layouts/view', {post: post, postCat: category});
        }
    } catch (error) {
        console.error("Database or server error:", error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}


export async function getLastThreePosts(req, res) {
    try {

        const [lastThreePosts] = await pool.execute(`
        SELECT
        Posts.id,
            Posts.titre AS post_titre,
            Posts.content,
            Posts.picture,
            categories.titre AS categorie_titre,
            categories.color AS categorie_color
        FROM
        Posts
        INNER JOIN
        categories ON Posts.categorie_id = categories.id
        ORDER BY
        Posts.created_date DESC
        LIMIT 3
        `)
        res.render('index', {posts: lastThreePosts});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
}

                                                ////////////////
                                                // CREATE
                                                ////////////////
export async function createPost(req, res) {
    const titre = req.body.titre;
    const content = req.body.content;
    const categorie = req.body.categorie;
    const alt = req.body.alt;
    const imgFile = req.file;

    /*  if (!imgFile) {
          return res.status(400).send("Aucun fichier n'a été téléchargé.");
      }
    */
    const imagePath = '/uploads/' + imgFile.filename;

    try {
        await pool.execute('INSERT INTO Posts (categorie_id, titre, content, picture, alt) VALUES (?,?,?,?,?)', [categorie, titre, content, imagePath, alt]);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function createCat(req, res) {
    const titre = req.body.titre;
    const color = req.body.color;

    try {
        await pool.execute('INSERT INTO categories (titre, color) VALUES (?, ?)', [titre, color]);
        res.redirect('/admin')
    } catch (error) {
        console.error("Failed to insert category:", error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function createPostPage(req, res) {

    try {
        const [rows] = await pool.execute('SELECT * FROM categories')
        console.log(rows)
        res.render('layouts/addPost', {categories: rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
};


                                                    ////////////////
                                                    // UPDATE POST
                                                    ////////////////
export async function updatePost(req, res) {
    const {id} = req.params;
    const titre = req.body.titre;
    const content = req.body.content;
    const categorie = req.body.categorie;
    const alt = req.body.alt;
    const imgFile = req.file;
    const oldImgFile = req.body.oldPicture;
    console.log(imgFile)
    let imagePath;
    if (imgFile !== undefined) {
        imagePath = '/uploads/' + imgFile.filename;
        try {
            fs.unlinkSync(oldImgFile);
            console.log("Fichier supprimé avec succès.");
        } catch (err) {
            console.error("Une erreur est survenue lors de la suppression du fichier :", err);
        }
    } else {
        imagePath = oldImgFile;
    }
    try {
        await pool.execute('UPDATE Posts SET titre = ?, categorie_id = ?, content = ?, picture = ?, alt = ? WHERE id = ?', [titre, categorie, content, imagePath, alt, id]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour de la tâche");
    }
}
                                                            ////////////////
                                                            // DELETE POST
                                                            ////////////////
export async function deletePost(req, res) {
    const id = req.params.id;
    try {
        const [rows] = await pool.query('SELECT picture FROM Posts WHERE id = ?', [id]);
        if (rows.length > 0) {
            const picturePath = rows[0].picture;
            if (picturePath) {
                fs.unlinkSync('public' + picturePath);
                console.log("Fichier supprimé avec succès.");
            }
        }
        await pool.execute('DELETE FROM Posts WHERE id = ?', [id]);
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression du post");
    }
}




