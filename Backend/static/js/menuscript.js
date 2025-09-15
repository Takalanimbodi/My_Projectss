// menu.js - Works for all menu pages (kota, chips, drinks)

// Define all menu items with their prices
const menuItems = {
    // Kota Menu Items
    'qty-kota-1': { name: 'Normal Kota', price: 20 },
    'qty-kota-2': { name: 'Kota + Viani', price: 25 },
    'qty-kota-3': { name: 'Kota + Russian', price: 30 },
    'qty-kota-4': { name: 'Kota with All', price: 40 },
    
    // Chips Menu Items
    'qty-chips-1': { name: 'Small Chips', price: 20 },
    'qty-chips-2': { name: 'Medium Chips', price: 25 },
    'qty-chips-3': { name: 'Large Chips', price: 35 },
    
    // Drinks Menu Items
    'qty-drinks-1': { name: 'Coke', price: 15 },
    'qty-drinks-2': { name: 'Sprite', price: 15 },
    'qty-drinks-3': { name: 'Fanta Orange', price: 15 },
    'qty-drinks-4': { name: 'Fanta Grape', price: 15 },
    'qty-drinks-5': { name: 'Water', price: 10 }
};

// Load quantities from session when page loads
document.addEventListener("DOMContentLoaded", function () {
    fetch("/get_order")
        .then(response => response.json())
        .then(order => {
            for (const [itemId, itemData] of Object.entries(order)) {
                const element = document.getElementById(itemId);
                if (element) {
                    element.textContent = itemData.quantity;
                }
            }
        });
});

// Update quantity function - works for all menu items
function updateQty(itemId, change) {
    const qtyElement = document.getElementById(itemId);
    if (!qtyElement) return;

    let currentQty = parseInt(qtyElement.textContent) || 0;
    currentQty += change;

    // Ensure quantity doesn't go below 0
    currentQty = Math.max(0, currentQty);
    qtyElement.textContent = currentQty;

    // Send update to server
    updateOrderOnServer(itemId, currentQty);
}

// Send order updates to server
function updateOrderOnServer(itemId, quantity) {
    const item = menuItems[itemId];
    if (!item) return;

    fetch("/update_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            item_id: itemId,
            item_name: item.name,
            price: item.price,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Order updated:", data);
    })
    .catch(error => {
        console.error("Error updating order:", error);
    });
}

// Go to checkout
function proceedToCheckout() {
    window.location.href = "/checkout";
}

