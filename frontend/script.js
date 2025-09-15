// ------------------- singing Page Script ------------------- //
const signinForm = document.getElementById("signinpage");
if (signinForm) {
  signinForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const password = document.getElementById("Newpassword").value.trim();
    const confirmPassword = document.getElementById("Cpassword").value.trim();
    const role = document.querySelector('select[name="role"]').value;
    const joinDate = document.getElementById("joinDate").value;

    if (!name || !password || !confirmPassword || !role || !joinDate) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, role, joinDate }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        window.location.href = "Login.html";
      } else {
        alert(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong connecting to server.");
    }
  });
}


// ------------------- Loging page Script ------------------- //


const loginForm = document.getElementById("loginform");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const name = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.querySelector("select.role").value;

    if (!name || !password || !role) {
      alert("Please fill in all fields and select a role.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        if (data.role === "admin") {
          window.location.href = "Admin.html";
        } else if (data.role === "student") {
          window.location.href = "main.html";
        }
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  });
}

// ------------------- Adding Book Script ------------------- //

document.addEventListener("DOMContentLoaded", () => {

  const bookForm = document.getElementById("bookForm");
  if (bookForm) {
    bookForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const book = {
        title: document.getElementById("bookTitle").value,
        category_id: parseInt(document.getElementById("categoryId").value),
        publication_date: document.getElementById("publicationDate").value,
        copies_owned: parseInt(document.getElementById("copiesOwned").value)
      };

      try {
        const res = await fetch("http://localhost:3000/api/addbook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(book)
        });
        const data = await res.json();
        alert("Book added!");
        window.location.href = "addauthor.html";
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to add book.");
      }
    });
  }

  // ------------------- Adding Author Script ------------------- //

const addBtn = document.getElementById("addBtn");

if (addBtn) {
    addBtn.addEventListener("click", function (event) {
        event.preventDefault();

        const author = {
            first_name: document.getElementById("authorFirstName").value,
            last_name: document.getElementById("authorLastName").value
        };

        fetch("http://localhost:3000/api/addauthor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(author)
        })
        .then(res => res.json())
        .then(data => {
            alert("Author added!");
            window.location.href = "linkauthor.html";
        })
        .catch(err => {
            console.error("Error:", err.message || err);
            alert("Failed to add author.");
        });
    });
}

  // ------------------- Linking Author Script -------------------//

const linkBtn = document.getElementById("linkBtn");

if (linkBtn) {
  linkBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const book_author = {
      book_id: parseInt(document.getElementById("bookIdLink").value),
      author_id: parseInt(document.getElementById("authorIdLink").value)
    };

    fetch("http://localhost:3000/api/linkauthor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book_author)
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Author successfully linked to book!");
        window.location.href = "Admin.html";// Optionally redirect or reset form
      })
      .catch((err) => {
        console.error("Error linking author to book:", err);
        alert("Failed to link author.");
      });
  });
}

  // ------------------- Reserve Book Script-------------------//
