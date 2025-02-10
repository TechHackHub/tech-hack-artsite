import React, { useEffect } from "react";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Form } from "../ui/form";
import TextField from "../inputs/TextField";
import { Material } from "@prisma/client";
import { Button } from "../ui/button";

const schema = yup.object().shape({
  name: yup.string().default("").required("Name is required"),
});

type MaterialFormType = yup.InferType<typeof schema>;

type MaterialFormProps = {
  loading?: boolean;

  initialValues?: Pick<Material, "name"> | null;
  onCancel?: () => void;
  onSubmit: (values: Pick<Material, "name">) => Promise<void>;
};

const MaterialForm: React.FC<MaterialFormProps> = ({
  loading,
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const form = useForm<MaterialFormType>({
    defaultValues: { name: "" },
    resolver: yupResolver(schema),
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [form, initialValues]);

  const handleSubmit = async (values: MaterialFormType) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <TextField label="Name" name="name" placeholder="Placeholder" />

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button type="button" variant="destructive" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={loading}
            disabled={loading || !isDirty || !isValid}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MaterialForm;
