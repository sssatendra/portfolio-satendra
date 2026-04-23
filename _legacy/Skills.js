// import NextNprogress from 'nextjs-progressbar';
import { motion } from 'framer-motion';

function Skills({ data }) {
  return (
    <div className="py-20" id="skills">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="w-full text-center  flex flex-col"
      >
        <h1 className="font-semibold text-white text-xl lg:text-2xl text-center">
          {data.resume.skillmessage}{' '}
        </h1>
        {data.resume.skills.map((skill) => (
          <div className=" flex justify-center items-center">
            <div className="h-20 mb-5 py-3">
              <img
                className="bg-white object-cover w-12 lg:w-20 rounded-full"
                src={skill.image}
                alt={skill.name}
              />
            </div>
            <div className="px-5 py-2 w-2/3">
              <h1 className="text-white font-semibold py-3">{skill.name} </h1>
              <div className="h-3 mx-auto relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3 }}
                  className="h-full animate-pulse bg-blue-800 absolute"
                  style={{ width: `${skill.level}` }}
                ></motion.div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Skills;

9535270432;
