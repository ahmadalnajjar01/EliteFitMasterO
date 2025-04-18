import { useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmailVerification = async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // Reload the user to get the latest email verification status
        if (user.emailVerified) {
          Swal.fire({
            icon: "success",
            title: "Email Verified!",
            text: "Your email has been successfully verified.",
            confirmButtonText: "Continue",
            customClass: {
              confirmButton: "bg-indigo-600 text-white px-4 py-2 rounded-lg",
            },
          }).then(() => {
            navigate("/"); // Redirect to the dashboard or home page
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "Verify Your Email",
            text: "Please check your email and verify your account.",
            confirmButtonText: "Resend Verification Email",
            customClass: {
              confirmButton: "bg-indigo-600 text-white px-4 py-2 rounded-lg",
            },
          }).then(async () => {
            await sendEmailVerification(user); // Resend the verification email
          });
        }
      } else {
        navigate("/"); // Redirect to home if no user is found
      }
    };

    checkEmailVerification();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please check your email and verify your account.
        </p>
      </div>
    </div>
  );
}
