import { User, UserModel } from "../modules/user/schema/user.schema";

export const verifyUser = async (uniquedId: string): Promise<User> | null => {
  // Verify the acces token
  try {
    const data = await UserModel.findOne({ _id: uniquedId });
    if (data) {
      return data;
    }
    return null;
  } catch (err) {
    // console.log(err);
    return null;
  }
};
