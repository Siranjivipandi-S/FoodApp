import scrolldown from "../assets/scrolldown.gif";

function GreetComp() {
  function scrolltoDown() {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth",
    });
  }
  const user = localStorage.getItem("user");

  return (
    <div className="absolute top-72 mt-10 h-[410px] w-[550px]">
      <div className="flex flex-col gap-5 ml-6">
        <h1 className="text-7xl title-gradient ml-3 select-none">
          Food Ordering Application
        </h1>

        {user && (
          <h1 className="text-6xl ml-3 p-2 text-gradient selection:bg-orange-300 selection:text-white">
            Hey {user.slice(0, 1).toUpperCase() + user.slice(1)}!
          </h1>
        )}

        <div className="ml-5">
          <button
            onClick={scrolltoDown}
            className="p-2 bg-gradient-to-r from-slate-200 via-orange-400 to-orange-300 rounded-xl w-40 h-fit flex flex-row items-center justify-center gap-5 font-medium hover:scale-105 transition-transform hover:bg-yellow-500"
          >
            Scroll Down
            <img src={scrolldown} className="h-9 w-9"></img>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GreetComp;
