import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, } from "@/components/ui/accordion";

export function Financials({ data }: { data: any }) {
  const renderFinancialTable = (financialObject: JSON) => {
    return (
      <Table>
        <TableBody>
          {Object.entries(financialObject).sort((a, b) => a[1].order - b[1].order).map(([key, value]) => (
            <TableRow key={key}>
              <TableHead>{value.label}</TableHead>
              <TableCell>{value.value.toLocaleString()} {value.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };


  return (
    <div className="py-2">
      {/* <Dialog>
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
      </Dialog> */}

      {data.map((entry, index) => (
        <div key={index}>
          <CardHeader>{entry.company_name} - {entry.fiscal_period}</CardHeader>
          <CardContent>
            <strong>Period:</strong> {entry.start_date} to {entry.end_date}
            <br />
            <strong>CIaK:</strong> {entry.cik}
          </CardContent>
          <Accordion className="AccordionRoot" type="single" collapsible>
            <AccordionItem className="AccordionItem py-2" value="item-1">
              <Card>
                <AccordionTrigger className="px-4">
                  <CardHeader>Balance Sheet</CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    {renderFinancialTable(entry.financials.balance_sheet)}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem className="AccordionItem py-2" value="item-2">
              <Card>
                <AccordionTrigger className="px-4">
                  <CardHeader>Income Statement</CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    {renderFinancialTable(entry.financials.income_statement)}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem className="AccordionItem py-2" value="item-3">
              <Card>
                <AccordionTrigger className="px-4">
                  <CardHeader>Cash Flow Statement</CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    {renderFinancialTable(entry.financials.cash_flow_statement)}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem className="AccordionItem py-2" value="item-4">
              <Card>
                <AccordionTrigger className="px-4">
                  <CardHeader>Comprehensive Income</CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    {renderFinancialTable(entry.financials.comprehensive_income)}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </div>
      ))
      }
    </div >
  );
}
