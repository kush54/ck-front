export async function fetchScript(product) {
  console.log("Product being sent:", product);
  try {
    const response = await fetch("http://localhost:5000/script", {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "content-type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Response from server:", data);
    return { data };
  } catch (error) {
    console.error("Error in fetchScript:", error);
    return { error: error.message };
  }
}
