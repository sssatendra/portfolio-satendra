import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

function Homepage({ data }) {
  return (
    <div className="flex justify-evenly items-center flex-col md:flex-row my-16 pb-10">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="mx-16 w-2/4 lg:mt-1 lg:w-80"
      >
        <img
          src="/ProfilePic.jpeg"
          className="hover:scale-105 transition transform duration-500 shadow-2xl rounded-full border-8 border-gray-800 "
        />
      </motion.div>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="text-white md:w-2/4 space-y-3 p-5 text-center lg:text-left break-words flex-grow"
      >
        <p className="text-gray-400">{data.main.occupation}</p>
        <h1 className=" text-xl font-semibold"> {data.main.name}</h1>
        <p className="w-full pb-8">{data.main.bio}</p>
        {/* <a href="https://drive.google.com/file/d/1K5YdyniI5UpR1wntM1DtwcEYx_WaUv1e/view" target="_blank" className="px-5  transform duration-500 hover:scale-110 py-2 w-32 mx-5 border-2 border-blue-600 hover:animate-pulse hover:bg-blue-600 cursor-pointer rounded-full">Download CV</a>
         */}
        <div className="">
          <a
            className="border-2 py-2 px-5 a rounded-full transform duration-500 hover:scale-110 border-blue-600 hover:animate-pulse hover:bg-blue-600 cursor-pointer"
            href="https://drive.google.com/file/d/18sAXfT7eppe6WPYDznVJN-c4R42Ls9yh/view"
            target="_blank"
          >
            Download CV
          </a>
          <Link to="contact" smooth={true} duration={2000}>
            <a
              href=""
              className="px-5  transform duration-500 hover:scale-110 py-2 w-32 mx-5 border-2 hover:bg-white hover:text-black cursor-pointer rounded-full"
            >
              Contact
            </a>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Homepage;
