import prisma from "../lib/prisma.js";

/* =========================
   GET ALL CHATS
========================= */
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  console.log("=== getChats DEBUG ===");
  console.log("tokenUserId:", tokenUserId, "Type:", typeof tokenUserId);

  if (!tokenUserId) {
    console.log("ERROR: No tokenUserId found");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // 1️⃣ Get chats of logged-in user
    console.log("Fetching chats for user:", tokenUserId);
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Total chats found:", chats.length);

    // Validate and log chat data
    const validChats = [];
    const corruptedChats = [];

    chats.forEach((chat, index) => {
      console.log(`\n--- Chat ${index + 1} ---`);
      console.log("Chat ID:", chat.id);
      console.log("userIDs:", JSON.stringify(chat.userIDs));
      console.log("userIDs type:", Array.isArray(chat.userIDs) ? "array" : typeof chat.userIDs);

      // Guard: Check if userIDs is valid array
      if (!Array.isArray(chat.userIDs)) {
        console.error(`⚠️ CORRUPTED: Chat ${chat.id} has invalid userIDs (not an array):`, chat.userIDs);
        corruptedChats.push({ id: chat.id, reason: "userIDs is not an array", userIDs: chat.userIDs });
        return;
      }

      // Guard: Check if all userIDs are valid ObjectIDs
      const invalidIds = chat.userIDs.filter((id) => !String(id).match(/^[0-9a-fA-F]{24}$/));
      if (invalidIds.length > 0) {
        console.error(`⚠️ CORRUPTED: Chat ${chat.id} has invalid ObjectIDs:`, invalidIds);
        corruptedChats.push({ id: chat.id, reason: "Invalid ObjectIDs", invalidIds });
        return;
      }

      // Guard: Check if userIDs contains tokenUserId
      if (!chat.userIDs.includes(tokenUserId)) {
        console.error(`⚠️ CORRUPTED: Chat ${chat.id} doesn't contain tokenUserId despite being queried for it`);
        corruptedChats.push({ id: chat.id, reason: "userIDs doesn't contain tokenUserId" });
        return;
      }

      validChats.push(chat);
    });

    console.log("\nValid chats:", validChats.length);
    console.log("Corrupted chats:", corruptedChats.length);
    if (corruptedChats.length > 0) {
      console.error("⚠️ CORRUPTED CHAT DETAILS:", JSON.stringify(corruptedChats, null, 2));
    }

    // 2️⃣ Collect receiver IDs (avoid N+1 queries) - only from valid chats
    const receiverIds = new Set();

    validChats.forEach((chat) => {
      chat.userIDs.forEach((id) => {
        if (id !== tokenUserId) receiverIds.add(id);
      });
    });

    console.log("Receiver IDs to fetch:", Array.from(receiverIds));

    // 3️⃣ Fetch receivers in ONE query
    const receivers = await prisma.user.findMany({
      where: {
        id: { in: [...receiverIds] },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    console.log("Receivers found:", receivers.length);

    const receiverMap = {};
    receivers.forEach((u) => (receiverMap[u.id] = u));

    // 4️⃣ Attach receiver to each chat
    const chatsWithReceivers = validChats.map((chat) => {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      return {
        ...chat,
        receiver: receiverId ? receiverMap[receiverId] || null : null,
      };
    });

    console.log("=== getChats SUCCESS - Returning", chatsWithReceivers.length, "chats ===\n");

    // If there are corrupted chats, log them separately for admin review but still return valid ones
    if (corruptedChats.length > 0) {
      console.warn(`⚠️ WARNING: Skipped ${corruptedChats.length} corrupted chats. Admin should review database.`);
    }

    // Always return array (empty if no valid chats)
    res.status(200).json(chatsWithReceivers);
  } catch (err) {
    console.error("=== getChats ERROR ===");
    console.error("Full error:", err);
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);

    // Return empty array instead of error on failure, so frontend doesn't break
    console.warn("⚠️ Returning empty chats array due to error");
    res.status(200).json([]);
  }
};

/* =========================
   GET SINGLE CHAT
========================= */
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  console.log("=== getChat DEBUG ===");
  console.log("tokenUserId:", tokenUserId);
  console.log("chatId:", chatId);

  if (!tokenUserId) {
    console.log("ERROR: No tokenUserId");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Validate chatId format
    if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("ERROR: Invalid chatId format:", chatId);
      return res.status(400).json({ message: "Invalid chat ID format!" });
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      console.log("Chat not found for chatId:", chatId, "and tokenUserId:", tokenUserId);
      return res.status(404).json({ message: "Chat not found" });
    }

    console.log("Chat found - userIDs:", chat.userIDs);

    // Validate chat data
    if (!Array.isArray(chat.userIDs)) {
      console.error("⚠️ CORRUPTED: Chat has invalid userIDs (not array):", chat.userIDs);
      return res.status(500).json({ message: "Chat data is corrupted" });
    }

    // Mark chat as seen
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    console.log("=== getChat SUCCESS ===\n");
    res.status(200).json(chat);
  } catch (err) {
    console.error("=== getChat ERROR ===");
    console.error("Full error:", err);
    console.error("Error code:", err.code);
    res.status(500).json({ message: "Failed to get chat", error: err.message });
  }
};

/* =========================
   ADD NEW CHAT
========================= */
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  console.log("=== addChat DEBUG ===");
  console.log("tokenUserId:", tokenUserId);
  console.log("receiverId:", receiverId);

  if (!tokenUserId || !receiverId) {
    console.log("ERROR: Missing tokenUserId or receiverId");
    return res.status(400).json({ message: "Invalid data" });
  }

  // Validate ObjectID formats
  if (!tokenUserId.match(/^[0-9a-fA-F]{24}$/)) {
    console.log("ERROR: Invalid tokenUserId format");
    return res.status(400).json({ message: "Invalid user ID format!" });
  }

  if (!receiverId.match(/^[0-9a-fA-F]{24}$/)) {
    console.log("ERROR: Invalid receiverId format");
    return res.status(400).json({ message: "Invalid receiver ID format!" });
  }

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
      },
    });

    console.log("Chat created - ID:", newChat.id, "userIDs:", newChat.userIDs);
    console.log("=== addChat SUCCESS ===\n");
    res.status(201).json(newChat);
  } catch (err) {
    console.error("=== addChat ERROR ===");
    console.error("Full error:", err);
    res.status(500).json({ message: "Failed to create chat", error: err.message });
  }
};


export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  console.log("=== readChat DEBUG ===");
  console.log("tokenUserId:", tokenUserId);
  console.log("chatId:", chatId);

  if (!tokenUserId) {
    console.log("ERROR: No tokenUserId");
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Validate chatId format
  if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
    console.log("ERROR: Invalid chatId format");
    return res.status(400).json({ message: "Invalid chat ID format!" });
  }

  try {
    const result = await prisma.chat.updateMany({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });

    console.log("Chat marked as read - count:", result.count);
    console.log("=== readChat SUCCESS ===\n");
    res.status(200).json({ message: "Chat marked as read" });
  } catch (err) {
    console.error("=== readChat ERROR ===");
    console.error("Full error:", err);
    res.status(500).json({ message: "Failed to mark chat as read", error: err.message });
  }
};
