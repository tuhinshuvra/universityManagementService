import { Course } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { ICourseCreateData } from "./course.interface";


const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async (transactionClient) => {
    const result = await transactionClient.course.create({
      data: courseData
    })

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create course")
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      for (let index = 0; index < preRequisiteCourses.length; index++) {
        const createPrerequisite = await transactionClient.courseToPrerequisite.create({
          data: {
            courseId: result.id,
            preRequisiteId: preRequisiteCourses[index].courseId
          }
        })
        console.log(createPrerequisite);
      }
    }
    return result
  })

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id
      },
      include: {
        preRequiste: {
          include: {
            preRequisite: true
          }
        },
        preRequisiteFor: {
          include: {
            course: true
          }
        }
      }
    })
    return responseData;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create course")
}

// const getDataById = async (id: string): Promise<Course | null> => {
//   const result = await prisma.academicSemester.findUnique({
//     where: {
//       id
//     }
//   })
//   return result;
// }

const updateOneInDB = async (
  id: string,
  payload: ICourseCreateData
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;
  const result = await prisma.course.update({
    where: {
      id
    },
    data: courseData
  })
  return result

}

const deleteByIdFromDB = async () => {

}


export const CourseService = {
  insertIntoDB,
  // getDataById,
  updateOneInDB,
  deleteByIdFromDB
}




