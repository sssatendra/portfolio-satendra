import { MenuIcon } from '@heroicons/react/solid'
import { motion } from "framer-motion"
import { Link } from "react-scroll"

function Header({ data }) {
    console.log(data)
    return (
        <div className="sticky flex justify-between items-center w-full my-10">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2 }} className="flex space-x-5 w-72 text-white justify-center items-center" >
                <h1 className="p-3 text-xl cursor-pointer w-14 text-center rounded-full border-2 font-extrabold bg-blue-500 animate-pulse"> {data.main.initial} </h1>
                <p className="text-lg cursor-pointer font-semibold">{data.main.name}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2 }} className="hidden lg:inline-flex mr-16">
                <ul className="flex justify-center items-center space-x-10 text-white font-semibold p-4 ">
                    <Link to="home" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Home</Link>
                    <Link to="skills" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Skills</Link>
                    <Link to="resume" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Resume</Link>
                    <Link to="works" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Works</Link>
                    <Link to="testimonial" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Testimonial</Link>
                    <Link to="contact" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Contact</Link>
                </ul>
            </motion.div>
            <MenuIcon className="text-white h-8 cursor-pointer lg:hidden md:inline-flex mr-8" />
        </div>
    )
}

export default Header

