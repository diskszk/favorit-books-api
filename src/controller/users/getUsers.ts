import { getConnection } from 'typeorm';
import { User } from '../../entity';

export const getUsers = async (): Promise<User[]> => {
  try {
    const connection = getConnection();
    const users = connection.manager.find(User);

    if (!users) {
      return [];
    }
    return users;
  } catch (err) {
    throw new Error(err);
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  const repo = getConnection().getRepository(User);
  const user = await repo.findOne({ id: userId });

  if (!user) {
    return null;
  }
  return user;
};
