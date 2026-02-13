const mongoose = require("mongoose");

const spaceSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    spaceId: {
      type: String,
      unique: true,
      required: true,
    },
    spaceName: {
      type: String,
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "editor",
        },
      },
    ],
    activeUsers: [
      {
        name: String,
        email: String,
      },
    ],
    spaceData: [
      {
        fileName: String,
        fileData: String,
        fileLang: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

spaceSchema.methods.publicSpaceData = function () {
  const space = this;

  return {
    spaceId: space.spaceId,
    spaceName: space.spaceName,
    spaceData: space.spaceData,
    createdAt: space.createdAt,
  };
};

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
