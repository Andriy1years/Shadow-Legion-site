document.getElementById("copyBtn").addEventListener("click", async () => {
  const text = document.getElementById("massage").textContent;

  await navigator.clipboard.writeText(text);

  alert("Скопировано!");
});

