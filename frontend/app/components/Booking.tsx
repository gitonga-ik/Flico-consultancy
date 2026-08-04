const Booking = () => {
  return (
    <section id="contact" className="py-15 px-5 bg-[#fefdfd] scroll-mt-16">
      <div className="container mx-auto">
        <h2 className="text-center text-[#164d77] text-3xl font-semibold mb-8">
          Get in Touch With Us
        </h2>

        <div className="flex justify-center">
          <form className="w-full max-w-lg p-6 rounded shadow-sm bg-white border-t-[5px] border-t-[#276561]">
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#276561]"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-4 flex">
              <span className="bg-gray-100 px-3 border border-r-0 rounded-l flex items-center text-gray-500">
                <i className="bi bi-telephone"></i>
              </span>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-r focus:outline-none focus:ring-2 focus:ring-[#276561]"
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-4 flex">
              <span className="bg-gray-100 px-3 border border-r-0 rounded-l flex items-center text-gray-500">
                <i className="bi bi-envelope-at"></i>
              </span>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-r focus:outline-none focus:ring-2 focus:ring-[#276561]"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-4">
              <textarea
                className="w-full px-4 py-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-[#276561]"
                placeholder="Message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#276561] hover:bg-[#1e4e4b] text-white rounded font-medium transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;
