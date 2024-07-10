import { DataDisplayTypeAndDescription } from "@/app/charts/filters";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface DisplayTypesDialogProps {
  displayTypes: DataDisplayTypeAndDescription[];
}

export function DisplayTypesDialog(props: DisplayTypesDialogProps) {
  const lineChartDisplayTypes = props.displayTypes.filter(
    ({ chartType }) => chartType === "line",
  );
  const barChartDisplayTypes = props.displayTypes.filter(
    ({ chartType }) => chartType === "bar",
  );
  const pieChartDisplayTypes = props.displayTypes.filter(
    ({ chartType }) => chartType === "pie",
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Display Types</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Display Types</DialogTitle>
          <DialogDescription>
            All the ways the LLM can display data in the UI.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Bar Charts section */}
            <h3 className="text-xl font-semibold">Bar Charts</h3>
            {barChartDisplayTypes.map(({ title, description }, idx) => (
              <div
                key={`bar-${idx}`}
                className="w-full bg-gray-50 rounded-lg p-4 mb-4 shadow-sm"
              >
                <p className="font-semibold mb-2">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
            {/* Pie Charts section */}
            <h3 className="text-xl font-semibold mt-4">Pie Charts</h3>
            {pieChartDisplayTypes.map(({ title, description }, idx) => (
              <div
                key={`bar-${idx}`}
                className="w-full bg-gray-50 rounded-lg p-4 mb-4 shadow-sm"
              >
                <p className="font-semibold mb-2">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
            {/* Line Charts section */}
            <h3 className="text-xl font-semibold mt-4">Line Charts</h3>
            {lineChartDisplayTypes.map(({ title, description }, idx) => (
              <div
                key={`bar-${idx}`}
                className="w-full bg-gray-50 rounded-lg p-4 mb-4 shadow-sm"
              >
                <p className="font-semibold mb-2">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
