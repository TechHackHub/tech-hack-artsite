import React, { useEffect } from "react";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import TextField from "@/components/inputs/TextField";
import { Button } from "@/components/ui/button";

const schema = yup.object().shape({
  name: yup.string().default("").required("Name is required"),
});

type NameFormType = yup.InferType<typeof schema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NameFormProps<TData = NameFormType> = {
  loading?: boolean;

  initialValues?: TData | null;
  onCancel?: () => void;
  onSubmit: (values: TData) => Promise<void>;
};

const NameForm = <TData,>({
  loading,
  initialValues,
  onCancel,
  onSubmit,
}: NameFormProps<TData>) => {
  const form = useForm<NameFormType>({
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

  const handleSubmit = async (values: NameFormType) => {
    await onSubmit(values as TData);
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

export default NameForm;
