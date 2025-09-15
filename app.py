from flask import Flask,request,render_template,flash,redirect
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required for flash messages

# Gmail config
GMAIL_USER = ''
GMAIL_PASSWORD = ''

@app.route('/')
def home():
    return render_template('contact.html')

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']

    full_message = f"From: {name} <{email}>\n\n{message}"

    try:
        # Create MIMEText email
        msg = MIMEText(full_message)
        msg['Subject'] = 'Contact Message From '
        msg['From'] = GMAIL_USER
        msg['To'] = GMAIL_USER

        # Connect to Gmail SMTP server
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(GMAIL_USER, GMAIL_PASSWORD)
            server.send_message(msg)

        flash('Message sent successfully!')
    except Exception as e:
        print(e)
        flash('Something went wrong. Try again later.')

    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)

