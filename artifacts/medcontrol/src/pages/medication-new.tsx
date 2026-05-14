import { useCreateMedication, getListMedicationsQueryKey, getGetMedicationSummaryQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Clock, Info, Pill } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  scheduledTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function MedicationNew() {
  const [, setLocation] = useLocation();
  const createMedication = useCreateMedication();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      scheduledTime: "08:00",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createMedication.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMedicationSummaryQueryKey() });
          toast({
            title: "Medication added",
            description: `${data.name} has been added to your schedule.`,
          });
          setLocation("/");
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add medication. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
            <Pill className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Medication</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Set up a new routine. We'll help you remember when it's time.
          </p>
        </div>

        <Card className="border-border/50 shadow-sm overflow-hidden rounded-3xl">
          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Medication Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Aspirin, Vitamin D" 
                          className="h-14 text-lg px-4 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Scheduled Time
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          className="h-14 text-lg px-4 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary w-full sm:w-48"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Info className="w-4 h-4 text-muted-foreground" />
                        Notes <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Take with food, empty stomach, etc." 
                          className="resize-none min-h-[100px] text-base p-4 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 h-14 text-base rounded-xl"
                    onClick={() => setLocation("/")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-14 text-base rounded-xl shadow-sm hover:shadow-md"
                    disabled={createMedication.isPending}
                  >
                    {createMedication.isPending ? "Saving..." : "Save Medication"}
                  </Button>
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
