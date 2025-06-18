import React from "react";
import useApiPrivate from "../../hooks/useApiPrivate";

const Settings = () => {
  const interceptedApiPrivate = useApiPrivate();

  // const fakeDataForOutlet = {
  //   name: "Desa Seri Hartamas",
  //   location:
  //     "NO 1 - G, Wisma CKL, Jalan 22A/70A, Desa Sri Hartamas, 50480 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
  //   googleMaps: "https://maps.app.goo.gl/U4hXsu7ycSFgtny79",
  //   wazeMaps: "https://waze.com/ul/hw283cpufv",
  //   imgUrl:
  //     "https://nlbh.my/wp-content/uploads/2024/12/Hartamas_Entrance-1024x657.png",
  //   defaultEstWaitTime: 300000,
  //   phone: "012-788 2808",
  //   hours: "24 hours",
  // };

  // const fakeDataForOutlet = {
  //   name: "Taman Tun Dr Ismail 1",
  //   location:
  //     "19, Lorong Rahim Kajai 13, Taman Tun Dr Ismail, 60000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
  //   googleMaps: "https://maps.app.goo.gl/5xD7ua2CvpHP3vbAA",
  //   wazeMaps: "https://waze.com/ul/hw283bqr20",
  //   imgUrl:
  //     "https://nlbh.my/wp-content/uploads/2024/12/TTDI1_Entrance-1024x657.png",
  //   defaultEstWaitTime: 300000,
  //   phone: "013-223 2808",
  //   hours: "12pm - 1am",
  // };

  // const fakeDataForOutlet = {
  //   name: "Taman Tun Dr Ismail 2",
  //   location:
  //     "19, Lorong Rahim Kajai 13, Taman Tun Dr Ismail, 60000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
  //   googleMaps: "https://maps.app.goo.gl/5xD7ua2CvpHP3vbAA",
  //   wazeMaps: "https://waze.com/ul/hw283bqr20",
  //   imgUrl:
  //     "https://nlbh.my/wp-content/uploads/2024/12/TTDI1_Entrance-1024x657.png",
  //   defaultEstWaitTime: 300000,
  //   phone: "013-223 2808",
  //   hours: "12pm - 1am",
  // };

  // const fakeDataLogo = {
  //   companyName: "Nasi Lemak Burung Hantu",
  //   logo: "https://nlbh.my/wp-content/uploads/2024/12/Website-Logo-NLBH-150x150.png",
  // };

  const startFakeQueue = {
    outletId: 1,
    name: "Starting fake queue for outlet 1",
  };

  //create customer for outlet 3
  // const createCustomerAndQueueItem = {
  //   customerName: "Damien",
  //   number: "019-495 6652",
  //   pax: 2,
  //   VIP: true,
  //   outletId: 3,
  //   queueId: "573213ca-3038-47f9-bad2-5cbc448f8f94",
  // };
  // const createCustomerAndQueueItem = {
  //   customerName: "Leon",
  //   number: "019-435 6632",
  //   pax: 3,
  //   VIP: true,
  //   outletId: 3,
  //   queueId: "573213ca-3038-47f9-bad2-5cbc448f8f94",
  // };
  // const createCustomerAndQueueItem = {
  //   customerName: "Leong",
  //   number: "019-125 2352",
  //   pax: 2,
  //   VIP: true,
  //   outletId: 1,
  //   queueId: "573213ca-3038-47f9-bad2-5cbc448f8f94",
  // };
  // const createCustomerAndQueueItem = {
  //   customerName: "Ho",
  //   number: "013-125 2322",
  //   pax: 4,
  //   VIP: true,
  //   outletId: 3,
  //   queueId: "573213ca-3038-47f9-bad2-5cbc448f8f94",
  // };

  // create customer for outlet 1
  // const createCustomerAndQueueItem = {
  //   customerName: "Donovan",
  //   number: "019-422 6652",
  //   pax: 2,
  //   VIP: true,
  //   outletId: 1,
  //   queueId: "a234e1bd-52b9-474e-b9ba-6aee5e3242ca",
  // };
  // const createCustomerAndQueueItem = {
  //   customerName: "Jean",
  //   number: "0111-435 232",
  //   pax: 2,
  //   VIP: true,
  //   outletId: 1,
  //   queueId: "a234e1bd-52b9-474e-b9ba-6aee5e3242ca",
  // };
  // const createCustomerAndQueueItem = {
  //   customerName: "Kathy",
  //   number: "017-444 6232",
  //   pax: 4,
  //   VIP: false,
  //   outletId: 1,
  //   queueId: "a234e1bd-52b9-474e-b9ba-6aee5e3242ca",
  // };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = interceptedApiPrivate.post("/test", startFakeQueue);
      console.log("Received response from /test ", response.data);
    } catch (err) {
      console.error(
        "Error handling use interceptedApiPrivate to post fakeDataForOutlet",
        err
      );
    }
  };
  return (
    <div>
      <h1>Testing route and also handling creation of fake outlet data</h1>
      <button type="button" onClick={handleClick}>
        Click to create fake data
      </button>
    </div>
  );
};

export default Settings;
