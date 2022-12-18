import { MenuIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { useState } from 'react';

function Header({ data }) {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };
  return (
    <header
      className="sticky top-0 z-50 items-center h-16"
      style={{ backgroundColor: '#222222' }}
    >
      <div className="flex justify-between items-center w-full my-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="flex space-x-5 w-72 text-white justify-center items-center"
        >
          <h1 className="p-3 text-xl cursor-pointer w-14 text-center rounded-full border-2 font-extrabold bg-blue-500 ">
            {' '}
            {data.main.initial}{' '}
          </h1>
          <p className="text-lg cursor-pointer font-semibold">
            {data.main.name}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="hidden lg:inline-flex mr-16"
        >
          <ul className="flex justify-center items-center space-x-10 text-white font-semibold p-4 ">
            <Link
              to="home"
              smooth={true}
              duration={1000}
              className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
            >
              Home
            </Link>
            <Link
              to="resume"
              smooth={true}
              duration={1000}
              className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
            >
              Resume
            </Link>
            <Link
              to="skills"
              smooth={true}
              duration={1000}
              className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
            >
              Skills
            </Link>
            <Link
              to="works"
              smooth={true}
              duration={1000}
              className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
            >
              Works
            </Link>
            {/* <Link to="testimonial" smooth={true} duration={1000} className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Testimonial</Link> */}
            <Link
              to="contact"
              smooth={true}
              duration={1000}
              className="cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
            >
              Contact
            </Link>
          </ul>
        </motion.div>
        <div className="lg:hidden">
          <MenuIcon
            onClick={handleClick}
            className="text-white sticky  lg:hidden h-8 cursor-pointer md:inline-flex mr-8"
          />
        </div>
      </div>
      <div className="transition transform duration-700 relative">
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 bg-black right-0 -mt-10 rounded-md "
          >
            <ul className="flex justify-center flex-col bg-black text-white font-semibold  ">
              <Link
                onClick={() => setShow(false)}
                to="home"
                smooth={true}
                duration={1000}
                className="px-5 py-2 cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
              >
                Home
              </Link>
              <Link
                onClick={() => setShow(false)}
                to="resume"
                smooth={true}
                duration={1000}
                className="px-5 py-2 cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
              >
                Resume
              </Link>
              <Link
                onClick={() => setShow(false)}
                to="skills"
                smooth={true}
                duration={1000}
                className="px-5 py-2 cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
              >
                Skills
              </Link>
              <Link
                onClick={() => setShow(false)}
                to="works"
                smooth={true}
                duration={1000}
                className="px-5 py-2 cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
              >
                Works
              </Link>
              {/* <Link onClick={() => setShow(false)} to="testimonial" smooth={true} duration={1000} className="px-5 py-2 cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse">Testimonial</Link> */}
              <Link
                onClick={() => setShow(false)}
                to="contact"
                smooth={true}
                duration={1000}
                className="px-5 py-2 cursor-pointer hover:scale-105 transition duration-300 hover:text-red-600 hover:animate-pulse"
              >
                Contact
              </Link>
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default Header;
