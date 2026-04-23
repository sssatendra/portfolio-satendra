function Resume({ data }) {
  var networks = data.main.social.map(function (network) {
    return (
      <li key={network.name} className="p-6 hover:text-blue-600">
        <a href={network.url} target="_blank">
          <i className={network.className}></i>
        </a>
      </li>
    );
  });

  return (
    <div id="resume" className="py-20 flex justify-center items-center my-10 ">
      <div className="flex-grow flex justify-center items-center w-2/4 h-5/6">
        <ul className="text-white h-5/6">{networks}</ul>
      </div>
      <div className="h-5/6 ">
        <h1 className="text-white text-xl lg:text-2xl lg:p-5 hover:underline cursor-pointer transform duration-500 hover:text-blue-600">
          About Me
        </h1>
        <p className="text-white p-5 text-sm lg:text-xl ">
          {data.main.description}
        </p>
        <h1 className="text-white text-xl lg:text-2xl lg:p-5 hover:underline cursor-pointer transform duration-500 hover:text-blue-600">
          Contact Details
        </h1>
        <p className="text-white p-1 mx-5 text-sm lg:text-xl">
          {data.main.name}
        </p>
        <p className="text-white p-1 mx-5 text-sm lg:text-xl">
          {data.main.address.street}
        </p>
        <p className="text-white p-1 mx-5 text-sm lg:text-xl">
          {data.main.address.city}
        </p>
        <p className="text-white p-1 mx-5 text-sm lg:text-xl">
          {data.main.address.state}
        </p>
        <p className="text-white p-1 mx-5 text-sm lg:text-xl">
          {data.main.address.zip}
        </p>
        <p className="text-white p-1 mx-5 text-sm lg:text-xl">
          {data.main.phone}
        </p>
        <p className="text-white p-1 mx-5 text-sm lg:text-xl">
          {data.main.email}
        </p>
      </div>
    </div>
  );
}

export default Resume;
