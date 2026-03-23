function Card({ title, value, color }) {

  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500"
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>

        <div className={`${colors[color]} w-12 h-12 rounded-lg`} />

      </div>

    </div>
  );
}