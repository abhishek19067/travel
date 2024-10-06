import "./FooterStyles.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="top">
                <div>
                    <h1>Harshu's Journey</h1>
                    <p>Choose your favourite destination.</p>
                </div>
                <div>
                    <a href="https://www.facebook.com/">
                        <i className="fa-brands fa-facebook-square"></i>
                    </a>
                    <a href="https://www.instagram.com/">
                        <i class="fa-brands fa-instagram-square" aria-hidden="true"></i>
                    </a>
                    <a href="https://twitter.com/">
                        <i className="fa-brands fa-twitter-square"></i>
                    </a>
                    <a href="https://github.com/">
                        <i className="fa-brands fa-github-square"></i>
                    </a>
                </div>
            </div>
           
            <div className="last-text">
                <h3>Harshita Gupta 2024  </h3>
            </div>
        </div>
    );
};

export default Footer;