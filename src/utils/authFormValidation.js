import * as yup from 'yup';

const loginSchemaValidation = yup.object().shape({
  email: yup.string().email('Uh oh, looks like that is not a valid email').required('Please enter your email'),
  password: yup.string().matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"), 'Please enter your password')
});

const registerSchemaValidation = yup.object().shape({
  username: yup.string()
    .min(5)
    .max(16)
    .required(),
  email: yup.string().email().required(),
  baseCurrency: yup.string().min(3).max(3).required(),
  password: yup.string()
    .matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"), 'password must be 8 characters and contain 1 lowercase and uppercase letter, 1 number, and 1 special character').required(),
  confirmPassword: yup.ref('password')
});

const updateSchemaValidation = yup.object().shape({
  name: yup.string().min(1),
  username: yup.string()
    .min(5)
    .max(16),
  email: yup.string().email(),
  baseCurrency: yup.string().min(3).max(3),
  password: yup.string()
    .matches(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"), 'password must be 8 characters and contain 1 lowercase and uppercase letter, 1 number, and 1 special character'),
  confirmPassword: yup.ref('password')
});

export { loginSchemaValidation, registerSchemaValidation, updateSchemaValidation }
