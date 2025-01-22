import SignUpStyles from "@/src/styles/SignUpStyles";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMutation } from "@apollo/client";
import { CREATE_CUSTOMER_MUTATION } from "@/src/Query/sign-up";
import Toast from "../ui/Toast";

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isSubscribed: true,
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [createCustomer, { loading }] = useMutation(CREATE_CUSTOMER_MUTATION, {
    onError: (error) => {
      console.error("GraphQL Error:", error);
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.result?.errors?.[0]?.message ||
        "Something went wrong. Please try again later.";

      setToast({
        visible: true,
        message: errorMessage,
        type: "error",
      });
    },
    onCompleted: (data) => {
      setToast({
        visible: true,
        message: `Welcome ${data.createCustomerV2.customer.firstname}!`,
        type: "success",
      });
      navigation.navigate("Login");
    },
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!validatePassword(value)) {
          error =
            "Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one special character";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    // Check if all fields are valid
    const hasErrors = Object.values(formErrors).some((error) => error !== "");
    const hasEmptyFields = Object.values(formData).some(
      (value) => value === "",
    );
    setIsFormValid(!hasErrors && !hasEmptyFields && isTermsAccepted);
  }, [formData, formErrors, isTermsAccepted]);

  const handleTermsToggle = () => {
    setIsTermsAccepted(!isTermsAccepted);
  };

  const handleSignUp = async () => {
    if (!isFormValid) return;

    try {
      await createCustomer({
        variables: {
          input: {
            firstname: formData.firstName,
            lastname: formData.lastName,
            email: formData.email,
            password: formData.password,
            is_subscribed: formData.isSubscribed,
          },
        },
      });
    } catch (err) {
      console.error("Try/Catch Error:", err);
    }
  };

  const renderInput = (name, placeholder, options = {}) => (
    <View style={SignUpStyles.inputContainer}>
      <TextInput
        style={[
          SignUpStyles.input,
          formErrors[name] ? SignUpStyles.inputError : null,
        ]}
        placeholder={placeholder}
        value={formData[name]}
        onChangeText={(text) => handleInputChange(name, text)}
        {...options}
      />
      {options.secureTextEntry && (
        <TouchableOpacity
          style={SignUpStyles.eyeIcon}
          onPress={() => {
            if (name === "password") {
              setShowPassword(!showPassword);
            } else {
              setShowConfirmPassword(!showConfirmPassword);
            }
          }}
        >
          <Text>👁️</Text>
        </TouchableOpacity>
      )}
      {formErrors[name] ? (
        <Text style={SignUpStyles.errorText}>{formErrors[name]}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={SignUpStyles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={SignUpStyles.keyboardAvoidView}
      >
        <ScrollView
          style={SignUpStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={SignUpStyles.scrollContent}
        >
          <View style={SignUpStyles.content}>
            <View style={SignUpStyles.logoContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={SignUpStyles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={SignUpStyles.title}>Create Account</Text>
            <Text style={SignUpStyles.subtitle}>
              Please sign up to continue
            </Text>

            <View style={SignUpStyles.form}>
              {renderInput("firstName", "First name")}
              {renderInput("lastName", "Last name")}
              {renderInput("email", "Email", {
                keyboardType: "email-address",
                autoCapitalize: "none",
              })}
              {renderInput("password", "Password", {
                secureTextEntry: !showPassword,
              })}
              {renderInput("confirmPassword", "Confirm password", {
                secureTextEntry: !showConfirmPassword,
              })}

              <TouchableOpacity
                style={SignUpStyles.termsContainer}
                onPress={handleTermsToggle}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    SignUpStyles.checkbox,
                    isTermsAccepted && SignUpStyles.checkboxChecked,
                  ]}
                >
                  {isTermsAccepted && (
                    <Text style={SignUpStyles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={SignUpStyles.termsText}>Terms and Conditions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  SignUpStyles.signUpButton,
                  (!isFormValid || loading) &&
                    SignUpStyles.signUpButtonDisabled,
                ]}
                onPress={handleSignUp}
                disabled={!isFormValid || loading}
              >
                <Text style={SignUpStyles.signUpButtonText}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <View style={SignUpStyles.loginContainer}>
                <Text style={SignUpStyles.loginText}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={SignUpStyles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
