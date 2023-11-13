import { Link } from "react-router-dom";
import "./nav_bar.css"

const Navigation =(() => {
    return (
        <nav className="navbar">
            <ul className="items">
                <li className="search">
                    <Link to="/">Search</Link>
                </li>
                <li className="results">
                    <Link to="/results">Results</Link>
                </li>
            </ul>
        </nav>
    )
})

export default Navigation;

