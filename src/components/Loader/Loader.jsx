import { InfinitySpin, RotatingLines } from "react-loader-spinner";

const Loader = ({ color, width }) => {
  return (
    <div className="flex justify-center">
      <RotatingLines
        visible={true}
        height={width}
        width={width}
        strokeColor={color}
        strokeWidth="4"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
export default Loader;
