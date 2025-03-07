import { ArtworkFormType, artworkSchema } from "@/app/api/artworks/validations";
import TextareaField from "@/components/inputs/TextareaField";
import TextField from "@/components/inputs/TextField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMaterialOptions } from "../../materials/hooks";
import { useSubjectOptions } from "../../subjects/hooks";
import MultipleSelector from "@/components/inputs/MultiSelectField";
import SelectField from "@/components/inputs/SelectField";
import DatePickerField from "@/components/inputs/DatePickerField";
import SwitchField from "@/components/inputs/SwitchField";
import FileUploadField from "@/components/inputs/FileUploadField";
import Image from "next/image";
import { UploadResult } from "@/app/api/types";

type ArtworkFormProps = {
  isLoading?: boolean;
  initialValues?: ArtworkFormType;
  onSubmit: (data: ArtworkFormType) => void;
};

const ArtworkForm: React.FC<ArtworkFormProps> = ({
  isLoading = false,
  initialValues,
  onSubmit,
}) => {
  const router = useRouter();
  const { options: materialOptions } = useMaterialOptions();

  const { options: subjectOptions } = useSubjectOptions();

  const form = useForm<ArtworkFormType>({
    defaultValues: {
      title: "Artwork02",
      materialIds: [],
      images: [],
      description: "",
      publish: true,
      showOnCarousel: false,
      width: 20,
      height: 20,
      depth: 20,
      completedAt: new Date(),
    },
    resolver: yupResolver(artworkSchema),
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const handleSubmit = async (data: ArtworkFormType) => {
    onSubmit(data);
  };

  const handleImageUpload = (file: UploadResult) => {
    const images = form.getValues("images") ?? [];
    form.setValue("images", [...images, file], { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <TextField label="Title" name="title" placeholder="Ex: Artwork01" />

        <MultipleSelector
          label="Materials"
          name="materialIds"
          options={materialOptions}
        />

        <SelectField
          label="Subject"
          name="subjectId"
          options={subjectOptions}
        />

        <div className="flex flex-col md:flex-row gap-4 w-full md:justify-between">
          <TextField label="Width" name="width" placeholder="Ex: 20" />
          <TextField label="Height" name="height" placeholder="Ex: 20" />
          <TextField label="Depth" name="depth" placeholder="Ex: 20" />
        </div>

        <DatePickerField label="Completed At" name="completedAt" />

        <TextareaField
          label="Description"
          name="description"
          rows={5}
          placeholder="Ex: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde, et."
        />

        <SwitchField
          label="Publish"
          name="publish"
          description="Make this artwork visible to the public."
        />

        <SwitchField
          label="Show on Carousel"
          name="showOnCarousel"
          description="Show this artwork on the homepage carousel."
        />

        <FileUploadField
          label="Images"
          name="images"
          onUploadSuccess={handleImageUpload}
        />

        {form.watch("images").length > 0 && (
          <div className="flex flex-wrap gap-4">
            {form.watch("images").map((image, index) => (
              <Image
                objectFit="cover"
                key={index}
                src={image.url}
                alt={`Artwork image ${index + 1}`}
                className="w-32 h-32 object-cover"
                height={100}
                width={100}
              />
            ))}
          </div>
        )}

        <div className="flex flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/artworks")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isLoading}
            disabled={!isDirty || !isValid}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArtworkForm;
