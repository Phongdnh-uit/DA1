import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import useUpdatePermissionVM from "./UpdatePermission.vm";
import type { PermissionResponseDTO } from "@/types";

interface CreatePermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: PermissionResponseDTO;
}

export default function UpdatePermissionModal({
  open,
  onOpenChange,
  data,
}: CreatePermissionModalProps) {
  const { form, onSubmit } = useUpdatePermissionVM(data);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:!max-w-lg">
        <DialogTitle>Update permission</DialogTitle>
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel>Name</FormLabel>
                <FormControl className="col-span-3">
                  <Input placeholder="Input permission name" {...field} />
                </FormControl>
                <FormDescription className="col-span-4" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resource"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel>Resource</FormLabel>
                <FormControl className="col-span-3">
                  <Input placeholder="Input resource name" {...field} />
                </FormControl>
                <FormDescription className="col-span-4" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel>Action</FormLabel>
                <FormControl className="col-span-3">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="READ">View</SelectItem>
                      <SelectItem value="CREATE">Create</SelectItem>
                      <SelectItem value="UPDATE">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="col-span-4" />
              </FormItem>
            )}
          />
        </Form>
        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <RippleButton variant={"destructive"}>Thoát</RippleButton>
            <RippleButton
              onClick={() => {
                form.handleSubmit(onSubmit)();
                onOpenChange(false);
              }}
            >
              Thêm
            </RippleButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
