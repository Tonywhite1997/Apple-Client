import {useState, useEffect} from 'react'
import axios from "axios"
import {Link} from "react-router-dom"
import { CLIENT_BASE_URL } from '../context'

function Profile() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({me:{}, cards:[]})
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState({oldPassword:"", newPassword:""})
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [isChanging, setIsChanging] = useState(false)

  async function me(){
    try{
      setIsLoading(true)
      const results = await axios.get(`${CLIENT_BASE_URL}/user`)
      setData({me:results.data.me, cards:results.data.cards})

    }catch(err){
      setIsLoading(false)
      // console.error(err)
      console.log(err);
    }
  }

  const copyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert(`Copied to clipboard: ${code}`);
      })
      .catch((err) => {
        console.error('Error copying text: ', err);
      });
  };

 function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} - ${hour}:${minute}`;
}

  const UI_URL = import.meta.env.VITE_APP_ENV === "development" ? "http://localhost:5173" : "https://apple-client-ecru.vercel.app"

async function markAsRead(e, cardID){
  try{
    e.preventDefault()
    const {checked} = e.target
    if(!checked) return
    await axios.post(`${CLIENT_BASE_URL}/card/mark`, {cardID})
    window.location.reload()
  }catch(err){
    console.error(err)
  }
} 

const getNewPassword = (e) => {
    setError("")
    setSuccess("")
    const { name, value } = e.target; 
    setPassword((prev) => {
      return { ...prev, [name]: value }; 
    });
  };

async function changePassword(){
  try{
    if(!password.newPassword.trim() || !password.oldPassword.trim()) return setError("old and new passwords required ")
    await axios.post(`${CLIENT_BASE_URL}/auth/change-password`, password)
    setSuccess("password changed")
  }catch(err){
    console.error(err)
    setError(err?.response?.data?.message)
  }
}

async function changeAmount(){
  try{
    if(!newAmount.trim().length)return setError("field cannot be empty")
    await axios.post(`${CLIENT_BASE_URL}/user/update-balance`, {newAmount})

    window.location.reload()
  }catch(err){
    console.error(err?.response?.data?.message)
    setError(err?.response?.data?.message)
  }

}

async function switchError(e){
 e.preventDefault()
 const error = data?.me?.displayError
 try{
    await axios.post(`${CLIENT_BASE_URL}/user/update-error`, {currentError: !error})
    window.location.reload()
 }catch(err){
  console.log(err);
 }
}

  useEffect(()=>{
    me()
  },[])

  return (
    <div className='profile'>
      <h2>My Dashboard</h2>
      {data.me && <div className='me'>
        <p>{data.me.name}</p>
        <p>{data.me.email}</p>
        <p className='balance'>Current displayed balance : ${data.me.displayBalance || 0}.00</p>
        <div className='my-url'>
          <p>{UI_URL}/{data.me._id}</p>
          <button className='copy' onClick={()=>copyCode(`${UI_URL}/${data.me._id}`)}>Copy my URL</button>
        </div>
        <div className='buttons'>
          <button className='buttons'>
              <input type="checkbox" onChange={switchError} checked={!!data?.me?.displayError}/>
              <p>Display Error</p>
            </button>
          {!isOpen && <button className='open-button' onClick={()=>{setIsOpen(true)}}>change password</button>}

          {!isChanging && <button onClick={()=>{setIsChanging(true)}}>Change displayed balance</button>}
        </div>

        {isOpen && <div className='change-password'>

          <input placeholder='old password' name='oldPassword' value={password.oldPassword} onChange={getNewPassword} />

          <input placeholder='new password' name='newPassword' value={password.newPassword} onChange={getNewPassword} />


          {error && <p style={{color:"red"}}>{error}</p>}
          {success && <p style={{color:"green"}}>{success}</p>}

          <div className='buttons'>
            <button onClick={()=>{setIsOpen(false)}}>hide</button>
            <button onClick={changePassword}>change password</button>
          </div>
        </div>}

        {isChanging && <div className='change-balance'>
            <input placeholder='new amount' value={newAmount} type="number" onChange={(e)=>{setNewAmount(e.target.value); setError("")}} />
            {error && <p style={{color:"red"}}>{error}</p>}
            <div>
              <button onClick={()=>{setIsChanging(false)}}>Hide</button>
              <button onClick={changeAmount}>Change</button>
            </div>
            </div>}
      </div>}

      {data.cards && 
      <table>
        <thead>
          <tr>
            <th >Checked Date</th>
            <th >Card Code</th>
            <th >Mark as Used</th>
          </tr>
        </thead>
        <tbody>
          {data.cards.map((card) => (
            <tr key={card._id}>
              <td >{formatDate(card.createdAt)}</td>
              <td className='code' style={{backgroundColor: card.isRead? "grey" : "green"}}>
                {card.secreteCode}{' '}
                {!card.isRead && <button onClick={() => copyCode(card.secreteCode)}>
                  Copy
                </button>}
              </td>
              <td>
                <input type="checkbox" checked={card.isRead} onChange={(e)=>markAsRead(e, card._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      }
      
    </div>
  )
}

export default Profile
