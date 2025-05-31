import Formik from "formik";
import React from "react";
import { Text, View } from "react-native";
import * as yup from "yup";
import YupPassword from "yup-password";
YupPassword(yup);

// for reference on yup password:
// https://www.npmjs.com/package/yup-password

let loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().password().required(),
});

export default function Login() {
  return (
    <View>
      <Text>Login</Text>

      <Formik
        initialValues={{
          name: "",
          animal: "",
        }}
        validationSchema={loginSchema}
      ></Formik>
    </View>
  );
}
