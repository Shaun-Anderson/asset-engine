import { Command } from "cmdk";
import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed top-1/2 max-w-[640px] w-full transition-all ease-in-out bg-zinc-900 p-4"
    >
      {/* <DialogPrimitive.Portal> */}
      {/* <DialogPrimitive.Overlay className=" inset-0 fixed bg-black opacity-80 z-0" /> */}
      {/* <DialogPrimitive.Content className="fixed top-1/2 left-1/2 bg-white"> */}
      <Command.Input autoFocus className="z-1" />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Pages">
          <Command.Item className="focus:bg-rose-300 cursor-pointer">
            a
          </Command.Item>
          <Command.Item>b</Command.Item>
          <Command.Separator />
          <Command.Item>c</Command.Item>
        </Command.Group>

        <Command.Item>Apple</Command.Item>
      </Command.List>
      {/* </DialogPrimitive.Content> */}
      {/* </DialogPrimitive.Portal> */}
    </Command.Dialog>
  );
};
