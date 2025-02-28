import React, { TextareaHTMLAttributes } from "react";
import { InputProps } from "@/components/inputs/types";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type Props = InputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextareaField: React.FC<Props> = ({
  label,
  name,
  description,
  ...props
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1 w-full">
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Textarea {...props} {...field} />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaField;
