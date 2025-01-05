import axios from "axios";
import {useState} from "react";
import {Link} from "react-router-dom"
import { CLIENT_BASE_URL } from "../context";
import {FaEye, FaEyeSlash} from "react-icons/fa"

function SignIn() {
  const [loginDetails, setLoginDetails] = useState({email:"", password:""})
  const[error, setError] = useState("")

  const [isLoading, setIsLoading] = useState(false)

    const [isReveal, setIsReveal] = useState(false)

  function getSignInDetails(e){
    e.preventDefault()

    setError("")

    const {name} = e.target

    setLoginDetails((prev)=>{
      return {...prev, [name]:e.target.value}
    })
  }

  async function signIn(){
    if(!loginDetails.email.trim().length || !loginDetails.password.trim().length) return

    setIsLoading(true)
    try{
      await axios.post(`${CLIENT_BASE_URL}/auth/login`, {
      email: loginDetails.email,
      password: loginDetails.password
    })
    setIsLoading(false)
    window.location.assign("/profile")

    }catch(err){
      setError(err?.response?.data?.message)
      setIsLoading(false)
      console.error(err)
    }
    
  }
  return (
    <div className="login">
      <p>Login</p>
      <div className="email">
        <label>Email</label>
        <input placeholder="your email" name="email" value={loginDetails.email} onChange={(e)=>{getSignInDetails(e)}} />
      </div>
      <div className="password">
        <label>Password</label>
         <div className="password-eye">
         
           {isReveal ? (
          <FaEyeSlash className="fa-eyeSlash" onClick={() => setIsReveal(false)}/>
        ) : (
          <FaEye className="fa-eye" onClick={() => setIsReveal(true)}/>
        )}
         
          <input placeholder="your password" type={isReveal? "text" : "password"} name="password" value={loginDetails.password} onChange={(e)=>{getSignInDetails(e)}} />
        </div>
        {error && <p className="error" style={{color:"red"}}>{error}</p>}
      </div>
      <div className="buttons">
        <Link to="/">Go back</Link>
      <div className="button">
        <button onClick={signIn}>{isLoading? "loading..." : "Login"}</button>
      </div>
      </div>
    </div>
  );
}

export default SignIn;
