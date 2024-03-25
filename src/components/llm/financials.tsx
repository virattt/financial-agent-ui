import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function Financials({ data }: { data: any }) {
  return (
    <div className="py-4">
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">View Financials</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Financials Data</DialogTitle>
            <DialogDescription className="text-sm">
              <ScrollArea className="max-h-[400px]">
                {JSON.stringify(data, null, 2)}
              </ScrollArea>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
