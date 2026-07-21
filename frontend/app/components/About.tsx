const About = () => {
    return (
        <>
            <section id="about" className="py-8 px-5 scroll-mt-16">
                <div className="container mx-auto max-w-4xl text-center mb-12">
                    <h2 className="text-[#164d77] text-3xl font-semibold mb-4">
                        About Flico Consultancy
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Flico Consultancy is a counselling and training organization
                        dedicated to helping individuals, families and organizations address
                        addiction, chronic stress and life challenges. Through counselling,
                        corporate trainings, mentorship and educational resources, we aim to
                        empower people to live healthier, purpose-driven lives.
                    </p>
                </div>

                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            className="bg-white p-6 border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-[#a3d3d0] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300">
                            <h5 className="text-[#164d77] font-semibold text-xl mb-2">
                                Vision
                            </h5>
                            <hr/>
                            <p className="text-gray-600 pt-3">
                                To nurture a healthier and more resilient society through
                                counselling, social support and awareness programs addressing
                                chronic stress and addiction and their impact on individuals,
                                families and communities.
                            </p>
                        </div>

                        <div
                            className="bg-white p-6 border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-[#a3d3d0] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300">
                            <h5 className="text-[#164d77] font-semibold text-xl mb-2">
                                Mission
                            </h5>
                            <hr/>
                            <p className="text-gray-600 pt-3">
                                To empower individuals and organizations by spreading awareness
                                on addiction and chronic stress through counselling services,
                                mentorship programs, training workshops and educational
                                resources.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="services" className="pt-4 pb-8 px-5 bg-gray-50/50 scroll-mt-16">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-center text-[#164d77] text-3xl font-semibold mb-12">
                        Our Services
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                title: "Addiction Counselling",
                                desc: "Professional counselling support for individuals and families dealing with alcohol and substance addiction.",
                            },
                            {
                                title: "Corporate Stress Training",
                                desc: "Workplace training programs focused on chronic stress management and employee wellbeing.",
                            },
                            {
                                title: "Youth Mentorship",
                                desc: "Mentorship programs guiding young people to discover their purpose and make positive life choices.",
                            },
                            {
                                title: "Time Management & Workplace Addiction Training",
                                desc: "Workshops designed to improve productivity and support employees struggling with addiction.",
                            },
                        ].map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 border-0 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-[#a3d3d0] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300">
                                <h5 className="text-[#164d77] font-semibold text-lg mb-2">
                                    {service.title}
                                </h5>
                                <hr/>
                                <p className="text-gray-600 pt-3">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-8 px-5 bg-[#e1e3e6]">
                <div className="container mx-auto text-center">
                    <h2 className="text-[#164d77] text-3xl font-semibold mb-6">
                        Organizations We&#39;ve Worked With
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            "Equity Bank",
                            "Family Bank",
                            "St. Aloysius",
                            "PCEA",
                            "ACK",
                            "Britam",
                        ].map((partner) => (
                            <span
                                key={partner}
                                className="px-5 py-2.5 rounded-[20px] bg-[#f6f6f6] inline-block font-medium text-gray-700 shadow-sm"
                            >
                {partner}
              </span>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default About;
