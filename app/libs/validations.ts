import * as yup from 'yup';

const idParamSchema = yup.object({
  id: yup.string().default('').required('id is required'),
});

export const validateIdParamExistsAsync = async (params: unknown) => {
  await idParamSchema.validate(params, { abortEarly: false });
};
