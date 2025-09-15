from tkinter import *
from PIL import Image, ImageTk
from tkinter import messagebox
import json
import os

# ---- Save Password Function ---- #
def save():
    website = web_entry.get()
    username = Username_entry.get()
    password = Password_entry.get()

    new_data = {
        website: {
            "username": username,
            "password": password
        }
    }

    if len(website) == 0 or len(password) == 0:
        messagebox.showinfo(title="Oops", message="Enter all required fields")
        return
    
    # ✅ Ask user to confirm before saving
    confirm = messagebox.askyesno(title="Confirm Submission", message="Are you sure you want to save this password?")
    if not confirm:
        return  # Cancel if user chooses "No"

    try:
        with open("datapass.json", "r") as datapass_file:
            datapass = json.load(datapass_file)
    except (FileNotFoundError, json.JSONDecodeError):
        datapass = new_data
    else:
        datapass.update(new_data)

    # Write updated or new data
    with open("datapass.json", "w") as datapass_file:
        json.dump(datapass, datapass_file, indent=4)
        print("Data saved.")

    # Clear fields
    web_entry.delete(0, END)
    Password_entry.delete(0, END)

# ---- Search Password Function ---- #
def searchPassword():
    website = web_entry.get()

    if not os.path.exists("datapass.json"):
        messagebox.showinfo(title="Error", message="No data file found.")
        return

    try:
        with open("datapass.json") as datapass_file:
            datapass = json.load(datapass_file)
    except json.JSONDecodeError:
        messagebox.showinfo(title="Error", message="Data file is corrupted.")
        return

    if website in datapass:
        username = datapass[website]["username"]
        password = datapass[website]["password"]
        messagebox.showinfo(title=website, message=f"Username: {username}\nPassword: {password}")
    else:
        messagebox.showinfo(title="Not found", message=f"No details for '{website}' found.")

# ---- UI Setup ---- #
window = Tk()
window.title("My Password Storage")
window.config(padx=20, pady=20)

# Canvas & Image
canvas = Canvas(window, width=300, height=300)
canvas.pack()

try:
    img = Image.open("my-password-123456.jpg")
    img = img.resize((250, 250), Image.Resampling.LANCZOS)
    tk_image = ImageTk.PhotoImage(img)
    canvas.create_image(145, 145, image=tk_image)
except:
    canvas.create_text(145, 145, text="Image not found", fill="red", font=("Arial", 16))

canvas.grid(column=1, row=0)

# Website Label & Entry
web_label = Label(text="Name of Website:")
web_label.grid(column=0, row=1)

web_entry = Entry(width=35)
web_entry.grid(column=1, row=1)
web_entry.focus()

# Username Label & Entry
Username_label = Label(text="Email|Username:")
Username_label.grid(column=0, row=2)

Username_entry = Entry(width=35)
Username_entry.grid(column=1, row=2)
Username_entry.insert(0, "ntsakombodi@gmail.com")

# Password Label & Entry
Password_label = Label(text="Password:")
Password_label.grid(column=0, row=3)

Password_entry = Entry(width=35)
Password_entry.grid(column=1, row=3)

# Buttons
search_btn = Button(text="Search", width=20, command=searchPassword)
search_btn.grid(column=2, row=1)

add_btn = Button(text="Add", width=20, command=save)
add_btn.grid(column=1, row=4)

# Start GUI
window.mainloop()

