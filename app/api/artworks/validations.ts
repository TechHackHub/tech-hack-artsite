import * as yup from "yup";


export const artworkSchema = yup.object({
  title: yup.string().required("title is required"),
  materialIds: yup.array()
    .of(yup.string())
    .min(1, "At least one material is required"),
  subjectId: yup.string().nullable(),
  images: yup.array().of(yup.object({
    url: yup.string().required(),
    publicId: yup.string().required(),
    width: yup.number().notRequired(),
    height: yup.number().notRequired(),
    format: yup.string().notRequired(),
    originalFilename: yup.string().notRequired(),
  })).min(1).default([]),
  width: yup.number().typeError("width must be a number").required("width is required"),
  height: yup.number().typeError("height must be a number").required("height is required"),
  depth: yup.number().typeError("depth must be a number").required("depth is required"),
  description: yup.string().default(""),
  completedAt: yup.date().required("completedAt is required"),
  publish: yup.boolean().default(false),
  showOnCarousel: yup.boolean().default(false),
});

export type ArtworkFormType = yup.InferType<typeof artworkSchema>;

export const validateArtworkBodyAsync = async (body: unknown) => {
  await artworkSchema.validate(body, { abortEarly: false });
}