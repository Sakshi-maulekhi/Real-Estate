import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

/* =======================
   Helper: ObjectId check
   (NO mongoose)
======================= */
const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

/* =======================
   GET ALL POSTS (PUBLIC)
======================= */
export const getPosts = async (req, res) => {
  try {
    const {
      city,
      type,
      property,
      bedroom,
      minPrice,
      maxPrice,
    } = req.query;

    const filters = {};

    if (city && city.trim() !== "") {
      filters.city = city;
    }

    if (type && type.trim() !== "") {
      filters.type = type;
    }

    if (property && property.trim() !== "") {
      filters.property = property;
    }

    if (bedroom && bedroom !== "") {
      filters.bedroom = Number(bedroom);
    }

    // 🚨 IMPORTANT: ignore 0–0 price range
    if (!(Number(minPrice) === 0 && Number(maxPrice) === 0)) {
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.gte = Number(minPrice);
        if (maxPrice) filters.price.lte = Number(maxPrice);
      }
    }

    const posts = await prisma.post.findMany({
      where: filters,
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get posts" });
  }
};


/* =======================
   GET SINGLE POST
======================= */
export const getPost = async (req, res) => {
  const id = req.params.id;

  // ✅ prevent "save" or any invalid id
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    // user not logged in
    if (!token) {
      return res.status(200).json({ ...post, isSaved: false });
    }

    // user logged in → check saved status
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
      if (err) {
        return res.status(200).json({ ...post, isSaved: false });
      }

      const saved = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: payload.id,
            postId: id,
          },
        },
      });

      return res.status(200).json({ ...post, isSaved: !!saved });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};

/* =======================
   ADD POST (PROTECTED)
======================= */
export const addPost = async (req, res) => {
  try {
    const { postData, postDetail } = req.body;

    if (!postData?.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newPost = await prisma.post.create({
      data: {
        title: postData.title,
        price: Number(postData.price),
        images: postData.images,
        address: postData.address,
        city: postData.city,
        bedroom: Number(postData.bedroom),
        bathroom: Number(postData.bathroom),
        latitude: postData.latitude,
        longitude: postData.longitude,
        type: postData.type,
        property: postData.property,
        userId: req.userId,

        postDetail: {
          create: {
            desc: postDetail.desc,
            utilities: postDetail.utilities,
            pet: postDetail.pet,
            income: postDetail.income,
            size: Number(postDetail.size),
            school: Number(postDetail.school),
            bus: Number(postDetail.bus),
            restaurant: Number(postDetail.restaurant),
          },
        },
      },
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   UPDATE POST (PROTECTED)
======================= */
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    const { postData, postDetail } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: postData.title,
        price: Number(postData.price),
        images: postData.images,
        address: postData.address,
        city: postData.city,
        bedroom: Number(postData.bedroom),
        bathroom: Number(postData.bathroom),
        latitude: postData.latitude,
        longitude: postData.longitude,
        type: postData.type,
        property: postData.property,

        postDetail: {
          update: {
            desc: postDetail.desc,
            utilities: postDetail.utilities,
            pet: postDetail.pet,
            income: postDetail.income,
            size: Number(postDetail.size),
            school: Number(postDetail.school),
            bus: Number(postDetail.bus),
            restaurant: Number(postDetail.restaurant),
          },
        },
      },
    });

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    return res.status(500).json({ message: "Failed to update post" });
  }
};

/* =======================
   DELETE POST (PROTECTED)
======================= */
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};

/* =======================
   SAVE / UNSAVE POST
======================= */
export const savePost = async (req, res) => {
  const userId = req.userId;
  const { postId } = req.body;

  if (!isValidObjectId(postId)) {
    return res.status(400).json({ message: "Invalid post id" });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.deleteMany({
  where: {
    userId: userId,
    postId: postId,
  },
});

    } else {
      await prisma.savedPost.create({
        data: {
          userId,
          postId,
        },
      });
      return res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to save post" });
  }
};
export const getSavedPosts = async (req, res) => {
  const userId = req.userId;

  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      include: {
        post: true,
      },
    });

    const posts = savedPosts.map((item) => item.post);

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get saved posts" });
  }
};
export const getProfilePosts = async (req, res) => {
  const userId = req.userId;

  try {
    // 1️⃣ Posts created by the user
    const userPosts = await prisma.post.findMany({
      where: { userId },
    });

    // 2️⃣ Posts saved by the user
    const saved = await prisma.savedPost.findMany({
      where: { userId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);

    return res.status(200).json({
      userPosts,
      savedPosts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get profile posts" });
  }
};


