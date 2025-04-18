import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import {
  UsersIcon,
  CubeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import AddProducts from "./addProducts";
import ADS from "./ADS";

export function Home() {
  const [userCount, setUserCount] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [loading, setLoading] = useState({
    users: true,
    products: true,
    orders: true,
  });
  const [error, setError] = useState({
    users: null,
    products: null,
    orders: null,
  });

  // Custom theme colors
  const theme = {
    white: "#ffffff",
    gold: "#F0BB78",
    dark: "#181818",
  };

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/customers/count"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }
        const data = await response.json();
        setUserCount(data.count);
      } catch (err) {
        setError((prev) => ({ ...prev, users: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    const fetchProductCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/count-products"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product count");
        }
        const data = await response.json();
        setProductCount(data.count);
      } catch (err) {
        setError((prev) => ({ ...prev, products: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, products: false }));
      }
    };

    const fetchOrderCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders/count");
        if (!response.ok) {
          throw new Error("Failed to fetch order count");
        }
        const data = await response.json();
        setOrderCount(data.count);
      } catch (err) {
        setError((prev) => ({ ...prev, orders: err.message }));
      } finally {
        setLoading((prev) => ({ ...prev, orders: false }));
      }
    };

    fetchUserCount();
    fetchProductCount();
    fetchOrderCount();
  }, []);

  const statsData = [
    {
      title: "Total Users",
      value: loading.users
        ? "Loading..."
        : error.users
        ? "Error"
        : userCount?.toLocaleString() || "0",
      icon: UsersIcon,
      iconBg: theme.gold,
      loading: loading.users,
      error: error.users,
    },
    {
      title: "Total Products",
      value: loading.products
        ? "Loading..."
        : error.products
        ? "Error"
        : productCount?.toLocaleString() || "0",
      icon: CubeIcon,
      iconBg: theme.gold,
      loading: loading.products,
      error: error.products,
    },
    {
      title: "Total Orders",
      value: loading.orders
        ? "Loading..."
        : error.orders
        ? "Error"
        : orderCount?.toLocaleString() || "0",
      icon: ShoppingBagIcon,
      iconBg: theme.gold,
      loading: loading.orders,
      error: error.orders,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: theme.white,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="mt-8">
        <Typography
          variant="h3"
          className="mb-6"
          style={{ color: theme.dark, fontWeight: 600 }}
        >
          Dashboard Overview
        </Typography>

        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          {statsData.map(
            ({
              icon: Icon,
              title,
              value,
              iconBg,
              loading: cardLoading,
              error: cardError,
            }) => (
              <Card
                key={title}
                className="border shadow-sm"
                style={{
                  borderColor: "#e5e5e5",
                  backgroundColor: theme.white,
                  overflow: "hidden",
                }}
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  className="p-4"
                  style={{
                    backgroundColor: theme.dark,
                    borderBottom: `3px solid ${theme.gold}`,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <Typography
                      variant="h6"
                      style={{ color: theme.white }}
                      className="font-medium"
                    >
                      {title}
                    </Typography>
                    <div
                      className="rounded-full p-2"
                      style={{ backgroundColor: iconBg }}
                    >
                      <Icon className="h-5 w-5" style={{ color: theme.dark }} />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-5">
                  <div className="flex flex-col gap-2">
                    <Typography
                      variant="h3"
                      style={{ color: theme.dark, fontWeight: "bold" }}
                    >
                      {cardLoading ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : cardError ? (
                        <span style={{ color: "#e53935" }}>Error</span>
                      ) : (
                        value
                      )}
                    </Typography>
                    {cardError && (
                      <Typography variant="small" style={{ color: "#e53935" }}>
                        {cardError}
                      </Typography>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          )}
        </div>
      </div>

      <div className="mt-10">
        <Card
          className="border shadow-sm mb-10"
          style={{
            borderColor: "#e5e5e5",
            backgroundColor: theme.white,
          }}
        >
          <CardHeader
            floated={false}
            shadow={false}
            className="p-4"
            style={{
              backgroundColor: theme.dark,
              borderBottom: `3px solid ${theme.gold}`,
            }}
          >
            <Typography
              variant="h5"
              style={{ color: theme.white }}
              className="font-medium"
            >
              Advertisements
            </Typography>
          </CardHeader>
          <CardBody>
            <ADS />
          </CardBody>
        </Card>

        <Card
          className="border shadow-sm"
          style={{
            borderColor: "#e5e5e5",
            backgroundColor: theme.white,
          }}
        >
          <CardHeader
            floated={false}
            shadow={false}
            className="p-4"
            style={{
              backgroundColor: theme.dark,
              borderBottom: `3px solid ${theme.gold}`,
            }}
          >
            <Typography
              variant="h5"
              style={{ color: theme.white }}
              className="font-medium"
            >
              Add New Products
            </Typography>
          </CardHeader>
          <CardBody>
            <AddProducts />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;

































// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Card,
//   CardBody,
//   CardHeader,
// } from "@material-tailwind/react";
// import {
//   UsersIcon,
//   CubeIcon,
//   ShoppingBagIcon,
//   ChartBarIcon,
// } from "@heroicons/react/24/outline";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import AddProducts from "./addProducts";
// import ADS from "./ADS";

// export function Home() {
//   const [userCount, setUserCount] = useState(null);
//   const [productCount, setProductCount] = useState(null);
//   const [orderCount, setOrderCount] = useState(null);
//   const [monthlySales, setMonthlySales] = useState([]);
//   const [categoryData, setCategoryData] = useState([]);
//   const [userGrowth, setUserGrowth] = useState([]);
//   const [loading, setLoading] = useState({
//     users: true,
//     products: true,
//     orders: true,
//     monthlySales: true,
//     categoryData: true,
//     userGrowth: true,
//   });
//   const [error, setError] = useState({
//     users: null,
//     products: null,
//     orders: null,
//     monthlySales: null,
//     categoryData: null,
//     userGrowth: null,
//   });

//   // Custom theme colors
//   const theme = {
//     white: "#ffffff",
//     gold: "#F0BB78",
//     dark: "#181818",
//     chartColors: ["#F0BB78", "#181818", "#6B7280", "#94A3B8", "#CBD5E1"],
//   };

//   useEffect(() => {
//     const fetchUserCount = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/customers/count"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch user count");
//         }
//         const data = await response.json();
//         setUserCount(data.count);
//       } catch (err) {
//         setError((prev) => ({ ...prev, users: err.message }));
//       } finally {
//         setLoading((prev) => ({ ...prev, users: false }));
//       }
//     };

//     const fetchProductCount = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/count-products"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch product count");
//         }
//         const data = await response.json();
//         setProductCount(data.count);
//       } catch (err) {
//         setError((prev) => ({ ...prev, products: err.message }));
//       } finally {
//         setLoading((prev) => ({ ...prev, products: false }));
//       }
//     };

//     const fetchOrderCount = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/orders/count");
//         if (!response.ok) {
//           throw new Error("Failed to fetch order count");
//         }
//         const data = await response.json();
//         setOrderCount(data.count);
//       } catch (err) {
//         setError((prev) => ({ ...prev, orders: err.message }));
//       } finally {
//         setLoading((prev) => ({ ...prev, orders: false }));
//       }
//     };

//     const fetchMonthlySales = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/sales/monthly");
//         if (!response.ok) {
//           throw new Error("Failed to fetch monthly sales");
//         }
//         const data = await response.json();
//         setMonthlySales(data);
//       } catch (err) {
//         // For demo purposes, use mockup data if API fails
//         const mockData = [
//           { name: "Jan", sales: 4000 },
//           { name: "Feb", sales: 3000 },
//           { name: "Mar", sales: 5000 },
//           { name: "Apr", sales: 2780 },
//           { name: "May", sales: 1890 },
//           { name: "Jun", sales: 2390 },
//           { name: "Jul", sales: 3490 },
//           { name: "Aug", sales: 4000 },
//           { name: "Sep", sales: 3200 },
//           { name: "Oct", sales: 2800 },
//           { name: "Nov", sales: 3300 },
//           { name: "Dec", sales: 5600 },
//         ];
//         setMonthlySales(mockData);
//         setError((prev) => ({ ...prev, monthlySales: "Using sample data" }));
//       } finally {
//         setLoading((prev) => ({ ...prev, monthlySales: false }));
//       }
//     };

//     const fetchCategoryData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/products/categories"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch category data");
//         }
//         const data = await response.json();
//         setCategoryData(data);
//       } catch (err) {
//         // For demo purposes, use mockup data if API fails
//         const mockData = [
//           { name: "Electronics", value: 400 },
//           { name: "Clothing", value: 300 },
//           { name: "Books", value: 200 },
//           { name: "Home", value: 278 },
//           { name: "Other", value: 189 },
//         ];
//         setCategoryData(mockData);
//         setError((prev) => ({ ...prev, categoryData: "Using sample data" }));
//       } finally {
//         setLoading((prev) => ({ ...prev, categoryData: false }));
//       }
//     };

//     const fetchUserGrowth = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/customers/growth"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch user growth");
//         }
//         const data = await response.json();
//         setUserGrowth(data);
//       } catch (err) {
//         // For demo purposes, use mockup data if API fails
//         const mockData = [
//           { name: "Jan", users: 100 },
//           { name: "Feb", users: 120 },
//           { name: "Mar", users: 150 },
//           { name: "Apr", users: 180 },
//           { name: "May", users: 220 },
//           { name: "Jun", users: 280 },
//         ];
//         setUserGrowth(mockData);
//         setError((prev) => ({ ...prev, userGrowth: "Using sample data" }));
//       } finally {
//         setLoading((prev) => ({ ...prev, userGrowth: false }));
//       }
//     };

//     fetchUserCount();
//     fetchProductCount();
//     fetchOrderCount();
//     fetchMonthlySales();
//     fetchCategoryData();
//     fetchUserGrowth();
//   }, []);

//   const statsData = [
//     {
//       title: "Total Users",
//       value: loading.users
//         ? "Loading..."
//         : error.users
//         ? "Error"
//         : userCount?.toLocaleString() || "0",
//       icon: UsersIcon,
//       iconBg: theme.gold,
//       loading: loading.users,
//       error: error.users,
//     },
//     {
//       title: "Total Products",
//       value: loading.products
//         ? "Loading..."
//         : error.products
//         ? "Error"
//         : productCount?.toLocaleString() || "0",
//       icon: CubeIcon,
//       iconBg: theme.gold,
//       loading: loading.products,
//       error: error.products,
//     },
//     {
//       title: "Total Orders",
//       value: loading.orders
//         ? "Loading..."
//         : error.orders
//         ? "Error"
//         : orderCount?.toLocaleString() || "0",
//       icon: ShoppingBagIcon,
//       iconBg: theme.gold,
//       loading: loading.orders,
//       error: error.orders,
//     },
//   ];

//   const renderCustomizedLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
//   }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
//     const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="#fff"
//         textAnchor="middle"
//         dominantBaseline="central"
//       >
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: theme.white,
//         minHeight: "100vh",
//         padding: "20px",
//       }}
//     >
//       <div className="mt-8">
//         <Typography
//           variant="h3"
//           className="mb-6"
//           style={{ color: theme.dark, fontWeight: 600 }}
//         >
//           Dashboard Overview
//         </Typography>

//         <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
//           {statsData.map(
//             ({
//               icon: Icon,
//               title,
//               value,
//               iconBg,
//               loading: cardLoading,
//               error: cardError,
//             }) => (
//               <Card
//                 key={title}
//                 className="border shadow-sm"
//                 style={{
//                   borderColor: "#e5e5e5",
//                   backgroundColor: theme.white,
//                   overflow: "hidden",
//                 }}
//               >
//                 <CardHeader
//                   floated={false}
//                   shadow={false}
//                   className="p-4"
//                   style={{
//                     backgroundColor: theme.dark,
//                     borderBottom: `3px solid ${theme.gold}`,
//                   }}
//                 >
//                   <div className="flex justify-between items-center">
//                     <Typography
//                       variant="h6"
//                       style={{ color: theme.white }}
//                       className="font-medium"
//                     >
//                       {title}
//                     </Typography>
//                     <div
//                       className="rounded-full p-2"
//                       style={{ backgroundColor: iconBg }}
//                     >
//                       <Icon className="h-5 w-5" style={{ color: theme.dark }} />
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardBody className="p-5">
//                   <div className="flex flex-col gap-2">
//                     <Typography
//                       variant="h3"
//                       style={{ color: theme.dark, fontWeight: "bold" }}
//                     >
//                       {cardLoading ? (
//                         <span className="animate-pulse">Loading...</span>
//                       ) : cardError ? (
//                         <span style={{ color: "#e53935" }}>Error</span>
//                       ) : (
//                         value
//                       )}
//                     </Typography>
//                     {cardError && (
//                       <Typography variant="small" style={{ color: "#e53935" }}>
//                         {cardError}
//                       </Typography>
//                     )}
//                   </div>
//                 </CardBody>
//               </Card>
//             )
//           )}
//         </div>
//       </div>

//       {/* Statistical Charts Section */}
//       <div className="mb-12">
//         <Typography
//           variant="h4"
//           className="mb-6"
//           style={{ color: theme.dark, fontWeight: 600 }}
//         >
//           Statistics & Analytics
//         </Typography>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Monthly Sales Chart */}
//           <Card
//             className="border shadow-sm"
//             style={{
//               borderColor: "#e5e5e5",
//               backgroundColor: theme.white,
//             }}
//           >
//             <CardHeader
//               floated={false}
//               shadow={false}
//               className="p-4"
//               style={{
//                 backgroundColor: theme.dark,
//                 borderBottom: `3px solid ${theme.gold}`,
//               }}
//             >
//               <div className="flex justify-between items-center">
//                 <Typography
//                   variant="h6"
//                   style={{ color: theme.white }}
//                   className="font-medium"
//                 >
//                   Monthly Sales Performance
//                 </Typography>
//                 <div
//                   className="rounded-full p-2"
//                   style={{ backgroundColor: theme.gold }}
//                 >
//                   <ChartBarIcon
//                     className="h-5 w-5"
//                     style={{ color: theme.dark }}
//                   />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardBody className="p-4 h-80">
//               {loading.monthlySales ? (
//                 <div className="flex h-full items-center justify-center">
//                   <span className="animate-pulse">Loading chart data...</span>
//                 </div>
//               ) : (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={monthlySales}
//                     margin={{
//                       top: 20,
//                       right: 30,
//                       left: 20,
//                       bottom: 30,
//                     }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                     <XAxis
//                       dataKey="name"
//                       tick={{ fill: theme.dark }}
//                       axisLine={{ stroke: theme.dark }}
//                     />
//                     <YAxis
//                       tick={{ fill: theme.dark }}
//                       axisLine={{ stroke: theme.dark }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: theme.white,
//                         borderColor: theme.gold,
//                         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                       }}
//                     />
//                     <Legend wrapperStyle={{ paddingTop: 10 }} />
//                     <Bar
//                       dataKey="sales"
//                       name="Sales ($)"
//                       fill={theme.gold}
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//               {error.monthlySales && (
//                 <Typography
//                   variant="small"
//                   className="text-center mt-2"
//                   style={{ color: "#e53935" }}
//                 >
//                   {error.monthlySales}
//                 </Typography>
//               )}
//             </CardBody>
//           </Card>

//           {/* User Growth Chart */}
//           <Card
//             className="border shadow-sm"
//             style={{
//               borderColor: "#e5e5e5",
//               backgroundColor: theme.white,
//             }}
//           >
//             <CardHeader
//               floated={false}
//               shadow={false}
//               className="p-4"
//               style={{
//                 backgroundColor: theme.dark,
//                 borderBottom: `3px solid ${theme.gold}`,
//               }}
//             >
//               <div className="flex justify-between items-center">
//                 <Typography
//                   variant="h6"
//                   style={{ color: theme.white }}
//                   className="font-medium"
//                 >
//                   User Growth Trend
//                 </Typography>
//                 <div
//                   className="rounded-full p-2"
//                   style={{ backgroundColor: theme.gold }}
//                 >
//                   <UsersIcon
//                     className="h-5 w-5"
//                     style={{ color: theme.dark }}
//                   />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardBody className="p-4 h-80">
//               {loading.userGrowth ? (
//                 <div className="flex h-full items-center justify-center">
//                   <span className="animate-pulse">Loading chart data...</span>
//                 </div>
//               ) : (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={userGrowth}
//                     margin={{
//                       top: 20,
//                       right: 30,
//                       left: 20,
//                       bottom: 30,
//                     }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                     <XAxis
//                       dataKey="name"
//                       tick={{ fill: theme.dark }}
//                       axisLine={{ stroke: theme.dark }}
//                     />
//                     <YAxis
//                       tick={{ fill: theme.dark }}
//                       axisLine={{ stroke: theme.dark }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: theme.white,
//                         borderColor: theme.gold,
//                         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                       }}
//                     />
//                     <Legend wrapperStyle={{ paddingTop: 10 }} />
//                     <Line
//                       type="monotone"
//                       dataKey="users"
//                       name="New Users"
//                       stroke={theme.dark}
//                       strokeWidth={2}
//                       dot={{ fill: theme.gold, stroke: theme.dark, r: 4 }}
//                       activeDot={{ r: 6, fill: theme.gold }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               )}
//               {error.userGrowth && (
//                 <Typography
//                   variant="small"
//                   className="text-center mt-2"
//                   style={{ color: "#e53935" }}
//                 >
//                   {error.userGrowth}
//                 </Typography>
//               )}
//             </CardBody>
//           </Card>
//         </div>

//         {/* Product Categories Chart */}
//         <Card
//           className="border shadow-sm"
//           style={{
//             borderColor: "#e5e5e5",
//             backgroundColor: theme.white,
//           }}
//         >
//           <CardHeader
//             floated={false}
//             shadow={false}
//             className="p-4"
//             style={{
//               backgroundColor: theme.dark,
//               borderBottom: `3px solid ${theme.gold}`,
//             }}
//           >
//             <div className="flex justify-between items-center">
//               <Typography
//                 variant="h6"
//                 style={{ color: theme.white }}
//                 className="font-medium"
//               >
//                 Product Categories Distribution
//               </Typography>
//               <div
//                 className="rounded-full p-2"
//                 style={{ backgroundColor: theme.gold }}
//               >
//                 <CubeIcon className="h-5 w-5" style={{ color: theme.dark }} />
//               </div>
//             </div>
//           </CardHeader>
//           <CardBody className="p-4 h-96">
//             {loading.categoryData ? (
//               <div className="flex h-full items-center justify-center">
//                 <span className="animate-pulse">Loading chart data...</span>
//               </div>
//             ) : (
//               <div className="flex flex-col md:flex-row items-center justify-center h-full">
//                 <ResponsiveContainer width="100%" height="80%">
//                   <PieChart>
//                     <Pie
//                       data={categoryData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderCustomizedLabel}
//                       outerRadius={120}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {categoryData.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={
//                             theme.chartColors[index % theme.chartColors.length]
//                           }
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: theme.white,
//                         borderColor: theme.gold,
//                         boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                       }}
//                       formatter={(value, name) => [`${value} items`, name]}
//                     />
//                     <Legend
//                       layout="horizontal"
//                       verticalAlign="bottom"
//                       align="center"
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             )}
//             {error.categoryData && (
//               <Typography
//                 variant="small"
//                 className="text-center mt-2"
//                 style={{ color: "#e53935" }}
//               >
//                 {error.categoryData}
//               </Typography>
//             )}
//           </CardBody>
//         </Card>
//       </div>

//       <div className="mt-10">
//         <Card
//           className="border shadow-sm mb-10"
//           style={{
//             borderColor: "#e5e5e5",
//             backgroundColor: theme.white,
//           }}
//         >
//           <CardHeader
//             floated={false}
//             shadow={false}
//             className="p-4"
//             style={{
//               backgroundColor: theme.dark,
//               borderBottom: `3px solid ${theme.gold}`,
//             }}
//           >
//             <Typography
//               variant="h5"
//               style={{ color: theme.white }}
//               className="font-medium"
//             >
//               Advertisements
//             </Typography>
//           </CardHeader>
//           <CardBody>
//             <ADS />
//           </CardBody>
//         </Card>

//         <Card
//           className="border shadow-sm"
//           style={{
//             borderColor: "#e5e5e5",
//             backgroundColor: theme.white,
//           }}
//         >
//           <CardHeader
//             floated={false}
//             shadow={false}
//             className="p-4"
//             style={{
//               backgroundColor: theme.dark,
//               borderBottom: `3px solid ${theme.gold}`,
//             }}
//           >
//             <Typography
//               variant="h5"
//               style={{ color: theme.white }}
//               className="font-medium"
//             >
//               Add New Products
//             </Typography>
//           </CardHeader>
//           <CardBody>
//             <AddProducts />
//           </CardBody>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default Home;
