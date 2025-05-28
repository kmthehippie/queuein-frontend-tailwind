import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useApiPrivate from "../hooks/useApiPrivate";

const IndividualOutlet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const apiPrivate = useApiPrivate();
  const [loading, setLoading] = useState(false);
  const [outletName, setOutletName] = useState(null);

  //* FIND IF OUTLET IS ACTIVE OR NOT?
  useEffect(() => {
    const checkQueueAndRedirect = async () => {
      setLoading(true);
      try {
        const res = await apiPrivate.get(
          `queueActivity/${params.accountId}/${params.outletId}`
        );
        console.log("Here we are trying to set data name", res?.data);
        if (res?.data) {
          setOutletName(res.data.outlet.name);
          if (res.status === 201 && res?.data.queue.active) {
            navigate(
              `/db/${params.accountId}/outlet/${params.outletId}/active/${res.data.queue.id}`,
              { replace: true }
            );
          } else {
            navigate(
              `/db/${params.accountId}/outlet/${params.outletId}/inactive`,
              { replace: true }
            );
          }
        }
      } catch (error) {
        console.error(error);
        setOutletName(error.response.data.outlet.name);
        navigate(`/db/${params.accountId}/outlet/${params.outletId}/inactive`, {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.outletId) {
      checkQueueAndRedirect();
    }
  }, [params.outletId]);

  if (loading) {
    return <div className="">Loading...</div>;
  }
  // const buttonClass = `mt-3 transition ease-in text-white font-light py-2 px-4 rounded-2xl cursor-pointer focus:outline-none focus:shadow-outline min-w-20`;
  // const tableClass = `border-1 mb-1 mr-1 border-stone-400 p-3 text-sm`;
  // const answerClass = `border-1 mb-1 mr-1 border-stone-400 p-3 text-center`;
  // const activeTableHeader = `p-2 border-b-1 border-dashed font-light text-sm`;
  // const activeTableAnswer = `p-2 mt-2 `;

  //   First check if queue is active.
  // If active, no need to get previous queue data, just straight get active queue data
  // If inactive, need to get prev queue data, skip active queue data.

  // return (
  //   <div className="flex items-center justify-center md:w-full md:h-full">
  //     <div className="w-[90%] h-[90%] rounded-2xl p-5 m-1 bg-primary-cream/50 shadow-lg text-left relative">
  //       <h1 className="text-2xl font-semibold">
  //         {outlet.name || "Desa Sri Hartamas"}
  //       </h1>
  //       {/* Start queue means redirect to new page? */}
  //       {!activeQueue && (
  //         <button
  //           className={
  //             buttonClass +
  //             " bg-primary-green hover:bg-primary-dark-green mr-3 border-1 border-transparent hover:border-primary-light-green"
  //           }
  //         >
  //           Start Queue
  //         </button>
  //       )}

  //       {!activeQueue && (
  //         <>
  //           <div className="flex flex-col justify-center items-center border-1 border-white rounded-2xl mt-5 ">
  //             <h1 className="font-semibold mt-6 mb-3 ">Previous Queue Stats</h1>
  //             <div className="grid grid-cols-2 p-2 max-w-lg">
  //               <div className={tableClass}>Queue Date and Time:</div>
  //               <div className={answerClass}>answer</div>
  //               <div className={tableClass}>Queue Name:</div>
  //               <div className={answerClass}>answer</div>
  //               <div className={tableClass}>Average wait time per party:</div>
  //               <div className={answerClass}>answer</div>
  //               <div className={tableClass}>Total parties queued:</div>
  //               <div className={answerClass}>answer</div>
  //               <div className={tableClass}>Total parties seated:</div>
  //               <div className={answerClass}>answer</div>
  //               <div className={tableClass}>Total parties left queue:</div>
  //               <div className={answerClass}>answer</div>
  //               <div className={tableClass}>
  //                 Total duration queue was active:
  //               </div>
  //               <div className={answerClass}>answer</div>
  //             </div>
  //           </div>
  //           <div className="flex flex-col justify-center items-center border-1 border-white rounded-2xl mt-5 mb-5 pb-5 ">
  //             <div className="font-semibold mt-6 mb-3 ">
  //               Previous Queue List
  //             </div>
  //             <div className="text-left w-full pl-5">
  //               <div className="">For Each Queue is a Link</div>
  //               <div className="">To trigger the queue data</div>
  //               <div className="">To be displayed here</div>
  //             </div>
  //             {/* If previous queue list is 0 */}
  //             <div className="text-left w-full pl-5">No queues yet...</div>
  //           </div>
  //         </>
  //       )}

  //       {activeQueue && <div>Active Queue</div>}
  //       <div className="">
  //         <h2>Active Queue Name When Start New Queue</h2>
  //         <button
  //           className={
  //             buttonClass +
  //             "  bg-primary-green hover:bg-primary-dark-green mr-3 border-1 border-primary-light-green px-15"
  //           }
  //         >
  //           Add Customer
  //         </button>
  //         <button
  //           className={
  //             buttonClass +
  //             "  bg-red-700 border-1 border-red-500 hover:bg-red-900 absolute top-0 right-0 mr-3"
  //           }
  //         >
  //           End Queue
  //         </button>
  //         <div className="grid grid-cols-8 w-full text-center my-3 rounded-2xl p-2 shadow-2xl bg-primary-cream md:hidden">
  //           <div className="col-span-2">
  //             <div className={activeTableHeader}>Customer #</div>
  //             <div className={activeTableAnswer}>5</div>
  //           </div>
  //           <div className="col-span-2">
  //             <div className={activeTableHeader}>
  //               <i className="fa-solid fa-clock"></i> Waited
  //             </div>
  //             <div className={activeTableAnswer}>5 minutes</div>
  //           </div>
  //           <div className="col-span-1">
  //             <div className={activeTableHeader}>PAX</div>
  //             <div className={activeTableAnswer}>4</div>
  //           </div>
  //           <div className="col-span-3 ">
  //             <div className={activeTableHeader}>Customer Name</div>
  //             <div className={activeTableAnswer}>John</div>
  //           </div>
  //           <div className="col-span-4">
  //             <div className={activeTableHeader}>
  //               <i className="fa-solid fa-phone"></i> Customer
  //             </div>
  //             <div className={activeTableAnswer}>012 345 6789</div>
  //           </div>
  //           <form className="col-span-4 grid grid-cols-4">
  //             <div className={activeTableHeader + " col-span-4 "}>Status</div>
  //             <div
  //               className={
  //                 activeTableAnswer + " col-span-2 flex justify-center"
  //               }
  //             >
  //               <input
  //                 type="checkbox"
  //                 id="seated"
  //                 className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
  //               />
  //               <label for="seated" className="ml-3 ">
  //                 Seated
  //               </label>
  //             </div>
  //             <div
  //               className={
  //                 activeTableAnswer + " col-span-2 flex justify-center"
  //               }
  //             >
  //               <input
  //                 type="checkbox"
  //                 id="called"
  //                 className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
  //               />
  //               <label for="called" className="ml-3">
  //                 Called
  //               </label>
  //             </div>
  //           </form>
  //         </div>
  //         <div className=" grid-cols-13 w-full my-3 rounded-md p-2 shadow-2xl bg-primary-cream hidden md:grid text-center">
  //           <div className="col-span-2 border-l-10 border-t-1 border-b-1 border-r-1 pt-5 rounded-l-xl pb-5 border-primary-green">
  //             Customer Queue Number
  //           </div>
  //           <div className="col-span-2 border-l-1 border-t-1 border-b-1 border-r-1 p-5 border-primary-green">
  //             Time Waited
  //           </div>
  //           <div className="col-span-1 border-l-1 border-t-1 border-b-1 border-r-1 pt-5 border-primary-green">
  //             PAX
  //           </div>
  //           <div className="col-span-2 border-l-1 border-t-1 border-b-1 border-r-1 p-5 border-primary-green">
  //             Customer Name
  //           </div>
  //           <div className="col-span-3 border-l-1 border-t-1 border-b-1 border-r-1 p-5 border-primary-green">
  //             Customer Contact Number
  //           </div>

  //           <div className=" col-span-3 border-l-1 border-t-1 border-b-1 border-r-1 p-5 rounded-r-xl border-primary-green">
  //             Status
  //           </div>
  //           {/* Enter data */}
  //           <div className="col-span-2 border-l-10 border-b-1 border-r-1 rounded-l-xl border-primary-green">
  //             02
  //           </div>
  //           <div className="col-span-2 border-l-1 border-b-1 border-r-1  border-primary-green">
  //             4 min
  //           </div>
  //           <div className="col-span-1 border-l-1 border-b-1 border-r-1  border-primary-green">
  //             5
  //           </div>
  //           <div className="col-span-2 border-l-1  border-b-1 border-r-1  border-primary-green">
  //             John
  //           </div>
  //           <div className="col-span-3 border-l-1  border-b-1 border-r-1  border-primary-green ">
  //             0111 005 0235
  //           </div>

  //           <div className=" col-span-3 border-l-1 border-b-1 border-r-1  rounded-r-xl border-primary-green">
  //             <form className="grid grid-cols-4">
  //               <div
  //                 className={
  //                   activeTableAnswer + " col-span-2 flex justify-center"
  //                 }
  //               >
  //                 <input
  //                   type="checkbox"
  //                   id="seated"
  //                   className="h-5 w-5 cursor-pointer transition-all rounded shadow hover:shadow-md"
  //                 />
  //                 <label for="seated" className="ml-3 ">
  //                   Seated
  //                 </label>
  //               </div>
  //               <div
  //                 className={
  //                   activeTableAnswer + " col-span-2 flex justify-center"
  //                 }
  //               >
  //                 <input
  //                   type="checkbox"
  //                   id="called"
  //                   className="h-5 w-5 cursor-pointer transition-all rounded "
  //                 />
  //                 <label for="called" className="ml-3">
  //                   Called
  //                 </label>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  //* REDO INDIVIDUAL OUTLET. WE HAVE A PAGE THAT OUTLET TO TWO PAGES. ACTIVEOUTLET AND INACTIVEOUTLET
  return (
    <div className="flex items-center justify-center md:w-full md:h-full pt-12">
      <div className="w-[90%] h-[90%] rounded-2xl p-5 m-1 bg-primary-cream/50 shadow-lg text-left relative">
        <h1 className="font-semibold text-2xl pb-2">{outletName}</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default IndividualOutlet;
