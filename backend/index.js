import path from "path";
import express from 'express';
import cors from 'cors';
import db from './db.js';  // note the .js extension here
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;



// Serve frontend folder
app.use(express.static(path.resolve("../frontend")));
app.use(cors()); 
app.use(express.json());
app.get("/",(req,res)=>{
  res.send("server is ready")
})

// registration route to add a user
app.post('/api/register', (req, res) => {
  const { name, password, role,  joinDate} = req.body;
   console.log("Incoming registration:", req.body);

   if (!name || !password || !role || !joinDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = 'INSERT INTO users (name, password, role, join_date) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, password, role, joinDate], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    console.log("Insert result:", result); 
    res.json({ message: 'User registered successfully!' });
  });

});

//  Login route 
app.post('/api/login', (req, res) => {
  const { name, password, role } = req.body;

  console.log("Login attempt:", req.body); 

  if (!name || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = 'SELECT * FROM users WHERE name = ? AND password = ? AND role = ?';
  db.query(sql, [name, password, role], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log("Login results:", results); 

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials or role.' });
    }

    const user = results[0];
    res.json({ message: 'Login successful', role: user.role });
  });
});

//adding book route
app.post('/api/addbook', (req, res) => {
    const { title, category_id, publication_date, copies_owned } = req.body;

    const query = `INSERT INTO book (title, category_id, publication_date, copies_owned)
                   VALUES (?, ?, ?, ?)`;

    db.query(query, [title, category_id, publication_date, copies_owned], (err, result) => {
        if (err) {
            console.error('Error inserting book:', err);
            return res.status(500).json({ error: 'Failed to add book' });
        }

        res.status(200).json({ message: 'Book added successfully', book_id: result.insertId });
    });
});

//adding author route
app.post('/api/addauthor', (req, res) => {
    const { first_name, last_name } = req.body;

    const sql = `INSERT INTO author (first_name, last_name) VALUES (?, ?)`;
    db.query(sql, [first_name, last_name], (err, result) => {
        if (err) {
            console.error("Error inserting author:", err);
            return res.status(500).json({ error: "Failed to add author" });
        }
        res.status(200).json({ message: "Author added", author_id: result.insertId });
    });
});

//linking author route
app.post('/api/linkauthor', (req, res) => {
  const { book_id, author_id } = req.body;

  const sql = `INSERT INTO book_author (book_id, author_id) VALUES (?, ?)`;

  db.query(sql, [book_id, author_id], (err, result) => {
    if (err) {
      console.error('Error linking author:', err);
      return res.status(500).json({ error: 'Failed to link author to book' });
    }

    res.status(200).json({ message: 'Author linked to book successfully' });
  });
});

//reserving book
app.post('/reservebook', (req, res) => {
  const { reserveBookId, reserveUsername, reservationDate, reservationStatusId } = req.body;

  const getUserQuery = 'SELECT id FROM users WHERE name = ?';
  db.query(getUserQuery, [reserveUsername], (err, userResults) => {
    if (err) return res.status(500).send({ error: err.message });

    if (userResults.length === 0) {
      return res.status(404).send({ error: 'User not found' });
    }

    const userId = userResults[0].id;

    const insertQuery = `
      INSERT INTO reservations (book_id, user_id, reservation_date, status_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(insertQuery, [reserveBookId, userId, reservationDate, reservationStatusId], (err, result) => {
      if (err) return res.status(500).send({ error: err.message });

      res.status(201).send({ message: 'Book reserved successfully', reservation_id: result.insertId });
    });
  });
});

// Record fine form
// --- Get user ID by username ---
app.get("/api/get-user-id", (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ message: "Username required" });

  const sql = "SELECT id FROM users WHERE name = ? LIMIT 1"; // make sure 'name' matches your column
  db.query(sql, [username], (err, rows) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length > 0) {
      res.json({ userId: rows[0].id });
    } else {
      res.json({ userId: null }); 
    }
  });
});

// --- Record fine ---
app.post("/api/record-fine", (req, res) => {
  const { userId, fineDate, fineAmount, fineReason } = req.body;

  if (!userId || !fineDate || !fineAmount) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const sql = "INSERT INTO fines (user_id, fine_date, amount, reason, status) VALUES (?, ?, ?, ?, 'pending')";
  db.query(sql, [userId, fineDate, fineAmount, fineReason], (err, result) => {
    if (err) {
      console.error("DB Error inserting fine:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, fineId: result.insertId });
  });
});


//  Check book by title (autocomplete style)
app.get("/api/check-book", (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ available: false, message: "No title provided" });
  }

  const query = "SELECT id, title FROM book WHERE title LIKE ? LIMIT 5";
  db.query(query, [`%${title}%`], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ available: false, message: "Database error" });
    }

    if (results.length === 0) {
      return res.json({ available: false, message: "Book not found" });
    }

    res.json({ available: true, book: results[0], matches: results });
  });
});


// Loan book
app.post("/api/loan-book", (req, res) => {
  const { bookId, username, loanDate, dueDate } = req.body;

  if (!bookId || !username || !loanDate || !dueDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if book is already on loan
  const checkLoanQuery = "SELECT id FROM loans WHERE book_id = ? AND status = 'On Loan'";
  db.query(checkLoanQuery, [bookId], (err, rows) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length > 0) {
      return res.status(400).json({ message: "Book is already on loan" });
    }

    // Insert loan record
    const insertQuery = `
      INSERT INTO loans (book_id, username, loan_date, due_date, status)
      VALUES (?, ?, ?, ?, 'On Loan')
    `;
    db.query(insertQuery, [bookId, username, loanDate, dueDate], (err2, result2) => {
      if (err2) {
        console.error("DB error:", err2);
        return res.status(500).json({ message: "Error inserting loan" });
      }

      res.json({ message: "Book loaned successfully", loanId: result2.insertId });
    });
  });
});


//  Return book
app.post("/api/return-book", (req, res) => {
  const { bookId, username } = req.body;

  if (!bookId || !username) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const updateQuery = `
    UPDATE loans 
    SET status = 'Returned' 
    WHERE book_id = ? AND username = ? AND status = 'On Loan'
  `;

  db.query(updateQuery, [bookId, username], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No active loan found for this book/user" });
    }

    res.json({ message: "Book returned successfully!" });
  });
});

// ----------- Pay Fine API -----------
// Search user by name for Pay Fine
app.get("/api/users", (req, res) => {
  const username = req.query.username?.trim();
  if (!username) return res.status(400).json({ success: false, message: "Username query is required" });

  const query = "SELECT id, name FROM users WHERE name LIKE ? LIMIT 1";
  db.query(query, [`%${username}%`], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    res.json(results[0]);
  });
});

// POST /api/payfine
app.post("/api/payfine", (req, res) => {
  const { userId, amount } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  const query = `
    UPDATE fines
    SET status = 'paid', amount = ?
    WHERE user_id = ? AND status = 'pending'
    ORDER BY fine_id DESC
    LIMIT 1
  `;

  db.query(query, [amount, userId], (err, result) => {
    if (err) {
      console.error("Database error:", err.sqlMessage);
      return res.status(500).json({ success: false, message: "Database error: " + err.sqlMessage });
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Fine updated to PAID" });
    } else {
      res.status(404).json({ success: false, message: "No pending fine found for this user" });
    }
  });
});











// Start the server
app.listen(port,()=>{
  console.log(`Serve at http://localhost:${port}`)
})
