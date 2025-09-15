from flask import Flask, jsonify, render_template, request, session
import smtplib
from email.mime.text import MIMEText
from flask import Flask, request, jsonify
import json
from datetime import datetime
import random

app = Flask(__name__)
app.secret_key = "super-secret- key"


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/checkout')
def checkout():
    return render_template('checkout.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/chips')
def chips():
    return render_template('chips.html')

@app.route('/kota')
def kota():
    return render_template('kota.html')

@app.route('/drinks')
def drinks():
    return render_template('drinks.html')

@app.route("/update_order", methods=["POST"])
def update_order():
    data = request.get_json()
    item_id = data["item_id"]
    item_name = data["item_name"]
    price = data["price"]
    quantity = data["quantity"]

    # Save order in session
    if "order" not in session:
        session["order"] = {}
    session["order"][item_id] = {
        "name": item_name,
        "price": price,
        "quantity": quantity
    }
    session.modified = True

    return jsonify({"message": "Order updated"})


@app.route('/get_order')
def get_order():
    order = session.get("order", {})
    return jsonify(order)

@app.route("/process_payment", methods=["POST"])
def process_payment():
    data = request.get_json()
    items = data.get("items", [])
    total = data.get("total", 0)

    # Generate random order number
    order_number = f"ORD{random.randint(1000, 9999)}"

    # Prepare order data
    order_data = {
        "order_number": order_number,
        "items": items,
        "total": total,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # Save to a JSON file
    try:
        with open("orders.json", "r") as f:
            all_orders = json.load(f)
    except FileNotFoundError:
        all_orders = []

    all_orders.append(order_data)

    with open("orders.json", "w") as f:
        json.dump(all_orders, f, indent=4)

    #  Clear the cart after payment
    session["order"] = {}

    print("Processing payment for:", items)
    # ✅ Return full order data instead of just message
    return jsonify(order_data)

# Email settings
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your_email@gmail.com"
SENDER_PASSWORD = "your_app_password"  # Use Gmail App Password, not your real password
RECEIVER_EMAIL = "your_email@gmail.com"  # Where you want to receive contact messages

@app.route("/send_contact", methods=["POST"])
def send_contact():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    # Create email content
    subject = f"New Contact Form Submission from {name}"
    body = f"""
    You have a new message from your website contact form.

    Name: {name}
    Email: {email}
    Message:
    {message}
    """
    msg = MIMEText(body)
    msg["Subject"] = "New message from customer"
    msg["From"] = ""
    msg["To"] = RECEIVER_EMAIL

    try:
        # Connect to Gmail SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)

        return jsonify({"message": " Your message has been sent successfully!"})
    except Exception as e:
        return jsonify({"message": f" Failed to send message: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)

