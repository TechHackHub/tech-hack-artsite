import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { Plus } from "lucide-react";

type CreateButtonProps = ButtonProps;

const CreateButton: React.FC<CreateButtonProps> = (props) => {
  return (
    <Button {...props}>
      <Plus /> Create
    </Button>
  );
};

export default CreateButton;
