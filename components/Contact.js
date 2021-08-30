import { useState } from "react";

function Contact({ data }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submitForm = (e) => {
    e.preventDefault()
    window.open(
      `mailto:${data.main.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(name)} (${encodeURIComponent(
        email
      )}): ${encodeURIComponent(message)}`
    );
  };

  return (
    <div className="flex w-full justify-center items-center flex-col lg:flex-row pt-16" id="contact">
      <div className="lg:w-2/4">
        <h1 className="text-white text-center p-3 font-semibold text-xl">Get in Touch with me!</h1>
        <form action="" className="flex flex-col relative p-5 mx-5" onSubmit={submitForm}>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="bg-gray-600 p-5 my-2 rounded-xl float-right outline-none active:bg-blue-600" placeholder="Name" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-gray-600 p-5 my-2 rounded-xl outline-none active:bg-blue-600" placeholder="Email" required />
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-gray-600 p-5 my-2 rounded-xl outline-none active:bg-blue-600" placeholder="Subject" required />
          <textarea type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="bg-gray-600 p-5 my-2 rounded-xl outline-none active:bg-blue-600" placeholder="Message" required />
          <button type="submit" className="mx-auto transform duration-500 rounded-full active:scale-90 hover:bg-gray-700 justify-center w-24 p-2 my-3 text-white border-2 bg-gray-800">Submit</button>
        </form>
      </div>
      <div className="">
        <h1 className="text-white text-xl p-3 text-center">Address and Phone</h1>
        <p className="text-gray-500 text-center">{data.main.name} </p>
        <p className="text-gray-500 text-center">{data.main.email} </p>
        <br />
        <p className="text-gray-500 text-center">{data.main.address.street} </p>
        <p className="text-gray-500 text-center">{data.main.address.city}, {data.main.address.state}, {data.main.address.zip}</p>
        <p className="text-gray-500 text-center">{data.main.phone} </p>
        {/* <p>{data.main.name} </p> */}
      </div>

    </div>
  )
}

export default Contact
