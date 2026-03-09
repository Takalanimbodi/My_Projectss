# Tkinter Password Manager

A simple **desktop password manager** built using **Python**, **Tkinter**, and **JSON** for local storage.  
Store, retrieve, and manage passwords securely with a user-friendly GUI.


## Features

- Save website login credentials (website, username/email, password)
- Search for stored credentials by website name
- Confirmation prompt before saving passwords
- Handles missing or corrupted data files gracefully
- Easy-to-use graphical interface using Tkinter
- Optional default username/email prefilled

---

## Tech Stack

- **Frontend / GUI**: Tkinter, Pillow (PIL)
- **Backend / Storage**: JSON file (`datapass.json`)
- **Language**: Python 3.10+
- **Libraries**:
  - `tkinter` – GUI interface
  - `Pillow` – Image support
  - `json` – Read/write credentials
  - `os` – File operations
  - `messagebox` – Alerts & confirmations

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tkinter-password-manager.git
cd tkinter-password-manager
