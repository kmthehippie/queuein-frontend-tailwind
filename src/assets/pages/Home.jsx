import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { featuresData, futureFeaturesData } from "../Data/FeaturesData";
import { primaryTextClass } from "../styles/tailwind_styles";

const Home = () => {
  const navigate = useNavigate();
  const emailAddress = import.meta.env.VITE_FEEDBACK_EMAIL_ADDRESS;
  const subject = `Feedback`;

  const [introText, setIntroText] = useState(false);
  const [featureText, setFeatureText] = useState(false);
  const visibleFeatures = featuresData.slice(0, 4);
  const hiddenFeatures = featuresData.slice(4);

  const handleNavNLBH = () => {
    navigate("/nasi-lemak-burung-hantu");
  };
  const handleNavRegister = () => {
    navigate("/db/register");
  };
  const handleNavLogin = () => {
    navigate("db/login");
  };

  const toggleIntroText = () => {
    setIntroText(!introText);
  };
  const toggleFeatureText = () => {
    setFeatureText(!featureText);
  };
  return (
    <div className="">
      <div
        className={`flex flex-col items-center justify-center ${primaryTextClass}`}
      >
        <div className="font-light max-w-2xl mx-auto">
          <h1 className="font-extralight text-4xl mt-10 text-center">
            Welcome to Queue in
          </h1>
        </div>
        <br />
        <div className={`font-light max-w-2xl mx-auto text-stone-700`}>
          <div className=" bg-primary-cream/80 hover:shadow-2xl p-5 rounded-lg shadow-md m-1">
            <div className="flex mb-5 items-center justify-center">
              <i className="fa-solid fa-screwdriver text-[50px]  text-primary-dark-green"></i>{" "}
              <h2 className="font-extralight text-2xl  text-center">
                Please don't mind the mess, this app is still under development!
              </h2>
              <i className="fa-solid fa-hammer text-[50px]  text-primary-dark-green rotate-y-180"></i>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">
                It might take awhile (usually 1-2 minutes) when loading into the
                sample page.
              </p>
              <small className="text-xs text-primary-dark-green italic">
                App is still on free tier servers. With enough positive
                response, I'll move the app to a paid service.
              </small>
            </div>
          </div>
          <br />
          <h2 className="font-extralight text-2xl text-center dark:text-white">
            A quick walkthrough
          </h2>
          <div className="bg-primary-cream hover:shadow-2xl p-4 rounded-lg shadow-md m-1">
            <div className="m md:gap-10 md:flex md:flex-row md:items-center flex flex-col justify-center items-center text-center md:bg-none shadow-2xl rounded-2xl bg-primary-cream/70 p-6 mb-5">
              <div className="w-4/5 mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  What your customers see
                </h3>
                <p className="text-primary-dark-green text-sm">
                  A simple landing page for your brand, providing instant access
                  to your queue.
                </p>
              </div>
              <img
                src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1756007308/1_feamuy.png"
                alt="sample of a customer view"
                className="rounded-xl object-cover md:w-2/5 mb-4 md:skew-y-11 w-3/5 p-3 md:p-0 shadow-2xl"
              />
            </div>
            <div className="m md:gap-10 md:flex md:flex-row md:items-center flex flex-col justify-center items-center text-center md:bg-none shadow-2xl rounded-2xl bg-primary-cream/70 p-6 mb-5">
              <img
                src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1756009230/2_mdnlfn.png"
                alt="sample of a customer view"
                className="rounded-xl object-cover md:w-2/5 mb-4 md:-skew-y-11 w-3/5 p-3 md:p-0 shadow-2xl"
              />
              <div className="w-4/5 mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Joining a queue has never been easier
                </h3>
                <p className="text-primary-dark-green text-sm">
                  Customers can join with a simple QR code scan, reducing wait
                  times and improving their experience.
                </p>
              </div>
            </div>
            <div className="m md:gap-10 md:flex md:flex-row md:items-center flex flex-col justify-center items-center text-center md:bg-none shadow-2xl rounded-2xl bg-primary-cream/70 p-6 mb-5">
              <div className="w-4/5 mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Manage your queue
                </h3>
                <p className="text-primary-dark-green text-sm">
                  Take control with real-time updates, call next in line, and
                  manage wait times efficiently.
                </p>
              </div>
              <div className="relative md:w-[3/5] flex flex-col items-center md:block ">
                <img
                  src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1756007303/5_njxfc5.png"
                  alt="sample of a customer view"
                  className="rounded-xl object-cover mb-4 md:skew-y-11 shadow-2xl"
                />
                <img
                  src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1756010525/8_agfrqn.png"
                  alt="sample of a customer view"
                  className="rounded-xl object-cover mb-4 md:absolute md:top-0 md:right-0 md:w-[170px] w-[200px] md:skew-y-11 shadow-2xl"
                />
              </div>
            </div>
            <div className="md:gap-10 md:flex md:flex-row md:items-center flex flex-col justify-center items-center text-center md:bg-none shadow-2xl rounded-2xl bg-primary-cream/70 p-6 mb-5">
              <img
                src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1756007309/3_ll5ncj.png"
                alt="sample of a customer view"
                className="rounded-xl object-cover md:w-2/5 mb-4 md:-skew-y-11  p-3 md:p-0 shadow-2xl"
              />
              <div className="w-4/5 mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  A Simple Dashboard
                </h3>
                <p className="text-primary-dark-green text-sm">
                  Easily access and manage all your restaurant, clinic or event
                  location from one centralized dashboard.
                </p>
              </div>
            </div>
            <div className="m md:gap-10 md:flex md:flex-row md:items-center flex flex-col justify-center items-center text-center md:bg-none shadow-2xl rounded-2xl bg-primary-cream/70 p-6 mb-5">
              <div className="w-4/5 mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Check out who did what last
                </h3>
                <p className="text-primary-dark-green text-sm">
                  Keep a clear record of all staff actions to ensure
                  accountability and monitor activity.
                </p>
              </div>
              <div className="relative md:w-[3/5] flex flex-col items-center md:block ">
                <img
                  src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1756007302/7_zyczlr.png"
                  alt="sample of a customer view"
                  className="rounded-xl object-cover mb-4 md:skew-y-11 shadow-2xl"
                />
                <img
                  src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1756007302/4_cs7p4g.png"
                  alt="sample of a customer view"
                  className="rounded-xl object-cover mb-4 md:absolute md:top-0 md:right-0 md:w-[170px] w-[200px] md:skew-y-11 shadow-2xl"
                />
              </div>
            </div>
            <div className="md:gap-10 md:flex md:flex-row md:items-center flex flex-col justify-center items-center text-center md:bg-none shadow-2xl rounded-2xl bg-primary-cream/70 p-6 mb-5">
              <div className="relative md:w-[3/5] flex flex-col items-center md:block ">
                <img
                  src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1758712304/kiosksuccess_piumwl.png"
                  alt="sample of kiosk success"
                  className="rounded-xl object-cover mb-4 md:-skew-y-11 shadow-2xl"
                />
                <img
                  src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1758712079/QueueIn/OutletImages/kioskview-1758712077603.png"
                  alt="sample of a kiosk view"
                  className="rounded-xl object-cover mb-4 md:absolute md:top-10 md:-right-8 md:w-[280px] w-[300px] md:-skew-y-11 shadow-2xl "
                />
              </div>
              <div className="w-4/5 mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Kiosk Style Available
                </h3>
                <p className="text-primary-dark-green text-sm">
                  If you have a spare tablet, you can set it up so that your
                  customers can join queue at the store using your tablet!
                </p>
              </div>
            </div>
          </div>
          <h2 className="font-extralight text-2xl mt-10 text-center dark:text-white">
            Give it a whirl!
          </h2>
          <div className="bg-primary-cream/80 hover:shadow-2xl p-4 rounded-lg shadow-md m-1">
            <div className="text-gray-800 flex items-center">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center text-white mr-3 mt-1">
                <i className="fa-solid fa-screwdriver  text-white"></i>{" "}
              </span>
              <div className="">
                <span className="font-semibold text-sm">Free for now!</span>
                <br />
                The app is now available for{" "}
                <span className="font-semibold">free</span> as it is still in
                the alpha phase!
                <p className="text-xs">
                  I might have to start charge a small fee to pay for servers
                  and hosting at a later date.
                </p>
              </div>
            </div>
            <br />
            <div className="text-gray-800 flex items-center">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center text-white mr-3 mt-1">
                <i className="fa-solid fa-screwdriver  text-white"></i>{" "}
              </span>
              <div className="">
                <span className="font-semibold text-sm">A landing page</span>{" "}
                <br />
                This is a{" "}
                <button
                  className="text-primary-green hover:text-primary-light-green italic font-semibold border-1 border-primary-light-green px-3 rounded-lg"
                  onClick={handleNavNLBH}
                >
                  Sample Landing Page
                </button>{" "}
                that your customers/visitors/patients would be looking at
              </div>
            </div>
            <br />
            <div className="text-gray-800 flex items-center">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center text-white mr-3 mt-1">
                <i className="fa-solid fa-screwdriver  text-white"></i>{" "}
              </span>
              <div className="">
                <span className="font-semibold text-sm">
                  Try for yourself! Create an account
                </span>{" "}
                <br />
                Head on over to{" "}
                <button
                  className="text-primary-green hover:text-primary-light-green italic font-semibold border-1 border-primary-light-green px-3 rounded-lg"
                  onClick={handleNavRegister}
                >
                  Register
                </button>{" "}
                an account
              </div>
            </div>
            <br />
            <div className="text-gray-800 flex items-center">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center text-white mr-3 mt-1">
                <i className="fa-solid fa-screwdriver  text-white"></i>{" "}
              </span>
              <div className="">
                <span className="font-semibold text-sm">
                  Enter sample queue!
                </span>
                <br />
                Scan the following QR Code
              </div>
            </div>
            <div className="ml-10">
              <img
                src="https://res.cloudinary.com/dv9llxfzi/image/upload/v1758517262/QueueIn/QRCode/a3828b86-1b7c-4a03-9b9a-8fd2509de373-qr-1.png"
                alt="Sample QR Code for NLBH Sample"
                className=""
              />
            </div>
            <br />
            <div className="text-gray-800 flex items-center">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-green rounded-full flex items-center justify-center text-white mr-3 mt-1">
                <i className="fa-solid fa-screwdriver  text-white"></i>{" "}
              </span>
              <div className="">
                <span className="font-semibold text-sm">
                  Owner or event host POV:{" "}
                </span>{" "}
                <br />
                <button
                  className="text-primary-green hover:text-primary-light-green italic font-semibold border-1 border-primary-light-green px-3 rounded-lg"
                  onClick={handleNavLogin}
                >
                  Login
                </button>{" "}
                to the sample account.
                <p className="text-xs">
                  Note: This matches with the QR code you scanned
                </p>
              </div>
            </div>
          </div>
          <div className="font-light  max-w-2xl mx-auto">
            <h2 className="font-extralight text-2xl mt-10 text-center dark:text-white">
              Features
            </h2>
            <ul className="list-none space-y-4 bg-primary-cream/80 hover:shadow-2xl p-4 rounded-lg shadow-md max-w-200 m-1 text-xs">
              {visibleFeatures.map((feature, index) => (
                <li className="flex items-center" key={index}>
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                    ✓
                  </span>
                  <p className="text-gray-800">
                    <span className="font-semibold text-sm">
                      {feature.title}
                    </span>
                    <br /> {feature.description}
                  </p>
                </li>
              ))}

              {featureText && (
                <>
                  {hiddenFeatures.map((feature, index) => (
                    <li className="flex items-center" key={index}>
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                        ✓
                      </span>
                      <p className="text-gray-800">
                        <span className="font-semibold text-sm">
                          {feature.title}
                        </span>
                        <br /> {feature.description}
                      </p>
                    </li>
                  ))}
                </>
              )}

              <li className="flex items-center justify-center">
                <button
                  onClick={toggleFeatureText}
                  className="w-full text-primary-green hover:text-primary-light-green px-3 py-2 flex items-center justify-center"
                >
                  <i
                    className={`fa-solid fa-caret-down text-2xl mr-2 transform transition-transform duration-300 ${
                      featureText ? "rotate-180" : ""
                    }`}
                  ></i>
                  <span className="text-sm font-medium">
                    {featureText
                      ? "Show Less Features..."
                      : "Show More Features..."}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <div className="font-light max-w-2xl mx-auto mb-10">
            <h2 className="font-extralight text-2xl mt-10 text-center dark:text-white">
              Future features
            </h2>
            <div className="bg-primary-cream/80 hover:shadow-2xl p-4 rounded-lg shadow-md m-1">
              <p className="text-xs mb-4">
                As this is just the first iteration of queuein, you can be sure
                that there will be many improvements and additional features to
                come. The following are some examples of what is to come.
              </p>
              <ul className="list-none space-y-4 text-xs">
                {futureFeaturesData.map((feature, index) => (
                  <li className="flex items-start" key={index}>
                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 mt-1">
                      ★
                    </span>
                    <div className="text-gray-800">
                      <span className="font-semibold text-sm">
                        {feature.title}
                      </span>
                      {feature.description && <br />}
                      {feature.description}
                      {feature.sublist && (
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          {feature.sublist.map((item, subIndex) => (
                            <li key={subIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-4 text-center">
                Do you have more ideas? Or maybe something's broken! <br />
                Please send me feedback via email:{" "}
                <a
                  href={`mailto:${emailAddress}?subject=${encodeURIComponent(
                    subject
                  )}`}
                >
                  {emailAddress}
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-cream/80 to-primary-cream/60 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl mx-1">
            <p className="mt-4 text-center text-lg">
              Hi, I'm KM. I built this app with hopes to make queueing a little
              more tolerable for everyone.
            </p>
            {introText && (
              <div className="mt-8 p-6 bg-gradient-to-br from-primary-cream/80 to-primary-cream/60 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl text-sm">
                <div className="lg:grid lg:grid-cols-4 lg:gap-5">
                  <div className="col-span-2 justify-center hidden lg:flex">
                    <img
                      src="Img1.jpg"
                      alt="Queue Photo by Krizjohn Rosales:"
                      className="rounded-lg shadow-md h-full object-cover"
                    />
                  </div>

                  <div className="grid col-span-2">
                    <h2 className="font-semibold text-2xl  mb-4">
                      I was frustrated...
                    </h2>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      The idea for this app was born on a hot and humid
                      afternoon, while I was waiting in a line that seemed to
                      have no end. I was at my favorite restaurant, and the sun
                      was beating down on me and the dozens of people waiting
                      for a table.
                    </p>
                    <p className="text-gray-800 leading-relaxed mb-4">
                      I was stuck just standing there for nearly 30 minutes,
                      surrounded by a crowd of people and the constant chatter.
                      All I could think about was how much I'd love to grab a
                      cold drink from the convenience store across the street,
                      but I was afraid of losing my spot in the queue.
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-center my-6">
                  <img
                    src="Img1.jpg"
                    alt="Queue Photo by PROSPER MBEMBA KOUTIHOU"
                    className="rounded-lg shadow-md lg:hidden h-80 object-cover"
                  />
                </div>

                <h2 className="font-semibold text-2xl mb-4">
                  But it wasn't just me...
                </h2>

                <div className="text-gray-800 leading-relaxed mb-4">
                  The restaurant was swamped. The single host was trying to
                  manage the chaos with nothing more than a clipboard and a
                  crumpled piece of paper. He would call out names over the
                  noise, trying to make sure everyone heard their turn, but I
                  could see the stress on his face.
                </div>
                <div className="flex justify-center ">
                  <img
                    src="Img2.jpg"
                    alt="Clip Board Photo by Burst:"
                    className="rounded-lg shadow-md object-cover h-50 w-full "
                  />
                </div>

                <p className="text-gray-800 leading-relaxed mt-5">
                  That's when it hit me: there has to be a better way. I
                  realized that the time I spent standing there, bored and
                  thirsty, was a problem that could be solved with a simple
                  solution. This app is designed to eliminate that wait,
                  allowing people to check in, run their errands, and get a
                  notification the moment their table is ready.
                </p>
              </div>
            )}

            <button
              onClick={toggleIntroText}
              className="w-full text-primary-green hover:text-primary-light-green px-3 py-2 flex items-center justify-center"
            >
              <i
                className={`fa-solid fa-caret-down text-2xl mr-2 transform transition-transform duration-300 ${
                  introText ? "rotate-180" : ""
                }`}
              ></i>
              <span className="text-sm font-medium">
                {introText
                  ? "Read Less..."
                  : "Story Time! Read about how this app came about..."}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
