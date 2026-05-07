import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice.js";
import ToastHost from "../components/Toast/ToastHost.jsx";
import { registerFormReady } from "../utils/authValidation.js";
import "../pages/authPages.css";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isLoading } = useSelector((s) => s.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const watched = watch();
  const submitEnabled = registerFormReady(watched);

  useEffect(() => {
    if (token) navigate("/dashboard", { replace: true });
  }, [token]);

  const onSubmit = async (values) => {
    const ok = await trigger();
    if (!ok) return;
    dispatch(registerUser(values));
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value || "");
  const hasUpper = (value) => /[A-Z]/.test(value || "");
  const hasLower = (value) => /[a-z]/.test(value || "");
  const hasNumber = (value) => /\d/.test(value || "");
  const hasSpecial = (value) => /[^A-Za-z0-9]/.test(value || "");

  const passwordField = register("password", {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters"
    },
    validate: {
      upper: (v) => hasUpper(v) || "Add at least 1 uppercase letter",
      lower: (v) => hasLower(v) || "Add at least 1 lowercase letter",
      number: (v) => hasNumber(v) || "Add at least 1 number",
      special: (v) =>
        hasSpecial(v) || "Add at least 1 special character"
    }
  });

  const {
    onFocus: passwordOnFocus,
    ...passwordFieldRest
  } = passwordField;

  return (
    <div className="authWrap">
      <ToastHost />
      <div className="authCard card">
        <div className="authTitle">Create your account</div>
        <div className="authSub muted">Start tracking tasks in minutes.</div>

        <form
          className="authForm"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              placeholder="Your name"
              autoComplete="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name ? <div className="errorText">{errors.name.message}</div> : null}
          </div>

          <div>
            <label className="label">Email</label>
            <input
              className="input"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              {...register("email", {
                required: "Email is required",
                validate: (v) =>
                  isValidEmail(v) || "Enter a valid email (e.g. name@example.com)"
              })}
            />
            {errors.email ? <div className="errorText">{errors.email.message}</div> : null}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="passwordWrap">
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="off"
                spellCheck={false}
                readOnly={passwordReadOnly}
                {...passwordFieldRest}
                onFocus={(e) => {
                  setPasswordReadOnly(false);
                  if (typeof passwordOnFocus === "function") {
                    passwordOnFocus(e);
                  }
                }}
              />
              <button
                type="button"
                className="eyeBtn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="eyeIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M2.1 3.5 20.5 21.9l1.4-1.4-2.7-2.7A12.6 12.6 0 0 0 22 12c-2.2-5.1-6.2-8-10-8-1.5 0-3 .3-4.4.9L3.5 2.1 2.1 3.5zm9.9 4.6 6 6a4 4 0 0 0-6-6zm-8 1.4A12.7 12.7 0 0 0 2 12c2.2 5.1 6.2 8 10 8 1.8 0 3.6-.6 5.2-1.6l-2-2A6 6 0 0 1 6.6 7.8L4 9.5zm8 2.5 2.5 2.5a2 2 0 0 1-2.5-2.5z"
                    />
                  </svg>
                ) : (
                  <svg className="eyeIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 5c-4.4 0-8.4 2.9-10 7 1.6 4.1 5.6 7 10 7s8.4-2.9 10-7c-1.6-4.1-5.6-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password ? (
              <div className="errorText">{errors.password.message}</div>
            ) : null}
          </div>

          <div className="authActions">
            <div className="muted authSmall">
              Already have an account?{" "}
              <Link className="authLink" to="/login">
                Login
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !submitEnabled}
            >
              {isLoading ? "Creating..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

