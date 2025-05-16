def print_menu():
    print("\n----- MENU -----")
    print("Kota Options:")
    for  price in Kota_details.items():
        print(f"  R{price}")
    
    print("\nRefreshments:")
    for drink in Refreshments["coldrink"]:
        print(f" - {drink.title()}: R15")
    print(f" - Water: R{Refreshments['water']}")
    
    print("\nChips:")
    for size, price in Chips.items():
        print(f" - {size.title().replace('_', ' ')}: R{price}")
    print("----------------\n")

def process_order(User_Input):
    User_Input= User_Input.strip().lower()

    parts = User_Input.split(maxsplit=1)
    if len(parts) == 2 and parts[0].isdigit():
        quantity = int(parts[0])
        item_name = parts[1]
    else:
        quantity = 1
        item_name = User_Input

    normalized_item = item_name.replace(" ", "_")
    if normalized_item in Kota_details:
        price = Kota_details[normalized_item]*quantity
        category_totals["kota"] += price
    elif normalized_item in Refreshments["coldrink"]:
        price = 15*quantity
        category_totals["refreshments"] += price
    elif normalized_item == "water":
        price = Refreshments["water"]*quantity
        category_totals["refreshments"] += price
    elif normalized_item in Chips:
        price = Chips[normalized_item]*quantity
        category_totals["chips"] += price
    else:
        print("Item not on the menu.")
        return
    Ordered_items.append((f"{quantity} x {normalized_item.replace('_', ' ')}", price))

def print_receipt():
    print("\nHere is your receipt:")
    for item, price in Ordered_items:
        print(f"- {item.title().replace('_', ' ')} - R{price}")
    total = sum(category_totals.values())
    print(f"\nYour Total Price is: R{total}")

def main():
    print("Hello, Welcome to Bill Calculator")
    print_menu()
    
    while True:
        user_input = input("Enter your order (or type 'done' to finish): ").strip().lower()
        if user_input == "done":
            break
        process_order(user_input)
    
    print_receipt()


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

main()