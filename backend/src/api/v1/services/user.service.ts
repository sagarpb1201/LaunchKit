import prisma from '../../../config';

export const findAllUsers = () => {
  try{
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }catch(error){
    throw error;
  }
};
