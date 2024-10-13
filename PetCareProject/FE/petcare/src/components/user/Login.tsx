import { useState } from "react";
import React from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const handleLogin = async () => { 
    try { 
      const response = await fetch('http://localhost:8080/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password }), 
      });  

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.roleName); // Save user role
        localStorage.setItem('isAuthenticated', "true"); // Set authenticated status
        localStorage.setItem('fullName', data.fullName); // Lưu fullName vào localStorage

        console.log(data); 

        

        Swal.fire({
          title: "Đăng nhập thành công!",
          text: `Xin chào ${data.fullName}`,
          icon: "success",
          confirmButtonText: "OK",
        });

        const userRole = localStorage.getItem("userRole");
        console.log("User Role:", userRole); // Kiểm tra giá trị
        if (userRole === 'Admin') {
          navigate('/admin'); // Chuyển hướng ngay lập tức tới trang admin
        } else {
          navigate('/'); // Hoặc trang khác cho người dùng thông thường
        }; // Navigate to the main page
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại!',
          text: errorData.message || 'Vui lòng thử lại.',
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.');

      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi trong quá trình đăng nhập.',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <section className="grid text-center h-screen items-center p-8">
      <div className="border border-gray-250 max-w-[440px] w-full mx-auto p-10 rounded-md">
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Đăng Nhập
        </Typography>
        <Typography className="mb-10 text-gray-600 font-extralight text-base">
          Nhập email và mật khẩu của bạn để đăng nhập
        </Typography>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography variant="small" className="mb-2 block font-medium text-gray-900">
                Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }} // Clear error message
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{ className: "hidden" }}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography variant="small" className="mb-2 block font-medium text-gray-900">
                Mật khẩu
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{ className: "hidden" }}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }} // Clear error message
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5 absolute" style={{ transform: "translate(1650%, 60%)" }} />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 absolute" style={{ transform: "translate(1650%, 60%)" }} />
                  )}
                </i>
              }
              required
            />
          </div>
          <Button color="gray" size="lg" className="mt-6 p-3" fullWidth type="submit">
            Đăng nhập
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography as="a" href="#" color="blue-gray" variant="small" className="font-medium">
              Quên mật khẩu?
            </Typography>
          </div>
          <button
            className="border border-gray-300 w-full p-3 mt-6 rounded-md font-medium hover:bg-gray-100 flex items-center justify-center gap-3"
            type="button"
            style={{ border: "1px solid #eee" }}
          >
            <img src={`https://www.material-tailwind.com/logos/logo-google.png`} alt="google" className="h-6 w-6" />{" "}
            Đăng nhập với Google
          </button>
          <Typography variant="small" color="gray" className="!mt-4 text-center font-normal">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-medium text-gray-900">
              Đăng ký ngay
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default Login;
