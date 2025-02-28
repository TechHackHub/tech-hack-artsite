"use client";

import React, { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputProps } from "@/components/inputs/types";

type Props = InputProps & InputHTMLAttributes<HTMLInputElement>;

const TextField: React.FC<Props> = ({ label, name, description, ...props }) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1 w-full">
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Input {...props} {...field} />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextField;
