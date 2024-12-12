import { resend } from "@/lib/resend";
import { ApiResponseType } from "@/types/ApiResponse";
import VerificationEmail from "../../../Emails/VerificationEmail";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponseType> => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      message: "Mystery Message Verification Code",
      success: true,
    };

  } catch (error) {
    console.log("Error sending Verification Email: ", error);
    return { success: false, message: "Error sending Verification Email." };
  }
};

// this code file is responsible for sending the verification email to the user. It uses the VerificationEmail component to generate the email content. The sendVerificationEmail function takes the user's email, username, and verification code as arguments and sends the email using the resend library. If the email is sent successfully, the function returns a success message; otherwise, it returns an error message.
