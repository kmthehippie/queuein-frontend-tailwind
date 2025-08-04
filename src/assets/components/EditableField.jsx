import React from "react";

const EditableField = ({
  label,
  value,
  originalValue,
  isEditing,
  onToggleEditing,
  onSave,
  onCancel,
  onInputChange,
  additionalInfo,
}) => {
  const outletClass = `flex items-center pb-3 text-sm `;

  return (
    <div className="flex">
      {isEditing ? (
        <div className="border-1 p-2 border-primary-light-green w-80vw lg:flex lg:flex-col w-full">
          <label htmlFor={label} className="text-sm font-light text-center">
            Editing {label}:
          </label>
          <input
            type="text"
            name={label}
            id={label}
            value={value}
            onChange={onInputChange}
            className={`pt-1  focus:outline-hidden border-b-1 border-gray-300 focus:border-b focus:border-primary-light-green focus:font-light italic`}
          />
          <div className="flex justify-center mt-3">
            <div
              className="cursor-pointer border-1 border-white hover:border-primary-light-green px-2 rounded-lg py-1"
              onClick={onSave}
            >
              <i className="fa-solid fa-floppy-disk text-primary-light-green cursor-pointer p-1 "></i>{" "}
              Save
            </div>
            <div
              className="cursor-pointer border-1 border-white hover:border-primary-light-green px-2 rounded-lg py-1"
              onClick={onCancel}
            >
              <i className="fa-solid fa-x text-primary-light-green cursor-pointer"></i>{" "}
              Cancel
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="pr-2 m-0" onClick={onToggleEditing}>
            <i className="fa-solid fa-pencil  text-primary-light-green cursor-pointer"></i>
          </div>
          <div className={outletClass}>
            <div className="lg:flex">
              <p className="lg:w-30">{label}</p>
              <p
                className={` ${
                  value === originalValue
                    ? "font-light"
                    : " text-red-800 font-light"
                } `}
              >
                {value ? value : "Not Available"} {additionalInfo}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableField;
