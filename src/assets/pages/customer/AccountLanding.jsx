import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Link, useParams } from "react-router-dom";
import Error from "../Error";

const AccountLanding = () => {
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [outlets, setOutlets] = useState([]);

  const { acctSlug } = useParams();

  useEffect(() => {
    const fetchLandingPageData = async () => {
      setLoading(true);
      console.log("Fetching landing page");
      setErrors("");
      try {
        const res = await api.get(`/landingPage/${acctSlug}`);
        console.log("res returned", res.data);
        if (res?.data?.accountInfo) {
          setCompanyName(res.data.accountInfo.companyName);
          setLogoUrl(res.data.accountInfo.logo);
          setOutlets(res.data.outletsWithQueue || []);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching landing page ", err);
        setLoading(false);
        setErrors({
          message: err?.response?.data?.message || err?.message,
          statusCode: err.response?.status || err?.status,
        });
      }
    };
    fetchLandingPageData();
  }, [acctSlug]);

  if (loading) {
    return <div>Loading Information...</div>;
  }
  if (errors) {
    return <Error error={errors} />;
  }

  return (
    <div className="flex-row items-center justify-center p-0 sm:p-3 md:p-15">
      <div className="flex items-center w-full">
        <img
          src={logoUrl || null}
          alt={companyName + " logo"}
          className="w-30"
        />
        <h1 className="text-2xl font-bold tracking-wide sm:text-3xl md:text-4xl lg:text-5xl">
          {companyName.toUpperCase()}
        </h1>
      </div>
      <h2 className="text-3xl text-stone-600 mt-4 shadow-[0_4px_6px_-6px_black] px-5 pb-2 pt-4">
        Our locations:
      </h2>
      {/* Outlets here */}
      <div>
        {outlets.length > 0 ? (
          outlets.map((outlet) => (
            <div
              className="p-5 flex-row lg:flex justify-center-safe items-center"
              key={outlet.id}
            >
              {outlet.imgUrl && (
                <div className="min-w-xs">
                  <Link to={`outlet/${outlet.id}`}>
                    <img
                      src={outlet.imgUrl || null}
                      alt={outlet.name + " image"}
                      className="w-full "
                    />
                  </Link>
                </div>
              )}
              <div className=" flex-row lg:pl-10 pt-3 lg:pt-0">
                <h3 className="text-xl text-stone-600 font-bold pb-2 hover:text-primary-green">
                  <Link to={`outlet/${outlet.id}`}>{outlet.name}</Link>
                </h3>
                {outlet.location && <p className="pb-1 ">{outlet.location}</p>}
                {outlet.googleMaps && (
                  <div className="p-1 ">
                    <a href={outlet.googleMaps}>
                      <i
                        className="fa-solid fa-location-dot"
                        style={{ color: "#497B04" }}
                      ></i>
                      <span className="pl-4  hover:text-primary-green">
                        Maps
                      </span>
                    </a>
                  </div>
                )}
                {outlet.wazeMaps && (
                  <div className="p-1">
                    <a href={outlet.wazeMaps} className="">
                      <i
                        className="fa-brands fa-waze"
                        style={{ color: "#497B04" }}
                      ></i>
                      <span className="pl-3  hover:text-primary-green">
                        Waze
                      </span>
                    </a>
                  </div>
                )}
                {outlet.hours && (
                  <p className="p-1">
                    <i
                      className="fa-solid fa-clock"
                      style={{ color: "#497B04" }}
                    ></i>
                    <span className="pl-3">{outlet.hours}</span>
                  </p>
                )}
                {outlet.phone && (
                  <p className="p-1">
                    <i
                      className="fa-solid fa-phone"
                      style={{ color: "#497B04" }}
                    ></i>
                    <a
                      href={`tel:${outlet.phone}`}
                      className="pl-3  hover:text-primary-green"
                    >
                      {outlet.phone}
                    </a>
                  </p>
                )}
                {outlet.queues && (
                  <p className="flex p-1">
                    <img src="/Q-logo.svg" alt="Queue Logo" className="w-5" />
                    <span className="pl-3">
                      {outlet.queues.length > 0 ? (
                        <Link to={`join/${outlet.queues[0].id}`}>
                          {/* IMPORTANT: // Find out the queueItems. If they exist, then  depending on the count, Busy, Not Busy, Very Busy...etc for now placeholder just the queue id will do*/}
                          {outlet.queues[0].queueLength > 5 ? (
                            <span className="text-red-700 hover:text-primary-dark-green transition ease-in">
                              Very Busy
                            </span>
                          ) : outlet.queues[0].queueLength > 3 ? (
                            <span className="text-orange-500 hover:text-primary-dark-green transition ease-in">
                              Busy
                            </span>
                          ) : (
                            <span className="text-primary-green hover:text-primary-dark-green transition ease-in">
                              Short Queue
                            </span>
                          )}
                        </Link>
                      ) : (
                        "Quick Entry"
                      )}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No outlets available yet</p>
        )}
      </div>
    </div>
  );
};

export default AccountLanding;
