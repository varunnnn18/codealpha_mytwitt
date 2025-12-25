const API_URL = "http://127.0.0.1:8000/api/users/";

export const signupUser = async (data) => {
  const res = await fetch(API_URL + "signup/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(API_URL + "login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (json.access) {
    localStorage.setItem("token", json.access);
  }

  return json;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + "profile/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const createTweet = async (content) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + "tweet/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  return res.json();
};

export const getTweets = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + "tweets/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const likeTweet = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + `tweet/${id}/like/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const deleteTweet = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + `tweet/${id}/delete/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const addComment = async (tweetId, content) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + `tweet/${tweetId}/comment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  return res.json();
};

export const getComments = async (tweetId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + `tweet/${tweetId}/comments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const getUserProfile = async (userId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + `profile/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const followUser = async (userId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + `follow/${userId}/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + "users/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const searchUsers = async (query) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    API_URL + `users/search/?q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};
