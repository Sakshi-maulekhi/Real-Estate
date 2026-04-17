import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  try {
    const postPromise = apiRequest("/users/profilePosts");
    const chatPromise = apiRequest("/chats").then(res => {
      console.log("Chat API Response:", res);
      console.log("Chat data type:", typeof res.data);
      console.log("Chat data:", res.data);
      if (!res.data || !Array.isArray(res.data)) {
        console.error("ERROR: Chat response is not an array!", res.data);
        throw new Error("Invalid chat data format");
      }
      return res;
    }).catch(err => {
      console.error("ERROR loading chats:", err);
      throw err;
    });
    
    return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
    });
  } catch (err) {
    console.error("Profile loader error:", err);
    throw err;
  }
};
