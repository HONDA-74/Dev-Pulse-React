import { v4 as uuid } from "uuid";
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import { useReducer } from "react";


const images = [img1, img2, img3];

const reducer = (state , action) => {
  switch (action.type) {
    case "next":
      return (state + 1) % images.length;
    case "prev":
      return (state - 1 + 3) % images.length;
      case "set":
        return action.payload
    default:
      return state;
  }
};

function Slider() {
  const [currentIndex, dispatch] = useReducer(reducer, 0);

  const next = () => {
    dispatch({ type: "next" });
  };

  const prev = () => {
    dispatch({ type: "prev" });
  };

  return (
    <div className="max-w-5xl mx-auto my-8 px-6">
      <div className="relative w-full h-72 md:h-80 overflow-hidden rounded-2xl shadow-xl bg-white">

        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-2xl text-slate-700 shadow-md hover:bg-indigo-500 hover:text-white transition-all duration-200"
          onClick={prev}>
          ‹
        </button>

        <div
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}>
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              className="min-w-full h-full object-cover"
            />
          ))}
        </div>

        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-2xl text-slate-700 shadow-md hover:bg-indigo-500 hover:text-white transition-all duration-200"
          onClick={next}>
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <span
              key={uuid()}
              onClick={() => dispatch({ type: "set"  , payload: index })}
              className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? "bg-indigo-500 w-6"
                  : "bg-white/60 w-2.5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
