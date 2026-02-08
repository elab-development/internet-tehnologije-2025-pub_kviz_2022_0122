export const getRegisterFields = (state: any, setters: any) => [
  {
    id: "name",
    label: "Ime",
    type: "text",
    placeholder: "Unesite vaše ime",
    value: state.name,
    setter: setters.setName,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Unesite vaš email",
    value: state.email,
    setter: setters.setEmail,
  },
  {
    id: "password",
    label: "Lozinka",
    type: "password",
    placeholder: "Unesite vašu lozinku",
    value: state.password,
    setter: setters.setPassword,
  },
];
