import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import axios from "../../../api/axios";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { AxiosError } from "axios";
import Alert from "../ui/alert/Alert";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
      variant: "success" | "error";
      title: string;
      message: string;
    } | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("admin/profile/login", { 
        adEmail: email, 
        password: password 
      });

      if (response.data.status) {
        // Use the context login function
        login(response.data.admin, response.data.token);
        navigate("/"); // Redirect to dashboard
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
              setAlertConfig({
                variant: "error",
                title: "Fetch Error",
                message: axiosError.response?.data?.message || "Something went wrong",
              });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      if (alertConfig) {
        const timer = setTimeout(() => {
          setAlertConfig(null);
        }, 4000); // Hide after 5 seconds
        return () => clearTimeout(timer);
      }
    }, [alertConfig]);
  

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90">
            Admin Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your admin email and password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {alertConfig && <Alert {...alertConfig} />}
            
            <div>
              <Label>Email <span className="text-error-500">*</span></Label>
              <Input 
                type="email"
                placeholder="admin@pimjo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? <EyeIcon className="size-5" /> : <EyeCloseIcon className="size-5" />}
                </span>
              </div>
            </div>

            <Button className="w-full" size="sm" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}