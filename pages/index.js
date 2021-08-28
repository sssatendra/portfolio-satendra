import Header from "../components/Header";
import Homepage from "../components/Homepage"
import Head from 'next/head'
import { LazyMotion, domAnimation, motion } from "framer-motion"
import Skills from "../components/Skills";
import resumeData from "./resumeData.json"
import Works from "../components/Works";
import Footer from "../components/Footer";

export default function Home() {

  return (
    <div>
      <Head>
        <title>Satendra Kumar</title>
        <link rel="icon" href="/airbnb.ico" />
      </Head>
      <LazyMotion features={domAnimation}>
        <main id="home" className="bg-blue-500 m-0 p-0 box-border flex justify-center align-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="bg-gray-900 my-8" style={{ borderRadius: "40px", width: "94vw", height: "100%", backgroundColor: "#222222" }} >
            <Header data={resumeData} />
            <Homepage data={resumeData} />
            <Skills data={resumeData} />
            <Works data={resumeData} />
            <Footer />
          </motion.div>
        </main>
      </LazyMotion>
    </div>

  )
}


// export async function getStaticProps(context) {
//   const request = await fetch(`resumeData.json`)
//   // console.log(request)

//   return {
//     props: { request }, // will be passed to the page component as props
//   }
// }