const reserveBtn = document.getElementById('reservebtn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', function (event) {
      event.preventDefault();

      const reserveData = {
        reserveBookId: document.getElementById('reserveBookId').value,
        reserveUsername: document.getElementById('reserveUsername').value,
        reservationDate: document.getElementById('reservationDate').value,
        reservationStatusId: document.getElementById('reservationStatusId').value
      };

      fetch('http://localhost:3000/reservebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reserveData)
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Reservation complete');
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  }

 
  // ------------------- Record Fine Script-------------------//

  const fineForm = document.getElementById("fineForm");
  if (fineForm) {
    const usernameInput = document.getElementById("fineUsername");
    const userIdInput = document.getElementById("fineId");

    // Fetch userId when username loses focus
    usernameInput.addEventListener("blur", async () => {
      const username = usernameInput.value.trim();
      if (!username) return;

      try {
        const res = await fetch(`/api/get-user-id?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.userId) {
          userIdInput.value = data.userId;
        } else {
          userIdInput.value = "";
          alert("User not found!");
        }
      } catch (err) {
        console.error("Error fetching user ID:", err);
        alert("Failed to fetch user ID. Check server logs.");
      }
    });

    // Submit fine
    fineForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        userId: userIdInput.value,
        fineDate: document.getElementById("fineDate").value,
        fineAmount: document.getElementById("fineAmount").value,
        fineReason: document.getElementById("fineReason").value
      };

      if (!payload.userId) {
        alert("Please enter a valid username first.");
        return;
      }

      try {
        const res = await fetch("/api/record-fine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
          alert("Fine recorded successfully!");
          fineForm.reset();
        } else {
          alert("Failed to record fine: " + result.message);
        }
      } catch (err) {
        console.error("Error saving fine:", err);
        alert("Failed to record fine. Check server logs.");
      }
    });
  }

});





// ================== LOAN BOOK Script==================//
const loanForm = document.getElementById("loanForm");

loanForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookId = document.getElementById("loanBookId").value;
  const username = document.getElementById("loanUsername").value.trim();
  const loanDate = document.getElementById("loanDate").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!bookId || !username || !loanDate || !dueDate) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    const res = await fetch("/api/loan-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, username, loanDate, dueDate })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      loanForm.reset(); // clear after success
    } else {
      alert(data.message || "Error loaning book");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong!");
  }
});

// Book search for Loan
const loanBookInput = document.getElementById("loanBookTitle");
loanBookInput.addEventListener("input", async () => {
  const title = loanBookInput.value.trim();
  if (title.length < 2) return;

  try {
    const res = await fetch(`/api/check-book?title=${encodeURIComponent(title)}`);
    const data = await res.json();

    if (data.available) {
      document.getElementById("loanBookId").value = data.book.id;
    } else {
      document.getElementById("loanBookId").value = "";
    }
  } catch (err) {
    console.error("API error:", err);
  }
});


// ================== RETURN BOOK Script==================//
const returnForm = document.getElementById("returnForm");

returnForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookId = document.getElementById("returnBookId").value;
  const username = document.getElementById("returnUsername").value.trim();

  if (!bookId || !username) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    const res = await fetch("/api/return-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId, username })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      returnForm.reset();
    } else {
      alert(data.message || "Error returning book");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong!");
  }
});

// Book search for Return
const returnBookInput = document.getElementById("returnBookTitle");
returnBookInput.addEventListener("input", async () => {
  const title = returnBookInput.value.trim();
  if (title.length < 2) return;

  try {
    const res = await fetch(`/api/check-book?title=${encodeURIComponent(title)}`);
    const data = await res.json();

    if (data.available) {
      document.getElementById("returnBookId").value = data.book.id;
    } else {
      document.getElementById("returnBookId").value = "";
    }
  } catch (err) {
    console.error("API error:", err);
  }
});

// -------------------Pay Fine Script-------------------//

    document.addEventListener("DOMContentLoaded", () => {
      // Get all form elements
      const payForm = document.getElementById("payForm");
      const fineUsernameInput = document.getElementById("fineUsername");
      const hiddenPayId = document.getElementById("payId");
      const amountInput = document.getElementById("paymentAmount");

      if (!payForm || !fineUsernameInput || !hiddenPayId || !amountInput) {
        console.error("Some form elements are missing from the DOM.");
        return;
      }

      // Lookup user by username on blur
      fineUsernameInput.addEventListener("blur", async () => {
        const username = fineUsernameInput.value.trim();
        if (!username) {
          hiddenPayId.value = "";
          return;
        }

        try {
          const res = await fetch(`/api/users?username=${encodeURIComponent(username)}`);
          if (!res.ok) {
            hiddenPayId.value = "";
            alert("User not found. Please enter a valid username.");
            return;
          }
          const data = await res.json();
          if (!data.id) {
            hiddenPayId.value = "";
            alert("User not found. Please enter a valid username.");
            return;
          }
          hiddenPayId.value = data.id;
        } catch (err) {
          console.error("Error fetching user:", err);
          hiddenPayId.value = "";
          alert("Error checking username.");
        }
      });

      // Handle form submission
      payForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userId = hiddenPayId.value;
        const amount = amountInput.value.trim();

        if (!userId || !amount) {
          alert("Please fill all fields.");
          return;
        }

        try {
          const response = await fetch("/api/payfine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, amount })
          });

          const result = await response.json();

          if (response.ok && result.success) {
            alert(" Fine PAID!");
            payForm.reset();
            hiddenPayId.value = "";
          } else {
            alert("Failed: " + (result.message || "Error paying fine"));
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error processing payment.");
        }
      });
    });