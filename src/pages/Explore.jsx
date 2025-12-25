// import { useEffect, useState } from "react";
// import { getUsers, searchUsers } from "../services/api";
// import { followUser } from "../services/api";
// import { useNavigate } from "react-router-dom";

// export default function Explore() {
//   const [users, setUsers] = useState([]);
//   const [query, setQuery] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     getUsers().then(setUsers);
//   }, []);

//   const handleSearch = async (e) => {
//     const q = e.target.value;
//     setQuery(q);

//     if (q === "") {
//       getUsers().then(setUsers);
//     } else {
//       searchUsers(q).then(setUsers);
//     }
//   };

//   const handleFollow = async (id) => {
//     await followUser(id);
//     getUsers().then(setUsers);
//   };

//   const handleSearchClick = async () => {
//   if (query.trim() === "") {
//     getUsers().then(setUsers);
//   } else {
//     const results = await searchUsers(query);
//     setUsers(results);
//   }
// };


//   return (
//     <div className="min-h-screen bg-pink-50 p-6">
//       <h2 className="text-2xl font-bold text-black mb-4">
//         Explore Users
//       </h2>

//       <input
//         value={query}
//         onChange={handleSearch}
//         placeholder="Search users..."
//         className="w-full p-3 mb-4 border rounded-lg focus:outline-none"
//       />

//       {users.map((u) => (
//         <div
//           key={u.id}
//           className="bg-white p-4 rounded-lg shadow mb-3
//                      flex justify-between items-center
//                      hover:scale-105 transition cursor-pointer"
//         >
//           <div onClick={() => navigate(`/profile/${u.id}`)}>
//             <p className="font-semibold text-black">
//               {u.email}
//             </p>
//             <p className="text-sm text-gray-600">
//               Followers: {u.followers}
//             </p>
//           </div>

//           <button
//             onClick={() => handleFollow(u.id)}
//             className="bg-lightpink px-4 py-2 rounded-lg
//                        hover:bg-pink-400 transition text-black"
//           >
//             {u.is_following ? "Unfollow" : "Follow"}
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
//-------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { getUsers, searchUsers, followUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleSearchClick = async () => {
    if (query.trim() === "") {
      loadUsers();
    } else {
      const results = await searchUsers(query);
      setUsers(results);
    }
  };

  const handleFollow = async (id) => {
    await followUser(id);
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <h2 className="text-2xl font-bold text-black mb-4">
        Explore Users
      </h2>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchClick();
          }}
          placeholder="Search users..."
          className="flex-1 p-3 border rounded-lg focus:outline-none"
        />

        <button
          onClick={handleSearchClick}
          className="bg-lightpink px-6 rounded-lg
                     hover:bg-pink-400 transition
                     text-black font-semibold"
        >
          Search
        </button>
      </div>

      {/* Users List */}
      {users.length === 0 && (
        <p className="text-black">No users found.</p>
      )}

      {users.map((u) => (
        <div
          key={u.id}
          className="bg-white p-4 rounded-lg shadow mb-3
                     flex justify-between items-center
                     hover:scale-105 transition"
        >
          <div
            className="cursor-pointer"
            onClick={() => navigate(`/profile/${u.id}`)}
          >
            <p className="font-semibold text-black">
              {u.email}
            </p>
            {u.followers !== undefined && (
              <p className="text-sm text-gray-600">
                Followers: {u.followers}
              </p>
            )}
          </div>

          <button
            onClick={() => handleFollow(u.id)}
            className="bg-lightpink px-4 py-2 rounded-lg
                       hover:bg-pink-400 transition text-black"
          >
            {u.is_following ? "Unfollow" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
}
