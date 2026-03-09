# Flask Food Ordering & Contact System

A simple **food ordering web application** built with **Flask**. Users can browse items, add them to a cart, checkout, and submit contact forms. Orders are stored locally in JSON, and contact messages are sent via Gmail SMTP.


## Features

- Browse food items by category: Chips, Kota, Drinks
- Add items to a cart and update quantities
- Checkout with total calculation
- Orders stored locally in `orders.json`
- Contact form with email notifications
- Randomized order numbers for each purchase
- Session-based cart management

---

## Tech Stack

- **Backend / Web Framework**: Flask
- **Frontend**: HTML, CSS, JavaScript (rendered via Flask templates)
- **Email**: SMTP via Gmail
- **Storage**: JSON files (`orders.json`)
- **Language**: Python 3.10+

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/flask-food-ordering.git
cd flask-food-ordering
