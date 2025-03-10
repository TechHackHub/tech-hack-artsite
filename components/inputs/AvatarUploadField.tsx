import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputProps } from "@/components/inputs/types";
import { Loader2, Upload, User } from "lucide-react";
import { uploadFile } from "@/app/libs/actions";

type Props = InputProps;

const AvatarUploadField: React.FC<Props> = ({ name }) => {
  const form = useFormContext();
  const imageUrl = form.watch(name) ?? "";
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);

      const file = e.target.files?.[0];

      if (file) {
        const result = await uploadFile(file);
        form.setValue(name, result?.secure_url, { shouldDirty: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-fit mx-auto">
      <Avatar className="w-[200px] h-[200px] ">
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback>
          <User size={64} />
        </AvatarFallback>
      </Avatar>

      <label
        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg
                cursor-pointer hover:bg-primary/90 transition-all duration-300"
      >
        {isLoading ? (
          <Loader2 className="w-8 h-8 p-1 animate-spin" />
        ) : (
          <Upload className="w-8 h-8 p-1" />
        )}

        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default AvatarUploadField;
