const key = "AIzaSyBCyXm_cwmCPSSxYWXht_Obcuz8-8ke898";

fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john.doe@company.com",
    password: "JD12345",
    returnSecureToken: true,
  }),
})
  .then((r) => r.json())
  .then((j) => console.log(j.error ? j.error : "LOGIN OK ✅ " + j.email));