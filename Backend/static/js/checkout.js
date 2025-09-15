// Load order from server on checkout page
document.addEventListener("DOMContentLoaded", function () {
    fetch("/get_order")
        .then(response => response.json())
        .then(order => {
            const list = document.getElementById("checkout-list");
            const totalElement = document.getElementById("checkout-total");
            list.innerHTML = "";
            let total = 0;

            for (const [itemId, itemData] of Object.entries(order)) {
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                li.textContent = `${itemData.name} (x${itemData.quantity})`;

                const priceSpan = document.createElement("span");
                const itemTotal = itemData.price * itemData.quantity;
                priceSpan.textContent = `R${itemTotal}`;
                li.appendChild(priceSpan);
                list.appendChild(li);

                total += itemTotal;
            }

            totalElement.textContent = total;
        });
});

// Handle checkout button
document.getElementById("checkout-btn").addEventListener("click", function () {
    // Prepare items from checkout list
    const listItems = document.querySelectorAll("#checkout-list li");
    let items = [];
    let total = 0;

    listItems.forEach(li => {
        const nameQty = li.textContent.split("("); // "Normal Kota (x2)"
        const name = nameQty[0].trim();
        const qty = parseInt(nameQty[1].replace("x", "").replace(")", ""));
        const priceText = li.querySelector("span").textContent.replace("R", "");
        const price = parseFloat(priceText);
        total += price;

        items.push({ name: name, quantity: qty, price: price / qty });
    });

    // Send order to server
    fetch("/process_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items, total: total })
    })
    .then(response => response.json())
    .then(data => {
        const statusDiv = document.getElementById("checkout-status");
         // Safety check: ensure items exist
        if (!data.items || !Array.isArray(data.items)) {
         statusDiv.innerHTML = `<div class="alert alert-danger">Error: Invalid data received from server.</div>`;
         return;
        }

        statusDiv.innerHTML = `
            <div class="alert alert-success">
                ✅ Payment successful!<br>
                <strong>Order Number:</strong> ${data.order_number}<br>
                <strong>Receipt:</strong><br>
                <ul>
                    ${data.items.map(i => `<li>${i.name} x${i.quantity} - R${(i.price*i.quantity).toFixed(2)}</li>`).join("")}
                </ul>
                <strong>Total:</strong> R${data.total.toFixed(2)}
            </div>
        `;

        // Clear checkout list
        document.getElementById("checkout-list").innerHTML = "";
    })
    .catch(error => {
        document.getElementById("checkout-status").innerHTML =
            `<div class="alert alert-danger">Error: ${error}</div>`;
    });
});