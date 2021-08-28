

function Works({ data }) {

    return (
        <div className=" flex flex-col overflow-hidden pb-10" id="works">
            <h1 className="text-white font-semibold text-xl text-center">CHECK OUT SOME OF MY WORKS.</h1>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 content-center py-5">
                {
                    data.portfolio.projects.map((project) => (
                        <div className="relative group flex max-w-sm p-2 flex-col">

                            <a target="_blank" href={project.url}>
                                <p className="absolute hidden group-hover:inline-grid z-20 mx-auto my-auto text-white bg-gradient-to-b from-black to-transparent">{project.category}</p>
                                <img className="object-cover hover:scale-105 transform duration-500 rounded-md" src={project.image} alt={project.title} />
                            </a>
                            <h1 className="text-white text-center font-semibold">{project.title} </h1>
                        </div>
                    ))
                }
            </section>

        </div>
    )
}

export default Works
