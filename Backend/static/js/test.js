
  // Create a global cart object
  const cart = {
    "Normal Kota": 0,
    "Kota + Viani": 0,
    "Kota + Russian": 0,
    "Kota with All": 0
  };

  function updateQty(elementId, change) {
    const qtyElement = document.getElementById(elementId);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty = isNaN(currentQty) ? 0 : currentQty;
    const newQty = Math.max(0, currentQty + change);
    qtyElement.textContent = newQty;

    // Update the cart based on elementId
    if (elementId === "qty-kota-1") cart["Normal Kota"] = newQty;
    if (elementId === "qty-kota-2") cart["Kota + Viani"] = newQty;
    if (elementId === "qty-kota-3") cart["Kota + Russian"] = newQty;
    if (elementId === "qty-kota-4") cart["Kota with All"] = newQty;

    // Save cart to localStorage
    localStorage.setItem("cartData", JSON.stringify(cart));
  }


  window.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("checkout-summary");
    const cartData = JSON.parse(localStorage.getItem("cartData")) || {};

    const lines = [];

    for (const item in cartData) {
      if (cartData[item] > 0) {
        lines.push(`${item}: ${cartData[item]}`);
      }
    }

    textarea.value = lines.length > 0 ? lines.join("\n") : "No items selected.";
  });
