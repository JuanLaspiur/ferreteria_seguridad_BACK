function userBody(form) {
  const requiredFields = [
    'name',
    'email',
    'role',
    'lastname',
    'phone',
    'city',
    'address',
    'birthdate',
    'expoPushToken'
  ];

  const res = {};

  for (const field of requiredFields) {
    if (!form[field]) {
      throw new Error(`El campo '${field}' es obligatorio.`);
    }
    res[field] = form[field];
  }
  return res;
}

module.exports = { userBody };
