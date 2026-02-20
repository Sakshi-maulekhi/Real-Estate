import express from "express";
import {
  savePost,
  getSavedPosts,
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* ---------- STATIC ROUTES FIRST ---------- */

// save / unsave
router.post("/save", verifyToken, savePost);
router.get("/saved", verifyToken, getSavedPosts); 

// get all posts
router.get("/", getPosts);

// create post
router.post("/", verifyToken, addPost);

/* ---------- DYNAMIC ROUTES LAST ---------- */

// update, delete, get by id
router.get("/:id", getPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
