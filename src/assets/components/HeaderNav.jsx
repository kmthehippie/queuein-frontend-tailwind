import NavButton from "./NavButtons";

const HeaderNav = () => {
  const navButtons = [
    { text: "HOME", path: "/" },
    { text: "REGISTER", path: "/db/register" },
    { text: "LOGIN", path: "/db/login" },
    { text: "SAMPLE", path: "/nasi-lemak-burung-hantu-sample" },
  ];
  return (
    <div className="z-10 sticky top-0 w-auto flex justify-center md:justify-end gap-5 py-2 bg-primary-cream px-5 flex-end mb-5">
      {navButtons.map((button) => (
        <NavButton key={button.text} text={button.text} path={button.path} />
      ))}
    </div>
  );
};

export default HeaderNav;
