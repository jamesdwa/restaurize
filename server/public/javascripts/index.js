async function sendPost() {
    let value = document.getElementById("test").value;
    try {
        await fetchJSON(`api/v1/send`, {
            method: "POST",
            body: {value: value}
        })
    } catch(error) {
        throw(error);
    }
}