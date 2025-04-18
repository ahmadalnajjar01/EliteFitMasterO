import ChoozrWidget from "../components/tech/ChoozrWidget";


const Technology = () => {
  return (
    <div>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">🔹 تجربة Choozr في React</h1>
        <ChoozrWidget productId="12345" />
      </div>
    </div>
  );
};

export default Technology;