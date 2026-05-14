import { 
  useGetMedication, 
  useUpdateMedication, 
  useDeleteMedication,
  getGetMedicationQueryKey,
  getListMedicationsQueryKey,
  getGetMedicationSummaryQueryKey
} from "@workspace/api-client-react";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Clock, Info, Trash2, Edit3 } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  scheduledTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function MedicationEdit() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);

  const { data: medication, isLoading } = useGetMedication(id, { 
    query: { enabled: !!id, queryKey: getGetMedicationQueryKey(id) } 
  });
  
  const updateMedication = useUpdateMedication();
  const deleteMedication = useDeleteMedication();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      scheduledTime: "08:00",
      notes: "",
    },
  });

  useEffect(() => {
    if (medication) {
      form.reset({
        name: medication.name,
        scheduledTime: medication.scheduledTime,
        notes: medication.notes || "",
      });
    }
  }, [medication, form]);

  const onSubmit = (data: FormValues) => {
    updateMedication.mutate(
      { id, data },
      {
        onSuccess: (updatedData) => {
          queryClient.setQueryData(getGetMedicationQueryKey(id), updatedData);
          queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
          setIsEditing(false);
          toast({
            title: "Updated",
            description: "Medication details saved.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update medication.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleDelete = () => {
    deleteMedication.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMedicationsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMedicationSummaryQueryKey() });
          toast({
            title: "Deleted",
            description: "Medication has been removed.",
          });
          setLocation("/");
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete medication.",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </Layout>
    );
  }

  if (!medication) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Medication not found</h2>
          <Button variant="link" onClick={() => setLocation("/")}>Return home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6 -ml-4">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (isEditing) setIsEditing(false);
              else setLocation("/");
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEditing ? "Back to Details" : "Back to Dashboard"}
          </Button>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete medication?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove {medication.name} from your schedule entirely. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete} 
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <Card className="border-border/50 shadow-sm overflow-hidden rounded-3xl">
          {isEditing ? (
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
                          <Input className="h-14 text-lg px-4 rounded-xl bg-muted/50 border-transparent" {...field} />
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
                        <FormLabel className="text-base font-medium">Scheduled Time</FormLabel>
                        <FormControl>
                          <Input type="time" className="h-14 text-lg px-4 rounded-xl bg-muted/50 border-transparent w-full sm:w-48" {...field} />
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
                        <FormLabel className="text-base font-medium">Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea className="resize-none min-h-[100px] text-base p-4 rounded-xl bg-muted/50 border-transparent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 h-14 rounded-xl"
                      onClick={() => {
                        form.reset();
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-14 rounded-xl shadow-sm"
                      disabled={updateMedication.isPending}
                    >
                      {updateMedication.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          ) : (
            <>
              <div className="bg-primary/5 p-8 text-center border-b border-border/40">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-semibold">
                  {medication.scheduledTime}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{medication.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${medication.taken ? 'bg-secondary/10 text-secondary-foreground' : 'bg-primary/10 text-primary'}`}>
                  {medication.taken ? "Taken Today" : "Pending"}
                </span>
              </div>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" /> Schedule
                  </h3>
                  <p className="text-lg text-foreground">Daily at {medication.scheduledTime}</p>
                </div>
                
                {medication.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4" /> Instructions
                    </h3>
                    <p className="text-lg text-foreground bg-muted/30 p-4 rounded-2xl">{medication.notes}</p>
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
