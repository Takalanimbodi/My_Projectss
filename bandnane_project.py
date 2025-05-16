'''PROCEDUAL PROGRAMMING'''
import datetime

Kota_details = {
    "normal_kota": 20,
    "kota_with_viani": 25,
    "kota_with_russian": 30,
    "kota_with_vian_n_russian": 35
}

Refreshments = {
    "coldrink": ["coke", "fanta_orange", "sprite", "fanta_grape"],
    "water": 10
}

Chips = {
    "small_chips": 25,
    "medium_chips": 35,
    "large_chips": 45
}

category_totals = {"kota": 0, "refreshments": 0, "chips": 0}
Ordered_items = []

def print_menu():
    print("\n----- MENU -----")
    print("Kota Options:")
    for item, price in Kota_details.items():#gets all key and value of kota_detail dictionary same as for Refreshments and drinks dictionaries
        print(f" - {item.title().replace('_', ' ')}: R{price}")
    
    print("\nRefreshments:")
    for drink in Refreshments["coldrink"]:
        print(f" - {drink.title()}: R15")
    print(f" - Water: R{Refreshments['water']}")
    
    print("\nChips:")
    for size, price in Chips.items():
        print(f" - {size.title().replace('_', ' ')}: R{price}")
    print("----------------\n")

def process_order(user_input):
    if not user_input:
        print(" Empty input. Please enter a valid order.")
        return

    parts = user_input.split(maxsplit=1)
    if len(parts) == 2 and parts[0].isdigit():
        quantity = int(parts[0])
        item_name = parts[1].strip().lower()
    elif len(parts) == 2 and parts[1].isdigit():
        
        print(" Please enter the quantity first, like '2 coke', not 'coke 2'.")
        return None, None
    
    elif len(parts) == 1:
        return 1, parts[0].strip().lower()
    else:
        print(" Invalid input format. Please enter something like '2 coke' or 'normal kota'.")
        return None, None
    
    if quantity <= 0:
        print(" Quantity must be greater than zero.")
        return

    normalized_item = item_name.replace(" ", "_")

    if normalized_item in Kota_details:
        price = Kota_details[normalized_item] * quantity
        category_totals["kota"] += price
    elif normalized_item in Refreshments["coldrink"]:
        price = 15 * quantity
        category_totals["refreshments"] += price
    elif normalized_item == "water":
        price = Refreshments["water"] * quantity
        category_totals["refreshments"] += price
    elif normalized_item in Chips:
        price = Chips[normalized_item] * quantity
        category_totals["chips"] += price
    else:
        print(" Item not on the menu. Please try again.")
        return

    Ordered_items.append((f"{quantity} x {item_name}", price))
    print(f" Added {quantity} x {item_name} - R{price}")

def print_receipt():
    print("\n Here is your receipt:")
    receipt_lines = []
    for item, price in Ordered_items:
        line = f"- {item.title()} - R{price}"
        print(line)
        receipt_lines.append(line)
    
    total = sum(category_totals.values())
    total_line = f"\nTotal Price: R{total}"
    print(total_line)

    # Save to file
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("receipt.txt", "w") as file:
        file.write("BILL RECEIPT\n")
        file.write(f"Date: {timestamp}\n\n")
        for line in receipt_lines:
            file.write(line + "\n")
        file.write(total_line + "\n")
    
    print(" Receipt saved to 'receipt.txt'.")

def main():
    print("Hello, Welcome to Bill Calculator!")
    print_menu()

    while True:
        user_input = input("Enter order e.g '2 coke'(or type 'done' to finish): ").strip().lower()
        if user_input == "done":
            break
        process_order(user_input)

    if Ordered_items:
        print_receipt()
    else:
        print(" No items were ordered. Exiting.")


main()
