import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { Grid, Card, Button } from "semantic-ui-react";
import "../../App.css";

const OnboardingForm = ({
  values,
  errors,
  touched,
  handleChange,
  status,
  isSubmitting,
  setSubmitting,
}) => {
  //Setting State
  const [user, setUser] = useState([]);

  //Setting useEffect to push the data into the array from the form

  useEffect(() => {
    console.log("Status has changed! ", status);
    status && setUser(user => [...user, status]);
  }, [status]);

  return (
    <div className="onboarding-form">
      <Form>
        <label>
          Name:
          <input
            id="name"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
          {/* Validate that name has been entered */}
          {touched.name && errors.name && (
            <p className="errors">{errors.name}</p>
          )}
        </label>

        <label>
          Email:
          <input
            id="email"
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          {/* Validate that email has been entered and in fact IS an email*/}
          {touched.email && errors.email && (
            <p className="errors">{errors.email}</p>
          )}
        </label>

        <label>
          Password:
          <input
            id="password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-container">
          TOS Signed:
          <Field id="tos" type="checkbox" name="tos" checked={values.tos} />
          <span className="checkmark" />
        </label>

        <Button
          className="ui primary button"
          color="blue"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please Wait" : "Add User"}
        </Button>
      </Form>

      {user.map(user => (
        <div key={user.id}>
          <Grid columns={3} divided>
            <Grid.Row className="row">
              <Grid.Column className="column">
                <Card>
                  <Card.Content header={`Name: ${user.name}`} />
                  <Card.Content description={`Password: ${user.password}`} />
                  <Card.Content description={`Agree to TOS: ${user.tos}`} />
                  <Card.Content extra>Email: {user.email}</Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      ))}
    </div>
  );
};

//Creating a HOC to wrap the component inside withFormik

// everything we get back from the initial component, we're passing back to the HOC via props, and converting those props to values.
const FormikOnboardingForm = withFormik({
  mapPropsToValues({ name, email, password, tos, nodes, setSubmitting }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false,
    };
  },

  //validation handler
  validationSchema: Yup.object().shape({
    name: Yup.string().required(), // You better have typed something in.

    email: Yup.string()
      .required() // Obvious validation
      .email(), // Make sure it's actually an email

    password: Yup.string().required(), // do I need to repeat this?
  }),

  // Submit button pressed, let's do some stuff:
  // 1. Log out what we've passed to Axios
  // 2. Make the Axios call to the API, posting the values from the form
  // 3. Setting the Status state to the response status from the API
  // 4. Clearing the Form

  handleSubmit(values, { setStatus, resetForm, setSubmitting }) {
    console.log("Submitting", values);
    Axios.post("https://reqres.in/api/users", values)
      .then(response => {
        console.log("Post Successful ", response);
        setStatus(response.data);
        resetForm();
      })
      .catch(error => {
        console.log("There was a problem: ", error.response);
      })
      .finally(() => {
        setSubmitting(false);
      });
  },
})(OnboardingForm);

export default FormikOnboardingForm;
