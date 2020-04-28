const form = document.forms[0];
const button = document.querySelector("button");

const handleOnSubmit = (e) => {
  e.preventDefault();

  const data = {
    fullName: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value,
  };

  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  console.log(form.action);

  const request = new Request(form.action, {
    method: form.method,
    mode: "no-cors",
    headers: headers,
    body: JSON.stringify(data),
  });

  fetch(request)
    .then((res) => console.log(res.json()))
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

button.addEventListener("click", handleOnSubmit);
