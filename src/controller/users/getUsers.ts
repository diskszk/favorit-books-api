import { getConnection } from "typeorm";
import { UserEntity } from "../../entities";

export const getUsers = async (): Promise<UserEntity[] | []> => {
  try {
    const connection = getConnection();
    const users = connection.manager.find(UserEntity);

    if (!users) {
      return [];
    }
    return users;
  } catch (err) {
    throw new Error(err);
  }
};

export const getUser = async (userId: string): Promise<UserEntity | null> => {
  const repo = getConnection().getRepository(UserEntity);
  const user = await repo.findOne({ id: userId });

  if (!user) {
    return null;
  }
  return user;
};
