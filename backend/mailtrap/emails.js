import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationCode) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
      category: "Email Verification",
    });
    console.log("response", response);
  } catch (error) {
    console.error("error", error);
    throw new Error("error message is", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "Welcome to our platform",
      html: `Hello ${name}, Welcome to our platform`,
    });
    console.log("response", response);
  } catch (error) {
    console.log("error", error);
    throw new Error("error message", error);
  }
};

export const sendPasswordResetMail = async (email, resetURL) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "Reset your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "password reset",
    });
  } catch (error) {
    console.log("error in sending email", error);
    throw new Error("Error in sending password reset email", error);
  }
};

export const sendPasswordResetSuccessfulEmail = async (email) => {
  const recipent = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "Password reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "password reset",
    });
    console.log("password reset success mail sent", response);
  } catch (error) {
    console.log("error", error);
    throw new Error(`Error in sending email : ${error}`);
  }
};
