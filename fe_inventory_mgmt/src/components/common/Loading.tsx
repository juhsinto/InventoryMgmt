import loadingGif from "/loading.gif"; // Assuming your GIF is in the public folder

const LoadingSpinner = () => {
  return (
    <div className=" justify-center items-center p-10">
      <img src={loadingGif} alt="Loading..." className="w-16 h-16" />
    </div>
  );
};

export default LoadingSpinner;
