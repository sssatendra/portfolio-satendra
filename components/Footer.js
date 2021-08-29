function Footer({ data }) {

  var networks = data.main.social.map(function (network) {
    return (
      <li key={network.name} className="p-6 text-gray-700 hover:text-white">
        <a href={network.url} target="_blank">
          <i className={network.className}></i>
        </a>
      </li>
    );
  });
  return (

    <div className="items-center text-white text-center my-8 ">
      <hr />
      <div className="py-1">
        <ul className="text-white flex justify-center items-center">{networks}</ul>
      </div>
      <div className="mb-12">
        <h1 className="text-lg lg:text-2xl font-semibold">Made with <span className="text-red-700  text-3xl">❤️</span> in India</h1>
        <p> By Satendra Kumar R</p>
      </div>
    </div>

  )
}

export default Footer
