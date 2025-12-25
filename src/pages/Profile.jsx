// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getUserProfile } from "../services/api";
// import { followUser } from "../services/api";


// export default function Profile() {
//   const { userId } = useParams();
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     getUserProfile(userId).then(setProfile);
//   }, [userId]);

//   if (!profile) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-lightpink">
//       <div className="bg-white p-6 shadow">
//         <h2 className="text-2xl font-bold text-black">
//           {profile.email}
//         </h2>
//         <p className="text-black mt-1">
//           Tweets: {profile.tweets_count}
//         </p>
//       </div>

//       <div className="max-w-xl mx-auto mt-6 space-y-4">
//         {profile.tweets.map((t) => (
//           <div
//             key={t.id}
//             className="bg-white p-4 rounded-xl shadow
//                        hover:scale-[1.02] transition"
//           >
//             <p className="text-black">{t.content}</p>
//             <p className="text-xs text-gray-500 mt-2">
//               {new Date(t.created_at).toLocaleString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//-------------------------------------------------------------
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser } from "../services/api";

function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    const data = await getUserProfile(userId);
    setProfile(data);
    setLoading(false);
  };

  const handleFollow = async () => {
    await followUser(userId);
    fetchProfile(); // refresh profile
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-black text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-black text-lg">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white p-6 rounded-2xl shadow-md
                        flex justify-between items-center
                        transition-transform hover:scale-[1.01]">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {profile.email}
            </h2>
            <p className="text-sm text-black mt-1">
              Tweets: {profile.tweets_count}
            </p>
            <p className="text-sm text-black">
              Followers: {profile.followers} · Following: {profile.following}
            </p>
          </div>

          {!profile.is_self && (
            <button
              onClick={handleFollow}
              className={`px-5 py-2 rounded-xl font-semibold
                          transition-all duration-200
                          hover:scale-105
                          ${
                            profile.is_following
                              ? "bg-gray-300 hover:bg-gray-400"
                              : "bg-pink-300 hover:bg-pink-400"
                          }
                          text-black`}
            >
              {profile.is_following ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* Tweets Section */}
        <div className="mt-6 space-y-4">
          {profile.tweets.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-black">No tweets yet</p>
            </div>
          ) : (
            profile.tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="bg-white p-4 rounded-xl shadow
                           transition hover:shadow-lg"
              >
                <p className="text-black">{tweet.content}</p>
                <div className="flex justify-between items-center mt-3 text-sm text-black">
                  <span>❤️ {tweet.likes}</span>
                  <span>
                    {new Date(tweet.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
