import { Mail } from 'lucide-react'
import React from 'react'
import "./Header.css"
import { useLocation, useNavigate, useNavigation } from 'react-router-dom'

function Header() {
    const location = useLocation();
    const navigation = useNavigate();
    return (
        <header className="app-header">
            <div className='header-group'>
                <div className="header-content">
                    <Mail size={24} />
                    <h1 className="header-title">Visual PromoGen AI</h1>
                </div>
                <div className='header-item-group'>
                    <h2 onClick={()=>navigation("/")} className='header-item' style={location.pathname === "/" ? { backgroundColor: "#fff", color: " #1e40af", padding: "10px", borderRadius: "5px" } : {}}>Generate</h2>
                    {/* <h2  className='header-item' onClick={()=>navigation("/collections")} style={location.pathname === "/collections" ? { backgroundColor: "#fff", color: " #1e40af", padding: "10px", borderRadius: "5px" } : {}}>Collections</h2> */}
                </div>
            </div>
        </header>
    )
}

export default Header;