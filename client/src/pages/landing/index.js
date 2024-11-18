import { useNavigate } from "react-router-dom";
import "./landing.css";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">

            <div className="context">
                <div className="landing-page-items">
                    <h3 className="heading-1">WELCOME TO</h3>
                    <h2 className="heading-2">CHATAPP</h2>
                    <p className="landing-paragraph">&lt; [ CONNECT, CHAT, SOCIALISE ] /&gt;</p>
                    <img src="/images/logo.png" alt="Chat App Logo" className="logo-landing" />
                    <div className="landing-btn">
                        <button
                            className="login-landing-btn"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className="signup-landing-btn"
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </button>
                    </div>
                </div>  
            </div>

            <div className="area">
                <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            

            <footer className="landing-footer">
                <button className="footer-btn">Privacy Policy</button>
                <button className="footer-btn">Terms of Service</button>
            </footer>
        </div>
    );
};

export default Landing;
