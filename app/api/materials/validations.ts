import * as yup from "yup";


const subjectSchema = yup.object({
  name: yup.string().required("name is required"),
});

export const validateMaterialBodyAsync = async (body: unknown) => {
  await subjectSchema.validate(body, { abortEarly: false });
}