import { useEffect, useState } from "react";
import {
  createTweet,
  getTweets,
  likeTweet,
  deleteTweet,
  addComment,
  getComments,
} from "../services/api";
import { logout } from "../utils/auth";
import { useNavigate,Link } from "react-router-dom";


export default function Home() {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  const navigate = useNavigate();

  // 🔁 Load all tweets
  const loadTweets = async () => {
    const data = await getTweets();
    setTweets(data || []);

    // Load comments for each tweet
    if (data) {
      data.forEach((t) => loadComments(t.id));
    }
  };

  // 💬 Load comments for a tweet
  const loadComments = async (tweetId) => {
    const data = await getComments(tweetId);
    setComments((prev) => ({ ...prev, [tweetId]: data }));
  };

  // 🐦 Post tweet
  const handleTweet = async () => {
    if (!tweet.trim()) return;

    await createTweet(tweet);
    setTweet("");
    loadTweets();
  };

  // ❤️ Like tweet
  const handleLike = async (id) => {
    await likeTweet(id);
    loadTweets();
  };

  // 🗑 Delete tweet
  const handleDelete = async (id) => {
    await deleteTweet(id);
    loadTweets();
  };

  // ➕ Add comment
  const handleComment = async (tweetId) => {
    if (!commentText[tweetId]?.trim()) return;

    await addComment(tweetId, commentText[tweetId]);
    setCommentText((prev) => ({ ...prev, [tweetId]: "" }));
    loadComments(tweetId);
  };

  // 🚪 Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    loadTweets();
  }, []);

  return (
    <div className="min-h-screen bg-lightpink">
      {/* 🔝 Top Bar */}
      <div className="bg-white p-4 flex justify-between items-center shadow">
        <span className="text-xl font-bold text-black">MyTwit</span>
        <button
          onClick={handleLogout}
          className="bg-lightpink px-3 py-1 rounded-lg text-black
                     hover:bg-pink-400 transition"
        >
          Logout
        </button>
      </div>

      {/* 📝 Tweet Box */}
      <div className="max-w-xl mx-auto mt-6 bg-white p-4 rounded-xl shadow">
        <textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          maxLength={280}
          placeholder="What's happening?"
          className="w-full p-3 border rounded-lg focus:outline-none"
        />
        <button
          onClick={handleTweet}
          className="mt-3 bg-lightpink text-black px-4 py-2 rounded-lg
                     hover:bg-pink-400 transition"
        >
          Tweet
        </button>
      </div>

      {/* 📰 Tweets Feed */}
      <div className="max-w-xl mx-auto mt-6 space-y-4">
        {tweets.map((t) => (
          <div
            key={t.id}
            className="bg-white p-4 rounded-xl shadow
                       hover:scale-[1.02] transition"
          >
            {/* Tweet content */}
            <Link to={`/profile/${t.user_id}`}className="font-semibold text-black hover:underline">{t.user}</Link>
            <p className="text-black mt-1">{t.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => handleLike(t.id)}
                className={`px-3 py-1 rounded-lg transition
                  ${t.liked ? "bg-pink-400" : "bg-lightpink"}`}
              >
                ❤️ {t.likes}
              </button>

              {t.is_owner && (
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-400 px-3 py-1 rounded-lg text-white
                             hover:bg-red-500 transition"
                >
                  Delete
                </button>
              )}
            </div>

            {/* 💬 Comments */}
            <div className="mt-4">
              <input
                value={commentText[t.id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [t.id]: e.target.value,
                  })
                }
                placeholder="Write a comment..."
                className="w-full p-2 border rounded-lg"
              />

              <button
                onClick={() => handleComment(t.id)}
                className="mt-2 bg-lightpink px-3 py-1 rounded-lg
                           hover:bg-pink-400 transition"
              >
                Comment
              </button>

              <div className="mt-2 space-y-1">
                {(comments[t.id] || []).map((c, i) => (
                  <div
                    key={i}
                    className="text-sm bg-gray-100 p-2 rounded"
                  >
                    <span className="font-semibold">{c.user}</span>:{" "}
                    {c.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Time */}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(t.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------
