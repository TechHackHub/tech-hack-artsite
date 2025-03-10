import React, { SelectHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputProps } from "./types";
import MultiSelect from "../ui/MultiSelect";

type MultiSelectFieldProps = InputProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    name: string;
    loading?: boolean;
    placeholder?: string;
    options: { label: string; value: string }[];
  };

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  name,
  placeholder = "Select an option",
  options,
  description,
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
            <MultiSelect
              {...field}
              onValueChange={field.onChange}
              variant="inverted"
              options={options}
              placeholder={placeholder}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MultiSelectField;
