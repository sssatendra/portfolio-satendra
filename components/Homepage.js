import { motion } from "framer-motion"

function Homepage({ data }) {

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="flex justify-evenly items-center flex-col md:flex-row my-16 pb-10">
            <div className="mx-16 w-2/4 lg:mt-1 lg:w-80">
                <img src="https://satendra-portfolio-28383.web.app/images/ProfilePic.jpeg" className="hover:scale-105 transition transform duration-500 shadow-2xl rounded-full border-8 border-gray-800 " />
            </div>
            <div className="text-white md:w-2/4 space-y-3 p-5 text-center lg:text-left break-words">
                <p className="text-gray-400">{data.main.occupation}</p>
                <h1 className=" text-xl font-semibold"> {data.main.name}</h1>
                <p className="w-full pb-8">{data.main.bio}</p>
                {/* <a href="https://drive.google.com/file/d/1K5YdyniI5UpR1wntM1DtwcEYx_WaUv1e/view" target="_blank" className="px-5  transform duration-500 hover:scale-110 py-2 w-32 mx-5 border-2 border-blue-600 hover:animate-pulse hover:bg-blue-600 cursor-pointer rounded-full">Download CV</a>
                 */}
                <div>
                    <a className="border-2 py-2 px-5 a rounded-full transform duration-500 hover:scale-110 border-blue-600 hover:animate-pulse hover:bg-blue-600 cursor-pointer" href="https://drive.google.com/file/d/1K5YdyniI5UpR1wntM1DtwcEYx_WaUv1e/view" target="_blank">Download CV</a>
                    <a href="3" className="px-5  transform duration-500 hover:scale-110 py-2 w-32 mx-5 border-2 hover:bg-white hover:text-black cursor-pointer rounded-full">Contact</a>
                </div>
            </div>
        </motion.div>
    )
}

export default Homepage
