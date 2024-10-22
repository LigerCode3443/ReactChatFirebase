import { useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { upload } from "../../lib/upload";
import Loader from "../Loader/Loader";

const Login = () => {
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReg, setShowPasswordReg] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoadingRegister(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const urlAvatar = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        avatar: urlAvatar,
        email,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoadingRegister(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoadingLogin(false);
    }
  };
  return (
    <div className="w-full h-full flex items-center gap-[100px]">
      <div className="flex-1 flex flex-col items-center gap-5 ">
        <h2 className="text-3xl text-blue-200 font-extrabold">Welcome back,</h2>
        <form
          className="flex flex-col items-center justify-center gap-5 w-2/3"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="p-5 border-none outline-none bg-blue-950/55 text-blue-200 rounded-lg w-full"
          />
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="p-5 border-none outline-none bg-blue-950/55 text-blue-200 rounded-lg w-full"
            />
            <button
              type="button"
              className="absolute top-[30%] right-3"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? (
                <IoEye size={"1.6em"} color="white" />
              ) : (
                <IoEyeOff size={"1.6em"} color="black" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="border-solid border-blue-950/55 border-4 w-full p-2 rounded-xl hover:bg-blue-950/55 "
            disabled={isLoadingLogin}
          >
            {isLoadingLogin ? (
              <Loader color={"white"} width={"24"} />
            ) : (
              "Sing In"
            )}
          </button>
        </form>
      </div>
      <div className="h-[90%] w-[2px] bg-green-950/55 rounded-3xl"></div>
      <div className="flex-1 flex flex-col items-center gap-5">
        <h2 className="text-3xl text-blue-200 font-extrabold">
          Create at Account
        </h2>
        <form
          className="flex flex-col items-center justify-center gap-5 w-2/3"
          onSubmit={handleRegister}
        >
          <label
            htmlFor="file"
            className="cursor-pointer w-full flex items-center justify-between underline hover:text-blue-300/80"
          >
            <img
              src={avatar.url || "./avatar.png"}
              alt=""
              className="w-12 h-12 rounded-md object-cover opacity-60"
            />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleAvatar}
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="p-5 border-none outline-none bg-blue-950/55 text-blue-200 rounded-lg w-full"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="p-5 border-none outline-none bg-blue-950/55 text-blue-200 rounded-lg w-full"
          />
          <div className="w-full relative">
            <input
              type={showPasswordReg ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="p-5 border-none outline-none bg-blue-950/55 text-blue-200 rounded-lg w-full"
            />
            <button
              type="button"
              className="absolute top-[30%] right-3"
              onClick={() => {
                setShowPasswordReg((prev) => !prev);
              }}
            >
              {showPasswordReg ? (
                <IoEye size={"1.6em"} color="white" />
              ) : (
                <IoEyeOff size={"1.6em"} color="black" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="border-solid border-blue-950/55 border-4 w-full p-2 rounded-xl hover:bg-blue-950/55 "
            disabled={isLoadingRegister}
          >
            {isLoadingRegister ? (
              <Loader color={"white"} width={"24"} />
            ) : (
              "Sing Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
