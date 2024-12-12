// We will always be needing db-connect since nextJs runs on edge runtime.
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";

export const POST = async (req: Request) => {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        },
      );
    }

    const existingVerifiedUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingVerifiedUserByEmail) {
      if (existingVerifiedUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exists with this email",
        });
      } else {
        existingVerifiedUserByEmail.password = await bcrypt.hash(password, 10);
        existingVerifiedUserByEmail.verifyCode = verifyCode;
        existingVerifiedUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000).toString();
        await existingVerifiedUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        verifyCode,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error registering the User: ", error);
    return Response.json({
      successful: false,
      message: "Error registering the User.",
    });
  }
};
