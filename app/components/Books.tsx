const Books = () => {
  return (
    <section id="books" className="py-15 px-5">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-center text-[#164d77] text-3xl font-semibold mb-12">
          Books
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {[
            {
              img: "saved_from_addiction_for_a_higher_calling.jpg",
              title: "Saved from Addiction for a Higher Calling",
              desc: "Supporting those dealing with alcohol addiction and those managing them.",
            },
            {
              img: "the_courage_to_begin.jpg",
              title: "The Courage to Begin",
              desc: "Helping individuals find their purpose and build a meaningful legacy.",
            },
            {
              img: "my_money_story.jpg",
              title: "My Money Story",
              desc: "Overcoming psychological barriers to achieve financial success.",
            },
          ].map((book, index) => (
            <div key={index} className="text-center max-w-[18rem]">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300">
                <img
                  src={`images/${book.img}`}
                  className="w-full h-auto object-cover"
                  alt={book.title}
                />
              </div>
              <h5 className="mt-4 text-[#164d77] font-semibold text-lg">
                {book.title}
              </h5>
              <p className="text-gray-600 text-sm mt-1">{book.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Books;
