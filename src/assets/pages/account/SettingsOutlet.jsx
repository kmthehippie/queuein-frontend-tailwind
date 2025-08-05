import React, { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useApiPrivate from "../../hooks/useApiPrivate";
import UpdateOutletModal from "../../components/UpdateOutletModal";

//TODO: SELF NOTES: HOW ABOUT CREATING A COMPONENT THAT TAKES IN NAME OF FIELD, DATA TO DISPLAY, AND ETC. THAT WAY WE CAN JUST CREATE COMPONENT FOR EVERY DIV INSTEAD OF SO MUCH REPEATED CODE.

// const SettingsOutlet = () => {
//   const { accountId } = useAuth();
//   const apiPrivate = useApiPrivate();
//   const navigate = useNavigate();

//   const [allOutlets, setAllOutlets] = useState([]);
//   const [selectedOutletId, setSelectedOutletId] = useState(0);
//   const [selectedOutlet, setSelectedOutlet] = useState({});
//   const [isEditing, setIsEditing] = useState({
//     name: false,
//     location: false,
//     googleMaps: false,
//     wazeMaps: false,
//     defaultEstWaitTime: false,
//     hours: false,
//   });

//   const [dataToSend, setDataToSend] = useState({});

//   const handleQRCodeNavigate = () => {
//     navigate(`/db/${accountId}/settings/outlet/qr/${selectedOutletId.id}`);
//   };

//   // In SettingsOutlet
//   const handleOutletChange = (id) => {
//     console.log(dataToSend);
//     const selected = allOutlets.find((outlet) => outlet.id === id);
//     if (selected) {
//       setSelectedOutletId(selected.id);
//       setSelectedOutlet(selected);
//       setDataToSend(selected);
//     }
//   };

//   const handleSave = (field) => {
//     setDataToSend((prev) => ({ ...prev, [field]: selectedOutlet[field] }));
//     toggleEditing(field);
//   };

//   const handleCancel = (field) => {
//     setSelectedOutlet((prev) => ({ ...prev, [field]: dataToSend[field] }));
//     toggleEditing(field);
//   };

//   const handleInputChange = (field, e) => {
//     const value =
//       field === "defaultEstWaitTime"
//         ? minsToMs(e.target.value)
//         : e.target.value;
//     setSelectedOutlet((prev) => ({ ...prev, [field]: value }));
//     setSelectedOutlet((prev) => ({ ...prev, [field]: e.target.value }));
//   };
//   const convertedWaitTimeValue = useMemo(() => {
//     return msToMins(selectedOutlet.defaultEstWaitTime);
//   }, [selectedOutlet.defaultEstWaitTime]);

//   const convertedOriginalWaitTime = useMemo(() => {
//     const originalOutlet = allOutlets.find((o) => o.id === selectedOutletId);
//     return originalOutlet ? msToMins(originalOutlet.defaultEstWaitTime) : "";
//   }, [allOutlets, selectedOutletId]);

//   const toggleEditing = (field) => {
//     setIsEditing((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   useEffect(() => {
//     const fetchAllOutlets = async () => {
//       try {
//         const res = await apiPrivate.get(`/alloutlets/${accountId}`);
//         if (res.data.length > 0) {
//           setAllOutlets(res.data);
//           const initialOutlet = res.data[0];

//           // Perform all initial state updates in one logical block
//           setSelectedOutletId(initialOutlet.id);
//           setSelectedOutlet(initialOutlet);
//           setDataToSend(initialOutlet);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchAllOutlets();
//   }, []);
//   return (
//     <div className="">
//       <div className="lg:grid lg:grid-cols-5 lg:gap-2 overflow-y-auto max-h-140 ">
//         <div className="lg:col-span-1  border-primary-light-green p-2 bg-primary-cream border-b-1 ">
//           {allOutlets && (
//             <div className="flex flex-wrap w-full lg:flex-col">
//               {allOutlets.map((outlet) => (
//                 <div
//                   className={`lg:mb-5 cursor-pointer m-0.5 text-sm border-1 border-primary-light-green font-light hover:text-primary-green transition delay-100 duration-150 p-2 ${
//                     selectedOutletId === outlet.id
//                       ? "border-4 border-primary-light-green"
//                       : ""
//                   }`}
//                   key={outlet.id}
//                 >
//                   <button
//                     className=" cursor-pointer"
//                     onClick={() => handleOutletChange(outlet.id)}
//                   >
//                     {outlet.name}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="lg:col-span-4 p-3">
//           {allOutlets && selectedOutletId !== 0 && (
//             <div className="">
//               <div className="text-3xl font-light pb-3 pt-0">
//                 {allOutlets[selectedOutletId - 1].name}
//               </div>
//               <button onClick={handleQRCodeNavigate}>QR Code</button>
//               {/* //TODO: FIX THIS PART TO IDENTIFY IF DATATOSEND === SELECTEDOUTLET
//               PROPERLY. IF TRUE -- SHOW BUTTON, IF FALSE, NO BUTTON. */}
//               {dataToSend == selectedOutlet ? (
//                 <div>There are No Changes </div>
//               ) : (
//                 <div>
//                   <button>Save All</button> required{" "}
//                 </div>
//               )}
//               <form>
//                 <EditableField
//                   label="Outlet Name"
//                   value={selectedOutlet.name}
//                   originalValue={allOutlets[
//                     selectedOutletId - 1
//                   ].name.toString()}
//                   isEditing={isEditing.name}
//                   onToggleEditing={() => toggleEditing("name")}
//                   onSave={() => handleSave("name")}
//                   onCancel={() => handleCancel("name")}
//                   onInputChange={(e) => handleInputChange("name", e)}
//                 />
//                 <EditableField
//                   label="Outlet Location"
//                   value={selectedOutlet.location}
//                   originalValue={allOutlets[
//                     selectedOutletId - 1
//                   ].location.toString()}
//                   isEditing={isEditing.location}
//                   onToggleEditing={() => toggleEditing("location")}
//                   onSave={() => handleSave("location")}
//                   onCancel={() => toggleEditing("location")}
//                   onInputChange={(e) => handleInputChange("location", e)}
//                 />
//                 <EditableField
//                   label="Outlet Google Maps"
//                   value={selectedOutlet.googleMaps}
//                   originalValue={allOutlets[
//                     selectedOutletId - 1
//                   ].googleMaps.toString()}
//                   isEditing={isEditing.googleMaps}
//                   onToggleEditing={() => toggleEditing("googleMaps")}
//                   onSave={() => handleSave("googleMaps")}
//                   onCancel={() => toggleEditing("googleMaps")}
//                   onInputChange={(e) => handleInputChange("googleMaps", e)}
//                 />
//                 <EditableField
//                   label="Outlet Waze Maps"
//                   value={selectedOutlet.wazeMaps}
//                   originalValue={allOutlets[
//                     selectedOutletId - 1
//                   ].wazeMaps.toString()}
//                   isEditing={isEditing.wazeMaps}
//                   onToggleEditing={() => toggleEditing("wazeMaps")}
//                   onSave={() => handleSave("wazeMaps")}
//                   onCancel={() => toggleEditing("wazeMaps")}
//                   onInputChange={(e) => handleInputChange("wazeMaps", e)}
//                 />
//                 <EditableField
//                   label="Outlet Default Estimate Wait Time Per Customer"
//                   value={convertedWaitTimeValue}
//                   originalValue={convertedOriginalWaitTime}
//                   isEditing={isEditing.defaultEstWaitTime}
//                   onToggleEditing={() => toggleEditing("defaultEstWaitTime")}
//                   onSave={() => handleSave("defaultEstWaitTime")}
//                   onCancel={() => toggleEditing("defaultEstWaitTime")}
//                   onInputChange={(e) =>
//                     handleInputChange("defaultEstWaitTime", e)
//                   }
//                   additionalInfo="mins"
//                 />
//                 <EditableField
//                   label="Outlet Opening Hours"
//                   value={selectedOutlet.hours}
//                   originalValue={allOutlets[
//                     selectedOutletId - 1
//                   ].hours.toString()}
//                   isEditing={isEditing.hours}
//                   onToggleEditing={() => toggleEditing("hours")}
//                   onSave={() => handleSave("hours")}
//                   onCancel={() => toggleEditing("hours")}
//                   onInputChange={(e) => handleInputChange("hours", e)}
//                 />
//                 <EditableField
//                   label="Outlet Phone Number"
//                   value={selectedOutlet.phone}
//                   originalValue={allOutlets[
//                     selectedOutletId - 1
//                   ].phone.toString()}
//                   isEditing={isEditing.phone}
//                   onToggleEditing={() => toggleEditing("phone")}
//                   onSave={() => handleSave("phone")}
//                   onCancel={() => toggleEditing("phone")}
//                   onInputChange={(e) => handleInputChange("phone", e)}
//                 />
//                 <EditableField
//                   label="Outlet Image URL"
//                   value={selectedOutlet.imgUrl}
//                   originalValue={allOutlets[
//                     selectedOutletId - 1
//                   ].imgUrl.toString()}
//                   isEditing={isEditing.imgUrl}
//                   onToggleEditing={() => toggleEditing("imgUrl")}
//                   onSave={() => handleSave("imgUrl")}
//                   onCancel={() => toggleEditing("imgUrl")}
//                   onInputChange={(e) => handleInputChange("imgUrl", e)}
//                   additionalInfo={
//                     <img
//                       src={selectedOutlet.imgUrl}
//                       alt={`Image of ${allOutlets[selectedOutletId - 1].name}`}
//                     />
//                   }
//                 />
//                 <p className="small font-light italic text-xs text-gray-600">
//                   If the image URL is working, the image should be displayed
//                   above me. Else, please check the image URL that you keyed in.
//                 </p>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

const SettingsOutlet = () => {
  const { accountId } = useAuth();
  const apiPrivate = useApiPrivate();

  const [allOutlets, setAllOutlets] = useState([]);
  const [selectedOutletId, setSelectedOutletId] = useState(0);
  const [selectedOutlet, setSelectedOutlet] = useState({});

  // In SettingsOutlet
  const handleOutletChange = (id) => {
    const selected = allOutlets.find((outlet) => outlet.id === id);
    if (selected) {
      setSelectedOutletId(selected.id);
      setSelectedOutlet(selected);
    }
  };

  useEffect(() => {
    const fetchAllOutlets = async () => {
      try {
        const res = await apiPrivate.get(`/alloutlets/${accountId}`);
        if (res.data.length > 0) {
          setAllOutlets(res.data);
          const initialOutlet = res.data[0];

          // Perform all initial state updates in one logical block
          setSelectedOutletId(initialOutlet.id);
          setSelectedOutlet(initialOutlet);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllOutlets();
  }, []);

  const handleCancel = () => {
    console.log("Handling cancel");
    console.log("selected outlet:", selectedOutlet);
  };

  const handleUpdateSuccess = (updatedOutlet) => {
    console.log("Updated Outlet", updatedOutlet);
    const outletIndex = allOutlets.findIndex(
      (outlet) => outlet.id === updatedOutlet.id
    );
    if (outletIndex !== -1) {
      const newAllOutlets = [...allOutlets];
      newAllOutlets[outletIndex] = updatedOutlet;
      setAllOutlets(newAllOutlets);
    }
    setSelectedOutlet(updatedOutlet);
  };

  return (
    <div className="">
      <div className="lg:grid lg:grid-cols-5 lg:gap-2 overflow-y-auto max-h-140  ">
        <div className="lg:col-span-1  border-primary-light-green p-2 bg-primary-cream z-10 sticky top-0 border-b-1">
          {allOutlets && (
            <div className="flex flex-wrap w-full lg:flex-col">
              {allOutlets.map((outlet) => (
                <div
                  className={`lg:mb-5 cursor-pointer m-0.5 text-sm border-1 border-primary-light-green font-light hover:text-primary-green transition delay-100 duration-150 p-2 ${
                    selectedOutletId === outlet.id
                      ? "border-4 border-primary-light-green"
                      : ""
                  }`}
                  key={outlet.id}
                >
                  <button
                    className=" cursor-pointer"
                    onClick={() => handleOutletChange(outlet.id)}
                  >
                    {outlet.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 p-3">
          <UpdateOutletModal
            show={true}
            onClose={handleCancel} // Pass toggleEdit as the close handler
            outletData={selectedOutlet} // Pass the full outlet object
            accountId={accountId}
            onUpdateSuccess={handleUpdateSuccess}
            view={"full"}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsOutlet;
