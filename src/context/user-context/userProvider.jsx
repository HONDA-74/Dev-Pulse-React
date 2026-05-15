import axios from "axios";
import { useState } from "react";
import { UserContext } from "./user-context";
import toast from "react-hot-toast";

export const UserProvider = ({children})=>{
    const [user, setUser] = useState(null)

    const login = async (userData)=>{
        toast.loading("Logging in...", { id: "login-toast" });
        try{
            const res = await axios.get(`http://localhost:4000/users?email=${userData.email}`);
            if(res.data.length > 0){
                if(res.data[0].password !== userData.password){
                    throw new Error("Invalid email or password");
                }
                const user = res.data[0];
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                toast.success("Logged in successfully!", { id: "login-toast" });
            }else{
                toast.error("Invalid email or password", { id: "login-toast" });
                throw new Error("Invalid email or password")
            }
        }catch(error){
            console.log(error);
            toast.error("Login failed. Please check your credentials.", { id: "login-toast" });
        }
    }

    const register = async (userData)=>{
        toast.loading("Creating account...", { id: "reg-toast" });
        try {
            const res = await axios.post("http://localhost:4000/users", userData);
            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
            toast.success("Account created successfully!", { id: "reg-toast" });
        } catch (error) {
            console.log(error);
            toast.error("Registration failed. Please try again.", { id: "reg-toast" });
        }
    }

    const logout = ()=>{
        localStorage.removeItem("user");
        setUser(null);
    }

    const checkUser = ()=>{
        const user = localStorage.getItem("user");
        if(user){
            setUser(JSON.parse(user));
        }
    }

    return(
        <UserContext.Provider value={{user, setUser, login, register, logout, checkUser}}>
            {children}
        </UserContext.Provider>
    )
}