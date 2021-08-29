import { Link } from "react-scroll"

function Menu() {
    return (
        <div className="flex flex-col justify-center cursor-pointer font-semibold font mt-5 ">
            <div>
                <Link to="home" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Home</Link>
            </div>
            <div>
                <Link to="resume" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Resume</Link>
            </div>
            <div>
                <Link to="skills" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Skills</Link>
            </div>
            <div>
                <Link to="works" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Works</Link>
            </div>
            {/* <div>
                <Link to="testimonial" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Testimonial</Link>
            </div>
            <div>
                <Link to="contact" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Contact</Link>
            </div> */}
        </div>
    )
}

export default Menu
