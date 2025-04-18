import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function OccasionProducts() {
  const { occasionName } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // مثل: GET /api/products/occasions/winter
    axios
      .get(`http://localhost:5000/api/occasions/${occasionName}`)
      .then((res) => {
        setProducts(res.data.data); // لو رجّعت حقل data
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  }, [occasionName]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Occasion: {occasionName}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <div key={item.id} className="border p-2">
            {/* بطاقة المنتج */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-gray-600">Price: ${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OccasionProducts;
